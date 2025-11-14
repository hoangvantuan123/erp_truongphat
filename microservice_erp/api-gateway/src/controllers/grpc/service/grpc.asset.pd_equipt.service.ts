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
interface PdEquiptService {
  searchAssetEquipt(data: {
    result: any;
    metadata: Record<string, string>;
  }): Observable<any>;

  getToolQuery(data: {
    result: any;
    metadata: Record<string, string>;
  }): Observable<any>;

  getToolAssyQuery(data: {
    result: any;
    metadata: Record<string, string>;
  }): Observable<any>;

  getToolRepairQuery(data: {
    result: any;
    metadata: Record<string, string>;
  }): Observable<any>;

  getUserDefineQuery(data: {
    result: any;
    metadata: Record<string, string>;
  }): Observable<any>;

  createOrUpdatePdEquip(data: {
    dataPdEquip: any;
    dataAssyTool: any;
    dataMng: any;
    metadata: Record<string, string>;
  }): Observable<any>;

  deleteMold(data: {
    dataMold: any;
    metadata: Record<string, string>;
  }): Observable<any>;

  deletePdEquip(data: {
    dataPdEquip: any;
    dataAssyTool: any;
    dataMng: any;
    metadata: Record<string, string>;
  }): Observable<any>;

  AssetFileQ(data: {
    result: any;
    metadata: Record<string, string>;
  }): Observable<any>;
  AssetFileD(data: {
    result: any;
    metadata: Record<string, string>;
  }): Observable<any>;
}

@Injectable()
export class GrpcPdEquiptService {
  private createGrpcClient(): ClientGrpc {
    return ClientProxyFactory.create({
      transport: Transport.GRPC,
      options: {
        url: process.env.HOST_RGPC_ASST,
        package: ['pdequipt'],
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
            'pd_equipt.proto',
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

  searchAssetEquipt(
    result: any[],
    metadata: Record<string, string> = {},
  ): Observable<any> {
    const client = this.createGrpcClient();
    const metadataService =
      client.getService<PdEquiptService>('PdEquiptService');
    return metadataService.searchAssetEquipt({ result, metadata }).pipe(
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

  getToolQuery(
    result: any[],
    metadata: Record<string, string> = {},
  ): Observable<any> {
    const client = this.createGrpcClient();
    const metadataService =
      client.getService<PdEquiptService>('PdEquiptService');
    return metadataService.getToolQuery({ result, metadata }).pipe(
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

  getToolAssyQuery(
    result: any[],
    metadata: Record<string, string> = {},
  ): Observable<any> {
    const client = this.createGrpcClient();
    const metadataService =
      client.getService<PdEquiptService>('PdEquiptService');
    return metadataService.getToolAssyQuery({ result, metadata }).pipe(
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

  getToolRepairQuery(
    result: any[],
    metadata: Record<string, string> = {},
  ): Observable<any> {
    const client = this.createGrpcClient();
    const metadataService =
      client.getService<PdEquiptService>('PdEquiptService');
    return metadataService.getToolRepairQuery({ result, metadata }).pipe(
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

  getUserDefineQuery(
    result: any[],
    metadata: Record<string, string> = {},
  ): Observable<any> {
    const client = this.createGrpcClient();
    const metadataService =
      client.getService<PdEquiptService>('PdEquiptService');
    return metadataService.getUserDefineQuery({ result, metadata }).pipe(
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

  createOrUpdatePdEquip(
    dataPdEquip: any[],
    dataAssyTool: any[],
    dataMng: any[],
    metadata: Record<string, string> = {},
  ): Observable<any> {
    const client = this.createGrpcClient();
    const metadataService =
      client.getService<PdEquiptService>('PdEquiptService');
    return metadataService
      .createOrUpdatePdEquip({ dataPdEquip, dataAssyTool, dataMng, metadata })
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

  deleteMold(
    dataMold: any[],
    metadata: Record<string, string> = {},
  ): Observable<any> {
    const client = this.createGrpcClient();
    const metadataService =
      client.getService<PdEquiptService>('PdEquiptService');
    return metadataService.deleteMold({ dataMold, metadata }).pipe(
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

  deletePdEquip(
    dataPdEquip: any[],
    dataAssyTool: any[],
    dataMng: any[],
    metadata: Record<string, string> = {},
  ): Observable<any> {
    const client = this.createGrpcClient();
    const metadataService =
      client.getService<PdEquiptService>('PdEquiptService');
    return metadataService
      .deletePdEquip({ dataPdEquip, dataAssyTool, dataMng, metadata })
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

  AssetFileQ(
    result: any,
    metadata: Record<string, string> = {},
  ): Observable<any> {
    const client = this.createGrpcClient();
    const metadataService =
      client.getService<PdEquiptService>('PdEquiptService');
    return metadataService.AssetFileQ({ result, metadata }).pipe(
      map((grpcResponse) => ({
        success: grpcResponse?.status ?? false,
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
      }),
    );
  }

  AssetFileD(
    result: any,
    metadata: Record<string, string> = {},
  ): Observable<any> {
    const client = this.createGrpcClient();
    const metadataService =
      client.getService<PdEquiptService>('PdEquiptService');
    return metadataService.AssetFileD({ result, metadata }).pipe(
      map((grpcResponse) => ({
        success: grpcResponse?.status ?? false,
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
      }),
    );
  }
}
