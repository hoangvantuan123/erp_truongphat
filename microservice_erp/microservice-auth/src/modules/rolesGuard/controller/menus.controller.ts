import {
    Controller,
    Post,
    Body,
    Req,
    UnauthorizedException,
} from '@nestjs/common';
import { MenusService } from '../service/menu.service';
import { TCAMenusWEB } from '../entities/menus.entity';
import { Request } from 'express';
import { jwtConstants } from 'src/config/security.config';
import * as jwt from 'jsonwebtoken';
import { SimpleQueryResult } from 'src/common/interfaces/simple-query-result.interface';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RpcException } from '@nestjs/microservices';
@Controller()
export class MenusController {
    constructor(private readonly menusService: MenusService) { }

    @MessagePattern('add-menus')
    async addBatch(
        @Payload() data: { records: TCAMenusWEB[], authorization: string }
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


            return this.menusService.addMultipleMenu(records);


        } catch (error) {
             throw new RpcException({
                statusCode: 401,
                message: 'Invalid or expired token.',
            });
        }
    }


    @MessagePattern('update-menus')
    async updateBatch(
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

            return this.menusService.updateMultipleMenu(records);

        } catch (error) {
            throw new RpcException({
                statusCode: 401,
                message: 'Invalid or expired token.',
            });
        }
    }


    @MessagePattern('search-menus')
    async searchMenus(
        @Payload() data: { searchValue: string, searchFields: string[], authorization: string }
    ) {
        const { searchValue, searchFields, authorization } = data;

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
            return this.menusService.searchMenus(searchValue, searchFields);
        } catch (error) {
             throw new RpcException({
                statusCode: 401,
                message: 'Invalid or expired token.',
            });
        }
    }
}
