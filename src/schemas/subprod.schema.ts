import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Product } from './product.schema';

@Schema()
export class Subproduct extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Product' })
  product: Product;

  @Prop({ required: false })
  buy_price: number;

  @Prop({ required: false })
  sell_price: number;

  @Prop({ required: true })
  sale_price: number;

  @Prop({ required: false })
  size: number;

  @Prop({ required: false })
  active: boolean;

  @Prop({ required: false })
  stock: number;

  @Prop({ required: false })
  highlight: boolean;

  @Prop({ required: false, default: false })
  has_lock: boolean;
}

export const SubproductSchema = SchemaFactory.createForClass(Subproduct);
