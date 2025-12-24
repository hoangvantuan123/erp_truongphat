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
@Controller('v1/mssql/warehouse')
export class EtcInReqController {
  constructor(
    @Inject('WAREHOUSE_SERVICE') private readonly warehouseService: ClientProxy,
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
        this.warehouseService
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

  @Post('slg-in-out-req-list')
  async SLGInOutReqListQueryWEB(
    @Body('result') result: any[],
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const authorization = this.getAuthorization(req);
    const resu = await this.sendRequest('slg-in-out-req-list', {
      result,
      authorization,
    });
    return res.status(HttpStatus.OK).json(resu);
  }
  @Post('slg-in-out-req-item-list')
  async SLGInOutReqItemListQueryWEB(
    @Body('result') result: any[],
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const authorization = this.getAuthorization(req);
    const resu = await this.sendRequest('slg-in-out-req-item-list', {
      result,
      authorization,
    });
    return res.status(HttpStatus.OK).json(resu);
  }
  @Post('slg-in-out-req-sheet-query')
  async SLGInOutReqItemQueryWEB(
    @Body('result') result: any[],
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const authorization = this.getAuthorization(req);
    const resu = await this.sendRequest('slg-in-out-req-sheet-query', {
      result,
      authorization,
    });
    return res.status(HttpStatus.OK).json(resu);
  }
  @Post('slg-in-out-req-master-query')
  async SLGInOutReqQueryWEB(
    @Body('result') result: any[],
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const authorization = this.getAuthorization(req);
    const resu = await this.sendRequest('slg-in-out-req-master-query', {
      result,
      authorization,
    });
    return res.status(HttpStatus.OK).json(resu);
  }
  @Post('slg-in-out-item-list')
  async SLGInOutItemListQueryWEB(
    @Body('result') result: any[],
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const authorization = this.getAuthorization(req);
    const resu = await this.sendRequest('slg-in-out-item-list', {
      result,
      authorization,
    });
    return res.status(HttpStatus.OK).json(resu);
  }
  @Post('slg-in-out-req-list-confirm')
  async SCOMConfirmWEB(
    @Body('result') result: any[],
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const authorization = this.getAuthorization(req);
    const resu = await this.sendRequest('slg-in-out-req-list-confirm', {
      result,
      authorization,
    });
    return res.status(HttpStatus.OK).json(resu);
  }

  @Post('slg-in-out-req-list-stop')
  async SLGInOutReqStopSaveWEB(
    @Body('result') result: any[],
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const authorization = this.getAuthorization(req);
    const resu = await this.sendRequest('slg-in-out-req-list-stop', {
      result,
      authorization,
    });
    return res.status(HttpStatus.OK).json(resu);
  }
  @Post('slg-in-out-req-aud')
  async SLGInOutReqSave(
    @Body('dataMaster') dataMaster: any[],
    @Body('dataSheetAUD') dataSheetAUD: any[],
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const authorization = this.getAuthorization(req);
    const resu = await this.sendRequest('slg-in-out-req-aud', {
      dataMaster,
      dataSheetAUD,
      authorization,
    });
    return res.status(HttpStatus.OK).json(resu);
  }
  @Post('slg-in-out-req-master-delete')
  async SLGInOutReqDelete(
    @Body('result') result: any[],
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const authorization = this.getAuthorization(req);
    const resu = await this.sendRequest('slg-in-out-req-master-delete', {
      result,
      authorization,
    });
    return res.status(HttpStatus.OK).json(resu);
  }
  @Post('slg-in-out-req-sheet-delete')
  async SLGInOutReqSheetDelete(
    @Body('result') result: any[],
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const authorization = this.getAuthorization(req);
    const resu = await this.sendRequest('slg-in-out-req-sheet-delete', {
      result,
      authorization,
    });
    return res.status(HttpStatus.OK).json(resu);
  }
  //Begin TuanNN
  @Post('slg-in-out-tp-sheet-query')
  async SLGInOutTPItemQueryWEB(
    @Body('result') result: any[],
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const authorization = this.getAuthorization(req);
    const resu = await this.sendRequest('slg-in-out-tp-sheet-query', {
      result,
      authorization,
    });
    return res.status(HttpStatus.OK).json(resu);
  }
  @Post('slg-in-out-tp-master-query')
  async SLGInOutTPQueryWEB(
    @Body('result') result: any[],
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const authorization = this.getAuthorization(req);
    const resu = await this.sendRequest('slg-in-out-tp-master-query', {
      result,
      authorization,
    });
    return res.status(HttpStatus.OK).json(resu);
  }
  @Post('slg-in-out-tp-aud')
  async SLGInOutTPSave(
    @Body('dataMaster') dataMaster: any[],
    @Body('dataSheetAUD') dataSheetAUD: any[],
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const authorization = this.getAuthorization(req);
    const resu = await this.sendRequest('slg-in-out-tp-aud', {
      dataMaster,
      dataSheetAUD,
      authorization,
    });
    return res.status(HttpStatus.OK).json(resu);
  }
  @Post('slg-in-out-tp-sheet-delete')
  async SLGInOutTPSheetDelete(
    @Body('dataMaster') dataMaster: any[],
    @Body('dataSheetAUD') dataSheetAUD: any[],
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const authorization = this.getAuthorization(req);
    const resu = await this.sendRequest('slg-in-out-tp-sheet-delete', {
      dataMaster,
      dataSheetAUD,
      authorization,
    });
    return res.status(HttpStatus.OK).json(resu);
  }

  @Post('slg-in-out-tp-master-delete')
  async SLGInOutTPMasterDelete(
    @Body('dataMaster') dataMaster: any[],
    @Body('dataSheetAUD') dataSheetAUD: any[],
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const authorization = this.getAuthorization(req);
    const resu = await this.sendRequest('slg-in-out-tp-master-delete', {
      dataMaster,
      dataSheetAUD,
      authorization,
    });
    return res.status(HttpStatus.OK).json(resu);
  }
  //end TuanNN

  @Post('slg-in-out-req2-sheet-query')
  async SLGEtcInReqQuery2WEB(
    @Body('result') result: number,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const authorization = this.getAuthorization(req);
    const resu = await this.sendRequest('slg-in-out-req2-sheet-query', {
      result,
      authorization,
    });
    return res.status(HttpStatus.OK).json(resu);
  }
  @Post('slg-in-out-sheet-query')
  async SLGEtcInSheetQueryWEB(
    @Body('result') result: number,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const authorization = this.getAuthorization(req);
    const resu = await this.sendRequest('slg-in-out-sheet-query', {
      result,
      authorization,
    });
    return res.status(HttpStatus.OK).json(resu);
  }
  @Post('slg-in-out-qr-check')
  async SEtcInQRCheckWEB(
    @Body('result') result: any[],
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const authorization = this.getAuthorization(req);
    const resu = await this.sendRequest('slg-in-out-qr-check', {
      result,
      authorization,
    });
    return res.status(HttpStatus.OK).json(resu);
  }
  @Post('slg-in-out-aud')
  async SLGInOutSave(
    @Body('dataMaster') dataMaster: any[],
    @Body('dataSheetAUD') dataSheetAUD: any[],
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const authorization = this.getAuthorization(req);
    const resu = await this.sendRequest('slg-in-out-aud', {
      dataMaster,
      dataSheetAUD,
      authorization,
    });
    return res.status(HttpStatus.OK).json(resu);
  }
  @Post('slg-in-out-sheet-delete')
  async SLGInOutSheetDelete(
    @Body('dataMaster') dataMaster: any[],
    @Body('dataSheetAUD') dataSheetAUD: any[],
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const authorization = this.getAuthorization(req);
    const resu = await this.sendRequest('slg-in-out-sheet-delete', {
      dataMaster,
      dataSheetAUD,
      authorization,
    });
    return res.status(HttpStatus.OK).json(resu);
  }
  @Post('slg-in-out-master-delete')
  async SLGInOutMasterDelete(
    @Body('dataMaster') dataMaster: any[],
    @Body('dataSheetAUD') dataSheetAUD: any[],
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const authorization = this.getAuthorization(req);
    const resu = await this.sendRequest('slg-in-out-master-delete', {
      dataMaster,
      dataSheetAUD,
      authorization,
    });
    return res.status(HttpStatus.OK).json(resu);
  }
}
