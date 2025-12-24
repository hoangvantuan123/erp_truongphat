import { Injectable } from '@nestjs/common';
import { ClientGrpc, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { join } from 'path';
import { map, catchError } from 'rxjs/operators';
import 'dotenv/config';
interface SDACustService {
    SDACustQ(data: { result: any[]; metadata: Record<string, string> }): Observable<any>;
    SDACustAUD(data: { result: any[]; metadata: Record<string, string> }): Observable<any>;
    SDACustD(data: { result: any[]; metadata: Record<string, string> }): Observable<any>;
    SDACustEmpInfoQ(data: { result: any[]; metadata: Record<string, string> }): Observable<any>;
    SDACustEmpInfoAUD(data: { result: any[]; metadata: Record<string, string> }): Observable<any>;
}

@Injectable()
export class GrpcSDACustService {
    private createGrpcClient(): ClientGrpc {
        return ClientProxyFactory.create({
            transport: Transport.GRPC,
            options: {
                url: process.env.HOST_RGPC_WH,
                package: ['wh.cust.sda_cust'],
                protoPath: [
                    join(__dirname, '..', '..', '..', '..', '..', '..', 'proto', 'wh', 'cust', 'sda_cust.proto'),
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



    SDACustQ(result: any, metadata: Record<string, string> = {}): Observable<any> {
        const client = this.createGrpcClient();
        const metadataService = client.getService<SDACustService>('SDACustService');
        return metadataService.SDACustQ({ result, metadata }).pipe(
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

    SDACustAUD(result: any, metadata: Record<string, string> = {}): Observable<any> {
        const client = this.createGrpcClient();
        const metadataService = client.getService<SDACustService>('SDACustService');
        return metadataService.SDACustAUD({ result, metadata }).pipe(
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

    SDACustD(result: any, metadata: Record<string, string> = {}): Observable<any> {
        const client = this.createGrpcClient();
        const metadataService = client.getService<SDACustService>('SDACustService');
        return metadataService.SDACustD({ result, metadata }).pipe(
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
    SDACustEmpInfoQ(result: any, metadata: Record<string, string> = {}): Observable<any> {
        const client = this.createGrpcClient();
        const metadataService = client.getService<SDACustService>('SDACustService');
        return metadataService.SDACustEmpInfoQ({ result, metadata }).pipe(
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

    SDACustEmpInfoAUD(result: any, metadata: Record<string, string> = {}): Observable<any> {
        const client = this.createGrpcClient();
        const metadataService = client.getService<SDACustService>('SDACustService');
        return metadataService.SDACustEmpInfoAUD({ result, metadata }).pipe(
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
