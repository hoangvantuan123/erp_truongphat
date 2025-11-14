import {
    Controller,
    Get,
    Post,
    HttpStatus,
    Body,
    Param,
    Put,
    Delete,
    Query,
    Req,
    Res,
    UnauthorizedException,
    NotFoundException
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { SimpleQueryResult } from 'src/common/interfaces/simple-query-result.interface';
import { SystemUsersService } from '../service/systemUsers.service';
import { CreateResGroupsDto } from '../dto/groups.dto';
import { Request, Response } from 'express';
import { jwtConstants } from 'src/config/security.config';
import { TCAGroupsWEB } from '../entities/groups.entity';
import { TCAMenusWEB } from '../entities/menus.entity';
import { TCARootMenusWEB } from '../entities/rootMenus.entity';
import { TCARolesUsersWEB } from '../entities/rolesUsers.entity';
import { TCAUserWEB } from 'src/modules/auth/entities/auths.entity';
import { CreateResUsersDto } from '../dto/users.dto';
import { UpdateRoleDto } from '../dto/updateRole.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RpcException } from '@nestjs/microservices';
import { DatabaseService } from 'src/common/database/sqlServer/ITMV/database.service';
@Controller()
export class SystemUsersController {
    constructor(private readonly systemUsersService: SystemUsersService,
        private readonly databaseService: DatabaseService,
    ) { }

    @MessagePattern('itm-roles-data-users-web')
    async convertDC(
        @Payload() data: { userId: string, userName: string, authorization: string }
    ): Promise<SimpleQueryResult> {
        const { userId, userName, authorization } = data;
        const result = await this.systemUsersService.GetFilteredTCAUserWEB(userId, userName);
        return result;
    }

    @MessagePattern('itm-groups')
    async groupRoles(
        @Payload() data: { records: Partial<CreateResGroupsDto>, authorization: string }
    ): Promise<any> {
        const { records, authorization } = data;
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
            };


            return this.systemUsersService.createTCAGroupsWEB(
                decodedToken.UserId,
                records
            );

        } catch (error) {
            throw new RpcException({
                statusCode: 401,
                message: 'Invalid or expired token.',
            });
        }
    }

    @MessagePattern('itm-groups-all')
    async findAll(
        @Payload() data: { authorization: string }
    ): Promise<any> {
        const { authorization } = data;

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
            };
            return this.systemUsersService.findAll(decodedToken.UserId);
        } catch (error) {
            throw new RpcException({
                statusCode: 401,
                message: 'Invalid or expired token.',
            });
        }
    }



    @MessagePattern('itm-menu')
    async createMenu(
        @Payload() data: { records: TCAMenusWEB, authorization: string }
    ): Promise<any> {
        const { records, authorization } = data;

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
            };


            return this.systemUsersService.createMenu(decodedToken.UserId, records);


        } catch (error) {
            throw new RpcException({
                statusCode: 401,
                message: 'Invalid or expired token.',
            });
        }

    }
    @MessagePattern('itm-root-menu')
    async createRootMenu(
        @Payload() data: { records: TCARootMenusWEB, authorization: string }
    ): Promise<any> {
        const { records, authorization } = data;

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
            };


            return this.systemUsersService.createRootMenu(decodedToken.UserId, records);


        } catch (error) {
            throw new RpcException({
                statusCode: 401,
                message: 'Invalid or expired token.',
            });
        }
    }

    @MessagePattern('itm-root-menu-all')
    async findAllRootMenu(
        @Payload() data: { filter: Record<string, any>, languageSeq: number }
    ) {
        const { filter, languageSeq } = data
        return this.systemUsersService.findAllRootMenu(filter, languageSeq);
    }
    @MessagePattern('itm-menu-all')
    async findAllMenu(
        @Payload() data: { filter: Record<string, any>, languageSeq: number }
    ) {
        const { filter, languageSeq } = data
        return this.systemUsersService.findAllMenu(filter, languageSeq);
    }

    @MessagePattern('root-menus-not-in-role')
    async getRootMenusNotInRole(@Payload() data: { groupId: number }): Promise<TCARootMenusWEB[]> {
        const { groupId } = data
        if (!groupId) {
            throw new NotFoundException('GroupId is required');
        }

        return await this.systemUsersService.getRootMenusNotInRole(groupId);
    }




    @MessagePattern('menus-not-in-role')
    async getMenusNotInRole(
        @Payload() data: { groupId: number }
    ): Promise<TCAMenusWEB[]> {
        const { groupId } = data
        if (!groupId) {
            throw new NotFoundException('GroupId is required');
        }

        return await this.systemUsersService.getMenusNotInRole(groupId);
    }
    @MessagePattern('users-not-in-role')
    async getUsersNotInRole(@Payload() data: { groupId: number }): Promise<CreateResUsersDto[]> {
        const { groupId } = data
        if (!groupId) {
            throw new NotFoundException('GroupId is required');
        }

        return await this.systemUsersService.getUsersNotInRole(groupId);
    }


    @MessagePattern('itm-roles-root-menus')
    async createRolesRootMenus(
        @Payload() data: { rootMenuIds: number[], groupId: number, type: string, authorization: string }
    ): Promise<any> {
        const { rootMenuIds, groupId, type, authorization } = data;

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
            };


            return this.systemUsersService.createRolesRootMenu(decodedToken.UserId, rootMenuIds, groupId, type);

        } catch (error) {
            throw new RpcException({
                statusCode: 401,
                message: 'Invalid or expired token.',
            });
        }
    }
    @MessagePattern('itm-roles-menus')
    async createRolesMenus(
        @Payload() data: { menuIds: number[], groupId: number, type: string, authorization: string }
    ): Promise<any> {

        const { menuIds, groupId, type, authorization } = data;

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
            };


            return this.systemUsersService.createRolesMenu(decodedToken.UserId, menuIds, groupId, type);

        } catch (error) {
            throw new RpcException({
                statusCode: 401,
                message: 'Invalid or expired token.',
            });
        }

    }
    @MessagePattern('itm-roles-users')
    async createRolesUsers(
        @Payload() data: { userIds: string[], groupId: number, type: string, authorization: string }
    ): Promise<any> {
        const { userIds, groupId, type, authorization } = data;

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
            };


            return this.systemUsersService.createRolesUsers(decodedToken.UserId, userIds, groupId, type);

        } catch (error) {
            throw new RpcException({
                statusCode: 401,
                message: 'Invalid or expired token.',
            });
        }

    }


    /* roles-paginated?groupId=3&type=rootmenu&page=1&limit=5 */
    @MessagePattern('roles-paginated-root-menu')
    async getPaginatedRoles(
        @Payload() data: { groupId: number, type: string, page: number, limit: number, authorization: string }
    ): Promise<any> {
        try {
            const { groupId, type, page, limit } = data;

            if (!groupId || !type) {
                return {
                    success: true,
                    message: 'No data found due to missing parameters',
                    data: [],
                    total: 0,
                    totalPages: 0,
                    currentPage: page,
                };
            }

            const result = await this.systemUsersService.getPaginatedRootMenuRolesWithLabelsRaw(
                groupId,
                type,
                page,
                limit,
            );

            return {
                success: true,
                message: 'Data retrieved successfully',
                data: result.data,
                total: result.total,
                totalPages: result.totalPages,
                currentPage: page,
            };

        } catch (error) {
            return {
                success: false,
                message: error.message || 'Error fetching data',
            };
        }
    }

    @MessagePattern('roles-paginated-menu')
    async getPaginatedMenuRolesWithLabelsRaw(
        @Payload() data: { groupId: number, type: string, page: number, limit: number, authorization: string }
    ): Promise<any> {
        try {
            const { groupId, type, page, limit } = data;

            if (!groupId || !type) {
                return {
                    success: true,
                    message: 'No data found due to missing parameters',
                    data: [],
                    total: 0,
                    totalPages: 0,
                    currentPage: page,
                };
            }

            const result = await this.systemUsersService.getPaginatedMenuRolesWithLabelsRaw(
                groupId,
                type,
                page,
                limit,
            );

            return {
                success: true,
                message: 'Data retrieved successfully',
                data: result.data,
                total: result.total,
                totalPages: result.totalPages,
                currentPage: page,
            };

        } catch (error) {
            return {
                success: false,
                message: error.message || 'Error fetching data',
            };
        }
    }
    @MessagePattern('roles-paginated-users')
    async getPaginatedUserRolesWithLabelsRaw(
        @Payload() data: { groupId: number, type: string, page: number, limit: number, authorization: string }
    ): Promise<any> {
        try {
            const { groupId, type, page, limit } = data;

            if (!groupId || !type) {
                return {
                    success: true,
                    message: 'No data found due to missing parameters',
                    data: [],
                    total: 0,
                    totalPages: 0,
                    currentPage: page,
                };
            }

            const result = await this.systemUsersService.getPaginatedUserRolesWithLabelsRaw(
                groupId,
                type,
                page,
                limit,
            );

            return {
                success: true,
                message: 'Data retrieved successfully',
                data: result.data,
                total: result.total,
                totalPages: result.totalPages,
                currentPage: page,
            };

        } catch (error) {
            return {
                success: false,
                message: error.message || 'Error fetching data',
            };
        }
    }

    @MessagePattern('update/roles-user')
    async updateRoles(
        @Payload() data: { updateData: UpdateRoleDto[], authorization: string }
    ) {
        const { updateData } = data;
        return this.systemUsersService.updateRoles(updateData);
    }

    @MessagePattern('delete/roles-user')
    async deleteRoles(
        @Payload() data: { ids: number[], authorization: string }): Promise<any> {
        const { ids } = data;
        return await this.systemUsersService.deleteRolesByIds(ids);
    }

    @MessagePattern('delete/groups')
    async deleteGroups(@Payload() data: { ids: number[], authorization: string }): Promise<any> {
        const { ids } = data;
        return await this.systemUsersService.deleteGroupsByIds(ids);
    }

    @MessagePattern('delete/menus')
    async deleteMenus(@Payload() data: { ids: number[], authorization: string }): Promise<any> {
        const { ids } = data;
        return await this.systemUsersService.deleteMennusByIds(ids);
    }
    @MessagePattern('delete/root-menu')
    async deleteRootMenus(@Payload() data: { ids: number[], authorization: string }): Promise<any> {
        const { ids } = data;
        return await this.systemUsersService.deleteRootMenusByIds(ids);
    }



    @MessagePattern('sys-menu-submenu-all')
    async findSubmenus(
        @Payload() data: { languageSeq: number, authorization: string }
    ): Promise<SimpleQueryResult> {

        const { languageSeq, authorization } = data;

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
            };


            return this.systemUsersService.findSubmenus(languageSeq);

        } catch (error) {
            throw new RpcException({
                statusCode: 401,
                message: 'Invalid or expired token.',
            });
        }

    }



    @MessagePattern('add-role-group-users')
    async addMultiplerRoleUsers(
        @Payload() data: { payload: any, authorization: string }
    ): Promise<SimpleQueryResult> {
        const { payload, authorization } = data;
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
            };

            const result = await this.systemUsersService.addMultiplerRoleUsers(
                payload
            );
            return {
                success: true,
                message: result.message,
                data: result.data,
            };
        } catch (error) {

            throw new RpcException({
                statusCode: 401,
                message: 'Invalid or expired token.',
            });
        }
    }

    @MessagePattern('update-role-group-users')
    async updateMultipleRoleUsers(
        @Payload() data: { records: any[], authorization: string }
    ): Promise<SimpleQueryResult> {
        const { records, authorization } = data;
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
            };

            const result = await this.systemUsersService.updateMultipleRoleUsers(records);
            return {
                success: true,
                message: result.message,
                data: result.data,
            };
        } catch (error) {

            throw new RpcException({
                statusCode: 401,
                message: 'Invalid or expired token.',
            });
        }
    }




    @MessagePattern('delete-role-group')
    async deleteMultipleRoleGroup(
        @Payload() data: { ids: number[], authorization: string }
    ): Promise<any> {
        const { ids, authorization } = data;
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
                UserId: any;
                EmpSeq: any;
                UserSeq: any;
                CompanySeq: any;
            };
            const user = await this.databaseService.checkAuthUserSeq(decodedToken.UserSeq);
            if (!user) {
                throw new RpcException({
                    statusCode: 401,
                    message: 'Invalid or expired token.',
                });
            }

            const result = await this.systemUsersService.deleteMultipleRoleGroup(ids);
            if (result.success) {
                return {
                    success: true,
                    message: result.message,
                };
            } else {
                return {
                    success: false,
                    message: result.message,
                };
            }
        } catch (error) {
            throw new RpcException({
                statusCode: 401,
                message: 'Invalid or expired token.',
            });
        }
    }



    @MessagePattern('delete-role-sys')
    async deleteRoleSys(
        @Payload() data: { ids: number[], authorization: string }
    ): Promise<any> {
        const { ids, authorization } = data;
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
                UserId: any;
                EmpSeq: any;
                UserSeq: any;
                CompanySeq: any;
            };
            const user = await this.databaseService.checkAuthUserSeq(decodedToken.UserSeq);
            if (!user) {
                throw new RpcException({
                    statusCode: 401,
                    message: 'Invalid or expired token.',
                });
            }

            const result = await this.systemUsersService.deleteRolesIds(ids);
            if (result.success) {
                return {
                    success: true,
                    message: result.message,
                };
            } else {
                return {
                    success: false,
                    message: result.message,
                };
            }
        } catch (error) {
            throw new RpcException({
                statusCode: 401,
                message: 'Invalid or expired token.',
            });
        }
    }

}
