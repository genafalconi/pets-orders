import { Injectable, Logger } from '@nestjs/common';
import { OrderDto } from 'src/dto/order.dto';
import createOrderToSave from 'src/helpers/createOrderToSave';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from 'src/schemas/order.schema';
import { Model, Types } from 'mongoose';
import { Cart } from 'src/schemas/cart.schema';
import { Lock } from 'src/schemas/lock.schema';
import { MessageDataDto } from 'src/dto/message.dto';
import { REORDER, StatusOrder } from 'src/dto/types.dto';
import { Cron } from '@nestjs/schedule';
import { offersToDeliver } from 'src/helpers/formatOrderToDeliver';
import requestToWpp from 'src/helpers/requestToWpp';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { firebaseClientAuth } from 'src/firebase/firebase.app';
import { Subproduct } from 'src/schemas/subprod.schema';
import { User } from 'src/schemas/user.schema';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name)
    private readonly orderModel: Model<Order>,
    @InjectModel(Cart.name)
    private readonly cartModel: Model<Cart>,
    @InjectModel(Lock.name)
    private readonly lockModel: Model<Lock>,
    @InjectModel(Subproduct.name)
    private readonly subproductModel: Model<Subproduct>,
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) { }

  async createOrder(orderBody: OrderDto): Promise<any> {
    let cart = orderBody.cart
    if(orderBody.order_type === REORDER || !cart._id) {
      cart = await this.createOrderCart(orderBody.cart);
    }

    await Promise.all([
      this.updateStatusCart(cart._id),
      this.updateSubproductsQuantity(cart),
      this.updateLocks(orderBody.locks),
    ]);
    const orderToSave = createOrderToSave(orderBody, cart, this.orderModel);
    const newOrder = await this.orderModel.create(orderToSave);

    await Promise.all([
      await this.userModel.updateOne(
        { _id: orderBody.user },
        { $push: { orders: newOrder._id } },
      ),
      // await this.sendMessageOrder(newOrder._id, token_id),
    ]);
    Logger.log('Order created', newOrder);
    return newOrder;
  }

  async getOrderData(orderId: string): Promise<Order> {
    const orderDoc = await this.orderModel.findOne({ _id: orderId }).exec();
    return orderDoc;
  }

  async createOrderCart(cart: Cart) {
    return await this.cartModel.create({
      subproducts: cart.subproducts,
      active: cart.active,
      bought: cart.bought,
      total_products: cart.total_products,
      total_price: cart.total_price,
      user: cart.user,
    });
  }

  async updateStatusCart(cartId: string): Promise<void> {
    const cartBought: Cart = await this.cartModel.findOneAndUpdate(
      { _id: new Types.ObjectId(cartId) },
      { $set: { active: false, bought: true } },
      { new: true },
    );
    Logger.log('Bought cart', cartBought);
  }

  async updateLocks(locks: any): Promise<void> {
    const deletedLocks: Array<Lock> = [];
    for (const lock of locks) {
      const lockDelete = await this.lockModel.findOneAndDelete({
        _id: lock._id,
      });
      deletedLocks.push(lockDelete);
    }
    Logger.log('Locks Deleted', JSON.stringify(deletedLocks));
  }

  async sendMessageOrder(orderId: string, token: string) {
    const orderData = await this.orderModel.findOne({ _id: orderId }).exec();
    console.log(orderData);
    const messageData = this.formatMessageData(orderData);
    console.log('messageData', messageData);
    try {
      await requestToWpp('send_order', messageData, token);
    } catch (error) {
      console.log(error);
    }
  }

  formatMessageData(orderData: Order) {
    const products: Array<any> = [];
    const messageData: MessageDataDto = {
      _id: orderData._id,
      products: null,
      phone: orderData.user.phone,
      date: this.dateFormat(orderData.offer.date),
      address: `${orderData.address.street} ${orderData.address.number} ${orderData.address.extra}`,
      total_cart: orderData.cart.total_price,
      payment_type: orderData.payment_type,
    };

    for (const subprod of orderData?.cart?.subproducts) {
      const prod = {
        product: `${subprod.subproduct.product.name} ${subprod.subproduct.size}kg`,
        quantity: subprod.quantity,
      };
      products.push(prod);
    }

    messageData.products = products;

    return messageData;
  }

  dateFormat(offer_date: Date) {
    const date = new Date(offer_date);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const formattedDate = `${day < 10 ? '0' : ''}${day}/${month < 10 ? '0' : ''
      }${month}`;

    return formattedDate;
  }

  async updateDeliverOrder(orderId: string) {
    await this.orderModel.updateOne(
      { _id: orderId },
      { $set: { status: StatusOrder.DELIVERED } },
    );
  }

  async updateCancelOrder(orderId: string) {
    await this.orderModel.updateOne(
      { _id: orderId },
      { $set: { status: StatusOrder.CANCELLED } },
    );
  }

  async updateSubproductsQuantity(cart: Cart) {
    for (const subprod of cart.subproducts) {
      const currentSubprod = await this.subproductModel.findById(
        subprod.subproduct._id,
      );
      const newStock = currentSubprod.stock - subprod.quantity;
      await this.subproductModel.findByIdAndUpdate(
        subprod.subproduct._id,
        { $set: { stock: newStock } },
        { new: true },
      );
    }
  }

  @Cron('0 0 12 * * MON,WED,FRI')
  async dayOrdersToDeliver() {
    const token = await this.getToken();
    const today = new Date(new Date().setHours(-3, 0, 0, 0));
    const orderDay = await this.orderModel
      .find({ status: StatusOrder.CONFIRMED })
      .populate({
        path: 'offer',
        match: {
          date: today,
        },
      });
    const offersMsg = offersToDeliver(orderDay);
    try {
      await requestToWpp('coordination', offersMsg, token);
    } catch (error) {
      console.log(error);
    }
  }

  async getToken() {
    const email = process.env.EMAIL;
    const password = process.env.PASSWORD;
    try {
      const userCredential = await signInWithEmailAndPassword(
        firebaseClientAuth,
        email,
        password,
      );
      // Get the ID token for the signed-in user
      const idToken = await userCredential.user.getIdToken();

      return idToken;
    } catch (error) {
      console.error(error);
      return error;
    }
  }
}
