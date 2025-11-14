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
import { ERPTempFileService } from '../services/tempFile.service';
@Controller()
export class ErpTempFileController {
    constructor(private readonly erpTempFileService: ERPTempFileService,

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
    private handleGrpcFileUploadRequest(
        request: any,
        serviceMethod: (files: any[], result: any, userSeq: number) => Observable<any>
    ): Observable<MetadataResponse> {
        const user = this.validateToken(request.metadata);

        const processedFiles = request.files.map(file => ({
            ...file,
            content: Buffer.isBuffer(file.content)
                ? file.content
                : Buffer.from(file.content, 'base64'),
        }));

        return serviceMethod(processedFiles, request.result, user.UserSeq).pipe(
            map((queryResult) => {
                const isSuccess = queryResult?.success === true;
                return {
                    success: isSuccess,
                    message: isSuccess ? 'Upload successful' : (queryResult?.message || 'Upload failed'),
                    data: JSON.stringify(queryResult?.data || []),
                    errors: isSuccess ? '' : 'Upload failed',
                };
            }),
            catchError(() =>
                of({
                    success: false,
                    message: 'Internal server error',
                    data: '',
                    errors: 'Internal server error',
                })
            )
        );
    }


    @GrpcMethod('TempFileService', 'TempFileA')
    TempFileA(request: any[]): Observable<MetadataResponse> {
        return this.handleGrpcRequest(request, this.erpTempFileService.TempFileA.bind(this.erpTempFileService));
    }

    @GrpcMethod('TempFileService', 'TempFileU')
    TempFileU(request: any[]): Observable<MetadataResponse> {
        return this.handleGrpcRequest(request, this.erpTempFileService.TempFileU.bind(this.erpTempFileService));
    }


    @GrpcMethod('TempFileService', 'TempFileQ')
    TempFileQ(request: any): Observable<MetadataResponse> {
        return this.handleGrpcRequest(request, this.erpTempFileService.TempFileQ.bind(this.erpTempFileService));
    }

    @GrpcMethod('TempFileService', 'TempFileD')
    TempFileD(request: any[]): Observable<MetadataResponse> {
        return this.handleGrpcRequest(request, this.erpTempFileService.TempFileD.bind(this.erpTempFileService));
    }
    @GrpcMethod('TempFileService', 'TempFileP')
    TempFileP(request: any[]): Observable<MetadataResponse> {
        return this.handleGrpcFileUploadRequest(
            request,
            this.erpTempFileService.TempFileP.bind(this.erpTempFileService)
        );
    }




}
