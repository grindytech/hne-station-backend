import { Module } from '@nestjs/common';
import { ServiceModule } from './services/service.module';
import { Mappers } from 'src/domain/mappers';
@Module({
  imports: [ServiceModule],
  providers: [...Mappers],
  controllers: [],
})
export class SharedModule {}
