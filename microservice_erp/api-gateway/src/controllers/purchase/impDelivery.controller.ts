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
export class ImpDeliveryController {
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

  @Post('simp-req-delivery-master-query')
  async SSLImpPermitMasterQueryWEB(
    @Body('result') result: number,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const authorization = this.getAuthorization(req);
    const resu = await this.sendRequest('simp-req-delivery-master-query', {
      result,
      authorization,
    });
    return res.status(HttpStatus.OK).json(resu);
  }
  @Post('simp-req-delivery-sheet-query')
  async SSLImpPermitSheetQueryWEB(
    @Body('result') result: number,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const authorization = this.getAuthorization(req);
    const resu = await this.sendRequest('simp-req-delivery-sheet-query', {
      result,
      authorization,
    });
    return res.status(HttpStatus.OK).json(resu);
  }
  @Post('simp-delivery-master-query')
  async SSLImpDelvMasterQueryWEB(
    @Body('result') result: number,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const authorization = this.getAuthorization(req);
    const resu = await this.sendRequest('simp-delivery-master-query', {
      result,
      authorization,
    });
    return res.status(HttpStatus.OK).json(resu);
  }
  @Post('simp-delivery-link-sheet-query')
  async SSLImpDelvSheetQueryWEB(
    @Body('result') result: number,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const authorization = this.getAuthorization(req);
    const resu = await this.sendRequest('simp-delivery-link-sheet-query', {
      result,
      authorization,
    });
    return res.status(HttpStatus.OK).json(resu);
  }
  @Post('simp-delivery-qr-check')
  async SImpDeliveryQRCheckWEB(
    @Body('result') result: any[],
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const authorization = this.getAuthorization(req);
    const resu = await this.sendRequest('simp-delivery-qr-check', {
      result,
      authorization,
    });
    return res.status(HttpStatus.OK).json(resu);
  }

  @Post('simp-delivery-aud')
  async SImpDeliverySave(
    @Body('dataMaster') dataMaster: any[],
    @Body('dataSheetAUD') dataSheetAUD: any[],
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const authorization = this.getAuthorization(req);
    const resu = await this.sendRequest('simp-delivery-aud', {
      dataMaster,
      dataSheetAUD,
      authorization,
    });
    return res.status(HttpStatus.OK).json(resu);
  }

  @Post('simp-delivery-sheet-delete')
  async SImpDeliverySheetDelete(
    @Body('dataMaster') dataMaster: any[],
    @Body('dataSheetAUD') dataSheetAUD: any[],
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const authorization = this.getAuthorization(req);
    const resu = await this.sendRequest('simp-delivery-sheet-delete', {
      dataMaster,
      dataSheetAUD,
      authorization,
    });
    return res.status(HttpStatus.OK).json(resu);
  }
  @Post('simp-delivery-master-delete')
  async SImpDeliveryMasterDelete(
    @Body('dataMaster') dataMaster: any[],
    @Body('dataSheetAUD') dataSheetAUD: any[],
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const authorization = this.getAuthorization(req);
    const resu = await this.sendRequest('simp-delivery-master-delete', {
      dataMaster,
      dataSheetAUD,
      authorization,
    });
    return res.status(HttpStatus.OK).json(resu);
  }
}
