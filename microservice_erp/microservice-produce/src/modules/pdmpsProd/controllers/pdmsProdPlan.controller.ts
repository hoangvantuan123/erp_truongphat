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
import { PdmsProdPlanService } from '../services/pdmsProdPlan.service';
import { MetadataResponse } from '../interface/response';
import { Observable, from, catchError, map, of } from 'rxjs';
@Controller()
export class PdmpsProdPlanController {
    constructor(private readonly pdmsProdPlanService: PdmsProdPlanService, private readonly databaseService: DatabaseService) { }

    private validateToken(metadata: any): { UserId: number; EmpSeq: number; UserSeq: number; CompanySeq: number, DeptSeq: number } {
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
            deptSeq: number
        ) => Observable<any>
    ): Observable<MetadataResponse> {
        try {
            const decodedToken = this.validateToken(request.metadata);
            return serviceMethod(
                request.result,
                decodedToken.CompanySeq,
                decodedToken.UserSeq,
                decodedToken.DeptSeq
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


    @GrpcMethod('PdmsProdPlanService', 'SPDMPSProdPlanA')
    AOutReqItem(request: any[]): Observable<MetadataResponse> {

        return this.handleGrpcRequestV3(request, this.pdmsProdPlanService.AutoCheckA.bind(this.pdmsProdPlanService));
    }

    @GrpcMethod('PdmsProdPlanService', 'SPDMPSProdPlanD')
    AutoCheckD(request: any[]): Observable<MetadataResponse> {
        return this.handleGrpcRequestV3(request, this.pdmsProdPlanService.AutoCheckD.bind(this.pdmsProdPlanService));
    }
    @GrpcMethod('PdmsProdPlanService', 'SPDMPSProdPlanU')
    AutoCheckU(request: any[]): Observable<MetadataResponse> {
        return this.handleGrpcRequestV3(request, this.pdmsProdPlanService.AutoCheckU.bind(this.pdmsProdPlanService));
    }



    @GrpcMethod('PdmsProdPlanService', 'SPDMPSProdPlanStockQuery')
    SPDMPSProdPlanStockQuery(request: any[]): Observable<MetadataResponse> {
        return this.handleGrpcRequest(request, this.pdmsProdPlanService.SPDMPSProdPlanStockQuery.bind(this.pdmsProdPlanService));
    }
    @GrpcMethod('PdmsProdPlanService', 'SPDMPSProdPlanQuery')
    SPDMPSProdPlanQuery(request: any[]): Observable<MetadataResponse> {
        return this.handleGrpcRequest(request, this.pdmsProdPlanService.SPDMPSProdPlanQuery.bind(this.pdmsProdPlanService));
    }

    @GrpcMethod('PdmsProdPlanService', 'SPDMPSProdPlanConfirm')
    SPDMPSProdPlanConfirm(request: any[]): Observable<MetadataResponse> {
        return this.handleGrpcRequestV3(request, this.pdmsProdPlanService.SPDMPSProdPlanConfirmCheck.bind(this.pdmsProdPlanService));
    }
    @GrpcMethod('PdmsProdPlanService', 'SPDMPSProdPlanSemiGoodCrt')
    SPDMPSProdPlanSemiGoodCrtCheck(request: any[]): Observable<MetadataResponse> {
        return this.handleGrpcRequestV3(request, this.pdmsProdPlanService.SPDMPSProdPlanSemiGoodCrtCheck.bind(this.pdmsProdPlanService));
    }
}