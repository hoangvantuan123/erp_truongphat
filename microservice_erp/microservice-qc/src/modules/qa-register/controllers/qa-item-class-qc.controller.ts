import {
  Controller,
  UnauthorizedException,

} from '@nestjs/common';
import { jwtConstants } from 'src/config/security.config';
import * as jwt from 'jsonwebtoken';
import { MessagePattern, Payload, RpcException} from '@nestjs/microservices';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { SimpleQueryResult } from 'src/common/interfaces/simple-query-result.interface';
import { QaItemClassQcService } from '../services/qa-item-class-qc.service';

interface MetadataResponse {
  status: boolean;
  message: string;
  data: string;
}


@Controller()
export class QaItemClassQcController {
  constructor(private readonly qaItemClassQcService: QaItemClassQcService) {}

  @MessagePattern('search-qa-item-class-qc')
  searchQaItemClassQc(
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

    return this.qaItemClassQcService
      .searchQaItemClassQcPage(
        result,
        decodedToken.CompanySeq,
        decodedToken.UserSeq,
        1050,
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


  @MessagePattern('get-qa-item-class-sub')
  getQaItemClassSub(
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

    return this.qaItemClassQcService
      .getQaItemClassSub(
        result,
        decodedToken.CompanySeq,
        decodedToken.UserSeq,
        1050,
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
                message: error.message ?? 'Internal server error',
              }),
          ),
        ),
      );
  }

  
  @MessagePattern('cud-qa-item-class')
 async createOrUpdateQaItemClass(
    @Payload() data: { dataQaItemClass: any[]; dataQaItemClassSub: any[]; authorization: string },
  ): Promise<SimpleQueryResult> {
    const { dataQaItemClass, dataQaItemClassSub, authorization } = data;

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
  
      return this.qaItemClassQcService
        .cudQaItemClass(
          dataQaItemClass,
          dataQaItemClassSub,
          decodedToken.CompanySeq,
          decodedToken.UserSeq,
          1050,
        );
    }
    catch (error) {
      throw new UnauthorizedException(
        'You do not have permission to access this API.',
      );
    }
  }

  @MessagePattern('delete-qa-item-class-sub')
  async deleteQaItemClassSub(
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
  
      return this.qaItemClassQcService
        .deleteQaItemClassSub(
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

  @MessagePattern('delete-qa-item-class')
 async deleteQaItemClass(
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
  
      return this.qaItemClassQcService
        .deleteQaItemClass(
          result,
          decodedToken.CompanySeq,
          decodedToken.UserSeq,
          1050,
        )

    }
    catch (error) {
      throw new UnauthorizedException(
        'You do not have permission to access this API.',
      );
    }
    
  }

}
