import { Controller, Get, Query, Post, Body, Req, UnauthorizedException, HttpException, HttpStatus } from '@nestjs/common';
import { SimpleQueryResult } from 'src/common/interfaces/simple-query-result.interface';
import { Request } from 'express';
import { jwtConstants } from 'src/config/security.config';
import * as jwt from 'jsonwebtoken';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CustomersService } from '../service/customers.service';
@Controller()
export class CustomersController {
    constructor(private readonly customerService: CustomersService) { }


    @MessagePattern('search-by')
    async searchBy(
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

            return this.customerService.searchPage(result, decodedToken.CompanySeq, 6, decodedToken.UserSeq);
        } catch (error) {
            throw new UnauthorizedException('You do not have permission to access this API.');
        }

    }

    @MessagePattern('created-by')
    async AutoCheckA(
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

            return this.customerService.createdOrUpdateCustomers(result, decodedToken.CompanySeq, decodedToken.UserSeq, 'A');
        } catch (error) {
            throw new UnauthorizedException('You do not have permission to access this API.');
        }

    }

    @MessagePattern('updated-by')
    async UpdateBy(
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

            return this.customerService.createdOrUpdateCustomers(result, decodedToken.CompanySeq, decodedToken.UserSeq, 'U');
        } catch (error) {
            throw new UnauthorizedException('You do not have permission to access this API.');
        }
    }
    @MessagePattern('delete-by')
    async AutoCheckD(
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

            return this.customerService.AutoCheckD(result, decodedToken.CompanySeq, decodedToken.UserSeq);
        } catch (error) {
            throw new UnauthorizedException('You do not have permission to access this API.');
        }

    }

    @MessagePattern('get-master')
    async GetNasterInfo(
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

            return this.customerService.getMasterInfo(result, decodedToken.CompanySeq, decodedToken.UserSeq);
        } catch (error) {
            throw new UnauthorizedException('You do not have permission to access this API.');
        }

    }

    @MessagePattern('get-cust-add-info')
    async GetCustAddInfo(
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

            return this.customerService.getCustAddInfo(result, decodedToken.CompanySeq, decodedToken.UserSeq);
        } catch (error) {
            throw new UnauthorizedException('You do not have permission to access this API.');
        }

    }

    @MessagePattern('get-cust-kind')
    async GetCustKindInfo(
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

            return this.customerService.getCustKindInfo(result, decodedToken.CompanySeq, decodedToken.UserSeq);
        } catch (error) {
            throw new UnauthorizedException('You do not have permission to access this API.');
        }

    }

    @MessagePattern('get-bank-info')
    async GetCustBankInfo(
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

            return this.customerService.getCustBankInfo(result, decodedToken.CompanySeq, decodedToken.UserSeq);
        } catch (error) {
            throw new UnauthorizedException('You do not have permission to access this API.');
        }

    }

    @MessagePattern('get-cust-remark')
    async GetCustRemark(
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

            return this.customerService.getCustRemarkQuery(result, decodedToken.CompanySeq, decodedToken.UserSeq);
        } catch (error) {
            throw new UnauthorizedException('You do not have permission to access this API.');
        }

    }


}
