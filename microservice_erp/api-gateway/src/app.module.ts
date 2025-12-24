import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import 'dotenv/config';
import { join } from 'path';
/* WAREHOUSE_SERVICE */
import { AgingLotStockListController } from './controllers/warehouse/warehouse/agingLotStockList.controller';
import { BizStockListController } from './controllers/warehouse/warehouse/bizStockList.controller';
import { EtcInReqController } from './controllers/warehouse/warehouse/etcInReq.controller';
import { EtcOutReqController } from './controllers/warehouse/warehouse/etcOutReq.controller';
import { EtcTransReqController } from './controllers/warehouse/warehouse/etcTransReq.controller';
import { LGWHItemController } from './controllers/warehouse/warehouse/lgWHItem.controller';
import { LGWHStockClosingController } from './controllers/warehouse/warehouse/lgWHStockClosing.controller';
import { LGWHStockRealController } from './controllers/warehouse/warehouse/lgWHStockReal.controller';
import { LotMasterController } from './controllers/warehouse/warehouse/lotmaster.controller';
import { StockAgingListController } from './controllers/warehouse/warehouse/stockAgingList.controller';
import { StockDetailListController } from './controllers/warehouse/warehouse/stockDetailList.controller';
import { StockListController } from './controllers/warehouse/warehouse/stockList.controller';
import { WarehouseController } from './controllers/warehouse/warehouse/warehouse.controller';
import { DaMaterialListController } from './controllers/warehouse/basic/daMaterialList.controller';
import { CodeHelpComboQueryController } from './controllers/warehouse/codeHelp/codeHelpComboQuery.controller';
import { CodeHelpQueryController } from './controllers/warehouse/codeHelp/codeHelpQuery.controller';

import { DeliveryListController } from './controllers/warehouse/material/deliveryList.controller';
import { IQCStatusController } from './controllers/warehouse/material/iqcStatus.controller';
import { MatWHStockInController } from './controllers/warehouse/material/matWHStockIn.controller';
import { EmployeeController } from './controllers/warehouse/material/stockIn.controller';
import { StockOutController } from './controllers/warehouse/material/stockOut.controller';

/*  AUTH_SERVICE*/
import { AuthController } from './controllers/auth/auth/auths.controller';
import { LanguageController } from './controllers/auth/language/language.controller';
import { MenusController } from './controllers/auth/roles/menus.controller';
import { RootMenusController } from './controllers/auth/roles/rootMenus.controller';
import { SystemUsersController } from './controllers/auth/roles/systemUsers.controller';
import { GrpcGroupRoleService } from './controllers/grpc/service/grpc.auth.roles.group_role.service';
import { RoleGroupController } from './controllers/auth/roles/groupRole.controller';
/* PRODUTION_SERVICE */
import { BomController } from './controllers/produce/BOM/bom.controller';
import { ProductsController } from './controllers/produce/product/product.controller';
import { BarcodeChangeController } from './controllers/label-print/change-label/barcodeChangeController';
import { CustomersController } from './controllers/warehouse/customers/customers.controller';
import { IqcController } from './controllers/qc/iqc/iqc.controller';
import { PdmpsProdQueryController } from './controllers/produce/pdmpsProd/pdmpsProdQuery.controller';
import { PdmpsProdItemListQueryController } from './controllers/produce/pdmpsProd/pdmpsProdItemListQuery.controller';
import { PdmpsProdPlanListQueryController } from './controllers/produce/pdmpsProd/pdmpsProdPlanListQuery.controller';

