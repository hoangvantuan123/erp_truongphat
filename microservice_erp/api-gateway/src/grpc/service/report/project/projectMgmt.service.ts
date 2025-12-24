import { Injectable } from '@nestjs/common';
import { ClientGrpc, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { join } from 'path';
import { map, catchError } from 'rxjs/operators';
import 'dotenv/config';
interface ProjectMgmtService {
    ProjectMgmtAUD(data: { result: any[]; result2: any[]; result3: any[]; result4: any[]; metadata: Record<string, string> }): Observable<any>;
    SPJTSupplyContractResAUD(data: { result: any[]; metadata: Record<string, string> }): Observable<any>;
    SupplyContractRemarkAUD(data: { result: any[]; metadata: Record<string, string> }): Observable<any>;
    SPJTSupplyContractQ(data: { result: any[]; metadata: Record<string, string> }): Observable<any>;
    SPJTSupplyContractResQ(data: { result: any[]; metadata: Record<string, string> }): Observable<any>;
    SPJTSupplyContractRemarkQ(data: { result: any[]; metadata: Record<string, string> }): Observable<any>;
    SPJTSupplyContractListQ(data: { result: any[]; metadata: Record<string, string> }): Observable<any>;
    SPJTSupplyContractD(data: { result: any[]; metadata: Record<string, string> }): Observable<any>;
    SPJTSupplyContractAmtListQ(data: { result: any[]; metadata: Record<string, string> }): Observable<any>;
    NotifiProjectQ(data: { result: any[]; metadata: Record<string, string> }): Observable<any>;
}

@Injectable()
export class GrpcProjectMgmtService {
    private createGrpcClient(): ClientGrpc {
        return ClientProxyFactory.create({
            transport: Transport.GRPC,
            options: {
                url: process.env.HOST_GRPC_REPORT,
                package: ['report.project.project_mgmt'],
                protoPath: [
                    join(__dirname, '..', '..', '..', '..', '..', '..', 'proto', 'report', 'project', 'project_mgmt.proto'),
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




    ProjectMgmtAUD(result: any, result2: any, result3: any, result4: any, metadata: Record<string, string> = {}): Observable<any> {
        const client = this.createGrpcClient();
        const metadataService = client.getService<ProjectMgmtService>('ProjectMgmtService');
        return metadataService.ProjectMgmtAUD({ result, result2, result3, result4, metadata }).pipe(
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

    SPJTSupplyContractResAUD(result: any, metadata: Record<string, string> = {}): Observable<any> {
        const client = this.createGrpcClient();
        const metadataService = client.getService<ProjectMgmtService>('ProjectMgmtService');
        return metadataService.SPJTSupplyContractResAUD({ result, metadata }).pipe(
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
    SupplyContractRemarkAUD(result: any, metadata: Record<string, string> = {}): Observable<any> {
        const client = this.createGrpcClient();
        const metadataService = client.getService<ProjectMgmtService>('ProjectMgmtService');
        return metadataService.SupplyContractRemarkAUD({ result, metadata }).pipe(
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
    SPJTSupplyContractQ(result: any, metadata: Record<string, string> = {}): Observable<any> {
        const client = this.createGrpcClient();
        const metadataService = client.getService<ProjectMgmtService>('ProjectMgmtService');
        return metadataService.SPJTSupplyContractQ({ result, metadata }).pipe(
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
    SPJTSupplyContractResQ(result: any, metadata: Record<string, string> = {}): Observable<any> {
        const client = this.createGrpcClient();
        const metadataService = client.getService<ProjectMgmtService>('ProjectMgmtService');
        return metadataService.SPJTSupplyContractResQ({ result, metadata }).pipe(
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
    SPJTSupplyContractRemarkQ(result: any, metadata: Record<string, string> = {}): Observable<any> {
        const client = this.createGrpcClient();
        const metadataService = client.getService<ProjectMgmtService>('ProjectMgmtService');
        return metadataService.SPJTSupplyContractRemarkQ({ result, metadata }).pipe(
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
    SPJTSupplyContractListQ(result: any, metadata: Record<string, string> = {}): Observable<any> {
        const client = this.createGrpcClient();
        const metadataService = client.getService<ProjectMgmtService>('ProjectMgmtService');
        return metadataService.SPJTSupplyContractListQ({ result, metadata }).pipe(
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
    SPJTSupplyContractD(result: any, metadata: Record<string, string> = {}): Observable<any> {
        const client = this.createGrpcClient();
        const metadataService = client.getService<ProjectMgmtService>('ProjectMgmtService');
        return metadataService.SPJTSupplyContractD({ result, metadata }).pipe(
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
    SPJTSupplyContractAmtListQ(result: any, metadata: Record<string, string> = {}): Observable<any> {
        const client = this.createGrpcClient();
        const metadataService = client.getService<ProjectMgmtService>('ProjectMgmtService');
        return metadataService.SPJTSupplyContractAmtListQ({ result, metadata }).pipe(
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
    NotifiProjectQ(result: any, metadata: Record<string, string> = {}): Observable<any> {
        const client = this.createGrpcClient();
        const metadataService = client.getService<ProjectMgmtService>('ProjectMgmtService');
        return metadataService.NotifiProjectQ({ result, metadata }).pipe(
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
