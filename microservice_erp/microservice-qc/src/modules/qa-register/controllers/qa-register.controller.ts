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
  Delete,
} from '@nestjs/common';
import { jwtConstants } from 'src/config/security.config';
import * as jwt from 'jsonwebtoken';
import { Request } from 'express';
import { QaRegisterService } from '../services/qa-register.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { RpcException } from '@nestjs/microservices';

interface MetadataResponse {
  status: boolean;
  message: string;
  data: string;
}


@Controller()
export class QaRegisterController {
  constructor(private readonly qaRegisService: QaRegisterService) {}

  @MessagePattern('search-qa-item-type')
  searchQaItem(
    @Payload() data: { result: any[]; authorization: string },
  ): Observable<MetadataResponse> {
    const { result, authorization } = data;

    if (!authorization) {
      throw new UnauthorizedException(
        'You do not have permission to access this API.',
      );
    }

    const token = authorization.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException(
        'You do not have permission to access this API.',
      );
    }

    const decodedToken = jwt.verify(token, jwtConstants.secret) as {
      UserId: any;
      EmpSeq: any;
      UserSeq: any;
      CompanySeq: any;
    };

    return this.qaRegisService
      .searchQaItemPage(
        result,
        decodedToken.CompanySeq,
        decodedToken.UserSeq,
        5580,
      )
      .pipe(
        map((queryResult) => ({
          status: true,
          message: 'Query successful',
          data: queryResult.data,
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

  @MessagePattern('create-qa-item-type')
  createQAItemQCType(
    @Payload() data: { result: any[]; authorization: string },
  ): Observable<MetadataResponse> {
    const { result, authorization } = data;

    if (!authorization) {
      throw new UnauthorizedException(
        'You do not have permission to access this API.',
      );
    }

    const token = authorization.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException(
        'You do not have permission to access this API.',
      );
    }

    const decodedToken = jwt.verify(token, jwtConstants.secret) as {
      UserId: any;
      EmpSeq: any;
      UserSeq: any;
      CompanySeq: any;
    };

    return this.qaRegisService
      .createQAItemQCType(
        result,
        decodedToken.CompanySeq,
        decodedToken.UserSeq,
        5580,
      )
      .pipe(
        map((queryResult) => ({
          status: true,
          message: 'Query successful',
          data: queryResult.data,
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

  @MessagePattern('get-item-qa')
  getItemQA(
    @Payload() data: { result: any[]; authorization: string },
  ): Observable<MetadataResponse> {
    const { result, authorization } = data;

    if (!authorization) {
      throw new UnauthorizedException(
        'You do not have permission to access this API.',
      );
    }

    const token = authorization.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException(
        'You do not have permission to access this API.',
      );
    }

    const decodedToken = jwt.verify(token, jwtConstants.secret) as {
      UserId: any;
      EmpSeq: any;
      UserSeq: any;
      CompanySeq: any;
    };

    return this.qaRegisService
      .getItemQA(
        result,
        decodedToken.CompanySeq,
        decodedToken.UserSeq,
        1048,
      )
      .pipe(
        map((queryResult) => ({
          status: true,
          message: 'Query successful',
          data: queryResult.data,
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

  @MessagePattern('get-qa-item-qc')
  getQaItemQc(
    @Payload() data: { result: any[]; authorization: string },
  ): Observable<MetadataResponse> {
    const { result, authorization } = data;

    if (!authorization) {
      throw new UnauthorizedException(
        'You do not have permission to access this API.',
      );
    }

    const token = authorization.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException(
        'You do not have permission to access this API.',
      );
    }

    const decodedToken = jwt.verify(token, jwtConstants.secret) as {
      UserId: any;
      EmpSeq: any;
      UserSeq: any;
      CompanySeq: any;
    };

    return this.qaRegisService
      .getQaItemQc(
        result,
        decodedToken.CompanySeq,
        decodedToken.UserSeq,
        1048,
      )
      .pipe(
        map((queryResult) => ({
          status: true,
          message: 'Query successful',
          data: queryResult.data,
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

  @MessagePattern('get-qa-item-qc-title')
  getQaItemQcTitle(
    @Payload() data: { result: any[]; authorization: string },
  ): Observable<MetadataResponse> {
    const { result, authorization } = data;

    if (!authorization) {
      throw new UnauthorizedException(
        'You do not have permission to access this API.',
      );
    }

    const token = authorization.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException(
        'You do not have permission to access this API.',
      );
    }

    const decodedToken = jwt.verify(token, jwtConstants.secret) as {
      UserId: any;
      EmpSeq: any;
      UserSeq: any;
      CompanySeq: any;
    };

    return this.qaRegisService
      .getQaItemQcTitle(
        result,
        decodedToken.CompanySeq,
        decodedToken.UserSeq,
        1048,
      )
      .pipe(
        map((queryResult) => ({
          status: true,
          message: 'Query successful',
          data: queryResult.data,
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

  @MessagePattern('save-qa-item-qc')
  saveQaItemQc(
    @Payload() data: { result: any[]; authorization: string },
  ): Observable<MetadataResponse> {
    const { result, authorization } = data;

    if (!authorization) {
      throw new UnauthorizedException(
        'You do not have permission to access this API.',
      );
    }

    const token = authorization.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException(
        'You do not have permission to access this API.',
      );
    }

    const decodedToken = jwt.verify(token, jwtConstants.secret) as {
      UserId: any;
      EmpSeq: any;
      UserSeq: any;
      CompanySeq: any;
    };

    return this.qaRegisService
      .saveQaItemQc(
        result,
        decodedToken.CompanySeq,
        decodedToken.UserSeq,
        1048,
      )
      .pipe(
        map((queryResult) => ({
          status: true,
          message: 'Query successful',
          data: queryResult.data,
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

  @MessagePattern('save-qa-item-qc-title')
  saveQaItemQcTitle(
    @Payload() data: { result: any[]; authorization: string },
  ): Observable<MetadataResponse> {
    const { result, authorization } = data;

    if (!authorization) {
      throw new UnauthorizedException(
        'You do not have permission to access this API.',
      );
    }

    const token = authorization.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException(
        'You do not have permission to access this API.',
      );
    }

    const decodedToken = jwt.verify(token, jwtConstants.secret) as {
      UserId: any;
      EmpSeq: any;
      UserSeq: any;
      CompanySeq: any;
    };

    return this.qaRegisService
      .saveQaItemQcTitle(
        result,
        decodedToken.CompanySeq,
        decodedToken.UserSeq,
        1048,
      )
      .pipe(
        map((queryResult) => ({
          status: true,
          message: 'Query successful',
          data: queryResult.data,
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

  @MessagePattern('delete-qa-item-qc')
  deleteQaItemQc(
    @Payload() data: { result: any[]; authorization: string },
  ): Observable<MetadataResponse> {
    const { result, authorization } = data;

    if (!authorization) {
      throw new UnauthorizedException(
        'You do not have permission to access this API.',
      );
    }

    const token = authorization.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException(
        'You do not have permission to access this API.',
      );
    }

    const decodedToken = jwt.verify(token, jwtConstants.secret) as {
      UserId: any;
      EmpSeq: any;
      UserSeq: any;
      CompanySeq: any;
    };

    return this.qaRegisService
      .deleteQaItemQc(
        result,
        decodedToken.CompanySeq,
        decodedToken.UserSeq,
        1048,
      )
      .pipe(
        map((queryResult) => ({
          status: true,
          message: 'Query successful',
          data: queryResult.data,
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
