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
import { IqcPurchaseService } from '../services/iqc-purchase.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class IqcPurchaseController {
  constructor(private readonly iqcService: IqcPurchaseService) {}

  @MessagePattern('search-iqc-purchase-by')
  async searchIqcPurchaseBy(
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
        1059,
      );
    } catch (error) {
      throw new UnauthorizedException(
        'You do not have permission to access this API.',
      );
    }
  }

  @MessagePattern('get-iqc-purchase-by-id')
  async getIqcPurchaseById(
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

  @MessagePattern('created-iqc-purchase-by')
  async createIqcPurchasedBy(
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

  @MessagePattern('created-iqc-puchase-list')
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


  @MessagePattern('iqc-test-report-sample')
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
        6,
        decodedToken.UserSeq,
      );
    } catch (error) {
      throw new UnauthorizedException(
        'You do not have permission to access this API.',
      );
    }
  }

  // @MessagePattern('iqc-test-report-item')
  // async QcTestReportItemSaveOrDelete(
  //   @Payload() data: { result: any[]; authorization: string },
  // ): Promise<SimpleQueryResult> {
  //   const { result, authorization } = data;

  //   if (!authorization) {
  //     throw new UnauthorizedException(
  //       'You do not have permission to access this API.',
  //     );
  //   }

  //   const token = authorization.split(' ')[1];

  //   if (!token) {
  //     throw new UnauthorizedException(
  //       'You do not have permission to access this API.',
  //     );
  //   }

  //   try {
  //     const decodedToken = jwt.verify(token, jwtConstants.secret) as {
  //       UserId: any;
  //       EmpSeq: any;
  //       UserSeq: any;
  //       CompanySeq: any;
  //     };

  //     return this.iqcService.QcTestReportItemSaveOrDelete(
  //       result,
  //       decodedToken.CompanySeq,
  //       6,
  //       decodedToken.UserSeq,
  //     );
  //   } catch (error) {
  //     throw new UnauthorizedException(
  //       'You do not have permission to access this API.',
  //     );
  //   }  
  // }

  // @MessagePattern('iqc-save-file')
  // async QcTestSaveFile(
  //   @Payload() data: { result: any[]; authorization: string },
  // ): Promise<SimpleQueryResult> {
  //   const { result, authorization } = data;

  //   if (!authorization) {
  //     throw new UnauthorizedException(
  //       'You do not have permission to access this API.',
  //     );
  //   }

  //   const token = authorization.split(' ')[1];

  //   if (!token) {
  //     throw new UnauthorizedException(
  //       'You do not have permission to access this API.',
  //     );
  //   }

  //   try {
  //     const decodedToken = jwt.verify(token, jwtConstants.secret) as {
  //       UserId: any;
  //       EmpSeq: any;
  //       UserSeq: any;
  //       CompanySeq: any;
  //     };

  //     return this.iqcService.QcTestFileSave(
  //       result,
  //       decodedToken.CompanySeq,
  //       decodedToken.UserSeq,
  //       decodedToken.UserId,
  //       decodedToken.EmpSeq,
  //     );
  //   } catch (error) {
  //     throw new UnauthorizedException(
  //       'You do not have permission to access this API.',
  //     );
  //   }
  // }

  @MessagePattern('list-qc-purchase-test-report')
  async getListQcPurchaseTestReportBatch(
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
        6835
      );
    } catch (error) {
      throw new UnauthorizedException(
        'You do not have permission to access this API.',
      );
    }
  }

  @MessagePattern('search-iqc-purchase-status')
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
        6992
      );
    } catch (error) {
      throw new UnauthorizedException(
        'You do not have permission to access this API.',
      );
    }
  }

  @MessagePattern('delete-iqc-purchase-by')
    async createdBy(
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
          4394
        );
      } catch (error) {
        throw new UnauthorizedException(
          'You do not have permission to access this API.',
        );
      }
    }
}
