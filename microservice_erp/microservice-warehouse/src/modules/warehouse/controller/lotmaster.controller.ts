import { Controller, Get, Query, Post, Body, Req, UnauthorizedException, HttpException, HttpStatus } from '@nestjs/common';
import { SimpleQueryResult } from 'src/common/interfaces/simple-query-result.interface';
import { Request } from 'express';
import { jwtConstants } from 'src/config/security.config';
import * as jwt from 'jsonwebtoken';
import { LotMasterService } from '../service/lotmaster.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RpcException } from '@nestjs/microservices';
@Controller()
export class LotMasterController {
    constructor(private readonly lotmasterService: LotMasterService) { }

    @MessagePattern('lg-lotno-master-query')
    async SLGLotNoMasterQueryWEB(
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

            return this.lotmasterService.SLGLotNoMasterQueryWEB(result, decodedToken.CompanySeq, 6, decodedToken.UserSeq);
        } catch (error) {
            throw new RpcException({
                statusCode: 401,
                message: 'Invalid or expired token.',
            });
        }

    }

    @MessagePattern('lg-lotno-master-create')
    async SLGLotNoMasterAUD(
        @Payload() data: { result: any[], authorization: string }
    ): Promise<SimpleQueryResult> {
        const { result, authorization } = data;
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

            return this.lotmasterService.SLGLotNoMasterAUD(result, decodedToken.CompanySeq, decodedToken.UserSeq, '');
        } catch (error) {
             throw new RpcException({
                statusCode: 401,
                message: 'Invalid or expired token.',
            });
        }

    }
}
