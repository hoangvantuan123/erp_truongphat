import { LGWHStockClosingService } from './../service/lgWHStockClosing.service';
import {
  Controller,
  Get,
  Query,
  Body,
  Req,
  UnauthorizedException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { SimpleQueryResult } from 'src/common/interfaces/simple-query-result.interface';
import { Request } from 'express';
import { jwtConstants } from 'src/config/security.config';
import * as jwt from 'jsonwebtoken';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RpcException } from '@nestjs/microservices';
@Controller()
export class LGWHStockClosingController {
  constructor(
    private readonly lgWHStockClosingService: LGWHStockClosingService,
  ) {}

  @MessagePattern('slg-stock-closing-list')
  async SLGReInOutStockQueryWEB(
    @Payload() data: { result: any[]; authorization: string },
  ): Promise<SimpleQueryResult> {
    const { result, authorization } = data;
    if (!authorization) {
      throw new RpcException({
        statusCode: 401,
        message: 'Invalid or expired token.',
      });
    }
    const token = authorization.split(' ')[1];
    if (!token) {
      throw new RpcException({
        statusCode: 401,
        message: 'Invalid or expired token.',
      });
    }
    try {
      const decodedToken = jwt.verify(token, jwtConstants.secret) as {
        UserId: any;
        EmpSeq: any;
        UserSeq: any;
        CompanySeq: any;
      };

      return this.lgWHStockClosingService.SLGReInOutStockQueryWEB(
        result,
        decodedToken.CompanySeq,
        decodedToken.UserSeq,
        5956,
      );
    } catch (error) {
      throw new RpcException({
        statusCode: 401,
        message: 'Invalid or expired token.',
      });
    }
  }
  @MessagePattern('slg-stock-closing-date-list')
  async SCOMClosingDateDynamicQueryWEB(
    @Payload() data: { result: any[]; authorization: string },
  ): Promise<SimpleQueryResult> {
    const { result, authorization } = data;
    if (!authorization) {
      throw new RpcException({
        statusCode: 401,
        message: 'Invalid or expired token.',
      });
    }
    const token = authorization.split(' ')[1];
    if (!token) {
      throw new RpcException({
        statusCode: 401,
        message: 'Invalid or expired token.',
      });
    }
    try {
      const decodedToken = jwt.verify(token, jwtConstants.secret) as {
        UserId: any;
        EmpSeq: any;
        UserSeq: any;
        CompanySeq: any;
      };

      return this.lgWHStockClosingService.SCOMClosingDateDynamicQueryWEB(
        result,
        decodedToken.CompanySeq,
        decodedToken.UserSeq,
        200863,
      );
    } catch (error) {
      throw new RpcException({
        statusCode: 401,
        message: 'Invalid or expired token.',
      });
    }
  }

  @MessagePattern('slg-stock-closing-month-list')
  async SCOMClosingYMDynamicQueryWEB(
    @Payload() data: { result: any[]; authorization: string },
  ): Promise<SimpleQueryResult> {
    const { result, authorization } = data;
    if (!authorization) {
      throw new RpcException({
        statusCode: 401,
        message: 'Invalid or expired token.',
      });
    }
    const token = authorization.split(' ')[1];
    if (!token) {
      throw new RpcException({
        statusCode: 401,
        message: 'Invalid or expired token.',
      });
    }
    try {
      const decodedToken = jwt.verify(token, jwtConstants.secret) as {
        UserId: any;
        EmpSeq: any;
        UserSeq: any;
        CompanySeq: any;
      };

      return this.lgWHStockClosingService.SCOMClosingYMDynamicQueryWEB(
        result,
        decodedToken.CompanySeq,
        decodedToken.UserSeq,
        200857,
      );
    } catch (error) {
      throw new RpcException({
        statusCode: 401,
        message: 'Invalid or expired token.',
      });
    }
  }

  @MessagePattern('slg-stock-closing-aud')
  async SLGReInOutStockSumSave(
    @Payload() data: { dataSheetAUD: any[]; authorization: string },
  ): Promise<SimpleQueryResult> {
    const { dataSheetAUD, authorization } = data;
    if (!authorization) {
      throw new RpcException({
        statusCode: 401,
        message: 'Invalid or expired token.',
      });
    }
    const token = authorization.split(' ')[1];
    if (!token) {
      throw new RpcException({
        statusCode: 401,
        message: 'Invalid or expired token.',
      });
    }
    try {
      const decodedToken = jwt.verify(token, jwtConstants.secret) as {
        UserId: any;
        EmpSeq: any;
        UserSeq: any;
        CompanySeq: any;
      };

      return this.lgWHStockClosingService.SLGReInOutStockSumSave(
        dataSheetAUD,
        decodedToken.CompanySeq,
        decodedToken.UserSeq,
      );
    } catch (error) {
      throw new RpcException({
        statusCode: 401,
        message: 'Invalid or expired token.',
      });
    }
  }

