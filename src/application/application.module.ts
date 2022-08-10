import { Module } from '@nestjs/common';
import { AdminModule } from './admin/admin.module';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';
import { MkDataModule } from './mk-data/mk-data.module';
import { ProfileModule } from './profile/profile.module';
import { ProposalModule } from './proposal/proposal.module';
import { SharedModule } from './shared/shared.module';
import { DatabaseModule } from './database/database.module';
import { Web3Module } from './web3/web3.module';

@Module({
  imports: [
    HealthModule,
    AuthModule,
    ProfileModule,
    SharedModule,
    AdminModule,
    ProposalModule,
    MkDataModule,
    DatabaseModule,
    Web3Module,
  ],
  providers: [],
})
export class ApplicationModule {}
