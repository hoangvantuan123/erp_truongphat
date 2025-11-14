// src/common/logger/typeorm-logger.ts

import { Logger as TypeOrmLoggerInterface, QueryRunner } from 'typeorm';
import { Logger as WinstonLogger } from 'winston';

export class TypeOrmLogger implements TypeOrmLoggerInterface {
    constructor(private readonly logger: WinstonLogger) { }

    logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner) {
        this.logger.info(`[TypeORM QUERY] ${query} -- ${this.stringifyParams(parameters)}`);
    }

    logQueryError(error: string, query: string, parameters?: any[], queryRunner?: QueryRunner) {
        this.logger.error(`[TypeORM ERROR] ${error} - ${query} -- ${this.stringifyParams(parameters)}`);
    }

    logQuerySlow(time: number, query: string, parameters?: any[], queryRunner?: QueryRunner) {
        this.logger.warn(`[TypeORM SLOW QUERY] ${time}ms - ${query} -- ${this.stringifyParams(parameters)}`);
    }

    logSchemaBuild(message: string, queryRunner?: QueryRunner) {
        this.logger.info(`[TypeORM SCHEMA] ${message}`);
    }

    logMigration(message: string, queryRunner?: QueryRunner) {
        this.logger.info(`[TypeORM MIGRATION] ${message}`);
    }

    log(level: 'log' | 'info' | 'warn', message: any, queryRunner?: QueryRunner) {
        switch (level) {
            case 'log':
            case 'info':
                this.logger.info(`[TypeORM] ${message}`);
                break;
            case 'warn':
                this.logger.warn(`[TypeORM] ${message}`);
                break;
        }
    }

    private stringifyParams(parameters?: any[]): string {
        try {
            return JSON.stringify(parameters);
        } catch {
            return '';
        }
    }
}
