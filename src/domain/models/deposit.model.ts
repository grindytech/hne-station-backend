import { DOUBLE } from 'sequelize';
import { Column, Model, Table } from 'sequelize-typescript';
import { Proposal } from './proposal.model';

@Table({ modelName: 'deposits' })
export class Deposit extends Model {
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
}
export const depositsProvider = {
  provide: Deposit.name,
  useValue: Deposit,
};
