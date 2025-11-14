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
export class ImpOrderController {
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

  @Post('simp-order-master-query')
  async SPUORDApprovalReqMasterQueryWEB(
    @Body('result') result: any[],
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const authorization = this.getAuthorization(req);
    const resu = await this.sendRequest('simp-order-master-query', {
      result,
      authorization,
    });
    return res.status(HttpStatus.OK).json(resu);
  }

  @Post('simp-order-sheet-query')
  async SPUORDApprovalReqSheetQueryWEB(
    @Body('result') result: any[],
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const authorization = this.getAuthorization(req);
    const resu = await this.sendRequest('simp-order-sheet-query', {
      result,
      authorization,
    });
    return res.status(HttpStatus.OK).json(resu);
  }

  @Post('simp-order-master-link-query')
  async SIMPORDERMasterLinkQueryWEB(
    @Body('result') result: any[],
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const authorization = this.getAuthorization(req);
    const resu = await this.sendRequest('simp-order-master-link-query', {
      result,
      authorization,
    });
    return res.status(HttpStatus.OK).json(resu);
  }

  @Post('simp-order-sheet-link-query')
  async SIMPORDERSheetLinkQueryWEB(
    @Body('result') result: any[],
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const authorization = this.getAuthorization(req);
    const resu = await this.sendRequest('simp-order-sheet-link-query', {
      result,
      authorization,
    });
    return res.status(HttpStatus.OK).json(resu);
  }

  @Post('simp-order-aud')
  async SImpOrderSave(
    @Body('dataMaster') dataMaster: any[],
    @Body('dataSheetAUD') dataSheetAUD: any[],
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const authorization = this.getAuthorization(req);
    const resu = await this.sendRequest('simp-order-aud', {
      dataMaster,
      dataSheetAUD,
      authorization,
    });
    return res.status(HttpStatus.OK).json(resu);
  }

  @Post('simp-order-master-delete')
  async SImpOrderDelete(
    @Body('dataMaster') dataMaster: any[],
    @Body('dataSheetAUD') dataSheetAUD: any[],
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const authorization = this.getAuthorization(req);
    const resu = await this.sendRequest('simp-order-master-delete', {
      dataMaster,
      dataSheetAUD,
      authorization,
    });
    return res.status(HttpStatus.OK).json(resu);
  }

  @Post('simp-order-sheet-delete')
  async SImpOrderSheetDelete(
    @Body('dataMaster') dataMaster: any[],
    @Body('dataSheetAUD') dataSheetAUD: any[],
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const authorization = this.getAuthorization(req);
    const resu = await this.sendRequest('simp-order-sheet-delete', {
      dataMaster,
      dataSheetAUD,
      authorization,
    });
    return res.status(HttpStatus.OK).json(resu);
  }
}
