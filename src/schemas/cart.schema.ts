import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Subproduct } from './subprod.schema';
import { User } from './user.schema';

@Schema({ timestamps: true })
export class Cart extends Document {
  @Prop({
    type: [
      {
        _id: false,
        subproduct: { type: Types.ObjectId, ref: 'Subproduct' },
        quantity: 'number',
        profit: 'number',
      },
    ],
  })
  subproducts: {
    subproduct: Subproduct;
    quantity: number;
    profit: number;
  }[];

  @Prop({ required: true })
  active: boolean;

  @Prop({ required: false, default: false })
  bought: boolean;

  @Prop({ required: true })
  total_products: number;

  @Prop({ required: true })
  total_price: number;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  user: User;
}

export const CartSchema = SchemaFactory.createForClass(Cart);

CartSchema.pre('findOne', function (next) {
  this.populate({
    path: 'subproducts.subproduct',
    model: 'Subproduct',
    populate: {
      path: 'product',
      model: 'Product',
    },
  });
  next();
});
