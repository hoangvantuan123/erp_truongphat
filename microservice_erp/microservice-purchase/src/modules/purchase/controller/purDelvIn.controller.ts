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
import { PurDelvInService } from '../service/purDelvIn.service';
import { jwtConstants } from 'src/config/security.config';
import * as jwt from 'jsonwebtoken';
import { Request } from 'express';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';

@Controller()
export class PurDelvInController {
  constructor(private readonly purDelvInService: PurDelvInService) {}

  @MessagePattern('spu-delvin-master-query')
  async SPUDelvInMasterQueryWEB(
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
      return this.purDelvInService.SPUDelvInMasterQueryWEB(
        result,
        decodedToken.CompanySeq,
        decodedToken.UserSeq,
        1137,
      );
    } catch (error) {
      throw new RpcException({
        statusCode: 401,
        message: 'Invalid or expired token.',
      });
    }
  }

  @MessagePattern('spu-delvin-link-master-query')
  async SPUDelvInMasterLinkQueryWEB(
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
      return this.purDelvInService.SPUDelvInMasterLinkQueryWEB(
        result,
        decodedToken.CompanySeq,
        decodedToken.UserSeq,
        1137,
      );
    } catch (error) {
      throw new RpcException({
        statusCode: 401,
        message: 'Invalid or expired token.',
      });
    }
  }

  @MessagePattern('spu-delvin-link-sheet-query')
  async SPUDelvInSheetLinkQueryWEB(
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
      return this.purDelvInService.SPUDelvInSheetLinkQueryWEB(
        result,
        decodedToken.CompanySeq,
        decodedToken.UserSeq,
        1137,
      );
    } catch (error) {
      throw new RpcException({
        statusCode: 401,
        message: 'Invalid or expired token.',
      });
    }
  }

  @MessagePattern('spu-delvin-sheet-query')
  async SPUDelvInSheetQueryWEB(
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
      return this.purDelvInService.SPUDelvInSheetQueryWEB(
        result,
        decodedToken.CompanySeq,
        decodedToken.UserSeq,
        1137,
      );
    } catch (error) {
      throw new RpcException({
        statusCode: 401,
        message: 'Invalid or expired token.',
      });
    }
  }

  @MessagePattern('spu-delvin-qr-check')
  async SPurDelvInQRCheckWEB(
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

      return this.purDelvInService.SPurDelvInQRCheckWEB(
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

  @MessagePattern('spu-delvin-aud')
  async SPurDelvInSave(
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

      return this.purDelvInService.SPurDelvInSave(
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

  @MessagePattern('spu-delvin-sheet-delete')
  async SPurDelvInSheetDelete(
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

      return this.purDelvInService.SPurDelvInSheetDelete(
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

  @MessagePattern('spu-delvin-master-delete')
  async SPurDelvInMasterDelete(
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

      return this.purDelvInService.SPurDelvInMasterDelete(
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
