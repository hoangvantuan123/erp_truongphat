import { Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { join } from 'path';
import { map, catchError } from 'rxjs/operators';
import 'dotenv/config';
interface GroupRoleService {


    RoleGroupA(data: { result: any[]; metadata: Record<string, string> }): Observable<any>;
    RoleGroupU(data: { result: any[]; metadata: Record<string, string> }): Observable<any>;
    RoleGroupD(data: { result: any[]; metadata: Record<string, string> }): Observable<any>;
    RoleGroupQ(data: { result: any; metadata: Record<string, string> }): Observable<any>;

}

@Injectable()
export class GrpcGroupRoleService {

    private createGrpcClient(): ClientGrpc {
        return ClientProxyFactory.create({
            transport: Transport.GRPC,
            options: {
                url: process.env.HOST_RGPC_AUTH,
                package: [
                    'auth.roles.group_role'
                ],
                protoPath: [
                    join(__dirname, '..', '..', '..', '..', '..', 'proto', 'auth', 'roles', 'group_role.proto'),
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
                    'grpc.max_receive_message_length': 1024 * 1024 * 1024, // 1 GB
                    'grpc.max_send_message_length': 1024 * 1024 * 1024, // 1 GB
                    'grpc.max_concurrent_streams': 500, // Tăng số lượng yêu cầu đồng thời
                    'grpc.http2.lookahead_bytes': 1024 * 1024, // Tăng số byte của bộ đệm HTTP/2 để tối ưu hiệu suất
                    'grpc.enable_http_proxy': 0, // Tắt proxy blocking
                    'grpc.max_connection_age_ms': 60000, // Tăng thời gian sống của kết nối
                    'grpc.keepalive_time_ms': 30000, // Thời gian giữ kết nối sống
                    'grpc.keepalive_timeout_ms': 20000, // Thời gian chờ kết nối keepalive
                    'grpc.initial_reconnect_backoff_ms': 1000, // Thời gian đợi khi cố gắng kết nối lại
                    'grpc.reconnect_backoff_ms': 1000, // Thời gian đợi khi kết nối lại sau khi mất kết nối
                },
            },
        }) as ClientGrpc;
    }




    RoleGroupA(result: any, metadata: Record<string, string> = {}): Observable<any> {
        const client = this.createGrpcClient();
        const metadataService = client.getService<GroupRoleService>('GroupRoleService');

        return metadataService.RoleGroupA({ result, metadata }).pipe(
            map((grpcResponse) => {
                return {
                    success: grpcResponse?.success,
                    message: grpcResponse?.message || 'No message received',
                    data: grpcResponse?.data || null,
                };
            }),
            catchError((error) => {
                return new Observable((subscriber) => {
                    subscriber.next({
                        success: false,
                        message: 'Không thể xử lý yêu cầu. Vui lòng thử lại sau.',
                        errorDetails: error?.errors,
                    });
                    subscriber.complete();
                });
            })
        );
    }
    RoleGroupU(result: any, metadata: Record<string, string> = {}): Observable<any> {
        const client = this.createGrpcClient();
        const metadataService = client.getService<GroupRoleService>('GroupRoleService');

        return metadataService.RoleGroupU({ result, metadata }).pipe(
            map((grpcResponse) => {
                return {
                    success: grpcResponse?.success,
                    message: grpcResponse?.message || 'No message received',
                    data: grpcResponse?.data || null,
                };
            }),
            catchError((error) => {
                return new Observable((subscriber) => {
                    subscriber.next({
                        success: false,
                        message: 'Không thể xử lý yêu cầu. Vui lòng thử lại sau.',
                        errorDetails: error?.errors,
                    });
                    subscriber.complete();
                });
            })
        );
    }
    RoleGroupD(result: any, metadata: Record<string, string> = {}): Observable<any> {
        const client = this.createGrpcClient();
        const metadataService = client.getService<GroupRoleService>('GroupRoleService');

        return metadataService.RoleGroupD({ result, metadata }).pipe(
            map((grpcResponse) => {
                return {
                    success: grpcResponse?.success,
                    message: grpcResponse?.message || 'No message received',
                    data: grpcResponse?.data || null,
                };
            }),
            catchError((error) => {
                return new Observable((subscriber) => {
                    subscriber.next({
                        success: false,
                        message: 'Không thể xử lý yêu cầu. Vui lòng thử lại sau.',
                        errorDetails: error?.errors,
                    });
                    subscriber.complete();
                });
            })
        );
    }

    RoleGroupQ(result: any, metadata: Record<string, string> = {}): Observable<any> {
        const client = this.createGrpcClient();
        const metadataService = client.getService<GroupRoleService>('GroupRoleService');

        return metadataService.RoleGroupQ({ result, metadata }).pipe(
            map((grpcResponse) => {
                return {
                    success: grpcResponse?.success,
                    message: grpcResponse?.message || 'No message received',
                    data: grpcResponse?.data || null,
                };
            }),
            catchError((error) => {
                return new Observable((subscriber) => {
                    subscriber.next({
                        success: false,
                        message: 'Không thể xử lý yêu cầu. Vui lòng thử lại sau.',
                        errorDetails: error?.errors,
                    });
                    subscriber.complete();
                });
            })
        );
    }



}
