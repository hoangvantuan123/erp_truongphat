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
import { HrEduClassService } from '../service/hrEduClass.service';
@Controller()
export class HrEduClassController {
  constructor(
    private readonly eduClassService: HrEduClassService,
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

  @GrpcMethod('HrEduClassService', 'searchEduClassTree')
  searchEduClassTree(request: any[]): Observable<MetadataResponse> {
    return this.handleGrpcRequest(
      request,
      this.eduClassService.searchEduClassTree.bind(this.eduClassService),
    );
  }

  @GrpcMethod('HrEduClassService', 'getEduClass')
  getEduClass(request: any[]): Observable<MetadataResponse> {
    return this.handleGrpcRequest(
      request,
      this.eduClassService.getEduClass.bind(this.eduClassService),
    );
  }

  @GrpcMethod('HrEduClassService', 'auEduClass')
  auEduClass(request: any): Observable<MetadataResponse> {
    return this.handleGrpcRequest(
      request,
      this.eduClassService.auEduClass.bind(this.eduClassService),
    );
  }

  @GrpcMethod('HrEduClassService', 'deleteEduClass')
  deleteEduClass(request: any): Observable<MetadataResponse> {
    return this.handleGrpcRequest(
      request,
      this.eduClassService.deleteEduClass.bind(this.eduClassService),
    );
  }

}
