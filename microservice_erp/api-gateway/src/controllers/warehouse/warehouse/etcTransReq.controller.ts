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
export class EtcTransReqController {
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


    @Post('slg-in-out-req-list-trans')
    async SLGInOutReqListQueryWEB(
        @Body('result') result: any[],
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const authorization = this.getAuthorization(req);
        const resu = await this.sendRequest('slg-in-out-req-list-trans', { result, authorization });
        return res.status(HttpStatus.OK).json(resu);
    }

    @Post('slg-in-out-req-item-list-trans')
    async SLGInOutReqItemListQueryWEB(
        @Body('result') result: any[],
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const authorization = this.getAuthorization(req);
        const resu = await this.sendRequest('slg-in-out-req-item-list-trans', { result, authorization });
        return res.status(HttpStatus.OK).json(resu);
    }
    @Post('slg-in-out-req-sheet-query-trans')
    async SLGInOutReqItemQueryWEB(
        @Body('result') result: number,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const authorization = this.getAuthorization(req);
        const resu = await this.sendRequest('slg-in-out-req-sheet-query-trans', { result, authorization });
        return res.status(HttpStatus.OK).json(resu);
    }
    @Post('slg-in-out-req-master-query-trans')
    async SLGInOutReqQueryWEB(
        @Body('result') result: number,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const authorization = this.getAuthorization(req);
        const resu = await this.sendRequest('slg-in-out-req-master-query-trans', { result, authorization });
        return res.status(HttpStatus.OK).json(resu);
    }
    @Post('slg-in-out-item-list-trans')
    async SLGInOutItemListQueryWEB(
        @Body('result') result: any[],
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const authorization = this.getAuthorization(req);
        const resu = await this.sendRequest('slg-in-out-item-list-trans', { result, authorization });
        return res.status(HttpStatus.OK).json(resu);
    }
    @Post('slg-in-out-req-list-confirm-trans')
    async SCOMConfirmWEB(
        @Body('result') result: any[],
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const authorization = this.getAuthorization(req);
        const resu = await this.sendRequest('slg-in-out-req-list-confirm-trans', { result, authorization });
        return res.status(HttpStatus.OK).json(resu);
    }
    @Post('slg-in-out-req-list-stop-trans')
    async SLGInOutReqStopSaveWEB(
        @Body('result') result: any[],
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const authorization = this.getAuthorization(req);
        const resu = await this.sendRequest('slg-in-out-req-list-stop-trans', { result, authorization });
        return res.status(HttpStatus.OK).json(resu);
    }
    @Post('slg-in-out-req-aud-trans')
    async SLGInOutReqSave(
        @Body('dataMaster') dataMaster: any[],
        @Body('dataSheetAUD') dataSheetAUD: any[],
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const authorization = this.getAuthorization(req);
        const resu = await this.sendRequest('slg-in-out-req-aud-trans', { dataMaster, dataSheetAUD, authorization });
        return res.status(HttpStatus.OK).json(resu);
    }
    @Post('slg-in-out-req-master-delete-trans')
    async SLGInOutReqDelete(
        @Body('result') result: any[],
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const authorization = this.getAuthorization(req);
        const resu = await this.sendRequest('slg-in-out-req-master-delete-trans', { result, authorization });
        return res.status(HttpStatus.OK).json(resu);
    }

    @Post('slg-in-out-req-sheet-delete-trans')
    async SLGInOutReqSheetDelete(
        @Body('result') result: any[],
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const authorization = this.getAuthorization(req);
        const resu = await this.sendRequest('slg-in-out-req-sheet-delete-trans', { result, authorization });
        return res.status(HttpStatus.OK).json(resu);
    }
    @Post('slg-in-out-req2-sheet-query-trans')
    async SLGEtcInReqQuery2WEB(
        @Body('result') result: number,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const authorization = this.getAuthorization(req);
        const resu = await this.sendRequest('slg-in-out-req2-sheet-query-trans', { result, authorization });
        return res.status(HttpStatus.OK).json(resu);
    }
    @Post('slg-in-out-sheet-query-trans')
    async SLGEtcInSheetQueryWEB(
        @Body('result') result: number,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const authorization = this.getAuthorization(req);
        const resu = await this.sendRequest('slg-in-out-sheet-query-trans', { result, authorization });
        return res.status(HttpStatus.OK).json(resu);
    }
    @Post('slg-in-out-qr-check-trans')
    async SEtcTransQRCheckWEB(
        @Body('result') result: any[],
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const authorization = this.getAuthorization(req);
        const resu = await this.sendRequest('slg-in-out-qr-check-trans', { result, authorization });
        return res.status(HttpStatus.OK).json(resu);
    }
    @Post('slg-in-out-inventory-trans')
    async SLGInOutInventoryCheckWEB(
        @Body('result') result: any[],
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const authorization = this.getAuthorization(req);
        const resu = await this.sendRequest('slg-in-out-inventory-trans', { result, authorization });
        return res.status(HttpStatus.OK).json(resu);
    }
    @Post('slg-in-out-aud-trans')
    async SLGInOutSave(
        @Body('dataMaster') dataMaster: any[],
        @Body('dataSheetAUD') dataSheetAUD: any[],
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const authorization = this.getAuthorization(req);
        const resu = await this.sendRequest('slg-in-out-aud-trans', { dataMaster, dataSheetAUD, authorization });
        return res.status(HttpStatus.OK).json(resu);
    }
    @Post('slg-in-out-sheet-delete-trans')
    async SLGInOutSheetDelete(
        @Body('dataMaster') dataMaster: any[],
        @Body('dataSheetAUD') dataSheetAUD: any[],
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const authorization = this.getAuthorization(req);
        const resu = await this.sendRequest('slg-in-out-sheet-delete-trans', { dataMaster, dataSheetAUD, authorization });
        return res.status(HttpStatus.OK).json(resu);
    }
    @Post('slg-in-out-master-delete-trans')
    async SLGInOutMasterDelete(
        @Body('dataMaster') dataMaster: any[],
        @Body('dataSheetAUD') dataSheetAUD: any[],
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const authorization = this.getAuthorization(req);
        const resu = await this.sendRequest('slg-in-out-master-delete-trans', { dataMaster, dataSheetAUD, authorization });
        return res.status(HttpStatus.OK).json(resu);
    }
}