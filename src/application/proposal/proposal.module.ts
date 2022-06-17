import { Module } from '@nestjs/common';
import { proposalsProvider } from 'src/domain/models';
import { DatabaseModule } from '../database/database.module';
import { ProposalService } from './proposal.service';
import { ProposalController } from './proposal.controller';

@Module({
  imports: [DatabaseModule],
  providers: [ProposalService, proposalsProvider],
  controllers: [ProposalController],
})
export class ProposalModule {}
