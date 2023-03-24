import { DocumentData } from "firebase-admin/firestore";

export default function createOrderToSave(orderDto: DocumentData) {
  const orderToSave = {
    user: orderDto.user,
    cart: orderDto.cart.id,
    address: orderDto.address.id,
    offer: orderDto.offer.id,
    payment: orderDto.payment,
    created_at: new Date().toISOString()
  }

  return Object.assign({}, orderToSave)
}