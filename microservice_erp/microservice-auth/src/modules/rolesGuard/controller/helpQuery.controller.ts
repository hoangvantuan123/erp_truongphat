import {
    Controller,
    Post,
    Body,
    Req,
    UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { jwtConstants } from 'src/config/security.config';
import * as jwt from 'jsonwebtoken';
import { SimpleQueryResult } from 'src/common/interfaces/simple-query-result.interface';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RpcException } from '@nestjs/microservices';
import { HelpQueryService } from '../service/helpQuery';
@Controller()
export class HelpQueryController {
    constructor(private readonly helpQueryService: HelpQueryService) { }

    @MessagePattern('help-root-menu')
    async getHelpRootMenu(
        @Payload() data: { value?: string, page: number, limit?: number, authorization: string }
    ): Promise<any> {
        const { value, page, limit = 2000
            , authorization } = data;
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


            const result = await this.helpQueryService.getHelpRootMenu(value);

            return {
                success: true,
                message: 'Data retrieved successfully',
                data: result.data,
                total: result.total,
                totalPages: result.totalPages,
                currentPage: page,
            };

        } catch (error) {
            return {
                success: false,
                message: error.message || 'Error fetching data',
            };
        }
    }

    @MessagePattern('help-menu')
    async getHelpMenu(
        @Payload() data: { value?: string, page: number, limit?: number, authorization: string }
    ): Promise<any> {
        const { value, page, limit = 2000
            , authorization } = data;
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
            const result = await this.helpQueryService.getHelpMenu(value);

            return {
                success: true,
                message: 'Data retrieved successfully',
                data: result.data,
                total: result.total,
                totalPages: result.totalPages,
                currentPage: page,
            };

        } catch (error) {
            return {
                success: false,
                message: error.message || 'Error fetching data',
            };
        }
    }
    @MessagePattern('help-users')
    async getHelpUsers(
        @Payload() data: { value?: string, page: number, limit?: number, authorization: string }
    ): Promise<any> {
        const { value, page, limit = 2000
            , authorization } = data;
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
            const result = await this.helpQueryService.getHelpUsers(page, value);

            return {
                success: true,
                message: 'Data retrieved successfully',
                data: result.data,
                total: result.total,
                totalPages: result.totalPages,
                currentPage: page,
            };

        } catch (error) {
            return {
                success: false,
                message: error.message || 'Error fetching data',
            };
        }
    }

}
