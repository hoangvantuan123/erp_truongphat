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
import { GrpcAuthService } from 'src/controllers/grpc/service/grpc-auth.service';
import { lastValueFrom } from 'rxjs';
@Controller('v2/acc')
export class AuthController {
    constructor(
        @Inject('AUTH_SERVICE') private readonly authService: ClientProxy,
        private readonly grpcAuthService: GrpcAuthService
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

    @Post('admin/update-passwords-2')
    async updatePasswords(@Body('userIds') userIds: (string | number)[],
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const authorization = this.getAuthorization(req);
        const resu = await this.sendRequest('admin/update-passwords-2', { userIds, authorization });
        return res.status(HttpStatus.OK).json(resu);
    }
    @Post('p2/login')
    async loginUserB(@Body() body: any) {
        const result = await this.sendRequest('p2-login', body);
        return result;
    }
    @Post('p2/login-otp')
    async loginUserC(@Body() body: any) {
        const result = await this.sendRequest('p2-login-otp', body);
        return result;
    }


    @Post('update-users')
    async updateBatch(
        @Body() records: any[],
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const authorization = this.getAuthorization(req);
        const result = await this.sendRequest('update-users', { records, authorization });
        return res.status(HttpStatus.OK).json(result);
    }

    @Post('check-roles-user-raw')
    async getDataRolesUserRaw(
        @Query('language') language: number,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const authorization = this.getAuthorization(req);
        const result = await this.sendRequest('check-roles-user-raw', { language, authorization });
        return res.status(HttpStatus.OK).json(result);
    }

    @Post('p2/change-password')
    async changePassword(
        @Req() req: Request,
        @Body() body: any,
        @Res() res: Response,
    ) {
        const authorization = this.getAuthorization(req);
        const result = await this.sendRequest('p2-change-password', { body, authorization });
        return res.status(HttpStatus.OK).json(result);
    }


    @Post('check-user')
    async checkUserSeq(
        @Req() req: Request,
        @Res() res: Response,
        @Body() body: { ipAddress?: string }
    ) {
        const authorization = this.getAuthorization(req);
        const result = await this.sendRequest('check-user', {
            authorization,
            ipAddress: body.ipAddress,
        });


        const forwarded = req.headers['x-forwarded-for'];
        const ip =
            typeof forwarded === 'string'
                ? forwarded.split(',')[0].trim()
                : req.socket.remoteAddress;

        console.log('IP từ Client:', ip);

        return res.status(HttpStatus.OK).json(result);
    }


    @Post('a-users')
    addUsers(@Body() body: { result: any }, @Req() req: Request) {
        if (!body?.result) {
            return { success: false, message: 'Invalid request: Missing "result"' };
        }
        const authorization = req.headers.authorization || '';
        const requestData = { result: body.result, metadata: { authorization } };

        return lastValueFrom(this.grpcAuthService.addUsers(requestData.result, requestData.metadata))
            .then((resu) => {
                return resu;
            })
            .catch((error) => {
                return { success: false, message: 'Internal Server Error' };
            });
    }




    @Post('get-help-user-auth-query')
    getHelpUserAuthQuery(@Body() body: { result: any }, @Req() req: Request) {
        if (!body?.result) {
            return { success: false, message: 'Invalid request: Missing "result"' };
        }
        const authorization = req.headers.authorization || '';
        const requestData = { result: body.result, metadata: { authorization } };

        return lastValueFrom(this.grpcAuthService.getHelpUserAuthQuery(requestData.result, requestData.metadata))
            .then((resu) => {
                return resu;
            })
            .catch((error) => {
                return { success: false, message: 'Internal Server Error' };
            });
    }

    @Post('deviceLogsQ')
    deviceLogsQ(@Body() body: { result: any }, @Req() req: Request) {
        if (!body?.result) {
            return { success: false, message: 'Invalid request: Missing "result"' };
        }
        const authorization = req.headers.authorization || '';
        const requestData = { result: body.result, metadata: { authorization } };

        return lastValueFrom(this.grpcAuthService.deviceLogsQ(requestData.result, requestData.metadata))
            .then((resu) => {
                return resu;
            })
            .catch((error) => {
                return { success: false, message: 'Internal Server Error' };
            });
    }


}