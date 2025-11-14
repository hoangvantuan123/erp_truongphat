import {
    Controller,
    Post,
    Body,
    Req,
    UnauthorizedException,
} from '@nestjs/common';
import { RootMenusService } from '../service/rootMenus.service';
import { TCARootMenusWEB } from '../entities/rootMenus.entity';
import { Request } from 'express';
import { jwtConstants } from 'src/config/security.config';
import * as jwt from 'jsonwebtoken';
import { SimpleQueryResult } from 'src/common/interfaces/simple-query-result.interface';
const pendingRequests = {};
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RpcException } from '@nestjs/microservices';
@Controller()
export class RootMenusController {
    private readonly ongoingRequests = new Map<string, NodeJS.Timeout>();
    constructor(private readonly rootMenusService: RootMenusService) { }

    @MessagePattern('add-root-menus')
    async addBatch(
        @Payload() data: { records: TCARootMenusWEB[], authorization: string }
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


            return this.rootMenusService.addMultipleRootMenu(records);

        } catch (error) {
             throw new RpcException({
                statusCode: 401,
                message: 'Invalid or expired token.',
            });
        }
    }


    @MessagePattern('update-root-menus')
    async updateBatch(

        @Payload() data: { records: TCARootMenusWEB[], authorization: string }
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



            return this.rootMenusService.updateMultipleRootMenu(records);
        } catch (error) {
             throw new RpcException({
                statusCode: 401,
                message: 'Invalid or expired token.',
            });
        }
    }


    @MessagePattern('search-root-menus')
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


            return this.rootMenusService.searchRootMenus(searchValue, searchFields);
        } catch (error) {
             throw new RpcException({
                statusCode: 401,
                message: 'Invalid or expired token.',
            });
        }
    }

}
