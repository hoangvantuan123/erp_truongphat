import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { ERPEmpRecruit } from '../entities/hr.emp.recruit.entity';

import { InjectDataSource } from '@nestjs/typeorm';
import { Observable, from, of, lastValueFrom, forkJoin } from 'rxjs';
import { catchError, map, mergeMap, toArray, concatMap, switchMap } from 'rxjs/operators';
import { DataSource } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import { GenerateXmlService } from '../generate-xml/generate-xml.service';
import { ERPFamilyRecruit } from '../entities/hr.family.recruit.entity';
@Injectable()
export class ErpEmpRecruitService {
    constructor(
        @InjectDataSource() private readonly dataSource: DataSource,
        private readonly generateXmlService: GenerateXmlService
    ) { }

    private chunkArray<T>(array: T[], size: number): T[][] {
        const result: T[][] = [];
        for (let i = 0; i < array.length; i += size) {
            result.push(array.slice(i, i + size));
        }
        return result;
    }

    private HrBasAddressAUD(result: any[], companySeq: number, userSeq: number, workingTag: string): Observable<any> {
        const xmlFlags = 2;
        const languageSeq = 6;
        const generateQuery = (xmlDocument: string, procedure: string, serviceSeq: number, pgmSeq: number) => `
            EXEC ${procedure}_WEB
            @xmlDocument = N'${xmlDocument}',
            @xmlFlags = ${xmlFlags},
            @ServiceSeq = ${serviceSeq},
            @WorkingTag = N'${workingTag}',
            @CompanySeq = ${companySeq},
            @LanguageSeq = ${languageSeq},
            @UserSeq = ${userSeq},
            @PgmSeq = ${pgmSeq};
        `;

        const xmlDoc1 = this.generateXmlService.generateXMLSHrBasAddressAUD(result, workingTag);
        const query1 = generateQuery(xmlDoc1, '_SHRBasAddressCheck', 1654, 1798);

        return forkJoin([
            from(this.dataSource.query(query1)),
        ]).pipe(
            switchMap(([data1]) => {
                const results = [data1];

                for (const data of results) {
                    if (!data?.length) {
                        return of({ success: false, errors: ["Không có dữ liệu trả về từ kiểm tra"] });
                    }

                    const hasInvalid = data.some((item: any) => item.Status !== 0);
                    if (hasInvalid) {
                        return of({
                            success: false,
                            errors: data.filter((item: any) => item.Status !== 0).map((item: any) => ({
                                IDX_NO: item.IDX_NO,
                                Name: item.ItemName,
                                result: item.Result,
                            })),
                        });
                    }
                }

                const saveXmlDoc1 = this.generateXmlService.generateXMLSHrBasAddressAUD(data1, workingTag);
                const saveQuery1 = generateQuery(saveXmlDoc1, '_SHRBasAddressSave', 1654, 1798);

                return forkJoin([
                    from(this.dataSource.query(saveQuery1)),
                ]).pipe(
                    map(([saveData1]) => {
                        const invalidItems = saveData1?.filter((item: any) => item.Status !== 0) || [];

                        if (invalidItems.length) {
                            const isInvalidFormat = invalidItems.some(
                                (item: any) => !item.IDX_NO || !item.ItemName || !item.Result
                            );

                            if (isInvalidFormat) {
                                return {
                                    success: false,
                                    errors: [{
                                        IDX_NO: 1,
                                        Name: 'Lỗi',
                                        result: 'Không thể lấy dữ liệu chi tiết lỗi.',
                                    }],
                                };
                            }

                            return {
                                success: false,
                                errors: invalidItems.map((item: any) => ({
                                    IDX_NO: item.IDX_NO,
                                    Name: item.ItemName,
                                    result: item.Result,
                                })),
                            };
                        }


                        return {
                            success: true,
                            data: {
                                logs1: saveData1,

                            }
                        };
                    })
                );
            }),
            catchError((err) => {
                return of({
                    success: false,
                    message: err?.message || 'Lỗi hệ thống',
                });
            })
        );
    }
    private HrEmpOneAUD(result: any[], companySeq: number, userSeq: number, workingTag: string): Observable<any> {
        const xmlFlags = 2;
        const languageSeq = 6;

        const generateQuery = (xmlDocument: string, procedure: string, serviceSeq: number, pgmSeq: number) => `
            EXEC ${procedure}_WEB
            @xmlDocument = N'${xmlDocument}',
            @xmlFlags = ${xmlFlags},
            @ServiceSeq = ${serviceSeq},
            @WorkingTag = N'${workingTag}',
            @CompanySeq = ${companySeq},
            @LanguageSeq = ${languageSeq},
            @UserSeq = ${userSeq},
            @PgmSeq = ${pgmSeq};
        `;

        const xmlDoc1 = this.generateXmlService.generateXMLSHREmpOne(result, workingTag);
        const query1 = generateQuery(xmlDoc1, '_SHREmpOneCheck', 1626, 1794);

        return forkJoin([
            from(this.dataSource.query(query1)),
        ]).pipe(
            switchMap(([data1]) => {
                if (!data1?.length) {
                    return of({ success: false, errors: ["Không có dữ liệu trả về."] });
                }

                const hasInvalid = data1.some((item: any) => item.Status !== 0);
                if (hasInvalid) {
                    return of({
                        success: false,
                        errors: data1.filter((item: any) => item.Status !== 0).map((item: any) => ({
                            IDX_NO: item.IDX_NO,
                            Name: item.ItemName,
                            result: item.Result,
                        })),
                    });
                }

                const saveXmlDoc1 = this.generateXmlService.generateXMLSHREmpOne(data1, workingTag);
                const saveQuery1 = generateQuery(saveXmlDoc1, '_SHREmpOneSave', 1626, 1794);

                return forkJoin([
                    from(this.dataSource.query(saveQuery1)),
                ]).pipe(
                    map(([saveData1]) => {
                        const invalidItems = saveData1?.filter((item: any) => item.Status !== 0) || [];

                        if (invalidItems.length) {
                            const isInvalidFormat = invalidItems.some(
                                (item: any) => !item.IDX_NO || !item.ItemName || !item.Result
                            );

                            if (isInvalidFormat) {
                                return {
                                    success: false,
                                    errors: [{
                                        IDX_NO: 1,
                                        Name: 'Lỗi',
                                        result: 'Không thể lấy dữ liệu chi tiết lỗi.',
                                    }],
                                };
                            }

                            return {
                                success: false,
                                errors: invalidItems.map((item: any) => ({
                                    IDX_NO: item.IDX_NO,
                                    Name: item.ItemName,
                                    result: item.Result,
                                })),
                            };
                        }

                        return {
                            success: true,
                            data: {
                                logs1: saveData1,
                            }
                        };
                    })
                );
            }),
            catchError((err) => {
                return of({
                    success: false,
                    message: err.message || 'Lỗi hệ thống',
                });
            })
        );
    }

