import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { ProposalStatus } from '../models/enum';
import { BaseDocumentDto } from './basedocumentdto';

export class ProposalDto extends BaseDocumentDto {
  @ApiProperty()
  @AutoMap()
  proposalID: string;

  @ApiProperty()
  @AutoMap()
  proposer: string;

  @ApiProperty()
  @AutoMap()
  title: string;

  @ApiProperty()
  @AutoMap()
  description: string;

  @ApiProperty()
  @AutoMap()
  //init amount
  initial: string;

  @ApiProperty()
  @AutoMap()
  deposit: string;

  @ApiProperty({ type: Number, enum: ProposalStatus })
  @AutoMap()
  status: ProposalStatus;

  @ApiProperty()
  @AutoMap()
  votesPassed: string;

  @ApiProperty()
  @AutoMap()
  votesFail: string;

  @ApiProperty()
  @AutoMap()
  votesVeto: string;

  @ApiProperty()
  @AutoMap()
  blockTime: Date;

  @ApiProperty()
  @AutoMap()
  start: Date;

  @ApiProperty()
  @AutoMap()
  endDeposit: Date;

  @ApiProperty()
  @AutoMap()
  endVote: Date;

  @ApiProperty()
  @AutoMap()
  block: number;

  @ApiProperty()
  @AutoMap()
  txHash: string;
}
