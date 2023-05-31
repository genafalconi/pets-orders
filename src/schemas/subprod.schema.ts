import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import {
  AnimalAgeDto,
  AnimalDto,
  AnimalSizeDto,
  BrandDto,
  CategoryDto,
} from '../dto/types.dto';
import { Product } from './product.schema';

@Schema()
export class Subproduct extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Product' })
  product: Product;

  @Prop({ required: true })
  buy_price: number;

  @Prop({ required: true })
  sell_price: number;

  @Prop({ required: true })
  size: number;

  @Prop({ required: true })
  category: CategoryDto;

  @Prop({ required: true })
  animal: AnimalDto;

  @Prop({ required: true })
  brand: BrandDto;

  @Prop({ required: true })
  animal_size: AnimalSizeDto;

  @Prop({ required: true })
  animal_age: AnimalAgeDto;

  @Prop({ required: true })
  active: boolean;

  @Prop({ required: true })
  stock: number;

  @Prop({ required: true })
  highlight: boolean;
}

export const SubproductSchema = SchemaFactory.createForClass(Subproduct);
