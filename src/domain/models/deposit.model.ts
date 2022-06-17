import { Column, Model, Table } from 'sequelize-typescript';

@Table({ modelName: 'deposits' })
export class Deposit extends Model {
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
}

export const depositsProvider = {
  provide: Deposit.name,
  useValue: Deposit,
};
