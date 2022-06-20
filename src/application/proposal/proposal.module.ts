import { Module } from '@nestjs/common';
import {
  depositsProvider,
  proposalsProvider,
  votesProvider,
} from 'src/domain/models';
import { DatabaseModule } from '../database/database.module';
import { ProposalService } from './proposal.service';
import { ProposalController } from './proposal.controller';

@Module({
  imports: [DatabaseModule],
  providers: [
    ProposalService,
    proposalsProvider,
    depositsProvider,
    votesProvider,
  ],
  controllers: [ProposalController],
})
export class ProposalModule {}
