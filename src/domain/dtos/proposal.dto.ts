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
  initial: number;

  @ApiProperty()
  @AutoMap()
  deposit: number;

  @ApiProperty({ type: Number, enum: ProposalStatus })
  @AutoMap()
  status: ProposalStatus;

  @ApiProperty()
  @AutoMap()
  votesPassed: number;

  @ApiProperty()
  @AutoMap()
  votesFail: number;

  @ApiProperty()
  @AutoMap()
  votesVeto: number;

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
