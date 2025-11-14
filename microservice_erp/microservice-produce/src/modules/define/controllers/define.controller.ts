import {
    Controller,
    Get,
    Query,
    BadRequestException,
    HttpException,
    HttpStatus,
    UnauthorizedException,
    Post,
    Body,
    Req,
    Delete
} from '@nestjs/common';
import { SimpleQueryResult } from 'src/common/interfaces/simple-query-result.interface';
import { jwtConstants } from 'src/config/security.config';
import * as jwt from 'jsonwebtoken';
import { Request } from 'express';
import { DatabaseService } from 'src/common/database/sqlServer/ITMV/database.service';
import { ERPDefine } from '../entities/define.entity';
import { DefineService } from '../services/define.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RpcException } from '@nestjs/microservices';
@Controller()
export class DefinesController {
    constructor(private readonly defineService: DefineService,

        private readonly databaseService: DatabaseService
    ) { }
    @MessagePattern('all-defines')
    async findAll(
        @Payload() data: { authorization: string }) {
        const { authorization } = data;

        if (!authorization) {
             throw new RpcException({
                statusCode: 401,
                message: 'Invalid or expired token.',
            });
        }

        const token = authorization.split(' ')[1];
        if (!token) {
             throw new RpcException({
                statusCode: 401,
                message: 'Invalid or expired token.',
            });
        }

        try {
            const decodedToken = jwt.verify(token, jwtConstants.secret) as {
                UserId: any;
                EmpSeq: any;
                UserSeq: any;
                CompanySeq: any;
            };

            const user = await this.databaseService.checkAuthUserSeq(
                decodedToken.UserSeq,
            );
            if (!user) {
                 throw new RpcException({
                statusCode: 401,
                message: 'Invalid or expired token.',
            });
            }
            return this.defineService.findAll();
        } catch (error) {
             throw new RpcException({
                statusCode: 401,
                message: 'Invalid or expired token.',
            });
        }
    }


    @MessagePattern('add-defines')
    async create(

        @Payload() data: { records: ERPDefine[], authorization: string }
    ): Promise<SimpleQueryResult> {
        const { records, authorization } = data;

        if (!authorization) {
             throw new RpcException({
                statusCode: 401,
                message: 'Invalid or expired token.',
            });
        }

        const token = authorization.split(' ')[1];
        if (!token) {
             throw new RpcException({
                statusCode: 401,
                message: 'Invalid or expired token.',
            });
        }

        try {
            const decodedToken = jwt.verify(token, jwtConstants.secret) as {
                UserId: any;
                EmpSeq: any;
                UserSeq: any;
                CompanySeq: any;
            };

            const result = await this.defineService.addMultiple(
                records,
                decodedToken.UserSeq,
            );
            return {
                success: true,
                message: result.message,
                data: result.data,
            };
        } catch (error) {
             throw new RpcException({
                statusCode: 401,
                message: 'Invalid or expired token.',
            });
        }
    }



    @MessagePattern('update-defines')
    async update(
        @Payload() data: { records: any[], authorization: string }
    ): Promise<SimpleQueryResult> {
        const { records, authorization } = data;

        if (!authorization) {
             throw new RpcException({
                statusCode: 401,
                message: 'Invalid or expired token.',
            });
        }

        const token = authorization.split(' ')[1];
        if (!token) {
             throw new RpcException({
                statusCode: 401,
                message: 'Invalid or expired token.',
            });
        }

        try {
            const decodedToken = jwt.verify(token, jwtConstants.secret) as {
                UserId: any;
                EmpSeq: any;
                UserSeq: any;
                CompanySeq: any;
            };

            const result = await this.defineService.updateMultiple(
                records,
                decodedToken.UserSeq,
            );
            return {
                success: true,
                message: result.message,
                data: result.data,
            };
        } catch (error) {
            console.log('error', error)
             throw new RpcException({
                statusCode: 401,
                message: 'Invalid or expired token.',
            });
        }
    }

    @MessagePattern('delete-defines')
    async delete(@Payload() data: { ids: number[], authorization: string }): Promise<any> {
        const { ids, authorization } = data;

        if (!authorization) {
             throw new RpcException({
                statusCode: 401,
                message: 'Invalid or expired token.',
            });
        }

        const token = authorization.split(' ')[1];
        if (!token) {
             throw new RpcException({
                statusCode: 401,
                message: 'Invalid or expired token.',
            });
        }

        try {
            const decodedToken = jwt.verify(token, jwtConstants.secret) as {
                UserId: any;
                EmpSeq: any;
                UserSeq: any;
                CompanySeq: any;
            };
            const user = await this.databaseService.checkAuthUserSeq(
                decodedToken.UserSeq,
            );
            if (!user) {
                 throw new RpcException({
                statusCode: 401,
                message: 'Invalid or expired token.',
            });
            }

            const result =
                await this.defineService.delete(ids);
            if (result.success) {
                return {
                    success: true,
                    message: result.message,
                };
            } else {
                return {
                    success: false,
                    message: result.message,
                };
            }
        } catch (error) {
             throw new RpcException({
                statusCode: 401,
                message: 'Invalid or expired token.',
            });
        }
    }


    @MessagePattern('help-query-define')
    async getHelpQuery(@Payload() data: { authorization: string }) {
        const { authorization } = data;

        if (!authorization) {
             throw new RpcException({
                statusCode: 401,
                message: 'Invalid or expired token.',
            });
        }

        const token = authorization.split(' ')[1];
        if (!token) {
             throw new RpcException({
                statusCode: 401,
                message: 'Invalid or expired token.',
            });
        }

        try {
            const decodedToken = jwt.verify(token, jwtConstants.secret) as {
                UserId: any;
                EmpSeq: any;
                UserSeq: any;
                CompanySeq: any;
            };

            const user = await this.databaseService.checkAuthUserSeq(
                decodedToken.UserSeq,
            );
            if (!user) {
                 throw new RpcException({
                statusCode: 401,
                message: 'Invalid or expired token.',
            });
            }
            return this.defineService.getHelpQuery();
        } catch (error) {
             throw new RpcException({
                statusCode: 401,
                message: 'Invalid or expired token.',
            });
        }
    }



}
