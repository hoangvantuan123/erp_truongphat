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
import { jwtConstants } from 'src/config/security.config';
import * as jwt from 'jsonwebtoken';
import { Request } from 'express';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { MetadataResponse } from '../interface/response';
import { Observable, from, throwError, catchError, map, of, mergeMap, switchMap } from 'rxjs'
import { SPRWkMmEmpDaysService } from '../service/SPRWkMmEmpDays.service';
@Controller()
export class SPRWkMmEmpDaysController {
    constructor(private readonly SPRWkMmEmpDaysService: SPRWkMmEmpDaysService,

    ) { }

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
        serviceMethod: (result: any, userSeq: number, companySeq: number) => Observable<any>
    ): Observable<MetadataResponse> {
        const decodedToken = this.validateToken(request.metadata);
        return serviceMethod(request.result, decodedToken.UserSeq, decodedToken.CompanySeq).pipe(
            map(queryResult => {

                const isSuccess = queryResult?.success === true;

                let formattedError = '';
                let errorList: any[] = [];

                if (!isSuccess && Array.isArray(queryResult?.errors) && queryResult.errors.length > 0) {
                    errorList = queryResult.errors;
                    const firstError = errorList[0];
                    const remaining = errorList.length - 1;

                    formattedError = `HÀNG ${firstError.IDX_NO}: ${firstError.result}`;
                    if (remaining > 0) {
                        formattedError += ` (còn ${remaining} lỗi nữa)`;
                    }
                }

                return {
                    success: isSuccess,
                    message: isSuccess
                        ? "Query successful"
                        : (formattedError || queryResult?.message || "Query failed"),
                    data: JSON.stringify(queryResult?.data || []),
                    errors: isSuccess ? [] : errorList, // trả list thay vì string
                };
            }),
            catchError(() => {
                return of({
                    success: false,
                    message: 'Internal server error',
                    data: '',
                    errors: [],
                });
            })
        );
    }



    @GrpcMethod('SPRWkMmEmpDaysService', 'SPRWkMmEmpDaysQ')
    SPRWkMmEmpDaysQ(request: any): Observable<MetadataResponse> {

        return this.handleGrpcRequest(request, this.SPRWkMmEmpDaysService.SPRWkMmEmpDaysQ.bind(this.SPRWkMmEmpDaysService));
    }

    @GrpcMethod('SPRWkMmEmpDaysService', 'SPRWkMmEmpDaysObjQ')
    SPRWkMmEmpDaysObjQ(request: any): Observable<MetadataResponse> {

        return this.handleGrpcRequest(request, this.SPRWkMmEmpDaysService.SPRWkMmEmpDaysObjQ.bind(this.SPRWkMmEmpDaysService));
    }

    @GrpcMethod('SPRWkMmEmpDaysService', 'SPRWkMmEmpDaysProc')
    SPRWkMmEmpDaysProc(request: any): Observable<MetadataResponse> {
        return this.handleGrpcRequest(request, this.SPRWkMmEmpDaysService.SPRWkMmEmpDaysProc.bind(this.SPRWkMmEmpDaysService));
    }
    @GrpcMethod('SPRWkMmEmpDaysService', 'SPRWkMmEmpDaysAUD')
    SPRWkMmEmpDaysAUD(request: any): Observable<MetadataResponse> {
        return this.handleGrpcRequest(request, this.SPRWkMmEmpDaysService.SPRWkMmEmpDaysAUD.bind(this.SPRWkMmEmpDaysService));
    }

}
