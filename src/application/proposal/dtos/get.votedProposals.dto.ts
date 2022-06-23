import { ApiProperty } from '@nestjs/swagger';
import { BaseQueryParams } from '../../../domain/dtos';
import { ProposalStatus } from '../../../domain/models/enum';

export class GetVotedProposalsDto extends BaseQueryParams {
  @ApiProperty({ required: false })
  userAddress: string;

  @ApiProperty({ type: [Number], required: false })
  status?: ProposalStatus[];
}
