import { AddressDto } from "./address.dto"
import { CartDto } from "./cart.dto"
import { OfferDto } from "./offer.dto"

export class OrderDto {
  id: string
  user: string
  cart: CartDto
  address: AddressDto
  offer: OfferDto
  paymentType: string
  created_at: string
  updated_at: string
}