  @MessagePattern('slg-stock-closing-date-aud')
  async SCOMClosingDateSave(
    @Payload() data: { dataSheetAUD: any[]; authorization: string },
  ): Promise<SimpleQueryResult> {
    const { dataSheetAUD, authorization } = data;
    if (!authorization) {
      throw new RpcException({
        statusCode: 401,
        message: 'Invalid or expired token.',
      });
    }
    const token = authorization.split(' ')[1];
    if (!token) {
      throw new RpcException({
        statusCode: 401,
        message: 'Invalid or expired token.',
      });
    }
    try {
      const decodedToken = jwt.verify(token, jwtConstants.secret) as {
        UserId: any;
        EmpSeq: any;
        UserSeq: any;
        CompanySeq: any;
      };

      return this.lgWHStockClosingService.SCOMClosingDateSave(
        dataSheetAUD,
        decodedToken.CompanySeq,
        decodedToken.UserSeq,
      );
    } catch (error) {
      throw new RpcException({
        statusCode: 401,
        message: 'Invalid or expired token.',
      });
    }
  }
  @MessagePattern('slg-stock-closing-month-aud')
  async SCOMClosingYMSave(
    @Payload() data: { dataSheetAUD: any[]; authorization: string },
  ): Promise<SimpleQueryResult> {
    const { dataSheetAUD, authorization } = data;
    if (!authorization) {
      throw new RpcException({
        statusCode: 401,
        message: 'Invalid or expired token.',
      });
    }
    const token = authorization.split(' ')[1];
    if (!token) {
      throw new RpcException({
        statusCode: 401,
        message: 'Invalid or expired token.',
      });
    }
    try {
      const decodedToken = jwt.verify(token, jwtConstants.secret) as {
        UserId: any;
        EmpSeq: any;
        UserSeq: any;
        CompanySeq: any;
      };

      return this.lgWHStockClosingService.SCOMClosingYMSave(
        dataSheetAUD,
        decodedToken.CompanySeq,
        decodedToken.UserSeq,
      );
    } catch (error) {
      throw new RpcException({
        statusCode: 401,
        message: 'Invalid or expired token.',
      });
    }
  }
  @MessagePattern('slg-stock-year-trans-list')
  async SLGStockNextCalcHistQueryWEB(
    @Payload() data: { result: any[]; authorization: string },
  ): Promise<SimpleQueryResult> {
    const { result, authorization } = data;
    if (!authorization) {
      throw new RpcException({
        statusCode: 401,
        message: 'Invalid or expired token.',
      });
    }
    const token = authorization.split(' ')[1];
    if (!token) {
      throw new RpcException({
        statusCode: 401,
        message: 'Invalid or expired token.',
      });
    }
    try {
      const decodedToken = jwt.verify(token, jwtConstants.secret) as {
        UserId: any;
        EmpSeq: any;
        UserSeq: any;
        CompanySeq: any;
      };

      return this.lgWHStockClosingService.SLGStockNextCalcHistQueryWEB(
        result,
        decodedToken.CompanySeq,
        decodedToken.UserSeq,
        7054,
      );
    } catch (error) {
      throw new RpcException({
        statusCode: 401,
        message: 'Invalid or expired token.',
      });
    }
  }

  @MessagePattern('slg-stock-year-trans-aud')
  async SLGStockNextCalcHistSave(
    @Payload() data: { dataSheetAUD: any[]; authorization: string },
  ): Promise<SimpleQueryResult> {
    const { dataSheetAUD, authorization } = data;
    if (!authorization) {
      throw new RpcException({
        statusCode: 401,
        message: 'Invalid or expired token.',
      });
    }
    const token = authorization.split(' ')[1];
    if (!token) {
      throw new RpcException({
        statusCode: 401,
        message: 'Invalid or expired token.',
      });
    }
    try {
      const decodedToken = jwt.verify(token, jwtConstants.secret) as {
        UserId: any;
        EmpSeq: any;
        UserSeq: any;
        CompanySeq: any;
      };

      return this.lgWHStockClosingService.SLGStockNextCalcHistSave(
        dataSheetAUD,
        decodedToken.CompanySeq,
        decodedToken.UserSeq,
      );
    } catch (error) {
      throw new RpcException({
        statusCode: 401,
        message: 'Invalid or expired token.',
      });
    }
  }

  @MessagePattern('slg-stock-year-trans-delete')
  async SLGStockNextCalcHistDelete(
    @Payload() data: { dataSheetAUD: any[]; authorization: string },
  ): Promise<SimpleQueryResult> {
    const { dataSheetAUD, authorization } = data;
    if (!authorization) {
      throw new RpcException({
        statusCode: 401,
        message: 'Invalid or expired token.',
      });
    }
    const token = authorization.split(' ')[1];
    if (!token) {
      throw new RpcException({
        statusCode: 401,
        message: 'Invalid or expired token.',
      });
    }
    try {
      const decodedToken = jwt.verify(token, jwtConstants.secret) as {
        UserId: any;
        EmpSeq: any;
        UserSeq: any;
        CompanySeq: any;
      };

      return this.lgWHStockClosingService.SLGStockNextCalcHistDelete(
        dataSheetAUD,
        decodedToken.CompanySeq,
        decodedToken.UserSeq,
      );
    } catch (error) {
      throw new RpcException({
        statusCode: 401,
        message: 'Invalid or expired token.',
      });
    }
  }
}
