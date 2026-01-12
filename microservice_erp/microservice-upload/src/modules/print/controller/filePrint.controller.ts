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
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { MetadataResponse } from 'src/common/interfaces/response';
import { Observable, from, throwError, catchError, map, of, mergeMap, switchMap } from 'rxjs'
import { ERPPrintFileService } from '../services/filePrint.service';
@Controller()
export class FilePrintController {
    constructor(private readonly ERPPrintFileService: ERPPrintFileService,

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
                    message: 'Có lỗi xảy ra khi xử lý. Vui lòng thử lại sau.',
                    data: '',
                    errors: 'Có lỗi xảy ra khi xử lý. Vui lòng thử lại sau.',
                });
            })
        );
    }

    @GrpcMethod('FilePrintService', 'FilePrintA')
    FilePrintA(request: any[]): Observable<MetadataResponse> {
        return this.handleGrpcRequest(request, this.ERPPrintFileService.FilePrintA.bind(this.ERPPrintFileService));
    }
    @GrpcMethod('FilePrintService', 'FilePrintU')
    FilePrintU(request: any[]): Observable<MetadataResponse> {
        return this.handleGrpcRequest(request, this.ERPPrintFileService.FilePrintU.bind(this.ERPPrintFileService));
    }
    @GrpcMethod('FilePrintService', 'FilePrintD')
    FilePrintD(request: any): Observable<MetadataResponse> {
        return this.handleGrpcRequest(request, this.ERPPrintFileService.FilePrintD.bind(this.ERPPrintFileService));
    }

    @GrpcMethod('FilePrintService', 'FilePrintQ')
    FilePrintQ(request: any[]): Observable<MetadataResponse> {
        return this.handleGrpcRequest(request, this.ERPPrintFileService.FilePrintQ.bind(this.ERPPrintFileService));
    }



}
