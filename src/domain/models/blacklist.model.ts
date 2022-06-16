import { Column, Model, Table } from 'sequelize-typescript';

@Table
export class BlackList extends Model {
  @Column
  address: string;
}

export const blacklistsProvider = {
  provide: BlackList.name,
  useValue: BlackList,
};
