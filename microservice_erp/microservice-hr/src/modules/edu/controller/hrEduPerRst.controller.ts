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
  HttpException,
} from '@nestjs/common';
import { jwtConstants } from 'src/config/security.config';
import * as jwt from 'jsonwebtoken';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { DatabaseService } from 'src/common/database/sqlServer/ITMV/database.service';
import { MetadataResponse } from '../interface/response';
import { Observable, from, catchError, map, of } from 'rxjs';
import { HrEduPerRstService } from '../service/hrEduPerRst.service';
@Controller()
export class HrEduPerRstController {
  constructor(
    private readonly eduPerRstService: HrEduPerRstService,
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

  private handleGrpcRequestSave(
    request: any,
    serviceMethod: (
      info: any,
      dataRstCost: any,
      dataRstItem: any,
      dataEduPerObj: any,
      companySeq: number,
      userSeq: number,
    ) => Observable<any>,
  ): Observable<MetadataResponse> {
    try {
      const decodedToken = this.validateToken(request.metadata);

      return from(
        serviceMethod(
          request.info,
          request.dataRstCost,
          request.dataRstItem,
          request.dataEduPerObj,
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

  @GrpcMethod('HrEduPerRstService', 'searchEduPerRst')
  searchEduPerRst(request: any[]): Observable<MetadataResponse> {
    return this.handleGrpcRequest(
      request,
      this.eduPerRstService.searchEduPerRst.bind(this.eduPerRstService),
    );
  }

  @GrpcMethod('HrEduPerRstService', 'auEduPerRst')
  auEduPerRst(request: any): Observable<MetadataResponse> {
    return this.handleGrpcRequestSave(
      request,
      this.eduPerRstService.auEduPerRst.bind(this.eduPerRstService),
    );
  }

  @GrpcMethod('HrEduPerRstService', 'deleteEduPerRst')
  deleteEduPerRst(request: any): Observable<MetadataResponse> {
    return this.handleGrpcRequestSave(
      request,
      this.eduPerRstService.deleteEduPerRst.bind(this.eduPerRstService),
    );
  }

  @GrpcMethod('HrEduPerRstService', 'deleteEduRstCost')
  deleteEduRstCost(request: any[]): Observable<MetadataResponse> {
    return this.handleGrpcRequest(
      request,
      this.eduPerRstService.deleteEduRstCost.bind(this.eduPerRstService),
    );
  }

  @GrpcMethod('HrEduPerRstService', 'deleteEduRstItem')
  deleteEduRstItem(request: any[]): Observable<MetadataResponse> {
    return this.handleGrpcRequest(
      request,
      this.eduPerRstService.deleteEduRstItem.bind(this.eduPerRstService),
    );
  }

  @GrpcMethod('HrEduPerRstService', 'searchEduCostRst')
  searchEduCostRst(request: any[]): Observable<MetadataResponse> {
    return this.handleGrpcRequest(
      request,
      this.eduPerRstService.searchEduCostRst.bind(this.eduPerRstService),
    );
  }

  @GrpcMethod('HrEduPerRstService', 'searchEduItemRst')
  searchEduItemRst(request: any[]): Observable<MetadataResponse> {
    return this.handleGrpcRequest(
      request,
      this.eduPerRstService.searchEduItemRst.bind(this.eduPerRstService),
    );
  }

  @GrpcMethod('HrEduPerRstService', 'searchEduRst')
  searchEduRst(request: any[]): Observable<MetadataResponse> {
    return this.handleGrpcRequest(
      request,
      this.eduPerRstService.searchEduRst.bind(this.eduPerRstService),
    );
  }

  @GrpcMethod('HrEduPerRstService', 'searchEduRstEnd')
  searchEduRstEnd(request: any[]): Observable<MetadataResponse> {
    return this.handleGrpcRequest(
      request,
      this.eduPerRstService.searchEduRstEnd.bind(this.eduPerRstService),
    );
  }

  @GrpcMethod('HrEduPerRstService', 'searchEduRstBatch')
  searchEduRstBatch(request: any[]): Observable<MetadataResponse> {
    return this.handleGrpcRequest(
      request,
      this.eduPerRstService.searchEduRstBatch.bind(this.eduPerRstService),
    );
  }

  @GrpcMethod('HrEduPerRstService', 'auEduRstEnd')
  auEduRstEnd(request: any): Observable<MetadataResponse> {
    return this.handleGrpcRequest(
      request,
      this.eduPerRstService.auEduRstEnd.bind(this.eduPerRstService),
    );
  }

  @GrpcMethod('HrEduPerRstService', 'auEduRstBatch')
  auEduRstBatch(request: any): Observable<MetadataResponse> {
    return this.handleGrpcRequestSave(
      request,
      this.eduPerRstService.auEduRstBatch.bind(this.eduPerRstService),
    );
  }

  @GrpcMethod('HrEduPerRstService', 'searchEduCostRstBatch')
  searchEduCostRstBatch(request: any[]): Observable<MetadataResponse> {
    return this.handleGrpcRequest(
      request,
      this.eduPerRstService.searchEduCostRstBatch.bind(this.eduPerRstService),
    );
  }

  @GrpcMethod('HrEduPerRstService', 'searchEduItemRstBatch')
  searchEduItemRstBatch(request: any[]): Observable<MetadataResponse> {
    return this.handleGrpcRequest(
      request,
      this.eduPerRstService.searchEduItemRstBatch.bind(this.eduPerRstService),
    );
  }

  @GrpcMethod('HrEduPerRstService', 'deleteEduRstCostBatch')
  deleteEduRstCostBatch(request: any[]): Observable<MetadataResponse> {
    return this.handleGrpcRequest(
      request,
      this.eduPerRstService.deleteEduRstCostBatch.bind(this.eduPerRstService),
    );
  }

  @GrpcMethod('HrEduPerRstService', 'deleteEduRstItemBatch')
  deleteEduRstItemBatch(request: any[]): Observable<MetadataResponse> {
    return this.handleGrpcRequest(
      request,
      this.eduPerRstService.deleteEduRstItemBatch.bind(this.eduPerRstService),
    );
  }

  @GrpcMethod('HrEduPerRstService', 'deleteEduRstObjBatch')
  deleteEduRstObjBatch(request: any[]): Observable<MetadataResponse> {
    return this.handleGrpcRequest(
      request,
      this.eduPerRstService.deleteEduRstObjBatch.bind(this.eduPerRstService),
    );
  }

  @GrpcMethod('HrEduPerRstService', 'searchEduRstObjBatch')
  searchEduRstObjBatch(request: any[]): Observable<MetadataResponse> {
    return this.handleGrpcRequest(
      request,
      this.eduPerRstService.searchEduRstObjBatch.bind(this.eduPerRstService),
    );
  }
}
