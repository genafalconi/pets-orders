import { Types } from 'mongoose';
import { Address } from 'src/schemas/address.schema';
import { Cart } from 'src/schemas/cart.schema';
import { Lock } from 'src/schemas/lock.schema';
import { Offer } from 'src/schemas/offers.schema';
import { Payment_Type } from './subproduct.dto';

export class OrderDto {
  _id: string;
  user: Types.ObjectId;
  cart: Cart;
  address: Address;
  offer: Offer;
  payment_type: Payment_Type;
  locks: Lock;
  order_type?: string;
}
