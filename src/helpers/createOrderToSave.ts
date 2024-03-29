import { Model, Types } from 'mongoose';
import { OrderDto } from 'src/dto/order.dto';
import { Cart } from 'src/schemas/cart.schema';
import { Order } from 'src/schemas/order.schema';
import { SubproductBought } from 'src/schemas/subprodsBought.schema';

export default function createOrderToSave(
  orderDto: OrderDto,
  cart: Cart,
  orderModel: Model<Order>,
  subprodBought: SubproductBought[]
) {
  const orderToSave = new orderModel({
    user: new Types.ObjectId(orderDto.user),
    cart: new Types.ObjectId(cart._id),
    products: subprodBought.map((elem) => new Types.ObjectId(elem._id)),
    address: new Types.ObjectId(orderDto.address._id),
    offer: new Types.ObjectId(orderDto.offer._id),
    payment_type: orderDto.payment_type,
    ecommerce: true,
  });

  return orderToSave;
}
