import { ApiProperty } from '@nestjs/swagger';
import { BaseQueryParams } from 'src/domain/dtos';
import { ProposalStatus } from 'src/domain/models/enum';

export class GetProposalsDto extends BaseQueryParams {
  @ApiProperty({ required: false })
  proposer: string;

  @ApiProperty({ required: false })
  proposalId: string;

  @ApiProperty({ type: [Number], required: false })
  status: ProposalStatus[];
}
