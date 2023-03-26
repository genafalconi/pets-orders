import { Inject, Injectable, Logger } from '@nestjs/common';
import { OrderDto } from 'src/dto/order.dto';
import { CollectionReference, DocumentData } from 'firebase-admin/firestore';
import { firebaseFirestore } from 'src/firebase/firebase.app';
import createOrderToSave from 'src/helpers/createOrderToSave';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import formatDataOrder from 'src/helpers/formatDataOrder';
import { CartDto } from 'src/dto/cart.dto';
import { AddressDto } from 'src/dto/address.dto';
import { OfferDto } from 'src/dto/offer.dto';

@Injectable()
export class OrdersService {

  private orderCollection: CollectionReference;
  private cartCollection: CollectionReference;
  private authCollection: CollectionReference;
  private offerCollection: CollectionReference;
  private addressCollection: CollectionReference;

  constructor() {
    this.orderCollection = firebaseFirestore.collection('order');
    this.cartCollection = firebaseFirestore.collection('cart');
    this.authCollection = firebaseFirestore.collection('user');
    this.offerCollection = firebaseFirestore.collection('offer');
    this.addressCollection = firebaseFirestore.collection('address');
  }

  async createOrder(orderBody: OrderDto): Promise<DocumentData> {
    const orderToSave = createOrderToSave(orderBody);
    const orderCol = this.orderCollection.doc();
    await orderCol.set(orderToSave);

    const orderSaved = await orderCol.get();
    const orderData = orderSaved.data();
    return { ...orderData, id: orderSaved.id };
  }

  async getOrderData(orderId: string): Promise<DocumentData> {
    const orderDoc = await this.orderCollection.doc(orderId).get();
    if (orderDoc.exists) {
      const cart = await this.getOrderCart(orderDoc.data().cart)
      const address = await this.getUserAddressById(orderDoc.data().address)
      const offer = await this.getOrderOffer(orderDoc.data().offer)

      const orderData = formatDataOrder(
        orderDoc.data().user,
        cart,
        address,
        offer,
      );
      Logger.log(orderData, 'Order data');
      return { ...orderData, id: orderId };
    }
    return {};
  }

  async getOrderCart(cartId: string): Promise<CartDto> {
    const cartDoc: DocumentData = await this.cartCollection.doc(cartId).get();
    const cartToDisactive = cartDoc.data();
    const cartRef = this.cartCollection.doc(cartDoc.id);

    cartToDisactive.isActive = false;
    await cartRef.update(cartToDisactive);

    const cartUpdated = await cartRef.get();
    return cartUpdated.data() as CartDto;
  }

  async getUserAddressById(addressId: string): Promise<AddressDto> {
    const addressInDb: DocumentData = await this.addressCollection
      .doc(addressId)
      .get();
    return addressInDb.data() as AddressDto;
  }

  async getOrderOffer(orderId: string): Promise<OfferDto> {
    const offerDoc = await this.offerCollection.doc(orderId).get();
    return offerDoc.data() as OfferDto;
  }
}
