import { Controller } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { PublicIPsService } from '../service/ipPublic.service';
import { MetadataResponse } from '../interface/response';
import { PublicIPRequest } from '../interface/request';
import { jwtConstants } from 'src/config/security.config';
import { MailService } from '../service/mail.service';
import { EmailRequest } from '../interface/request';

import { Observable, from, catchError, map, of } from 'rxjs';
@Controller()
export class MailController {
    constructor(private readonly mailService: MailService) { }

    private validateToken(metadata: any): { UserId: number; EmpSeq: number; UserSeq: number; CompanySeq: number } {
        if (!metadata || !metadata["authorization"]) {
            throw new RpcException({ code: 16, message: 'Missing authorization token' });
        }

        const token = metadata["authorization"].split(' ')[1];
        if (!token) {
            throw new RpcException({ code: 16, message: 'Invalid or expired token' });
        }

        try {
            return jwt.verify(token, jwtConstants.secret) as any;
        } catch (error) {
            throw new RpcException({ code: 16, message: 'Invalid or expired token' });
        }
    }

    private handleGrpcRequest(
        request: any,
        serviceMethod: (result: any[], companySeq: number, userSeq: number) => Observable<any>
    ): Observable<MetadataResponse> {
        try {
            const decodedToken = this.validateToken(request.metadata);

            return from(serviceMethod(request.result, decodedToken.CompanySeq, decodedToken.UserSeq)).pipe(
                map(queryResult => {
                    return { status: true, message: "Query successful", data: JSON.stringify(queryResult.data) };
                }),
                catchError(error => {
                    return of({ status: false, message: error.message || 'Internal server error', data: '', errors: JSON.stringify(error.errors) });
                })
            );
        } catch (error) {
            return of({ status: false, message: error.message || 'Internal server error', data: '', errors: JSON.stringify(error.errors) });
        }
    }





    @GrpcMethod('EmailService', 'getEmail')
    getEmail(request: EmailRequest): Observable<MetadataResponse> {
        return this.handleGrpcRequest(request, this.mailService.getEmail.bind(this.mailService));
    }
    @GrpcMethod('EmailService', 'addEmail')
    addEmail(request: EmailRequest): Observable<MetadataResponse> {
        return this.handleGrpcRequest(request, this.mailService.addEmail.bind(this.mailService));
    }
    @GrpcMethod('EmailService', 'updateEmail')
    updateEmail(request: EmailRequest): Observable<MetadataResponse> {
        return this.handleGrpcRequest(request, this.mailService.updateEmail.bind(this.mailService));
    }
    @GrpcMethod('EmailService', 'deleteEmail')
    deleteEmail(request: EmailRequest): Observable<MetadataResponse> {
        return this.handleGrpcRequest(request, this.mailService.deleteEmail.bind(this.mailService));
    }





    @GrpcMethod('EmailService', 'getMailDetails')
    getMailDetails(request: EmailRequest): Observable<MetadataResponse> {
        return this.handleGrpcRequest(request, this.mailService.getMailDetails.bind(this.mailService));
    }
    @GrpcMethod('EmailService', 'addMailDetails')
    addMailDetails(request: EmailRequest): Observable<MetadataResponse> {
        return this.handleGrpcRequest(request, this.mailService.addMailDetails.bind(this.mailService));
    }
    @GrpcMethod('EmailService', 'updateMailDetails')
    updateMailDetails(request: EmailRequest): Observable<MetadataResponse> {
        return this.handleGrpcRequest(request, this.mailService.updateMailDetails.bind(this.mailService));
    }
    @GrpcMethod('EmailService', 'deleteMailDetails')
    deleteMailDetails(request: EmailRequest): Observable<MetadataResponse> {
        return this.handleGrpcRequest(request, this.mailService.deleteMailDetails.bind(this.mailService));
    }
}
