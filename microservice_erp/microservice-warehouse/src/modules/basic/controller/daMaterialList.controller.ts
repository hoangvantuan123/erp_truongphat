import { Controller, Get, Query, Post, Body, Req, UnauthorizedException, HttpException, HttpStatus } from '@nestjs/common';
import { SimpleQueryResult } from 'src/common/interfaces/simple-query-result.interface';
import { Request } from 'express';
import { jwtConstants } from 'src/config/security.config';
import * as jwt from 'jsonwebtoken';
import { DaMaterialListService } from '../service/daMaterialList.service';
import { RpcException } from '@nestjs/microservices';
import { MessagePattern, Payload } from '@nestjs/microservices';
@Controller()
export class DaMaterialListController {
    constructor(private readonly caMaterialListService: DaMaterialListService) { }



    @MessagePattern('sda-wh-item-list-base')
    async SDAWHItemListBaseQuery(
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

            return this.caMaterialListService.SDAWHItemListBaseQuery(result, decodedToken.CompanySeq, 6, decodedToken.UserSeq);
        } catch (error) {
             throw new RpcException({
                statusCode: 401,
                message: 'Invalid or expired token.',
            });
        }

    }

    @MessagePattern('da-material-list-create')
    async AutoCheckA(
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

            return this.caMaterialListService.AutoCheckA(result, decodedToken.CompanySeq, decodedToken.UserSeq);
        } catch (error) {
             throw new RpcException({
                statusCode: 401,
                message: 'Invalid or expired token.',
            });
        }

    }
    @MessagePattern('da-material-list-update')
    async AutoCheckU(
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

            return this.caMaterialListService.AutoCheckU(result, decodedToken.CompanySeq, decodedToken.UserSeq);
        } catch (error) {
             throw new RpcException({
                statusCode: 401,
                message: 'Invalid or expired token.',
            });
        }
    }
    @MessagePattern('da-material-list-delete')
    async AutoCheckD(
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

            return this.caMaterialListService.AutoCheckD(result, decodedToken.CompanySeq, decodedToken.UserSeq);
        } catch (error) {
             throw new RpcException({
                statusCode: 401,
                message: 'Invalid or expired token.',
            });
        }

    }


}
