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
import { ProjectMgmtService } from '../service/projectMgmt.service';
import { Observable, from, throwError, catchError, map, of, mergeMap, switchMap } from 'rxjs'
@Controller()
export class ProjectMgmtsController {
    constructor(private readonly projectMgmtService: ProjectMgmtService,

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
    private STEP_LABEL: Record<string, string> = {
        Check1: "Kiểm tra hợp đồng",
        Save1: "Lưu hợp đồng",
        ResCheck: "Kiểm tra tài nguyên",
        RemarkSave: "Lưu ghi chú",
        PayConditionA: "Thêm điều kiện thanh toán",
        PayConditionU: "Cập nhật điều kiện thanh toán",
        ResSave: "Lưu tài nguyên",
        Pipeline: "Lỗi quy trình"
    };


    private handleGrpcRequest(
        request: any,
        serviceMethod: (r: any, r2: any, r3: any, r4: any, userSeq: number) => Observable<any>
    ): Observable<MetadataResponse> {

        return serviceMethod(
            request.result,
            request.result2,
            request.result3,
            request.result4,
            this.validateToken(request.metadata).UserSeq
        ).pipe(

            map(queryResult => {

                const isSuccess = queryResult?.success === true;

                const step = queryResult?.step || null;
                const stepLabel = this.STEP_LABEL[step] || step || "Không xác định";

                let errorList: any[] = [];
                let formattedError = "";

                /** ---- LẤY LIST LỖI ---- */
                if (!isSuccess) {

                    if (Array.isArray(queryResult?.errors)) {
                        errorList = queryResult.errors;

                    } else if (Array.isArray(queryResult?.error?.errors)) {
                        errorList = queryResult.error.errors;

                    } else if (queryResult?.error) {
                        errorList = [queryResult.error];

                    }
                }

                /** ---- FORMAT LỖI RA MESSAGE ---- */
                if (errorList.length > 0) {
                    const first = errorList[0];

                    const idx = first?.IDX_NO ?? first?.idxNo ?? "";
                    const msg = first?.result ?? first?.message ?? JSON.stringify(first);

                    formattedError = `HÀNG ${idx}: ${msg}`;

                    if (errorList.length > 1) {
                        formattedError += ` (còn ${errorList.length - 1} lỗi nữa)`;
                    }
                }

                /** ---- TRẢ MESSAGE CUỐI CÙNG ---- */
                const message = isSuccess
                    ? "Query successful"
                    : `[${stepLabel}] ${formattedError || queryResult?.message || "Query failed"}`;

                return {
                    success: isSuccess,
                    step,
                    stepLabel,
                    message,                    // 🔥 MESSAGE ĐÃ BAO GỒM TÊN STEP + LỖI
                    data: JSON.stringify(queryResult?.data || []),
                    errors: isSuccess ? [] : errorList
                };
            }),

            catchError(err =>
                of({
                    success: false,
                    step: "Pipeline",
                    stepLabel: this.STEP_LABEL["Pipeline"],
                    message: `[${this.STEP_LABEL["Pipeline"]}] Internal server error`,
                    data: "",
                    errors: [err?.message || "Internal server error"]
                })
            )
        );
    }


    private handleGrpcRequest2(
        request: any,
        serviceMethod: (result: any, userSeq: number, companySeq: number) => Observable<any>
    ): Observable<MetadataResponse> {
        const decodedToken = this.validateToken(request.metadata);
        return serviceMethod(request.result, decodedToken.UserSeq, decodedToken.CompanySeq).pipe(
            map(queryResult => {

                const isSuccess = queryResult?.success === true;

                let formattedError = '';
                let errorList: any[] = [];

                if (!isSuccess && Array.isArray(queryResult?.errors) && queryResult.errors.length > 0) {
                    errorList = queryResult.errors;
                    const firstError = errorList[0];
                    const remaining = errorList.length - 1;

                    formattedError = `HÀNG ${firstError.IDX_NO}: ${firstError.result}`;
                    if (remaining > 0) {
                        formattedError += ` (còn ${remaining} lỗi nữa)`;
                    }
                }

                return {
                    success: isSuccess,
                    message: isSuccess
                        ? "Query successful"
                        : (formattedError || queryResult?.message || "Query failed"),
                    data: JSON.stringify(queryResult?.data || []),
                    errors: isSuccess ? [] : errorList, // trả list thay vì string
                };
            }),
            catchError(() => {
                return of({
                    success: false,
                    message: 'Internal server error',
                    data: '',
                    errors: [],
                });
            })
        );
    }



    @GrpcMethod('ProjectMgmtService', 'ProjectMgmtAUD')
    ProjectMgmtAUD(request: any[]): Observable<MetadataResponse> {
        return this.handleGrpcRequest(request, this.projectMgmtService.ProjectMgmtAUD.bind(this.projectMgmtService));
    }

    @GrpcMethod('ProjectMgmtService', 'SPJTSupplyContractResAUD')
    SPJTSupplyContractResAUD(request: any[]): Observable<MetadataResponse> {
        return this.handleGrpcRequest2(request, this.projectMgmtService.SPJTSupplyContractResAUD.bind(this.projectMgmtService));
    }
    @GrpcMethod('ProjectMgmtService', 'SupplyContractRemarkAUD')
    SupplyContractRemarkAUD(request: any[]): Observable<MetadataResponse> {
        return this.handleGrpcRequest2(request, this.projectMgmtService.SupplyContractRemarkAUD.bind(this.projectMgmtService));
    }
    @GrpcMethod('ProjectMgmtService', 'SPJTSupplyContractQ')
    SPJTSupplyContractQ(request: any[]): Observable<MetadataResponse> {
        return this.handleGrpcRequest2(request, this.projectMgmtService.SPJTSupplyContractQ.bind(this.projectMgmtService));
    }
    @GrpcMethod('ProjectMgmtService', 'SPJTSupplyContractResQ')
    SPJTSupplyContractResQ(request: any[]): Observable<MetadataResponse> {
        return this.handleGrpcRequest2(request, this.projectMgmtService.SPJTSupplyContractResQ.bind(this.projectMgmtService));
    }
    @GrpcMethod('ProjectMgmtService', 'SPJTSupplyContractRemarkQ')
    SPJTSupplyContractRemarkQ(request: any[]): Observable<MetadataResponse> {
        return this.handleGrpcRequest2(request, this.projectMgmtService.SPJTSupplyContractRemarkQ.bind(this.projectMgmtService));
    }
    @GrpcMethod('ProjectMgmtService', 'SPJTSupplyContractListQ')
    SPJTSupplyContractListQ(request: any[]): Observable<MetadataResponse> {
        return this.handleGrpcRequest2(request, this.projectMgmtService.SPJTSupplyContractListQ.bind(this.projectMgmtService));
    }
    @GrpcMethod('ProjectMgmtService', 'SPJTSupplyContractD')
    SPJTSupplyContractD(request: any[]): Observable<MetadataResponse> {
        return this.handleGrpcRequest2(request, this.projectMgmtService.SPJTSupplyContractD.bind(this.projectMgmtService));
    }
    @GrpcMethod('ProjectMgmtService', 'SPJTSupplyContractAmtListQ')
    SPJTSupplyContractAmtListQ(request: any[]): Observable<MetadataResponse> {
        return this.handleGrpcRequest2(request, this.projectMgmtService.SPJTSupplyContractAmtListQ.bind(this.projectMgmtService));
    }
    @GrpcMethod('ProjectMgmtService', 'NotifiProjectQ')
    NotifiProjectQ(request: any[]): Observable<MetadataResponse> {
        return this.handleGrpcRequest2(request, this.projectMgmtService.NotifiProjectQ.bind(this.projectMgmtService));
    }


}
