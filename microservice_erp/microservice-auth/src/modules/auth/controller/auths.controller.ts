import {
    Controller,
    Post,
    Body,
    Req,
    Res,
    HttpStatus,
    UnauthorizedException,
    Put,
    Patch,
    Get,
    Query,
    BadRequestException
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { jwtConstants } from 'src/config/security.config';
import { UserAuthService } from '../service/user.service';
import { Response } from 'express';
import { AuthService } from '../service/auths.service';
import { LoginDto, LoginEmailDto } from '../dto/login.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { MetadataResponse } from 'src/modules/systemConfig/interface/response';
import { Observable, from, throwError, catchError, map, of, mergeMap, switchMap } from 'rxjs';
import { SimpleQueryResult } from 'src/common/interfaces/simple-query-result.interface';
import { DatabaseService } from 'src/common/database/sqlServer/ITMV/database.service';
@Controller('')
export class AuthController {
    constructor(
        private readonly appService: AuthService,
        private readonly userAuthService: UserAuthService,
        private readonly databaseService: DatabaseService,
    ) { }
    private validateToken(metadata: any): { UserId: number; EmpSeq: number; UserSeq: number; CompanySeq: number } {
        if (!metadata || !metadata["authorization"]) {
            throw new RpcException({ code: 16, message: 'Missing authorization token' });
        }

        const token = metadata["authorization"].split(' ')[1];
        if (!token) {
            throw new RpcException({ code: 16, message: 'Invalid or expired token' });
        }

        try {
            return jwt.verify(token, jwtConstants.secret) as any;
        } catch (error) {
            throw new RpcException({ code: 16, message: 'Invalid or expired token' });
        }
    }

    private handleGrpcRequest(
        request: any,
        serviceMethod: (result: any[], companySeq: number, userSeq: number) => Observable<any>
    ): Observable<MetadataResponse> {
        try {
            const decodedToken = this.validateToken(request.metadata);

            return from(serviceMethod(request.result, decodedToken.CompanySeq, decodedToken.UserSeq)).pipe(
                map(queryResult => {
                    return { status: true, message: "Query successful", data: JSON.stringify(queryResult.data) };
                }),
                catchError(error => {
                    return of({ status: false, message: error.message || 'Internal server error', data: '', errors: JSON.stringify(error.errors) });
                })
            );
        } catch (error) {
            return of({ status: false, message: error.message || 'Internal server error', data: '', errors: JSON.stringify(error.errors) });
        }
    }



    @MessagePattern('admin/update-passwords-2')
    async updatePasswords(
        @Payload() data: { userIds: (string | number)[], authorization: string }
    ) {
        const { userIds } = data;
        if (!Array.isArray(userIds) || userIds.length === 0) {
            throw new BadRequestException('userIds phải là một mảng không rỗng');
        }

        const result = await this.appService.updatePasswordForUsers(userIds);

        if (result.success) {
            return { message: result.message };
        } else {
            throw new RpcException({
                statusCode: 401,
                message: result.message,
            });
        }
    }

    /* DỰ ÁN ERP WAREHOUSE */
    /* LOGIN PASS2 */
    @MessagePattern('p2-login')
    async loginUserB(@Payload() loginDto: LoginDto) {
        return this.appService.loginUserB(loginDto);
    }
    @MessagePattern('p2-login-otp')
    async loginUserC(@Payload() loginDto: LoginEmailDto) {
        return this.appService.loginUserC(loginDto);
    }


    @MessagePattern('check-roles-user-raw')
    async getDataRolesUserRaw(@Payload() data: { language: number; authorization: string }): Promise<any> {
        const { language, authorization } = data;

        const authHeader = authorization;

        if (!authHeader) {
            throw new RpcException({
                statusCode: 401,
                message: 'Invalid or expired token.',
            });
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            throw new RpcException({
                statusCode: 401,
                message: 'Invalid or expired token.',
            });
        }

        try {
            const decodedToken = jwt.verify(token, jwtConstants.secret) as {
                UserId: string;
                EmpSeq: number;
                UserSeq: number;
                CompanySeq: number;
            };

            const result = await this.appService.getDataRolesUserRaw(decodedToken.UserId, language);
            const tokenRolesUserMenu = jwt.sign(
                { data: result },
                jwtConstants.secret,
                { expiresIn: '24h' }
            );

            return {
                success: true,
                data: {
                    tokenRolesUserMenu,
                },
            };
        } catch (error) {
            throw new RpcException({
                statusCode: 401,
                message: 'Unauthorized: Invalid or expired token.',
            });
        }
    }


    @MessagePattern('p2-change-password')
    async changePassword(
        @Payload() data: any,
    ) {
        const { body, authorization } = data;
        const { employeeId, oldPassword, newPassword } = body;
        try {
            const result = await this.appService.changePassword2(employeeId, oldPassword, newPassword);
            return {
                success: result.success,
                message: result.success ? result.message : result.error?.message || 'An error occurred',
                code: result.success ? undefined : result.error?.code || 'UNKNOWN_ERROR',
            };
        } catch (error) {
            return {
                success: false,
                message: 'An unexpected error occurred',
            };
        }
    }

    /* @MessagePattern('check-user')
    findCheckToken(@Payload() data: { authorization: string; ipAddress?: string }) {
        const { authorization, ipAddress } = data;

        if (!authorization) {
            throw new RpcException({
                statusCode: 401,
                message: 'Invalid or expired token.',
            });
        }

        const token = authorization.split(' ')[1];
        if (!token) {
            throw new RpcException({
                statusCode: 401,
                message: 'Invalid or expired token.',
            });
        }

        try {
            const decodedToken = jwt.verify(token, jwtConstants.secret) as {
                UserId: any;
                EmpSeq: any;
                UserSeq: any;
                CompanySeq: any;
                AccountScope: boolean;
                DeviceId: any;
            };

            const accountScope = decodedToken.AccountScope;

            const query = `SELECT 1 FROM _ERPPublicIPs WHERE IPAddress = '${ipAddress}'`;
            return this.databaseService.executeQuery(query).then((result) => {
                const isPublicIPAllowed = result.length > 0;

                if (!isPublicIPAllowed && !accountScope) {
                    return {
                        status: false,
                        message: 'IP address not allowed for this user',
                    };
                }

                if (isPublicIPAllowed && accountScope) {
                    console.warn(`User ${decodedToken.UserId} đăng nhập từ IP không trong whitelist: ${ipAddress}`);
                }

                return {
                    status: true,
                    message: 'success',
                    data: decodedToken,
                };
            }).catch(() => {
                return {
                    status: false,
                    message: 'Database error',
                };
            });
        } catch (error) {
            return {
                status: false,
                message: 'Invalid or expired token',
            };
        }
    }
 */

    @MessagePattern('check-user')
    findCheckToken(
        @Payload() data: { authorization: string; ipAddress?: string }
    ) {
        const { authorization, ipAddress } = data;

        if (!authorization) {
            throw new RpcException({
                statusCode: 401,
                message: 'Invalid or expired token.',
            });
        }

        const token = authorization.split(' ')[1];
        if (!token) {
            throw new RpcException({
                statusCode: 401,
                message: 'Invalid or expired token.',
            });
        }

        try {
            const decodedToken = jwt.verify(token, jwtConstants.secret) as {
                UserId: any;
                EmpSeq: any;
                UserSeq: any;
                CompanySeq: any;
                AccountScope: boolean;
                DeviceId: any;
            };

            const { UserSeq, DeviceId, AccountScope, UserId } = decodedToken;

            const queryIP = `SELECT 1 FROM _ERPPublicIPs WHERE IPAddress = '${ipAddress}'`;

            return this.databaseService.executeQuery(queryIP).then((ipResult) => {

           
                const queryLogs = `
        SELECT StatusLogs FROM _ERPUserLoginLogs 
        WHERE UserSeq = '${UserSeq}' AND DeviceId = '${DeviceId}'
      `;

                return this.databaseService.executeQuery(queryLogs).then((loginLogs) => {
                    const hasLoggedOut = loginLogs.some(
                        (log) => log.StatusLogs === 0 || log.StatusLogs === false
                    );

                    if (hasLoggedOut) {
                        return {
                            status: false,
                            message: 'Thiết bị đã bị đăng xuất',
                        };
                    }

                    return {
                        status: true,
                        message: 'success',
                        data: decodedToken,
                    };
                });
            });
        } catch (error) {
            return Promise.resolve({
                status: false,
                message: 'Invalid or expired token',
            });
        }
    }


    @MessagePattern('update-users')
    updateBatch(
        @Payload() data: { records: any[], authorization: string }
    ): Observable<SimpleQueryResult> {
        const { records, authorization } = data;

        if (!authorization) {
            return throwError(() => new RpcException({ statusCode: 401, message: 'Invalid or expired token.' }));
        }

        const token = authorization.split(' ')[1];
        if (!token) {
            return throwError(() => new RpcException({ statusCode: 401, message: 'Invalid or expired token.' }));
        }

        let decodedToken: any;
        try {
            decodedToken = jwt.verify(token, jwtConstants.secret) as {
                UserId: any;
                EmpSeq: any;
                UserSeq: any;
                CompanySeq: any;
            };
        } catch (error) {
            return throwError(() => new RpcException({ statusCode: 401, message: 'Invalid or expired token.' }));
        }

        if (!records || !Array.isArray(records) || records.length === 0) {
            return throwError(() => new RpcException({ statusCode: 400, message: 'No records provided for update.' }));
        }

        return this.userAuthService.updateMultipleUsers(records, decodedToken.UserSeq).pipe(
            map(result => ({
                success: true,
                message: result?.message ?? 'Update successful',
                data: result?.data ?? []
            })),
            catchError(error =>
                throwError(() => new RpcException({ statusCode: 500, message: error.message || 'An error occurred' }))
            )
        );
    }



    @GrpcMethod('UsersService', 'addUsers')
    addMultipleUsers(request: any[]): Observable<MetadataResponse> {
        return this.handleGrpcRequest(request, this.userAuthService.addMultipleUsers.bind(this.userAuthService));
    }
    @GrpcMethod('UsersService', 'getHelpUserAuthQuery')
    getHelpUserAuthQuery(request: any[]): Observable<MetadataResponse> {
        return this.handleGrpcRequest(request, this.userAuthService.getHelpUserAuthQuery.bind(this.userAuthService));
    }
    @GrpcMethod('UsersService', 'deviceLogsQ')
    DeviceLogsQ(request: any[]): Observable<MetadataResponse> {
        return this.handleGrpcRequest(request, this.userAuthService.DeviceLogsQ.bind(this.userAuthService));
    }

}