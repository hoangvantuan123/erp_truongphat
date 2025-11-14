import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as oracledb from 'oracledb';
import 'dotenv/config';

export const databaseConfig1: TypeOrmModuleOptions = {
  type: 'oracle',
  username: 'mty',
  password: 'my',
  serviceName: 'ITMVMES',
  extra: {
    connectString: '192.168.3ITMVMES',
    user: 'mighty',
    password: 'mighty',
    role: oracledb.SYSDBA,
    externalAuth: false,
    poolMax: 200,
    poolMin: 20,
    poolIncrement: 20,
    poolTimeout: 60,
  },
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: false,
  logging: true,
};


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

export const sqlServerITMVCommon: TypeOrmModuleOptions = {
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
