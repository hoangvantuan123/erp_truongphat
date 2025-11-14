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
@Controller('v1/mssql/customers/')
export class CustomersController {
    constructor(@Inject('CUSTOMER_SERVICE') private readonly customerService: ClientProxy,) { }


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
                this.customerService.send(pattern, payload).pipe(
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

    @Post('search-by')
    async searchBy(
        @Body('result') result: any[],
        @Req() req: Request,
        @Res() res: Response,
    ){
        const authorization = this.getAuthorization(req);
        const resu = await this.sendRequest('search-by', { result, authorization });
        return res.status(HttpStatus.OK).json(resu);

    }

    @Post('created-by')
    async AutoCheckA(
        @Body('result') result: any[],
        @Req() req: Request,
        @Res() res: Response,
    ){
        const authorization = this.getAuthorization(req);
        const resu = await this.sendRequest('created-by', { result, authorization });
        return res.status(HttpStatus.OK).json(resu);

    }

    @Post('updated-by')
    async UpdateBy(
        @Body('result') result: any[],
        @Req() req: Request,
        @Res() res: Response,
    ){
        const authorization = this.getAuthorization(req);
        const resu = await this.sendRequest('updated-by', { result, authorization });
        return res.status(HttpStatus.OK).json(resu);
    }

    @Post('delete-by')
    async AutoCheckD(
        @Body('result') result: any[],
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const authorization = this.getAuthorization(req);
        const resu = await this.sendRequest('delete-by', { result, authorization });
        return res.status(HttpStatus.OK).json(resu);
    }

    @Post('get-master')
    async GetNasterInfo(
        @Body('result') result: any[],
        @Req() req: Request,
        @Res() res: Response,
    ){
        const authorization = this.getAuthorization(req);
        const resu = await this.sendRequest('get-master', { result, authorization });
        return res.status(HttpStatus.OK).json(resu);

    }

    @Post('get-cust-add-info')
    async GetCustAddInfo(
        @Body('result') result: any[],
        @Req() req: Request,
        @Res() res: Response,
    ){
        const authorization = this.getAuthorization(req);
        const resu = await this.sendRequest('get-cust-add-info', { result, authorization });
        return res.status(HttpStatus.OK).json(resu);
    }

    @Post('get-cust-kind')
    async GetCustKindInfo(
        @Body('result') result: any[],
        @Req() req: Request,
        @Res() res: Response,
    ){
        const authorization = this.getAuthorization(req);
        const resu = await this.sendRequest('get-cust-kind', { result, authorization });
        return res.status(HttpStatus.OK).json(resu);

    }

    @Post('get-bank-info')
    async GetCustBankInfo(
        @Body('result') result: any[],
        @Req() req: Request,
        @Res() res: Response,
    ){
        const authorization = this.getAuthorization(req);
        const resu = await this.sendRequest('get-bank-info', { result, authorization });
        return res.status(HttpStatus.OK).json(resu);

    }

    @Post('get-cust-remark')
    async GetCustRemark(
        @Body('result') result: any[],
        @Req() req: Request,
        @Res() res: Response,
    ){
        const authorization = this.getAuthorization(req);
        const resu = await this.sendRequest('get-cust-remark', { result, authorization });
        return res.status(HttpStatus.OK).json(resu);
    }

}
