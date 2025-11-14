export interface SPDMMOutReqItemStockQueryRequest {
    result: {
        IdxNo: number;
        WorkingTag: string;
        WorkCenterSeq: number;
        Qty: number;
        FactUnit: number;
        ItemSeq: number;
    };
    metadata: { [key: string]: string };
}


export interface QueryOutReqListRequest {
    result: {
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
    };
    metadata: { [key: string]: string };
}
export interface QueryOutReqItemListRequest {
    result: {
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
        Remark: string;
        ItemLotNo: string;
    };
    metadata: { [key: string]: string };
}
export interface OutProcItemListRequest {
    result: {
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
    };
    metadata: { [key: string]: string };
}

export interface SPDMMOutReqItemListRequest {
    result: {
        OutReqSeq: number;
    };
    metadata: { [key: string]: string };
}


export interface OutReqCancelRequest {
    result: {
        IsConfirm: number;
        IsStop: string;
        Qty: string;
        ProgStatusName: string;
        OutReqSeq: number;
        ProgStatus: string;
    };
    metadata: { [key: string]: string };
}



export interface OutReqRequest {

    result: {
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
    };
    OutReqCheckRequest: {
        IsChangedMst: number;
        WorkingTag: string;
        OutReqSeq: number;

    };

    resultItems: {
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

    }
    metadata: { [key: string]: string };

}
export interface OutReqRequestV3 {

    resultItems: {
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

    }
    metadata: { [key: string]: string };

}

export interface OutReqServiceSeqQuery {
    result: {
        OutReqSeq: number;
    };
    metadata: { [key: string]: string };
}


export interface SCOMSourceDailyJumpQuery {
    result: {
        ParamFromSeq: number;
    };
    metadata: { [key: string]: string };
}

export interface SMaterialQRStockOutCheckRequest {
    result: {
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
    };
    metadata: { [key: string]: string };
}
export interface CheckLogsTFIFOTempRequest {
    result: {
        OutReqSeq: number;
        LotNo: string;
        ItemSeq: number;
    };
    metadata: { [key: string]: string };
}

export class SimpleQueryResult2 {
    success: boolean;
    data?: any;

    errors?: string[];
}
export class SimpleQueryResult {
    success: boolean;
    data?: any;
    message?: string;
}
