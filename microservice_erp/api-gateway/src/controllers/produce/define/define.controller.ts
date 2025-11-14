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
@Controller('v5/basic')
export class DefinesController {
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

    @Get('all-defines')
    async findAll(
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const authorization = this.getAuthorization(req);
        const result = await this.sendRequest('all-defines', { authorization });
        return res.status(HttpStatus.OK).json(result);
    }



    @Post('add-defines')
    async create(
        @Body() records: any[],
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const authorization = this.getAuthorization(req);
        const result = await this.sendRequest('add-defines', { records, authorization });
        return res.status(HttpStatus.OK).json(result);
    }
    @Post('update-defines')
    async update(
        @Body() records: any[],
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const authorization = this.getAuthorization(req);
        const result = await this.sendRequest('update-defines', { records, authorization });
        return res.status(HttpStatus.OK).json(result);
    }
    @Delete('delete-defines')
    async delete(@Body('ids') ids: number[],
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const authorization = this.getAuthorization(req);
        const result = await this.sendRequest('delete-defines', { ids, authorization });
        return res.status(HttpStatus.OK).json(result);
    }
    @Get('help-query-define')
    async getHelpQuery(
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const authorization = this.getAuthorization(req);
        const result = await this.sendRequest('help-query-define', { authorization });
        return res.status(HttpStatus.OK).json(result);
    }




}