// user.service.ts
import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TCAUserWEB } from '../entities/auths.entity';
import { Observable, from, of, throwError } from 'rxjs';
import { catchError, map, mergeMap, toArray, concatMap, switchMap } from 'rxjs/operators';
import { TdaEmpIn } from '../entities/empIn.entity';
import * as bcrypt from 'bcrypt';
import { Repository, In } from 'typeorm';
import { DataSource } from 'typeorm';
import { ERPUserLoginLogs } from '../entities/userLoginLogs.entity';
import { RpcException } from '@nestjs/microservices';
@Injectable()
export class UserAuthService {
    constructor(
        @InjectRepository(TCAUserWEB)
        private readonly TCAUserWEBRepository: Repository<TCAUserWEB>,
        @InjectRepository(TdaEmpIn)
        private readonly TdaEmpInRepository: Repository<TdaEmpIn>,
        @InjectRepository(ERPUserLoginLogs)
        private readonly ERPUserLoginLogsRepository: Repository<ERPUserLoginLogs>,
        private readonly dataSource: DataSource,
    ) { }
    private async hashPassword(password: string): Promise<string> {
        const saltRounds = 10;
        return bcrypt.hash(password, saltRounds);
    }
    async findAuthByEmpID(UserId: string): Promise<TCAUserWEB> {
        try {
            const user = await this.TCAUserWEBRepository.findOne({ where: { UserId } });

            if (!user) {
                throw new NotFoundException(`User with login ${UserId} not found`);
            }

            return user;
        } catch (error) {
            throw new NotFoundException(`User with login ${UserId} not found`);
        }
    }
    private chunkArray<T>(array: T[], size: number): T[][] {
        const result: T[][] = [];
        for (let i = 0; i < array.length; i += size) {
            result.push(array.slice(i, i + size));
        }
        return result;
    }
    updateMultipleUsers(records: TCAUserWEB[], updatedBy: number): Observable<any> {

        if (!records || records.length === 0) {
            return throwError(() => new Error('No records provided for update'));
        }

        const batchSize = 50;
        const batches = this.chunkArray(records, batchSize);

        return from(batches).pipe(
            concatMap(batch =>
                from(batch).pipe(
                    mergeMap(record => {
                        const { UserSeq, ...updateData } = record;

                        if (!UserSeq) {
                            return of(null); // Bỏ qua record không có UserSeq
                        }

                        const finalUpdateData = {
                            ...updateData,
                            LastUserSeq: updatedBy,
                            LastDateTime: new Date(),
                        };

                        return from(this.TCAUserWEBRepository.update(UserSeq, finalUpdateData)).pipe(
                            map(() => UserSeq)
                        );
                    }),
                    toArray()
                )
            ),
            // Flatten mảng các batch UserSeqs
            toArray(),
            map(batchResults => batchResults.flat().filter(seq => seq !== null)),

            switchMap(allUpdatedUserSeqs => {
                const affectedRows = allUpdatedUserSeqs.length;

                if (affectedRows === 0) {
                    return of({
                        affectedRows,
                        message: 'No records updated',
                        data: []
                    });
                }

                // Build query lấy dữ liệu đã update
                const userSeqList = allUpdatedUserSeqs.map(seq => `'${seq}'`).join(', ');
                const query = `
                    SELECT 
                        CompanySeq, UserSeq, UserId, UserType, UserName, EmpSeq, LoginPwd,
                        CustSeq, DeptSeq, UserSecu, LoginStatus, LoginDate, PwdChgDate,
                        LoginFailCnt, PwdType, LoginType, ManagementType, LastUserSeq,
                        LastDateTime, Dsn, Remark, UserlimitDate, LoginFailFirstTime,
                        IsLayoutAdmin, IsGroupWareUser, SMUserType, LicenseType,
                        ForceOtpLogin, AccountScope
                    FROM _TCAUser_WEB
                    WHERE UserSeq IN (${userSeqList})
                `;

                return from(this.TCAUserWEBRepository.query(query)).pipe(
                    map(result => ({
                        affectedRows,
                        message: 'Records updated successfully',
                        data: result
                    }))
                );
            }),

            catchError(error => {
                console.error('Error updating records:', error);
                return throwError(() => new Error(`Update failed: ${error.message}`));
            })
        );
    }
    addMultipleUsers(records: TCAUserWEB[], createdBy: number): Observable<any> {
        if (!records || records.length === 0) {
            return throwError(() => new Error('No records provided for insertion'));
        }

        let affectedRows = 0;
        let insertedRecords: any[] = [];

        const queryRunner = this.TCAUserWEBRepository.manager.connection.createQueryRunner();

        return from(queryRunner.startTransaction()).pipe(
            mergeMap(() => {
                return from(Promise.all(
                    records.map(user => {
                        user.UserId = user.UserId.replace(/[\s_]/g, '');
                        return this.hashPassword(`@${user.UserId}`).then(hashedPassword => ({
                            ...user,
                            Password2: hashedPassword,
                            CheckPass1: false,
                            UserType: '1001',
                            ForceOtpLogin: false,
                            StatusAcc: false,
                            LanguageSeq: 1,
                            Active: false,
                            CompanySeq: 1,
                        }));
                    })
                ));
            }),
            // Kiểm tra UserId trùng trong DB
            mergeMap((recordsWithPasswords) => {
                const userIds = recordsWithPasswords.map(u => u.UserId.toLowerCase());

                return from(this.TCAUserWEBRepository.find({
                    where: { UserId: In(userIds) },
                    select: ['UserId'],
                })).pipe(
                    mergeMap(existingUsers => {
                        if (existingUsers.length > 0) {
                            const existingIds = existingUsers.map(u => u.UserId).join(', ');
                            return from(queryRunner.rollbackTransaction()).pipe(
                                mergeMap(() => throwError(() => new Error(`Duplicate UserId(s) found: ${existingIds}`)))
                            );
                        }
                        return of(recordsWithPasswords);
                    })
                );
            }),
            // Insert all records at once
            mergeMap((filteredRecords) => {
                if (filteredRecords.length === 0) return of(null);

                return from(queryRunner.manager
                    .createQueryBuilder()
                    .insert()
                    .into('_TCAUser_WEB')
                    .values(filteredRecords)
                    .execute()
                ).pipe(
                    map(result => {
                        affectedRows += result.identifiers.length;
                        const insertedIds = result.identifiers.map(item => item.UserSeq);
                        return insertedIds;
                    })
                );
            }),
            // Lấy lại bản ghi vừa insert
            mergeMap((insertedIds) => {
                if (!insertedIds) return of(null);

                return from(queryRunner.manager
                    .createQueryBuilder('_TCAUser_WEB', 'u')
                    .select([
                        'u.CompanySeq AS "CompanySeq"',
                        'u.UserSeq AS "UserSeq"',
                        'u.UserId AS "UserId"',
                        'u.UserName AS "UserName"',
                        'u.EmpSeq AS "EmpSeq"',
                        'u.LoginPwd AS "LoginPwd"',
                        'u.CustSeq AS "CustSeq"',
                        'u.LoginDate AS "LoginDate"',
                        'u.PwdChgDate AS "PwdChgDate"',
                        'u.PwdType AS "PwdType"',
                        'u.LoginType AS "LoginType"',
                        'u.Remark AS "Remark"',
                        'u.CheckPass1 AS "CheckPass1"',
                    ])
                    .whereInIds(insertedIds)
                    .getRawMany()
                );
            }),
            map(newlyInsertedRecords => {
                if (newlyInsertedRecords) {
                    insertedRecords = [...insertedRecords, ...newlyInsertedRecords];
                }
            }),
            mergeMap(() => from(queryRunner.commitTransaction())),
            map(() => ({
                affectedRows,
                message: 'Records inserted successfully',
                data: insertedRecords,
            })),
            catchError(error => {
                return from(queryRunner.rollbackTransaction()).pipe(
                    mergeMap(() => throwError(() => new Error(`Insert failed: ${error.message}`)))
                );
            }),
            mergeMap((result) => from(queryRunner.release()).pipe(map(() => result))),
        );
    }



