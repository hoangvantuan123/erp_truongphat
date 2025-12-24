import { Injectable } from '@nestjs/common';
import { ClientGrpc, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { join } from 'path';
import { map, catchError } from 'rxjs/operators';
import 'dotenv/config';
interface SPRWkEmpDdService {
    SPRWkEmpDdQ(data: { result: any[]; metadata: Record<string, string> }): Observable<any>;
    SPRWkEmpDdAUD(data: { result: any[]; metadata: Record<string, string> }): Observable<any>;
}

@Injectable()
export class GrpcSPRWkEmpDdService {
    private createGrpcClient(): ClientGrpc {
        return ClientProxyFactory.create({
            transport: Transport.GRPC,
            options: {
                url: process.env.HOST_RGPC_HR,
                package: ['hr.daily_att.sp_wk_emp_dd'],
                protoPath: [
                    join(__dirname, '..', '..', '..', '..', '..', '..', 'proto', 'hr', 'daily_att', 'sp_wk_emp_dd.proto'),
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



    SPRWkEmpDdQ(result: any, metadata: Record<string, string> = {}): Observable<any> {
        const client = this.createGrpcClient();
        const metadataService = client.getService<SPRWkEmpDdService>('SPRWkEmpDdService');
        return metadataService.SPRWkEmpDdQ({ result, metadata }).pipe(
            map((grpcResponse) => ({
                success: grpcResponse?.success ?? false,
                message: grpcResponse?.message || 'No message received',
                data: grpcResponse?.data || null,
                errors: grpcResponse?.errors || null,
            })),
            catchError((error) => {
                return new Observable((subscriber) => {
                    subscriber.next({
                        success: false,
                        message: 'Hệ thống đang bận, vui lòng thử lại sau.',
                        errorDetails: error?.message || 'Unknown error',
                        errors: error?.errors || null,
                    });
                    subscriber.complete();
                });
            })
        );
    }

    SPRWkEmpDdAUD(result: any, metadata: Record<string, string> = {}): Observable<any> {
        const client = this.createGrpcClient();
        const metadataService = client.getService<SPRWkEmpDdService>('SPRWkEmpDdService');
        return metadataService.SPRWkEmpDdAUD({ result, metadata }).pipe(
            map((grpcResponse) => ({
                success: grpcResponse?.success ?? false,
                message: grpcResponse?.message || 'No message received',
                data: grpcResponse?.data || null,
                errors: grpcResponse?.errors || null,
            })),
            catchError((error) => {
                return new Observable((subscriber) => {
                    subscriber.next({
                        success: false,
                        message: 'Hệ thống đang bận, vui lòng thử lại sau.',
                        errorDetails: error?.message || 'Unknown error',
                        errors: error?.errors || null,
                    });
                    subscriber.complete();
                });
            })
        );
    }





}
