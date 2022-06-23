import { classes } from '@automapper/classes';
import { AutomapperModule } from '@automapper/nestjs';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { ProposalStatus } from '../../domain/models/enum';
import configuration from '../../config/configuration';
import { Mappers } from '../../domain/mappers';
import {
  depositsProvider,
  proposalsProvider,
  votesProvider,
} from '../../domain/models';
import { DatabaseModule } from '../database/database.module';
import { GetVotedProposalsDto } from './dtos/get.votedProposals.dto';
import { ProposalService } from './proposal.service';

describe('ProposalService', () => {
  let service: ProposalService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        DatabaseModule,
        AutomapperModule.forRoot({
          options: [{ name: '', pluginInitializer: classes }],
          singular: true,
        }),
        ConfigModule.forRoot({
          isGlobal: true,
          load: [configuration],
        }),
      ],
      providers: [
        ProposalService,
        ProposalService,
        proposalsProvider,
        depositsProvider,
        votesProvider,
        ...Mappers,
      ],
    }).compile();

    service = module.get<ProposalService>(ProposalService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('getVotedProposals is working', async () => {
    const query = new GetVotedProposalsDto();
    query.userAddress = '0x5Bea1FE8a1167d71E673dcDeFFC0Ee4E8BaF5f07';
    query.status = Object.values(ProposalStatus) as any;
    const votesProposals = await service.getVotedProposals(query);
    console.log(JSON.stringify(votesProposals));
    expect(votesProposals).toBeDefined();
  });
});
