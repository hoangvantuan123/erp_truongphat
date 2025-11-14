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
    Query
} from '@nestjs/common';
import { timeout } from 'rxjs/operators';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { Request, Response } from 'express';
import { firstValueFrom } from 'rxjs';
@Controller('v1/mssql/warehouse')
export class EtcOutReqController {
    constructor(
        @Inject('WAREHOUSE_SERVICE') private readonly warehouseService: ClientProxy,
    ) { }
    private getAuthorization(req: Request) {
        const authorization = req.headers.authorization;
        if (!authorization) {
            return {
                success: false,
                message: 'Authorization header is missing',
                error: 'Unauthorized'
            };
        }

        return authorization
    }


    private async sendRequest(pattern: string, payload: any) {
        const requestTimeout = parseInt(process.env.REQUEST_TIMEOUT || '360000');
        const controller = new AbortController();
        const timeoutHandler = setTimeout(() => controller.abort(), requestTimeout);

        try {
            const result = await firstValueFrom(
                this.warehouseService.send(pattern, payload).pipe(
                    timeout(requestTimeout)    
                )
            );

            clearTimeout(timeoutHandler); 
            return result;
        } catch (error) {
            clearTimeout(timeoutHandler);

            if (error.name === 'AbortError' || error.message.includes('Timeout')) {
                return {
                    success: false,
                    message: 'Request timeout. Service might be busy or unavailable.',
                    error: 'Timeout'
                };
            }

            if (error instanceof RpcException) {
                return {
                    success: false,
                    message: 'Service error occurred.',
                    error: error.message
                };
            }

            return {
                success: false,
                message: 'Internal communication error.',
                error: error.message || 'Unknown error'
            };
        }
    }

