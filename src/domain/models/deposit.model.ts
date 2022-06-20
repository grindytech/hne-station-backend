import { AutoMap } from '@automapper/classes';
import { DOUBLE, INTEGER } from 'sequelize';
import { Column, Model, Table } from 'sequelize-typescript';

@Table({ modelName: 'deposits' })
export class Deposit extends Model {
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
}

export const depositsProvider = {
  provide: Deposit.name,
  useValue: Deposit,
};
