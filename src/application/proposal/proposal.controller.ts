import { Controller, Get, Query } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { BaseResult, BaseResultPagination, VoteDto } from 'src/domain/dtos';
import { DepositDto } from 'src/domain/dtos/deposit.dto';
import { ProposalDto } from 'src/domain/dtos/proposal.dto';
import { GetDepositsDto, GetProposalsDto, GetVotesDto } from './dtos';
import { GetVotedProposalsDto } from './dtos/get.votedProposals.dto';
import { ProposalService } from './proposal.service';

@Controller('proposal')
@ApiTags('Proposal')
@ApiExtraModels(
  ProposalDto,
  GetProposalsDto,
  BaseResult,
  BaseResultPagination,
  DepositDto,
  GetDepositsDto,
  VoteDto,
  GetVotesDto,
)
export class ProposalController {
  constructor(private readonly proposalService: ProposalService) {}

  @Get('proposals')
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(BaseResultPagination) },
        {
          properties: {
            data: {
              properties: {
                items: {
                  type: 'array',
                  items: { $ref: getSchemaPath(ProposalDto) },
                },
              },
            },
          },
        },
      ],
    },
  })
  async getProposals(@Query() query: GetProposalsDto) {
    return await this.proposalService.getProposals(query);
  }

  @Get('voted-proposals')
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(BaseResultPagination) },
        {
          properties: {
            data: {
              properties: {
                items: {
                  type: 'array',
                  items: { $ref: getSchemaPath(ProposalDto) },
                },
              },
            },
          },
        },
      ],
    },
  })
  async getVotedProposals(@Query() query: GetVotedProposalsDto) {
    return await this.proposalService.getVotedProposals(query);
  }

  @Get('depositors')
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(BaseResultPagination) },
        {
          properties: {
            data: {
              properties: {
                items: {
                  type: 'array',
                  items: { $ref: getSchemaPath(DepositDto) },
                },
              },
            },
          },
        },
      ],
    },
  })
  async getDepositor(@Query() query: GetDepositsDto) {
    return await this.proposalService.getDepositors(query);
  }
  @Get('deposits')
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(BaseResultPagination) },
        {
          properties: {
            data: {
              properties: {
                items: {
                  type: 'array',
                  items: { $ref: getSchemaPath(DepositDto) },
                },
              },
            },
          },
        },
      ],
    },
  })
  async getDeposits(@Query() query: GetDepositsDto) {
    return await this.proposalService.getDeposits(query);
  }

  @Get('voters')
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(BaseResultPagination) },
        {
          properties: {
            data: {
              properties: {
                items: {
                  type: 'array',
                  items: { $ref: getSchemaPath(VoteDto) },
                },
              },
            },
          },
        },
      ],
    },
  })
  async getVoter(@Query() query: GetVotesDto) {
    return await this.proposalService.getVoters(query);
  }
  @Get('votes')
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(BaseResultPagination) },
        {
          properties: {
            data: {
              properties: {
                items: {
                  type: 'array',
                  items: { $ref: getSchemaPath(VoteDto) },
                },
              },
            },
          },
        },
      ],
    },
  })
  async getVotes(@Query() query: GetVotesDto) {
    return await this.proposalService.getVotes(query);
  }
}
