
export class LoginDto {
    login: string;
    password: string;
    language: number;
    timestamp: string;
    deviceInfo: any;
}
export class LoginEmailDto {
    login: string;
    password: string;
    otp: string;
    timestamp: string;
    tempToken: string;
    deviceInfo: any;
}


export class ChangePasswordDto {
    oldPassword: string;
    newPassword: string;
    employeeId: string;
}