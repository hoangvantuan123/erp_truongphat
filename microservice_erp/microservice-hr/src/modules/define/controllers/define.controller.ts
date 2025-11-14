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
import { SimpleQueryResult } from 'src/common/interfaces/simple-query-result.interface';
import { jwtConstants } from 'src/config/security.config';
import * as jwt from 'jsonwebtoken';
import { Request } from 'express';
import { ERPDefine } from '../entities/define.entity';
import { DefineService } from '../services/define.service';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { MetadataResponse } from 'src/common/interfaces/response';
import { Observable, from, throwError, catchError, map, of, mergeMap, switchMap } from 'rxjs'
@Controller()
export class DefinesController {
    constructor(private readonly defineService: DefineService,

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
                    data: isSuccess ? JSON.stringify(queryResult?.data || []) : '',
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


    @GrpcMethod('DefineService', 'DefineA')
    DefineA(request: any[]): Observable<MetadataResponse> {
        return this.handleGrpcRequest(request, this.defineService.DefineA.bind(this.defineService));
    }
    @GrpcMethod('DefineService', 'DefineU')
    DefineU(request: any[]): Observable<MetadataResponse> {
        return this.handleGrpcRequest(request, this.defineService.DefineU.bind(this.defineService));
    }
    @GrpcMethod('DefineService', 'DefineD')
    DefineD(request: any): Observable<MetadataResponse> {
        return this.handleGrpcRequest(request, this.defineService.DefineD.bind(this.defineService));
    }

    @GrpcMethod('DefineService', 'DefineQ')
    DefineQ(request: any[]): Observable<MetadataResponse> {
        return this.handleGrpcRequest(request, this.defineService.DefineQ.bind(this.defineService));
    }



}
