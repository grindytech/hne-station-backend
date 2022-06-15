import { AutoMap } from '@automapper/classes';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';
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
  @AutoMap()
  email: string;

  @ApiProperty()
  @Prop({ default: false })
  @AutoMap()
  emailVerified: boolean;

  @ApiProperty()
  @Prop({ required: true })
  @AutoMap()
  address: string;

  @ApiProperty()
  @Prop()
  @AutoMap()
  username: string;

  @ApiProperty()
  @Prop()
  @AutoMap()
  avatar: string;

  @ApiProperty()
  @Prop()
  @AutoMap()
  cover: string;

  @ApiProperty()
  @Prop()
  @AutoMap()
  nonce: number;

  @ApiProperty()
  @Prop()
  @AutoMap()
  bio: string;

  @ApiProperty()
  @Prop()
  @AutoMap()
  playerId: string;

  @ApiProperty()
  @Prop({ enum: Role, type: [String], default: [Role.User] })
  @AutoMap()
  roles: Role[];
}

export const UserSchema = SchemaFactory.createForClass(User);
