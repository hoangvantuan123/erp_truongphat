export interface PublicIPRequest {
    result: {
        IdSeq: number;
        IdxNo: number;
        IPAddress: string;
        Description: string;
    };
    metadata: { [key: string]: string };
}


export interface EmailRequest {
    result: {
        IdSeq: number;
        IdxNo: number;
        Host: string;
        Port: string;
        UserName: string;
        Password: string;
        CodeMail: string;
    };
    metadata: { [key: string]: string };
}


