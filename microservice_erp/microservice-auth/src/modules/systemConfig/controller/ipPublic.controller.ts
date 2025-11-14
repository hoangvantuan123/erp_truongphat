import { Controller } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { PublicIPsService } from '../service/ipPublic.service';
import { MetadataResponse } from '../interface/response';
import { PublicIPRequest } from '../interface/request';
import { jwtConstants } from 'src/config/security.config';

import { Observable, from, catchError, map, of } from 'rxjs';
@Controller()
export class PublicIPController {
    constructor(private readonly publicIPsService: PublicIPsService) { }

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




    @GrpcMethod('PublicIPService', 'getPublicIP')
    findAllERPPublicIPs(request: PublicIPRequest): Observable<MetadataResponse> {
        return this.handleGrpcRequest(request, this.publicIPsService.findAllERPPublicIPs.bind(this.publicIPsService));
    }
    @GrpcMethod('PublicIPService', 'addPublicIP')
    addPublicIP(request: PublicIPRequest): Observable<MetadataResponse> {
        return this.handleGrpcRequest(request, this.publicIPsService.addPublicIP.bind(this.publicIPsService));
    }
    @GrpcMethod('PublicIPService', 'updatePublicIP')
    updatePublicIP(request: PublicIPRequest[]): Observable<MetadataResponse> {

        return this.handleGrpcRequest(request, this.publicIPsService.updatePublicIP.bind(this.publicIPsService));
    }
    @GrpcMethod('PublicIPService', 'deletePublicIP')
    deletePublicIP(request: PublicIPRequest[]): Observable<MetadataResponse> {
        return this.handleGrpcRequest(request, this.publicIPsService.deletePublicIP.bind(this.publicIPsService));
    }

}
