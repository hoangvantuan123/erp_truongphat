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
import { MetadataResponse, MetadataResponse2 } from '../interface/response';
import { Observable, from, catchError, map, of } from 'rxjs';
import { PdsfcWorkReportService } from '../services/pdsfcWorkReport.service';
@Controller()
export class PdsfcWorkReportController {
    constructor(private readonly pdsfcWorkReportService: PdsfcWorkReportService, private readonly databaseService: DatabaseService) { }

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
    private handleGrpcRequestV3(
        request: any,
        serviceMethod: (
            result: any[],
            companySeq: number,
            userSeq: number,
        ) => Observable<any>
    ): Observable<MetadataResponse> {
        try {
            const decodedToken = this.validateToken(request.metadata);

            return serviceMethod(
                request.result,
                decodedToken.CompanySeq,
                decodedToken.UserSeq,
            ).pipe(
                map(queryResult => {
                    console.log('queryResult', queryResult);
                    if (!queryResult?.success) {
                        return {
                            status: false,
                            message: queryResult?.errors?.length
                                ? queryResult.errors.map((e: any) =>
                                    typeof e === 'string'
                                        ? e
                                        : e?.result || JSON.stringify(e)
                                ).join(", ")
                                : "Unknown error",
                            data: '',
                            errors: JSON.stringify(queryResult.errors || ["Unknown error"]),
                        };
                    }

                    return {
                        status: true,
                        message: "Query successful",
                        data: JSON.stringify(queryResult.data),
                        errors: [],
                    };
                }),
                catchError(error => {
                    return of({
                        status: false,
                        message: error?.message || 'Internal server error',
                        data: '',
                        errors: JSON.stringify(error.errors || ["Internal error"]),
                    });
                })
            );
        } catch (error: any) {
            return of({
                status: false,
                message: error?.message || 'Internal server error',
                data: '',
                errors: JSON.stringify(error.errors || ["Internal error"]),
            });
        }
    }

    private handleGrpcRequestV4(
        request: any,
        serviceMethod: (
            result: any[],
            header: any,
            companySeq: number,
            userSeq: number,
        ) => Observable<any>
    ): Observable<MetadataResponse> {
        try {
            const decodedToken = this.validateToken(request.metadata);
            return serviceMethod(
                request.result,
                request.header,
                decodedToken.CompanySeq,
                decodedToken.UserSeq,
            ).pipe(
                map(queryResult => {

                    if (!queryResult?.success) {

                        return {
                            status: false,
                            message: queryResult?.errors?.length
                                ? queryResult.errors.join(", ")
                                : "Unknown error",
                            data: '',
                            errors: JSON.stringify(queryResult.errors || ["Unknown error"]),
                        };
                    }

                    return {
                        status: true,
                        message: "Query successful",
                        data: JSON.stringify(queryResult.data),
                    };
                }),
                catchError(error => {

                    return of({
                        status: false,
                        message: error.message || 'Internal server error',
                        data: '',
                        errors: JSON.stringify(error.errors || ["Internal error"]),
                    });
                })
            );
        } catch (error) {

            return of({
                status: false,
                message: error.message || 'Internal server error',
                data: '',
                errors: JSON.stringify(error.errors || ["Internal error"]),
            });
        }
    }
    @GrpcMethod('PdsfcWorkReportService', 'SPDSFCWorkReportQ2')
    SPDSFCWorkReportQ(request: any[]): Observable<MetadataResponse> {
        return this.handleGrpcRequest(request, this.pdsfcWorkReportService.SPDSFCWorkReportQ.bind(this.pdsfcWorkReportService));
    }
    @GrpcMethod('PdsfcWorkReportService', 'SPDSFCWorkReportMatQCheck')
    SPDSFCWorkReportMatQCheck(request: any): Observable<MetadataResponse> {
        return this.handleGrpcRequest(request, this.pdsfcWorkReportService.SPDSFCWorkReportMatQCheck.bind(this.pdsfcWorkReportService));
    }
    @GrpcMethod('PdsfcWorkReportService', 'SCOMSourceDailyQ')
    SCOMSourceDailyQ(request: any[]): Observable<MetadataResponse> {
        return this.handleGrpcRequest(request, this.pdsfcWorkReportService.SCOMSourceDailyQ.bind(this.pdsfcWorkReportService));
    }
    @GrpcMethod('PdsfcWorkReportService', 'SPDSFCWorkReportMatQ')
    SPDSFCWorkReportMatQ(request: any[]): Observable<MetadataResponse> {
        return this.handleGrpcRequest(request, this.pdsfcWorkReportService.SPDSFCWorkReportMatQ.bind(this.pdsfcWorkReportService));
    }
    @GrpcMethod('PdsfcWorkReportService', 'SPDSFCWorkReportToolQ')
    SPDSFCWorkReportToolQ(request: any[]): Observable<MetadataResponse> {
        return this.handleGrpcRequest(request, this.pdsfcWorkReportService.SPDSFCWorkReportToolQ.bind(this.pdsfcWorkReportService));
    }
    @GrpcMethod('PdsfcWorkReportService', 'SPDSFCWorkReportNonWorkQ')
    SPDSFCWorkReportNonWorkQ(request: any[]): Observable<MetadataResponse> {
        return this.handleGrpcRequest(request, this.pdsfcWorkReportService.SPDSFCWorkReportNonWorkQ.bind(this.pdsfcWorkReportService));
    }
    @GrpcMethod('PdsfcWorkReportService', 'SPDSFCWorkReportWorkEmpQ')
    SPDSFCWorkReportWorkEmpQ(request: any[]): Observable<MetadataResponse> {
        return this.handleGrpcRequest(request, this.pdsfcWorkReportService.SPDSFCWorkReportWorkEmpQ.bind(this.pdsfcWorkReportService));
    }
    @GrpcMethod('PdsfcWorkReportService', 'SLGInOutDailyQ')
    SLGInOutDailyQ(request: any[]): Observable<MetadataResponse> {
        return this.handleGrpcRequest(request, this.pdsfcWorkReportService.SLGInOutDailyQ.bind(this.pdsfcWorkReportService));
    }
    @GrpcMethod('PdsfcWorkReportService', 'SLGInOutDailyItemQ')
    SLGInOutDailyItemQ(request: any[]): Observable<MetadataResponse> {
        return this.handleGrpcRequest(request, this.pdsfcWorkReportService.SLGInOutDailyItemQ.bind(this.pdsfcWorkReportService));
    }



