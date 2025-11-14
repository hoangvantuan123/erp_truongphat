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
@Controller('v1/mssql/stock-out')
export class StockOutController {
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


    @Post('sp-dmm-out-req-list')
    async processSPDMMOutReqListQueryWeb(
        @Body() body: any,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const authorization = this.getAuthorization(req);
        const result = await this.sendRequest('sp-dmm-out-req-list', { body, authorization });
        return res.status(HttpStatus.OK).json(result);
    }
    @Get('itm-spd-mm-out-req-item-list')
    async processITMSPDMMOutReqItemListWEB(
        @Query('outReqSeq') outReqSeq: string,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const authorization = this.getAuthorization(req);
        const result = await this.sendRequest('itm-spd-mm-out-req-item-list', { outReqSeq, authorization });
        return res.status(HttpStatus.OK).json(result);
    }
    @Post('smaterial-qr-check-stock-out-web')
    async processSMaterialQRStockOutCheckWEB(
        @Body() body: any,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const authorization = this.getAuthorization(req);
        const result = await this.sendRequest('smaterial-qr-check-stock-out-web', { body, authorization });
        return res.status(HttpStatus.OK).json(result);
    }
    @Post('check-all-procedures-stock-out-fifo')
    async checkAllProceduresStockIn(
        @Body() body: any,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const authorization = this.getAuthorization(req);
        const result = await this.sendRequest('check-all-procedures-stock-out-fifo', { body, authorization });
        return res.status(HttpStatus.OK).json(result);
    }
    @Delete('items-tfifo-list-temp')
    async deleteItems(
        @Body() data: { items: { ItemSeq: string; ItemLotNo: string }[] }
    ) {
        return await this.sendRequest('items-tfifo-list-temp', { data });
    }
}