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
@Controller('v1/mssql/warehouse-list')
export class WarehouseController {
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

        try {
            const result = await firstValueFrom(
                this.warehouseService.send(pattern, payload).pipe(
                    timeout(requestTimeout)
                )
            );
            return result;
        } catch (error) {
            if (error.message === 'Timeout') {
                return {
                    success: false,
                    message: 'Request timeout. Service might be busy or unavailable.',
                    error: error.message
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

    @Post('sda-wh-main-query')
    async SDAWHMainQueryWEB(
        @Body('result') result: any[],
        @Req() req: Request,
        @Res() res: Response,
    ) {
        console.log('SDAWHMainQueryWEB', result)
        const authorization = this.getAuthorization(req);
        const resu = await this.sendRequest('sda-wh-main-query', { result, authorization });
        return res.status(HttpStatus.OK).json(resu);
    }

    @Post('sda-wh-sub-auto-create')
    async SDAWHSubAutoCreate(
        @Body('result') result: any[],
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const authorization = this.getAuthorization(req);
        const resu = await this.sendRequest('sda-wh-sub-auto-create', { result, authorization });
        return res.status(HttpStatus.OK).json(resu);
    }
    @Post('sda-wh-auto-delete')
    async SDAWHAutoCheckDelete(
        @Body('result') result: any[],
        @Req() req: Request,
        @Res() res: Response,
    ) {
        console.log('SDAWHAutoCheckDelete', result)
        const authorization = this.getAuthorization(req);
        const resu = await this.sendRequest('sda-wh-auto-delete', { result, authorization });
        return res.status(HttpStatus.OK).json(resu);
    }
    @Post('sda-wh-auto-update')
    async SDAWHAutoCheckUpdate(
        @Body('result') result: any[],
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const authorization = this.getAuthorization(req);
        const resu = await this.sendRequest('sda-wh-auto-update', { result, authorization });
        return res.status(HttpStatus.OK).json(resu);
    }



}