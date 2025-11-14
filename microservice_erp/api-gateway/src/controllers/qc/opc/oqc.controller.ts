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
@Controller('v7/oqc/')
export class OqcController {
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

  @Post('search-oqc-req-by')
  async searchOqcReqBy(
    @Body('result') result: any[],
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const authorization = this.getAuthorization(req);
    const resu = await this.sendRequest('search-oqc-req-by', { result, authorization });
    return res.status(HttpStatus.OK).json(resu);
  }

  @Post('get-oqc-seq')
  async GetOQCSeq(
    @Body('result') result: any[],
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const authorization = this.getAuthorization(req);
    const resu = await this.sendRequest('get-oqc-seq', { result, authorization });
    return res.status(HttpStatus.OK).json(resu);
  }

  @Post('create-oqc-by')
  async CreateOqcBy(
    @Body('result') result: any[],
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const authorization = this.getAuthorization(req);
    const resu = await this.sendRequest('create-oqc-by', { result, authorization });
    return res.status(HttpStatus.OK).json(resu);
  }
 
  @Post('delete-oqc-by')
  async DeleteOqcBy(
    @Body('result') result: any[],
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const authorization = this.getAuthorization(req);
    const resu = await this.sendRequest('delete-oqc-by', { result, authorization });
    return res.status(HttpStatus.OK).json(resu);
  }
  

  @Post('qc-test-report-batch-fin')
  async QcTestReportBatchFin(
    @Body('result') result: any[],
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const authorization = this.getAuthorization(req);
    const resu = await this.sendRequest('qc-test-report-batch-fin', { result, authorization });
    return res.status(HttpStatus.OK).json(resu);
  }

  @Post('oqc-test-report-batch-save')
  async QcTestReportBatchFinSave(
    @Body('result') result: any[],
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const authorization = this.getAuthorization(req);
    const resu = await this.sendRequest('oqc-test-report-batch-save', { result, authorization });
    return res.status(HttpStatus.OK).json(resu);
  }

  @Post('fin-result-list')
  async searchFinResultList(
    @Body('result') result: any[],
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const authorization = this.getAuthorization(req);
    const resu = await this.sendRequest('fin-result-list', { result, authorization });
    return res.status(HttpStatus.OK).json(resu);
  }

  @Post('qc-final-bad-qty-list')
  async searchQcFinalBadQtyResultList(
    @Body('result') result: any[],
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const authorization = this.getAuthorization(req);
    const resu = await this.sendRequest('qc-final-bad-qty-list', { result, authorization });
    return res.status(HttpStatus.OK).json(resu);
  }
}
