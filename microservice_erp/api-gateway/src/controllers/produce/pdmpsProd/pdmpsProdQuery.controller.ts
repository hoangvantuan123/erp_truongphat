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

@Controller('v5/PdmpsProd')
export class PdmpsProdQueryController {
    constructor(
        @Inject('PRODUCE_SERVICE') private readonly produceService: ClientProxy,
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
                this.produceService.send(pattern, payload).pipe(
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

    @Post('SPD-MPS-Prod-Req-List-Query')
    async SLGInOutReqPrintQuery(
        @Body('result') result: any,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const authorization = this.getAuthorization(req);
        const resu = await this.sendRequest('SPD-MPS-Prod-Req-List-Query', { result, authorization });
        return res.status(HttpStatus.OK).json(resu);
    }
    @Post('spd-prod-req-and-item-create')
    async SPDMPSProdReqAndItemSave(
        @Body('result') result: any,
        @Body('resultItem') resultItem: any,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const authorization = this.getAuthorization(req);
        const resu = await this.sendRequest('spd-prod-req-and-item-create', { result, resultItem, authorization });
        return res.status(HttpStatus.OK).json(resu);
    }
    @Post('spd-prod-req-and-item-update')
    async SPDMPSProdReqAndItemUpdate(
        @Body('result') result: any,
        @Body('resultItem') resultItem: any,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const authorization = this.getAuthorization(req);
        const resu = await this.sendRequest('spd-prod-req-and-item-update', { result, resultItem, authorization });
        return res.status(HttpStatus.OK).json(resu);
    }
    @Post('spd-prod-req-item-create')
    async SPDMPSProdReqItemCreate(
        @Body('result') result: any,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const authorization = this.getAuthorization(req);
        const resu = await this.sendRequest('spd-prod-req-item-create', { result, authorization });
        return res.status(HttpStatus.OK).json(resu);
    }

    @Post('spd-prod-req-item-delete')
    async SPDMPSProdReqItemDelete(
        @Body('result') result: any,
        @Body('resultItem') resultItem: any,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const authorization = this.getAuthorization(req);
        const resu = await this.sendRequest('spd-prod-req-item-delete', { result, resultItem, authorization });
        return res.status(HttpStatus.OK).json(resu);
    }





}