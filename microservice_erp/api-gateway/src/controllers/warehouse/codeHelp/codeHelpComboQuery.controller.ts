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
@Controller('v1/mssql/code-help-combo-query')
export class CodeHelpComboQueryController {
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

    @Get('')
    async codeHelpComboQuery(
        @Query('workingTag') workingTag: string,
        @Query('languageSeq') languageSeq: number,
        @Query('codeHelpSeq') codeHelpSeq: number,
        @Query('companySeq') companySeq: number,
        @Query('keyword') keyword: string,
        @Query('param1') param1: string,
        @Query('param2') param2: string,
        @Query('param3') param3: string,
        @Query('param4') param4: string,
    ) {
        return await this.sendRequest('code-help-combo-query', { workingTag, languageSeq, codeHelpSeq, companySeq, keyword, param1, param2, param3, param4 });
    }


}