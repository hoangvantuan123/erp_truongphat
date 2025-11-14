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
interface PdMultiEquiptService {
  searchMultiEquipt(data: {
    result: any;
    metadata: Record<string, string>;
  }): Observable<any>;

  createOrUpdatePdMultiEquip(data: {
    dataPdEquip: any;
    dataAssyTool: any;
    dataMng: any;
    metadata: Record<string, string>;
  }): Observable<any>;

  deletePdMultiEquip(data: {
    dataPdEquip: any;
    dataAssyTool: any;
    dataMng: any;
    metadata: Record<string, string>;
  }): Observable<any>;

  
}

@Injectable()
export class GrpcPdMultiEquiptService {
  private createGrpcClient(): ClientGrpc {
    return ClientProxyFactory.create({
      transport: Transport.GRPC,
      options: {
        url: process.env.HOST_RGPC_ASST,
        package: [ 'pd_multi_equipt'],
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
            'pd_multi_equipt.proto',
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

  searchMultiEquipt(
    result: any[],
    metadata: Record<string, string> = {},
  ): Observable<any> {
    const client = this.createGrpcClient();
    const metadataService =
      client.getService<PdMultiEquiptService>('PdMultiEquiptService');
    return metadataService.searchMultiEquipt({ result, metadata }).pipe(
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

    createOrUpdatePdMultiEquip(
      dataPdEquip: any[],
      dataAssyTool: any[],
      dataMng: any[],
      metadata: Record<string, string> = {},
    ): Observable<any> {
      const client = this.createGrpcClient();
      const metadataService =
        client.getService<PdMultiEquiptService>('PdMultiEquiptService');
      return metadataService
        .createOrUpdatePdMultiEquip({ dataPdEquip, dataAssyTool, dataMng, metadata })
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

  deletePdMultiEquip(
    dataPdEquip: any[],
    dataAssyTool: any[],
    dataMng: any[],
    metadata: Record<string, string> = {},
  ): Observable<any> {
    const client = this.createGrpcClient();
    const metadataService =
      client.getService<PdMultiEquiptService>('PdMultiEquiptService');
    return metadataService
      .deletePdMultiEquip({ dataPdEquip, dataAssyTool, dataMng, metadata })
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

}
