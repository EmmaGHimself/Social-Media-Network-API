import { Dialect } from 'sequelize/types';

interface DatabaseConfig {
  development: {
    dialect: Dialect;
    storage: string;
    autoLoadModels: boolean,
    synchronize: boolean,
  };
  test: {
    dialect: Dialect;
    storage: string;
    synchronize: boolean,

  };
  production: {
    dialect: Dialect;
    storage: string;
    autoLoadModels: boolean,
    migration: boolean,
  };
}

const databaseConfig: DatabaseConfig = {
  development: {
    dialect: 'sqlite',
    storage: 'dev.sqlite',
    autoLoadModels: true,
    synchronize: true,
  },
  test: {
    dialect: 'sqlite',
    storage: ':memory:',
    synchronize: true,
  },
  production: {
    dialect: 'sqlite',
    storage: 'prod.sqlite',
    autoLoadModels: true,
    migration: true,
  },
};

export default databaseConfig;