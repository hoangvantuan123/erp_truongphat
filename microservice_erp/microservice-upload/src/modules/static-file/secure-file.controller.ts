import {
    Controller,
    Get,
    Param,
    Res,
    Req,
    Header,
    HttpCode,
    Options,
  } from '@nestjs/common';
  import { Response, Request } from 'express';
  import { join, normalize } from 'path';
  import * as fs from 'fs';
  import { ConfigService } from '@nestjs/config';
  import { lookup as lookupMime } from 'mime-types';
  import 'dotenv/config';
  
  @Controller('secure-file')
  export class SecureFileController {
    private readonly basePath: string;
    private readonly publicDir = join(__dirname, '..', '..', '..', 'public');
  
    constructor(private readonly configService: ConfigService) {
      this.basePath = this.configService.get<string>('STORAGE_ROOT');
    }
  
    // ===============================
    // OPTIONS – CORS PREFLIGHT
    // ===============================
    @Options('system/temp/:userId/:date/:filename')
    @HttpCode(204)
    handlePreflight(
      @Res() res: Response,
      @Req() req: Request,
    ) {
      const origin = req.headers.origin || '*';
  
      res
        .header('Access-Control-Allow-Origin', origin)
        .header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        .header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        .header('Access-Control-Allow-Credentials', 'true');
  
      return res.send();
    }
  
    // ===============================
    // GET FILE – ALL FILE TYPES
    // ===============================
    @Get('system/temp/:userId/:date/:filename')
    async getFile(
      @Param('userId') userId: string,
      @Param('date') date: string,
      @Param('filename') filename: string,
      @Res() res: Response,
      @Req() req: Request,
    ) {
      try {
        // ===== Build & normalize path
        const rawPath = join(this.basePath, userId, date, filename);
        const filePath = normalize(rawPath);
  
        // ===== CORS
        const origin = req.headers.origin || '*';
        res
          .header('Access-Control-Allow-Origin', origin)
          .header('Access-Control-Allow-Methods', 'GET, OPTIONS')
          .header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
          .header('Access-Control-Allow-Credentials', 'true');
  
        // ===== Security: path traversal
        if (!filePath.startsWith(normalize(this.basePath))) {
          return res
            .status(403)
            .sendFile(join(this.publicDir, '403.html'));
        }
  
        // ===== File exists?
        if (!fs.existsSync(filePath)) {
          return res
            .status(404)
            .sendFile(join(this.publicDir, '404.html'));
        }
  
        // ===== Detect MIME type
        const mimeType =
          lookupMime(filePath) || 'application/octet-stream';
  
        res.setHeader('Content-Type', mimeType);
  
        // ===== Send file
        return res.sendFile(filePath);
      } catch (error) {
        console.error('SecureFileController error:', error);
        return res
          .status(500)
          .sendFile(join(this.publicDir, '500.html'));
      }
    }
  }
  