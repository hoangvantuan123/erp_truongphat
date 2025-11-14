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
import { Response, Express, Request } from 'express';
import { jwtConstants } from 'src/config/security.config';
import { SimpleQueryResult } from 'src/common/interfaces/simple-query-result.interface';
import * as jwt from 'jsonwebtoken';
import { DatabaseService } from 'src/common/database/sqlServer/ITMV/database.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RpcException } from '@nestjs/microservices';
import { PdmpsProdQueryService } from '../services/pdmpsProdQuery.service';
import { PdmpsProdUItemListQueryService } from '../services/pdmpsProdItemListQuery.service';

@Controller()
export class PdmpsProdItemListQueryController {
    constructor(
        private readonly pdmpsProdUItemListQueryService: PdmpsProdUItemListQueryService,
        private readonly databaseService: DatabaseService) { }


    @MessagePattern('SPD-MPS-Prod-Req-Item-List-Query')
    async _SPDMPSProdReqListQuery(
        @Payload() data: { result: any, authorization: string }
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
            return await this.pdmpsProdUItemListQueryService._SPDMPSProdReqItemListQuery(result, decodedToken.CompanySeq, decodedToken.UserSeq);
        } catch (error) {
            throw new RpcException({
                statusCode: 401,
                message: 'Invalid or expired token.',
            });
        }

    }


}