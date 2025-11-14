import {
    Controller,
    BadRequestException,
    HttpException,
    HttpStatus,
    UnauthorizedException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { PdmmOutQueryListService } from '../services/pdmmOutQueryList.service';
import { QueryOutReqListRequest, OutReqCancelRequest } from '../interface/request';
import { MetadataResponse } from '../interface/response';
import { jwtConstants } from 'src/config/security.config';
import { Observable, from, catchError, map, of } from 'rxjs';
@Controller()
export class PdmmOutQueryListController {
    constructor(private readonly pdmmOutQueryListService: PdmmOutQueryListService) { }

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
    @GrpcMethod('OutReqListQueryService', 'QueryOutReqList')
    SPDMMOutReqListQuery(request: QueryOutReqListRequest): Observable<MetadataResponse> {
        return this.handleGrpcRequest(request, this.pdmmOutQueryListService._SPDMMOutReqListQuery_WEB.bind(this.pdmmOutQueryListService));
    }


    @GrpcMethod('SCOMConfirmService', 'SCOMConfirm')
    SCOMConfirm(request: OutReqCancelRequest): Observable<MetadataResponse> {
        return this.handleGrpcRequest(request, this.pdmmOutQueryListService.SCOMConfirm.bind(this.pdmmOutQueryListService));
    }

    @GrpcMethod('SPDMMOutReqCancelService', 'SPDMMOutReqCancel')
    _SPDMMOutReqCancel(request: OutReqCancelRequest): Observable<MetadataResponse> {
        return this.handleGrpcRequest(request, this.pdmmOutQueryListService._SPDMMOutReqCancel.bind(this.pdmmOutQueryListService));
    }
}
