import { Injectable } from '@nestjs/common';
import {
  ClientGrpc,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import 'dotenv/config';
import { join } from 'path';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
interface PjtProjectService {
  searchPjtProject(data: {
    result: any[];
    metadata: Record<string, string>;
  }): Observable<any>;
  searchPjtProjectDetail(data: {
    result: any[];
    metadata: Record<string, string>;
  }): Observable<any>;
  auPjtProject(data: {
    masterData: any;
    dataItem: any[];
    dataDelv: any[];
    metadata: Record<string, string>;
  }): Observable<any>;

  deletePjtProjectItem(data: {
    result: any[];
    metadata: Record<string, string>;
  }): Observable<any>;

  deletePjtDelv(data: {
    result: any[];
    metadata: Record<string, string>;
  }): Observable<any>;

  deletePjtProject(data: {
    masterData: any;
    dataItem: any[];
    dataDelv: any[];
    metadata: Record<string, string>;
  }): Observable<any>;

  confirmPjtProject(data: {
    result: any[];
    metadata: Record<string, string>;
  }): Observable<any>;

}

@Injectable()
export class GrpcPjtProjectService {
  private createGrpcClient(): ClientGrpc {
    return ClientProxyFactory.create({
      transport: Transport.GRPC,
      options: {
        url: process.env.HOST_GRPC_REPORT,
        package: ['report.pjt.pjt_project'],
        protoPath: [
          join(
            __dirname,
            '..',
            '..',
            '..',
            '..',
            '..',
            'proto',
            'report',
            'pjt',
            'pjt_project.proto',
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

  searchPjtProject(
    result: any,
    metadata: Record<string, string> = {},
  ): Observable<any> {
    const client = this.createGrpcClient();
    const metadataService =
      client.getService<PjtProjectService>('PjtProjectService');
    return metadataService.searchPjtProject({ result, metadata }).pipe(
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
      }),
    );
  }

  searchPjtProjectDetail(
    result: any,
    metadata: Record<string, string> = {},
  ): Observable<any> {
    const client = this.createGrpcClient();
    const metadataService =
      client.getService<PjtProjectService>('PjtProjectService');
    return metadataService.searchPjtProjectDetail({ result, metadata }).pipe(
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
      }),
    );
  }

  auPjtProject(
    masterData: any,
    dataItem: any,
    dataDelv: any,
    metadata: Record<string, string> = {},
  ): Observable<any> {
    const client = this.createGrpcClient();
    const metadataService =
      client.getService<PjtProjectService>('PjtProjectService');
    return metadataService
      .auPjtProject({ masterData, dataItem, dataDelv, metadata })
      .pipe(
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
        }),
      );
  }

  deletePjtItem(
    result: any,
    metadata: Record<string, string> = {},
  ): Observable<any> {
    const client = this.createGrpcClient();
    const metadataService =
      client.getService<PjtProjectService>('PjtProjectService');
    return metadataService.deletePjtProjectItem({ result, metadata }).pipe(
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
      }),
    );
  }

  deletePjtDelv(
    result: any,
    metadata: Record<string, string> = {},
  ): Observable<any> {
    const client = this.createGrpcClient();
    const metadataService =
      client.getService<PjtProjectService>('PjtProjectService');
    return metadataService.deletePjtDelv({ result, metadata }).pipe(
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
      }),
    );
  }

  deletePjtProject(
    masterData: any,
    dataItem: any,
    dataDelv: any,
    metadata: Record<string, string> = {},
  ): Observable<any> {
    const client = this.createGrpcClient();
    const metadataService =
      client.getService<PjtProjectService>('PjtProjectService');
    return metadataService
      .deletePjtProject({ masterData, dataItem, dataDelv, metadata })
      .pipe(
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
        }),
      );
  }

  confirmPjtProject(
    result: any,
    metadata: Record<string, string> = {},
  ): Observable<any> {
    const client = this.createGrpcClient();
    const metadataService =
      client.getService<PjtProjectService>('PjtProjectService');
    return metadataService.confirmPjtProject({ result, metadata }).pipe(
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
      }),
    );
  }
}
