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
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { DatabaseService } from 'src/common/database/sqlServer/ITMV/database.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PdsfcListService } from '../services/pdsfcList.service';
import { MetadataResponse } from '../interface/response';
import { Observable, from, catchError, map, of } from 'rxjs';
@Controller()
export class PdsfcListController {
    constructor(private readonly pdsfcListService: PdsfcListService, private readonly databaseService: DatabaseService) { }

    private validateToken(metadata: any): { UserId: number; EmpSeq: number; UserSeq: number; CompanySeq: number } {
        if (!metadata || !metadata["authorization"]) {
            throw new RpcException({ code: 16, message: 'Missing authorization token' });
        }

        const token = metadata["authorization"].split(' ')[1];
        if (!token) {
            throw new RpcException({ code: 16, message: 'Invalid or expired token' });
        }

        try {
            return jwt.verify(token, jwtConstants.secret) as any;
        } catch (error) {
            throw new RpcException({ code: 16, message: 'Invalid or expired token' });
        }
    }
    private handleGrpcRequest(
        request: any,
        serviceMethod: (result: any, companySeq: number, userSeq: number) => Observable<any>
    ): Observable<MetadataResponse> {
        try {
            const decodedToken = this.validateToken(request.metadata);

            return from(serviceMethod(request.result, decodedToken.CompanySeq, decodedToken.UserSeq)).pipe(
                map(queryResult => {
                    return { status: true, message: "Query successful", data: JSON.stringify(queryResult.data) };
                }),
                catchError(error => {
                    return of({ status: false, message: error.message || 'Internal server error', data: '', errors: JSON.stringify(error.errors) });
                })
            );
        } catch (error) {
            return of({ status: false, message: error.message || 'Internal server error', data: '', errors: JSON.stringify(error.errors) });
        }
    }

    @GrpcMethod('PdsfcListService', 'SPDSFCWorkOrderQ')
    SPDSFCWorkOrderQ(request: any[]): Observable<MetadataResponse> {
        return this.handleGrpcRequest(request, this.pdsfcListService.SPDSFCWorkOrderQ.bind(this.pdsfcListService));
    }
    @GrpcMethod('PdsfcListService', 'SPDSFCMatProgressListQ')
    SPDSFCMatProgressListQ(request: any[]): Observable<MetadataResponse> {
        return this.handleGrpcRequest(request, this.pdsfcListService.SPDSFCMatProgressListQ.bind(this.pdsfcListService));
    }
    @GrpcMethod('PdsfcListService', 'SPDSFCWorkReportQ')
    SPDSFCWorkReportQ(request: any[]): Observable<MetadataResponse> {
        return this.handleGrpcRequest(request, this.pdsfcListService.SPDSFCWorkReportQ.bind(this.pdsfcListService));
    }
}