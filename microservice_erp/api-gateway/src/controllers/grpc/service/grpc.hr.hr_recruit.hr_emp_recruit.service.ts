import { Injectable } from '@nestjs/common';
import { ClientGrpc, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { join } from 'path';
import { map, catchError } from 'rxjs/operators';
import 'dotenv/config';
interface HrEmpRecruitService {
    HrEmpRecruitA(data: { result: any[]; metadata: Record<string, string> }): Observable<any>;
    HrEmpRecruitU(data: { result: any[]; metadata: Record<string, string> }): Observable<any>;
    HrEmpRecruitD(data: { result: any[]; metadata: Record<string, string> }): Observable<any>;
    HrEmpRecruitQ(data: { result: any; metadata: Record<string, string> }): Observable<any>;
    HrEmpRecruitS(data: { result: any; metadata: Record<string, string> }): Observable<any>;
    HrEmpRecruitMonthlySummary(data: { result: any; metadata: Record<string, string> }): Observable<any>;
}

@Injectable()
export class GrpcHrEmpRecruitService {
    private createGrpcClient(): ClientGrpc {
        return ClientProxyFactory.create({
            transport: Transport.GRPC,
            options: {
                url: process.env.HOST_RGPC_HR,
                package: ['hr.hr_recruit.hr_emp_recruit',],
                protoPath: [
                    join(__dirname, '..', '..', '..', '..', '..', 'proto', 'hr', 'hr_recruit', 'hr_emp_recruit.proto'),
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


    HrEmpRecruitA(result: any, metadata: Record<string, string> = {}): Observable<any> {
        const client = this.createGrpcClient();
        const metadataService = client.getService<HrEmpRecruitService>('HrEmpRecruitService');
        return metadataService.HrEmpRecruitA({ result, metadata }).pipe(
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


    HrEmpRecruitU(result: any, metadata: Record<string, string> = {}): Observable<any> {
        const client = this.createGrpcClient();
        const metadataService = client.getService<HrEmpRecruitService>('HrEmpRecruitService');
        return metadataService.HrEmpRecruitU({ result, metadata }).pipe(
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
    HrEmpRecruitD(result: any, metadata: Record<string, string> = {}): Observable<any> {
        const client = this.createGrpcClient();
        const metadataService = client.getService<HrEmpRecruitService>('HrEmpRecruitService');
        return metadataService.HrEmpRecruitD({ result, metadata }).pipe(
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

    HrEmpRecruitQ(result: any, metadata: Record<string, string> = {}): Observable<any> {
        const client = this.createGrpcClient();
        const metadataService = client.getService<HrEmpRecruitService>('HrEmpRecruitService');
        return metadataService.HrEmpRecruitQ({ result, metadata }).pipe(
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

    HrEmpRecruitS(result: any, metadata: Record<string, string> = {}): Observable<any> {
        const client = this.createGrpcClient();
        const metadataService = client.getService<HrEmpRecruitService>('HrEmpRecruitService');
        return metadataService.HrEmpRecruitS({ result, metadata }).pipe(
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
    HrEmpRecruitMonthlySummary(result: any, metadata: Record<string, string> = {}): Observable<any> {
        const client = this.createGrpcClient();
        const metadataService = client.getService<HrEmpRecruitService>('HrEmpRecruitService');
        return metadataService.HrEmpRecruitMonthlySummary({ result, metadata }).pipe(
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
}
