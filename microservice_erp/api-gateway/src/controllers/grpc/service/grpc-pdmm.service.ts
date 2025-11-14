import { Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import {
    QueryOutReqListRequest, OutReqRequest, OutReqItemsRequest, SPDMMOutProcItemRequest,
    SCOMSourceDailyJumpQueryRequest, SPDMMOutReqItemListRequest, SMaterialQRStockOutCheckRequest,
    CheckLogsTFIFOTempRequest, OutReqSeqRequest, OutReqCheckRequest,
    QueryOutReqItemListRequest, SPDMMOutReqCancelRequest, SPDMMOutReqItemStockRequest, SCOMConfirmRequest
    , ProdPlanRequest,
    SPDMMOutProcItemQRequest,
    SPDMPSProdPlanStockQueryRequest
} from '../interface/pdmm/outReqListQuery.interface';
import { join } from 'path';
import { map, catchError } from 'rxjs/operators';
import 'dotenv/config';
import { error } from 'console';
interface OutReqListQueryService {
    QueryOutReqList(data: { result: QueryOutReqListRequest; metadata: Record<string, string> }): Observable<any>;
}
interface OutReqItemListQueryService {
    QueryOutReqItemList(data: { result: QueryOutReqItemListRequest; metadata: Record<string, string> }): Observable<any>;
    SPDMMOutProcItemListQuery(data: { result: SPDMMOutProcItemRequest; metadata: Record<string, string> }): Observable<any>;

}
interface ScanPdmmOutProcService {
    SCOMSourceDailyJumpQuery(data: { result: SCOMSourceDailyJumpQueryRequest; metadata: Record<string, string> }): Observable<any>;
    SPDMMOutReqItemList(data: { result: SPDMMOutReqItemListRequest; metadata: Record<string, string> }): Observable<any>;
    SMaterialQRStockOutCheck(data: { result: SMaterialQRStockOutCheckRequest; metadata: Record<string, string> }): Observable<any>;
    CheckLogsTFIFOTemp(data: { result: CheckLogsTFIFOTempRequest; metadata: Record<string, string> }): Observable<any>;
    DCheckLogsTFIFOTemp(data: { result: any; metadata: Record<string, string> }): Observable<any>;
    SPDMMOutProcItemQuery(data: { result: SPDMMOutProcItemQRequest; metadata: Record<string, string> }): Observable<any>;
}
interface OutReqService {
    AOutReq(data: { result: OutReqRequest, resultItems: OutReqItemsRequest[], resultCheck: OutReqCheckRequest, metadata: Record<string, string> }): Observable<any>;
    DOutReq(data: { result: OutReqRequest, resultItems: OutReqItemsRequest[], resultCheck: OutReqCheckRequest, metadata: Record<string, string> }): Observable<any>;
    DOutReqItem(data: { resultItems: OutReqItemsRequest[], resultCheck: OutReqCheckRequest, metadata: Record<string, string> }): Observable<any>;
    AOutReqItem(data: { resultItems: OutReqItemsRequest[], resultCheck: OutReqCheckRequest, metadata: Record<string, string> }): Observable<any>;
    UOutReq(data: { result: OutReqRequest, resultItems: OutReqItemsRequest[], resultCheck: OutReqCheckRequest, metadata: Record<string, string> }): Observable<any>;
    QOutReq(data: { result: OutReqSeqRequest, metadata: Record<string, string> }): Observable<any>;
    QOutReqItem(data: { result: OutReqSeqRequest, metadata: Record<string, string> }): Observable<any>;
}
interface SPDMMOutReqItemStockQueryService {
    SPDMMOutReqItemStockQuery(data: { result: SPDMMOutReqItemStockRequest, metadata: Record<string, string> }): Observable<any>;
}
interface SCOMConfirmService {
    SCOMConfirm(data: { result: SCOMConfirmRequest, metadata: Record<string, string> }): Observable<any>;
}
interface SPDMMOutReqCancelService {
    SPDMMOutReqCancel(data: { result: SPDMMOutReqCancelRequest, metadata: Record<string, string> }): Observable<any>;
}

interface PdmsProdPlanService {
    SPDMPSProdPlanA(data: { result: ProdPlanRequest[], metadata: Record<string, string> }): Observable<any>;
    SPDMPSProdPlanD(data: { result: ProdPlanRequest[], metadata: Record<string, string> }): Observable<any>;
    SPDMPSProdPlanU(data: { result: ProdPlanRequest[], metadata: Record<string, string> }): Observable<any>;
    SPDMPSProdPlanStockQuery(data: { result: SPDMPSProdPlanStockQueryRequest[], metadata: Record<string, string> }): Observable<any>;
    SPDMPSProdPlanConfirm(data: { result: any[], metadata: Record<string, string> }): Observable<any>;
    SPDMPSProdPlanSemiGoodCrt(data: { result: any[], metadata: Record<string, string> }): Observable<any>;
    SPDMPSProdPlanQuery(data: { result: any[], metadata: Record<string, string> }): Observable<any>;
}
interface PdsfcListService {
    SPDSFCWorkOrderQ(data: { result: any, metadata: Record<string, string> }): Observable<any>;
    SPDSFCMatProgressListQ(data: { result: any, metadata: Record<string, string> }): Observable<any>;
    SPDSFCWorkReportQ(data: { result: any, metadata: Record<string, string> }): Observable<any>;
}


interface PdsfcWorkReportService {
    SPDSFCWorkReportQ2(data: { result: any, metadata: Record<string, string> }): Observable<any>;
    SCOMSourceDailyQ(data: { result: any, metadata: Record<string, string> }): Observable<any>;
    SPDSFCWorkReportMatQ(data: { result: any, metadata: Record<string, string> }): Observable<any>;
    SPDSFCWorkReportToolQ(data: { result: any, metadata: Record<string, string> }): Observable<any>;
    SPDSFCWorkReportWorkEmpQ(data: { result: any, metadata: Record<string, string> }): Observable<any>;
    SPDSFCWorkReportNonWorkQ(data: { result: any, metadata: Record<string, string> }): Observable<any>;
    SLGInOutDailyQ(data: { result: any, metadata: Record<string, string> }): Observable<any>;
    SLGInOutDailyItemQ(data: { result: any, metadata: Record<string, string> }): Observable<any>;
    SPDSFCWorkReportAUD(data: { result: any[], metadata: Record<string, string> }): Observable<any>;
    SPDSFCWorkReportMatAUD(data: { result: any[], metadata: Record<string, string> }): Observable<any>;
    SPDSFCWorkReportWorkEmpAUD(data: { result: any[], metadata: Record<string, string> }): Observable<any>;
    SLGLotNoMasterAUD(data: { result: any[], header: any, metadata: Record<string, string> }): Observable<any>;
    SPDSFCWorkReportNonWorkAUD(data: { result: any[], metadata: Record<string, string> }): Observable<any>;
    SLGInOutDailyD(data: { result: any[], metadata: Record<string, string> }): Observable<any>;
    SLGInOutDailyDItem(data: { result: any[], metadata: Record<string, string> }): Observable<any>;
    SPDSFCWorkReportMatQCheck(data: { result: any, metadata: Record<string, string> }): Observable<any>;
}




@Injectable()
export class GrpcPdmmService {
    private createGrpcClient(): ClientGrpc {
        return ClientProxyFactory.create({
            transport: Transport.GRPC,
            options: {
                url: process.env.HOST_RGPC_PDMM ?? 'localhost:5002',
                package: [
                    'scom_cofirm', 'spdmm.out_req_cancel', 'spdmm.out_req_item_stock_query',
                    'spdmm.out_req_list_query', 'spdmm.out_req', 'spdmm.out_req_item_list_query',
                    'scan.pdmm_out_proc', 'pdmm.pdms_prod_plan', 'pdmm.pdsfc_list', 'pdmm.pdsfc_work_report'
                ],
                protoPath: [
                    join(__dirname, '..', '..', '..', '..', '..', 'proto', 'produce', 'pdmm', 'scom_confirm.proto'),
                    join(__dirname, '..', '..', '..', '..', '..', 'proto', 'produce', 'pdmm', 'spdmm_out_req_cancel.proto'),
                    join(__dirname, '..', '..', '..', '..', '..', 'proto', 'produce', 'pdmm', 'spdmm_out_req_item_stock_query.proto'),
                    join(__dirname, '..', '..', '..', '..', '..', 'proto', 'produce', 'pdmm', 'spdmm_out_req_list_query.proto'),
                    join(__dirname, '..', '..', '..', '..', '..', 'proto', 'produce', 'pdmm', 'spdmm_out_req.proto'),
                    join(__dirname, '..', '..', '..', '..', '..', 'proto', 'produce', 'pdmm', 'spdmm_out_req_item_list_query.proto'),
                    join(__dirname, '..', '..', '..', '..', '..', 'proto', 'produce', 'pdmm', 'scan_pdmm_out_proc.proto'),
                    join(__dirname, '..', '..', '..', '..', '..', 'proto', 'produce', 'pdmm', 'pdms_prod_plan.proto'),
                    join(__dirname, '..', '..', '..', '..', '..', 'proto', 'produce', 'pdmm', 'pdsfc_list.proto'),
                    join(__dirname, '..', '..', '..', '..', '..', 'proto', 'produce', 'pdmm', 'pdsfc_work_report.proto'),
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
                    'grpc.max_receive_message_length': 1024 * 1024 * 1024, // 1 GB
                    'grpc.max_send_message_length': 1024 * 1024 * 1024, // 1 GB
                    'grpc.max_concurrent_streams': 500, // Tăng số lượng yêu cầu đồng thời
                    'grpc.http2.lookahead_bytes': 1024 * 1024, // Tăng số byte của bộ đệm HTTP/2 để tối ưu hiệu suất
                    'grpc.enable_http_proxy': 0, // Tắt proxy blocking
                    'grpc.max_connection_age_ms': 60000, // Tăng thời gian sống của kết nối
                    'grpc.keepalive_time_ms': 30000, // Thời gian giữ kết nối sống
                    'grpc.keepalive_timeout_ms': 20000, // Thời gian chờ kết nối keepalive
                    'grpc.initial_reconnect_backoff_ms': 1000, // Thời gian đợi khi cố gắng kết nối lại
                    'grpc.reconnect_backoff_ms': 1000, // Thời gian đợi khi kết nối lại sau khi mất kết nối
                },
            },
        }) as ClientGrpc;
    }

    QueryOutReqList(result: QueryOutReqListRequest, metadata: Record<string, string> = {}): Observable<any> {
        const client = this.createGrpcClient();
        const metadataService = client.getService<OutReqListQueryService>('OutReqListQueryService');

        return metadataService.QueryOutReqList({ result, metadata }).pipe(
            map((grpcResponse) => ({
                success: grpcResponse?.status ?? false,
                message: grpcResponse?.message || 'No message received',
                data: grpcResponse?.data || null,
            })),
            catchError((error) => {
                return new Observable((subscriber) => {
                    subscriber.next({
                        success: false,
                        message: 'Hệ thống đang bận, vui lòng thử lại sau.',
                        errorDetails: error?.message || 'Unknown error',
                    });
                    subscriber.complete();
                });
            })
        );
    }
    QOutReq(result: OutReqSeqRequest, metadata: Record<string, string> = {}): Observable<any> {
        const client = this.createGrpcClient();
        const metadataService = client.getService<OutReqService>('OutReqService');

        return metadataService.QOutReq({ result, metadata }).pipe(
            map((grpcResponse) => ({
                success: grpcResponse?.status ?? false,
                message: grpcResponse?.message || 'No message received',
                data: grpcResponse?.data || null,
            })),
            catchError((error) => {
                return new Observable((subscriber) => {
                    subscriber.next({
                        success: false,
                        message: 'Hệ thống đang bận, vui lòng thử lại sau.',
                        errorDetails: error?.message || 'Unknown error',
                    });
                    subscriber.complete();
                });
            })
        );
    }
    QOutReqItem(result: OutReqSeqRequest, metadata: Record<string, string> = {}): Observable<any> {
        const client = this.createGrpcClient();
        const metadataService = client.getService<OutReqService>('OutReqService');

        return metadataService.QOutReqItem({ result, metadata }).pipe(
            map((grpcResponse) => ({
                success: grpcResponse?.status ?? false,
                message: grpcResponse?.message || 'No message received',
                data: grpcResponse?.data || null,
            })),
            catchError((error) => {
                return new Observable((subscriber) => {
                    subscriber.next({
                        success: false,
                        message: 'Hệ thống đang bận, vui lòng thử lại sau.',
                        errorDetails: error?.message || 'Unknown error',
                    });
                    subscriber.complete();
                });
            })
        );
    }
    AOutReq(result: OutReqRequest, resultItems: OutReqItemsRequest[], resultCheck: OutReqCheckRequest, metadata: Record<string, string> = {}): Observable<any> {
        const client = this.createGrpcClient();
        const metadataService = client.getService<OutReqService>('OutReqService');

        return metadataService.AOutReq({ result, resultItems, resultCheck, metadata }).pipe(
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
            })
        );
    }
    DOutReq(result: OutReqRequest, resultItems: OutReqItemsRequest[], resultCheck: OutReqCheckRequest, metadata: Record<string, string> = {}): Observable<any> {
        const client = this.createGrpcClient();
        const metadataService = client.getService<OutReqService>('OutReqService');

        return metadataService.DOutReq({ result, resultItems, resultCheck, metadata }).pipe(
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
            })
        );
    }
    DOutReqItem(resultItems: OutReqItemsRequest[], resultCheck: OutReqCheckRequest, metadata: Record<string, string> = {}): Observable<any> {
        const client = this.createGrpcClient();
        const metadataService = client.getService<OutReqService>('OutReqService');

        return metadataService.DOutReqItem({ resultItems, resultCheck, metadata }).pipe(
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
            })
        );
    }
    AOutReqItem(resultItems: OutReqItemsRequest[], resultCheck: OutReqCheckRequest, metadata: Record<string, string> = {}): Observable<any> {
        const client = this.createGrpcClient();
        const metadataService = client.getService<OutReqService>('OutReqService');

        return metadataService.AOutReqItem({ resultItems, resultCheck, metadata }).pipe(
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
            })
        );
    }
    UOutReq(result: OutReqRequest, resultItems: OutReqItemsRequest[], resultCheck: OutReqCheckRequest, metadata: Record<string, string> = {}): Observable<any> {
        const client = this.createGrpcClient();
        const metadataService = client.getService<OutReqService>('OutReqService');

        return metadataService.UOutReq({ result, resultItems, resultCheck, metadata }).pipe(
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
            })
        );
    }
    SPDMMOutReqItemStockQuery(result: SPDMMOutReqItemStockRequest, metadata: Record<string, string> = {}): Observable<any> {
        const client = this.createGrpcClient();
        const metadataService = client.getService<SPDMMOutReqItemStockQueryService>('SPDMMOutReqItemStockQueryService');

        return metadataService.SPDMMOutReqItemStockQuery({ result, metadata }).pipe(
            map((grpcResponse) => ({
                success: grpcResponse?.status ?? false,
                message: grpcResponse?.message || 'No message received',
                data: grpcResponse?.data || null,
            })),
            catchError((error) => {
                return new Observable((subscriber) => {
                    subscriber.next({
                        success: false,
                        message: 'Hệ thống đang bận, vui lòng thử lại sau.',
                        errorDetails: error?.message || 'Unknown error',
                    });
                    subscriber.complete();
                });
            })
        );
    }
    SCOMConfirm(result: SCOMConfirmRequest, metadata: Record<string, string> = {}): Observable<any> {
        const client = this.createGrpcClient();
        const metadataService = client.getService<SCOMConfirmService>('SCOMConfirmService');

        return metadataService.SCOMConfirm({ result, metadata }).pipe(
            map((grpcResponse) => ({
                success: grpcResponse?.status ?? false,
                message: grpcResponse?.message || 'No message received',
                data: grpcResponse?.data || null,
            })),
            catchError((error) => {
                return new Observable((subscriber) => {
                    subscriber.next({
                        success: false,
                        message: 'Hệ thống đang bận, vui lòng thử lại sau.',
                        errorDetails: error?.message || 'Unknown error',
                    });
                    subscriber.complete();
                });
            })
        );
    }
    SPDMMOutReqCancel(result: SPDMMOutReqCancelRequest, metadata: Record<string, string> = {}): Observable<any> {
        const client = this.createGrpcClient();
        const metadataService = client.getService<SPDMMOutReqCancelService>('SPDMMOutReqCancelService');

        return metadataService.SPDMMOutReqCancel({ result, metadata }).pipe(
            map((grpcResponse) => ({
                success: grpcResponse?.status ?? false,
                message: grpcResponse?.message || 'No message received',
                data: grpcResponse?.data || null,
            })),
            catchError((error) => {
                return new Observable((subscriber) => {
                    subscriber.next({
                        success: false,
                        message: 'Hệ thống đang bận, vui lòng thử lại sau.',
                        errorDetails: error?.message || 'Unknown error',
                    });
                    subscriber.complete();
                });
            })
        );
    }






    QueryOutReqItemList(result: QueryOutReqItemListRequest, metadata: Record<string, string> = {}): Observable<any> {
        const client = this.createGrpcClient();
        const metadataService = client.getService<OutReqItemListQueryService>('OutReqItemListQueryService');
        return metadataService.QueryOutReqItemList({ result, metadata }).pipe(
            map((grpcResponse) => ({
                success: grpcResponse?.status ?? false,
                message: grpcResponse?.message || 'No message received',
                data: grpcResponse?.data || null,
            })),
            catchError((error) => {
                return new Observable((subscriber) => {
                    subscriber.next({
                        success: false,
                        message: 'Hệ thống đang bận, vui lòng thử lại sau.',
                        errorDetails: error?.message || 'Unknown error',
                    });
                    subscriber.complete();
                });
            })
        );
    }
    SPDMMOutProcItemListQuery(result: SPDMMOutProcItemRequest, metadata: Record<string, string> = {}): Observable<any> {
        const client = this.createGrpcClient();
        const metadataService = client.getService<OutReqItemListQueryService>('OutReqItemListQueryService');
        return metadataService.SPDMMOutProcItemListQuery({ result, metadata }).pipe(
            map((grpcResponse) => ({
                success: grpcResponse?.status ?? false,
                message: grpcResponse?.message || 'No message received',
                data: grpcResponse?.data || null,
            })),
            catchError((error) => {
                return new Observable((subscriber) => {
                    subscriber.next({
                        success: false,
                        message: 'Hệ thống đang bận, vui lòng thử lại sau.',
                        errorDetails: error?.message || 'Unknown error',
                    });
                    subscriber.complete();
                });
            })
        );
    }
    SCOMSourceDailyJumpQuery(result: SCOMSourceDailyJumpQueryRequest, metadata: Record<string, string> = {}): Observable<any> {
        const client = this.createGrpcClient();
        const metadataService = client.getService<ScanPdmmOutProcService>('ScanPdmmOutProcService');
        return metadataService.SCOMSourceDailyJumpQuery({ result, metadata }).pipe(
            map((grpcResponse) => ({
                success: grpcResponse?.status ?? false,
                message: grpcResponse?.message || 'No message received',
                data: grpcResponse?.data || null,
            })),
            catchError((error) => {
                return new Observable((subscriber) => {
                    subscriber.next({
                        success: false,
                        message: 'Hệ thống đang bận, vui lòng thử lại sau.',
                        errorDetails: error?.message || 'Unknown error',
                    });
                    subscriber.complete();
                });
            })
        );
    }
    SPDMMOutReqItemList(result: SPDMMOutReqItemListRequest, metadata: Record<string, string> = {}): Observable<any> {
        const client = this.createGrpcClient();
        const metadataService = client.getService<ScanPdmmOutProcService>('ScanPdmmOutProcService');
        return metadataService.SPDMMOutReqItemList({ result, metadata }).pipe(
            map((grpcResponse) => ({
                success: grpcResponse?.status ?? false,
                message: grpcResponse?.message || 'No message received',
                data: grpcResponse?.data || null,
            })),
            catchError((error) => {
                return new Observable((subscriber) => {
                    subscriber.next({
                        success: false,
                        message: 'Hệ thống đang bận, vui lòng thử lại sau.',
                        errorDetails: error?.message || 'Unknown error',
                    });
                    subscriber.complete();
                });
            })
        );
    }



    SMaterialQRStockOutCheck(result: SMaterialQRStockOutCheckRequest, metadata: Record<string, string> = {}): Observable<any> {
        const client = this.createGrpcClient();
        const metadataService = client.getService<ScanPdmmOutProcService>('ScanPdmmOutProcService');
        return metadataService.SMaterialQRStockOutCheck({ result, metadata }).pipe(
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
            })
        );
    }

    CheckLogsTFIFOTemp(result: CheckLogsTFIFOTempRequest, metadata: Record<string, string> = {}): Observable<any> {
        const client = this.createGrpcClient();
        const metadataService = client.getService<ScanPdmmOutProcService>('ScanPdmmOutProcService');
        return metadataService.CheckLogsTFIFOTemp({ result, metadata }).pipe(
            map((grpcResponse) => ({
                success: grpcResponse?.status ?? false,
                message: grpcResponse?.message || 'No message received',
                data: grpcResponse?.data || null,
            })),
            catchError((error) => {
                return new Observable((subscriber) => {
                    subscriber.next({
                        success: false,
                        message: 'Hệ thống đang bận, vui lòng thử lại sau.',
                        errorDetails: error?.message || 'Unknown error',
                    });
                    subscriber.complete();
                });
            })
        );
    }
    DCheckLogsTFIFOTemp(result: any, metadata: Record<string, string> = {}): Observable<any> {
        const client = this.createGrpcClient();
        const metadataService = client.getService<ScanPdmmOutProcService>('ScanPdmmOutProcService');
        return metadataService.DCheckLogsTFIFOTemp({ result, metadata }).pipe(
            map((grpcResponse) => ({
                success: grpcResponse?.status ?? false,
                message: grpcResponse?.message || 'No message received',
                data: grpcResponse?.data || null,
            })),
            catchError((error) => {
                return new Observable((subscriber) => {
                    subscriber.next({
                        success: false,
                        message: 'Hệ thống đang bận, vui lòng thử lại sau.',
                        errorDetails: error?.message || 'Unknown error',
                    });
                    subscriber.complete();
                });
            })
        );
    }
    SPDMMOutProcItemQuery(result: SPDMMOutProcItemQRequest, metadata: Record<string, string> = {}): Observable<any> {
        const client = this.createGrpcClient();
        const metadataService = client.getService<ScanPdmmOutProcService>('ScanPdmmOutProcService');
        return metadataService.SPDMMOutProcItemQuery({ result, metadata }).pipe(
            map((grpcResponse) => ({
                success: grpcResponse?.status ?? false,
                message: grpcResponse?.message || 'No message received',
                data: grpcResponse?.data || null,
            })),
            catchError((error) => {
                return new Observable((subscriber) => {
                    subscriber.next({
                        success: false,
                        message: 'Hệ thống đang bận, vui lòng thử lại sau.',
                        errorDetails: error?.message || 'Unknown error',
                    });
                    subscriber.complete();
                });
            })
        );
    }




    /*  */


    SPDMPSProdPlanA(result: ProdPlanRequest[], metadata: Record<string, string> = {}): Observable<any> {
        const client = this.createGrpcClient();
        const metadataService = client.getService<PdmsProdPlanService>('PdmsProdPlanService');

        return metadataService.SPDMPSProdPlanA({ result, metadata }).pipe(
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
            })
        );
    }
    SPDMPSProdPlanD(result: ProdPlanRequest[], metadata: Record<string, string> = {}): Observable<any> {
        const client = this.createGrpcClient();
        const metadataService = client.getService<PdmsProdPlanService>('PdmsProdPlanService');

        return metadataService.SPDMPSProdPlanD({ result, metadata }).pipe(
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
            })
        );
    }
    SPDMPSProdPlanU(result: ProdPlanRequest[], metadata: Record<string, string> = {}): Observable<any> {
        const client = this.createGrpcClient();
        const metadataService = client.getService<PdmsProdPlanService>('PdmsProdPlanService');

        return metadataService.SPDMPSProdPlanU({ result, metadata }).pipe(
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
            })
        );
    }

    SPDMPSProdPlanStockQuery(result: SPDMPSProdPlanStockQueryRequest[], metadata: Record<string, string> = {}): Observable<any> {
        const client = this.createGrpcClient();
        const metadataService = client.getService<PdmsProdPlanService>('PdmsProdPlanService');

        return metadataService.SPDMPSProdPlanStockQuery({ result, metadata }).pipe(
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
            })
        );
    }


    SPDSFCWorkOrderQ(result: any, metadata: Record<string, string> = {}): Observable<any> {
        const client = this.createGrpcClient();
        const metadataService = client.getService<PdsfcListService>('PdsfcListService');
        return metadataService.SPDSFCWorkOrderQ({ result, metadata }).pipe(
            map((grpcResponse) => ({
                success: grpcResponse?.status ?? false,
                message: grpcResponse?.message || 'No message received',
                data: grpcResponse?.data || null,
            })),
            catchError((error) => {
                return new Observable((subscriber) => {
                    subscriber.next({
                        success: false,
                        message: 'Hệ thống đang bận, vui lòng thử lại sau.',
                        errorDetails: error?.message || 'Unknown error',
                    });
                    subscriber.complete();
                });
            })
        );
    }
    SPDSFCMatProgressListQ(result: any, metadata: Record<string, string> = {}): Observable<any> {
        const client = this.createGrpcClient();
        const metadataService = client.getService<PdsfcListService>('PdsfcListService');
        return metadataService.SPDSFCMatProgressListQ({ result, metadata }).pipe(
            map((grpcResponse) => ({
                success: grpcResponse?.status ?? false,
                message: grpcResponse?.message || 'No message received',
                data: grpcResponse?.data || null,
            })),
            catchError((error) => {
                return new Observable((subscriber) => {
                    subscriber.next({
                        success: false,
                        message: 'Hệ thống đang bận, vui lòng thử lại sau.',
                        errorDetails: error?.message || 'Unknown error',
                    });
                    subscriber.complete();
                });
            })
        );
    }
    SPDSFCWorkReportQ(result: any, metadata: Record<string, string> = {}): Observable<any> {
        const client = this.createGrpcClient();
        const metadataService = client.getService<PdsfcListService>('PdsfcListService');
        return metadataService.SPDSFCWorkReportQ({ result, metadata }).pipe(
            map((grpcResponse) => ({
                success: grpcResponse?.status ?? false,
                message: grpcResponse?.message || 'No message received',
                data: grpcResponse?.data || null,
            })),
            catchError((error) => {
                return new Observable((subscriber) => {
                    subscriber.next({
                        success: false,
                        message: 'Hệ thống đang bận, vui lòng thử lại sau.',
                        errorDetails: error?.message || 'Unknown error',
                    });
                    subscriber.complete();
                });
            })
        );
    }
    SPDMPSProdPlanConfirm(result: any, metadata: Record<string, string> = {}): Observable<any> {
        const client = this.createGrpcClient();
        const metadataService = client.getService<PdmsProdPlanService>('PdmsProdPlanService');
        return metadataService.SPDMPSProdPlanConfirm({ result, metadata }).pipe(
            map((grpcResponse) => ({
                success: grpcResponse?.status ?? false,
                message: grpcResponse?.message || 'No message received',
                data: grpcResponse?.data || null,
            })),
            catchError((error) => {
                return new Observable((subscriber) => {
                    subscriber.next({
                        success: false,
                        message: 'Hệ thống đang bận, vui lòng thử lại sau.',
                        errorDetails: error?.message || 'Unknown error',
                    });
                    subscriber.complete();
                });
            })
        );
    }
    SPDMPSProdPlanSemiGoodCrt(result: any, metadata: Record<string, string> = {}): Observable<any> {
        const client = this.createGrpcClient();
        const metadataService = client.getService<PdmsProdPlanService>('PdmsProdPlanService');
        return metadataService.SPDMPSProdPlanSemiGoodCrt({ result, metadata }).pipe(
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
                    });
                    subscriber.complete();
                });
            })
        );
    }
    SPDMPSProdPlanQuery(result: any, metadata: Record<string, string> = {}): Observable<any> {
        const client = this.createGrpcClient();
        const metadataService = client.getService<PdmsProdPlanService>('PdmsProdPlanService');
        return metadataService.SPDMPSProdPlanQuery({ result, metadata }).pipe(
            map((grpcResponse) => ({
                success: grpcResponse?.status ?? false,
                message: grpcResponse?.message || 'No message received',
                data: grpcResponse?.data || null,
            })),
            catchError((error) => {
                return new Observable((subscriber) => {
                    subscriber.next({
                        success: false,
                        message: 'Hệ thống đang bận, vui lòng thử lại sau.',
                        errorDetails: error?.message || 'Unknown error',
                    });
                    subscriber.complete();
                });
            })
        );
    }



    SPDSFCWorkReportQ2(result: any, metadata: Record<string, string> = {}): Observable<any> {
        const client = this.createGrpcClient();
        console.log('result', result)
        const metadataService = client.getService<PdsfcWorkReportService>('PdsfcWorkReportService');
        return metadataService.SPDSFCWorkReportQ2({ result, metadata }).pipe(

            map((grpcResponse) => ({
                success: grpcResponse?.status ?? false,
                message: grpcResponse?.message || 'No message received',
                data: grpcResponse?.data || null,
            })),
            catchError((error) => {
                return new Observable((subscriber) => {
                    subscriber.next({
                        success: false,
                        message: 'Hệ thống đang bận, vui lòng thử lại sau.',
                        errorDetails: error?.message || 'Unknown error',
                    });
                    subscriber.complete();
                });
            })
        );
    }

    SCOMSourceDailyQ(result: any, metadata: Record<string, string> = {}): Observable<any> {
        const client = this.createGrpcClient();
        const metadataService = client.getService<PdsfcWorkReportService>('PdsfcWorkReportService');
        return metadataService.SCOMSourceDailyQ({ result, metadata }).pipe(
            map((grpcResponse) => ({
                success: grpcResponse?.status ?? false,
                message: grpcResponse?.message || 'No message received',
                data: grpcResponse?.data || null,
            })),
            catchError((error) => {
                return new Observable((subscriber) => {
                    subscriber.next({
                        success: false,
                        message: 'Hệ thống đang bận, vui lòng thử lại sau.',
                        errorDetails: error?.message || 'Unknown error',
                    });
                    subscriber.complete();
                });
            })
        );
    }
    SPDSFCWorkReportMatQ(result: any, metadata: Record<string, string> = {}): Observable<any> {
        const client = this.createGrpcClient();
        const metadataService = client.getService<PdsfcWorkReportService>('PdsfcWorkReportService');
        return metadataService.SPDSFCWorkReportMatQ({ result, metadata }).pipe(
            map((grpcResponse) => ({
                success: grpcResponse?.status ?? false,
                message: grpcResponse?.message || 'No message received',
                data: grpcResponse?.data || null,
            })),
            catchError((error) => {
                return new Observable((subscriber) => {
                    subscriber.next({
                        success: false,
                        message: 'Hệ thống đang bận, vui lòng thử lại sau.',
                        errorDetails: error?.message || 'Unknown error',
                    });
                    subscriber.complete();
                });
            })
        );
    }
    SPDSFCWorkReportToolQ(result: any, metadata: Record<string, string> = {}): Observable<any> {
        const client = this.createGrpcClient();
        const metadataService = client.getService<PdsfcWorkReportService>('PdsfcWorkReportService');
        return metadataService.SPDSFCWorkReportToolQ({ result, metadata }).pipe(
            map((grpcResponse) => ({
                success: grpcResponse?.status ?? false,
                message: grpcResponse?.message || 'No message received',
                data: grpcResponse?.data || null,
            })),
            catchError((error) => {
                return new Observable((subscriber) => {
                    subscriber.next({
                        success: false,
                        message: 'Hệ thống đang bận, vui lòng thử lại sau.',
                        errorDetails: error?.message || 'Unknown error',
                    });
                    subscriber.complete();
                });
            })
        );
    }
    SPDSFCWorkReportWorkEmpQ(result: any, metadata: Record<string, string> = {}): Observable<any> {
        const client = this.createGrpcClient();
        const metadataService = client.getService<PdsfcWorkReportService>('PdsfcWorkReportService');
        return metadataService.SPDSFCWorkReportWorkEmpQ({ result, metadata }).pipe(
            map((grpcResponse) => ({
                success: grpcResponse?.status ?? false,
                message: grpcResponse?.message || 'No message received',
                data: grpcResponse?.data || null,
            })),
            catchError((error) => {
                return new Observable((subscriber) => {
                    subscriber.next({
                        success: false,
                        message: 'Hệ thống đang bận, vui lòng thử lại sau.',
                        errorDetails: error?.message || 'Unknown error',
                    });
                    subscriber.complete();
                });
            })
        );
    }
    SPDSFCWorkReportNonWorkQ(result: any, metadata: Record<string, string> = {}): Observable<any> {
        const client = this.createGrpcClient();
        const metadataService = client.getService<PdsfcWorkReportService>('PdsfcWorkReportService');
        return metadataService.SPDSFCWorkReportNonWorkQ({ result, metadata }).pipe(
            map((grpcResponse) => ({
                success: grpcResponse?.status ?? false,
                message: grpcResponse?.message || 'No message received',
                data: grpcResponse?.data || null,
            })),
            catchError((error) => {
                return new Observable((subscriber) => {
                    subscriber.next({
                        success: false,
                        message: 'Hệ thống đang bận, vui lòng thử lại sau.',
                        errorDetails: error?.message || 'Unknown error',
                    });
                    subscriber.complete();
                });
            })
        );
    }
    SLGInOutDailyQ(result: any, metadata: Record<string, string> = {}): Observable<any> {
        const client = this.createGrpcClient();
        const metadataService = client.getService<PdsfcWorkReportService>('PdsfcWorkReportService');
        return metadataService.SLGInOutDailyQ({ result, metadata }).pipe(
            map((grpcResponse) => ({
                success: grpcResponse?.status ?? false,
                message: grpcResponse?.message || 'No message received',
                data: grpcResponse?.data || null,
            })),
            catchError((error) => {
                return new Observable((subscriber) => {
                    subscriber.next({
                        success: false,
                        message: 'Hệ thống đang bận, vui lòng thử lại sau.',
                        errorDetails: error?.message || 'Unknown error',
                    });
                    subscriber.complete();
                });
            })
        );
    }
    SLGInOutDailyItemQ(result: any, metadata: Record<string, string> = {}): Observable<any> {
        const client = this.createGrpcClient();
        const metadataService = client.getService<PdsfcWorkReportService>('PdsfcWorkReportService');
        return metadataService.SLGInOutDailyItemQ({ result, metadata }).pipe(
            map((grpcResponse) => ({
                success: grpcResponse?.status ?? false,
                message: grpcResponse?.message || 'No message received',
                data: grpcResponse?.data || null,
            })),
            catchError((error) => {
                return new Observable((subscriber) => {
                    subscriber.next({
                        success: false,
                        message: 'Hệ thống đang bận, vui lòng thử lại sau.',
                        errorDetails: error?.message || 'Unknown error',
                    });
                    subscriber.complete();
                });
            })
        );
    }
    SPDSFCWorkReportAUD(result: any[], metadata: Record<string, string> = {}): Observable<any> {
        const client = this.createGrpcClient();
        const metadataService = client.getService<PdsfcWorkReportService>('PdsfcWorkReportService');

        return metadataService.SPDSFCWorkReportAUD({ result, metadata }).pipe(
            map((grpcResponse) => {
                console.log('grpcResponse', grpcResponse);
                return {
                    success: grpcResponse?.status ?? false,
                    message: grpcResponse?.message || 'No message received',
                    data: grpcResponse?.data || null,
                    errors: grpcResponse?.errors || null,
                };
            }),
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

    SPDSFCWorkReportMatAUD(result: any[], metadata: Record<string, string> = {}): Observable<any> {
        const client = this.createGrpcClient();
        const metadataService = client.getService<PdsfcWorkReportService>('PdsfcWorkReportService');
        return metadataService.SPDSFCWorkReportMatAUD({ result, metadata }).pipe(
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
            })
        );
    }
    SPDSFCWorkReportWorkEmpAUD(result: any[], metadata: Record<string, string> = {}): Observable<any> {
        const client = this.createGrpcClient();
        const metadataService = client.getService<PdsfcWorkReportService>('PdsfcWorkReportService');
        return metadataService.SPDSFCWorkReportWorkEmpAUD({ result, metadata }).pipe(
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
            })
        );
    }
    SLGLotNoMasterAUD(result: any[], header: any, metadata: Record<string, string> = {}): Observable<any> {
        const client = this.createGrpcClient();
        const metadataService = client.getService<PdsfcWorkReportService>('PdsfcWorkReportService');
        return metadataService.SLGLotNoMasterAUD({ result, header, metadata }).pipe(
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
            })
        );
    }
    SPDSFCWorkReportNonWorkAUD(result: any[], metadata: Record<string, string> = {}): Observable<any> {
        const client = this.createGrpcClient();
        const metadataService = client.getService<PdsfcWorkReportService>('PdsfcWorkReportService');
        return metadataService.SPDSFCWorkReportNonWorkAUD({ result, metadata }).pipe(
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
            })
        );
    }
    SLGInOutDailyD(result: any[], metadata: Record<string, string> = {}): Observable<any> {
        const client = this.createGrpcClient();
        const metadataService = client.getService<PdsfcWorkReportService>('PdsfcWorkReportService');
        return metadataService.SLGInOutDailyD({ result, metadata }).pipe(
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
            })
        );
    }
    SLGInOutDailyDItem(result: any[], metadata: Record<string, string> = {}): Observable<any> {
        const client = this.createGrpcClient();
        const metadataService = client.getService<PdsfcWorkReportService>('PdsfcWorkReportService');
        return metadataService.SLGInOutDailyDItem({ result, metadata }).pipe(
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
            })
        );
    }
    SPDSFCWorkReportMatQCheck(result: any, metadata: Record<string, string> = {}): Observable<any> {
        const client = this.createGrpcClient();
        const metadataService = client.getService<PdsfcWorkReportService>('PdsfcWorkReportService');
        return metadataService.SPDSFCWorkReportMatQCheck({ result, metadata }).pipe(
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
            })
        );
    }
}
