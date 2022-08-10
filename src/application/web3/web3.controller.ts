import {
  CacheInterceptor,
  Controller,
  Get,
  Param,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { BaseResult } from 'src/domain/dtos';
import { Web3Service } from './web3.service';

@Controller('web3')
export class Web3Controller {
  constructor(private readonly web3Service: Web3Service) {}
  @Get('/:address/balance')
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(BaseResult) },
        {
          properties: {
            data: { type: 'number' },
          },
        },
      ],
    },
  })
  async getHEBalance(@Param('address') address: string) {
    const rs = new BaseResult<number>();
    const balance = await this.web3Service.getHEBalance(address);
    rs.data = balance;
    return rs;
  }
  @Get('/burned')
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(BaseResult) },
        {
          properties: {
            data: { type: 'number' },
          },
        },
      ],
    },
  })
  @UseInterceptors(CacheInterceptor)
  async getHEBurned() {
    const rs = new BaseResult<number>();
    const balance = await this.web3Service.getHEBurned();
    rs.data = balance;
    return rs;
  }
}
