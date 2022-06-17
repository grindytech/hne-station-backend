import { Logger } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import configuration from 'src/config/configuration';
import { models } from 'src/domain/models';

const databaseLogger = new Logger('DataBaseModule');

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {
      const db = configuration().db;
      const sequelize = new Sequelize({
        dialect: 'mysql',
        ...db,
        logging: (sql) => databaseLogger.debug(sql),
      });
      sequelize.addModels(models);
      await sequelize.sync();
      return sequelize;
    },
  },
];
