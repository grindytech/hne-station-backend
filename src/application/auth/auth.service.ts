import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { recoverPersonalSignature } from 'eth-sig-util';
import { bufferToHex } from 'ethereumjs-utils';
import jwt_decode from 'jwt-decode';
import { Model } from 'mongoose';

import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/types';
import { deserialize } from 'class-transformer';
import { iInfoToken } from 'src/config/requestcontext';
import { UserDto } from 'src/domain/dtos';
import {
  BlackList,
  BlackListDocument,
} from '../../domain/models/blacklist.model';
import { User, UserDocument } from '../../domain/models/user.model';
import { GetTokenDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(BlackList.name)
    private readonly blackListModel: Model<BlackListDocument>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectMapper()
    private readonly userMapper: Mapper,
  ) {}
  private logger = new Logger(AuthService.name);
  async getUserByAddress(address: string): Promise<User> {
    const user = await this.userModel.findOne({ address }).exec();
    if (user) {
      return user;
    }
    const newUser = new this.userModel({
      nonce: Math.floor(Math.random() * 1000000),
      address,
      username: address,
    });
    await newUser.save();
    return newUser;
  }

  verifySignature({
    user,
    signature,
  }: {
    user: any;
    signature: string;
  }): boolean {
    const msg = `${user.nonce}`;
    const msgBufferHex = bufferToHex(Buffer.from(msg, 'utf8'));
    const address = recoverPersonalSignature({
      data: msgBufferHex,
      sig: signature,
    });
    return address.toLowerCase() === user.address.toLowerCase();
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async createBlackList(address: string): Promise<any> {
    const blacklist = await this.blackListModel
      .findOne({
        address: address.toLowerCase(),
      })
      .exec();
    if (blacklist) {
      return blacklist._id.toString();
    }
    const savedBlackList = await new this.blackListModel({
      address: address.toLowerCase(),
    }).save();
    return savedBlackList._id.toString();
  }

  async removeBlackList(address: string): Promise<any> {
    const blacklist = await this.blackListModel
      .findOne({
        address: address.toLowerCase(),
      })
      .exec();
    if (!blacklist) {
      return null;
    }

    const id = blacklist._id.toString();
    await this.blackListModel.findOneAndDelete({
      address: address.toLowerCase(),
    });
    return id;
  }

  async generateToken(tokenDto: GetTokenDto): Promise<string | null> {
    const blacklist = await this.blackListModel
      .findOne({
        address: tokenDto.address.toLowerCase(),
      })
      .exec();
    if (blacklist) {
      throw new BadRequestException('Blacklist address');
    }
    const user = await this.userModel
      .findOne({ address: tokenDto.address })
      .exec();
    const isVerified = this.verifySignature({
      user,
      signature: tokenDto.signature,
    });

    if (isVerified) {
      const payload = {
        address: tokenDto.address,
        sub: user._id.toString(),
      };
      // update new nonce
      user.nonce = Math.floor(Math.random() * 1000000);
      console.log(`generate new nonce: ${user.nonce}`);
      // generate token
      const accessToken = this.jwtService.sign(payload);
      return accessToken;
    }
    return null;
  }

  public async jwtDecode(jwt: string): Promise<iInfoToken> {
    try {
      const info: iInfoToken = jwt_decode(jwt);
      if (info.exp > Date.now()) {
        throw new UnauthorizedException('Token has expired');
      }
      return info;
    } catch (error) {
      this.logger.error(error);
      throw new UnauthorizedException();
    }
  }
  async tokenLogin(jwt: string): Promise<UserDto> {
    try {
      const { sub, exp }: iInfoToken = jwt_decode(jwt);
      const user = await this.userModel.findById(sub);
      if (exp > Date.now()) {
        throw new UnauthorizedException('Token has expired');
      }
      const autoUser = deserialize(User, JSON.stringify(user));
      const userDto = await this.userMapper.mapAsync(autoUser, UserDto, User);
      return userDto;
    } catch (error) {
      this.logger.error(error);
      throw new UnauthorizedException();
    }
  }
}
