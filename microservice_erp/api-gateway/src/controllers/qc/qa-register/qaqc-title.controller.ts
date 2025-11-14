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
@Controller('v7/qaqc-title/')
export class QaQcTitleController {
  constructor(
    @Inject('IQC_SERVICE') private readonly iqcService: ClientProxy,
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
        this.iqcService.send(pattern, payload).pipe(timeout(requestTimeout)),
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

  @Post('search-qa-qc-title')
  async searchQaItem(
    @Body('result') result: any[],
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const authorization = this.getAuthorization(req);
    const resu = await this.sendRequest('search-qa-qc-title', { result, authorization });
    return res.status(HttpStatus.OK).json(resu);
  }

  @Post('get-qa-item-bad')
  async getItemQa(
    @Body('result') result: any[],
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const authorization = this.getAuthorization(req);
    const resu = await this.sendRequest('get-qa-item-bad', { result, authorization });
    return res.status(HttpStatus.OK).json(resu);
  }

  @Post('cud-qaqc-title')
  async createOrUpdateQaQcTitle(
    @Body('dataQaQcTitle') dataQaQcTitle: any[],
    @Body('dataQaItemBad') dataQaItemBad: any[],
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const authorization = this.getAuthorization(req);
    const resu = await this.sendRequest('cud-qaqc-title', { dataQaQcTitle, dataQaItemBad, authorization });
    return res.status(HttpStatus.OK).json(resu);
  }

  @Post('delete-qaqc-title')
  async deleteQaQcTitle(
    @Body('result') result: any[],
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const authorization = this.getAuthorization(req);
    const resu = await this.sendRequest('delete-qaqc-title', { result, authorization });
    return res.status(HttpStatus.OK).json(resu);
  }

  @Post('delete-qa-item-bad')
  async deleteQcItemBad(
    @Body('result') result: any[],
    @Body('UMQCTitleSeq') UMQCTitleSeq: any,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const authorization = this.getAuthorization(req);
    const resu = await this.sendRequest('delete-qa-item-bad', { result, UMQCTitleSeq, authorization });
    return res.status(HttpStatus.OK).json(resu);
  }

}
