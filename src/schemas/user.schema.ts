import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Address } from './address.schema';
import { Cart } from './cart.schema';
import { Order } from './order.schema';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  full_name: string

  @Prop({ required: true })
  active: boolean;

  @Prop({ required: true })
  admin: boolean;

  @Prop({ required: false })
  phone: string

  @Prop({ required: true })
  provider_login: string

  @Prop({ required: true })
  firebase_id: string

  @Prop({ type: Types.ObjectId, ref: 'Cart' })
  active_cart: Cart;

  @Prop({ type: Types.ObjectId, ref: 'Address' })
  active_address: Address[];

  @Prop({ type: Types.ObjectId, ref: 'Order' })
  orders: Order[];

}

export const UserSchema = SchemaFactory.createForClass(User);

