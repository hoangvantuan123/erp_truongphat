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
import { PurDelvService } from '../service/purDelv.service';
import { jwtConstants } from 'src/config/security.config';
import * as jwt from 'jsonwebtoken';
import { Request } from 'express';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';

@Controller()
export class PurDelvController {
  constructor(private readonly purDelvService: PurDelvService) {}

  @MessagePattern('sdelv-master-query')
  async SPUDelvMasterQueryWEB(
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

      return this.purDelvService.SPUDelvMasterQueryWEB(
        result,
        decodedToken.CompanySeq,
        decodedToken.UserSeq,
        1134,
      );
    } catch (error) {
      throw new RpcException({
        statusCode: 401,
        message: 'Invalid or expired token.',
      });
    }
  }

  @MessagePattern('sdelv-sheet-query')
  async SPUDelvSheetQueryWEB(
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

      return this.purDelvService.SPUDelvSheetQueryWEB(
        result,
        decodedToken.CompanySeq,
        decodedToken.UserSeq,
        1134,
      );
    } catch (error) {
      throw new RpcException({
        statusCode: 401,
        message: 'Invalid or expired token.',
      });
    }
  }

  @MessagePattern('sdelv-master-link-query')
  async SPUDelvMasterLinkQueryWEB(
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

      return this.purDelvService.SPUDelvMasterLinkQueryWEB(
        result,
        decodedToken.CompanySeq,
        decodedToken.UserSeq,
        1134,
      );
    } catch (error) {
      throw new RpcException({
        statusCode: 401,
        message: 'Invalid or expired token.',
      });
    }
  }

  @MessagePattern('sdelv-sheet-link-query')
  async SPUDelvSheetLinkQueryWEB(
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

      return this.purDelvService.SPUDelvSheetLinkQueryWEB(
        result,
        decodedToken.CompanySeq,
        decodedToken.UserSeq,
        1134,
      );
    } catch (error) {
      throw new RpcException({
        statusCode: 401,
        message: 'Invalid or expired token.',
      });
    }
  }

  @MessagePattern('sdelv-aud')
  async SDelvSave(
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

      return this.purDelvService.SDelvSave(
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

  @MessagePattern('sdelv-master-delete')
  async SDelvDelete(
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

      return this.purDelvService.SDelvDelete(
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

  @MessagePattern('sdelv-sheet-delete')
  async SDelvSheetDelete(
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

      return this.purDelvService.SDelvSheetDelete(
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
