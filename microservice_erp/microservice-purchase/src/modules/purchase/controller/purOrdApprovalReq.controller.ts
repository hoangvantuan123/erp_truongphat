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
import { PurOrdApprovalReqService } from '../service/purOrdApprovalReq.service';
import { jwtConstants } from 'src/config/security.config';
import * as jwt from 'jsonwebtoken';
import { Request } from 'express';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';

@Controller()
export class PurOrdApprovalReqController {
  constructor(
    private readonly purOrdApprovalReqService: PurOrdApprovalReqService,
  ) {}

  @MessagePattern('sord-approval-req-master-query')
  async SPUORDApprovalReqMasterQueryWEB(
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

      return this.purOrdApprovalReqService.SPUORDApprovalReqMasterQueryWEB(
        result,
        decodedToken.CompanySeq,
        decodedToken.UserSeq,
        1129,
      );
    } catch (error) {
      throw new RpcException({
        statusCode: 401,
        message: 'Invalid or expired token.',
      });
    }
  }

  @MessagePattern('sord-approval-req-sheet-query')
  async SPUORDApprovalReqSheetQueryWEB(
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

      return this.purOrdApprovalReqService.SPUORDApprovalReqSheetQueryWEB(
        result,
        decodedToken.CompanySeq,
        decodedToken.UserSeq,
        1129,
      );
    } catch (error) {
      throw new RpcException({
        statusCode: 401,
        message: 'Invalid or expired token.',
      });
    }
  }


  @MessagePattern('sord-approval-req-aud')
  async SOrdApprovalReqSave(
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

      return this.purOrdApprovalReqService.SOrdApprovalReqSave(
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

  @MessagePattern('sord-approval-req-master-delete')
  async SOrdApprovalReqDelete(
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

      return this.purOrdApprovalReqService.SOrdApprovalReqDelete(
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

  @MessagePattern('sord-approval-req-sheet-delete')
  async SOrdApprovalReqSheetDelete(
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

      return this.purOrdApprovalReqService.SOrdApprovalReqSheetDelete(
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