/*  PURCHASE  */
import { ImpDeliveryController } from './controllers/purchase/impDelivery.controller';
import { ImpPermitController } from './controllers/purchase/impPermitList.controller';
import { ImpPermitItemController } from './controllers/purchase/impPermitItemList.controller';
import { ImpDeliveryListController } from './controllers/purchase/impDeliveryList.controller';
import { ImpDeliveryItemListController } from './controllers/purchase/impDeliveryItemList.controller';
import { PurOrdApprovalReqController } from './controllers/purchase/purOrdApprovalReq.controller';
import { PurOrdApprovalReqListController } from './controllers/purchase/purOrdApprovalReqList.controller';
import { PurOrdApprovalReqItemListController } from './controllers/purchase/purOrdApprovalReqItemList.controller';
import { PurOrdPOController } from './controllers/purchase/purOrdPO.controller';
import { PurOrdPOListController } from './controllers/purchase/purOrdPOList.controller';
import { PurOrdPOItemListController } from './controllers/purchase/purOrdPOItemList.controller';
import { PurDelvController } from './controllers/purchase/purDelv.controller';
import { PurDelvItemListController } from './controllers/purchase/purDelvItemList.controller';
import { PurDelvListController } from './controllers/purchase/purDelvList.controller';
import { PurDelvInController } from './controllers/purchase/purDelvIn.controller';
import { PurDelvInListController } from './controllers/purchase/purDelvInList.controller';
import { PurDelvInItemListController } from './controllers/purchase/purDelvInItemList.controller';
import { ImpOrderController } from './controllers/purchase/impOrder.controller';
import { ImpOrderListController } from './controllers/purchase/impOrderList.controller';
import { ImpOrderItemListController } from './controllers/purchase/impOrderItemList.controller';

import { IqcPurchaseController } from './controllers/qc/iqc/iqc-purchase.controller';
import { IqcOutsourceController } from './controllers/qc/iqc/iqc-outsource.controller';
import { GrpcClientService } from './controllers/grpc/service/grpc-client.service';

/* API V2 */
/* CodeHelp */
import { GrpCodeHelpQueryService } from './controllers/grpc/service/grpc-code-help-query.service';
import { CodeHelpQueryV2Controller } from './controllers/codehelp/v2/codeHelpQuery.controller';
import { GrpCodeHelpComboQueryService } from './controllers/grpc/service/grpc-code-help-combo-query.service';
import { CodeHelpComboQueryV2Controller } from './controllers/codehelp/v2/codeHelpComboQuery.controller';
import { GrpcWcService } from './controllers/grpc/service/grpc-ws.service';
import { WcController } from './controllers/produce/wc/wcQuery.controller';
import { GrpcPdmmService } from './controllers/grpc/service/grpc-pdmm.service';
import { PdmmOutQueryListController } from './controllers/produce/pdmm/pdmmOutQueryList.controller';
import { PdmmOutReqController } from './controllers/produce/pdmm/pdmmOutReq.controller';
import { PdmmOutItemListController } from './controllers/produce/pdmm/pdmmOutSeqItemList.controller';
import { ScanPdmmOutProcController } from './controllers/produce/pdmm/scanPdmmOutProc.controller';
import { QaRegisterController } from './controllers/qc/qa-register/qa-register.controller';
import { QaQcTitleController } from './controllers/qc/qa-register/qaqc-title.controller';
import { GrpcAuthService } from './controllers/grpc/service/grpc-auth.service';
import { IPPublicController } from './controllers/auth/systemConfig/ipPublic.controller';
import { GrpcEmailService } from './controllers/grpc/service/grpc-email.service';
import { EmailController } from './controllers/auth/systemConfig/email.controller';
import { HelpQueryRoleController } from './controllers/auth/roles/help.controller';
import { PdmmProdPlanController } from './controllers/produce/pdmm/pdmmProdPlan.controller';
import { PdsfcListController } from './controllers/produce/pdmm/pdsfkList.controller';
import { PdsfcWorkReportController } from './controllers/produce/pdsfc/pdsfcWorkReport.controller';
import { OqcController } from './controllers/qc/opc/oqc.controller';
import { QaItemClassQcController } from './controllers/qc/qa-register/qa-item-class-qc.controller';
import { QaCustQcTitleController } from './controllers/qc/qa-register/qa-cust-qc-title.controller';
import { GrpcHrEmpPlnService } from './controllers/grpc/service/grpc.hr.info.hr_emp_pln.service';
import { HrEmpPlnController } from './controllers/hr/info/hrEmpPln.controller';
import { HrEmpOneController } from './controllers/hr/info/hrEmpOne.controller';
/* SOCKET */
import { GrpcHrEmpOneService } from './controllers/grpc/service/grpc.hr.info.hr_emp_one.service';
import { SocketModule } from './socket/socket.module';
import { HrBaseFamilyController } from './controllers/hr/info/hrBaseFamily.controller';
import { GrpcHrBaseFamilyService } from './controllers/grpc/service/grpc.hr.info.hr_base_family.service';
import { GrpcHrBaseAcademicService } from './controllers/grpc/service/grpc.hr.info.hr_bas_academic.service';
import { HrBaseAcademicController } from './controllers/hr/info/hrBasAcademic.controller';

