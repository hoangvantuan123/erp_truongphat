import {
  Controller,
  UnauthorizedException,
} from '@nestjs/common';
import { jwtConstants } from 'src/config/security.config';
import * as jwt from 'jsonwebtoken';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { SimpleQueryResult } from 'src/common/interfaces/simple-query-result.interface';
import { QaCustQcTitleService } from '../services/qa-cust-qc-title.service';

interface MetadataResponse {
  status: boolean;
  message: string;
  data: string;
}


@Controller()
export class QaCustQcTitleController {
  constructor(private readonly qaCustService: QaCustQcTitleService) {}

  @MessagePattern('search-qa-cust-qc-title')
  searchQaCustQcTitle(
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

    return this.qaCustService
      .searchQaCustQCTitlePage(
        result,
        decodedToken.CompanySeq,
        decodedToken.UserSeq,
        1051,
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


  @MessagePattern('get-qa-item-by-cust')
  getQaItemByCust(
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

    return this.qaCustService
      .getQaItemByCust(
        result,
        decodedToken.CompanySeq,
        decodedToken.UserSeq,
        1051,
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

  @MessagePattern('get-um-qc-by-item')
  getUMQcByItem(
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

    return this.qaCustService
      .getUMQCByItem(
        result,
        decodedToken.CompanySeq,
        decodedToken.UserSeq,
        1051,
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

  
  @MessagePattern('cud-qa-cust-qc-title')
 async createOrUpdateQaCustQcTitle(
    @Payload() data: { dataCust: any[]; dataQaItem: any[]; dataUMQc: any[]; authorization: string },
  ): Promise<SimpleQueryResult> {
    const { dataCust, dataQaItem, dataUMQc, authorization } = data;

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
  
      return this.qaCustService
        .cudQaCustQcTitle(
          dataCust,
          dataQaItem,
          dataUMQc,
          decodedToken.CompanySeq,
          decodedToken.UserSeq,
          1051,
        );
    }
    catch (error) {
      throw new UnauthorizedException(
        'You do not have permission to access this API.',
      );
    }
  }

}
