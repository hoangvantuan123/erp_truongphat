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

@Controller('v2/mssql/help-query')
export class HelpQueryRoleController {
    constructor(@Inject('AUTH_SERVICE') private readonly authService: ClientProxy) { }

    private getAuthorization(req: Request) {
        const authorization = req.headers.authorization;
        if (!authorization) {
            return {
                success: false,
                message: 'Authorization header is missing',
                error: 'Unauthorized'
            };
        }
        return authorization;
    }

    private async sendRequest(pattern: string, payload: any) {
        const requestTimeout = parseInt(process.env.REQUEST_TIMEOUT || '360000');
        try {
            return await firstValueFrom(
                this.authService.send(pattern, payload).pipe(timeout(requestTimeout))
            );
        } catch (error) {
            if (error.name === 'AbortError' || error.message.includes('Timeout')) {
                return { success: false, message: 'Request timeout.', error: 'Timeout' };
            }
            if (error instanceof RpcException) {
                return { success: false, message: 'Service error.', error: error.message };
            }
            return { success: false, message: 'Internal error.', error: error.message };
        }
    }

    @Post('help-root-menu')
    async getHelpRootMenu(
        @Body() body: { page: number; limit?: number; value?: string },
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const authorization = this.getAuthorization(req);
        const { page, limit = 2000, value } = body;
        const result = await this.sendRequest('help-root-menu', { page, limit, value, authorization });
        return res.status(HttpStatus.OK).json(result);
    }
    @Post('help-menu')
    async getHelpMenu(
        @Body() body: { page: number; limit?: number; value?: string },
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const authorization = this.getAuthorization(req);
        const { page, limit = 2000, value } = body;
        const result = await this.sendRequest('help-menu', { page, limit, value, authorization });
        return res.status(HttpStatus.OK).json(result);
    }
    
    @Post('help-users')
    async getHelpUsers(
        @Body() body: { page: number; limit?: number; value?: string },
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const authorization = this.getAuthorization(req);
        const { page, limit = 2000, value } = body;
        const result = await this.sendRequest('help-users', { page, limit, value, authorization });
        return res.status(HttpStatus.OK).json(result);
    }
}