import { GrpcHrBasPrzPnlService } from './controllers/grpc/service/grpc.hr.info.hr_bas_prz_pnl.service';
import { GrpcHrBaslinguisticService } from './controllers/grpc/service/grpc.hr.info.hr_bas_linguistic.service';
import { GrpcHrBasAddressService } from './controllers/grpc/service/grpc.hr.info.hr_bas_address.service';
import { HrBasPrzPnlController } from './controllers/hr/info/hrBasPrzPnl.controller';
import { HrBasAddressController } from './controllers/hr/info/hrBasAddress.controller';
import { HrBaslinguisticController } from './controllers/hr/info/hrBaslinguistic.controller';
import { GrpcHrBaseTravelService } from './controllers/grpc/service/grpc.hr.info.hr_base_travel.service';
import { GrpcHrBasUnionService } from './controllers/grpc/service/grpc.hr.info.hr_bas_union.service';

import { GrpcHrBasOrgJobService } from './controllers/grpc/service/grpc.hr.info.hr_bas_org_job.service';
import { HrBaseTravelController } from './controllers/hr/info/hrBasTravel.controller';
import { HrBasUnionController } from './controllers/hr/info/hrBasUnion.controller';
import { HrBasOrgPosController } from './controllers/hr/info/hrBasOrgPos.controller';
import { HrBasOrgJobController } from './controllers/hr/info/hrBasOrgJob.controller';
import { GrpcHrBasOrgPosService } from './controllers/grpc/service/grpc.hr.info.hr_bas_org_pos.service';

import { HrBasPjtCareerController } from './controllers/hr/info/hrBasPjtCareer.controller';
import { HrBasCareerController } from './controllers/hr/info/hrBasCareer.controller';
import { GrpcHrBasPjtCareerService } from './controllers/grpc/service/grpc.hr.info.hr_bas_pjt_career.service';
import { GrpcHrBasCareerService } from './controllers/grpc/service/grpc.hr.info.hr_bas_career.service';
import { GrpcDaDeptService } from './controllers/grpc/service/grpc.hr.org.da_dept.service';
import { DaDeptController } from './controllers/hr/hr-org/da-dept.controller';
import { OrgDeptController } from './controllers/hr/hr-org/org-dept.controller';
import { GrpcOrgDeptService } from './controllers/grpc/service/grpc.hr.org.org_dept.service';
import { EmpOrgDeptController } from './controllers/hr/hr-org/emp-org.controller';
import { GrpcEmpOrgDeptService } from './controllers/grpc/service/grpc.hr.org.emp_org_dept.service';
import { GrpcHrBasMilitaryService } from './controllers/grpc/service/grpc.hr.info.hr_bas_military.service';
import { HrBasMilitaryController } from './controllers/hr/info/HrBasMilitary.controller';
import { GrpcrBasLicenseCheckService } from './controllers/grpc/service/grpc.hr_bas_license_check.service';
import { HrBasLicenseCheckController } from './controllers/hr/info/hrBasLicenseCheck.controller';
import { GrpcrEmpUserDefineService } from './controllers/grpc/service/grpc.emp_user_define.service';
import { EmpUserDefineController } from './controllers/hr/info/empUserDefine.controller';
import { GrpcHrFileService } from './controllers/grpc/service/grpc.hr_file.service';
import { HrEmpFileController } from './controllers/hr/info/hrFile.controller';
import { GrpcUploadHrEmpInfoService } from './controllers/grpc/service/grpc.upload.hr_emp_info.service';
import { UploadHrEmpInfoController } from './controllers/upload/hr/hrEmpInfo.controller';
import { GrpcHrEmpDateService } from './controllers/grpc/service/grpc.hr.info.hr_emp_date.service';
import { HrEmpDateController } from './controllers/hr/info/hrEmpDate.controller';
import { SearchStatiticController } from './controllers/hr/search-statitic/search-statitic.controller';
import { GrpcHrSearchStatisticService } from './controllers/grpc/service/grpc.hr.info.search_statitics.service';
import { HrAdmGeneralController } from './controllers/hr/hr-general/adm-ord.controller';
import { GrpcHrGeneralService } from './controllers/grpc/service/grpc.hr.info.hr-general.service';

