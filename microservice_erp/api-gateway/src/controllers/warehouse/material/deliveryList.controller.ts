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
@Controller('v1/mssql/deliverry-list')
export class DeliveryListController {
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

    @Get('itm-sug-get-active-delivery-web')
    async convertDC(
        @Query('fromDate') fromDate: string,
        @Query('toDate') toDate: string,
        @Query('deliveryNo') deliveryNo: string,
        @Query('delivbizUniteryNo') bizUnit: number,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const authorization = this.getAuthorization(req);
        const result = await this.sendRequest('itm-sug-get-active-delivery-web', { fromDate, toDate, deliveryNo, bizUnit, authorization });
        return res.status(HttpStatus.OK).json(result);
    }

}