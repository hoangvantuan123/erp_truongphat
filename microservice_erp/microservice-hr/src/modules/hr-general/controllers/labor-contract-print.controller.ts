import { Controller } from '@nestjs/common';
import { jwtConstants } from 'src/config/security.config';
import * as jwt from 'jsonwebtoken';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { DatabaseService } from 'src/common/database/sqlServer/ITMV/database.service';
import { MetadataResponse } from '../interface/response';
import { Observable, from, catchError, map, of } from 'rxjs';
import { HrLaborContractPrintService } from '../services/labor-contract-print.service';
@Controller()
export class HrLaborContractPrintController {
  constructor(
    private readonly laborContractPrintService: HrLaborContractPrintService,
    private readonly databaseService: DatabaseService,
  ) {}

  private validateToken(metadata: any): {
    UserId: number;
    EmpSeq: number;
    UserSeq: number;
    CompanySeq: number;
  } {
    if (!metadata || !metadata['authorization']) {
      throw new RpcException({
        code: 16,
        message: 'Missing authorization token',
      });
    }

    const token = metadata['authorization'].split(' ')[1];
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
    serviceMethod: (
      result: any,
      companySeq: number,
      userSeq: number,
    ) => Observable<any>,
  ): Observable<MetadataResponse> {
    try {
      const decodedToken = this.validateToken(request.metadata);

      return from(
        serviceMethod(
          request.result,
          decodedToken.CompanySeq,
          decodedToken.UserSeq,
        ),
      ).pipe(
        map((queryResult) => {
          const isSuccess = queryResult?.success === true;
          return {
            status: isSuccess,
            message: 'Query successful',
            data: JSON.stringify(queryResult.data),
            errors: JSON.stringify(queryResult.errors),
          };
        }),
        catchError((error) => {
          return of({
            status: false,
            message: error.message || 'Internal server error',
            data: '',
            errors: JSON.stringify(error.errors),
          });
        }),
      );
    } catch (error) {
      return of({
        status: false,
        message: error.message || 'Internal server error',
        data: '',
        errors: JSON.stringify(error.errors),
      });
    }
  }

  private handleGrpcRequestSave(
    request: any,
    serviceMethod: (
      dataDept: any,
      dataDeptHis: any,
      dataOrgCCtr: any,
      companySeq: number,
      userSeq: number,
    ) => Observable<any>,
  ): Observable<MetadataResponse> {
    try {
      const decodedToken = this.validateToken(request.metadata);
      return from(
        serviceMethod(
          request.dataDept,
          request.dataDeptHis,
          request.dataOrgCCtr,
          decodedToken.CompanySeq,
          decodedToken.UserSeq,
        ),
      ).pipe(
        map((queryResult) => {
          const isSuccess = queryResult?.success === true;
          return {
            status: isSuccess,
            message: 'Query successful',
            data: JSON.stringify(queryResult.data),
            errors: JSON.stringify(queryResult.errors),
          };
        }),
        catchError((error) => {
          return of({
            status: false,
            message: error.message || 'Internal server error',
            data: '',
            errors: JSON.stringify(error.errors),
          });
        }),
      );
    } catch (error) {
      return of({
        status: false,
        message: error.message || 'Internal server error',
        data: '',
        errors: JSON.stringify(error.errors),
      });
    }
  }

  @GrpcMethod('HrLaborContractPrintService', 'searchLaborContractPrint')
  searchLaborContractPrint(request: any): Observable<MetadataResponse> {
    return this.handleGrpcRequest(
      request,
      this.laborContractPrintService.searchLaborContractPrint.bind(
        this.laborContractPrintService,
      ),
    );
  }

  @GrpcMethod('HrLaborContractPrintService', 'searchCertificateIssue')
  searchCertificateIssue(request: any): Observable<MetadataResponse> {
    return this.handleGrpcRequest(
      request,
      this.laborContractPrintService.searchCertificateIssue.bind(
        this.laborContractPrintService,
      ),
    );
  }

  @GrpcMethod('HrLaborContractPrintService', 'auCertificateIssue')
  auCertificateIssue(request: any): Observable<MetadataResponse> {
    return this.handleGrpcRequest(
      request,
      this.laborContractPrintService.auCertificateIssue.bind(
        this.laborContractPrintService,
      ),
    );
  }

  @GrpcMethod('HrLaborContractPrintService', 'deleteCertificateIssue')
  deleteCertificateIssue(request: any): Observable<MetadataResponse> {
    return this.handleGrpcRequest(
      request,
      this.laborContractPrintService.deleteCertificateIssue.bind(
        this.laborContractPrintService,
      ),
    );
  }

  @GrpcMethod('HrLaborContractPrintService', 'searchCertificateIssueList')
  searchCertificateIssueList(request: any): Observable<MetadataResponse> {
    return this.handleGrpcRequest(
      request,
      this.laborContractPrintService.searchCertificateIssueList.bind(
        this.laborContractPrintService,
      ),
    );
  }

}
