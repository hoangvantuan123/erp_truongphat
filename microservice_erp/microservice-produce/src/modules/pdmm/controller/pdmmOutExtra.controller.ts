import { Controller } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { PdmmOutExtraService } from '../services/pdmmOutExtra.service';
import { SPDMMOutReqItemStockQueryRequest, OutReqServiceSeqQuery, OutReqRequestV3 } from '../interface/request';
import { MetadataResponse } from '../interface/response';
import { jwtConstants } from 'src/config/security.config';
import { OutReqRequest } from '../interface/request';
import { Observable, from, catchError, map, of } from 'rxjs';
@Controller()
export class PdmmOutExtraController {
    constructor(private readonly pdmmOutExtraService: PdmmOutExtraService) { }

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
    private handleGrpcRequestV2(
        request: any,
        serviceMethod: (
            result: any,
            resultItems: any[],
            resultCheck: any,
            companySeq: number,
            userSeq: number
        ) => Observable<any>
    ): Observable<MetadataResponse> {
        try {
            const decodedToken = this.validateToken(request.metadata);

            return serviceMethod(
                request.result,
                request.resultItems,
                request.resultCheck,
                decodedToken.CompanySeq,
                decodedToken.UserSeq
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

    private handleGrpcRequestV3(
        request: any,
        serviceMethod: (
            resultItems: any[],
            resultCheck: any,
            companySeq: number,
            userSeq: number
        ) => Observable<any>
    ): Observable<MetadataResponse> {
        try {
            const decodedToken = this.validateToken(request.metadata);

            return serviceMethod(
                request.resultItems,
                request.resultCheck,
                decodedToken.CompanySeq,
                decodedToken.UserSeq
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



    @GrpcMethod('SPDMMOutReqItemStockQueryService', 'SPDMMOutReqItemStockQuery')
    _SPDMMOutReqItemStockQuery(request: SPDMMOutReqItemStockQueryRequest): Observable<MetadataResponse> {

        return this.handleGrpcRequest(request, this.pdmmOutExtraService._SPDMMOutReqItemStockQuery_WEB.bind(this.pdmmOutExtraService));
    }
    @GrpcMethod('OutReqService', 'QOutReq')
    _SPDMMOutReqQuery_WEB(request: OutReqServiceSeqQuery): Observable<MetadataResponse> {
        return this.handleGrpcRequest(request, this.pdmmOutExtraService._SPDMMOutReqQuery_WEB.bind(this.pdmmOutExtraService));
    }
    @GrpcMethod('OutReqService', 'QOutReqItem')
    _SPDMMOutReqItemQuery(request: OutReqServiceSeqQuery): Observable<MetadataResponse> {
        return this.handleGrpcRequest(request, this.pdmmOutExtraService._SPDMMOutReqItemQuery.bind(this.pdmmOutExtraService));
    }
    @GrpcMethod('OutReqService', 'AOutReq')
    AutoCheckA(request: OutReqRequest): Observable<MetadataResponse> {
        return this.handleGrpcRequestV2(request, this.pdmmOutExtraService.AutoCheckA.bind(this.pdmmOutExtraService));
    }
    @GrpcMethod('OutReqService', 'DOutReq')
    AutoCheckD(request: OutReqRequest): Observable<MetadataResponse> {
        return this.handleGrpcRequestV2(request, this.pdmmOutExtraService.AutoCheckD.bind(this.pdmmOutExtraService));
    }
    @GrpcMethod('OutReqService', 'UOutReq')
    AutoCheckU(request: OutReqRequest): Observable<MetadataResponse> {
        return this.handleGrpcRequestV2(request, this.pdmmOutExtraService.AutoCheckU.bind(this.pdmmOutExtraService));
    }
    @GrpcMethod('OutReqService', 'DOutReqItem')
    DOutReqItem(request: OutReqRequestV3): Observable<MetadataResponse> {
        return this.handleGrpcRequestV3(request, this.pdmmOutExtraService.DOutReqItem.bind(this.pdmmOutExtraService));
    }
    @GrpcMethod('OutReqService', 'AOutReqItem')
    AOutReqItem(request: OutReqRequestV3): Observable<MetadataResponse> {
        return this.handleGrpcRequestV3(request, this.pdmmOutExtraService.AOutReqItem.bind(this.pdmmOutExtraService));
    }
}
