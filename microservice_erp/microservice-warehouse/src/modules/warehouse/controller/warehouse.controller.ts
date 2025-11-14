import { Controller, Get, Query, Post, Body, Req, UnauthorizedException, HttpException, HttpStatus } from '@nestjs/common';
import { SimpleQueryResult } from 'src/common/interfaces/simple-query-result.interface';
import { Request } from 'express';
import { jwtConstants } from 'src/config/security.config';
import * as jwt from 'jsonwebtoken';
import { WarehouseService } from '../service/warehouse.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RpcException } from '@nestjs/microservices';
@Controller()
export class WarehouseController {
    constructor(private readonly warehouseService: WarehouseService) { }

    @MessagePattern('sda-wh-main-query')
    async SDAWHMainQueryWEB(
        @Payload() data: { result: any[], authorization: string }
    ): Promise<SimpleQueryResult> {

        const { result, authorization } = data;
        console.log("SDAWHMainQueryWEB", result)
        if (!authorization) {
            throw new UnauthorizedException(
                'You do not have permission to access this API.',
            );
        }
        const token = authorization.split(' ')[1];

        if (!token) {
            throw new RpcException({
                statusCode: 401,
                message: 'Invalid or expired token.',
            });
        }

        try {
            const decodedToken = jwt.verify(token, jwtConstants.secret) as { UserId: any, EmpSeq: any, UserSeq: any, CompanySeq: any };

            return await this.warehouseService.SDAWHMainQueryWEB(result, decodedToken.CompanySeq, 6, decodedToken.UserSeq);
        } catch (error) {
            throw new RpcException({
                statusCode: 401,
                message: 'Invalid or expired token.',
            });
        }

    }
    @MessagePattern('sda-wh-sub-auto-create')
    async SDAWHSubAutoCreate(
        @Payload() data: { result: any[], authorization: string }
    ): Promise<SimpleQueryResult> {
        const { result, authorization } = data;
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
            const decodedToken = jwt.verify(token, jwtConstants.secret) as { UserId: any, EmpSeq: any, UserSeq: any, CompanySeq: any };

            return await this.warehouseService.SDAWHSubAutoCreate(result, decodedToken.CompanySeq, decodedToken.UserSeq);
        } catch (error) {
            throw new RpcException({
                statusCode: 401,
                message: 'Invalid or expired token.',
            });
        }

    }

    @MessagePattern('sda-wh-auto-delete')
    async SDAWHAutoCheckDelete(
        @Payload() data: { result: any[], authorization: string }
    ): Promise<any> {

        const { result, authorization } = data;
        console.log("SDAWHAutoCheckDelete", result)
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
            const decodedToken = jwt.verify(token, jwtConstants.secret) as { UserId: any, EmpSeq: any, UserSeq: any, CompanySeq: any };
            return await this.warehouseService.SDAWHCheckDelete(result, decodedToken.CompanySeq, decodedToken.UserSeq);
        } catch (error) {
            throw new RpcException({
                statusCode: 401,
                message: 'Invalid or expired token.',
            });
        }

    }
    @MessagePattern('sda-wh-auto-update')
    async SDAWHAutoCheckUpdate(
        @Payload() data: { result: any[], authorization: string }
    ): Promise<SimpleQueryResult> {
        const { result, authorization } = data;
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
            const decodedToken = jwt.verify(token, jwtConstants.secret) as { UserId: any, EmpSeq: any, UserSeq: any, CompanySeq: any };

            return await this.warehouseService.SDAWHCheckUpdate(result, decodedToken.CompanySeq, decodedToken.UserSeq,);
        } catch (error) {
            throw new RpcException({
                statusCode: 401,
                message: 'Invalid or expired token.',
            });
        }

    }

}
