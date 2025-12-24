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
interface HrEduPerRstService {
  searchEduPerRst(data: {
    result: any[];
    metadata: Record<string, string>;
  }): Observable<any>;
  auEduPerRst(data: {
    info: any;
    dataRstCost: any[];
    dataRstItem: any[];
    dataEduPerObj: any[];
    metadata: Record<string, string>;
  }): Observable<any>;

  deleteEduPerRst(data: {
    info: any;
    dataRstCost: any[];
    dataRstItem: any[];
    metadata: Record<string, string>;
  }): Observable<any>;
  deleteEduRstCost(data: {
    result: any[];
    metadata: Record<string, string>;
  }): Observable<any>;

  deleteEduRstItem(data: {
    result: any[];
    metadata: Record<string, string>;
  }): Observable<any>;

  searchEduCostRst(data: {
    result: any[];
    metadata: Record<string, string>;
  }): Observable<any>;

  searchEduItemRst(data: {
    result: any[];
    metadata: Record<string, string>;
  }): Observable<any>;

  searchEduRst(data: {
    result: any[];
    metadata: Record<string, string>;
  }): Observable<any>;

  searchEduRstEnd(data: {
    result: any[];
    metadata: Record<string, string>;
  }): Observable<any>;

  auEduRstEnd(data: {
    result: any[];
    metadata: Record<string, string>;
  }): Observable<any>;

  searchEduRstBatch(data: {
    result: any[];
    metadata: Record<string, string>;
  }): Observable<any>;

  auEduRstBatch(data: {
    info: any;
    dataRstCost: any[];
    dataRstItem: any[];
    dataEduPerObj: any[];
    metadata: Record<string, string>;
  }): Observable<any>;

  searchEduCostRstBatch(data: {
    result: any[];
    metadata: Record<string, string>;
  }): Observable<any>;

  searchEduItemRstBatch(data: {
    result: any[];
    metadata: Record<string, string>;
  }): Observable<any>;

  deleteEduRstCostBatch(data: {
    result: any[];
    metadata: Record<string, string>;
  }): Observable<any>;

  deleteEduRstItemBatch(data: {
    result: any[];
    metadata: Record<string, string>;
  }): Observable<any>;

    deleteEduRstObjBatch(data: {
    result: any[];
    metadata: Record<string, string>;
  }): Observable<any>;

    searchEduRstObjBatch(data: {
    result: any[];
    metadata: Record<string, string>;
  }): Observable<any>;
}

