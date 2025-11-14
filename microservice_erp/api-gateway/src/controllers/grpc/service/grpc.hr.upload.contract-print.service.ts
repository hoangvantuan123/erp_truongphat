import { Injectable } from '@nestjs/common';
import {
  ClientGrpc,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { join } from 'path';
import { map, catchError } from 'rxjs/operators';
import 'dotenv/config';
interface HrContractPrintService {
  printContract(data: {
    result: any;
    metadata: Record<string, string>;
  }): Observable<any>;

  printBasCertificate(data: {
    result: any;
    metadata: Record<string, string>;
  }): Observable<any>;
}

@Injectable()
export class GrpcHrContractPrintService {
  private createGrpcClient(): ClientGrpc {
    return ClientProxyFactory.create({
      transport: Transport.GRPC,
      options: {
        url: process.env.HOST_GRPC_UPLOAD,
        package: ['upload.hr.contract_print'],
        protoPath: [
          join(__dirname, '..', '..', '..', '..', '..', 'proto', 'upload', 'hr', 'contract_print.proto'),
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

  printContract(
    result: any,
    metadata: Record<string, string> = {},
  ): Observable<any> {
    const client = this.createGrpcClient();
    const metadataService = client.getService<HrContractPrintService>(
      'HrContractPrintService',
    );
    return metadataService.printContract({ result, metadata }).pipe(
      map((grpcResponse) => ({
        success: grpcResponse?.status ?? false,
        // message: grpcResponse?.message || 'No message received',
        data: grpcResponse?.data || null,
        errors: grpcResponse?.errors || null,
      })),
      catchError((error) => {
        console.log(error);
        return new Observable((subscriber) => {
          subscriber.next({
            success: false,
            message: 'Error while calling gRPC service',
            errorDetails: error?.message || 'Unknown error',
            errors: error?.errors || null,
          });
          subscriber.complete();
        });
      }),
    );
  }

  printBasCertificate(
    result: any,
    metadata: Record<string, string> = {},
  ): Observable<any> {
    const client = this.createGrpcClient();
    const metadataService = client.getService<HrContractPrintService>(
      'HrContractPrintService',
    );
    return metadataService.printBasCertificate({ result, metadata }).pipe(
      map((grpcResponse) => ({
        success: grpcResponse?.status ?? false,
        // message: grpcResponse?.message || 'No message received',
        data: grpcResponse?.data || null,
        errors: grpcResponse?.errors || null,
      })),
      catchError((error) => {
        console.log(error);
        return new Observable((subscriber) => {
          subscriber.next({
            success: false,
            message: 'Error while calling gRPC service',
            errorDetails: error?.message || 'Unknown error',
            errors: error?.errors || null,
          });
          subscriber.complete();
        });
      }),
    );
  }
}
