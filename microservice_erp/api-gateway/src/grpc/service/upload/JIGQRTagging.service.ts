import { Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { join } from 'path';
import { map, catchError } from 'rxjs/operators';
import 'dotenv/config';
interface JIGQRTaggingService {
    JIGQRTaggingPrint(data: { result: any; typeData: any, metadata: Record<string, string> }): Observable<any>;
}


@Injectable()
export class gRPCJIGQRTaggingService {


    private createGrpcClient(): ClientGrpc {
        return ClientProxyFactory.create({
            transport: Transport.GRPC,
            options: {
                url: process.env.HOST_GRPC_UPLOAD,
                package: [
                    'upload.assets.asset_qr_tagging',
                ],
                protoPath: [
                    join(__dirname, '..', '..', '..', '..', '..', 'proto', 'upload', 'assets', 'asset_qr_tagging.proto'),
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



    JIGQRTaggingPrint(result: any, typeData: any, metadata: Record<string, string> = {}): Observable<any> {

        const client = this.createGrpcClient();
        const metadataService = client.getService<JIGQRTaggingService>('JIGQRTaggingService');
        return metadataService.JIGQRTaggingPrint({ result, typeData, metadata }).pipe(
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
