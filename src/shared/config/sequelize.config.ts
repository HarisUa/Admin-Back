import { SequelizeModuleOptions } from '@nestjs/sequelize';
import { Logger } from '@nestjs/common';
import { APP_CONFIG } from './app.config';

// sequelize module configurations
const moduleConfig: SequelizeModuleOptions = {
  dialect: 'postgres',
  host: process.env.PG_HOST,
  port: +process.env.PG_PORT,
  username: process.env.PG_USERNAME,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
  pool: {
    min: +(process.env.PG_POOL_MIN || 0),
    max: +(process.env.PG_POOL_MAX || 10),
  },
  logging: APP_CONFIG.env === 'development' && ((sql) => Logger.log(sql, 'Sequelize')),
  ssl: true,
  autoLoadModels: true,
  synchronize: false,
};

/**
 * sequelize configurations
 */
export const SEQUELIZE_CONFIG = {
  moduleConfig,
};
