import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Subproduct } from './subprod.schema';

@Schema({ timestamps: true })
export class Lock {
  @Prop({ required: true })
  user: string;

  @Prop({ type: Types.ObjectId, ref: 'Subproduct', required: true })
  subproduct: Subproduct;

  @Prop({ required: true })
  quantity: number;
}

export const LockSchema = SchemaFactory.createForClass(Lock);
