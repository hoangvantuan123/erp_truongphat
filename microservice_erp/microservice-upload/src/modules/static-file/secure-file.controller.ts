import {
    Controller,
    Get,
    Param,
    Res,
    Req,
    Injectable,
    CanActivate,
    ExecutionContext,
    UseGuards,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { join, normalize } from 'path';
import * as fs from 'fs';
import * as jwt from 'jsonwebtoken';
import { jwtConstants } from 'src/config/security.config';
import { ConfigService } from '@nestjs/config';
import 'dotenv/config';


@Injectable()
class JwtAuthGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const req = context.switchToHttp().getRequest<Request>();
        const res = context.switchToHttp().getResponse<Response>();

        const authHeader = req.headers['authorization'];
        const publicDir = join(__dirname, '..', '..', '..', '..', 'public');

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).sendFile(join(publicDir, '401.html'));
            return false;
        }

        const token = authHeader.split(' ')[1];

        try {
            const decoded = jwt.verify(token, jwtConstants.secret);
            (req as any).user = decoded;
            return true;
        } catch {
            res.status(401).sendFile(join(publicDir, '401.html'));
            return false;
        }
    }
}
  

@Controller('secure-file')
export class SecureFileController {
    private readonly basePath: string;
    private readonly publicDir = join(__dirname, '..', '..', '..',  'public');

    constructor(private readonly configService: ConfigService) {
        this.basePath =
            this.configService.get<string>('FILE_STORAGE_BASE_SYSTEM_TEMP_PATH')
    }

    @Get('system/temp/:userId/:date/:filename')
    getFile(
        @Param('userId') userId: string,
        @Param('date') date: string,
        @Param('filename') filename: string,
        @Res() res: Response,
        @Req() req: Request,
    ) {
        try {
            const rawPath = join(this.basePath, userId, date, filename);
            const filePath = normalize(rawPath);

            if (!filePath.startsWith(normalize(this.basePath))) {
                return res.status(403).sendFile(join(this.publicDir, '403.html'));
            }

            if (!fs.existsSync(filePath)) {
                return res.status(404).sendFile(join(this.publicDir, '404.html'));
            }

            // Trả file
            return res.sendFile(filePath);
        } catch (error) {
            return res.status(500).sendFile(join(this.publicDir, '500.html'));
        }
    }

}
