import { AutoMap } from '@automapper/classes';
import { Column, Model, Table } from 'sequelize-typescript';
import { Role } from './enum';

@Table({ modelName: 'users' })
export class User extends Model {
  @AutoMap()
  @Column
  email: string;

  @AutoMap()
  @Column
  emailVerified: boolean;

  @AutoMap()
  @Column({
    set: function (this: Model, val: any) {
      this.setDataValue('address', String(val).toLocaleLowerCase());
    },
    allowNull: false,
  })
  address: string;

  @AutoMap()
  @Column
  username: string;

  @AutoMap()
  @Column
  avatar: string;

  @AutoMap()
  @Column
  cover: string;

  @AutoMap()
  @Column
  nonce: number;

  @AutoMap()
  @Column
  bio: string;

  @AutoMap()
  @Column
  playerId: string;

  @AutoMap()
  @Column({ defaultValue: Role.User })
  roles: string;
}
export const usersProvider = {
  provide: User.name,
  useValue: User,
};
