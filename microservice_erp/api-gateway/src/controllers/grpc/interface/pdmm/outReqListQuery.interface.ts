export interface QueryOutReqListRequest {
    FactUnit: number;
    ReqDate: string;
    ReqDateTo: string;
    OutReqNo: string;
    UseType: string;
    DeptSeq: string;
    DeptName: string;
    EmpSeq: string;
    EmpName: string;
    CustSeq: string;
    CustName: string;
    ProgStatus: string;
    ProdPlanNo: string;
    WorkOrderNo: string;
    ProdReqNo: string;
}
export interface QueryOutReqItemListRequest {
    FactUnit: number;
    ReqDate: string;
    ReqDateTo: string;
    WorkDate: string;
    WorkDateTo: string;
    UseType: string;
    WorkCenterSeq: string;
    WorkCenterName: string;
    DeptSeq: string;
    DeptName: string;
    EmpSeq: string;
    EmpName: string;
    OutReqNo: string;
    InWHSeq: string;
    AssyAssetSeq: string;
    WorkOrderNo: string;
    ProcName: string;
    ProgStatus: string;
    OutWHSeq: string;
    PJTName: string;
    AssetSeq: string;
    PJTNo: string;
    ProdPlanNo: string;
    ItemName: string;
    ItemNo: string;
    Spec: string;
}

export interface SPDMMOutProcItemRequest {
    FactUnit: number;         // int32 -> number
    FactUnitName: string;     // string
    MatOutDate: string;       // string
    MatOutDateTo: string;     // string
    OutWHSeq: number;         // int32 -> number
    InWHSeq: number;          // int32 -> number
    ItemName: string;         // string
    ItemNo: string;           // string
    OutReqNo: string;         // string
    AssetSeq: string;         // string
    WorkCenterSeq: number;    // int32 -> number
    WorkCenterName: string;   // string
    ItemLotNo: string;        // string
    WorkOrderNo: string;      // string
    ProdPlanNo: string;       // string
    MatOutNo: string;         // string
    EmpName: string;          // string
}


export interface SPDMMOutReqItemListRequest {
    OutReqSeq: number;

}
export interface SCOMSourceDailyJumpQueryRequest {
    ParamFromSeq: number;
}


export interface OutReqRequest {
    SupplyContCustSeq: number;
    OutReqSeq: number;
    OutReqNo: string;
    UseType: string;
    FactUnit: number;
    ReqDate: string;
    EmpSeq: string;
    DeptSeq: number;
    Remark: string;
    IsReturn: number;
    IsOutSide: number;
    IsConfirm: number;
}
export interface OutReqCheckRequest {
    IsChangedMst: number;
    WorkingTag: string;
    OutReqSeq: number;

}

export interface OutReqItemsRequest {
    IdxNo: number;
    ItemName: string;
    ItemNo: string;
    Spec: string;
    UnitName: string;
    NeedQty: number;
    OutReqSeq: number;
    OutReqItemSerl: string;
    WorkOrderSeq: number;
    ItemSeq: number;
    UnitSeq: number;
    PJTSeq: number;
    WBSSeq: number;
    WorkCenterSeq: number;
    WorkOrderSerl: string;
    Qty: number;
    Remark: string;
    CustSeq: number;
    OutWHName: string;
    WorkCenterName: string;
    Memo1: string;
    Memo2: string;
    Memo3: string;
    Memo4: number;
    Memo5: number;
    Memo6: number;
    PrevQty: string
}
export interface OutReqSeqRequest {

    OutReqSeq: number;

}
export interface SPDMMOutReqItemStockRequest {
    IdxNo: number;
    WorkingTag: string;
    OutWHSeq: number;
    Memo4: number;
    Qty: number;
    FactUnit: number;
    ItemSeq: number;

}

export interface SCOMConfirmRequest {
    CfmCode: number;
    CfmSeq: number;
    Reason: string;

}
export interface SPDMMOutReqCancelRequest {
    IsConfirm: number;
    IsStop: string;
    Qty: string;
    ProgStatusName: string;
    OutReqSeq: number;
    ProgStatus: string;

}



export interface SMaterialQRStockOutCheckRequest {
    InOutReqSeq: number; // int32
    InOutReqItemSerl: number; // int32
    BizUnit: number; // int32
    BizUnitName: string;
    InWHSeq: number; // int32
    InWHName: string;
    OutWHSeq: number; // int32
    OutWHName: string;
    ItemSeq: number; // int32
    UnitSeq: number; // int32
    UnitName: string;
    ItemNo: string;
    LotNo: string;
    Qty: number; // int32
    DateCode: string;
    ReelNo: string;
    Barcode: string;
    ReqQty: number; // int32
    ScanQty: number; // int32
}
export interface CheckLogsTFIFOTempRequest {
    OutReqSeq: number;
    LotNo: string;
    ItemSeq: number;
}
export interface SPDMMOutProcItemQRequest {
    MatOutSeq: number;
}

export interface ProdPlanRequest {
    FactUnitName: string;
    FactUnit: number;
    ProdDeptName: string;
    ProdDeptSeq: number;
    ItemName: string;
    ItemNo: string;
    Spec: string;
    ProdPlanNo: string;
    ProdPlanSeq: number;
    ItemSeq: number;
    UnitName: string;
    UnitSeq: number;
    BOMRevName: string;
    BOMRev: string;
    ProcRevName: string;
    ProcRev: string;
    ProdPlanQty: number;
    ProdPlanEndDate: string;
    Remark: string;
    FromSeq: number;
    FromSerl: number;
    FromTableSeq: number;
    WorkCond1: string;
    WorkCond2: string;
    WorkCond3: string;
    WorkCond4: string;
    WorkCond5: string;
    WorkCond6: string;
    WorkCond7: string;
    ProdPlanDate: string;
    ToTableSeq: number;
    FromQty: number;
    FromSTDQty: number;
    IdxNo: number;
    DeptSeq: number;
    AssetName: string;
}
export interface SPDMPSProdPlanStockQueryRequest {
    ProdPlanQty: number;
    IdxNo: number;
    FactUnit: number;
    ItemSeq: number;
}

