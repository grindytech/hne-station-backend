import { Module } from '@nestjs/common';
import { ServiceModule } from './services/service.module';
@Module({
  imports: [ServiceModule],
  providers: [],
  controllers: [],
})
export class SharedModule {}
