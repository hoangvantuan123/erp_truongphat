import {
    Controller,
    BadRequestException,
    HttpException,
    HttpStatus,
    UnauthorizedException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { GrpcMethod, RpcException, MessagePattern, Payload } from '@nestjs/microservices';
import { PdmmOutQueryListService } from '../services/pdmmOutQueryList.service';
import { QueryOutReqListRequest, SCOMSourceDailyJumpQuery, SPDMMOutReqItemListRequest, SMaterialQRStockOutCheckRequest, CheckLogsTFIFOTempRequest } from '../interface/request';
import { MetadataResponse } from '../interface/response';
import { jwtConstants } from 'src/config/security.config';
import { Observable, from, catchError, map, of } from 'rxjs';
import { PdmmOutItemListService } from '../services/pdmmOutItemList.service';
import { QueryOutReqItemListRequest } from '../interface/request';
import { ScanPdmmOutProcService } from '../services/scanPdmmOutProc.service';
@Controller()
export class ScanPdmmOutProcController {
    constructor(private readonly scanPdmmOutProcService: ScanPdmmOutProcService) { }

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
                    return of({ status: false, message: error.message || 'Internal server error', data: '' });
                })
            );
        } catch (error) {
            return of({ status: false, message: error.message || 'Internal server error', data: '' });
        }
    }

    private handleGrpcRequestV2(
        request: any,
        serviceMethod: (result: any, companySeq: number, userSeq: number) => Observable<any>
    ): Observable<MetadataResponse> {
        try {
            const decodedToken = this.validateToken(request.metadata);
            if (!decodedToken || !decodedToken.CompanySeq || !decodedToken.UserSeq) {
                throw new Error('Invalid token data');
            }

            return from(serviceMethod(request.result, decodedToken.CompanySeq, decodedToken.UserSeq)).pipe(
                map(queryResult => {
                    if (!queryResult || !queryResult.success) {
                        return {
                            status: false,
                            message: '42423423',
                            data: '',
                            errors: queryResult?.errors ? JSON.stringify(queryResult.errors) : 'No additional error information available'
                        };
                    }
                    return {
                        status: true,
                        message: "Query successful",
                        data: JSON.stringify(queryResult.data)
                    };
                }),
                catchError(error => {
                    return of({
                        status: false,
                        message: 'Error in gRPC request:',
                        data: '',
                        errors: error.errors ? JSON.stringify(error.errors) : JSON.stringify(error)
                    });
                })
            );
        } catch (error) {
            return of({
                status: false,
                message: 'Error in token validation or service method execution:',
                data: '',
                errors: error.errors ? JSON.stringify(error.errors) : JSON.stringify(error)
            });
        }
    }

    @GrpcMethod('ScanPdmmOutProcService', 'SCOMSourceDailyJumpQuery')
    _SCOMSourceDailyJumpQuery(request: SCOMSourceDailyJumpQuery): Observable<MetadataResponse> {
        return this.handleGrpcRequest(request, this.scanPdmmOutProcService._SCOMSourceDailyJumpQuery.bind(this.scanPdmmOutProcService));
    }


    @GrpcMethod('ScanPdmmOutProcService', 'SPDMMOutReqItemList')
    SPDMMOutReqItemList(request: SPDMMOutReqItemListRequest): Observable<MetadataResponse> {
        return this.handleGrpcRequest(request, this.scanPdmmOutProcService.SPDMMOutReqItemList.bind(this.scanPdmmOutProcService));
    }



    @GrpcMethod('ScanPdmmOutProcService', 'SMaterialQRStockOutCheck')
    SMaterialQRStockOutCheck(request: SMaterialQRStockOutCheckRequest): Observable<MetadataResponse> {
        return this.handleGrpcRequestV2(request, this.scanPdmmOutProcService.SMaterialQRStockOutCheck.bind(this.scanPdmmOutProcService));
    }

    @GrpcMethod('ScanPdmmOutProcService', 'CheckLogsTFIFOTemp')
    CheckLogsTFIFOTemp(request: CheckLogsTFIFOTempRequest): Observable<MetadataResponse> {
        return this.handleGrpcRequestV2(request, this.scanPdmmOutProcService.CheckLogsTFIFOTemp.bind(this.scanPdmmOutProcService));
    }
    @GrpcMethod('ScanPdmmOutProcService', 'DCheckLogsTFIFOTemp')
    DCheckLogsTFIFOTemp(request: any): Observable<MetadataResponse> {
        return this.handleGrpcRequestV2(request, this.scanPdmmOutProcService.DCheckLogsTFIFOTemp.bind(this.scanPdmmOutProcService));
    }
    @GrpcMethod('ScanPdmmOutProcService', 'SPDMMOutProcItemQuery')
    SPDMMOutProcItemQuery(request: any): Observable<MetadataResponse> {
        return this.handleGrpcRequest(request, this.scanPdmmOutProcService.SPDMMOutProcItemQuery.bind(this.scanPdmmOutProcService));
    }

    @MessagePattern('slg-in-out-save')
    async SLGInOutSave(
        @Payload()
        data: {
            dataMaster: any[];
            dataSheetAUD: any[];
            authorization: string;
        },
    ): Promise<any> {
        const { dataMaster, dataSheetAUD, authorization } = data;
        if (!authorization) {
            throw new UnauthorizedException(
                'You do not have permission to access this API.',
            );
        }
        const token = authorization.split(' ')[1];
        if (!token) {
            throw new UnauthorizedException(
                'You do not have permission to access this API.',
            );
        }
        try {
            const decodedToken = jwt.verify(token, jwtConstants.secret) as {
                UserId: any;
                EmpSeq: any;
                UserSeq: any;
                CompanySeq: any;
            };

            return this.scanPdmmOutProcService.SLGStockOutSave(
                dataMaster,
                dataSheetAUD,
                decodedToken.CompanySeq,
                decodedToken.UserSeq,
            );
        } catch (error) {
            throw new RpcException({
                statusCode: 401,
                message: 'Invalid or expired token.',
            });
        }
    }
    @MessagePattern('slg-in-out-sheet-delete')
    async SLGInOutSheetDelete(
        @Payload()
        data: {
            dataMaster: any[];
            dataSheetAUD: any[];
            authorization: string;
        },
    ): Promise<any> {
        const { dataMaster, dataSheetAUD, authorization } = data;
        if (!authorization) {
            throw new UnauthorizedException(
                'You do not have permission to access this API.',
            );
        }
        const token = authorization.split(' ')[1];
        if (!token) {
            throw new UnauthorizedException(
                'You do not have permission to access this API.',
            );
        }
        try {
            const decodedToken = jwt.verify(token, jwtConstants.secret) as {
                UserId: any;
                EmpSeq: any;
                UserSeq: any;
                CompanySeq: any;
            };


            return this.scanPdmmOutProcService.SLGStockOutDelete(
                dataMaster,
                dataSheetAUD,
                decodedToken.CompanySeq,
                decodedToken.UserSeq,
            );
        } catch (error) {
            throw new RpcException({
                statusCode: 401,
                message: 'Invalid or expired token.',
            });
        }
    }
    @MessagePattern('slg-in-out-master-delete')
    async SLGInOutMasterDelete(
        @Payload()
        data: {
            dataMaster: any[];
            dataSheetAUD: any[];
            authorization: string;
        },
    ): Promise<any> {
        const { dataMaster, dataSheetAUD, authorization } = data;
        if (!authorization) {
            throw new UnauthorizedException(
                'You do not have permission to access this API.',
            );
        }
        const token = authorization.split(' ')[1];
        if (!token) {
            throw new UnauthorizedException(
                'You do not have permission to access this API.',
            );
        }
        try {
            const decodedToken = jwt.verify(token, jwtConstants.secret) as {
                UserId: any;
                EmpSeq: any;
                UserSeq: any;
                CompanySeq: any;
            };


            return this.scanPdmmOutProcService.SLGStockOutMaster(
                dataMaster,
                dataSheetAUD,
                decodedToken.CompanySeq,
                decodedToken.UserSeq,
            );
        } catch (error) {
            throw new RpcException({
                statusCode: 401,
                message: 'Invalid or expired token.',
            });
        }
    }
}