    private HrEmpPlnAUD(result: any[], companySeq: number, userSeq: number, workingTag: string): Observable<any> {
        const xmlFlags = 2;
        const languageSeq = 6;

        const generateQuery = (xmlDocument: string, procedure: string, serviceSeq: number, pgmSeq: number) => `
            EXEC ${procedure}_WEB
            @xmlDocument = N'${xmlDocument}',
            @xmlFlags = ${xmlFlags},
            @ServiceSeq = ${serviceSeq},
            @WorkingTag = N'${workingTag}',
            @CompanySeq = ${companySeq},
            @LanguageSeq = ${languageSeq},
            @UserSeq = ${userSeq},
            @PgmSeq = ${pgmSeq};
        `;

        const xmlDoc1 = this.generateXmlService.generateXMLSHREmpIn(result, workingTag);
        const query1 = generateQuery(xmlDoc1, '_SHREmpInCheck', 1613, 1791);

        return forkJoin([
            from(this.dataSource.query(query1)),
        ]).pipe(
            switchMap(([data1]) => {
                const results = [data1];

                for (const data of results) {
                    if (!data?.length) {
                        return of({ success: false, errors: ["Không có dữ liệu trả về."] });
                    }

                    const hasInvalid = data.some((item: any) => item.Status !== 0);
                    if (hasInvalid) {
                        return of({
                            success: false,
                            errors: data.filter((item: any) => item.Status !== 0).map((item: any) => ({
                                IDX_NO: item.IDX_NO,
                                Name: item.ItemName,
                                result: item.Result,
                            })),
                        });
                    }
                }

                const saveXmlDoc1 = this.generateXmlService.generateXMLSHREmpIn(data1, workingTag);
                const saveQuery1 = generateQuery(saveXmlDoc1, '_SHREmpInSave', 1613, 1791);

                return forkJoin([
                    from(this.dataSource.query(saveQuery1)),
                ]).pipe(
                    map(([saveData1]) => {
                        for (const data of [saveData1]) {
                            const invalidItems = data?.filter((item: any) => item.Status !== 0) || [];

                            if (invalidItems.length) {
                                const isInvalidFormat = invalidItems.some(
                                    (item: any) => !item.IDX_NO || !item.ItemName || !item.Result
                                );

                                if (isInvalidFormat) {
                                    return {
                                        success: false,
                                        errors: [{
                                            IDX_NO: 1,
                                            Name: 'Lỗi',
                                            result: 'Không thể lấy dữ liệu chi tiết lỗi.',
                                        }],
                                    };
                                }

                                return {
                                    success: false,
                                    errors: invalidItems.map((item: any) => ({
                                        IDX_NO: item.IDX_NO,
                                        Name: item.ItemName,
                                        result: item.Result,
                                    })),
                                };
                            }
                        }

                        saveData1.forEach((item: any) => {
                            const target = result.find(r =>
                                (item.EmpID && r.EmpID === item.EmpID) ||
                                (item.IDX_NO && r.IdxNo === item.IDX_NO)
                            );
                            if (target) {
                                target.EmpSeq = item.EmpSeq ?? null;
                            }
                        });


                        return {
                            success: true,
                            data: {
                                logs1: result,
                            }
                        };
                    })
                );
            }),
            catchError((err) => {
                return of({
                    success: false,
                    message: err.message || 'Lỗi hệ thống',
                });
            })
        );
    }

