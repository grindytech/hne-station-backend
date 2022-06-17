import { Controller, Get, Query } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { BaseResult, BaseResultPagination } from 'src/domain/dtos';
import { ProposalDto } from 'src/domain/dtos/proposal.dto';
import { GetProposalsDto } from './dtos';
import { ProposalService } from './proposal.service';

@Controller('proposal')
@ApiTags('Proposal')
@ApiExtraModels(ProposalDto, GetProposalsDto, BaseResult, BaseResultPagination)
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
}
