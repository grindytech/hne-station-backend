import { Column, Model, Table } from 'sequelize-typescript';
import { Role } from './enum';

@Table({ modelName: 'users' })
export class User extends Model {
  @Column
  email: string;

  @Column
  emailVerified: boolean;

  @Column({
    set: function (this: Model, val: any) {
      this.setDataValue('address', String(val).toLocaleLowerCase());
    },
    allowNull: false,
  })
  address: string;

  @Column
  username: string;

  @Column
  avatar: string;

  @Column
  cover: string;

  @Column
  nonce: number;

  @Column
  bio: string;

  @Column
  playerId: string;

  @Column({ defaultValue: Role.User })
  roles: string;
}
export const usersProvider = {
  provide: User.name,
  useValue: User,
};
