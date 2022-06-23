import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { VoteType } from '../models/enum';
import { BaseDocumentDto } from './basedocumentdto';
import { ProposalDto } from './proposal.dto';

export class VoteDto extends BaseDocumentDto {
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
  @AutoMap()
  type: VoteType;

  @ApiProperty()
  @AutoMap({ typeFn: () => ProposalDto })
  proposal: ProposalDto;
}
