import { Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { join } from 'path';
import { map, catchError } from 'rxjs/operators';
import 'dotenv/config';
interface DefineItemService {
    DefineItemA(data: { result: any; metadata: Record<string, string> }): Observable<any>;
    DefineItemU(data: { result: any; metadata: Record<string, string> }): Observable<any>;
    DefineItemD(data: { result: any; metadata: Record<string, string> }): Observable<any>;
    DefineItemQ(data: { result: any; metadata: Record<string, string> }): Observable<any>;
}


@Injectable()
export class gRPCDefineItemService {


    private createGrpcClient(): ClientGrpc {
        return ClientProxyFactory.create({
            transport: Transport.GRPC,
            options: {
                url: process.env.HOST_RGPC_HR,
                package: [
                    'hr.define.define_item',
                ],
                protoPath: [
                    join(__dirname, '..', '..', '..', '..', '..', 'proto', 'hr', 'define', 'define_item.proto'),
                ],
                loader: {
                    keepCase: true,
                    longs: String,
                    enums: String,
                    defaults: true,
                    oneofs: true,
                },
                channelOptions: {
                    'grpc.default_compression_algorithm': 2,
                    'grpc.max_receive_message_length': 1024 * 1024 * 1024,
                    'grpc.max_send_message_length': 1024 * 1024 * 1024,
                    'grpc.max_concurrent_streams': 100,
                    'grpc.http2.lookahead_bytes': 0,
                    'grpc.enable_http_proxy': 0,
                },
            },
        }) as ClientGrpc;
    }


    DefineItemA(result: any, metadata: Record<string, string> = {}): Observable<any> {
        const client = this.createGrpcClient();
        const metadataService = client.getService<DefineItemService>('DefineItemService');

        return metadataService.DefineItemA({ result, metadata }).pipe(
            map((grpcResponse) => {
                return {
                    success: grpcResponse?.success,
                    message: grpcResponse?.message || 'No message received',
                    data: grpcResponse?.data || null,
                };
            }),
            catchError((error) => {
                console.log('error', error)
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
    DefineItemU(result: any, metadata: Record<string, string> = {}): Observable<any> {
        const client = this.createGrpcClient();
        const metadataService = client.getService<DefineItemService>('DefineItemService');

        return metadataService.DefineItemU({ result, metadata }).pipe(
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
    DefineItemD(result: any, metadata: Record<string, string> = {}): Observable<any> {
        const client = this.createGrpcClient();
        const metadataService = client.getService<DefineItemService>('DefineItemService');

        return metadataService.DefineItemD({ result, metadata }).pipe(
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
    DefineItemQ(result: any, metadata: Record<string, string> = {}): Observable<any> {
        const client = this.createGrpcClient();
        const metadataService = client.getService<DefineItemService>('DefineItemService');

        return metadataService.DefineItemQ({ result, metadata }).pipe(
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
