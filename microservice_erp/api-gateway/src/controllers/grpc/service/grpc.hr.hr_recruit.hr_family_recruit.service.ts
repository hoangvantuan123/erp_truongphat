import { Injectable } from '@nestjs/common';
import { ClientGrpc, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { join } from 'path';
import { map, catchError } from 'rxjs/operators';
import 'dotenv/config';
interface HrFamilyRecruitService {
    HrFamilyRecruitA(data: { result: any[]; metadata: Record<string, string> }): Observable<any>;
    HrFamilyRecruitU(data: { result: any[]; metadata: Record<string, string> }): Observable<any>;
    HrFamilyRecruitD(data: { result: any[]; metadata: Record<string, string> }): Observable<any>;
    HrFamilyRecruitQ(data: { result: any; metadata: Record<string, string> }): Observable<any>;
}

@Injectable()
export class GrpcHrFamilyRecruitService {
    private createGrpcClient(): ClientGrpc {
        return ClientProxyFactory.create({
            transport: Transport.GRPC,
            options: {
                url: process.env.HOST_RGPC_HR,
                package: ['hr.hr_recruit.hr_family_recruit',],
                protoPath: [
                    join(__dirname, '..', '..', '..', '..', '..', 'proto', 'hr', 'hr_recruit', 'hr_family_recruit.proto'),
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


    HrFamilyRecruitA(result: any, metadata: Record<string, string> = {}): Observable<any> {
        const client = this.createGrpcClient();
        const metadataService = client.getService<HrFamilyRecruitService>('HrFamilyRecruitService');
        return metadataService.HrFamilyRecruitA({ result, metadata }).pipe(
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


    HrFamilyRecruitU(result: any, metadata: Record<string, string> = {}): Observable<any> {
        const client = this.createGrpcClient();
        const metadataService = client.getService<HrFamilyRecruitService>('HrFamilyRecruitService');
        return metadataService.HrFamilyRecruitU({ result, metadata }).pipe(
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
    HrFamilyRecruitD(result: any, metadata: Record<string, string> = {}): Observable<any> {
        const client = this.createGrpcClient();
        const metadataService = client.getService<HrFamilyRecruitService>('HrFamilyRecruitService');
        return metadataService.HrFamilyRecruitD({ result, metadata }).pipe(
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

    HrFamilyRecruitQ(result: any, metadata: Record<string, string> = {}): Observable<any> {
        const client = this.createGrpcClient();
        const metadataService = client.getService<HrFamilyRecruitService>('HrFamilyRecruitService');
        return metadataService.HrFamilyRecruitQ({ result, metadata }).pipe(
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
