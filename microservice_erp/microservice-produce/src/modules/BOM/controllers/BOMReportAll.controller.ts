import {
    Body,
    Controller,
    Get,
    ParseFilePipeBuilder,
    Post,
    UploadedFile,
    UseInterceptors,
    UploadedFiles,
    UnauthorizedException,
    Req,
    Param,
    Res,
    HttpStatus,
    Query,
    HttpException
} from '@nestjs/common';
import { BOMService } from '../services/bom.service';
import { Response, Express, Request } from 'express';
import { jwtConstants } from 'src/config/security.config';
import { SimpleQueryResult } from 'src/common/interfaces/simple-query-result.interface';
import * as jwt from 'jsonwebtoken';
import { DatabaseService } from 'src/common/database/sqlServer/ITMV/database.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RpcException } from '@nestjs/microservices';
import { BOMReportAllService } from '../services/reportBOMAll.service';

@Controller()
export class BOMReportAllController {
    constructor(private readonly BOMReportAllService: BOMReportAllService, private readonly databaseService: DatabaseService) { }


    @MessagePattern('SPD-BOM-Report-All-Query')
    async _SPDBOMReportAllQuery(
        @Payload() data: { result: any, authorization: string }
    ): Promise<SimpleQueryResult> {
        const { result, authorization } = data;
        console.log('result ', result)
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
            return await this.BOMReportAllService._SPDBOMReportAllQuery(result, decodedToken.CompanySeq, decodedToken.UserSeq);
        } catch (error) {
            throw new RpcException({
                statusCode: 401,
                message: 'Invalid or expired token.',
            });
        }

    }
}