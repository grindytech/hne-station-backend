import { Column, Model, Table } from 'sequelize-typescript';

@Table({ modelName: 'blacklists' })
export class BlackList extends Model {
  @Column({
    set: function (this: Model, val: any) {
      this.setDataValue('address', String(val).toLocaleLowerCase());
    },
    allowNull: false,
  })
  address: string;
}

export const blacklistsProvider = {
  provide: BlackList.name,
  useValue: BlackList,
};
