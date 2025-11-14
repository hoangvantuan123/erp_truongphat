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

@Controller('v3/barcode-change')
export class BarcodeChangeController {
    constructor(@Inject('CHANGE_LABEL_SERVICE') private readonly changeLabelService: ClientProxy,) { }


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
                this.changeLabelService.send(pattern, payload).pipe(
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

    @Get('paginated')
    async getPaginatedData(
        @Body('result') result: any[],
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const authorization = this.getAuthorization(req);
        const resu = await this.sendRequest('paginated', { result, authorization });
        return res.status(HttpStatus.OK).json(resu);
    }

    @Post('printer')
    async checkPrinter(
        @Body('result') result: any[],
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const authorization = this.getAuthorization(req);
        const resu = await this.sendRequest('printer', { result, authorization });
        return res.status(HttpStatus.OK).json(resu);
    }

    @Post('check-old-barcode')
    async checkConfirm(
        @Body('result') result: any[],
        @Req() req: Request,
        @Res() res: Response,
    ){
        const authorization = this.getAuthorization(req);
        const resu = await this.sendRequest('check-old-barcode', { result, authorization });
        return res.status(HttpStatus.OK).json(resu);
    }

    @Post('check-new-barcode')
    async checkNewBarcode(
        @Body('result') result: any[],
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const authorization = this.getAuthorization(req);
        const resu = await this.sendRequest('check-new-barcode', { result, authorization });
        return res.status(HttpStatus.OK).json(resu);
    }

    @Post('confirm')
    async confirmBarcode(
        @Body('result') result: any[],
        @Req() req: Request,
        @Res() res: Response,
    ){
        const authorization = this.getAuthorization(req);
        const resu = await this.sendRequest('confirm', { result, authorization });
        return res.status(HttpStatus.OK).json(resu);
    }

    @Post('exist-barcode')
    async isExistBarcode(
        @Body('result') result: any[],
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const authorization = this.getAuthorization(req);
        const resu = await this.sendRequest('exist-barcode', { result, authorization });
        return res.status(HttpStatus.OK).json(resu);
    }

    @Get('device-printer')
    async searchByPrinter(
        @Body('result') result: any[],
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const authorization = this.getAuthorization(req);
        const resu = await this.sendRequest('device-printer', { result, authorization });
        return res.status(HttpStatus.OK).json(resu);
    }

}
