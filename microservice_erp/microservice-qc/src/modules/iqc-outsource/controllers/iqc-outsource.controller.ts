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
import { SimpleQueryResult } from 'src/common/interfaces/simple-query-result.interface';
import { jwtConstants } from 'src/config/security.config';
import * as jwt from 'jsonwebtoken';
import { Request } from 'express';
import { IqcOutsourceService } from '../services/iqc-outsource.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class IqcOutsourceController {
  constructor(private readonly iqcService: IqcOutsourceService) {}

  @MessagePattern('search-iqc-outsource-by')
  async searchIqcOutsourceBy(
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

      return this.iqcService.searchPage(
        result,
        decodedToken.CompanySeq,
        decodedToken.UserSeq,
        3209,
      );
    } catch (error) {
      throw new UnauthorizedException(
        'You do not have permission to access this API.',
      );
    }
  }

  @MessagePattern('get-iqc-outsource-by-id')
  async getIqcOutsourceById(
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

      return this.iqcService.getById(
        result,
        decodedToken.CompanySeq,
        decodedToken.UserSeq,
        1059
      );
    } catch (error) {
      throw new UnauthorizedException(
        'You do not have permission to access this API.',
      );
    }
  }

  @MessagePattern('created-iqc-outsource-by')
  async createIqcOutsourcedBy(
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

      return this.iqcService.saveQcTestReport(
        result,
        decodedToken.CompanySeq,
        decodedToken.UserSeq,
        4394
      );
    } catch (error) {
      throw new UnauthorizedException(
        'You do not have permission to access this API.',
      );
    }
  }

  @MessagePattern('created-iqc-outsource-list')
  async createdListBy(
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
        pgmSeq: any;
      };

      return this.iqcService.saveQcTestList(
        result,
        decodedToken.CompanySeq,
        decodedToken.UserSeq,
        6835,
        
      );
    } catch (error) {
      throw new UnauthorizedException(
        'You do not have permission to access this API.',
      );
    }
  }

  @MessagePattern('get-qc-list-item')
  async getQcItemList(
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

      return this.iqcService.getQcListItemBy(
        result,
        decodedToken.CompanySeq,
        6,
        decodedToken.UserSeq,
      );
    } catch (error) {
      throw new UnauthorizedException(
        'You do not have permission to access this API.',
      );
    }
  }

  @MessagePattern('get-qc-report-result')
  async getQcReportResult(
    @Payload() data: { QCSeq: number; authorization: string },
  ): Promise<SimpleQueryResult> {
    const { QCSeq, authorization } = data;

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

      return this.iqcService.getQcTestReportResult(
        QCSeq,
        decodedToken.CompanySeq,
        6,
        decodedToken.UserSeq,
      );
    } catch (error) {
      throw new UnauthorizedException(
        'You do not have permission to access this API.',
      );
    }
  }

  @MessagePattern('get-file-iqc')
  async getQcFileReport(
    @Payload() data: { FileSeq: number; authorization: string },
  ): Promise<SimpleQueryResult> {
    const { FileSeq, authorization } = data;

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

      return this.iqcService.getQcTestFile(
        FileSeq,
        decodedToken.CompanySeq,
        6,
        decodedToken.UserSeq,
      );
    } catch (error) {
      throw new UnauthorizedException(
        'You do not have permission to access this API.',
      );
    }
  }


  @MessagePattern('iqc-outsource-sample')
  async GetQcTestReportSampleReq(
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

      return this.iqcService.QcTestReportSampleReq(
        result,
        decodedToken.CompanySeq,
        decodedToken.UserSeq,
        4394
      );
    } catch (error) {
      throw new UnauthorizedException(
        'You do not have permission to access this API.',
      );
    }
  }

  @MessagePattern('list-qc-outsource-test-report')
  async getListQcTestReportBatch(
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

      return this.iqcService.getListQcTestReportBatch(
        result,
        decodedToken.CompanySeq,
        decodedToken.UserSeq,
        3209
      );
    } catch (error) {
      throw new UnauthorizedException(
        'You do not have permission to access this API.',
      );
    }
  }

  @MessagePattern('iqc-outsource-status')
  async getListQcCheckStatusBatch(
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

      return this.iqcService.QcCheckStatusList(
        result,
        decodedToken.CompanySeq,
        decodedToken.UserSeq,
        6994
      );
    } catch (error) {
      throw new UnauthorizedException(
        'You do not have permission to access this API.',
      );
    }
  }

  @MessagePattern('delete-iqc-outsource-by')
  async deleteIqcOutsource(
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

      return this.iqcService.deleteQcPurchaseTestReport(
        result,
        decodedToken.CompanySeq,
        decodedToken.UserSeq,
        6835
      );
    } catch (error) {
      throw new UnauthorizedException(
        'You do not have permission to access this API.',
      );
    }
  }
}