    getHelpUserAuthQuery(): Observable<{
        data: any[];
        total: number;
        message: string;
        success: boolean;
    }> {
        const query = this.TdaEmpInRepository.createQueryBuilder('u')
            .select([
                'u.EmpSeq as "EmpSeq"',
                'u.EmpID as "EmpID"',
                'u.Email as "Email"',
                'erp.EmpName as "UserName"',
                'erp.EmpSeq as "UserSeq"'
            ])
            .leftJoin(
                '_TDAEmp',
                'erp',
                'u.EmpSeq = erp.EmpSeq'
            )


        return from(query.getRawMany()).pipe(
            map((data) => ({
                data,
                total: data.length,
                message: 'Success',
                success: true,
            }))
        );
    }

    DeviceLogsQ(result: any): Observable<any> {
        if (!result) {
            return of({
                success: false,
                message: 'No query parameters provided',
                data: [],
            });
        }

        return from(this.dataSource.transaction(async (manager) => {
            try {
                const queryBuilder = manager.createQueryBuilder(ERPUserLoginLogs, 'q')
                    .select([
                        'q.IdSeq as "IdSeq"',
                        'q.UserSeq as "UserSeq"',
                        'q.Login as "Login"',
                        'q.IpAddress as "IpAddress"',
                        'q.UserAgent as "UserAgent"',
                        'q.Platform as "Platform"',
                        'q.Language as "Language"',
                        'q.ScreenResolution as "ScreenResolution"',
                        'q.Timezone as "Timezone"',
                        'q.IsMobile as "IsMobile"',
                        'q.DeviceName as "DeviceName"',
                        'q.HardwareConcurrency as "HardwareConcurrency"',
                        'q.Memory as "Memory"',
                        'q.AudioDevices as "AudioDevices"',
                        'q.VideoDevices as "VideoDevices"',
                        'q.MaxTouchPoints as "MaxTouchPoints"',
                        'q.Latitude as "Latitude"',
                        'q.DeviceId as "DeviceId"',
                        'q.StatusLogs as "StatusLogs"',
                        'q.Longitude as "Longitude"',
                        'q.LoginTime as "LoginTime"',
                        'q.IdxNo as "IdxNo"',
                    ]);
                queryBuilder.andWhere('q.UserSeq = :UserSeq', { UserSeq: result.UserSeq });
                const queryResult = await queryBuilder.getRawMany();

                return {
                    success: true,
                    data: queryResult,
                };
            } catch (error) {
                return {
                    success: false,
                    message: error.message || 'Internal server error',
                    data: [],
                };
            }
        })).pipe(
            catchError((error) => {
                return of({
                    success: false,
                    message: error.message || 'Internal server error',
                    data: [],
                });
            })
        );
    }