/* TUYỂN DỤNG  */
import { GrpcHrEmpRecruitService } from './controllers/grpc/service/grpc.hr.hr_recruit.hr_emp_recruit.service';
import { HrEmpRecruitController } from './controllers/hr/hr-recruit/hrEmpRecruit.controller';
import { GrpcHrAcademyRecruitService } from './controllers/grpc/service/grpc.hr.hr_recruit.hr_academy_recruit.service';
import { HrAcademyRecruitController } from './controllers/hr/hr-recruit/hrAcademyRecruit.controller';
import { GrpcHrFamilyRecruitService } from './controllers/grpc/service/grpc.hr.hr_recruit.hr_family_recruit.service';
import { HrFamilyRecruitController } from './controllers/hr/hr-recruit/hrFamilyRecruit.controller';
import { GrpcHrLangsRecruitService } from './controllers/grpc/service/grpc. hr.hr_recruit.hr_langs_recruit.service';
import { HrLangRecruitController } from './controllers/hr/hr-recruit/hrLangRecruit.controller';

import { GrpcHrCareerRecruitService } from './controllers/grpc/service/grpc.hr.hr_recruit.hr_career_recruit.entity';
import { GrpcHrCareerItemRecruitService } from './controllers/grpc/service/grpc.hr.hr_recruit.hr_career_item_recruit.entity';
import { HrCareerRecruiController } from './controllers/hr/hr-recruit/hrCareerRecruit.controller';
import { HrCareerItemRecruiController } from './controllers/hr/hr-recruit/hrCareerItemRecruit.controller';

import { GrpcHrOfficeSkillsService } from './controllers/grpc/service/grpc.hr.hr_recruit.hr_office_skill_recruit.service';
import { HrOfficeSkillsRecruitController } from './controllers/hr/hr-recruit/hrOfficeSkill.controller';
import { gRPCDefineItemService } from './controllers/grpc/service/grpc.hr.define_item.service';
import { gRPCDefineService } from './controllers/grpc/service/grpc.hr.define.service';
import { DefinesController } from './controllers/hr/define/define.controller';
import { DefinesItemController } from './controllers/hr/define/defineItem.controller';
import { gRPCHelpDefineService } from './controllers/grpc/service/grpc.sp.defineLookup.service';
import { OrgHelpDefineController } from './controllers/codehelp/define/defineHelp.controller';


import { gRPCEmpsSPService } from './controllers/grpc/service/grpc.sp.emp_help.service';
import { EmpHelpController } from './controllers/codehelp/emps/empHelp.controller';



import { HrCertificateController } from './controllers/hr/hr-general/labor-contract.controller';
import { GrpcHrCertificateService } from './controllers/grpc/service/grpc.hr.info.certificate.service';
import { HrLaborContractPrintController } from './controllers/hr/hr-general/labor-contract-print.controller';
import { GrpcHrCertificatePrintService } from './controllers/grpc/service/grpc.hr.info.certificate-print.service';
import { GrpcHrContractPrintService } from './controllers/grpc/service/grpc.hr.upload.contract-print.service';
import { HrContractPrintController } from './controllers/hr/hr-general/contract-print.controller';


