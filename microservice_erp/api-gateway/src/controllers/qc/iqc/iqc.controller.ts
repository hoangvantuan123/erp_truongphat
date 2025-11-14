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
@Controller('v7/iqc/')
export class IqcController {
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

  @Post('search-iqc-by')
  async searchBy(
    @Body('result') result: any[],
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const authorization = this.getAuthorization(req);
    const resu = await this.sendRequest('search-iqc-by', { result, authorization });
    return res.status(HttpStatus.OK).json(resu);
  }

  @Post('get-iqc-by-id')
  async getById(
    @Body('result') result: any[],
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const authorization = this.getAuthorization(req);
    const resu = await this.sendRequest('get-iqc-by-id', {
      result,
      authorization,
    });
    return res.status(HttpStatus.OK).json(resu);
  }

  @Post('created-iqc-by')
  async createdBy(
    @Body('result') result: any[],
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const authorization = this.getAuthorization(req);
    const resu = await this.sendRequest('created-iqc-by', {
      result,
      authorization,
    });
    return res.status(HttpStatus.OK).json(resu);
  }

  // @Post('created-list-iqc-by')
  // async createdListBy(
  //   @Body('result') result: any[],
  //   @Req() req: Request,
  //   @Res() res: Response,
  // ) {
  //   const authorization = this.getAuthorization(req);
  //   const resu = await this.sendRequest('created-list-iqc-by', {
  //     result,
  //     authorization,
  //   });
  //   return res.status(HttpStatus.OK).json(resu);
  // }

  @Post('get-qc-list-item')
  async getQcItemList(
    @Body('result') result: any[],
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const authorization = this.getAuthorization(req);
    const resu = await this.sendRequest('get-qc-list-item', {
      result,
      authorization,
    });
    return res.status(HttpStatus.OK).json(resu);
  }

  @Get('get-qc-report-result')
  async getQcReportResult(
    @Query('QCSeq') QCSeq: number,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const authorization = this.getAuthorization(req);
    const resu = await this.sendRequest('get-qc-report-result', {
      QCSeq,
      authorization,
    });
    return res.status(HttpStatus.OK).json(resu);
  }

  @Get('get-file-iqc')
  async getQcFiles(
    @Query('FileSeq') FileSeq: number,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const authorization = this.getAuthorization(req);
    const resu = await this.sendRequest('get-file-iqc', {
      FileSeq,
      authorization,
    });
    return res.status(HttpStatus.OK).json(resu);
  }

  @Post('iqc-test-report-sample')
  async QcTestReportSampleReq(
    @Body('result') result: any [],
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const authorization = this.getAuthorization(req);
    const resu = await this.sendRequest('iqc-test-report-sample', {
      result,
      authorization,
    });
    return res.status(HttpStatus.OK).json(resu);
  }

  @Post('iqc-test-report-item')
  async QcTestReportItemSave(
    @Body('result') result: any [],
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const authorization = this.getAuthorization(req);
    const resu = await this.sendRequest('iqc-test-report-item', {
      result,
      authorization,
    });
    return res.status(HttpStatus.OK).json(resu);
  }

  @Post('iqc-save-file')
  async QcTestFileSave(
    @Body('result') result: any [],
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const authorization = this.getAuthorization(req);
    const resu = await this.sendRequest('iqc-save-file', {
      result,
      authorization,
    });
    return res.status(HttpStatus.OK).json(resu);
  }

  @Post('list-qc-test-report')
  async GetListQcTestReportBatch(
    @Body('result') result: any [],
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const authorization = this.getAuthorization(req);
    const resu = await this.sendRequest('list-qc-test-report', {
      result,
      authorization,
    });
    return res.status(HttpStatus.OK).json(resu);
  }

  @Post('created-iqc-list-by')
  async CreateIqcListBy(
    @Body('result') result: any [],
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const authorization = this.getAuthorization(req);
    const resu = await this.sendRequest('created-iqc-list-by', {
      result,
      authorization,
    });
    return res.status(HttpStatus.OK).json(resu);
  }

  @Post('search-iqc-check_status')
  async SearchIqcCheckStatus(
    @Body('result') result: any [],
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const authorization = this.getAuthorization(req);
    const resu = await this.sendRequest('search-iqc-check_status', {
      result,
      authorization,
    });
    return res.status(HttpStatus.OK).json(resu);
  }

  @Post('delete-iqc-by')
  async DeleteIqcImport(
    @Body('result') result: any [],
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const authorization = this.getAuthorization(req);
    const resu = await this.sendRequest('delete-iqc-by', {
      result,
      authorization,
    });
    return res.status(HttpStatus.OK).json(resu);
  }
}
