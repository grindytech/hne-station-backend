import { DOUBLE, INTEGER } from 'sequelize';
import { Column, Model, Table } from 'sequelize-typescript';
import { VoteType } from './enum';
import { Proposal } from './proposal.model';

@Table({ modelName: 'votes' })
export class Vote extends Model {
  @Column({ references: { model: Proposal, key: 'proposalID' } })
  proposalID: string;

  @Column({
    set: function (this: Model, val: any) {
      this.setDataValue('userAddress', String(val).toLocaleLowerCase());
    },
    allowNull: false,
  })
  userAddress: string;

  @Column({ type: DOUBLE({ unsigned: true }) })
  amount: number;

  @Column
  txHash: string;

  @Column
  block: number;

  @Column({ type: INTEGER })
  type: VoteType;
}
export const votesProvider = {
  provide: Vote.name,
  useValue: Vote,
};
