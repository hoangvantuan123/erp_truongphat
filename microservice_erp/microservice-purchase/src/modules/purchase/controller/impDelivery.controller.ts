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
import { ImpDeliveryService } from '../service/impDelivery.service';
import { jwtConstants } from 'src/config/security.config';
import * as jwt from 'jsonwebtoken';
import { Request } from 'express';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';

@Controller()
export class ImpDeliveryController {
  constructor(private readonly impDeliveryService: ImpDeliveryService) {}

  @MessagePattern('simp-req-delivery-master-query')
  async SSLImpPermitMasterQueryWEB(
    @Payload() data: { result: number; authorization: string },
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
      return this.impDeliveryService.SSLImpPermitMasterQueryWEB(
        result,
        decodedToken.CompanySeq,
        decodedToken.UserSeq,
        1365,
      );
    } catch (error) {
      throw new RpcException({
        statusCode: 401,
        message: 'Invalid or expired token.',
      });
    }
  }

  @MessagePattern('simp-delivery-master-query')
  async SSLImpDelvMasterQueryWEB(
    @Payload() data: { result: number; authorization: string },
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
      return this.impDeliveryService.SSLImpDelvMasterQueryWEB(
        result,
        decodedToken.CompanySeq,
        decodedToken.UserSeq,
        1036085,
      );
    } catch (error) {
      throw new RpcException({
        statusCode: 401,
        message: 'Invalid or expired token.',
      });
    }
  }

  @MessagePattern('simp-delivery-link-sheet-query')
  async SSLImpDelvSheetQueryWEB(
    @Payload() data: { result: number; authorization: string },
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
      return this.impDeliveryService.SSLImpDelvSheetQueryWEB(
        result,
        decodedToken.CompanySeq,
        decodedToken.UserSeq,
        1365,
      );
    } catch (error) {
      throw new RpcException({
        statusCode: 401,
        message: 'Invalid or expired token.',
      });
    }
  }

  @MessagePattern('simp-req-delivery-sheet-query')
  async SSLImpPermitSheetQueryWEB(
    @Payload() data: { result: number; authorization: string },
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
      return this.impDeliveryService.SSLImpPermitSheetQueryWEB(
        result,
        decodedToken.CompanySeq,
        decodedToken.UserSeq,
        1365,
      );
    } catch (error) {
      throw new RpcException({
        statusCode: 401,
        message: 'Invalid or expired token.',
      });
    }
  }

  @MessagePattern('simp-delivery-qr-check')
  async SImpDeliveryQRCheckWEB(
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

      return this.impDeliveryService.SImpDeliveryQRCheckWEB(
        result,
        decodedToken.CompanySeq,
        decodedToken.UserSeq,
        '',
      );
    } catch (error) {
      throw new RpcException({
        statusCode: 401,
        message: 'Invalid or expired token.',
      });
    }
  }

  @MessagePattern('simp-delivery-aud')
  async SImpDeliverySave(
    @Payload()
    data: {
      dataMaster: any[];
      dataSheetAUD: any[];
      authorization: string;
    },
  ): Promise<SimpleQueryResult> {
    const { dataMaster, dataSheetAUD, authorization } = data;
    if (!authorization) {
      throw new UnauthorizedException(
        'You do not have permission to access this API.',
      );
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

      return this.impDeliveryService.SImpDeliverySave(
        dataMaster,
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

  @MessagePattern('simp-delivery-sheet-delete')
  async SImpDeliverySheetDelete(
    @Payload()
    data: {
      dataMaster: any[];
      dataSheetAUD: any[];
      authorization: string;
    },
  ): Promise<SimpleQueryResult> {
    const { dataMaster, dataSheetAUD, authorization } = data;
    if (!authorization) {
      throw new UnauthorizedException(
        'You do not have permission to access this API.',
      );
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

      return this.impDeliveryService.SImpDeliverySheetDelete(
        dataMaster,
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

  @MessagePattern('simp-delivery-master-delete')
  async SImpDeliveryMasterDelete(
    @Payload()
    data: {
      dataMaster: any[];
      dataSheetAUD: any[];
      authorization: string;
    },
  ): Promise<SimpleQueryResult> {
    const { dataMaster, dataSheetAUD, authorization } = data;
    if (!authorization) {
      throw new UnauthorizedException(
        'You do not have permission to access this API.',
      );
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

      return this.impDeliveryService.SImpDeliveryMasterDelete(
        dataMaster,
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
