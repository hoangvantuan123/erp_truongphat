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
import { PurOrdApprovalReqListService } from '../service/purOrdApprovalReqList.service';
import { jwtConstants } from 'src/config/security.config';
import * as jwt from 'jsonwebtoken';
import { Request } from 'express';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';

@Controller()
export class PurOrdApprovalReqListController {
  constructor(
    private readonly purOrdApprovalReqListService: PurOrdApprovalReqListService,
  ) {}

  @MessagePattern('sord-approval-req-list-sheet-query')
    async SPUORDApprovalReqListQueryWEB(
        @Payload() data: { result: any[], authorization: string }
    ): Promise<SimpleQueryResult> {
        const { result, authorization } = data;
        if (!authorization) {
            throw new UnauthorizedException('You do not have permission to access this API.');
        }
        const token = authorization.split(' ')[1];
        if (!token) {
             throw new RpcException({
                statusCode: 401,
                message: 'Invalid or expired token.',
            });
        }
        try {
            const decodedToken = jwt.verify(token, jwtConstants.secret) as { UserId: any, EmpSeq: any, UserSeq: any, CompanySeq: any };

            return this.purOrdApprovalReqListService.SPUORDApprovalReqListQueryWEB(result, decodedToken.CompanySeq, decodedToken.UserSeq, 1129);
        } catch (error) {
             throw new RpcException({
                statusCode: 401,
                message: 'Invalid or expired token.',
            });
        }

    }

    @MessagePattern('sord-approval-req-list-confirm')
    async SCOMConfirmWEB(
        @Payload() data: { result: any[], authorization: string }
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
            const decodedToken = jwt.verify(token, jwtConstants.secret) as { UserId: any, EmpSeq: any, UserSeq: any, CompanySeq: any };

            return this.purOrdApprovalReqListService.SCOMConfirmWEB(result, decodedToken.CompanySeq, decodedToken.UserSeq, '');
        } catch (error) {
             throw new RpcException({
                statusCode: 401,
                message: 'Invalid or expired token.',
            });
        }

    }

    @MessagePattern('sord-approval-req-list-stop')
    async SApprovalReqStopWEB(
        @Payload() data: { result: any[], authorization: string }
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
            const decodedToken = jwt.verify(token, jwtConstants.secret) as { UserId: any, EmpSeq: any, UserSeq: any, CompanySeq: any };

            return this.purOrdApprovalReqListService.SApprovalReqStopWEB(result, decodedToken.CompanySeq, decodedToken.UserSeq, '');
        } catch (error) {
             throw new RpcException({
                statusCode: 401,
                message: 'Invalid or expired token.',
            });
        }

    }

}
