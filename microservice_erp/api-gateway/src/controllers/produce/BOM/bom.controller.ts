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

@Controller('v5/bom')
export class BomController {
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

    @Post('BOM-Tree-Seq')
    async SLGInOutReqPrintQuery(
        @Body('result') result: any,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const authorization = this.getAuthorization(req);
        const resu = await this.sendRequest('BOM-Tree-Seq', { result, authorization });
        return res.status(HttpStatus.OK).json(resu);
    }
    @Post('BOM-Item-Info-Query')
    async SPDBOMItemInfoQuery(
        @Body('result') result: any,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const authorization = this.getAuthorization(req);
        const resu = await this.sendRequest('BOM-Item-Info-Query', { result, authorization });
        return res.status(HttpStatus.OK).json(resu);
    }

    @Post('BOM-Ver-Mng-Query')
    async BOMVerMngQuery(
        @Body('result') result: any,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const authorization = this.getAuthorization(req);
        const resu = await this.sendRequest('BOM-Ver-Mng-Query', { result, authorization });
        return res.status(HttpStatus.OK).json(resu);
    }



    @Post('BOM-Sub-Item-Query')
    async SPDBOMSubItemQuery(
        @Body('result') result: any,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const authorization = this.getAuthorization(req);
        const resu = await this.sendRequest('BOM-Sub-Item-Query', { result, authorization });
        return res.status(HttpStatus.OK).json(resu);
    }


    @Post('spd-bom-sub-item-create')
    async SPDBOMSubItemCreate(
        @Body('result') result: any[],
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const authorization = this.getAuthorization(req);
        const resu = await this.sendRequest('spd-bom-sub-item-create', { result, authorization });
        return res.status(HttpStatus.OK).json(resu);
    }
    @Post('spd-bom-sub-item-delete')
    async SPDBOMSubItemDelete(
        @Body('result') result: any[],
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const authorization = this.getAuthorization(req);
        const resu = await this.sendRequest('spd-bom-sub-item-delete', { result, authorization });
        return res.status(HttpStatus.OK).json(resu);
    }


    @Post('spd-bom-sub-item-update')
    async SPDBOMSubItemUpdate(
        @Body('result') result: any[],
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const authorization = this.getAuthorization(req);
        const resu = await this.sendRequest('spd-bom-sub-item-update', { result, authorization });
        return res.status(HttpStatus.OK).json(resu);
    }



}