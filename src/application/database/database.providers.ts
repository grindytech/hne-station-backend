// import { Logger } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import configuration from '../../config/configuration';
import { models, modelsReferences } from '../../domain/models';

// const databaseLogger = new Logger('DataBaseModule');

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {
      const db = configuration().db;
      const sequelize = new Sequelize({
        dialect: 'mysql',
        ...db,
        // logging: (sql) => databaseLogger.debug(sql),
        logging: false,
      });
      sequelize.addModels(models);
      modelsReferences();
      await sequelize.sync();
      return sequelize;
    },
  },
];
