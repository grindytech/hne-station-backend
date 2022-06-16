import { classes } from '@automapper/classes';
import { AutomapperModule } from '@automapper/nestjs';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ApplicationModule } from './application/application.module';
import configuration from './config/configuration';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    AutomapperModule.forRoot({
      options: [{ name: '', pluginInitializer: classes }],
      singular: true,
    }),
    ApplicationModule,
  ],
})
export class AppModule {}
