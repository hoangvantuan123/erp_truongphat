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
import { MetadataResponse } from 'src/common/interfaces/response';
import { Observable, from, throwError, catchError, map, of, mergeMap, switchMap } from 'rxjs'
import { DefineService } from './define.service';
@Controller()
export class ErpDefineController {
    constructor(private readonly erpDefineService: DefineService,

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
        serviceMethod: (result: any, userSeq: number) => Observable<any>
    ): Observable<MetadataResponse> {
        return serviceMethod(request.result, this.validateToken(request.metadata).UserSeq).pipe(
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
    @GrpcMethod('HelpDefineService', 'OrgDefineH')
    OrgDefineH(request: any): Observable<MetadataResponse> {
        return this.handleGrpcRequest(request, this.erpDefineService.OrgDefineH.bind(this.erpDefineService));
    }
    @GrpcMethod('HelpDefineService', 'ItemAllH')
    ItemAllH(request: any): Observable<MetadataResponse> {
        return this.handleGrpcRequest(request, this.erpDefineService.ItemAllH.bind(this.erpDefineService));
    }
    @GrpcMethod('HelpDefineService', 'CustAllH')
    CustAllH(request: any): Observable<MetadataResponse> {
        return this.handleGrpcRequest(request, this.erpDefineService.CustAllH.bind(this.erpDefineService));
    }

    @GrpcMethod('HelpDefineService', 'OrgDefineItemH')
    OrgDefineItemH(request: any): Observable<MetadataResponse> {
        return this.handleGrpcRequest(request, this.erpDefineService.OrgDefineItemH.bind(this.erpDefineService));
    }
    @GrpcMethod('HelpDefineService', 'OrgCodeHelpDefineItemH')
    OrgCodeHelpDefineItemH(request: any): Observable<MetadataResponse> {
        return this.handleGrpcRequest(request, this.erpDefineService.OrgCodeHelpDefineItemH.bind(this.erpDefineService));
    }


}
