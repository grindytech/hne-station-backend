import { Model } from 'mongoose';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { bufferToHex } from 'ethereumjs-utils';
import { recoverPersonalSignature } from 'eth-sig-util';
import { JwtService } from '@nestjs/jwt';
import jwt_decode from 'jwt-decode';

import { User, UserDocument } from '../../domain/models/user.model';
import { GetTokenDto } from './dto';
import {
  BlackList,
  BlackListDocument,
} from '../../domain/models/blacklist.model';
import { iInfoToken } from 'src/config/requestcontext';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(BlackList.name)
    private readonly blackListModel: Model<BlackListDocument>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
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
}
