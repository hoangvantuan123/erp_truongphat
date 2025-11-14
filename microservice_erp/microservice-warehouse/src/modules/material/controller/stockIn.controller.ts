import { Controller, Get, Query, Post, Body, Req, UnauthorizedException, HttpException, HttpStatus } from '@nestjs/common';
import { StockInService } from '../service/stockIn.service';
import { SimpleQueryResult } from 'src/common/interfaces/simple-query-result.interface';
import { Request } from 'express';
import { jwtConstants } from 'src/config/security.config';
import * as jwt from 'jsonwebtoken';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RpcException } from '@nestjs/microservices';
@Controller()
export class EmployeeController {
    constructor(private readonly stockInService: StockInService) { }

    @MessagePattern('convert-dc')
    async convertDC(
        @Payload() data: { itemNo: string, prodDate1: string, inDate1: string }
    ): Promise<SimpleQueryResult> {
        const { itemNo, prodDate1, inDate1 } = data;
        const result = await this.stockInService.ITM_SConvertDC(itemNo, prodDate1, inDate1);
        return result;
    }


    @MessagePattern('itm-sug-get-active-delivery-item')
    async processITMSUGGetActiveDeliveryItem(
        @Payload() data: { deliverySeq: number, purchaseType: string, }
    ): Promise<SimpleQueryResult> {
        const { deliverySeq, purchaseType } = data;
        const result = await this.stockInService.ITM_SUGGetActiveDeliveryItem(deliverySeq, purchaseType);
        return result;
    }


    @MessagePattern('smaterial-qr-check-web')
    async processSMaterialQRCheckWeb(
        @Payload() data: { body: any, authorization: string }
    ): Promise<SimpleQueryResult> {
        const { body, authorization } = data;
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


            const {
                xmlDocument,
                xmlFlags,
                serviceSeq,
                workingTag,
                companySeq,
                languageSeq,
                userSeq,
                pgmSeq,
            } = body;
            return this.stockInService._SMaterialQRCheck_WEB(
                xmlDocument,
                xmlFlags,
                serviceSeq,
                workingTag,
                decodedToken.CompanySeq,
                languageSeq,
                decodedToken.UserSeq,
                pgmSeq,
            );
        } catch (error) {
            throw new RpcException({
                statusCode: 401,
                message: 'Invalid or expired token.',
            });
        }
    }


    @MessagePattern('scom-close-check-web')
    async processSCOMCloseCheckWEB(
        @Payload() data: { body: any }
    ): Promise<SimpleQueryResult> {
        const { body } = data;
        const {
            xmlDocument,
            xmlFlags,
            serviceSeq,
            workingTag,
            companySeq,
            languageSeq,
            userSeq,
            pgmSeq,
        } = body;
        return this.stockInService._SCOMCloseCheck_WEB(
            xmlDocument,
            xmlFlags,
            serviceSeq,
            workingTag,
            companySeq,
            languageSeq,
            userSeq,
            pgmSeq,
        );
    }

    @MessagePattern('scom-close-item-check-web')
    async processSCOMCloseItemCheckWEB(
        @Payload() data: { body: any, authorization: string }): Promise<SimpleQueryResult> {
        const { body, authorization } = data;
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


            const {
                xmlDocument,
                xmlFlags,
                serviceSeq,
                workingTag,
                companySeq,
                languageSeq,
                userSeq,
                pgmSeq,
            } = body;
            return this.stockInService._SCOMCloseItemCheck_WEB(
                xmlDocument,
                xmlFlags,
                serviceSeq,
                workingTag,
                companySeq,
                languageSeq,
                decodedToken.UserSeq,
                pgmSeq,
            );
        } catch (error) {
            throw new RpcException({
                statusCode: 401,
                message: 'Invalid or expired token.',
            });
        }
    }
    @MessagePattern('ssl-imp-delv-master-check-web')
    async processSSLImpDelvMasterCheckWEB(@Payload() data: { body: any }): Promise<SimpleQueryResult> {
        const { body } = data;
        const {
            xmlDocument,
            xmlFlags,
            serviceSeq,
            workingTag,
            companySeq,
            languageSeq,
            userSeq,
            pgmSeq,
        } = body;
        return this.stockInService._SSLImpDelvMasterCheck_WEB(
            xmlDocument,
            xmlFlags,
            serviceSeq,
            workingTag,
            companySeq,
            languageSeq,
            userSeq,
            pgmSeq,
        );
    }
    @MessagePattern('ssl-imp-delv-sheet-check-web')
    async processSSLImpDelvSheetCheckWEB(@Payload() data: { body: any }): Promise<SimpleQueryResult> {
        const { body } = data;
        const {
            xmlDocument,
            xmlFlags,
            serviceSeq,
            workingTag,
            companySeq,
            languageSeq,
            userSeq,
            pgmSeq,
        } = body;
        return this.stockInService._SSLImpDelvSheetCheck_WEB(
            xmlDocument,
            xmlFlags,
            serviceSeq,
            workingTag,
            companySeq,
            languageSeq,
            userSeq,
            pgmSeq,
        );
    }

    /* CHECK ALL STOCKIN */

    @MessagePattern('check-all-procedures-stock-in')
    async checkAllProceduresStockIn(@Payload() data: { body: any, authorization: string }) {
        const { body, authorization } = data;
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

            const { dataSave, xmlDocument, ...otherParams } = body;
            const procedureData = [
                { name: '_SCOMCloseCheck_WEB', xmlDocument: xmlDocument.xmlForCloseCheck, serviceSeq: 2639 },
                { name: '_SCOMCloseItemCheck_WEB', xmlDocument: xmlDocument.xmlForCloseItemCheck, serviceSeq: 2639 },
                { name: '_SSLImpDelvMasterCheck_WEB', xmlDocument: xmlDocument.xmlForMasterCheck, serviceSeq: 4493 },
                { name: '_SSLImpDelvSheetCheck_WEB', xmlDocument: xmlDocument.xmlForSheetCheck, serviceSeq: 4493 },
                { name: '_SLGLotNoMasterCheck_WEB', xmlDocument: xmlDocument.xmlForLotNoMasterCheck, serviceSeq: 4422 }
            ];
            const result = await this.stockInService.checkAllProceduresStockIn(
                procedureData,
                otherParams.xmlFlags,
                otherParams.workingTag,
                decodedToken.CompanySeq,
                otherParams.languageSeq,
                decodedToken.UserSeq,
                otherParams.pgmSeq,
                dataSave
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
