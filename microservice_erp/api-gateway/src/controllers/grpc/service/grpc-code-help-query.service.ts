import { Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { CodeHelpQueryResult } from '../interface/sp/codehlepQuery';
import { join } from 'path';
import { map, catchError } from 'rxjs/operators';
import 'dotenv/config';
interface CodehelpQueryService {
    sendCodehelpQuery(data: { result: CodeHelpQueryResult; metadata: Record<string, string> }): Observable<any>;
    getCodeHelp230427(data: { result: CodeHelpQueryResult; metadata: Record<string, string> }): Observable<any>;
}

@Injectable()
export class GrpCodeHelpQueryService implements OnModuleInit {
    private metadataService: CodehelpQueryService;

    private readonly client: ClientGrpc = ClientProxyFactory.create({
        transport: Transport.GRPC,
        options: {
            url:process.env.HOST_RGPC_SP ?? 'localhost:5003',
            package: ['codehelp'],
            protoPath: [join(__dirname, '..', '..', '..', '..', '..', 'proto', 'sp', 'codehelp.proto')],
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

    onModuleInit() {
        this.metadataService = this.client.getService<CodehelpQueryService>('CodehelpQueryService');
    }

    sendCodehelpQuery(result: CodeHelpQueryResult, metadata: Record<string, string> = {}): Observable<any> {
        return this.metadataService.sendCodehelpQuery({ result, metadata }).pipe(
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

    getCodeHelp230427(result: CodeHelpQueryResult, metadata: Record<string, string> = {}): Observable<any> {
        return this.metadataService.getCodeHelp230427({ result, metadata }).pipe(
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