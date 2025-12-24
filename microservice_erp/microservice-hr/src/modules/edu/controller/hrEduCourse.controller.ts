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
import { HrEduCourseService } from '../service/hrEduCourse.service';
@Controller()
export class HrEduCourseController {
  constructor(
    private readonly eduCourseService: HrEduCourseService,
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

  @GrpcMethod('HrEduCourseService', 'searchEduCourse')
  searchEduCourse(request: any[]): Observable<MetadataResponse> {
    return this.handleGrpcRequest(
      request,
      this.eduCourseService.searchEduCourse.bind(this.eduCourseService),
    );
  }

  @GrpcMethod('HrEduCourseService', 'auEduCourse')
  auEduCourse(request: any): Observable<MetadataResponse> {
    return this.handleGrpcRequest(
      request,
      this.eduCourseService.auEduCourse.bind(this.eduCourseService),
    );
  }

  @GrpcMethod('HrEduCourseService', 'deleteEduCourse')
  deleteEduCourse(request: any): Observable<MetadataResponse> {
    return this.handleGrpcRequest(
      request,
      this.eduCourseService.deleteEduCourse.bind(this.eduCourseService),
    );
  }
}
