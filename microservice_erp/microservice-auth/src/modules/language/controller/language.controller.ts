import {
    Controller,
    Get,
    Query,
    BadRequestException,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { LanguageService } from '../service/language.service';
import { SimpleQueryResult } from 'src/common/interfaces/simple-query-result.interface';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RpcException } from '@nestjs/microservices';
import * as jwt from 'jsonwebtoken';
import { TCADictionarysWeb } from '../entities/dictionary.entity';
import { TCALanguageWeb } from '../entities/language.entity';
import { jwtConstants } from 'src/config/security.config';
import { DatabaseService } from 'src/common/database/sqlServer/ITMV/database.service';
@Controller()
export class LanguageController {
    constructor(private readonly languageService: LanguageService,
        private readonly databaseService: DatabaseService
    ) { }

    @MessagePattern('get-language-data')
    async getLanguageData(@Payload() data: { languageSeq: string, authorization: string }): Promise<any> {
        const { languageSeq, authorization } = data;
        if (!languageSeq) {
            throw new RpcException({
                statusCode: 401,
                message: 'Parameter "languageSeq" is required.',
            });
        }

        const result: SimpleQueryResult = await this.languageService.GetLanguageWeb(languageSeq);
        if (result && result.success) {
            return result.data;
        } else {
            throw new RpcException({
                statusCode: 401,
                message: 'Invalid or expired token.',
            });
        }
    }



    @MessagePattern('find-all-lang-sys')
    async findAllLangSys(
        @Payload() data: { filter: Record<string, any>, authorization: string }
    ) {
        const { filter, authorization } = data;

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

            return this.languageService.findAllLangSys(filter);

        } catch (error) {
            throw new RpcException({
                statusCode: 401,
                message: 'Invalid or expired token.',
            });
        }

    }



    @MessagePattern('find-all-dictionary-sys')
    async findAllDictionary(
        @Payload() data: { filter: Record<string, any>, page: number, date?: string, authorization: string }
    ) {
        const { filter, page, date, authorization } = data; // Lấy pageSize mặc định nếu không truyền
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
            const pageSize = 10000;
            // Gọi service với đủ tham số
            return this.languageService.findAllDictionary(filter, date, page, pageSize);

        } catch (error) {
            throw new RpcException({
                statusCode: 401,
                message: 'Invalid or expired token.',
            });
        }
    }




    @MessagePattern('add-multiple-lang')
    async addBatch(
        @Payload() data: { records: TCALanguageWeb[], authorization: string }
    ): Promise<SimpleQueryResult> {
        const { records, authorization } = data;
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

            return await this.languageService.addMultipleLang(records, decodedToken.UserSeq);


        } catch (error) {
            throw new RpcException({
                statusCode: 401,
                message: 'Invalid or expired token.',
            });
        }
    }


    @MessagePattern('add-multiple-dictionary')
    async addDictionary(
        @Payload() data: { records: TCADictionarysWeb[], authorization: string }
    ): Promise<SimpleQueryResult> {
        const { records, authorization } = data;
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

            return await this.languageService.addMultipleDictionarys(records, decodedToken.UserSeq);

        } catch (error) {
            throw new RpcException({
                statusCode: 401,
                message: 'Invalid or expired token.',
            });
        }
    }
    @MessagePattern('update-dictionarys-sys')
    async updateMultipleDictionarys(
        @Payload() data: { records: any[], authorization: string }
    ): Promise<SimpleQueryResult> {
        const { records, authorization } = data;
        console.log(records)
        console.log(authorization)
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

            return await this.languageService.updateMultipleDictionarys(records, decodedToken.UserSeq);

        } catch (error) {
            console.log('error' ,error)
            throw new RpcException({
                statusCode: 401,
                message: 'Invalid or expired token.',
            });
        }
    }





    @MessagePattern('delete-lang-sys')
    async deleteLangs(
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


            const result = await this.languageService.deleteLangsIds(ids);
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
    @MessagePattern('delete-dict-sys')
    async deleteDictionarysIds(
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


            const result = await this.languageService.deleteDictionarysIds(ids);
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
