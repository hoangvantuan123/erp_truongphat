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
@Controller('v1/mssql/stock-in')
export class EmployeeController {
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

    @Get('convert-dc')
    async convertDC(
        @Query('itemNo') itemNo: string,
        @Query('prodDate1') prodDate1: string,
        @Query('inDate1') inDate1: string,
    ) {
        return await this.sendRequest('convert-dc', { prodDate1, inDate1, itemNo });
    }
    @Get('itm-sug-get-active-delivery-item')
    async processITMSUGGetActiveDeliveryItem(
        @Query('deliverySeq') deliverySeq: number,
        @Query('purchaseType') purchaseType: string,
    ) {
        return await this.sendRequest('itm-sug-get-active-delivery-item', { deliverySeq, purchaseType });
    }

    @Post('smaterial-qr-check-web')
    async processSMaterialQRCheckWeb(
        @Body() body: any,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const authorization = this.getAuthorization(req);
        const result = await this.sendRequest('smaterial-qr-check-web', { body, authorization });
        return res.status(HttpStatus.OK).json(result);
    }
    @Post('scom-close-check-web')
    async processSCOMCloseCheckWEB(
        @Body() body: any,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const authorization = this.getAuthorization(req);
        const result = await this.sendRequest('scom-close-check-web', { body, authorization });
        return res.status(HttpStatus.OK).json(result);
    }
    @Post('scom-close-item-check-web')
    async processSCOMCloseItemCheckWEB(
        @Body() body: any,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const authorization = this.getAuthorization(req);
        const result = await this.sendRequest('scom-close-item-check-web', { body, authorization });
        return res.status(HttpStatus.OK).json(result);
    }
    @Post('ssl-imp-delv-master-check-web')
    async processSSLImpDelvMasterCheckWEB(
        @Body() body: any,
    ) {
        return await this.sendRequest('ssl-imp-delv-master-check-web', { body });
    }
    @Post('ssl-imp-delv-sheet-check-web')
    async processSSLImpDelvSheetCheckWEB(
        @Body() body: any,
    ) {
        return await this.sendRequest('ssl-imp-delv-sheet-check-web', { body });
    }
    @Post('check-all-procedures-stock-in')
    async checkAllProceduresStockIn(
        @Body() body: any,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const authorization = this.getAuthorization(req);
        const result = await this.sendRequest('check-all-procedures-stock-in', { body, authorization });
        return res.status(HttpStatus.OK).json(result);
    }
}