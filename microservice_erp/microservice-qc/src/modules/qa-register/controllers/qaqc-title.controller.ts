import {
  Controller,
  UnauthorizedException,
} from '@nestjs/common';
import { jwtConstants } from 'src/config/security.config';
import * as jwt from 'jsonwebtoken';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { QaQcTitleService } from '../services/qaqc-title.service';
import { SimpleQueryResult } from 'src/common/interfaces/simple-query-result.interface';

interface MetadataResponse {
  status: boolean;
  message: string;
  data: string;
}


@Controller()
export class QaQcTitleController {
  constructor(private readonly qaQcTitleService: QaQcTitleService) {}

  @MessagePattern('search-qa-qc-title')
  searchQaQcTitle(
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

    return this.qaQcTitleService
      .searchQaQaTitlePage(
        result,
        decodedToken.CompanySeq,
        decodedToken.UserSeq,
        1047,
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


  @MessagePattern('get-qa-item-bad')
  getQaItemBad(
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

    return this.qaQcTitleService
      .getQaItemBad(
        result,
        decodedToken.CompanySeq,
        decodedToken.UserSeq,
        1047,
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

  
  @MessagePattern('cud-qaqc-title')
 async createOrUpdateQaQcTitle(
    @Payload() data: { dataQaQcTitle: any[]; dataQaItemBad: any[]; authorization: string },
  ): Promise<SimpleQueryResult> {
    const { dataQaQcTitle, dataQaItemBad, authorization } = data;

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

    try{
      const decodedToken = jwt.verify(token, jwtConstants.secret) as {
        UserId: any;
        EmpSeq: any;
        UserSeq: any;
        CompanySeq: any;
      };
  
      return this.qaQcTitleService
        .cudQaQcTitle(
          dataQaQcTitle,
          dataQaItemBad,
          decodedToken.CompanySeq,
          decodedToken.UserSeq,
          1047,
        );
    }
    catch (error) {
      throw new UnauthorizedException(
        'You do not have permission to access this API.',
      );
    }
  }

  @MessagePattern('delete-qaqc-title')
  async deleteQaQcTitle(
    @Payload() data: { result: any[]; authorization: string },
  ): Promise<SimpleQueryResult> {
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

    try{
      const decodedToken = jwt.verify(token, jwtConstants.secret) as {
        UserId: any;
        EmpSeq: any;
        UserSeq: any;
        CompanySeq: any;
      };
  
      return this.qaQcTitleService
        .deleteQaQcTitle(
          result,
          decodedToken.CompanySeq,
          decodedToken.UserSeq,
          1047,
        )

    }
    catch (error) {
      throw new UnauthorizedException(
        'You do not have permission to access this API.',
      );
    }

  }

  @MessagePattern('delete-qa-item-bad')
 async deleteQcItemBad(
    @Payload() data: { result: any[]; UMQCTitleSeq: any; authorization: string },
  ): Promise<SimpleQueryResult> {
    const { result, UMQCTitleSeq, authorization } = data;

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

    try{
      const decodedToken = jwt.verify(token, jwtConstants.secret) as {
        UserId: any;
        EmpSeq: any;
        UserSeq: any;
        CompanySeq: any;
      };
  
      return this.qaQcTitleService
        .deleteQcItemBad(
          result,
          UMQCTitleSeq,
          decodedToken.CompanySeq,
          decodedToken.UserSeq,
          1047,
        )

    }
    catch (error) {
      throw new UnauthorizedException(
        'You do not have permission to access this API.',
      );
    }
    
  }

}
