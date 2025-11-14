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
import { ProductService } from '../services/product.service';
import { ERPAddItems } from '../entities/addItems.entity';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RpcException } from '@nestjs/microservices';
@Controller()
export class ProductsController {
    constructor(
        private readonly productService: ProductService,
        private readonly databaseService: DatabaseService
    ) { }

    @MessagePattern('add-items')
    async create(
        @Payload() data: { records: ERPAddItems[], authorization: string }
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

            const result = await this.productService.addMultiple(
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

    @MessagePattern('all-items-seq')
    async findAll(
        @Payload() data: { ItemNoSeq: number, authorization: string }
    ) {
        const { ItemNoSeq, authorization } = data;

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

            return this.productService.findAll(ItemNoSeq);
        } catch (error) {
            throw new RpcException({
                statusCode: 401,
                message: 'Invalid or expired token.',
            });
        }
    }

    @MessagePattern('update-add-items')
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

            const result = await this.productService.updateMultiple(
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


    @MessagePattern('delete-add-items')
    async delete(
        @Payload() data: { ids: number[], authorization: string }
    ): Promise<any> {
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
                await this.productService.delete(ids);
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
}
