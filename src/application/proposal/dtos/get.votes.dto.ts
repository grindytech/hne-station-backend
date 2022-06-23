import { ApiProperty } from '@nestjs/swagger';
import { BaseQueryParams } from '../../../domain/dtos';
import { VoteType } from '../../../domain/models/enum';

export class GetVotesDto extends BaseQueryParams {
  @ApiProperty({ required: false })
  userAddress: string;

  @ApiProperty({ required: false })
  proposalId: string;

  @ApiProperty({ type: [Number], required: false })
  type: VoteType;
}
