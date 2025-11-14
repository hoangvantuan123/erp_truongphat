import { Controller, Get, Query, Post, Body, Req, UnauthorizedException, HttpException, HttpStatus } from '@nestjs/common';
import { SimpleQueryResult } from 'src/common/interfaces/simple-query-result.interface';
import { CodeHelpQueryService } from '../service/codeHelpQuery.service';
import * as jwt from 'jsonwebtoken';
import { Request } from 'express';
import { jwtConstants } from 'src/config/security.config';

import { MessagePattern, Payload } from '@nestjs/microservices';
import { RpcException } from '@nestjs/microservices';
@Controller()
export class CodeHelpQueryController {
    constructor(private readonly codeHelpQueryService: CodeHelpQueryService) { }

    @MessagePattern('code-help-query')
    async checkItemLotExists(

        @Payload() data: { codeHelpSeq: string, keyword: string, param1: string, param2: string, param3: string, param4: string, conditionSeq: string, pageCount: number, pageSize: number, subConditionSql: string, accUnit: string, bizUnit: number, factUnit: number, authorization: string }
    ): Promise<SimpleQueryResult> {


        const { codeHelpSeq, keyword, param1, param2, param3, param4, conditionSeq, pageCount, pageSize, subConditionSql, accUnit, bizUnit, factUnit, authorization } = data;
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

            const result = await this.codeHelpQueryService._SCACodeHelpQuery(
                'Q',
                6,
                codeHelpSeq,
                decodedToken.CompanySeq,
                keyword,
                param1,
                param2,
                param3,
                param4,
                conditionSeq,
                pageCount,
                pageSize,
                subConditionSql,
                accUnit,
                bizUnit,
                factUnit,
                307,
                307,
                decodedToken.EmpSeq,
                decodedToken.UserSeq
            );
            return result;
        } catch (error) {
             throw new RpcException({
                statusCode: 401,
                message: 'Invalid or expired token.',
            });
        }

    }


    @Get('/search-by')
    async searchBy(
        @Query('codeHelpSeq') codeHelpSeq: string,
        @Query('keyword') keyword: string,
        @Query('param1') param1: string,
        @Query('param2') param2: string,
        @Query('param3') param3: string,
        @Query('param4') param4: string,
        @Query('conditionSeq') conditionSeq: string,
        @Query('pageCount') pageCount: number,
        @Query('pageSize') pageSize: number,
        @Query('subConditionSql') subConditionSql: string,
        @Query('accUnit') accUnit: string,
        @Query('bizUnit') bizUnit: number,
        @Query('factUnit') factUnit: number,
        @Req() req: Request
    ): Promise<SimpleQueryResult> {


        const authHeader = req.headers.authorization;

        if (!authHeader) {
             throw new RpcException({
                statusCode: 401,
                message: 'Invalid or expired token.',
            });
        }

        const token = authHeader.split(' ')[1];

        if (!token) {
             throw new RpcException({
                statusCode: 401,
                message: 'Invalid or expired token.',
            });
        }

        try {
            const decodedToken = jwt.verify(token, jwtConstants.secret) as { UserId: any, EmpSeq: any, UserSeq: any, CompanySeq: any };

            const result = await this.codeHelpQueryService._SCACodeHelpQuery(
                'Q',
                6,
                codeHelpSeq,
                decodedToken.CompanySeq,
                keyword,
                param1,
                param2,
                param3,
                param4,
                conditionSeq,
                1,
                pageSize,
                subConditionSql,
                accUnit,
                bizUnit,
                factUnit,
                307,
                307,
                decodedToken.EmpSeq,
                decodedToken.UserSeq
            );
            return result;
        } catch (error) {
             throw new RpcException({
                statusCode: 401,
                message: 'Invalid or expired token.',
            });
        }

    }
}
