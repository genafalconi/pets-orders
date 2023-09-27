import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Subproduct } from './subprod.schema';
import {
  AnimalAgeDto,
  AnimalDto,
  AnimalSizeDto,
  BrandDto,
  CategoryDto,
} from '../dto/types.dto';

@Schema()
export class Product extends Document {
  @Prop({ required: false })
  name: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Subproduct' }] })
  subproducts: Subproduct[];

  @Prop({ required: false })
  category: CategoryDto;

  @Prop({ required: false })
  animal: AnimalDto;

  @Prop({ required: false })
  brand: BrandDto;

  @Prop({ required: false })
  animal_age: AnimalAgeDto;

  @Prop({ required: true })
  animal_size: AnimalSizeDto;

  @Prop({ required: false })
  description: string;

  @Prop({ required: false })
  image: string;

  @Prop({ required: false })
  active: boolean;
}

const ProductSchema = SchemaFactory.createForClass(Product);

ProductSchema.statics.addSubproducts = async function (
  subproducts: Subproduct[],
) {
  for (const subproduct of subproducts) {
    const { product, _id } = subproduct;
    await this.findByIdAndUpdate(product, { $set: { subproducts: _id } });
  }
};

export { ProductSchema };
