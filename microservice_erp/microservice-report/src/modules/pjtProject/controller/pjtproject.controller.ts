import { Controller } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import * as jwt from 'jsonwebtoken';
import { Observable, catchError, from, map, of } from 'rxjs';
import { jwtConstants } from 'src/config/security.config';
import { MetadataResponse } from '../interface/response';
import { PjtProjectService } from '../service/pjtProject.service';
@Controller()
export class PjtProjectController {
  constructor(private readonly pjtProjectService: PjtProjectService) {}

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
      userSeq: number,
      companySeq: number,
    ) => Observable<any>,
  ): Observable<MetadataResponse> {
    const decodedToken = this.validateToken(request.metadata);
    return serviceMethod(
      request.result,
      decodedToken.UserSeq,
      decodedToken.CompanySeq,
    ).pipe(
      map((queryResult) => {
        const isSuccess = queryResult?.success === true;
        return {
          success: isSuccess,
          message: isSuccess
            ? 'Query successful'
            : queryResult?.message || 'Query failed',
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
      }),
    );
  }

  private handleGrpcRequestSave(
    request: any,
    serviceMethod: (
      masterData: any,
      dataItem: any,
      dataDelv: any,
      companySeq: number,
      userSeq: number,
    ) => Observable<any>,
  ): Observable<MetadataResponse> {
    try {
      const decodedToken = this.validateToken(request.metadata);

      return from(
        serviceMethod(
          request.masterData,
          request.dataItem,
          request.dataDelv,
          decodedToken.CompanySeq,
          decodedToken.UserSeq,
        ),
      ).pipe(
        map((queryResult) => {
          const isSuccess = queryResult?.success === true;

          return {
            success: isSuccess,
            message: 'Query successful',
            data: JSON.stringify(queryResult.data),
            errors: JSON.stringify(queryResult.errors),
          };
        }),
        catchError((error) => {
          return of({
            success: false,
            message: error.message || 'Internal server error',
            data: '',
            errors: JSON.stringify(error.errors),
          });
        }),
      );
    } catch (error) {
      return of({
        success: false,
        message: error.message || 'Internal server error',
        data: '',
        errors: JSON.stringify(error.errors),
      });
    }
  }

  @GrpcMethod('PjtProjectService', 'searchPjtProject')
  searchPjtProject(request: any): Observable<MetadataResponse> {
    return this.handleGrpcRequest(
      request,
      this.pjtProjectService.searchPjtProject.bind(this.pjtProjectService),
    );
  }

  @GrpcMethod('PjtProjectService', 'searchPjtProjectDetail')
  searchPjtProjectDetail(request: any): Observable<MetadataResponse> {
    return this.handleGrpcRequest(
      request,
      this.pjtProjectService.searchPjtProjectDetail.bind(
        this.pjtProjectService,
      ),
    );
  }

  @GrpcMethod('PjtProjectService', 'auPjtProject')
  auPjtProject(request: any): Observable<MetadataResponse> {
    return this.handleGrpcRequestSave(
      request,
      this.pjtProjectService.auPjtProject.bind(this.pjtProjectService),
    );
  }

  @GrpcMethod('PjtProjectService', 'deletePjtProjectItem')
  deletePjtProjectItem(request: any): Observable<MetadataResponse> {
    return this.handleGrpcRequest(
      request,
      this.pjtProjectService.deletePjtProjectItem.bind(this.pjtProjectService),
    );
  }

  @GrpcMethod('PjtProjectService', 'deletePjtDelv')
  deletePjtDelv(request: any): Observable<MetadataResponse> {
    return this.handleGrpcRequest(
      request,
      this.pjtProjectService.deletePjtDelv.bind(this.pjtProjectService),
    );
  }

  @GrpcMethod('PjtProjectService', 'deletePjtProject')
  deletePjtProject(request: any): Observable<MetadataResponse> {
    return this.handleGrpcRequestSave(
      request,
      this.pjtProjectService.deletePjtProject.bind(this.pjtProjectService),
    );
  }

  @GrpcMethod('PjtProjectService', 'confirmPjtProject')
  confirmPjtProject(request: any): Observable<MetadataResponse> {
    return this.handleGrpcRequest(
      request,
      this.pjtProjectService.confirmPjtProject.bind(this.pjtProjectService),
    );
  }
}
