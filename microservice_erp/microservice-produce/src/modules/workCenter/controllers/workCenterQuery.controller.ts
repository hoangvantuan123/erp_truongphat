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
import { MessagePattern, Payload } from '@nestjs/microservices';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { WorkCenterQueryService } from '../services/workCenterQuery.service';
import { WokCenterQRequest } from '../interface/request';
import { MetadataResponse } from '../interface/response';
@Controller()
export class WorkCenterQueryController {
    constructor(
        private readonly workCenterQueryService: WorkCenterQueryService,
        private readonly databaseService: DatabaseService
    ) { }
    @GrpcMethod('WorkCenterQueryService', 'workCenterQ')
    async SPDBaseWorkCenterQuery(request: WokCenterQRequest): Promise<MetadataResponse> {
        try {
            if (!request || !request.metadata || !request.metadata["authorization"]) {
                throw new RpcException({
                    code: 16,
                    message: 'Missing authorization token',
                });
            }

            const { result, metadata } = request;

            const token = metadata["authorization"].split(' ')[1];

            if (!token) {
                throw new RpcException({
                    code: 16,
                    message: 'Invalid or expired token',
                });
            }

            // Xác thực JWT
            let decodedToken: { UserId: number; EmpSeq: number; UserSeq: number; CompanySeq: number };
            try {
                decodedToken = jwt.verify(token, jwtConstants.secret) as any;
            } catch (error) {
                throw new RpcException({
                    code: 16,
                    message: 'Invalid or expired token',
                });
            }


            const queryResult = await this.workCenterQueryService._SPDBaseWorkCenterQuery_WEB(
                result,
                decodedToken.CompanySeq,
                decodedToken.UserSeq
            );

            return {
                status: true,
                message: "Query successful",
                data: JSON.stringify(queryResult.data),
            };
        } catch (error) {
            return {
                status: false,
                message: error.message || 'Internal server error',
                data: '',
            };
        }
    }
}
