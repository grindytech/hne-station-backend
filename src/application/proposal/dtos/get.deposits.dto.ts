import { ApiProperty } from '@nestjs/swagger';
import { BaseQueryParams } from '../../../domain/dtos';

export class GetDepositsDto extends BaseQueryParams {
  @ApiProperty({ required: false })
  userAddress: string;

  @ApiProperty({ required: false })
  proposalId: string;
}
