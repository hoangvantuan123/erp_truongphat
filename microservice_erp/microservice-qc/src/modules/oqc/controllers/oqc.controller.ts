import { Controller, UnauthorizedException } from '@nestjs/common';
import { jwtConstants } from 'src/config/security.config';
import * as jwt from 'jsonwebtoken';
import { OqcService } from '../services/oqc.service';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { SimpleQueryResult } from 'src/common/interfaces/simple-query-result.interface';

interface MetadataResponse {
  status: boolean;
  message: string;
  data: string;
}

@Controller()
export class OqcController {
  constructor(private readonly oqcService: OqcService) {}

  @MessagePattern('search-oqc-req-by')
  searchOqcReqBy(
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

    return this.oqcService
      .searchOqcReqPage(
        result,
        decodedToken.CompanySeq,
        decodedToken.UserSeq,
        3220,
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

  @MessagePattern('get-oqc-seq')
  GetOqcSeq(
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

    return this.oqcService
      .GetOQCSeq(result, decodedToken.CompanySeq, decodedToken.UserSeq, 3220)
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

  @MessagePattern('create-oqc-by')
  async createOqcBy(
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

    try {
      const decodedToken = jwt.verify(token, jwtConstants.secret) as {
        UserId: any;
        EmpSeq: any;
        UserSeq: any;
        CompanySeq: any;
      };

      return this.oqcService.createOqc(
        result,
        decodedToken.CompanySeq,
        decodedToken.UserSeq,
        4394,
      );
    } catch (error) {
      throw new UnauthorizedException(
        'You do not have permission to access this API.',
      );
    }
  }

  @MessagePattern('delete-oqc-by')
  async deleteOqcBy(
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

    try {
      const decodedToken = jwt.verify(token, jwtConstants.secret) as {
        UserId: any;
        EmpSeq: any;
        UserSeq: any;
        CompanySeq: any;
      };

      return this.oqcService.deleteOqcTestReport(
        result,
        decodedToken.CompanySeq,
        decodedToken.UserSeq,
        4394,
      );
    } catch (error) {
      throw new UnauthorizedException(
        'You do not have permission to access this API.',
      );
    }
  }

  @MessagePattern('qc-test-report-batch-fin')
  QcTestReportBatchFin(
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

    return this.oqcService
      .QcTestReportBatchFin(
        result,
        decodedToken.CompanySeq,
        decodedToken.UserSeq,
        7210,
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

  @MessagePattern('oqc-test-report-batch-save')
  async QcTestReportBatchFinSave(
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

    try {
      const decodedToken = jwt.verify(token, jwtConstants.secret) as {
        UserId: any;
        EmpSeq: any;
        UserSeq: any;
        CompanySeq: any;
      };

      return this.oqcService.QcTestReportBatchFinSave(
        result,
        decodedToken.CompanySeq,
        decodedToken.UserSeq,
        7210,
      );
    } catch (error) {
      throw new UnauthorizedException(
        'You do not have permission to access this API.',
      );
    }
  }

  @MessagePattern('fin-result-list')
  searchFinResultList(
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

    return this.oqcService
      .searchFinResultList(
        result,
        decodedToken.CompanySeq,
        decodedToken.UserSeq,
        6985,
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

  @MessagePattern('qc-final-bad-qty-list')
  searchQcFinalBadQtyResultList(
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

    return this.oqcService
      .searchQcFinalBadQtyResultList(
        result,
        decodedToken.CompanySeq,
        decodedToken.UserSeq,
        7214,
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
