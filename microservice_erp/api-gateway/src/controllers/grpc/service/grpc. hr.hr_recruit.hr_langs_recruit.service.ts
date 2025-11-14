import { Injectable } from '@nestjs/common';
import { ClientGrpc, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { join } from 'path';
import { map, catchError } from 'rxjs/operators';
import 'dotenv/config';
interface HrLangsRecruitService {
    HrLangsRecruitA(data: { result: any[]; metadata: Record<string, string> }): Observable<any>;
    HrLangsRecruitU(data: { result: any[]; metadata: Record<string, string> }): Observable<any>;
    HrLangsRecruitD(data: { result: any[]; metadata: Record<string, string> }): Observable<any>;
    HrLangsRecruitQ(data: { result: any; metadata: Record<string, string> }): Observable<any>;
}

@Injectable()
export class GrpcHrLangsRecruitService {
    private createGrpcClient(): ClientGrpc {
        return ClientProxyFactory.create({
            transport: Transport.GRPC,
            options: {
                url: process.env.HOST_RGPC_HR,
                package: ['hr.hr_recruit.hr_langs_recruit',],
                protoPath: [
                    join(__dirname, '..', '..', '..', '..', '..', 'proto', 'hr', 'hr_recruit', 'hr_langs_recruit.proto'),
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


    HrLangsRecruitA(result: any, metadata: Record<string, string> = {}): Observable<any> {
        const client = this.createGrpcClient();
        const metadataService = client.getService<HrLangsRecruitService>('HrLangsRecruitService');
        return metadataService.HrLangsRecruitA({ result, metadata }).pipe(
            map((grpcResponse) => ({
                success: grpcResponse?.success,
                message: grpcResponse?.message || 'No message received',
                data: grpcResponse?.data || null,
            })),
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


    HrLangsRecruitU(result: any, metadata: Record<string, string> = {}): Observable<any> {
        const client = this.createGrpcClient();
        const metadataService = client.getService<HrLangsRecruitService>('HrLangsRecruitService');
        return metadataService.HrLangsRecruitU({ result, metadata }).pipe(
            map((grpcResponse) => ({
                success: grpcResponse?.success,
                message: grpcResponse?.message || 'No message received',
                data: grpcResponse?.data || null,
            })),
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
    HrLangsRecruitD(result: any, metadata: Record<string, string> = {}): Observable<any> {
        const client = this.createGrpcClient();
        const metadataService = client.getService<HrLangsRecruitService>('HrLangsRecruitService');
        return metadataService.HrLangsRecruitD({ result, metadata }).pipe(
            map((grpcResponse) => ({
                success: grpcResponse?.success,
                message: grpcResponse?.message || 'No message received',
                data: grpcResponse?.data || null,
            })),
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

    HrLangsRecruitQ(result: any, metadata: Record<string, string> = {}): Observable<any> {
        const client = this.createGrpcClient();
        const metadataService = client.getService<HrLangsRecruitService>('HrLangsRecruitService');
        return metadataService.HrLangsRecruitQ({ result, metadata }).pipe(
            map((grpcResponse) => ({
                success: grpcResponse?.success,
                message: grpcResponse?.message || 'No message received',
                data: grpcResponse?.data || null,
            })),
            catchError((error) => {
                console.log('error', error);
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
