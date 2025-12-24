import {
    Injectable,
    NotFoundException,
    UnauthorizedException,
    BadRequestException
    , InternalServerErrorException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as jwt from 'jsonwebtoken';
import { TCAUserWEB } from '../entities/auths.entity';
import { UserAuthService } from './user.service';
import { jwtConstants } from 'src/config/security.config';
import * as crypto from 'crypto';
import { LoginDto } from '../dto/login.dto';
import * as bcrypt from 'bcrypt';
import { DatabaseService } from 'src/common/database/sqlServer/ITMV/database.service';
import { ERPUserLoginLogs } from '../entities/userLoginLogs.entity';
import { EmailService } from './email.service';

interface RoleMenuData {
    menu: any[];
    rootMenu: any[];
}

@Injectable()
export class AuthService {
    constructor(
        private readonly userAuthService: UserAuthService,
        private readonly databaseService: DatabaseService,
        private readonly emailService: EmailService,
        @InjectRepository(TCAUserWEB)
        private readonly userWEBRepository: Repository<TCAUserWEB>,
        @InjectRepository(ERPUserLoginLogs)
        private readonly ERPUserLoginLogsRepository: Repository<ERPUserLoginLogs>

    ) { }
    private async hashPassword(password: string): Promise<string> {
        const saltRounds = 10;
        return bcrypt.hash(password, saltRounds);
    }
    private readonly ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'default_secret';
    private chunkArray<T>(array: T[], size: number): T[][] {
        const result: T[][] = [];
        for (let i = 0; i < array.length; i += size) {
            result.push(array.slice(i, i + size));
        }
        return result;
    }
    /* MÃ HÓA PASS */
    private async encryptPassword(plainText: string): Promise<string> {
        const IV_LENGTH = 16;
        const key = crypto.createHash('sha256').update(this.ENCRYPTION_KEY).digest();
        const iv = crypto.randomBytes(IV_LENGTH);
        const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
        let encrypted = cipher.update(plainText, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return iv.toString('hex') + encrypted;
    }
    sanitizeInput(input: string): string {
        return input.replace(/[^a-zA-Z0-9@._]/g, '');
    }

    async getDataRolesUserRaw(UserId: string, language: number): Promise<any[]> {
        try {
            const query = `
            WITH GroupIDs AS (
                SELECT DISTINCT GroupId 
                FROM "_TCARolesUsers_WEB" 
                WHERE UserId = N'${UserId}'
            )
            SELECT 
                r.*,
                m.[Key] AS MenuKey, 
                COALESCE(NULLIF(trans_m.Word, ''), m.Label) AS MenuLabel, 
                m.Link AS MenuLink,
                m.Type AS MenuType,
                m.OrderSeq AS OrderSeq,
                m.MenuRootId AS MenuRootId,
                m.MenuSubRootId AS MenuSubRootId,
                m.LabelSeq AS LabelSeq,
                rm.LabelSeq AS RootLabelSeq,
                rm.[Key] AS RootMenuKey,  
                COALESCE(NULLIF(trans_rm.Word, ''), rm.Label) AS RootMenuLabel,  
                rm.Icon AS RootMenuIcon, 
                rm.Link AS RootMenuLink, 
                rm.Utilities AS RootMenuUtilities  
            FROM "_TCARolesUsers_WEB" r
            LEFT JOIN "_TCAMenus_WEB" m 
                ON r.MenuId = m.Id AND r.Type = 'menu'
            LEFT JOIN "_TCARootMenus_WEB" rm 
                ON r.RootMenuId = rm.Id AND r.Type = 'rootmenu'
    
            LEFT JOIN "_TCADictionary_WEB" trans_m
                ON m.LabelSeq = trans_m.WordSeq 
                AND trans_m.LanguageSeq = ${language}
                AND trans_m.Word IS NOT NULL 
    
            LEFT JOIN "_TCADictionary_WEB" trans_rm
                ON rm.LabelSeq = trans_rm.WordSeq 
                AND trans_rm.LanguageSeq = ${language}
                AND trans_rm.Word IS NOT NULL 
    
            WHERE r.GroupId IN (SELECT GroupId FROM GroupIDs)
            AND r.Type IN ('rootmenu', 'menu');
            `;

            const datas = await this.databaseService.executeQuery(query);


            if (!datas || datas.length === 0) {
                return [];
            }

            const datamergePermissions = this.mergePermissions(datas);

            return [
                { menu: [...datamergePermissions.menu] },
                { rootMenu: [...datamergePermissions.rootMenu] }
            ];
        } catch (error) {
            throw new InternalServerErrorException('Error fetching data from database');
        }
    }


    private mergePermissions(data: any[]): { menu: any[], rootMenu: any[] } {
        const mergedData = data.reduce((acc, item) => {
            const { Id, View, Edit, Create, Delete, MenuId, GroupId, UserId, RootMenuId, Type, Name
                , MenuKey, MenuLabel, MenuLink, MenuType, RootMenuKey, RootMenuLabel, RootMenuIcon, RootMenuLink,
                RootMenuUtilities, MenuSubRootId, MenuRootId, OrderSeq, LabelSeq,
                RootLabelSeq

            } = item;

            if (Type === "menu") {
                if (!acc.menu[MenuId]) {
                    acc.menu[MenuId] = {
                        Id: Id,
                        View: View,
                        Edit: Edit,
                        Create: Create,
                        Delete: Delete,
                        GroupId: GroupId,
                        UserId: UserId,
                        MenuId: MenuId,
                        Type: Type,
                        OrderSeq: OrderSeq,
                        Name: Name,
                        MenuKey: MenuKey,
                        MenuLabel: MenuLabel,
                        MenuLink: MenuLink,
                        MenuType: MenuType,
                        MenuRootId: MenuRootId,
                        MenuSubRootId: MenuSubRootId,
                        LabelSeq: LabelSeq

                    };
                } else {
                    acc.menu[MenuId].View = acc.menu[MenuId].View && View;
                    acc.menu[MenuId].Create = acc.menu[MenuId].Create && Create;
                    acc.menu[MenuId].Edit = acc.menu[MenuId].Edit && Edit;
                    acc.menu[MenuId].Delete = acc.menu[MenuId].Delete && Delete;
                }
            } else if (Type === "rootmenu") {
                if (!acc.rootMenu[RootMenuId]) {
                    acc.rootMenu[RootMenuId] = {
                        Id: Id,
                        View: View,
                        Edit: Edit,
                        Create: Create,
                        Delete: Delete,
                        GroupId: GroupId,
                        UserId: UserId,
                        RootMenuId: RootMenuId,
                        Type: Type,
                        Name: Name,
                        OrderSeq: OrderSeq,
                        RootMenuKey: RootMenuKey,
                        RootMenuLabel: RootMenuLabel,
                        RootMenuIcon: RootMenuIcon,
                        RootMenuLink: RootMenuLink,
                        RootMenuUtilities: RootMenuUtilities,
                        LabelSeq: RootLabelSeq
                    };
                } else {
                    acc.rootMenu[RootMenuId].View = acc.rootMenu[RootMenuId].View && View;
                    acc.rootMenu[RootMenuId].Create = acc.rootMenu[RootMenuId].Create && Create;
                    acc.rootMenu[RootMenuId].Edit = acc.rootMenu[RootMenuId].Edit && Edit;
                    acc.rootMenu[RootMenuId].Delete = acc.rootMenu[RootMenuId].Delete && Delete;
                }
            }
            return acc;
        }, { menu: {}, rootMenu: {} });

        return {
            menu: Object.values(mergedData.menu),
            rootMenu: Object.values(mergedData.rootMenu),
        };
    }


    async addLoginLog(record: ERPUserLoginLogs, login: string, createdBy: number): Promise<{ message: string }> {
        if (!record) {
            throw new Error('No record provided for insertion');
        }

        const processedRecord = { ...record, Login: login, UserSeq: createdBy };

        const queryRunner = this.ERPUserLoginLogsRepository.manager.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            await queryRunner.manager
                .createQueryBuilder()
                .insert()
                .into(ERPUserLoginLogs)
                .values(processedRecord)
                .execute();

            await queryRunner.commitTransaction();
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw new Error(`Insert failed: ${error.message}`);
        } finally {
            await queryRunner.release();
        }

        return {
            message: 'Record inserted successfully',
        };
    }


    loginUserB(
        loginData: LoginDto
    ): Promise<{
        success: boolean;
        data?: { user: Partial<TCAUserWEB>; token: string; tokenRolesUserMenu: string; typeLanguage: number };
        error?: { message: string; code: string; tempToken?: string };
    }> {
        let { login, password, language, timestamp, deviceInfo } = loginData;
        login = this.sanitizeInput(login);
        return this.databaseService.findAuthByEmpID(login)
            .then(async user => {
                if (!user) {
                    throw { message: `User with login ${login} not found`, code: 'USER_NOT_FOUND' };
                }

                const isPasswordValid = await bcrypt.compare(password, user.Password2);
                if (!isPasswordValid) {
                    throw { message: 'Invalid credentials.', code: 'INVALID_CREDENTIALS' };
                }

                if (user.StatusAcc) {
                    throw { message: 'Your account has been locked.', code: 'ACCOUNT_LOCKED' };
                }

                if (!user.CheckPass1) {
                    throw { message: 'Account not activated.', code: 'ACCOUNT_NOT_ACTIVATED' };
                }


                const requiresOTP = user.ForceOtpLogin || user.AccountScope;
                const queryMail = `SELECT * FROM _ERPMails WHERE CodeMail = 'mail_otp_login'`;
                const hostMail = await this.databaseService.executeQuery(queryMail)
                if (requiresOTP) {
                    if (!hostMail || hostMail.length === 0) {
                        return {
                            success: false,
                            error: {
                                message: 'Không tìm thấy cấu hình mail để gửi OTP',
                                code: 'NO_EMAIL_CONFIG',
                            },
                        };
                    }
                    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
                    const passwordHash = user.Password2;
                    const dynamicSecret = (code: string) => code + login + passwordHash + timestamp;

                    const tempToken = jwt.sign(
                        { login, otp: otpCode },
                        dynamicSecret(otpCode),
                        { expiresIn: '5m' }
                    );


                    if (user?.PwdMailAdder && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.PwdMailAdder)) {
                        await this.emailService.sendMailLoginOTP({
                            to: user.PwdMailAdder,
                            subject: '[THÔNG BÁO] - Mã xác thực đăng nhập',
                            otpCode: otpCode,
                            host: hostMail[0]?.Host,
                            port: hostMail[0]?.Port,
                            user: hostMail[0]?.UserName,
                            pass: hostMail[0]?.Password,
                        });
                        return {
                            success: false,
                            error: {
                                message: 'OTP_REQUIRED',
                                code: 'OTP_STEP_REQUIRED',
                                emailCode: user.PwdMailAdder,
                                tempToken,
                            }
                        };
                    } else {
                        return {
                            success: false,
                            error: {
                                message: 'Email không tồn tại hoặc không hợp lệ',
                                code: 'NULL_EMAIL',
                            }
                        };
                    }
                }
                await this.addLoginLog(deviceInfo, login, user.UserSeq);
                const token = jwt.sign(
                    {
                        UserId: user.UserId,
                        Login: user.UserName,
                        UserSeq: user.UserSeq,
                        EmpSeq: user.EmpSeq,
                        Remark: user.Remark,
                        DeptSeq: user.DeptSeq,
                        CompanySeq: user.CompanySeq,
                        ForceOtpLogin: user.ForceOtpLogin,
                        AccountScope: user.AccountScope,
                        PwdMailAdder: user.PwdMailAdder,
                        DeviceId: deviceInfo?.DeviceId,
                    },
                    jwtConstants.secret,
                    { expiresIn: '24h' }
                );

                const rolesUserMenu = await this.getDataRolesUserRaw(login, language);


                const tokenRolesUserMenu = jwt.sign(
                    { data: rolesUserMenu },
                    jwtConstants.secret,
                    { expiresIn: '24h' }
                );

                const languageSeq = user.LanguageSeq || 6;

                const userResponse: Partial<any> = {
                    UserId: user.UserId,
                    UserName: user.UserName,
                    CompanySeq: user.CompanySeq,
                    UserSeq: user.UserSeq,
                    CustSeq: user.CustSeq,
                    DeptSeq: user.DeptSeq,
                    UserType: user.UserType,
                    EmpSeq: user.EmpSeq,
                    ForceOtpLogin: user.ForceOtpLogin,
                    AccountScope: user.AccountScope,
                    PwdMailAdder: user.PwdMailAdder,
                    ProjectType: "B"
                };

                return {
                    success: true,
                    data: {
                        user: userResponse,
                        token,
                        tokenRolesUserMenu,
                        typeLanguage: languageSeq,
                    }
                };
            })
            .catch(error => {
                return {
                    success: false,
                    error: {
                        message: error.message || 'An unexpected error occurred',
                        code: error.code || 'UNKNOWN_ERROR'
                    }
                };
            });
    }

    loginUserC(
        loginData: { login: string; password: string; otp: string; tempToken: string; timestamp: string, deviceInfo: any }
    ): Promise<{
        success: boolean;
        data?: {
            user: Partial<TCAUserWEB>;
            token: string;
            tokenRolesUserMenu: string;
            typeLanguage: number;
        };
        error?: { message: string; code: string };
    }> {
        const { login, password, otp, tempToken, timestamp, deviceInfo } = loginData;

        return this.databaseService.findAuthByEmpID(login)
            .then(async user => {
                if (!user) {
                    throw { message: `User with login ${login} not found`, code: 'USER_NOT_FOUND' };
                }

                const passwordHash = user.Password2;
                const isPasswordValid = await bcrypt.compare(password, passwordHash);
                if (!isPasswordValid) {
                    throw { message: 'Invalid credentials', code: 'INVALID_CREDENTIALS' };
                }

                const dynamicSecret = (code: string) => code + login + passwordHash + timestamp;

                let decoded: any;
                try {
                    decoded = jwt.verify(tempToken, dynamicSecret(otp));
                } catch (e) {
                    throw { message: 'Invalid OTP verification code', code: 'INVALID_TEMP_TOKEN' };
                }

                if (
                    decoded.login !== login ||
                    decoded.otp !== otp
                ) {
                    throw { message: 'Invalid OTP or credentials.', code: 'INVALID_OTP' };
                }

                const token = jwt.sign(
                    {
                        UserId: user.UserId,
                        Login: user.UserName,
                        UserSeq: user.UserSeq,
                        EmpSeq: user.EmpSeq,
                        Remark: user.Remark,
                        CompanySeq: user.CompanySeq,
                        ForceOtpLogin: user.ForceOtpLogin,
                        AccountScope: user.AccountScope,
                        PwdMailAdder: user.PwdMailAdder,
                        DeviceId: deviceInfo?.DeviceId,
                    },
                    jwtConstants.secret,
                    { expiresIn: '24h' }
                );

                const rolesUserMenu = await this.getDataRolesUserRaw(login, user.LanguageSeq || 6);
                await this.addLoginLog(deviceInfo, login, user.UserSeq);
                const tokenRolesUserMenu = jwt.sign(
                    { data: rolesUserMenu },
                    jwtConstants.secret,
                    { expiresIn: '24h' }
                );

                const userResponse: Partial<any> = {
                    UserId: user.UserId,
                    UserName: user.UserName,
                    CompanySeq: user.CompanySeq,
                    UserSeq: user.UserSeq,
                    CustSeq: user.CustSeq,
                    DeptSeq: user.DeptSeq,
                    UserType: user.UserType,
                    EmpSeq: user.EmpSeq,
                    ForceOtpLogin: user.ForceOtpLogin,
                    AccountScope: user.AccountScope,
                    PwdMailAdder: user.PwdMailAdder,
                    ProjectType: "B"
                };

                return {
                    success: true,
                    data: {
                        user: userResponse,
                        token,
                        tokenRolesUserMenu,
                        typeLanguage: user.LanguageSeq || 6
                    }
                };
            })
            .catch(error => {
                return {
                    success: false,
                    error: {
                        message: error.message || 'An unexpected error occurred',
                        code: error.code || 'UNKNOWN_ERROR'
                    }
                };
            });
    }

    async updatePasswordForUsers(userIds: (string | number)[]): Promise<{
        success: boolean;
        message: string;
    }> {
        try {
            const updatePromises = userIds.map(async (userId) => {
                try {
                    const userIdStr = userId.toString();
                    const newPassword = `@${userIdStr}`;
                    const hashedPassword = await this.hashPassword(newPassword);

                    await this.userWEBRepository.update(
                        { UserId: userIdStr },
                        { Password2: hashedPassword, CheckPass1: false }
                    );
                } catch (error) {
                    throw new Error(`Failed to update password for user ${userId}`);
                }
            });

            await Promise.all(updatePromises);

            return {
                success: true,
                message: 'Passwords  updated successfully.',
            };
        } catch (error) {
            return {
                success: false,
                message: error.message || 'An error occurred while updating passwords.',
            };
        }
    }


    async changePassword2(
        employeeId: string,
        oldPassword: string,
        newPassword: string,
    ): Promise<{ success: boolean; message: string; error?: { message: string; code: string } }> {
        try {
            const user = await this.databaseService.findAuthByEmpID(employeeId);

            if (!user) {
                return {
                    success: false,
                    message: 'An error occurred',
                    error: {
                        message: 'User not found',
                        code: 'USER_NOT_FOUND',
                    },
                };
            }

            const isOldPasswordValid = await bcrypt.compare(oldPassword, user.Password2);

            if (!isOldPasswordValid) {
                return {
                    success: false,
                    message: 'An error occurred',
                    error: {
                        message: 'Old password is incorrect',
                        code: 'OLD_PASS_INCORRECT',
                    },
                };
            }

            const hashedNewPassword = await this.hashPassword(newPassword);
            user.Password2 = hashedNewPassword;

            await this.userWEBRepository.update(
                { UserId: employeeId },
                {
                    Password2: hashedNewPassword,
                    Active: true,
                    CheckPass1: true
                }
            );

            return {
                success: true,
                message: 'Password changed successfully',
            };
        } catch (error) {

            return {
                success: false,
                message: 'An unexpected error occurred',
                error: {
                    message: error.message || 'Internal server error',
                    code: 'INTERNAL_ERROR',
                },
            };
        }
    }







}