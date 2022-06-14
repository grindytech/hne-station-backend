import { Injectable } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Request } from 'express';
import jwt_decode from 'jwt-decode';

@Injectable()
export class RequestContext {
  public getSubJwt(request: Request): string {
    const info = this.decodeJwt(request);
    const sub = info ? info.sub : '';
    return sub;
  }

  public getAddressJwt(request: Request): string {
    const info = this.decodeJwt(request);
    const address = info ? info.address : '';
    return address;
  }

  private decodeJwt(request: Request): iInfoToken {
    if (request.headers.authorization) {
      const [, token] = request.headers.authorization.split(' ');
      const info: iInfoToken = jwt_decode(token);
      return info;
    }
    return null;
  }
}

export class iInfoToken {
  @ApiProperty()
  address: string;
  @ApiProperty()
  sub: string;
  @ApiProperty()
  iat: number;
  @ApiProperty()
  exp: number;
}
