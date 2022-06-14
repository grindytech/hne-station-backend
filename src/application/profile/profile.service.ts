import { Model } from 'mongoose';
import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';

import { User, UserDocument } from '../../domain/models/user.model';
import { UpdateUserDto } from './dto';
import { UploadService } from '../shared/services';

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private jwtService: JwtService,
    private uploadService: UploadService,
  ) {}

  async getProfileByAddress(address: string): Promise<User> {
    const user = await this.userModel.findOne({ address }).exec();
    if (!user) {
      throw new NotFoundException('user is not found');
    }
    return user;
  }
  async updateProfile(updateUserDto: UpdateUserDto): Promise<User> {
    const { address, avatar, cover, email, username, bio, playerId } =
      updateUserDto;
    const user = await this.userModel.findOne({ address }).exec();
    if (!user) {
      throw new NotFoundException('User is not found');
    }

    if (email) {
      const duplicatedUser = await this.userModel.findOne({ email }).exec();
      if (
        duplicatedUser &&
        duplicatedUser._id.toString() !== user._id.toString()
      ) {
        throw new BadRequestException('Email is used by other account');
      }
    }
    let avatarLink = null;
    if (avatar) {
      Logger.log(`upload avatar of user: ${user._id}`);
      avatarLink = await this.uploadService.upload(avatar);
      user.avatar = avatarLink;
    }
    let coverLink = null;
    if (cover) {
      Logger.log(`upload cover of user: ${user._id}`);
      coverLink = await this.uploadService.upload(cover);
      user.cover = coverLink;
    }

    user.email = email;
    user.bio = bio;
    user.playerId = playerId;
    user.username = username;
    const newUser = await user.save();
    return newUser;
  }
}
