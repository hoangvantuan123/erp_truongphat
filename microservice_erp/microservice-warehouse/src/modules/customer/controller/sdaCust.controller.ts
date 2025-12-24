import { Controller, Get, Query, Post, Body, Req, UnauthorizedException, HttpException, HttpStatus } from '@nestjs/common';
import { SimpleQueryResult } from 'src/common/interfaces/simple-query-result.interface';
import { Request } from 'express';
import { jwtConstants } from 'src/config/security.config';
import * as jwt from 'jsonwebtoken';
import { SDACustService } from '../service/sdaCust.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { MetadataResponse } from '../interface/response';
import { Observable, from, throwError, catchError, map, of, mergeMap, switchMap } from 'rxjs'
@Controller()
export class SDACustController {
    constructor(private readonly SDACustService: SDACustService) { }


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



    @GrpcMethod('SDACustService', 'SDACustQ')
    SDACustQ(request: any): Observable<MetadataResponse> {

        return this.handleGrpcRequest(request, this.SDACustService.SDACustQ.bind(this.SDACustService));
    }

    @GrpcMethod('SDACustService', 'SDACustAUD')
    SDACustAUD(request: any): Observable<MetadataResponse> {

        return this.handleGrpcRequest(request, this.SDACustService.SDACustAUD.bind(this.SDACustService));
    }
    @GrpcMethod('SDACustService', 'SDACustD')
    SDACustD(request: any): Observable<MetadataResponse> {
        return this.handleGrpcRequest(request, this.SDACustService.SDACustD.bind(this.SDACustService));
    }

    @GrpcMethod('SDACustService', 'SDACustEmpInfoQ')
    SDACustEmpInfoQ(request: any): Observable<MetadataResponse> {
        return this.handleGrpcRequest(request, this.SDACustService.SDACustEmpInfoQ.bind(this.SDACustService));
    }
    @GrpcMethod('SDACustService', 'SDACustEmpInfoAUD')
    SDACustEmpInfoAUD(request: any): Observable<MetadataResponse> {
        return this.handleGrpcRequest(request, this.SDACustService.SDACustEmpInfoAUD.bind(this.SDACustService));
    }


}
