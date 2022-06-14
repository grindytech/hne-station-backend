import { Module } from '@nestjs/common';
import { HealthModule } from './health/health.module';
import { AuthModule } from './auth/auth.module';
import { ProfileModule } from './profile/profile.module';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [HealthModule, AuthModule, ProfileModule, SharedModule],
})
export class ApplicationModule {}
