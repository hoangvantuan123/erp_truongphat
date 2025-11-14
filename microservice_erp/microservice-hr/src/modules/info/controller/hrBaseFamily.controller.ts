import {
    Body,
    Controller,
    Get,
    ParseFilePipeBuilder,
    Post,
    UploadedFile,
    UseInterceptors,
    UploadedFiles,
    UnauthorizedException,
    Req,
    Param,
    Res,
    HttpStatus,
    Query,
    HttpException
} from '@nestjs/common';
import { jwtConstants } from 'src/config/security.config';
import * as jwt from 'jsonwebtoken';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { DatabaseService } from 'src/common/database/sqlServer/ITMV/database.service';
import { MetadataResponse } from '../interface/response';
import { Observable, from, catchError, map, of } from 'rxjs';
import { HrBaseFamilyService } from '../service/hrBaseFamily.service';
@Controller()
export class HBaseFamilyController {
    constructor(private readonly hrBaseFamilyService: HrBaseFamilyService, private readonly databaseService: DatabaseService) { }

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
                    return { status: isSuccess, message: "Query successful", data: JSON.stringify(queryResult.data), errors: JSON.stringify(queryResult.errors) };
                }),
                catchError(error => {
                    return of({ status: false, message: error.message || 'Internal server error', data: '', errors: JSON.stringify(error.errors) });
                })
            );
        } catch (error) {
            return of({ status: false, message: error.message || 'Internal server error', data: '', errors: JSON.stringify(error.errors) });
        }
    }

    @GrpcMethod('HrBaseFamilyService', 'HrBaseFamilyA')
    HrBaseFamilyA(request: any[]): Observable<MetadataResponse> {
        return this.handleGrpcRequest(request, this.hrBaseFamilyService.HrBaseFamilyA.bind(this.hrBaseFamilyService));
    }
    @GrpcMethod('HrBaseFamilyService', 'HrBaseFamilyU')
    HrBaseFamilyU(request: any): Observable<MetadataResponse> {
        return this.handleGrpcRequest(request, this.hrBaseFamilyService.HrBaseFamilyU.bind(this.hrBaseFamilyService));
    }
    @GrpcMethod('HrBaseFamilyService', 'HrBaseFamilyD')
    HrBaseFamilyD(request: any): Observable<MetadataResponse> {
        return this.handleGrpcRequest(request, this.hrBaseFamilyService.HrBaseFamilyD.bind(this.hrBaseFamilyService));
    }
    @GrpcMethod('HrBaseFamilyService', 'HrBaseFamilyQ')
    HrBaseFamilyQ(request: any): Observable<MetadataResponse> {
        return this.handleGrpcRequest(request, this.hrBaseFamilyService.HrBaseFamilyQ.bind(this.hrBaseFamilyService));
    }
}