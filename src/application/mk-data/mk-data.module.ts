import { Module } from '@nestjs/common';
import { CoingeckoService } from './coingecko/coingecko.service';

@Module({
  providers: [CoingeckoService],
})
export class MkDataModule {}
