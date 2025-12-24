import { Controller } from '@nestjs/common';
import { CodeHelpQueryService } from '../service/codeHelpQuery.service';
import * as jwt from 'jsonwebtoken';
import { jwtConstants } from 'src/config/security.config';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { Observable, from, throwError, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

interface MetadataRequest {
  result: {
    workingTag: string;
    languageSeq: number;
    codeHelpSeq: string;
    companySeq: number;
    keyword: string;
    param1: string;
    param2: string;
    param3: string;
    param4: string;
    conditionSeq: string;
    pageCount: number;
    pageSize: number;
    subConditionSql: string;
    accUnit: string;
    bizUnit: number;
    factUnit: number;
    deptSeq: number;
    wkDeptSeq: number;
    empSeq: number;
    userSeq: number;
  };
  metadata: { [key: string]: string };
}

interface MetadataResponse {
  status: boolean;
  message: string;
  data: string;
}

@Controller()
export class CodeHelpQueryController {
  constructor(private readonly codeHelpQueryService: CodeHelpQueryService) {}

  @GrpcMethod('CodehelpQueryService', 'sendCodehelpQuery')
  CodehelpQueryService(request: MetadataRequest): Observable<MetadataResponse> {
    if (!request || !request.metadata || !request.metadata['authorization']) {
      return throwError(
        () =>
          new RpcException({
            code: 16,
            message: 'Missing authorization token',
          }),
      );
    }

    const { result, metadata } = request;
    const token = metadata['authorization'].split(' ')[1];

    if (!token) {
      return throwError(
        () =>
          new RpcException({ code: 16, message: 'Invalid or expired token' }),
      );
    }

    let decodedToken: any;
    try {
      decodedToken = jwt.verify(token, jwtConstants.secret) as any;
    } catch (error) {
      return throwError(
        () =>
          new RpcException({ code: 16, message: 'Invalid or expired token' }),
      );
    }

    return this.codeHelpQueryService
      ._SCACodeHelpQuery(
        'Q',
        result.languageSeq || 6,
        result.codeHelpSeq,
        decodedToken.CompanySeq,
        result.keyword,
        result.param1,
        result.param2,
        result.param3,
        result.param4,
        result.conditionSeq,
        result.pageCount,
        result.pageSize,
        result.subConditionSql,
        result.accUnit,
        result.bizUnit,
        result.factUnit,
        307,
        307,
        decodedToken.EmpSeq,
        decodedToken.UserSeq,
      )
      .pipe(
        map((queryResult) => ({
          status: true,
          message: 'Query successful',
          data: JSON.stringify(queryResult.data),
        })),
        catchError((error) =>
          throwError(
            () =>
              new RpcException({
                code: 13,
                message: error.message || 'Internal server error',
              }),
          ),
        ),
      );
  }

  @GrpcMethod('CodehelpQueryService', 'getCodeHelp230427')
  getCodeHelp230427(request: MetadataRequest): Observable<MetadataResponse> {
    if (!request || !request.metadata || !request.metadata['authorization']) {
      return throwError(
        () =>
          new RpcException({
            code: 16,
            message: 'Missing authorization token',
          }),
      );
    }

    const { result, metadata } = request;
    const token = metadata['authorization'].split(' ')[1];

    if (!token) {
      return throwError(
        () =>
          new RpcException({ code: 16, message: 'Invalid or expired token' }),
      );
    }

    let decodedToken: any;
    try {
      decodedToken = jwt.verify(token, jwtConstants.secret) as any;
    } catch (error) {
      return throwError(
        () =>
          new RpcException({ code: 16, message: 'Invalid or expired token' }),
      );
    }

    return this.codeHelpQueryService
      ._SCACodeHelpQueryv230427(
        'Q',
        6,
        result.codeHelpSeq,
        decodedToken.CompanySeq,
        result.keyword,
        result.param1,
        result.param2,
        result.param3,
        result.param4,
        result.conditionSeq,
        result.pageCount,
        result.pageSize,
        result.subConditionSql,
        result.accUnit,
        result.bizUnit,
        result.factUnit,
        307,
        307,
        decodedToken.EmpSeq,
        decodedToken.UserSeq,
      )
      .pipe(
        map((queryResult) => ({
          status: true,
          message: 'Query successful',
          data: JSON.stringify(queryResult.data),
        })),
        catchError((error) =>
          throwError(
            () =>
              new RpcException({
                code: 13,
                message: error.message || 'Internal server error',
              }),
          ),
        ),
      );
  }
}
