import { Module } from '@nestjs/common';
import { Web3Service } from './web3.service';

@Module({
  controllers: [],
  imports: [Web3Service],
  exports: [Web3Service],
  providers: [Web3Service],
})
export class Web3Module {}
