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
interface PdEquiptInspectDetailService {
  searchEquiptInspectDetail(data: {
    result: any;
    metadata: Record<string, string>;
  }): Observable<any>;

  getToolDetailMatByTermSerl(data: {
    result: any;
    metadata: Record<string, string>;
  }): Observable<any>;

  createOrUpdateInspectDetail(data: {
    dataInspectDetail: any;
    dataDetailMat: any;
    metadata: Record<string, string>;
  }): Observable<any>;

  deleteInspect(data: {
    deleteInspect: any;
    metadata: Record<string, string>;
  }): Observable<any>;

  deleteInspectMat(data: {
    dataMat: any;
    metadata: Record<string, string>;
  }): Observable<any>;

  deleteDetail(data: {
    dataDetail: any;
    metadata: Record<string, string>;
  }): Observable<any>;
}

@Injectable()
export class GrpcPdEquiptInspectDetailService {
  private createGrpcClient(): ClientGrpc {
    return ClientProxyFactory.create({
      transport: Transport.GRPC,
      options: {
        url: process.env.HOST_RGPC_ASST,
        package: ['pdequipt_inspect_detail'],
        protoPath: [
          join(
            __dirname,
            '..',
            '..',
            '..',
            '..',
            '..',
            'proto',
            'asset',
            'pd_equipt_inspect_detail.proto',
          ),
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

  searchEquiptInspectDetail(
    result: any[],
    metadata: Record<string, string> = {},
  ): Observable<any> {
    const client = this.createGrpcClient();
    const metadataService = client.getService<PdEquiptInspectDetailService>(
      'PdEquiptInspectDetailService',
    );
    return metadataService.searchEquiptInspectDetail({ result, metadata }).pipe(
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

  getToolDetailMatByTermSerl(
    result: any[],
    metadata: Record<string, string> = {},
  ): Observable<any> {
    const client = this.createGrpcClient();
    const metadataService = client.getService<PdEquiptInspectDetailService>(
      'PdEquiptInspectDetailService',
    );
    return metadataService
      .getToolDetailMatByTermSerl({ result, metadata })
      .pipe(
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

  createOrUpdateInspectDetail(
    dataInspectDetail: any[],
    dataDetailMat: any[],
    metadata: Record<string, string> = {},
  ): Observable<any> {
    const client = this.createGrpcClient();
    const metadataService = client.getService<PdEquiptInspectDetailService>(
      'PdEquiptInspectDetailService',
    );

    return metadataService
      .createOrUpdateInspectDetail({
        dataInspectDetail,
        dataDetailMat,
        metadata,
      })
      .pipe(
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

  deleteInspectMat(
    dataMat: any[],
    metadata: Record<string, string> = {},
  ): Observable<any> {
    const client = this.createGrpcClient();
    const metadataService = client.getService<PdEquiptInspectDetailService>(
      'PdEquiptInspectDetailService',
    );

    return metadataService.deleteInspectMat({ dataMat, metadata }).pipe(
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

  deleteInspect(
    deleteInspect: any[],
    metadata: Record<string, string> = {},
  ): Observable<any> {
    const client = this.createGrpcClient();
    const metadataService = client.getService<PdEquiptInspectDetailService>(
      'PdEquiptInspectDetailService',
    );
    return metadataService.deleteInspect({ deleteInspect, metadata }).pipe(
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
  
  deleteDetail(
    dataDetail: any[],
    metadata: Record<string, string> = {},
  ): Observable<any> {
    const client = this.createGrpcClient();
    const metadataService = client.getService<PdEquiptInspectDetailService>(
      'PdEquiptInspectDetailService',
    );
    return metadataService.deleteDetail({ dataDetail, metadata }).pipe(
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
