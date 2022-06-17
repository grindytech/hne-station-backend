import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { recoverPersonalSignature } from 'eth-sig-util';
import { bufferToHex } from 'ethereumjs-utils';
import jwt_decode from 'jwt-decode';

import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/types';
import { iInfoToken } from 'src/config/requestcontext';
import { UserDto } from 'src/domain/dtos';
import { BlackList } from '../../domain/models/blacklist.model';
import { User } from '../../domain/models/user.model';
import { GetTokenDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(User.name) private readonly userModel: typeof User,
    @Inject(BlackList.name)
    private readonly blackListModel: typeof BlackList,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectMapper('')
    private readonly mapper: Mapper,
  ) {}
  private logger = new Logger(AuthService.name);
  async getUserByAddress(address: string): Promise<UserDto> {
    const user = await this.userModel.findOne({ where: { address } });
    if (user) {
      return this.mapper.mapAsync(user, UserDto, User);
    }
    const newUser = new this.userModel({
      nonce: Math.floor(Math.random() * 1000000),
      address,
      username: address,
    });
    await newUser.save();
    return this.mapper.mapAsync(newUser, UserDto, User);
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
    const blacklist = await this.blackListModel.findOne({
      where: { address: address.toLowerCase() },
    });
    if (blacklist) {
      return blacklist.id.toString();
    }
    const savedBlackList = await new this.blackListModel({
      address: address.toLowerCase(),
    }).save();
    return savedBlackList.id.toString();
  }

  async removeBlackList(address: string): Promise<any> {
    const blacklist = await this.blackListModel.findOne({
      where: {
        address: address.toLowerCase(),
      },
    });
    if (!blacklist) {
      return null;
    }
    const id = blacklist.id.toString();
    await this.blackListModel.destroy({
      where: { address: address.toLowerCase() },
    });
    return id;
  }

  async generateToken(tokenDto: GetTokenDto): Promise<string | null> {
    const blacklist = await this.blackListModel.findOne({
      where: {
        address: tokenDto.address.toLowerCase(),
      },
    });
    if (blacklist) {
      throw new BadRequestException('Blacklist address');
    }
    const user = await this.userModel.findOne({
      where: { address: tokenDto.address },
    });
    const isVerified = this.verifySignature({
      user,
      signature: tokenDto.signature,
    });

    if (isVerified) {
      const payload = {
        address: tokenDto.address,
        sub: user.id.toString(),
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
      const user = await this.userModel.findOne({ where: { id: sub } });
      if (exp > Date.now()) {
        throw new UnauthorizedException('Token has expired');
      }
      const userDto = await this.mapper.mapAsync(user, UserDto, User);
      return userDto;
    } catch (error) {
      this.logger.error(error);
      throw new UnauthorizedException();
    }
  }
}