    private HrBasFamilyAUD(result: any[], companySeq: number, userSeq: number, workingTag: string): Observable<any> {
        const xmlFlags = 2;
        const languageSeq = 6;

        const generateQuery = (xmlDocument: string, procedure: string, serviceSeq: number, pgmSeq: number) => `
            EXEC ${procedure}_WEB
            @xmlDocument = N'${xmlDocument}',
            @xmlFlags = ${xmlFlags},
            @ServiceSeq = ${serviceSeq},
            @WorkingTag = N'${workingTag}',
            @CompanySeq = ${companySeq},
            @LanguageSeq = ${languageSeq},
            @UserSeq = ${userSeq},
            @PgmSeq = ${pgmSeq};
        `;

        const xmlDoc1 = this.generateXmlService.generateXMLSHRBasFamily(result, workingTag);
        const query1 = generateQuery(xmlDoc1, '_SHRBasFamilyCheck', 1630, 1797);

        return forkJoin([
            from(this.dataSource.query(query1)),
        ]).pipe(
            switchMap(([data1]) => {
                const results = [data1];

                for (const data of results) {
                    if (!data?.length) {
                        return of({ success: false, errors: ["Không có dữ liệu trả về từ kiểm tra"] });
                    }

                    const hasInvalid = data.some((item: any) => item.Status !== 0);
                    if (hasInvalid) {
                        return of({
                            success: false,
                            errors: data.filter((item: any) => item.Status !== 0).map((item: any) => ({
                                IDX_NO: item.IDX_NO,
                                Name: item.ItemName,
                                result: item.Result,
                            })),
                        });
                    }
                }

                const saveXmlDoc1 = this.generateXmlService.generateXMLSHRBasFamily(data1, workingTag);
                const saveQuery1 = generateQuery(saveXmlDoc1, '_SHRBasFamilySave', 1630, 1797);

                return forkJoin([
                    from(this.dataSource.query(saveQuery1)),
                ]).pipe(
                    map(([saveData1]) => {
                        console.log('saveData1', saveData1)
                        const invalidItems = saveData1?.filter((item: any) => item.Status !== 0) || [];

                        if (invalidItems.length) {
                            const isInvalidFormat = invalidItems.some(
                                (item: any) => !item.IDX_NO || !item.ItemName || !item.Result
                            );

                            if (isInvalidFormat) {
                                return {
                                    success: false,
                                    errors: [{
                                        IDX_NO: 1,
                                        Name: 'Lỗi',
                                        result: 'Không thể lấy dữ liệu chi tiết lỗi.',
                                    }],
                                };
                            }

                            return {
                                success: false,
                                errors: invalidItems.map((item: any) => ({
                                    IDX_NO: item.IDX_NO,
                                    Name: item.ItemName,
                                    result: item.Result,
                                })),
                            };
                        }

                        return {
                            success: true,
                            data: {
                                logs1: saveData1,
                            }
                        };
                    })
                );
            }),
            catchError((err) => {
                return of({
                    success: false,
                    message: err?.message || 'Lỗi hệ thống',
                });
            })
        );
    }


