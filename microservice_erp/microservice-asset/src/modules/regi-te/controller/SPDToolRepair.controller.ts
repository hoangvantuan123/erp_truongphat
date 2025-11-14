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
import { SPDToolRepairService } from '../service/SPDToolRepair.service';
@Controller()
export class PDToolRepairController {
    constructor(private readonly SPDToolRepairService: SPDToolRepairService,

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


    @GrpcMethod('SPDToolRepairService', 'SPDToolRepairTotalListQ')
    SPDToolRepairTotalListQ(request: any): Observable<MetadataResponse> {

        return this.handleGrpcRequest(request, this.SPDToolRepairService.SPDToolRepairTotalListQ.bind(this.SPDToolRepairService));
    }
    @GrpcMethod('SPDToolRepairService', 'SPDToolRepairQ')
    SPDToolRepairQ(request: any): Observable<MetadataResponse> {

        return this.handleGrpcRequest(request, this.SPDToolRepairService.SPDToolRepairQ.bind(this.SPDToolRepairService));
    }
    @GrpcMethod('SPDToolRepairService', 'SPDToolRepairMatQ')
    SPDToolRepairMatQ(request: any): Observable<MetadataResponse> {

        return this.handleGrpcRequest(request, this.SPDToolRepairService.SPDToolRepairMatQ.bind(this.SPDToolRepairService));
    }

    @GrpcMethod('SPDToolRepairService', 'SPDToolRepairMatAUD')
    SPDToolRepairMatAUD(request: any): Observable<MetadataResponse> {

        return this.handleGrpcRequest(request, this.SPDToolRepairService.SPDToolRepairMatAUD.bind(this.SPDToolRepairService));
    }

    @GrpcMethod('SPDToolRepairService', 'SPDToolRepairAUD')
    SPDToolRepairAUD(request: any): Observable<MetadataResponse> {

        return this.handleGrpcRequest(request, this.SPDToolRepairService.SPDToolRepairAUD.bind(this.SPDToolRepairService));
    }


}
