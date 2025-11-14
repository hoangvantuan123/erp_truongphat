import { Controller, Get, Query, Post, Body, Req, UnauthorizedException, HttpException, HttpStatus, Delete } from '@nestjs/common';
import { SimpleQueryResult } from 'src/common/interfaces/simple-query-result.interface';
import { StockOutService } from '../service/stockOut.service';
import { jwtConstants } from 'src/config/security.config';
import * as jwt from 'jsonwebtoken';
import { Request } from 'express';
import { RpcException } from '@nestjs/microservices';
import { MessagePattern, Payload } from '@nestjs/microservices';
@Controller()
export class StockOutController {
    constructor(private readonly stockOutService: StockOutService) { }


    @MessagePattern('sp-dmm-out-req-list')
    async processSPDMMOutReqListQueryWeb(
        @Payload() data: { body: any, authorization: string }
    ): Promise<SimpleQueryResult> {

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

            const {
                xmlDocument,
                xmlFlags,
                serviceSeq,
                workingTag,
                languageSeq,
                pgmSeq,
            } = body;
            return this.stockOutService._SPDMMOutReqListQuery_Web(
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

    @MessagePattern('itm-spd-mm-out-req-item-list')
    async processITMSPDMMOutReqItemListWEB(

        @Payload() data: { outReqSeq: string, authorization: string }
    ): Promise<SimpleQueryResult> {
        const { outReqSeq, authorization } = data;
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

            const result = await this.stockOutService.ITM_SPDMMOutReqItemList_WEB(outReqSeq);
            return result;
        } catch (error) {
            throw new RpcException({
                statusCode: 401,
                message: 'Invalid or expired token.',
            });
        }

    }



    @MessagePattern('smaterial-qr-check-stock-out-web')
    async processSMaterialQRStockOutCheckWEB(
        @Payload() data: { body: any, authorization: string }
    ): Promise<SimpleQueryResult> {
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
        const {
            xmlDocument,
            xmlFlags,
            serviceSeq,
            workingTag,
            companySeq,
            languageSeq,
            pgmSeq,
        } = body;


        if (!token) {
            throw new RpcException({
                statusCode: 401,
                message: 'Invalid or expired token.',
            });
        }

        try {
            const decodedToken = jwt.verify(token, jwtConstants.secret) as { UserId: any, EmpSeq: any, UserSeq: any, CompanySeq: any };


            return await this.stockOutService._SMaterialQRStockOutCheck_WEB(
                xmlDocument,
                xmlFlags,
                serviceSeq,
                workingTag,
                languageSeq,
                pgmSeq,
                decodedToken
            );
        } catch (error) {
            throw new RpcException({
                statusCode: 401,
                message: 'Invalid or expired token.',
            });
        }
    }




    @MessagePattern('check-all-procedures-stock-out-fifo')
    async checkAllProceduresStockIn(
        @Payload() data: { body: any, authorization: string }) {
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

            const { checkValueIsStop, outReqSeq, dataSave, xmlDocument, ...otherParams } = body;
            const procedureData = [
                { name: '_SCOMCloseCheck_WEB', xmlDocument: xmlDocument.xmlSCOMCloseCheckWEB, serviceSeq: 2639 },
                { name: '_SCOMCloseItemCheck_WEB', xmlDocument: xmlDocument.xmlSCOMCloseItemCheckWEB, serviceSeq: 2639 },
                { name: '_SPDMMOutProcCheck_WEB', xmlDocument: xmlDocument.xmlSPDMMOutProcCheckWEB, serviceSeq: 3033 },
                { name: '_SPDMMOutProcItemCheck_WEB', xmlDocument: xmlDocument.xmlSPDMMOutProcItemCheckWEB, serviceSeq: 3033 },
            ];
            const result = await this.stockOutService.checkAllProceduresStockOutFiFo(
                procedureData,
                otherParams.xmlFlags,
                otherParams.workingTag,
                otherParams.languageSeq,
                otherParams.pgmSeq,
                checkValueIsStop,
                outReqSeq,
                dataSave,
                decodedToken
            );

            return result;
        } catch (error) {
            throw new HttpException(
                { message: error.message || 'Internal Server Error' },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }





    @MessagePattern('items-tfifo-list-temp')
    async deleteItems(
        @Payload() data: { items: { ItemSeq: string; ItemLotNo: string }[], body: any, authorization: string }
    ): Promise<{ success: boolean }> {
        const { items, authorization } = data;
        try {
            await this.stockOutService.deleteTFIFOListTemp(items);
            return { success: true };
        } catch (error) {
            console.error('Error during delete operation:', error);
            return { success: false };
        }
    }


}