    HrEmpRecruitA(result: any[]): Observable<any> {
        if (!result || result.length === 0) {
            throw new RpcException({ code: 5, message: 'No records provided for insertion' });
        }


        const batchSize = 1000;
        const batches = this.chunkArray(result, batchSize);
        let resultCache: any[] = [];

        return from(batches).pipe(
            mergeMap((batch) =>
                from(this.dataSource.transaction(async (manager) => {
                    try {
                        const insertResult = await manager
                            .createQueryBuilder()
                            .insert()
                            .into(ERPEmpRecruit)
                            .values(batch)
                            .execute();

                        const inserted = insertResult.identifiers.map((idObj, i) => ({
                            ...batch[i],
                            IdSeq: idObj.IdSeq,
                        }));

                        resultCache.push({
                            success: true,
                            data: inserted,
                        });

                        return {
                            success: true,
                            data: inserted,
                        };
                    } catch (err) {
                        let friendlyMessage = 'Lỗi hệ thống khi chèn dữ liệu';
                        if (err?.code === '23505') {
                            friendlyMessage = 'Dữ liệu đã tồn tại trong bảng.';
                        }
                        resultCache.push({
                            success: false,
                            message: friendlyMessage,
                            data: [],
                        });

                        return {
                            success: false,
                            message: friendlyMessage,
                            data: [],
                        };
                    }
                }))
            ),
            toArray(),
            map(() => {
                const hasError = resultCache.some(item => item.success === false);
                if (hasError) {
                    const firstError = resultCache.find(item => item.success === false);
                    return {
                        success: false,
                        message: firstError?.message || 'Error occurred during processing',
                        data: firstError?.data || [],
                    };
                }
                return {
                    success: true,
                    data: resultCache.flatMap(item => item.data),
                };
            }),
            catchError((error) => {
                return of({
                    success: false,
                    message: error.message || 'Internal server error',
                    data: [],
                });
            })
        );
    }


    HrEmpRecruitU(result: any[]): Observable<any> {
        if (!result || result.length === 0) {
            throw new RpcException({ code: 5, message: 'No records provided for update' });
        }

        const batchSize = 1000;
        const batches = this.chunkArray(result, batchSize);

        let resultCache: any[] = [];

        return from(batches).pipe(
            mergeMap((batch) =>
                from(this.dataSource.transaction(async (manager) => {
                    try {

                        for (const record of batch) {
                            const { IdSeq, ...updateData } = record;

                            await manager
                                .createQueryBuilder()
                                .update(ERPEmpRecruit)
                                .set(updateData)
                                .where('IdSeq = :id', { id: IdSeq })
                                .execute();
                        }

                        resultCache.push({
                            success: true,
                            data: batch,
                        });

                        return {
                            success: true,
                            data: batch,
                        };
                    } catch (err) {
                        resultCache.push({
                            success: false,
                            message: err.message || 'Database error',
                            data: [],
                        });

                        return {
                            success: false,
                            message: err.message || 'Database error',
                            data: [],
                        };
                    }
                }))
            ),
            toArray(),
            map(() => {
                const hasError = resultCache.some(item => item.success === false);
                if (hasError) {
                    const firstError = resultCache.find(item => item.success === false);
                    return {
                        success: false,
                        message: firstError?.message || 'Error occurred during processing',
                        data: firstError?.data || [],
                    };
                }
                return {
                    success: true,
                    data: resultCache.flatMap(item => item.data),
                };
            }),
            catchError((error) => of({
                success: false,
                message: error.message || 'Internal server error',
                data: [],
            }))
        );
    }