    @Post('slg-in-out-req-list-out')
    async SLGInOutReqListQueryWEB(
        @Body('result') result: any[],
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const authorization = this.getAuthorization(req);
        const resu = await this.sendRequest('slg-in-out-req-list-out', { result, authorization });
        return res.status(HttpStatus.OK).json(resu);
    }
    @Post('slg-in-out-req-item-list-out')
    async SLGInOutReqItemListQueryWEB(
        @Body('result') result: any[],
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const authorization = this.getAuthorization(req);
        const resu = await this.sendRequest('slg-in-out-req-item-list-out', { result, authorization });
        return res.status(HttpStatus.OK).json(resu);
    }
    @Post('slg-in-out-req-sheet-query-out')
    async SLGInOutReqItemQueryWEB(
        @Body('result') result: number,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const authorization = this.getAuthorization(req);
        const resu = await this.sendRequest('slg-in-out-req-sheet-query-out', { result, authorization });
        return res.status(HttpStatus.OK).json(resu);
    }
    @Post('slg-in-out-req-master-query-out')
    async SLGInOutReqQueryWEB(
        @Body('result') result: number,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const authorization = this.getAuthorization(req);
        const resu = await this.sendRequest('slg-in-out-req-master-query-out', { result, authorization });
        return res.status(HttpStatus.OK).json(resu);
    }
    @Post('slg-in-out-item-list-out')
    async SLGInOutItemListQueryWEB(
        @Body('result') result: any[],
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const authorization = this.getAuthorization(req);
        const resu = await this.sendRequest('slg-in-out-item-list-out', { result, authorization });
        return res.status(HttpStatus.OK).json(resu);
    }
    @Post('slg-in-out-req-list-confirm-out')
    async SCOMConfirmWEB(
        @Body('result') result: any[],
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const authorization = this.getAuthorization(req);
        const resu = await this.sendRequest('slg-in-out-req-list-confirm-out', { result, authorization });
        return res.status(HttpStatus.OK).json(resu);
    }
    @Post('slg-in-out-req-list-stop-out')
    async SLGInOutReqStopSaveWEB(
        @Body('result') result: any[],
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const authorization = this.getAuthorization(req);
        const resu = await this.sendRequest('slg-in-out-req-list-stop-out', { result, authorization });
        return res.status(HttpStatus.OK).json(resu);
    }
    @Post('slg-in-out-req-aud-out')
    async SLGInOutReqSave(
        @Body('dataMaster') dataMaster: any[],
        @Body('dataSheetAUD') dataSheetAUD: any[],
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const authorization = this.getAuthorization(req);
        const resu = await this.sendRequest('slg-in-out-req-aud-out', { dataMaster, dataSheetAUD, authorization });
        return res.status(HttpStatus.OK).json(resu);
    }
    @Post('slg-in-out-req-master-delete-out')
    async SLGInOutReqDelete(
        @Body('result') result: any[],
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const authorization = this.getAuthorization(req);
        const resu = await this.sendRequest('slg-in-out-req-master-delete-out', { result, authorization });
        return res.status(HttpStatus.OK).json(resu);
    }
    @Post('slg-in-out-req-sheet-delete-out')
    async SLGInOutReqSheetDelete(
        @Body('result') result: any[],
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const authorization = this.getAuthorization(req);
        const resu = await this.sendRequest('slg-in-out-req-sheet-delete-out', { result, authorization });
        return res.status(HttpStatus.OK).json(resu);
    }
    @Post('slg-in-out-req2-sheet-query-out')
    async SLGEtcInReqQuery2WEB(
        @Body('result') result: number,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const authorization = this.getAuthorization(req);
        const resu = await this.sendRequest('slg-in-out-req2-sheet-query-out', { result, authorization });
        return res.status(HttpStatus.OK).json(resu);
    }
    @Post('slg-in-out-sheet-query-out')
    async SLGEtcInSheetQueryWEB(
        @Body('result') result: number,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const authorization = this.getAuthorization(req);
        const resu = await this.sendRequest('slg-in-out-sheet-query-out', { result, authorization });
        return res.status(HttpStatus.OK).json(resu);
    }
    @Post('slg-in-out-qr-check-out')
    async SEtcOutQRCheckWEB(
        @Body('result') result: any[],
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const authorization = this.getAuthorization(req);
        const resu = await this.sendRequest('slg-in-out-qr-check-out', { result, authorization });
        return res.status(HttpStatus.OK).json(resu);
    }
    @Post('slg-in-out-inventory-check')
    async SLGInOutInventoryCheckWEB(
        @Body('result') result: any[],
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const authorization = this.getAuthorization(req);
        const resu = await this.sendRequest('slg-in-out-inventory-check', { result, authorization });
        return res.status(HttpStatus.OK).json(resu);
    }
    @Post('slg-in-out-aud-out')
    async SLGInOutSave(
        @Body('dataMaster') dataMaster: any[],
        @Body('dataSheetAUD') dataSheetAUD: any[],
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const authorization = this.getAuthorization(req);
        const resu = await this.sendRequest('slg-in-out-aud-out', { dataMaster, dataSheetAUD, authorization });
        return res.status(HttpStatus.OK).json(resu);
    }
    @Post('slg-in-out-sheet-delete-out')
    async SLGInOutSheetDelete(
        @Body('dataMaster') dataMaster: any[],
        @Body('dataSheetAUD') dataSheetAUD: any[],
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const authorization = this.getAuthorization(req);
        const resu = await this.sendRequest('slg-in-out-sheet-delete-out', { dataMaster, dataSheetAUD, authorization });
        return res.status(HttpStatus.OK).json(resu);
    }
    @Post('slg-in-out-master-delete-out')
    async SLGInOutMasterDelete(
        @Body('dataMaster') dataMaster: any[],
        @Body('dataSheetAUD') dataSheetAUD: any[],
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const authorization = this.getAuthorization(req);
        const resu = await this.sendRequest('slg-in-out-master-delete-out', { dataMaster, dataSheetAUD, authorization });
        return res.status(HttpStatus.OK).json(resu);
    }

}