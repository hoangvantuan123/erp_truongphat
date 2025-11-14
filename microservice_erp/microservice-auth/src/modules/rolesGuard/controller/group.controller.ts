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
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { MetadataResponse } from 'src/common/interfaces/response';
import { TCAGroupsService } from '../service/group.service';
import { Observable, from, throwError, catchError, map, of, mergeMap, switchMap } from 'rxjs'
@Controller()
export class RoleGroupsController {
    constructor(private readonly TCAGroupsService: TCAGroupsService,

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


    @GrpcMethod('GroupRoleService', 'RoleGroupA')
    RoleGroupA(request: any[]): Observable<MetadataResponse> {
        return this.handleGrpcRequest(request, this.TCAGroupsService.RoleGroupA.bind(this.TCAGroupsService));
    }
    @GrpcMethod('GroupRoleService', 'RoleGroupU')
    RoleGroupU(request: any[]): Observable<MetadataResponse> {
        return this.handleGrpcRequest(request, this.TCAGroupsService.RoleGroupU.bind(this.TCAGroupsService));
    }
    @GrpcMethod('GroupRoleService', 'RoleGroupD')
    RoleGroupD(request: any): Observable<MetadataResponse> {
        return this.handleGrpcRequest(request, this.TCAGroupsService.RoleGroupD.bind(this.TCAGroupsService));
    }

    @GrpcMethod('GroupRoleService', 'RoleGroupQ')
    RoleGroupQ(request: any[]): Observable<MetadataResponse> {
        return this.handleGrpcRequest(request, this.TCAGroupsService.RoleGroupQ.bind(this.TCAGroupsService));
    }



}
