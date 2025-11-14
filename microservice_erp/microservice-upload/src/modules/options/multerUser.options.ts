// src/modules/upload/options/multerUser.options.ts
import { diskStorage } from 'multer';
import * as fs from 'fs';
import * as path from 'path';
import { ConfigService } from '@nestjs/config';

const configService = new ConfigService();

export const generateUserMulterOptions = (field: 'avatar' | 'documents') => {
    const rootPath = configService.get<string>('UPLOAD_USER_PATHS') || './user_files';

    return {
        storage: diskStorage({
            destination: (req, file, cb) => {
                const userId = req.params?.userId || req.body?.userId || 'default';
                const uploadPath = path.join(rootPath, userId, field);

                fs.mkdirSync(uploadPath, { recursive: true });
                cb(null, uploadPath);
            },
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                const ext = path.extname(file.originalname);
                cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
            },
        }),
    };
};
export const generateMulterOptions = (field: 'avatar' | 'documents', rootPath: string) => {

    return {
        storage: diskStorage({
            destination: (req, file, cb) => {
                const id = req.params?.id || req.body?.id || 'default';
                const uploadPath = path.join(rootPath, id, field);

                fs.mkdirSync(uploadPath, { recursive: true });
                cb(null, uploadPath);
            },
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                const ext = path.extname(file.originalname);
                cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
            },
        }),
    };
};
