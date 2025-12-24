// libs/logger/src/logger.config.ts
import * as winston from 'winston';
import * as fs from 'fs';
import * as path from 'path';

function getLogFilePath(): string {
    const now = new Date();
    const year = now.getFullYear().toString();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const logDir = path.join('logs', year, month, day);

    fs.mkdirSync(logDir, { recursive: true });

    return path.join(logDir, 'server.log');
}

export const winstonLoggerOptions: winston.LoggerOptions = {
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => {
            return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
        }),
    ),
    transports: [
        new winston.transports.File({
            filename: getLogFilePath(),
        }),
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple(),
            ),
        }),
    ],
};
