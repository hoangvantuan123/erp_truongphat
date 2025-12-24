import { EtcInReqService } from './../service/etcInReq.service';
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
} from '@nestjs/common';
import { SimpleQueryResult } from 'src/common/interfaces/simple-query-result.interface';
import { Request } from 'express';
import { jwtConstants } from 'src/config/security.config';
import * as jwt from 'jsonwebtoken';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';

@Controller()
export class EtcInReqController {
  constructor(private readonly etcInReqService: EtcInReqService) {}

  @MessagePattern('slg-in-out-req-list')
  async SLGInOutReqListQueryWEB(
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

      return this.etcInReqService.SLGInOutReqListQueryWEB(
        result,
        decodedToken.CompanySeq,
        decodedToken.UserSeq,
        3329,
      );
    } catch (error) {
      throw new RpcException({
        statusCode: 401,
        message: 'Invalid or expired token.',
      });
    }
  }

  @MessagePattern('slg-in-out-req-item-list')
  async SLGInOutReqItemListQueryWEB(
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

      return this.etcInReqService.SLGInOutReqItemListQueryWEB(
        result,
        decodedToken.CompanySeq,
        decodedToken.UserSeq,
        3330,
      );
    } catch (error) {
      throw new RpcException({
        statusCode: 401,
        message: 'Invalid or expired token.',
      });
    }
  }

  @MessagePattern('slg-in-out-req-sheet-query')
  async SLGInOutReqItemQueryWEB(
    @Payload() data: { result: number; authorization: string },
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
      return this.etcInReqService.SLGInOutReqItemQueryWEB(
        result,
        decodedToken.CompanySeq,
        decodedToken.UserSeq,
        3317,
      );
    } catch (error) {
      throw new RpcException({
        statusCode: 401,
        message: 'Invalid or expired token.',
      });
    }
  }

  @MessagePattern('slg-in-out-req-master-query')
  async SLGInOutReqQueryWEB(
    @Payload() data: { result: number; authorization: string },
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
      return this.etcInReqService.SLGInOutReqQueryWEB(
        result,
        decodedToken.CompanySeq,
        decodedToken.UserSeq,
        3317,
      );
    } catch (error) {
      throw new RpcException({
        statusCode: 401,
        message: 'Invalid or expired token.',
      });
    }
  }

  //TP
  @MessagePattern('slg-in-out-tp-sheet-query')
  async SLGInOutTPItemQueryWEB(
    @Payload() data: { result: number; authorization: string },
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
      return this.etcInReqService.SLGInOutTPItemQueryWEB(
        result,
        decodedToken.CompanySeq,
        decodedToken.UserSeq,
        3317,
      );
    } catch (error) {
      throw new RpcException({
        statusCode: 401,
        message: 'Invalid or expired token.',
      });
    }
  }

  @MessagePattern('slg-in-out-tp-master-query')
  async SLGInOutTPQueryWEB(
    @Payload() data: { result: number; authorization: string },
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
      return this.etcInReqService.SLGInOutTPQueryWEB(
        result,
        decodedToken.CompanySeq,
        decodedToken.UserSeq,
        3317,
      );
    } catch (error) {
      throw new RpcException({
        statusCode: 401,
        message: 'Invalid or expired token.',
      });
    }
  }
  //end

  @MessagePattern('slg-in-out-item-list')
  async SLGInOutItemListQueryWEB(
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

      return this.etcInReqService.SLGInOutItemListQueryWEB(
        result,
        decodedToken.CompanySeq,
        decodedToken.UserSeq,
        5550,
      );
    } catch (error) {
      throw new RpcException({
        statusCode: 401,
        message: 'Invalid or expired token.',
      });
    }
  }

  @MessagePattern('slg-in-out-req-list-confirm')
  async SCOMConfirmWEB(
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

      return this.etcInReqService.SCOMConfirmWEB(
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

  @MessagePattern('slg-in-out-req-list-stop')
  async SLGInOutReqStopSaveWEB(
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

      return this.etcInReqService.SLGInOutReqStopSaveWEB(
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

  @MessagePattern('slg-in-out-req-aud')
  async SLGInOutReqSave(
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

      return this.etcInReqService.SLGInOutReqSave(
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

  @MessagePattern('slg-in-out-req-master-delete')
  async SLGInOutReqDelete(
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

      return this.etcInReqService.SLGInOutReqDelete(
        result,
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

  @MessagePattern('slg-in-out-req-sheet-delete')
  async SLGInOutReqSheetDelete(
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

      return this.etcInReqService.SLGInOutReqSheetDelete(
        result,
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

  @MessagePattern('slg-in-out-req2-sheet-query')
  async SLGEtcInReqQuery2WEB(
    @Payload() data: { result: number; authorization: string },
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
      return this.etcInReqService.SLGEtcInReqQuery2WEB(
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

  @MessagePattern('slg-in-out-sheet-query')
  async SLGEtcInSheetQueryWEB(
    @Payload() data: { result: number; authorization: string },
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
      return this.etcInReqService.SLGEtcInSheetQueryWEB(
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

  @MessagePattern('slg-in-out-qr-check')
  async SEtcInQRCheckWEB(
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

      return this.etcInReqService.SEtcInQRCheckWEB(
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

  @MessagePattern('slg-in-out-aud')
  async SLGInOutSave(
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

      return this.etcInReqService.SLGInOutSave(
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

  @MessagePattern('slg-in-out-sheet-delete')
  async SLGInOutSheetDelete(
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

      return this.etcInReqService.SLGInOutSheetDelete(
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

  @MessagePattern('slg-in-out-master-delete')
  async SLGInOutMasterDelete(
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

      return this.etcInReqService.SLGInOutMasterDelete(
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

  //TP
  @MessagePattern('slg-in-out-tp-aud')
  async SLGInOutTPSave(
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

      return this.etcInReqService.SLGInOutTPSave(
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

  @MessagePattern('slg-in-out-tp-sheet-delete')
  async SLGInOutTPSheetDelete(
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

      return this.etcInReqService.SLGInOutTPSheetDelete(
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

  @MessagePattern('slg-in-out-tp-master-delete')
  async SLGInOutTPMasterDelete(
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

      return this.etcInReqService.SLGInOutTPMasterDelete(
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
