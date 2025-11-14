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

@Controller('v2/mssql/system-users')
export class SystemUsersController {
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

    @Get('itm-roles-data-users-web')
    async convertDC(
        @Query('userId') userId: string,
        @Query('userName') userName: string,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const authorization = this.getAuthorization(req);
        const result = await this.sendRequest('itm-roles-data-users-web', { userId, userName, authorization });
        return res.status(HttpStatus.OK).json(result);
    }

    @Post('itm-groups')
    async groupRoles(
        @Body() records: Partial<Record<string, any>>,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const authorization = this.getAuthorization(req);
        const result = await this.sendRequest('itm-groups', { records, authorization });
        return res.status(HttpStatus.OK).json(result);
    }


    @Get('itm-groups-all')
    async findAll(
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const authorization = this.getAuthorization(req);
        const result = await this.sendRequest('itm-groups-all', { authorization });
        return res.status(HttpStatus.OK).json(result);
    }

    @Post('itm-menu')
    async createMenu(
        @Body() records: Partial<Record<string, any>>,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const authorization = this.getAuthorization(req);
        const result = await this.sendRequest('itm-menu', { records, authorization });
        return res.status(HttpStatus.OK).json(result);
    }


    @Post('itm-root-menu')
    async createRootMenu(
        @Body() records: Partial<Record<string, any>>,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const authorization = this.getAuthorization(req);
        const result = await this.sendRequest('itm-root-menu', { records, authorization });
        return res.status(HttpStatus.OK).json(result);
    }
    @Get('itm-root-menu-all')
    async findAllRootMenu(
        @Query() filter: Record<string, any>,
        @Query('languageSeq') languageSeq: number,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const authorization = this.getAuthorization(req);
        const result = await this.sendRequest('itm-root-menu-all', { filter, languageSeq, authorization });
        return res.status(HttpStatus.OK).json(result);
    }
    @Get('itm-menu-all')
    async findAllMenu(
        @Query() filter: Record<string, any>,
        @Query('languageSeq') languageSeq: number,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const authorization = this.getAuthorization(req);
        const result = await this.sendRequest('itm-menu-all', { filter, languageSeq, authorization });
        return res.status(HttpStatus.OK).json(result);
    }



    @Get('sys-menu-submenu-all')
    async findSubmenus(
        @Query('languageSeq') languageSeq: number,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const authorization = this.getAuthorization(req);
        const result = await this.sendRequest('sys-menu-submenu-all', { languageSeq, authorization });
        return res.status(HttpStatus.OK).json(result);
    }
    @Get('root-menus-not-in-role')
    async getRootMenusNotInRole(
        @Query('groupId') groupId: number,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const authorization = this.getAuthorization(req);

        const result = await this.sendRequest('root-menus-not-in-role', { groupId, authorization });
        return res.status(HttpStatus.OK).json(result);
    }

