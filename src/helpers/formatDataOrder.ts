import { AddressDto } from "src/dto/address.dto";
import { CartDto } from "src/dto/cart.dto";
import { OfferDto } from "src/dto/offer.dto";

export default function formatDataOrder(user: string, cart: CartDto, address: AddressDto, offer: OfferDto) {
  const orderData = {
    user: user,
    cart: cart,
    address: address,
    offer: offer
  }

  return orderData
}