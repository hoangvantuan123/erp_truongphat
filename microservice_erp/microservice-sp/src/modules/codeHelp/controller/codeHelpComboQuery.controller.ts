import { Controller } from '@nestjs/common';
import { CodeHelpComboQueryService } from '../service/codeHelpComboQuery.service';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import * as jwt from 'jsonwebtoken';
import { jwtConstants } from 'src/config/security.config';
import { Observable, from, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

interface MetadataRequest {
    result: {
        workingTag: string;
        languageSeq: number;
        codeHelpSeq: number;
        companySeq: number;
        keyword: string;
        param1: string;
        param2: string;
        param3: string;
        param4: string;
    };
    metadata: { [key: string]: string };
}

interface MetadataResponse {
    status: boolean;
    message: string;
    data: string;
}

@Controller()
export class CodeHelpComboQueryController {
    constructor(private readonly codeHelpComboQueryService: CodeHelpComboQueryService) { }

    @GrpcMethod('CodehelpComboQueryService', 'sendCodehelpComboQuery')
    CodehelpComboQueryService(request: MetadataRequest): Observable<MetadataResponse> {
        if (!request || !request.metadata || !request.metadata["authorization"]) {
            return throwError(() => new RpcException({ code: 16, message: 'Missing authorization token' }));
        }

        const { result, metadata } = request;
        const token = metadata["authorization"].split(' ')[1];

        if (!token) {
            return throwError(() => new RpcException({ code: 16, message: 'Invalid or expired token' }));
        }

        let decodedToken: any;
        try {
            decodedToken = jwt.verify(token, jwtConstants.secret) as any;
        } catch (error) {
            return throwError(() => new RpcException({ code: 16, message: 'Invalid or expired token' }));
        }


        return this.codeHelpComboQueryService._SCACodeHelpComboQuery(
            result.workingTag,
            result.languageSeq,
            result.codeHelpSeq,
            result.companySeq,
            result.keyword,
            result.param1,
            result.param2,
            result.param3,
            result.param4
        ).pipe(
            map(queryResult => ({
                status: true,
                message: "Query successful",
                data: JSON.stringify(queryResult.data),
            })),
            catchError(error => throwError(() => new RpcException({ code: 13, message: error.message || 'Internal server error' })))
        );
    }

    @GrpcMethod('CodehelpComboQueryService', 'getCodeHelpCombo230427')
    getCodeHelpCombo230427(request: MetadataRequest): Observable<MetadataResponse> {
        if (!request || !request.metadata || !request.metadata["authorization"]) {
            return throwError(() => new RpcException({ code: 16, message: 'Missing authorization token' }));
        }

        const { result, metadata } = request;
        const token = metadata["authorization"].split(' ')[1];

        if (!token) {
            return throwError(() => new RpcException({ code: 16, message: 'Invalid or expired token' }));
        }

        let decodedToken: any;
        try {
            decodedToken = jwt.verify(token, jwtConstants.secret) as any;
        } catch (error) {
            return throwError(() => new RpcException({ code: 16, message: 'Invalid or expired token' }));
        }

        return this.codeHelpComboQueryService._SCACodeHelpComboQueryV230427(
            result.workingTag,
            result.languageSeq,
            result.codeHelpSeq,
            result.companySeq,
            result.keyword,
            result.param1,
            result.param2,
            result.param3,
            result.param4
        ).pipe(
            map(queryResult => ({
                status: true,
                message: "Query successful",
                data: JSON.stringify(queryResult.data),
            })),
            catchError(error => throwError(() => new RpcException({ code: 13, message: error.message || 'Internal server error' })))
        );
    }
}
