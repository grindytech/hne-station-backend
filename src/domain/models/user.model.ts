import { Column, Model, Table } from 'sequelize-typescript';

@Table
export class User extends Model {
  @Column
  email: string;

  @Column
  emailVerified: boolean;

  @Column
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

  @Column
  roles: string;
}
export const usersProvider = {
  provide: User.name,
  useValue: User,
};
