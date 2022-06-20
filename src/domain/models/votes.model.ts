import { AutoMap } from '@automapper/classes';
import { DOUBLE, INTEGER } from 'sequelize';
import { Column, Model, Table } from 'sequelize-typescript';
import { VoteType } from './enum';

@Table({ modelName: 'votes' })
export class Vote extends Model {
  @AutoMap()
  @Column
  proposalID: string;

  @AutoMap()
  @Column({
    set: function (this: Model, val: any) {
      this.setDataValue('userAddress', String(val).toLocaleLowerCase());
    },
    allowNull: false,
  })
  userAddress: string;

  @AutoMap()
  @Column({ type: DOUBLE({ unsigned: true }) })
  amount: number;

  @AutoMap()
  @Column
  txHash: string;

  @AutoMap()
  @Column
  block: number;

  @AutoMap()
  @Column({ type: INTEGER })
  type: VoteType;
}

export const votesProvider = {
  provide: Vote.name,
  useValue: Vote,
};
