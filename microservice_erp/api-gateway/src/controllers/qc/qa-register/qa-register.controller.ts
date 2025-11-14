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
@Controller('v7/qa-register/')
export class QaRegisterController {
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

  @Post('search-qa-item-type')
  async searchQaItem(
    @Body('result') result: any[],
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const authorization = this.getAuthorization(req);
    const resu = await this.sendRequest('search-qa-item-type', { result, authorization });
    return res.status(HttpStatus.OK).json(resu);
  }

  @Post('create-qa-item-type')
  async createQAItemType(
    @Body('result') result: any[],
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const authorization = this.getAuthorization(req);
    const resu = await this.sendRequest('create-qa-item-type', { result, authorization });
    return res.status(HttpStatus.OK).json(resu);
  }

  @Post('get-item-qa')
  async getItemQa(
    @Body('result') result: any[],
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const authorization = this.getAuthorization(req);
    const resu = await this.sendRequest('get-item-qa', { result, authorization });
    return res.status(HttpStatus.OK).json(resu);
  }

  @Post('get-qa-item-qc')
  async getQaItemQc(
    @Body('result') result: any[],
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const authorization = this.getAuthorization(req);
    const resu = await this.sendRequest('get-qa-item-qc', { result, authorization });
    return res.status(HttpStatus.OK).json(resu);
  }

  @Post('get-qa-item-qc-title')
  async getQaItemQcTitle(
    @Body('result') result: any[],
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const authorization = this.getAuthorization(req);
    const resu = await this.sendRequest('get-qa-item-qc-title', { result, authorization });
    return res.status(HttpStatus.OK).json(resu);
  }

  @Post('save-qa-item-qc')
  async saveQaItemQc(
    @Body('result') result: any[],
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const authorization = this.getAuthorization(req);
    const resu = await this.sendRequest('save-qa-item-qc', { result, authorization });
    return res.status(HttpStatus.OK).json(resu);
  }

  @Post('save-qa-item-qc-title')
  async saveQaItemQcTitle(
    @Body('result') result: any[],
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const authorization = this.getAuthorization(req);
    const resu = await this.sendRequest('save-qa-item-qc-title', { result, authorization });
    return res.status(HttpStatus.OK).json(resu);
  }

  @Post('delete-qa-item-qc')
  async deleteQaItemQc(
    @Body('result') result: any[],
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const authorization = this.getAuthorization(req);
    const resu = await this.sendRequest('delete-qa-item-qc', { result, authorization });
    return res.status(HttpStatus.OK).json(resu);
  }

}