@Injectable()
export class GrpcEduPerRstService {
  private createGrpcClient(): ClientGrpc {
    return ClientProxyFactory.create({
      transport: Transport.GRPC,
      options: {
        url: process.env.HOST_RGPC_HR,
        package: ['hr.edu.edu_per_rst'],
        protoPath: [
          join(
            __dirname,
            '..',
            '..',
            '..',
            '..',
            '..',
            '..',
            'proto',
            'hr',
            'edu',
            'edu_per_rst.proto',
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

  searchEduPerRst(
    result: any,
    metadata: Record<string, string> = {},
  ): Observable<any> {
    const client = this.createGrpcClient();
    const metadataService =
      client.getService<HrEduPerRstService>('HrEduPerRstService');
    return metadataService.searchEduPerRst({ result, metadata }).pipe(
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

  auEduPerRst(
    info: any,
    dataRstCost: any,
    dataRstItem: any,
    dataEduPerObj: any,
    metadata: Record<string, string> = {},
  ): Observable<any> {
    const client = this.createGrpcClient();
    const metadataService =
      client.getService<HrEduPerRstService>('HrEduPerRstService');
    return metadataService
      .auEduPerRst({ info, dataRstCost, dataRstItem, dataEduPerObj, metadata })
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

  deleteEduPerRst(
    info: any,
    dataRstCost: any,
    dataRstItem: any,
    metadata: Record<string, string> = {},
  ): Observable<any> {
    const client = this.createGrpcClient();
    const metadataService =
      client.getService<HrEduPerRstService>('HrEduPerRstService');
    return metadataService
      .deleteEduPerRst({ info, dataRstCost, dataRstItem, metadata })
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

  deleteEduRstCost(
    result: any,
    metadata: Record<string, string> = {},
  ): Observable<any> {
    const client = this.createGrpcClient();
    const metadataService =
      client.getService<HrEduPerRstService>('HrEduPerRstService');
    return metadataService.deleteEduRstCost({ result, metadata }).pipe(
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

  deleteEduRstItem(
    result: any,
    metadata: Record<string, string> = {},
  ): Observable<any> {
    const client = this.createGrpcClient();
    const metadataService =
      client.getService<HrEduPerRstService>('HrEduPerRstService');
    return metadataService.deleteEduRstItem({ result, metadata }).pipe(
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

  searchEduCostRst(
    result: any,
    metadata: Record<string, string> = {},
  ): Observable<any> {
    const client = this.createGrpcClient();
    const metadataService =
      client.getService<HrEduPerRstService>('HrEduPerRstService');
    return metadataService.searchEduCostRst({ result, metadata }).pipe(
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

  searchEduItemRst(
    result: any,
    metadata: Record<string, string> = {},
  ): Observable<any> {
    const client = this.createGrpcClient();
    const metadataService =
      client.getService<HrEduPerRstService>('HrEduPerRstService');
    return metadataService.searchEduItemRst({ result, metadata }).pipe(
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

  searchEduRst(
    result: any,
    metadata: Record<string, string> = {},
  ): Observable<any> {
    const client = this.createGrpcClient();
    const metadataService =
      client.getService<HrEduPerRstService>('HrEduPerRstService');
    return metadataService.searchEduRst({ result, metadata }).pipe(
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

  searchEduRstEnd(
    result: any,
    metadata: Record<string, string> = {},
  ): Observable<any> {
    const client = this.createGrpcClient();
    const metadataService =
      client.getService<HrEduPerRstService>('HrEduPerRstService');
    return metadataService.searchEduRstEnd({ result, metadata }).pipe(
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

  searchEduRstBatch(
    result: any,
    metadata: Record<string, string> = {},
  ): Observable<any> {
    const client = this.createGrpcClient();
    const metadataService =
      client.getService<HrEduPerRstService>('HrEduPerRstService');
    return metadataService.searchEduRstBatch({ result, metadata }).pipe(
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

  auEduRstEnd(
    result: any,
    metadata: Record<string, string> = {},
  ): Observable<any> {
    const client = this.createGrpcClient();
    const metadataService =
      client.getService<HrEduPerRstService>('HrEduPerRstService');

    return metadataService.auEduRstEnd({ result, metadata }).pipe(
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

  auEduRstBatch(
    info: any,
    dataRstCost: any,
    dataRstItem: any,
    dataEduPerObj: any,
    metadata: Record<string, string> = {},
  ): Observable<any> {
    const client = this.createGrpcClient();
    const metadataService =
      client.getService<HrEduPerRstService>('HrEduPerRstService');
    return metadataService
      .auEduRstBatch({
        info,
        dataRstCost,
        dataRstItem,
        dataEduPerObj,
        metadata,
      })
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

  searchEduCostRstBatch(
    result: any,
    metadata: Record<string, string> = {},
  ): Observable<any> {
    const client = this.createGrpcClient();
    const metadataService =
      client.getService<HrEduPerRstService>('HrEduPerRstService');
    return metadataService.searchEduCostRstBatch({ result, metadata }).pipe(
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

  searchEduItemRstBatch(
    result: any,
    metadata: Record<string, string> = {},
  ): Observable<any> {
    const client = this.createGrpcClient();
    const metadataService =
      client.getService<HrEduPerRstService>('HrEduPerRstService');
    return metadataService.searchEduItemRstBatch({ result, metadata }).pipe(
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

  deleteEduRstCostBatch(
    result: any,
    metadata: Record<string, string> = {},
  ): Observable<any> {
    const client = this.createGrpcClient();
    const metadataService =
      client.getService<HrEduPerRstService>('HrEduPerRstService');
    return metadataService.deleteEduRstCostBatch({ result, metadata }).pipe(
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

  deleteEduRstItemBatch(
    result: any,
    metadata: Record<string, string> = {},
  ): Observable<any> {
    const client = this.createGrpcClient();
    const metadataService =
      client.getService<HrEduPerRstService>('HrEduPerRstService');
    return metadataService.deleteEduRstItemBatch({ result, metadata }).pipe(
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

  deleteEduRstObjBatch(
    result: any,
    metadata: Record<string, string> = {},
  ): Observable<any> {
    const client = this.createGrpcClient();
    const metadataService =
      client.getService<HrEduPerRstService>('HrEduPerRstService');
    return metadataService.deleteEduRstObjBatch({ result, metadata }).pipe(
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

    searchEduRstObjBatch(
    result: any,
    metadata: Record<string, string> = {},
  ): Observable<any> {
    const client = this.createGrpcClient();
    const metadataService =
      client.getService<HrEduPerRstService>('HrEduPerRstService');
    return metadataService.searchEduRstObjBatch({ result, metadata }).pipe(
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
