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
import { ErpEmpRecruitService } from '../services/hrRecruitEmp.service';
@Controller()
export class HrEmpRecruitController {
    constructor(private readonly erpEmpRecruitService: ErpEmpRecruitService,

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


    @GrpcMethod('HrEmpRecruitService', 'HrEmpRecruitA')
    HrEmpRecruitA(request: any[]): Observable<MetadataResponse> {
        return this.handleGrpcRequest(request, this.erpEmpRecruitService.HrEmpRecruitA.bind(this.erpEmpRecruitService));
    }

    @GrpcMethod('HrEmpRecruitService', 'HrEmpRecruitU')
    HrEmpRecruitU(request: any[]): Observable<MetadataResponse> {
        return this.handleGrpcRequest(request, this.erpEmpRecruitService.HrEmpRecruitU.bind(this.erpEmpRecruitService));
    }


    @GrpcMethod('HrEmpRecruitService', 'HrEmpRecruitQ')
    HrEmpRecruitQ(request: any): Observable<MetadataResponse> {
        return this.handleGrpcRequest(request, this.erpEmpRecruitService.HrEmpRecruitQ.bind(this.erpEmpRecruitService));
    }

    @GrpcMethod('HrEmpRecruitService', 'HrEmpRecruitD')
    HrEmpRecruitD(request: any[]): Observable<MetadataResponse> {
        return this.handleGrpcRequest(request, this.erpEmpRecruitService.HrEmpRecruitD.bind(this.erpEmpRecruitService));
    }
    @GrpcMethod('HrEmpRecruitService', 'HrEmpRecruitS')
    HrEmpRecruitS(request: any[]): Observable<MetadataResponse> {
        return this.handleGrpcRequest(request, this.erpEmpRecruitService.HrEmpRecruitS.bind(this.erpEmpRecruitService));
    }
    @GrpcMethod('HrEmpRecruitService', 'HrEmpRecruitMonthlySummary')
    HrEmpRecruitMonthlySummary(request: any[]): Observable<MetadataResponse> {
        return this.handleGrpcRequest(request, this.erpEmpRecruitService.HrEmpRecruitMonthlySummary.bind(this.erpEmpRecruitService));
    }



}
