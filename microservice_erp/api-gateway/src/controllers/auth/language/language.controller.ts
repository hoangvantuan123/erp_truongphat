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
@Controller('v2')
export class LanguageController {
    constructor(
        @Inject('AUTH_SERVICE') private readonly authService: ClientProxy,
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
                this.authService.send(pattern, payload).pipe(
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
    @Get('language')
    async getLanguageData(
        @Query('languageSeq') languageSeq: string,
    ) {
        const result = await this.sendRequest('get-language-data', { languageSeq });
        return result;
    }

    @Get('/dict/lang-sys')
    async findAllLangSys(
        @Query() filter: Record<string, any>,
        @Req() req: Request,
        @Res() res: Response
    ) {
        const authorization = this.getAuthorization(req);
        const result = await this.sendRequest('find-all-lang-sys', { filter, authorization });
        return res.status(HttpStatus.OK).json(result);
    }

    @Get('/dict/dictionary-sys')
    async findAllDictionary(
        @Query() query: Record<string, any>,
        @Req() req: Request,
        @Res() res: Response
    ) {
        const { page, ...filter } = query;
        const authorization = this.getAuthorization(req);

        const result = await this.sendRequest('find-all-dictionary-sys', {
            filter,
            page: Number(page),
            authorization
        });

        return res.status(HttpStatus.OK).json(result);
    }


    @Post('/dict/add-lang-sys')
    async addBatch(
        @Body() records: any[],
        @Req() req: Request,
        @Res() res: Response
    ) {
        const authorization = this.getAuthorization(req);
        const result = await this.sendRequest('add-multiple-lang', { records, authorization });
        return res.status(HttpStatus.OK).json(result);
    }

    @Post('/dict/add-dict-sys')
    async addDictionary(
        @Body() records: any[],
        @Req() req: Request,
        @Res() res: Response
    ) {
        const authorization = this.getAuthorization(req);
        const result = await this.sendRequest('add-multiple-dictionary', { records, authorization });
        return res.status(HttpStatus.OK).json(result);
    }



    @Post('/dict/update-lang-sys')
    async updateBatchLang(
        @Body() records: any[],
        @Req() req: Request,
        @Res() res: Response
    ) {
        const authorization = this.getAuthorization(req);
        const result = await this.sendRequest('update-lang-sys', { records, authorization });
        return res.status(HttpStatus.OK).json(result);
    }

    @Post('/dict/update-dictionarys-sys')
    async updateBatchDictionarys(
        @Body() records: any[],
        @Req() req: Request,
        @Res() res: Response
    ) {
     
        const authorization = this.getAuthorization(req);
 
        const result = await this.sendRequest('update-dictionarys-sys', { records, authorization });
        return res.status(HttpStatus.OK).json(result);
    }

    @Delete('/dict/delete-lang-sys')
    async deleteLangs(
        @Body('ids') ids: number[],
        @Req() req: Request,
        @Res() res: Response
    ) {
        const authorization = this.getAuthorization(req);
        const result = await this.sendRequest('delete-lang-sys', { ids, authorization });
        return res.status(HttpStatus.OK).json(result);
    }

    @Delete('/dict/delete-dict-sys')
    async deleteDicts(
        @Body('ids') ids: number[],
        @Req() req: Request,
        @Res() res: Response
    ) {
        const authorization = this.getAuthorization(req);
        const result = await this.sendRequest('delete-dict-sys', { ids, authorization });
        return res.status(HttpStatus.OK).json(result);
    }


}