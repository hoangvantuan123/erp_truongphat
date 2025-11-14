import {
  Controller,
  Get,
  Query,
  Body,
  Req,
  UnauthorizedException,
  HttpException,
  HttpStatus,
  Delete,
} from '@nestjs/common';
import { SimpleQueryResult } from 'src/common/interfaces/simple-query-result.interface';
import { StockAgingListService } from '../service/stockAgingList.service';
import { jwtConstants } from 'src/config/security.config';
import * as jwt from 'jsonwebtoken';
import { Request } from 'express';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';

@Controller()
export class StockAgingListController {
  constructor(private readonly stockListService: StockAgingListService) {}

  @MessagePattern('slg-stock-aging-list-query')
  async SLGWHStockAgingListQueryWEB(
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

      return this.stockListService.SLGWHStockAgingListQueryWEB(
        result,
        decodedToken.CompanySeq,
        decodedToken.UserSeq,
        1509,
      );
    } catch (error) {
      throw new RpcException({
                statusCode: 401,
                message: 'Invalid or expired token.',
            });
    }
  }
}