    DeviceLogsU(result: any[]): Observable<any> {
        if (!result || result.length === 0) {
            throw new RpcException({ code: 5, message: 'No records provided for update' });
        }

        const batchSize = 1000;
        const batches = this.chunkArray(result, batchSize);

        return from(batches).pipe(
            mergeMap((batch) =>
                from(this.dataSource.transaction(async (manager) => {
                    try {
                        for (const record of batch) {
                            const { IdSeq, ...updateData } = record;

                            await manager
                                .createQueryBuilder()
                                .update(ERPUserLoginLogs)
                                .set(updateData)
                                .where('IdSeq = :id', { id: IdSeq })
                                .execute();
                        }

                        const updatedBatch = await manager
                            .createQueryBuilder(ERPUserLoginLogs, 'q')
                            .select([
                                'q.IdSeq as "IdSeq"',
                                'q.UserSeq as "UserSeq"',
                                'q.Login as "Login"',
                                'q.IpAddress as "IpAddress"',
                                'q.UserAgent as "UserAgent"',
                                'q.Platform as "Platform"',
                                'q.Language as "Language"',
                                'q.ScreenResolution as "ScreenResolution"',
                                'q.Timezone as "Timezone"',
                                'q.IsMobile as "IsMobile"',
                                'q.DeviceName as "DeviceName"',
                                'q.HardwareConcurrency as "HardwareConcurrency"',
                                'q.Memory as "Memory"',
                                'q.AudioDevices as "AudioDevices"',
                                'q.VideoDevices as "VideoDevices"',
                                'q.MaxTouchPoints as "MaxTouchPoints"',
                                'q.Latitude as "Latitude"',
                                'q.DeviceId as "DeviceId"',
                                'q.StatusLogs as "StatusLogs"',
                                'q.Longitude as "Longitude"',
                                'q.LoginTime as "LoginTime"',
                                'q.IdxNo as "IdxNo"',
                            ])
                            .where('q.IdSeq IN (:...ids)', { ids: batch.map(r => r.IdSeq) })
                            .getRawMany();

                        return {
                            success: true,
                            data: updatedBatch,
                        };
                    } catch (err) {
                        return {
                            success: false,
                            message: err.message || 'Database error',
                            data: [],
                        };
                    }
                }))
            ),
            catchError((error) => {
                return of({
                    success: false,
                    message: error.message || 'Internal server error',
                    data: [],
                });
            })
        );
    }

}