    @GrpcMethod('PdsfcWorkReportService', 'SPDSFCWorkReportAUD')
    AOutReqItem(request: any[]): Observable<MetadataResponse> {

        return this.handleGrpcRequestV3(request, this.pdsfcWorkReportService.AutoCheckAUD.bind(this.pdsfcWorkReportService));
    }

    @GrpcMethod('PdsfcWorkReportService', 'SPDSFCWorkReportMatAUD')
    AutoCheck2AUD(request: any[]): Observable<MetadataResponse> {
        return this.handleGrpcRequestV3(request, this.pdsfcWorkReportService.AutoCheck2AUD.bind(this.pdsfcWorkReportService));
    }
    @GrpcMethod('PdsfcWorkReportService', 'SPDSFCWorkReportWorkEmpAUD')
    AutoCheck3AUD(request: any[]): Observable<MetadataResponse> {
        return this.handleGrpcRequestV3(request, this.pdsfcWorkReportService.AutoCheck3AUD.bind(this.pdsfcWorkReportService));
    }
    @GrpcMethod('PdsfcWorkReportService', 'SLGLotNoMasterAUD')
    AutoCheck4AUD(request: any[]): Observable<MetadataResponse> {
        return this.handleGrpcRequestV4(request, this.pdsfcWorkReportService.AutoCheck4AUD.bind(this.pdsfcWorkReportService));
    }
    @GrpcMethod('PdsfcWorkReportService', 'SPDSFCWorkReportNonWorkAUD')
    AutoCheck5AUD(request: any[]): Observable<MetadataResponse> {
        return this.handleGrpcRequestV3(request, this.pdsfcWorkReportService.AutoCheck5AUD.bind(this.pdsfcWorkReportService));
    }
    @GrpcMethod('PdsfcWorkReportService', 'SLGInOutDailyD')
    AutoCheck4DD(request: any[]): Observable<MetadataResponse> {
        return this.handleGrpcRequestV3(request, this.pdsfcWorkReportService.AutoCheck4DD.bind(this.pdsfcWorkReportService));
    }
    @GrpcMethod('PdsfcWorkReportService', 'SLGInOutDailyDItem')
    AutoCheck4DDItem(request: any[]): Observable<MetadataResponse> {
        return this.handleGrpcRequestV3(request, this.pdsfcWorkReportService.AutoCheck4DDItem.bind(this.pdsfcWorkReportService));
    }
}