import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { User } from '../../domain/models/user.model';
import { UpdateUserDto } from './dto';
import { UploadService } from '../shared/services';
import { Mapper } from '@automapper/types';
import { InjectMapper } from '@automapper/nestjs';
import { UserDto } from 'src/domain/dtos';

@Injectable()
export class ProfileService {
  constructor(
    @Inject(User.name) private readonly userModel: typeof User,
    private jwtService: JwtService,
    private uploadService: UploadService,
    @InjectMapper('')
    private mapper: Mapper,
  ) {}

  async getProfileByAddress(address: string): Promise<UserDto> {
    const user = await this.userModel.findOne({ where: { address } });
    if (!user) {
      throw new NotFoundException('user is not found');
    }
    const userDto = await this.mapper.mapAsync(user, UserDto, User);
    delete userDto.roles;
    return userDto;
  }
  async updateProfile(updateUserDto: UpdateUserDto): Promise<UserDto> {
    const { address, avatar, cover, email, username, bio, playerId } =
      updateUserDto;
    const user = await this.userModel.findOne({ where: { address } });
    if (!user) {
      throw new NotFoundException('User is not found');
    }

    if (email) {
      const duplicatedUser = await this.userModel.findOne({ where: { email } });
      if (
        duplicatedUser &&
        duplicatedUser.id.toString() !== user.id.toString()
      ) {
        throw new BadRequestException('Email is used by other account');
      }
    }
    let avatarLink = null;
    if (avatar) {
      Logger.log(`upload avatar of user: ${user.id}`);
      avatarLink = await this.uploadService.upload(avatar);
      user.avatar = avatarLink;
    }
    let coverLink = null;
    if (cover) {
      Logger.log(`upload cover of user: ${user.id}`);
      coverLink = await this.uploadService.upload(cover);
      user.cover = coverLink;
    }

    user.email = email;
    user.bio = bio;
    user.playerId = playerId;
    user.username = username;
    const newUser = await user.save();
    const userDto = await this.mapper.mapAsync(newUser, UserDto, User);
    delete userDto.roles;
    return userDto;
  }

  async toUserDto(user: User) {
    const userDto = await this.mapper.mapAsync(user, UserDto, User);
    return userDto;
  }
}
