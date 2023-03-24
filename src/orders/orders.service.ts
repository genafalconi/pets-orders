import { Inject, Injectable, Logger } from '@nestjs/common';
import { OrderDto } from 'src/dto/order.dto';
import { CollectionReference, DocumentData } from 'firebase-admin/firestore';
import { firebaseFirestore } from 'src/firebase/firebase.app';
import createOrderToSave from 'src/helpers/createOrderToSave';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import formatDataOrder from 'src/helpers/formatDataOrder';


@Injectable()
export class OrdersService {

  private orderCollection: CollectionReference

  constructor(
    @Inject('AUTH_SERVICE')
    private readonly authService: ClientProxy,
    @Inject('CART_SERVICE')
    private readonly cartService: ClientProxy,
    @Inject('PROD_SERVICE')
    private readonly prodService: ClientProxy,
    @Inject('OFFERS_SERVICE')
    private readonly offersService: ClientProxy
  ) {
    this.orderCollection = firebaseFirestore.collection('order')
  }

  async createOrder(orderBody: OrderDto): Promise<DocumentData> {
    const orderToSave = createOrderToSave(orderBody)
    const orderCol = this.orderCollection.doc()
    await orderCol.set(orderToSave);

    const orderSaved = await orderCol.get();
    const orderData = orderSaved.data()
    return { ...orderData, id: orderSaved.id }
  }

  async getOrderData(orderId: string): Promise<DocumentData> {
    const offerDoc = await this.orderCollection.doc(orderId).get()
    if (offerDoc.exists) {
      const cart = await lastValueFrom(this.cartService.send({ cmd: 'order-cart' }, offerDoc.data().cart))
      const address = await lastValueFrom(this.authService.send({ cmd: 'order-address' }, offerDoc.data().address))
      const offer = await lastValueFrom(this.offersService.send({ cmd: 'order-offer' }, offerDoc.data().offer))

      const orderData = formatDataOrder(offerDoc.data().user, cart, address, offer)
      Logger.log(orderData, 'Order data')
      return { ...orderData, id: orderId }
    }
    return {}
  }

}
