import { Controller, Get, Query, Post, Body, Req, UnauthorizedException, HttpException, HttpStatus, Delete } from '@nestjs/common';
import { SimpleQueryResult } from 'src/common/interfaces/simple-query-result.interface';
import { StockDetailListService } from '../service/stockDetailList.service';
import { jwtConstants } from 'src/config/security.config';
import * as jwt from 'jsonwebtoken';
import { Request } from 'express';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class StockDetailListController {
    constructor(private readonly stockListService: StockDetailListService) { }


    @MessagePattern('slg-wh-stock-detail-list-query')
    async SLGWHStockDetailListQueryWEB(
                @Payload() data: { result: any[], authorization: string }
                    ): Promise<SimpleQueryResult> {
                        const { result, authorization } = data;
                        if (!authorization) {
                            throw new UnauthorizedException('You do not have permission to access this API.');
                        }
                        const token = authorization.split(' ')[1];
                        if (!token) {
                            throw new UnauthorizedException('You do not have permission to access this API.');
                        }
                try {
                    const decodedToken = jwt.verify(token, jwtConstants.secret) as { UserId: any, EmpSeq: any, UserSeq: any, CompanySeq: any };
        
                    return this.stockListService.SLGWHStockDetailListQueryWEB(result, decodedToken.CompanySeq, decodedToken.UserSeq, 1492) ;
                } catch (error) {
                    throw new UnauthorizedException('You do not have permission to access this API.');
                }
        
            }

}
