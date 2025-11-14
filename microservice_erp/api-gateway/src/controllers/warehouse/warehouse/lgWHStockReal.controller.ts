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
export class LGWHStockRealController {
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

  @Post('slg-wh-stock-real-open-list')
  async SLGWHStockRealOpenListQueryWEB(
    @Body('result') result: any[],
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const authorization = this.getAuthorization(req);
    const resu = await this.sendRequest('slg-wh-stock-real-open-list', {
      result,
      authorization,
    });
    return res.status(HttpStatus.OK).json(resu);
  }
  @Post('slg-wh-stock-real-open-result-list')
  async SLGWHStockRealOpenResultListQueryWEB(
    @Body('result') result: any[],
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const authorization = this.getAuthorization(req);
    const resu = await this.sendRequest('slg-wh-stock-real-open-result-list', {
      result,
      authorization,
    });
    return res.status(HttpStatus.OK).json(resu);
  }
  @Post('slg-stock-real-open-master-query')
  async SLGWHStockRealOpenQueryWEB(
    @Body('result') result: number,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const authorization = this.getAuthorization(req);
    const resu = await this.sendRequest('slg-stock-real-open-master-query', {
      result,
      authorization,
    });
    return res.status(HttpStatus.OK).json(resu);
  }
  @Post('slg-stock-real-open-sheet-query')
  async SLGWHStockRealOpenItemQueryWEB(
    @Body('result') result: number,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const authorization = this.getAuthorization(req);
    const resu = await this.sendRequest('slg-stock-real-open-sheet-query', {
      result,
      authorization,
    });
    return res.status(HttpStatus.OK).json(resu);
  }
  @Post('slg-stock-real-open-sheet-item-query')
  async SLGWHStockRealOpenItem2QueryWEB(
    @Body('result') result: number,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const authorization = this.getAuthorization(req);
    const resu = await this.sendRequest(
      'slg-stock-real-open-sheet-item-query',
      { result, authorization },
    );
    return res.status(HttpStatus.OK).json(resu);
  }
  @Post('slg-wh-stock-real-aud')
  async SLGWHStockRealOpenSave(
    @Body('dataMaster') dataMaster: any[],
    @Body('dataSheetAUD') dataSheetAUD: any[],
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const authorization = this.getAuthorization(req);
    const resu = await this.sendRequest('slg-wh-stock-real-aud', {
      dataMaster,
      dataSheetAUD,
      authorization,
    });
    return res.status(HttpStatus.OK).json(resu);
  }
  @Post('slg-wh-stock-real-open-delete')
  async SLGWHStockRealOpenDelete(
    @Body('result') result: any[],
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const authorization = this.getAuthorization(req);
    const resu = await this.sendRequest('slg-wh-stock-real-open-delete', {
      result,
      authorization,
    });
    return res.status(HttpStatus.OK).json(resu);
  }
  @Post('slg-stock-real-open-qr-check')
  async SStockRealQRCheckWEB(
    @Body('result') result: any[],
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const authorization = this.getAuthorization(req);
    const resu = await this.sendRequest('slg-stock-real-open-qr-check', {
      result,
      authorization,
    });
    return res.status(HttpStatus.OK).json(resu);
  }
  @Post('slg-inventory-stock-real-open')
  async SLGGetWHStockQueryWEB(
    @Body('result') result: any[],
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const authorization = this.getAuthorization(req);
    const resu = await this.sendRequest('slg-inventory-stock-real-open', {
      result,
      authorization,
    });
    return res.status(HttpStatus.OK).json(resu);
  }
  @Post('slg-stock-real-open-result-aud')
  async SLGWHStockRealOpenResultSave(
    @Body('dataMaster') dataMaster: any[],
    @Body('gridData') gridData: any[],
    @Body('dataSheetAUD') dataSheetAUD: any[],
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const authorization = this.getAuthorization(req);
    const resu = await this.sendRequest('slg-stock-real-open-result-aud', {
      dataMaster,
      gridData,
      dataSheetAUD,
      authorization,
    });
    return res.status(HttpStatus.OK).json(resu);
  }
  @Post('slg-stock-real-open-sheet-delete')
  async SLGWHStockRealRegDelete(
    @Body('dataMaster') dataMaster: any[],
    @Body('dataSheetAUD') dataSheetAUD: any[],
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const authorization = this.getAuthorization(req);
    const resu = await this.sendRequest('slg-stock-real-open-sheet-delete', {
      dataMaster,
      dataSheetAUD,
      authorization,
    });
    return res.status(HttpStatus.OK).json(resu);
  }
  @Post('slg-stock-real-open-master-delete')
  async SLGWHStockRealRegMasterDelete(
    @Body('dataMaster') dataMaster: any[],
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const authorization = this.getAuthorization(req);
    const resu = await this.sendRequest('slg-stock-real-open-master-delete', {
      dataMaster,
      authorization,
    });
    return res.status(HttpStatus.OK).json(resu);
  }
}
