import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { User } from '../user/user.schema';
import { Product } from '../product/product.schema';

export type OrderDocument = Order & Document;

@Schema()
export class Order {
  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ required: true, type: String })
  userId: string;

  @Prop({ required: true, type: String })
  productId: string;

  @Prop({ required: true, type: Number })
  quantity: number;
  
  @Prop({ type: Date, default: null })
  deliveredAt: Date;
  
  @Prop({ type: Date, default: null })
  canceledAt: Date;

  @Prop({ type: User })
  user: User;

  @Prop({ type: Product })
  product: Product;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
