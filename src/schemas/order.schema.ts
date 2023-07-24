import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { StatusOrder } from 'src/dto/types.dto';
import { Address } from './address.schema';
import { Cart } from './cart.schema';
import { Offer } from './offers.schema';
import { User } from './user.schema';

@Schema({ timestamps: true })
export class Order extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User' })
  user: User;

  @Prop({ type: Types.ObjectId, ref: 'Cart' })
  cart: Cart;

  @Prop({ type: Types.ObjectId, ref: 'Address' })
  address: Address;

  @Prop({ type: Types.ObjectId, ref: 'Offer' })
  offer: Offer;

  @Prop({ required: true })
  payment_type: string;

  @Prop({ default: false })
  message_sent: boolean;

  @Prop({ default: StatusOrder.CONFIRMED })
  status: StatusOrder;

  @Prop({ default: true })
  ecommerce: boolean;
}

export const OrderSchema = SchemaFactory.createForClass(Order);

OrderSchema.pre('find', function (next) {
  this.populate('user');
  this.populate('address');
  this.populate('offer');
  this.populate({
    path: 'cart',
    model: 'Cart',
    populate: {
      path: 'subproducts.subproduct',
      model: 'Subproduct',
      populate: {
        path: 'product',
        model: 'Product',
      },
    },
  });
  next();
});

OrderSchema.pre('findOne', function (next) {
  this.populate('user');
  this.populate('address');
  this.populate('offer');
  this.populate({
    path: 'cart',
    model: 'Cart',
    populate: {
      path: 'subproducts.subproduct',
      model: 'Subproduct',
      populate: {
        path: 'product',
        model: 'Product',
      },
    },
  });
  next();
});
