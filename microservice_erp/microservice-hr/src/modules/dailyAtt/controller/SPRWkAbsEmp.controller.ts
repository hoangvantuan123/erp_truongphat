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
import { SPRWkAbsEmpService } from '../service/SPRWkAbsEmp.service';
@Controller()
export class SPRWkAbsEmpController {
    constructor(private readonly SPRWkAbsEmpService: SPRWkAbsEmpService,

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



    @GrpcMethod('SPRWkAbsEmpService', 'SPRWkAbsEmpQ')
    SPRWkAbsEmpQ(request: any): Observable<MetadataResponse> {

        return this.handleGrpcRequest(request, this.SPRWkAbsEmpService.SPRWkAbsEmpQ.bind(this.SPRWkAbsEmpService));
    }

    @GrpcMethod('SPRWkAbsEmpService', 'SPRWkAbsEmpAUD')
    SPRWkAbsEmpAUD(request: any): Observable<MetadataResponse> {

        return this.handleGrpcRequest(request, this.SPRWkAbsEmpService.SPRWkAbsEmpAUD.bind(this.SPRWkAbsEmpService));
    }


}
