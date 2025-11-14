import { Injectable } from '@nestjs/common';
import { ClientGrpc, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { MetadataResult } from '../interface/pdmpsProd/pdmpsProdPlanList.interface';
import { PublicIPRequest } from '../interface/auth/publicIP.interface';
import { UsersRequest, GetHelpUserAuthRequest } from '../interface/auth/user.interface';
import { join } from 'path';
import { map, catchError } from 'rxjs/operators';
import 'dotenv/config';
interface PublicIPService {
    addPublicIP(data: { result: PublicIPRequest[]; metadata: Record<string, string> }): Observable<any>;
    updatePublicIP(data: { result: PublicIPRequest[]; metadata: Record<string, string> }): Observable<any>;
    deletePublicIP(data: { result: PublicIPRequest[]; metadata: Record<string, string> }): Observable<any>;
    getPublicIP(data: { result: PublicIPRequest[]; metadata: Record<string, string> }): Observable<any>;
}
interface UsersService {
    addUsers(data: { result: UsersRequest[]; metadata: Record<string, string> }): Observable<any>;
    getHelpUserAuthQuery(data: { result: GetHelpUserAuthRequest[]; metadata: Record<string, string> }): Observable<any>;
    deviceLogsQ(data: { result: any; metadata: Record<string, string> }): Observable<any>;

}

@Injectable()
export class GrpcAuthService {

    private createGrpcClient(): ClientGrpc {
        return ClientProxyFactory.create({
            transport: Transport.GRPC,
            options: {
                url: process.env.HOST_RGPC_AUTH,
                package: ['public_ip', 'auth.user'],
                protoPath: [
                    join(__dirname, '..', '..', '..', '..', '..', 'proto', 'auth', 'systemConfig', 'public_ip.proto'),
                    join(__dirname, '..', '..', '..', '..', '..', 'proto', 'auth', 'user', 'user.proto'),
                ],
                loader: {
                    keepCase: true,
                    longs: String,
                    enums: String,
                    defaults: true,
                    oneofs: true,
                },
                channelOptions: {
                    'grpc.default_compression_algorithm': 2, // Gzip compression
                    'grpc.max_receive_message_length': 1024 * 1024 * 1024,
                    'grpc.max_send_message_length': 1024 * 1024 * 1024,
                    'grpc.max_concurrent_streams': 100, // Allow 100 concurrent requests
                    'grpc.http2.lookahead_bytes': 0, // Performance optimization
                    'grpc.enable_http_proxy': 0, // Disable proxy blocking
                },
            },
        }) as ClientGrpc;
    }

    addPublicIP(result: PublicIPRequest[], metadata: Record<string, string> = {}): Observable<any> {
        const client = this.createGrpcClient();
        const metadataService = client.getService<PublicIPService>('PublicIPService');

        return metadataService.addPublicIP({ result, metadata }).pipe(
            map((grpcResponse) => ({
                success: grpcResponse?.status ?? false,
                message: grpcResponse?.message || 'No message received',
                data: grpcResponse?.data || null,
            })),
            catchError((error) => {
                return new Observable((subscriber) => {
                    subscriber.next({
                        success: false,
                        message: 'Hệ thống đang bận, vui lòng thử lại sau.',
                        errorDetails: error?.message || 'Unknown error',
                    });
                    subscriber.complete();
                });
            })
        );
    }
    updatePublicIP(result: PublicIPRequest[], metadata: Record<string, string> = {}): Observable<any> {
        const client = this.createGrpcClient();
        const metadataService = client.getService<PublicIPService>('PublicIPService');

        return metadataService.updatePublicIP({ result, metadata }).pipe(
            map((grpcResponse) => ({
                success: grpcResponse?.status ?? false,
                message: grpcResponse?.message || 'No message received',
                data: grpcResponse?.data || null,
            })),
            catchError((error) => {
                return new Observable((subscriber) => {
                    subscriber.next({
                        success: false,
                        message: 'Hệ thống đang bận, vui lòng thử lại sau.',
                        errorDetails: error?.message || 'Unknown error',
                    });
                    subscriber.complete();
                });
            })
        );
    }
    deletePublicIP(result: PublicIPRequest[], metadata: Record<string, string> = {}): Observable<any> {
        const client = this.createGrpcClient();
        const metadataService = client.getService<PublicIPService>('PublicIPService');

        return metadataService.deletePublicIP({ result, metadata }).pipe(
            map((grpcResponse) => ({
                success: grpcResponse?.status ?? false,
                message: grpcResponse?.message || 'No message received',
                data: grpcResponse?.data || null,
            })),
            catchError((error) => {
                return new Observable((subscriber) => {
                    subscriber.next({
                        success: false,
                        message: 'Hệ thống đang bận, vui lòng thử lại sau.',
                        errorDetails: error?.message || 'Unknown error',
                    });
                    subscriber.complete();
                });
            })
        );
    }
    getPublicIP(result: PublicIPRequest[], metadata: Record<string, string> = {}): Observable<any> {
        const client = this.createGrpcClient();
        const metadataService = client.getService<PublicIPService>('PublicIPService');

        return metadataService.getPublicIP({ result, metadata }).pipe(
            map((grpcResponse) => ({
                success: grpcResponse?.status ?? false,
                message: grpcResponse?.message || 'No message received',
                data: grpcResponse?.data || null,
            })),
            catchError((error) => {
                return new Observable((subscriber) => {
                    subscriber.next({
                        success: false,
                        message: 'Hệ thống đang bận, vui lòng thử lại sau.',
                        errorDetails: error?.message || 'Unknown error',
                    });
                    subscriber.complete();
                });
            })
        );
    }


    addUsers(result: UsersRequest[], metadata: Record<string, string> = {}): Observable<any> {
        const client = this.createGrpcClient();
        const metadataService = client.getService<UsersService>('UsersService');

        return metadataService.addUsers({ result, metadata }).pipe(
            map((grpcResponse) => ({
                success: grpcResponse?.status ?? false,
                message: grpcResponse?.message || 'No message received',
                data: grpcResponse?.data || null,
            })),
            catchError((error) => {
                return new Observable((subscriber) => {
                    subscriber.next({
                        success: false,
                        message: 'Hệ thống đang bận, vui lòng thử lại sau.',
                        errorDetails: error?.message || 'Unknown error',
                    });
                    subscriber.complete();
                });
            })
        );
    }
    getHelpUserAuthQuery(result: GetHelpUserAuthRequest[], metadata: Record<string, string> = {}): Observable<any> {
        const client = this.createGrpcClient();
        const metadataService = client.getService<UsersService>('UsersService');

        return metadataService.getHelpUserAuthQuery({ result, metadata }).pipe(
            map((grpcResponse) => ({
                success: grpcResponse?.status ?? false,
                message: grpcResponse?.message || 'No message received',
                data: grpcResponse?.data || null,
            })),
            catchError((error) => {
                return new Observable((subscriber) => {
                    subscriber.next({
                        success: false,
                        message: 'Hệ thống đang bận, vui lòng thử lại sau.',
                        errorDetails: error?.message || 'Unknown error',
                    });
                    subscriber.complete();
                });
            })
        );
    }
    deviceLogsQ(result: any, metadata: Record<string, string> = {}): Observable<any> {
        const client = this.createGrpcClient();
        const metadataService = client.getService<UsersService>('UsersService');

        return metadataService.deviceLogsQ({ result, metadata }).pipe(
            map((grpcResponse) => ({
                success: grpcResponse?.status ?? false,
                message: grpcResponse?.message || 'No message received',
                data: grpcResponse?.data || null,
            })),
            catchError((error) => {
                return new Observable((subscriber) => {
                    subscriber.next({
                        success: false,
                        message: 'Hệ thống đang bận, vui lòng thử lại sau.',
                        errorDetails: error?.message || 'Unknown error',
                    });
                    subscriber.complete();
                });
            })
        );
    }
}
