import { AgingLotStockListService } from './../service/agingLotStockList.service';
import {
  Controller,
  Get,
  Query,
  Post,
  Body,
  Req,
  UnauthorizedException,
  HttpException,
  HttpStatus,
  Delete,
} from '@nestjs/common';
import { SimpleQueryResult } from 'src/common/interfaces/simple-query-result.interface';
import { jwtConstants } from 'src/config/security.config';
import * as jwt from 'jsonwebtoken';
import { Request } from 'express';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RpcException } from '@nestjs/microservices';
@Controller()
export class AgingLotStockListController {
  constructor(
    private readonly agingLotStockListService: AgingLotStockListService,
  ) {}

  @MessagePattern('slg-wh-lot-stock-list-query')
  async SLGWHLotStockListQueryWEB(
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

      return this.agingLotStockListService.SLGWHLotStockListQueryWEB(
        result,
        decodedToken.CompanySeq,
        decodedToken.UserSeq,
        1034451,
      );
    } catch (error) {
    throw new RpcException({
        statusCode: 401,
        message: 'Invalid or expired token.',
      });
    }
  }
}
