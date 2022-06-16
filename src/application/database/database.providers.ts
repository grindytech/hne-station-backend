import { Sequelize } from 'sequelize-typescript';
import configuration from 'src/config/configuration';
import { BlackList, User } from 'src/domain/models';

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {
      const db = configuration().db;
      const sequelize = new Sequelize({
        dialect: 'mysql',
        ...db,
      });
      sequelize.addModels([User, BlackList]);
      await sequelize.sync();
      return sequelize;
    },
  },
];
