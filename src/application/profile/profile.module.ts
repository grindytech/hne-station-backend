import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { JwtModule } from '@nestjs/jwt';
import { UploadService } from '../shared/services';
import { DatabaseModule } from '../database/database.module';
import { usersProvider } from 'src/domain/models';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.secret'),
        signOptions: {
          expiresIn: configService.get<string>('jwt.signOptions'),
        },
      }),
      inject: [ConfigService],
    }),
    DatabaseModule,
  ],
  controllers: [ProfileController],
  providers: [ProfileService, UploadService, usersProvider],
})
export class ProfileModule {}