/* REPORT  */
import { GrpcFinQueryCmpService } from './controllers/grpc/service/grpc.report.exec_fin.fin_cmp.service';
import { FinQueryCmpController } from './controllers/report/finQueryCmp.controller';
import { GrpcCogsReportService } from './controllers/grpc/service/grpc.report.cogs.cogs_report.service';
import { CogsReportController } from './controllers/report/cogsReport.controller';
import { GrpcInventoryReportService } from './controllers/grpc/service/grpc.report.inventory.supplement_issue.service';
import { SupplementIssueController } from './controllers/report/supplementIssue.controller';
import { GrpcSalesReportService } from './controllers/grpc/service/grpc.report.sales.sales_report.service';
import { SalesReportController } from './controllers/report/salesReport.controller';
import { GrpcHrReportService } from './controllers/grpc/service/grpc.report.hr.hr_report.service';
import { HrReportController } from './controllers/report/hrReport.controller';
import { GrpcAcctReportService } from './controllers/grpc/service/grpc.report.acct.acct_report.service';
import { AcctReportController } from './controllers/report/acctReport.controller';
import { GrpcPdEquiptService } from './controllers/grpc/service/grpc.asset.pd_equipt.service';
import { AssetEquipController } from './controllers/asset/assetEquip.controller';
import { ControllersModule } from './controllers/controller.module';
import { GRPCServiceModule } from './grpc/grpc.module';
import { PjtProjectController } from './controllers/report/pjtProject.controller';
import { GrpcPjtProjectService } from './controllers/grpc/service/grpc.report.pjt.pjt_project.service';
@Module({
  imports: [
    GRPCServiceModule,
    ControllersModule,
    ClientsModule.register([
      {
        name: 'WAREHOUSE_SERVICE',
        transport: Transport.REDIS,
        options: {
          host: process.env.HOST_REDIS_WAREHOUSE ?? 'redis-warehouse',
          port: Number(process.env.PORT_REDIS_WAREHOUSE),
          retryAttempts: 10, // Tăng số lần thử lại khi mất kết nối
          retryDelay: 5000, // Đợi 5 giây trước khi thử lại
          reconnectOnError: (err: Error) => {
            console.error('🔄 Redis reconnecting due to error:', err.message);
            return true;
          },
        },
      },
      {
        name: 'AUTH_SERVICE',
        transport: Transport.REDIS,
        options: {
          host: process.env.HOST_REDIS_AUTH ?? 'redis-auth',
          port: Number(process.env.PORT_REDIS_AUTH),
          retryAttempts: 10, // Tăng số lần thử lại khi mất kết nối
          retryDelay: 5000, // Đợi 5 giây trước khi thử lại
          reconnectOnError: (err: Error) => {
            console.error('🔄 Redis reconnecting due to error:', err.message);
            return true;
          },
        },
      },
      {
        name: 'PRODUCE_SERVICE',
        transport: Transport.REDIS,
        options: {
          host: process.env.HOST_REDIS_PRODUCTION ?? 'redis-production',
          port: Number(process.env.PORT_REDIS_PRODUCTION),
          retryAttempts: 10, // Tăng số lần thử lại khi mất kết nối
          retryDelay: 5000, // Đợi 5 giây trước khi thử lại
          reconnectOnError: (err: Error) => {
            console.error('🔄 Redis reconnecting due to error:', err.message);
            return true;
          },
        },
      },

      {
        name: 'CHANGE_LABEL_SERVICE',
        transport: Transport.REDIS,
        options: {
          host: process.env.HOST_REDIS_QC ?? 'redis-qc',
          port: Number(process.env.PORT_REDIS_QC),
          retryAttempts: 10, // Tăng số lần thử lại khi mất kết nối
          retryDelay: 5000, // Đợi 5 giây trước khi thử lại
          reconnectOnError: (err: Error) => {
            console.error('🔄 Redis reconnecting due to error:', err.message);
            return true;
          },
        },
      },

      {
        name: 'CUSTOMER_SERVICE',
        transport: Transport.REDIS,
        options: {
          host: process.env.HOST_REDIS_QC ?? 'redis-qc',
          port: Number(process.env.PORT_REDIS_QC),
          retryAttempts: 10, // Tăng số lần thử lại khi mất kết nối
          retryDelay: 5000, // Đợi 5 giây trước khi thử lại
          reconnectOnError: (err: Error) => {
            console.error('🔄 Redis reconnecting due to error:', err.message);
            return true;
          },
        },
      },
      {
        name: 'IQC_SERVICE',
        transport: Transport.REDIS,
        options: {
          host: process.env.HOST_REDIS_QC ?? 'redis-qc',
          port: Number(process.env.PORT_REDIS_QC),
          retryAttempts: 10, // Tăng số lần thử lại khi mất kết nối
          retryDelay: 5000, // Đợi 5 giây trước khi thử lại
          reconnectOnError: (err: Error) => {
            console.error('🔄 Redis reconnecting due to error:', err.message);
            return true;
          },
        },
      },
      {
        name: 'PURCHASE_SERVICE',
        transport: Transport.REDIS,
        options: {
          host: process.env.HOST_REDIS_PURCHASEN ?? 'redis-purchase',
          port: Number(process.env.PORT_REDIS_PURCHASEN),
          retryAttempts: 10, // Tăng số lần thử lại khi mất kết nối
          retryDelay: 5000, // Đợi 5 giây trước khi thử lại
          reconnectOnError: (err: Error) => {
            console.error('🔄 Redis reconnecting due to error:', err.message);
            return true;
          },
        },
      },

    ]),
    SocketModule
  ],
  controllers: [
    /*WAREHOUSE*/
    WarehouseController,
    AgingLotStockListController,
    BizStockListController,
    EtcInReqController,
    EtcOutReqController,
    EtcTransReqController,
    LGWHItemController,
    LGWHStockClosingController,
    LGWHStockRealController,
    LotMasterController,
    StockAgingListController,
    StockDetailListController,
    StockListController,
    DaMaterialListController,
    CodeHelpComboQueryController,
    CodeHelpQueryController,
    DeliveryListController,
    IQCStatusController,
    MatWHStockInController,
    EmployeeController,
    StockOutController,
    /* AUTH_SERVICE */
    AuthController,
    LanguageController,
    MenusController,
    RootMenusController,
    SystemUsersController,
    RoleGroupController,
    /*PURCHASE*/
    ImpDeliveryController,
    ImpPermitController,
    ImpPermitItemController,
    ImpDeliveryListController,
    ImpDeliveryItemListController,
    PurOrdApprovalReqController,
    PurOrdApprovalReqListController,
    PurOrdApprovalReqItemListController,
    PurOrdPOController,
    PurOrdPOListController,
    PurOrdPOItemListController,
    PurDelvController,
    PurDelvItemListController,
    PurDelvListController,
    PurDelvInController,
    PurDelvInListController,
    PurDelvInItemListController,
    ImpOrderController,
    ImpOrderListController,
    ImpOrderItemListController,

    /* PRODUTION_SERVICE */
    BomController,

    ProductsController,
    PdmpsProdQueryController,
    PdmpsProdItemListQueryController,
    PdmpsProdPlanListQueryController,

    /* CHANGE_LABEL_SERVICE */
    BarcodeChangeController,

    /* CUSTOMER_SERVICE */
    CustomersController,

    /* IQC_SERVICE */
    IqcController,
    IqcPurchaseController,
    IqcOutsourceController,
    OqcController,
    QaRegisterController,
    QaQcTitleController,
    QaItemClassQcController,
    QaCustQcTitleController,

    /* API V2 */
    /* CodeHlep */
    CodeHelpQueryV2Controller,
    CodeHelpComboQueryV2Controller,
    WcController,
    PdmmOutQueryListController,
    PdmmOutReqController,
    PdmmOutItemListController,
    ScanPdmmOutProcController,
    IPPublicController,
    EmailController,
    HelpQueryRoleController,
    PdmmProdPlanController,
    PdsfcListController,
    PdsfcWorkReportController,
    HrEmpPlnController,
    HrEmpOneController,
    HrBaseFamilyController,
    HrBaseAcademicController,
    HrBaslinguisticController,
    HrBasAddressController,
    HrBasPrzPnlController,
    HrBaseTravelController,
    HrBasUnionController,
    HrBasOrgJobController,
    HrBasOrgPosController,
    HrBasPjtCareerController,
    HrBasCareerController,
    HrBasLicenseCheckController,
    // ORG_HR
    DaDeptController,
    OrgDeptController,
    EmpOrgDeptController,
    HrBasMilitaryController,
    EmpUserDefineController,
    HrEmpFileController,
    UploadHrEmpInfoController,
    HrEmpDateController,
    SearchStatiticController,
    HrAdmGeneralController,
    HrCertificateController,
    HrLaborContractPrintController,
    HrContractPrintController,


    HrEmpRecruitController,
    DefinesItemController,
    DefinesController,
    OrgHelpDefineController,
    EmpHelpController,
    HrAcademyRecruitController,
    HrFamilyRecruitController,
    HrLangRecruitController,
    HrCareerRecruiController,
    HrCareerItemRecruiController,
    HrOfficeSkillsRecruitController,


    /* REPORT  */
    FinQueryCmpController,
    CogsReportController,
    SupplementIssueController,
    SalesReportController,
    HrReportController,
    AcctReportController,
    PjtProjectController,

    // ASSET
    AssetEquipController

  ],
  providers: [
    GrpcClientService,
    GrpCodeHelpQueryService,
    GrpCodeHelpComboQueryService,
    GrpcWcService,
    GrpcPdmmService,
    GrpcAuthService,
    GrpcEmailService,
    GrpcHrEmpPlnService,
    GrpcHrEmpOneService,
    GrpcHrBaseFamilyService,
    GrpcHrBaseAcademicService,
    GrpcHrBasAddressService,
    GrpcHrBaslinguisticService,
    GrpcHrBasPrzPnlService,
    GrpcHrBaseTravelService,
    GrpcHrBasUnionService,
    GrpcHrBasOrgJobService,
    GrpcHrBasOrgPosService,
    GrpcHrBasCareerService,
    GrpcHrBasPjtCareerService,
    GrpcHrBasMilitaryService,
    GrpcGroupRoleService,

    GrpcDaDeptService,
    GrpcOrgDeptService,
    GrpcEmpOrgDeptService,
    GrpcrBasLicenseCheckService,
    GrpcrEmpUserDefineService,
    GrpcHrFileService,
    GrpcUploadHrEmpInfoService,
    GrpcHrEmpDateService,
    GrpcHrSearchStatisticService,
    GrpcHrGeneralService,
    GrpcHrCertificateService,
    GrpcHrCertificatePrintService,
    GrpcHrContractPrintService,
    GrpcHrEmpRecruitService,
    gRPCDefineItemService,
    gRPCDefineService,
    gRPCHelpDefineService,
    gRPCEmpsSPService,



    GrpcHrAcademyRecruitService,
    GrpcHrFamilyRecruitService,
    GrpcHrLangsRecruitService,
    GrpcHrCareerRecruitService,
    GrpcHrCareerItemRecruitService,
    GrpcHrOfficeSkillsService,




    /* REPORT  */
    GrpcFinQueryCmpService,
    GrpcCogsReportService,
    GrpcInventoryReportService,
    GrpcSalesReportService,
    GrpcHrReportService,
    GrpcAcctReportService,
    GrpcPjtProjectService,

    // ASSET
    GrpcPdEquiptService

  ],
})
export class AppModule { }
