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
import { FinQueryCmpService } from '../service/_FinQueryCmp.service';
@Controller()
export class FinQueryCmpController {
    constructor(private readonly finQueryCmpService: FinQueryCmpService,

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
                return {
                    success: isSuccess,
                    message: isSuccess ? "Query successful" : (queryResult?.message || "Query failed"),
                    data: JSON.stringify(queryResult?.data || []),
                    errors: isSuccess ? '' : 'Query execution failed',
                };
            }),
            catchError(() => {
                return of({
                    success: false,
                    message: 'Internal server error',
                    data: '',
                    errors: 'Internal server error',
                });
            })
        );
    }


    @GrpcMethod('FinQueryCmpService', 'FinQueryCmpQ')
    FinQueryCmpQ(request: any): Observable<MetadataResponse> {
        return this.handleGrpcRequest(request, this.finQueryCmpService.FinQueryCmpQ.bind(this.finQueryCmpService));
    }

    @GrpcMethod('FinQueryCmpService', 'FSQueryTermByMonthQ')
    FSQueryTermByMonthQ(request: any): Observable<MetadataResponse> {
        return this.handleGrpcRequest(request, this.finQueryCmpService.FSQueryTermByMonthQ.bind(this.finQueryCmpService));
    }
    @GrpcMethod('FinQueryCmpService', 'FSMonthlyProdCostQ')
    FSMonthlyProdCostQ(request: any): Observable<MetadataResponse> {
        return this.handleGrpcRequest(request, this.finQueryCmpService.FSMonthlyProdCostQ.bind(this.finQueryCmpService));
    }
    @GrpcMethod('FinQueryCmpService', 'FinancialReportQ')
    FinancialReportQ(request: any): Observable<MetadataResponse> {
        return this.handleGrpcRequest(request, this.finQueryCmpService.FinancialReportQ.bind(this.finQueryCmpService));
    }
    @GrpcMethod('FinQueryCmpService', 'MonthlyFinancialReportQ')
    MonthlyFinancialReportQ(request: any): Observable<MetadataResponse> {
        return this.handleGrpcRequest(request, this.finQueryCmpService.MonthlyFinancialReportQ.bind(this.finQueryCmpService));
    }
}
