import { Controller, Get, Query, Post, Body, Req, UnauthorizedException, HttpException, HttpStatus } from '@nestjs/common';
import { SimpleQueryResult } from 'src/common/interfaces/simple-query-result.interface';
import { DeliveryListService } from '../service/deliveryList.service';
import { Request } from 'express';
import { jwtConstants } from 'src/config/security.config';
import * as jwt from 'jsonwebtoken';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RpcException } from '@nestjs/microservices';
@Controller()
export class DeliveryListController {
    constructor(private readonly deliverryService: DeliveryListService) { }

    @MessagePattern('itm-sug-get-active-delivery-web')
    async convertDC(
        @Payload() data: { fromDate: string, toDate: string, deliveryNo: string, bizUnit: number, authorization: string }
    ): Promise<SimpleQueryResult> {


        const { fromDate, toDate, deliveryNo, bizUnit, authorization } = data;
        if (!authorization) {
            throw new UnauthorizedException(
                'You do not have permission to access this API.',
            );
        }
        const token = authorization.split(' ')[1];


        if (!token) {
             throw new RpcException({
                statusCode: 401,
                message: 'Invalid or expired token.',
            });
        }

        try {
            const decodedToken = jwt.verify(token, jwtConstants.secret) as { UserId: any, EmpSeq: any, UserSeq: any, CompanySeq: any };

            const result = await this.deliverryService.ITM_SUGGetActiveDelivery_WEB(fromDate, toDate, deliveryNo, bizUnit);
            return result;
        } catch (error) {
             throw new RpcException({
                statusCode: 401,
                message: 'Invalid or expired token.',
            });
        }
    }

}