    HrEmpRecruitD(records: any[]): Observable<any> {
        if (!records || records.length === 0) {
            return of({
                success: false,
                message: 'No records provided for deletion',
                data: [],
            });
        }

        const ids = records.map(record => record.IdSeq);

        return from(this.dataSource.transaction(async (manager) => {
            try {


                const result = await manager.delete(ERPEmpRecruit, { IdSeq: In(ids) });

                if ((result.affected ?? 0) > 0) {
                    return {
                        success: true,
                        message: `${result.affected} record(s) deleted successfully`,
                        data: [],
                    };
                } else {
                    return {
                        success: false,
                        message: 'No records found to delete',
                        data: [],
                    };
                }
            } catch (error) {
                return {
                    success: false,
                    message: 79,
                    data: [],
                    error: error.message,
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



    HrEmpRecruitQ(result: any,): Observable<any> {

        if (!result) {
            return of({
                success: false,
                message: 'No query parameters provided',
                data: [],
            });
        }

        return from(this.dataSource.transaction(async (manager) => {
            try {
                const queryBuilder = manager.createQueryBuilder(ERPEmpRecruit, 'q')
                    .select([
                        'q.IdSeq as "IdSeq"',
                        'q.IdxNo as "IdxNo"',
                        'q.EmpID as "EmpID"',
                        'q.EmpName as "EmpName"',
                        'q.ResidID as "ResidID"',
                        'q.EmpFamilyName as "EmpFamilyName"',
                        'q.EmpFirstName as "EmpFirstName"',
                        'q.CreatedBy as "CreatedBy"',
                        'q.UpdatedBy as "UpdatedBy"',
                        'q.CreatedAt as "CreatedAt"',
                        'q.UpdatedAt as "UpdatedAt"',
                        'q.DegreeSeq as "DegreeSeq"',
                        'q.BirthDate as "BirthDate"',
                        'q.SMSexSeq as "SMSexSeq"',
                        'q.IssueDate as "IssueDate"',
                        'q.IssuePlace as "IssuePlace"',
                        'q.PhoneNumber as "PhoneNumber"',
                        'q.Email as "Email"',
                        'q.CategoryType as "CategoryType"',
                        'q.RecruitmentSeq as "RecruitmentSeq"',
                        'q.InterviewerSeq as "InterviewerSeq"',
                        'q.FactNameSeq as "FactNameSeq"',
                        'q.DepartmentSeq as "DepartmentSeq"',
                        'q.TeamSeq as "TeamSeq"',
                        'q.PartNameSeq as "PartNameSeq"',
                        'q.LineModel as "LineModel"',
                        'q.JopPositionSeq as "JopPositionSeq"',
                        'q.InterviewDate as "InterviewDate"',
                        'q.PerAddrStreet as "PerAddrStreet"',
                        'q.PerAddrWard as "PerAddrWard"',
                        'q.PerAddrDistrict as "PerAddrDistrict"',
                        'q.PerAddrProvince as "PerAddrProvince"',
                        'q.CurAddrStreet as "CurAddrStreet"',
                        'q.CurAddrWard as "CurAddrWard"',
                        'q.CurAddrDistrict as "CurAddrDistrict"',
                        'q.CurAddrProvince as "CurAddrProvince"',
                        'q.Ethnic as "Ethnic"',
                        'q.DistanceKm as "DistanceKm"',
                        'q.ContractTerm as "ContractTerm"',
                        'q.CheckAge as "CheckAge"',
                        'q.StatusSync as "StatusSync"',
                        's.DefineItemName as "Degree"',
                        's1.DefineItemName as "SMSexName"',
                        's2.DefineItemName as "RecruitmentName"',
                        's3.DefineItemName as "Department"',
                        's4.DefineItemName as "Team"',
                        's5.DefineItemName as "PartName"',
                        's6.DefineItemName as "JopPositionName"',
                        's7.EmpName as "Interviewer"',
                        's8.DefineItemName as "CategoryTypeName"',
                    ])


                    .leftJoin(
                        "_ERPDefineItem",
                        's',
                        'q."DegreeSeq" = s."IdSeq"',
                    )
                    .leftJoin(
                        "_ERPDefineItem",
                        's1',
                        'q."SMSexSeq" = s1."IdSeq"'
                    )
                    .leftJoin(
                        "_ERPDefineItem",
                        's2',
                        'q."RecruitmentSeq" = s2."IdSeq"'
                    )
                    .leftJoin(
                        "_ERPDefineItem",
                        's3',
                        'q."DepartmentSeq" = s3."IdSeq"'
                    )
                    .leftJoin(
                        "_ERPDefineItem",
                        's4',
                        'q."TeamSeq" = s4."IdSeq"'
                    )
                    .leftJoin(
                        "_ERPDefineItem",
                        's5',
                        'q."PartNameSeq" = s5."IdSeq"'
                    )
                    .leftJoin(
                        "_ERPDefineItem",
                        's6',
                        'q."JopPositionSeq" = s6."IdSeq"'
                    )
                    .leftJoin(
                        "_TDAEmp",
                        's7',
                        'q."InterviewerSeq" = s7."EmpSeq"'
                    )
                    .leftJoin(
                        "_ERPDefineItem",
                        's8',
                        'q."CategoryType" = s8."IdSeq"'
                    )
                    ;


                const startDate = result.KeyItem1 || null;
                const endDate = result.KeyItem2 || null;

                if (startDate && endDate) {
                    queryBuilder.andWhere('q.InterviewDate BETWEEN :start AND :end', {
                        start: startDate,
                        end: endDate,
                    });
                } else if (startDate) {
                    queryBuilder.andWhere('q.InterviewDate >= :start', { start: startDate });
                } else if (endDate) {
                    queryBuilder.andWhere('q.InterviewDate <= :end', { end: endDate });
                }

                if (result.KeyItem3) {
                    queryBuilder.andWhere('q.InterviewerSeq = :KeyItem3', { KeyItem3: result.KeyItem3 });
                }
                if (result.KeyItem4) {
                    queryBuilder.andWhere('q.StatusSync = :KeyItem4', { KeyItem4: result.KeyItem4 });
                }

                if (result.KeyItem5) {
                    queryBuilder.andWhere('q.EmpName LIKE :KeyItem5', {
                        KeyItem5: `%${result.KeyItem5}%`,
                    });
                }

                if (result.KeyItem6) {
                    queryBuilder.andWhere('q.EmpID LIKE :KeyItem6', {
                        KeyItem6: `%${result.KeyItem6}%`,
                    });
                }
                queryBuilder.orderBy('q.IdSeq', 'ASC');
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
    HrEmpRecruitS(result: any, companySeq: number, userSeq: number): Observable<any> {

        if (!result) {
            return of({
                success: false,
                message: 'No query parameters provided',
                data: [],
            });
        }

        return from(this.dataSource.transaction(async (manager) => {
            try {
                const queryBuilder = manager.createQueryBuilder(ERPEmpRecruit, 'q')
                    .select([
                        'q.IdSeq as "IdSeq"',
                        'q.IdxNo as "IdxNo"',
                        'q.EmpID as "EmpID"',
                        'q.EmpName as "EmpName"',
                        'q.ResidID as "ResidID"',
                        'q.EmpFamilyName as "EmpFamilyName"',
                        'q.EmpFirstName as "EmpFirstName"',
                        'q.CreatedBy as "CreatedBy"',
                        'q.UpdatedBy as "UpdatedBy"',
                        'q.CreatedAt as "CreatedAt"',
                        'q.UpdatedAt as "UpdatedAt"',
                        'q.DegreeSeq as "DegreeSeq"',
                        'q.BirthDate as "BirthDate"',
                        'q.IssueDate as "IssueDate"',
                        'q.IssuePlace as "IssuePlace"',
                        'q.PhoneNumber as "Cellphone"',
                        'q.Email as "Email"',
                        'q.CategoryType as "CategoryType"',
                        'q.RecruitmentSeq as "RecruitmentSeq"',
                        'q.InterviewerSeq as "InterviewerSeq"',
                        'q.FactNameSeq as "FactNameSeq"',
                        'q.DepartmentSeq as "DepartmentSeq"',
                        'q.TeamSeq as "TeamSeq"',
                        'q.PartNameSeq as "PartNameSeq"',
                        'q.LineModel as "LineModel"',
                        'q.JopPositionSeq as "JopPositionSeq"',
                        'q.InterviewDate as "EntDate"',
                        'q.PerAddrStreet as "PerAddrStreet"',
                        'q.PerAddrWard as "PerAddrWard"',
                        'q.PerAddrDistrict as "PerAddrDistrict"',
                        'q.PerAddrProvince as "PerAddrProvince"',
                        'q.CurAddrStreet as "CurAddrStreet"',
                        'q.CurAddrWard as "CurAddrWard"',
                        'q.CurAddrDistrict as "CurAddrDistrict"',
                        'q.CurAddrProvince as "CurAddrProvince"',
                        'q.Ethnic as "Remark"',
                        'q.DistanceKm as "DistanceKm"',
                        'q.ContractTerm as "ContractTerm"',
                        'q.CheckAge as "CheckAge"',
                        'q.Addr as "Addr"',
                        'q.Addr2 as "Addr2"',
                        'q.StatusSync as "StatusSync"',
                        's.DefineItemName as "Degree"',
                        's1.Value as "SMSexSeq"',
                        's2.Value as "UMEmployType"',
                        's3.DefineItemName as "Department"',
                        's4.DefineItemName as "Team"',
                        's5.DefineItemName as "PartName"',
                        's6.DefineItemName as "JopPositionName"',
                        's7.EmpName as "Interviewer"',
                        's8.DefineItemName as "CategoryTypeName"',
                        's8.Value as "UMEmpType"',
                    ])
                    .leftJoin("_ERPDefineItem", 's', 'q."DegreeSeq" = s."IdSeq"')
                    .leftJoin("_ERPDefineItem", 's1', 'q."SMSexSeq" = s1."IdSeq"')
                    .leftJoin("_ERPDefineItem", 's2', 'q."RecruitmentSeq" = s2."IdSeq"')
                    .leftJoin("_ERPDefineItem", 's3', 'q."DepartmentSeq" = s3."IdSeq"')
                    .leftJoin("_ERPDefineItem", 's4', 'q."TeamSeq" = s4."IdSeq"')
                    .leftJoin("_ERPDefineItem", 's5', 'q."PartNameSeq" = s5."IdSeq"')
                    .leftJoin("_ERPDefineItem", 's6', 'q."JopPositionSeq" = s6."IdSeq"')
                    .leftJoin("_TDAEmp", 's7', 'q."InterviewerSeq" = s7."EmpSeq"')
                    .leftJoin("_ERPDefineItem", 's8', 'q."CategoryType" = s8."IdSeq"')
                    ;

                const idSeqList = Array.isArray(result) ? result.map(x => x.IdSeq) : [];
                queryBuilder.andWhere('q.StatusSync = :StatusSync', { StatusSync: 'A' });
                if (idSeqList.length > 0) {
                    queryBuilder.andWhere('q.IdSeq IN (:...IdSeqList)', { IdSeqList: idSeqList });
                }

                queryBuilder.orderBy('q.IdSeq', 'ASC');
                const queryResult = await queryBuilder.getRawMany();

                const audResult = await lastValueFrom(
                    this.HrEmpPlnAUD(queryResult, companySeq, userSeq, 'A')
                );

                if (!audResult.success) {
                    return {
                        success: false,
                        message: 'Lỗi xử lý khi đồng bộ',
                        errors: audResult.errors || [],
                        data: [],
                    };
                }

                const resultWithEmpSeq = audResult.data.logs1;
                const empSeqList = resultWithEmpSeq.map((item: any) => item.IdSeq);
                const familyQueryBuilder = manager.createQueryBuilder(ERPFamilyRecruit, 'q')
                    .select([
                        'q.IdSeq as "IdSeq"',
                        'q.IdxNo as "IdxNo"',
                        'q.EmpSeq as "EmpSeq"',
                        'q.CreatedBy as "CreatedBy"',
                        'q.UpdatedBy as "UpdatedBy"',
                        'q.FamilyTypeSeq as "FamilyTypeSeq"',
                        'q.NationalId as "NationalId"',
                        'q.FullName as "FullName"',
                        'q.EducationLevel as "EducationLevel"',
                        'q.Occupation as "Occupation"',
                        'q.PhoneNumber as "PhoneNumber"',
                        'q.DateOfBirth as "DateOfBirth"',
                        'q.LivesTogether as "LivesTogether"',
                        's.EmpName as "EmpName"',
                        's.ResidID as "ResidID"',
                        's.EmpID as "EmpID"',
                        's.SMSexSeq as "SMSexSeq"',
                        's.InterviewDate as "InterviewDate"',
                        's1.DefineItemName as "SMSexName"',
                        's2.DefineItemName as "FamilyTypeName"',
                        's2.Value as "UMRelSeq"',
                    ])
                    .leftJoin("_ERPEmpRecruit", 's', 'q."EmpSeq" = s."IdSeq"')
                    .leftJoin("_ERPDefineItem", 's1', 's."SMSexSeq" = s1."IdSeq"')
                    .leftJoin("_ERPDefineItem", 's2', 'q."FamilyTypeSeq" = s2."IdSeq"')
                    .where('q.EmpSeq IN (:...empSeqList)', { empSeqList });

                const familyResult = await familyQueryBuilder.getRawMany();

                const empSeqMap = new Map<number, any>();
                resultWithEmpSeq.forEach(item => {
                    empSeqMap.set(item.IdSeq, item);
                });

                const familyResultEnriched = familyResult.map(familyItem => {
                    const empData = empSeqMap.get(familyItem.EmpSeq);
                    return {
                        ...familyItem,
                        EmpSeqSync: empData?.EmpSeq || null
                    };
                });
                let addressAudResult: any = { success: true };
                let addHrEmpOneAUDResult: any = { success: true };
                let addHrBaseFamilyAUDResult: any = { success: true };


                if (resultWithEmpSeq?.length > 0) {
                    addressAudResult = await lastValueFrom(
                        this.HrBasAddressAUD(resultWithEmpSeq, companySeq, userSeq, 'A')
                    );

                    addHrEmpOneAUDResult = await lastValueFrom(
                        this.HrEmpOneAUD(resultWithEmpSeq, companySeq, userSeq, 'U')
                    );
                }

                if (familyResultEnriched?.length > 0) {
                    addHrBaseFamilyAUDResult = await lastValueFrom(
                        this.HrBasFamilyAUD(familyResultEnriched, companySeq, userSeq, 'A')
                    );
                }

                if (!addressAudResult.success) {
                    return {
                        success: false,
                        message: 'Lỗi xử lý đồng bộ địa chỉ',
                        errors: 'Lỗi xử lý đồng bộ địa chỉ',
                        data: [],
                    };
                }
                if (!addHrEmpOneAUDResult.success) {
                    console.log('addHrEmpOneAUDResult', addHrEmpOneAUDResult)
                    return {
                        success: false,
                        message: 'Lỗi xử lý đồng bộ thông tin nhân viên',
                        errors: 'Lỗi xử lý đồng bộ thông tin nhân viên',
                        data: [],
                    };
                }
                if (!addHrBaseFamilyAUDResult.success) {
                    return {
                        success: false,
                        message: 'Lỗi xử lý đồng bộ thông tin gia đình nhân viên',
                        errors: 'Lỗi xử lý đồng bộ thông tin gia đình nhân viên',
                        data: [],
                    };
                }



                await manager
                    .createQueryBuilder()
                    .update(ERPEmpRecruit)
                    .set({ StatusSync: 'S' })
                    .where('IdSeq IN (:...ids)', { ids: empSeqList })
                    .execute();
                return {
                    success: true,
                    data: resultWithEmpSeq,
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



    HrEmpRecruitMonthlySummary(result: any): Observable<any> {
        return from(this.dataSource.transaction(async (manager) => {
            try {
                const queryBuilder = manager.createQueryBuilder(ERPEmpRecruit, 'q')
                    .select([
                        `LEFT(CONVERT(varchar, q.InterviewDate, 120), 6) AS Month`,
                        `COUNT(*) AS Total`,
                        `SUM(CASE WHEN q.StatusSync = 'S' THEN 1 ELSE 0 END) AS Synced`,
                        `SUM(CASE WHEN q.StatusSync = 'A' THEN 1 ELSE 0 END) AS UnSynced`
                    ])
                    .groupBy(`LEFT(CONVERT(varchar, q.InterviewDate, 120), 6)`)
                    .orderBy(`LEFT(CONVERT(varchar, q.InterviewDate, 120), 6)`, 'ASC');

                const queryResult = await queryBuilder.getRawMany();

                return {
                    success: true,
                    message: 'Monthly recruitment sync summary retrieved successfully',
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


}
