import { INTEGER } from 'sequelize';
import { Column, Model, Table } from 'sequelize-typescript';
import { VoteType } from './enum';

@Table({ modelName: 'votes' })
export class Vote extends Model {
  @Column
  proposalID: string;

  @Column({
    set: function (this: Model, val: any) {
      this.setDataValue('userAddress', String(val).toLocaleLowerCase());
    },
    allowNull: false,
  })
  userAddress: string;

  @Column
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
