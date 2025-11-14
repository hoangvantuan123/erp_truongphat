import { Controller, Get, Query, Post, Body, Req, UnauthorizedException, HttpException, HttpStatus } from '@nestjs/common';
import { MatWHStockInService } from '../service/matWHStockIn.service';
import { SimpleQueryResult } from 'src/common/interfaces/simple-query-result.interface';
import { jwtConstants } from 'src/config/security.config';
import * as jwt from 'jsonwebtoken';
import { Request } from 'express';
import { RpcException } from '@nestjs/microservices';
import { MessagePattern, Payload } from '@nestjs/microservices';
@Controller()
export class MatWHStockInController {
    constructor(private readonly matWHStockInService: MatWHStockInService) { }


    @MessagePattern('itm-spd-mat-wh-stockin-list')
    async processITMSPDMatWHStockInList(
        @Payload() data: { blSeq: number, blSerl: number }
    ): Promise<SimpleQueryResult> {
        const { blSeq, blSerl } = data;
        const result = await this.matWHStockInService.ITM_SPDMatWHStockInList_WEB(blSeq, blSerl);
        return result;
    }

    /* CHECK ALL STOCKIN */

    @MessagePattern('check-all-procedures-mat-wh-stock-in')
    async checkAllProceduresMatWHStockIn(@Payload() data: { body: any, authorization: string }) {
        const { body, authorization } = data;
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
            const decodedToken = jwt.verify(token, jwtConstants.secret) as { UserId: any, EmpSeq: any, UserSeq: any, CompanySeq: any };

            const { dataSave, xmlDocument, ...otherParams } = body;
            const procedureData = [
                { name: '_SCOMCloseCheck_WEB', xmlDocument: xmlDocument.xmlSCOMCloseCheckWEB, serviceSeq: 2639 },
                { name: '_SCOMCloseItemCheck_WEB', xmlDocument: xmlDocument.xmlSCOMCloseItemCheckWEB, serviceSeq: 2639 },
                { name: '_SLGInOutDailyCheck_WEB', xmlDocument: xmlDocument.xmlInOutDailyCheckWEB, serviceSeq: 2619 },
                { name: '_SLGInOutDailyItemCheck_WEB', xmlDocument: xmlDocument.xmlInOutDailyItemCheckWEB, serviceSeq: 2619 },
            ];

            const result = await this.matWHStockInService.checkAllProceduresMatWHStockIn(
                procedureData,
                otherParams.xmlFlags,
                otherParams.workingTag,
                otherParams.languageSeq,
                otherParams.pgmSeq,
                dataSave,
                decodedToken
            );
            return result;
        } catch (error) {
            throw new RpcException({
                statusCode: 401,
                message: 'Invalid or expired token.',
            });
        }
    }


}
