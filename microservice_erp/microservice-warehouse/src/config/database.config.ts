import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import 'dotenv/config';
import { createLogger } from 'winston';
import { TypeOrmLogger } from 'src/common/logger/typeorm-logger';
import { createWinstonLoggerOptions } from 'src/logger.config';
const winstonLogger = createLogger(createWinstonLoggerOptions('microservice-warehouse'));


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
    connectionTimeout: 1200000,  // Tăng thời gian chờ kết nối lên 20 phút
    requestTimeout: 1200000,  // Tăng thời gian chờ yêu cầu lên 20 phút
    max: 1000,  // Số kết nối tối đa
    min: 10,  // Số kết nối tối thiểu
    idleTimeoutMillis: 600000,  // Tăng thời gian chờ cho kết nối nhàn rỗi lên 10 phút
  },
  maxQueryExecutionTime: 1200000,  // Giới hạn thời gian thực thi query là 20 phút
};
