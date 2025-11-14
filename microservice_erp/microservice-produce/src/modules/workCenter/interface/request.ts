export interface WokCenterQRequest {
    result: {
        FactUnit: number;
        SMWorkCenterType: string;
        WorkCenterName: string;
        DeptName: string;
    };
    metadata: { [key: string]: string };
}

