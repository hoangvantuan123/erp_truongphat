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
import { ErpHrCareerItemRecruitService } from '../services/hrCareerItem.service';
@Controller()
export class HrCareerItemRecruitController {
    constructor(private readonly erpHrCareerItemRecruitService: ErpHrCareerItemRecruitService,

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
        serviceMethod: (result: any, companySeq: number, userSeq: number) => Observable<any>
    ): Observable<MetadataResponse> {
        try {
            const decodedToken = this.validateToken(request.metadata);

            return from(serviceMethod(request.result, decodedToken.CompanySeq, decodedToken.UserSeq)).pipe(
                map(queryResult => {

                    const isSuccess = queryResult?.success === true;
                    return { success: isSuccess, message: isSuccess ? "Query successful" : (queryResult?.message || "Query failed"), data: JSON.stringify(queryResult.data), errors: JSON.stringify(queryResult.errors) };
                }),
                catchError(error => {
                    console.log('error', error)
                    return of({ success: false, message: error.message || 'Internal server error', data: '', errors: JSON.stringify(error.errors) });
                })
            );
        } catch (error) {

            return of({ success: false, message: error.message || 'Internal server error', data: '', errors: JSON.stringify(error.errors) });
        }
    }


    @GrpcMethod('HrCareerItemRecruitService', 'HrCareerItemRecruitA')
    HrCareerItemRecruitA(request: any[]): Observable<MetadataResponse> {
        return this.handleGrpcRequest(request, this.erpHrCareerItemRecruitService.HrCareerItemRecruitA.bind(this.erpHrCareerItemRecruitService));
    }
    @GrpcMethod('HrCareerItemRecruitService', 'HrCareerItemRecruitU')
    HrCareerItemRecruitU(request: any[]): Observable<MetadataResponse> {
        return this.handleGrpcRequest(request, this.erpHrCareerItemRecruitService.HrCareerItemRecruitU.bind(this.erpHrCareerItemRecruitService));
    }


    @GrpcMethod('HrCareerItemRecruitService', 'HrCareerItemRecruitQ')
    HrCareerItemRecruitQ(request: any): Observable<MetadataResponse> {
        return this.handleGrpcRequest(request, this.erpHrCareerItemRecruitService.HrCareerItemRecruitQ.bind(this.erpHrCareerItemRecruitService));
    }

    @GrpcMethod('HrCareerItemRecruitService', 'HrCareerItemRecruitD')
    HrCareerItemRecruitD(request: any[]): Observable<MetadataResponse> {
        return this.handleGrpcRequest(request, this.erpHrCareerItemRecruitService.HrCareerItemRecruitD.bind(this.erpHrCareerItemRecruitService));
    }



}
