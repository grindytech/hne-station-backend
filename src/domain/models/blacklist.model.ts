import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BlackListDocument = BlackList & Document;

@Schema({ collection: 'blacklists', timestamps: true })
export class BlackList {
  @Prop({ type: String, required: true, index: true })
  address: string;
}

export const BlackListSchema = SchemaFactory.createForClass(BlackList);
