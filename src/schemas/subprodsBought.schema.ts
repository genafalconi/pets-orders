import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Subproduct } from './subprod.schema';

@Schema()
export class SubproductBought extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Subproduct' })
  subproduct: Subproduct;

  @Prop({ required: true })
  highlight: Boolean;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  buy_price: number;

  @Prop({ required: true })
  sell_price: number;

  @Prop({ required: true })
  sale_price: number;

  @Prop({ required: true })
  buy_date: Date
}

export const SubproductBoughtSchema = SchemaFactory.createForClass(SubproductBought);
