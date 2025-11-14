import {
    Body,
    Controller,
    Get,
    ParseFilePipeBuilder,
    Post,
    UploadedFile,
    UseInterceptors,
    UploadedFiles,
    UnauthorizedException,
    Req,
    Param,
    Res,
    HttpStatus,
    Query,
    Delete
} from '@nestjs/common';
import { Response, Express, Request } from 'express';
import * as jwt from 'jsonwebtoken';
import { PrintPdmmOutExtraService } from '../services/printPdmmOutExtra.service';
import { jwtConstants } from 'src/config/security.config';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

@Controller('v4/print')
export class PdmmOutExtraController {
    constructor(private readonly printPdmmOutExtraService: PrintPdmmOutExtraService) { }

    @Post('Print-Pdmm-Out-Extra')
    generateInvoice(@Req() req: Request, @Body() result: any): Observable<any> {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return throwError(() => new UnauthorizedException('You do not have permission to access this API.'));
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            return throwError(() => new UnauthorizedException('You do not have permission to access this API.'));
        }

        return of(jwt.verify(token, jwtConstants.secret) as {
            UserId: any;
            EmpSeq: any;
            UserSeq: any;
            CompanySeq: any;
        }).pipe(
            switchMap((decodedToken) =>
                this.printPdmmOutExtraService._executeSPDMMQueries(result.result, decodedToken.CompanySeq, decodedToken.UserSeq)
            ),
            catchError((error) => {
                return throwError(() => error);
            })
        );
    }

}
