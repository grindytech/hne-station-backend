import { ApiProperty } from '@nestjs/swagger';
import { BaseQueryParams } from 'src/domain/dtos';
import { VoteType } from 'src/domain/models/enum';

export class GetVotesDto extends BaseQueryParams {
  @ApiProperty({ required: false })
  userAddress: string;

  @ApiProperty({ required: false })
  proposalId: string;

  @ApiProperty({ type: [Number], required: false })
  type: VoteType;
}