    @Get('menus-not-in-role')
    async getMenusNotInRole(
        @Query('groupId') groupId: number,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const authorization = this.getAuthorization(req);
        const result = await this.sendRequest('menus-not-in-role', { groupId, authorization });
        return res.status(HttpStatus.OK).json(result);
    }
    @Get('users-not-in-role')
    async getUsersNotInRole(
        @Query('groupId') groupId: number,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const authorization = this.getAuthorization(req);
        const result = await this.sendRequest('users-not-in-role', { groupId, authorization });
        return res.status(HttpStatus.OK).json(result);
    }
    @Post('itm-roles-root-menus')
    async createRolesRootMenus(
        @Body() body: { rootMenuIds: number[], groupId: number, type: string },
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const authorization = this.getAuthorization(req);
        const result = await this.sendRequest('itm-roles-root-menus', { ...body, authorization });
        return res.status(HttpStatus.OK).json(result);
    }
    @Post('itm-roles-menus')
    async createRolesMenus(
        @Body() body: { rootMenuIds: number[], groupId: number, type: string },
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const authorization = this.getAuthorization(req);
        const result = await this.sendRequest('itm-roles-menus', { ...body, authorization });
        return res.status(HttpStatus.OK).json(result);
    }
    @Post('itm-roles-users')
    async createRolesUsers(
        @Body() body: { rootMenuIds: number[], groupId: number, type: string },
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const authorization = this.getAuthorization(req);
        const result = await this.sendRequest('itm-roles-users', { ...body, authorization });
        return res.status(HttpStatus.OK).json(result);
    }
    @Get('roles-paginated-root-menu')
    async getPaginatedRoles(
        @Query('groupId') groupId: number,
        @Query('type') type: string,
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const authorization = this.getAuthorization(req);
        const result = await this.sendRequest('roles-paginated-root-menu', { groupId, type, page, limit, authorization });
        return res.status(HttpStatus.OK).json(result);
    }
    @Get('roles-paginated-menu')
    async getPaginatedMenuRolesWithLabelsRaw(
        @Query('groupId') groupId: number,
        @Query('type') type: string,
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const authorization = this.getAuthorization(req);
        const result = await this.sendRequest('roles-paginated-menu', { groupId, type, page, limit, authorization });
        return res.status(HttpStatus.OK).json(result);
    }
    @Get('roles-paginated-users')
    async getPaginatedUserRolesWithLabelsRaw(
        @Query('groupId') groupId: number,
        @Query('type') type: string,
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const authorization = this.getAuthorization(req);
        const result = await this.sendRequest('roles-paginated-users', { groupId, type, page, limit, authorization });
        return res.status(HttpStatus.OK).json(result);
    }
    @Post('update/roles-user')
    async updateRoles(
        @Body() updateData: any[],
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const authorization = this.getAuthorization(req);
        const result = await this.sendRequest('update/roles-user', { updateData, authorization });
        return res.status(HttpStatus.OK).json(result);
    }


    @Delete('delete/roles-user')
    async deleteRoles(
        @Body() body: { ids: number[] },
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const authorization = this.getAuthorization(req);
        const result = await this.sendRequest('delete/roles-user', { ...body, authorization });
        return res.status(HttpStatus.OK).json(result);
    }

    @Delete('delete/groups')
    async deleteGroups(
        @Body() body: { ids: number[] },
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const authorization = this.getAuthorization(req);
        const result = await this.sendRequest('delete/groups', { ...body, authorization });
        return res.status(HttpStatus.OK).json(result);
    }
    @Delete('delete/menus')
    async deleteMenus(
        @Body() body: { ids: number[] },
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const authorization = this.getAuthorization(req);
        const result = await this.sendRequest('delete/menus', { ...body, authorization });
        return res.status(HttpStatus.OK).json(result);
    }
    @Delete('delete/root-menu')
    async deleteRootMenus(
        @Body() body: { ids: number[] },
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const authorization = this.getAuthorization(req);
        const result = await this.sendRequest('delete/root-menu', { ...body, authorization });
        return res.status(HttpStatus.OK).json(result);
    }

    @Post('add-role-group-users')
    async addMultiplerRoleUsers(
        @Req() req: Request,
        @Res() res: Response,
        @Body() payload: any,
    ) {
        const authorization = this.getAuthorization(req);
        const result = await this.sendRequest('add-role-group-users', { payload, authorization });
        return res.status(HttpStatus.OK).json(result);
    }

    @Post('update-role-groups')
    async updateMultipleRoleGroup(
        @Req() req: Request,
        @Res() res: Response,
        @Body() records: any[],
    ) {
        const authorization = this.getAuthorization(req);
        const result = await this.sendRequest('update-role-groups', { records, authorization });
        return res.status(HttpStatus.OK).json(result);
    }


    @Post('update-role-group-users')
    async updateMultipleRoleUsers(
        @Req() req: Request,
        @Res() res: Response,
        @Body() records: any[],
    ) {
        const authorization = this.getAuthorization(req);
        const result = await this.sendRequest('update-role-group-users', { records, authorization });
        return res.status(HttpStatus.OK).json(result);
    }


    @Delete('delete-role-group')
    async deleteMultipleRoleGroup(
        @Body() body: { ids: number[] },
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const authorization = this.getAuthorization(req);
        const result = await this.sendRequest('delete-role-group', { ...body, authorization });
        return res.status(HttpStatus.OK).json(result);
    }

    @Delete('delete-role-sys')
    async deleteRoleSys(
        @Body() body: { ids: number[] },
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const authorization = this.getAuthorization(req);
        const result = await this.sendRequest('delete-role-sys', { ...body, authorization });
        return res.status(HttpStatus.OK).json(result);
    }
}