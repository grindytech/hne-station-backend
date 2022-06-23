import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { BaseDocumentDto } from './basedocumentdto';
import { ProposalDto } from './proposal.dto';

export class DepositDto extends BaseDocumentDto {
  @ApiProperty()
  @AutoMap()
  proposalID: string;

  @ApiProperty()
  @AutoMap()
  userAddress: string;

  @ApiProperty()
  @AutoMap()
  amount: number;

  @ApiProperty()
  @AutoMap()
  txHash: string;

  @ApiProperty()
  @AutoMap()
  block: number;

  @ApiProperty()
  @AutoMap({ typeFn: () => ProposalDto })
  proposal: ProposalDto;
}
