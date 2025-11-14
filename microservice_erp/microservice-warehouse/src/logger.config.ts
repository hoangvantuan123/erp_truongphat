import * as winston from 'winston';
import * as fs from 'fs';
import * as path from 'path';
import 'dotenv/config';

export function createWinstonLoggerOptions(serviceName = 'default-service'): winston.LoggerOptions {
    const now = new Date();
    const year = now.getFullYear().toString();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');

    const env = process.env.NODE_ENV || 'dev';

    const baseLogDir = process.env.LOG_STORAGE || 'logs';

    if (!baseLogDir) {
        throw new Error('Missing environment variable: LOG_STORAGE');
    }

    const logDir = path.join(baseLogDir, env, serviceName, year, month, day);
    fs.mkdirSync(logDir, { recursive: true });

    const logFilePath = path.join(logDir, 'server.log');

    return {
        level: 'info',
        format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.printf(({ timestamp, level, message }) => {
                return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
            }),
        ),
        transports: [
            new winston.transports.File({ filename: logFilePath }),
            ...(env !== 'prod'
                ? [new winston.transports.Console({
                    format: winston.format.combine(
                        winston.format.colorize(),
                        winston.format.simple(),
                    ),
                })]
                : []),
        ],
    };
}
