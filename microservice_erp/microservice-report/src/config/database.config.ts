import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import 'dotenv/config';
import { createLogger } from 'winston';
import { TypeOrmLogger } from 'src/common/logger/typeorm-logger';
import { createWinstonLoggerOptions } from 'src/logger.config';
const winstonLogger = createLogger(createWinstonLoggerOptions('microservice-hr'));


export const sqlServerITMV: TypeOrmModuleOptions = {
  type: 'mssql',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : undefined,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: false,
  logging: true,
  cache: true,
  logger: new TypeOrmLogger(winstonLogger),
  extra: {
    trustServerCertificate: false,
    encrypt: false,
    connectionTimeout: 1200000,
    requestTimeout: 1200000,
    max: 1000,
    min: 10,
    idleTimeoutMillis: 600000,
  },
  maxQueryExecutionTime: 1200000,
};


export const sqlServerITMVCOMMON: TypeOrmModuleOptions = {
  type: 'mssql',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : undefined,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE_COMMON,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: false,
  logging: true,
  cache: true,
  extra: {
    trustServerCertificate: true,
    encrypt: false,
    connectionTimeout: 15000,
    max: 100,
    min: 10,
    idleTimeoutMillis: 30000,
    requestTimeout: 30000
  },
  maxQueryExecutionTime: 15000
};