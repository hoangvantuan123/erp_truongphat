import {
  Controller,
  Post,
  Body,
  Req,
  Res,
  HttpStatus,
  HttpException,
  Inject,
  Get,
  Delete,
  UnauthorizedException,
  Query,
} from '@nestjs/common';
import { timeout } from 'rxjs/operators';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { Request, Response } from 'express';
import { firstValueFrom } from 'rxjs';
@Controller('v1/mssql/purchase')
export class PurOrdPOController {
  constructor(
    @Inject('PURCHASE_SERVICE') private readonly purchaseService: ClientProxy,
  ) {}
  private getAuthorization(req: Request) {
    const authorization = req.headers.authorization;
    if (!authorization) {
      return {
        success: false,
        message: 'Authorization header is missing',
        error: 'Unauthorized',
      };
    }

    return authorization;
  }

  private async sendRequest(pattern: string, payload: any) {
    const requestTimeout = parseInt(process.env.REQUEST_TIMEOUT || '360000');
    const controller = new AbortController();
    const timeoutHandler = setTimeout(() => controller.abort(), requestTimeout);

    try {
      const result = await firstValueFrom(
        this.purchaseService
          .send(pattern, payload)
          .pipe(timeout(requestTimeout)),
      );

      clearTimeout(timeoutHandler);
      return result;
    } catch (error) {
      clearTimeout(timeoutHandler);

      if (error.name === 'AbortError' || error.message.includes('Timeout')) {
        return {
          success: false,
          message: 'Request timeout. Service might be busy or unavailable.',
          error: 'Timeout',
        };
      }

      if (error instanceof RpcException) {
        return {
          success: false,
          message: 'Service error occurred.',
          error: error.message,
        };
      }

      return {
        success: false,
        message: 'Internal communication error.',
        error: error.message || 'Unknown error',
      };
    }
  }

  @Post('sord-po-master-query')
  async SPUORDApprovalReqMasterQueryWEB(
    @Body('result') result: any[],
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const authorization = this.getAuthorization(req);
    const resu = await this.sendRequest('sord-po-master-query', {
      result,
      authorization,
    });
    return res.status(HttpStatus.OK).json(resu);
  }

  @Post('sord-po-sheet-query')
  async SPUORDApprovalReqSheetQueryWEB(
    @Body('result') result: any[],
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const authorization = this.getAuthorization(req);
    const resu = await this.sendRequest('sord-po-sheet-query', {
      result,
      authorization,
    });
    return res.status(HttpStatus.OK).json(resu);
  }

  @Post('sord-po-master-link-query')
  async SPUORDPOMasterLinkQueryWEB(
    @Body('result') result: any[],
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const authorization = this.getAuthorization(req);
    const resu = await this.sendRequest('sord-po-master-link-query', {
      result,
      authorization,
    });
    return res.status(HttpStatus.OK).json(resu);
  }

  @Post('sord-po-sheet-link-query')
  async SPUORDPOSheetLinkQueryWEB(
    @Body('result') result: any[],
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const authorization = this.getAuthorization(req);
    const resu = await this.sendRequest('sord-po-sheet-link-query', {
      result,
      authorization,
    });
    return res.status(HttpStatus.OK).json(resu);
  }

  @Post('sord-po-aud')
  async SOrdApprovalReqSave(
    @Body('dataMaster') dataMaster: any[],
    @Body('dataSheetAUD') dataSheetAUD: any[],
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const authorization = this.getAuthorization(req);
    const resu = await this.sendRequest('sord-po-aud', {
      dataMaster,
      dataSheetAUD,
      authorization,
    });
    return res.status(HttpStatus.OK).json(resu);
  }

  @Post('sord-po-master-delete')
  async SOrdApprovalReqDelete(
    @Body('dataMaster') dataMaster: any[],
    @Body('dataSheetAUD') dataSheetAUD: any[],
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const authorization = this.getAuthorization(req);
    const resu = await this.sendRequest('sord-po-master-delete', {
      dataMaster,
      dataSheetAUD,
      authorization,
    });
    return res.status(HttpStatus.OK).json(resu);
  }

  @Post('sord-po-sheet-delete')
  async SOrdApprovalReqSheetDelete(
    @Body('dataMaster') dataMaster: any[],
    @Body('dataSheetAUD') dataSheetAUD: any[],
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const authorization = this.getAuthorization(req);
    const resu = await this.sendRequest('sord-po-sheet-delete', {
      dataMaster,
      dataSheetAUD,
      authorization,
    });
    return res.status(HttpStatus.OK).json(resu);
  }
}
