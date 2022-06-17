import { INTEGER, STRING } from 'sequelize';
import { Column, Model, PrimaryKey, Table } from 'sequelize-typescript';
import { ProposalStatus } from './enum';

@Table({ modelName: 'proposal' })
export class Proposal extends Model {
  @PrimaryKey
  @Column({ type: STRING(20) })
  proposalID: string;

  @Column({
    set: function (this: Model, val: any) {
      this.setDataValue('proposer', String(val).toLocaleLowerCase());
    },
    allowNull: false,
    type: STRING(42),
  })
  proposer: string;

  @Column({
    type: STRING(200),
  })
  title: string;

  @Column({ type: STRING(1000) })
  description: string;

  @Column
  //init amount
  initial: number;

  @Column
  deposit: number;

  @Column({ type: INTEGER })
  status: ProposalStatus;

  @Column
  votesPassed: number;

  @Column
  votesFail: number;

  @Column
  votesVeto: number;

  @Column
  blockTime: Date;

  @Column
  start: Date;

  @Column
  endDeposit: Date;

  @Column
  endVote: Date;

  @Column
  block: number;

  @Column
  txHash: string;
}
export const proposalsProvider = {
  provide: Proposal.name,
  useValue: Proposal,
};
