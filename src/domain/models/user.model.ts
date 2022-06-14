import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from './enum';
export type UserDocument = User & Document;

@Schema({
  collection: 'users',
  timestamps: true,
  toJSON: {
    transform: function (doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    },
  },
})
export class User {
  @ApiProperty()
  @Prop()
  email: string;

  @ApiProperty()
  @Prop({ default: false })
  emailVerified: boolean;

  @ApiProperty()
  @Prop({ required: true })
  address: string;

  @ApiProperty()
  @Prop()
  username: string;

  @ApiProperty()
  @Prop()
  avatar: string;

  @ApiProperty()
  @Prop()
  cover: string;

  @ApiProperty()
  @Prop()
  nonce: number;

  @ApiProperty()
  @Prop()
  bio: string;

  @ApiProperty()
  @Prop()
  playerId: string;

  @ApiProperty()
  @Prop({ enum: Role, type: [Role], default: [Role.User] })
  role: Role[];
}

export const UserSchema = SchemaFactory.createForClass(User);
