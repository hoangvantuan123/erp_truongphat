// src/modules/upload/controllers/upload.controller.ts
import {
    Controller,
    Post,
    UploadedFile,
    UploadedFiles,
    UseInterceptors,
    Param,
    Body,
    Req,
    UnauthorizedException
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { generateUserMulterOptions } from 'src/modules/options/multerUser.options';
import { generateMulterOptions } from 'src/modules/options/multerUser.options';
import { UploadUserService } from '../services/uploadUser.service';
import { Express } from 'express';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';
import { jwtConstants } from 'src/config/security.config';
import 'dotenv/config';
const ROOT_ASSET_PATH = process.env.ROOT_ASSET_PATH || '/ERP_CLOUD/asset_files';

@Controller('v4/uploads/user')
export class UploadUserController {
    constructor(private readonly uploadService: UploadUserService) { }


    @Post('avatar/:userId')
    @UseInterceptors(FileInterceptor('file', generateUserMulterOptions('avatar')))
    async uploadAvatar(
        @UploadedFile() file: Express.Multer.File,
        @Param('userId') userId: string,
        @Req() req: Request,
    ) {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            throw new UnauthorizedException('You do not have permission to access this API.');
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            throw new UnauthorizedException('You do not have permission to access this API.');
        }

        try {
            const decodedToken = jwt.verify(token, jwtConstants.secret) as {
                UserId: any;
                EmpSeq: any;
                UserSeq: any;
                CompanySeq: any;
            };

            const { Type, IdSeqAvatar } = req.body;
            const uploadData = {
                UserId: userId,
                Filename: file.filename,
                Originalname: file.originalname,
                Type: Type || 'AVATAR',
                IsAvatar: true,
                Path: file.path.replace(/\\/g, '/'),
                Size: file.size,
                IdxNo: 0,
                CreatedBy: decodedToken.UserSeq,
            };

            const result = await this.uploadService.saveUserFile(uploadData, userId ? Number(userId) : null).toPromise();

            if (result.success) {
                return {
                    success: true,
                    message: 'File uploaded and saved successfully',
                    data: result.data,
                };
            } else {
                return {
                    success: false,
                    message: result.message,
                };
            }
        } catch (error) {
            throw new UnauthorizedException('You do not have permission to access this API.');
        }
    }

    @Post('img/:id')
    @UseInterceptors(FileInterceptor('file', generateMulterOptions('avatar', ROOT_ASSET_PATH)))
    async uploadImg(
        @UploadedFile() file: Express.Multer.File,
        @Param('id') id: string,
        @Req() req: Request,
    ) {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            throw new UnauthorizedException('You do not have permission to access this API.');
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            throw new UnauthorizedException('You do not have permission to access this API.');
        }

        try {
            const decodedToken = jwt.verify(token, jwtConstants.secret) as {
                UserId: any;
                EmpSeq: any;
                UserSeq: any;
                CompanySeq: any;
            };

            const { Type, IdSeqAvatar, IdxNo } = req.body;
            const uploadData = {
                UserId: id,
                Filename: file.filename,
                Originalname: file.originalname,
                Type: Type || 'AVATAR',
                IsAvatar: true,
                Path: file.path.replace(/\\/g, '/'),
                Size: file.size,
                IdxNo: IdxNo || 0,
                CreatedBy: decodedToken.UserSeq,
            };

            const result = await this.uploadService.saveImgFile(uploadData, id ? Number(id) : null, IdSeqAvatar ? Number(IdSeqAvatar) : null).toPromise();

            if (result.success) {
                return {
                    success: true,
                    message: 'File uploaded and saved successfully',
                    data: result.data,
                };
            } else {
                return {
                    success: false,
                    message: result.message,
                };
            }
        } catch (error) {
            throw new UnauthorizedException('You do not have permission to access this API.');
        }
    }


    @Post('documents/:userId')
    @UseInterceptors(FileInterceptor('file', generateUserMulterOptions('documents')))
    async uploadDocuments(
        @UploadedFile() file: Express.Multer.File,
        @Param('userId') userId: string,
        @Req() req: Request,
    ) {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            throw new UnauthorizedException('You do not have permission to access this API.');
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            throw new UnauthorizedException('You do not have permission to access this API.');
        }

        try {
            const decodedToken = jwt.verify(token, jwtConstants.secret) as {
                UserId: any;
                EmpSeq: any;
                UserSeq: any;
                CompanySeq: any;
            };

            const uploadData = {
                UserId: userId,
                Filename: file.filename,
                Originalname: file.originalname,
                Type: 'FILE',
                IsAvatar: true,
                Path: file.path.replace(/\\/g, '/'),
                Size: file.size,
                IdxNo: 0,
                CreatedBy: decodedToken.UserSeq,
            };

            const result = await this.uploadService.handleMultipleUpload(uploadData).toPromise();

            if (result.success) {
                return {
                    success: true,
                    message: 'File uploaded and saved successfully',
                    data: result.data,
                };
            } else {
                return {
                    success: false,
                    message: result.message,
                };
            }
        } catch (error) {
            throw new UnauthorizedException('You do not have permission to access this API.');
        }
    }

    @Post('documents-asset/:id')
    @UseInterceptors(FileInterceptor('file', generateMulterOptions('documents', ROOT_ASSET_PATH)))
    async uploadDocumentsAsset(
        @UploadedFile() file: Express.Multer.File,
        @Param('id') userId: string,
        @Req() req: Request,
    ) {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            throw new UnauthorizedException('You do not have permission to access this API.');
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            throw new UnauthorizedException('You do not have permission to access this API.');
        }

        try {
            const decodedToken = jwt.verify(token, jwtConstants.secret) as {
                UserId: any;
                EmpSeq: any;
                UserSeq: any;
                CompanySeq: any;
            };

            const uploadData = {
                UserId: userId,
                Filename: file.filename,
                Originalname: file.originalname,
                Type: 'FILE_ASSET',
                IsAvatar: true,
                Path: file.path.replace(/\\/g, '/'),
                Size: file.size,
                IdxNo: 0,
                CreatedBy: decodedToken.UserSeq,
            };

            const result = await this.uploadService.handleMultipleUpload(uploadData).toPromise();

            if (result.success) {
                return {
                    success: true,
                    message: 'File uploaded and saved successfully',
                    data: result.data,
                };
            } else {
                return {
                    success: false,
                    message: result.message,
                };
            }
        } catch (error) {
            throw new UnauthorizedException('You do not have permission to access this API.');
        }
    }

}
