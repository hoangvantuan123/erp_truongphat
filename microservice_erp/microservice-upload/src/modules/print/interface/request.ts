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
