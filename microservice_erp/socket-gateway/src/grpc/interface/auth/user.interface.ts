export interface UsersRequest {
    UserId: string;
    UserName: string;
    PwdMailAdder: string;
    AccountScope: boolean;
    UserSeq: number;
    EmpSeq: number;

}
export interface GetHelpUserAuthRequest {
    EmpSeq: number;
    EmpID: string;
    Email: string;
    UserName: string;
}