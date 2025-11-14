import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { SimpleQueryResult } from 'src/common/interfaces/simple-query-result.interface';
import { DatabaseService } from 'src/common/database/sqlServer/ITMV/database.service';
import { Observable, from, of, throwError, defer, catchError } from 'rxjs';
import { ERPMailDetail } from '../entities/mailDetail.entity';
import { ERPMails } from '../entities/mail.entity';
@Injectable()
export class MailService {
    constructor(
        private readonly databaseService: DatabaseService,
        @InjectRepository(ERPMails)
        private readonly ERPMailsRepository: Repository<ERPMails>,
        @InjectRepository(ERPMailDetail)
        private readonly ERPMailDetailRepository: Repository<ERPMailDetail>,
    ) { }



    private chunkArray<T>(array: T[], size: number): T[][] {
        const result: T[][] = [];
        for (let i = 0; i < array.length; i += size) {
            result.push(array.slice(i, i + size));
        }
        return result;
    }


    addEmail(records: ERPMails[], createdBy: number): Observable<any> {
        if (!records || records.length === 0) {
            return throwError(() => new BadRequestException('No records provided for insertion'));
        }

        const processedRecords = records.map(record => ({ ...record }));
        const batchSize = 100;
        const idChunkSize = 100;
        const batches = this.chunkArray(processedRecords, batchSize);

        return from(
            (async () => {
                let affectedRows = 0;
                let insertedRecords: any[] = [];

                for (const batch of batches) {
                    const result = await this.ERPMailsRepository
                        .createQueryBuilder()
                        .insert()
                        .into(ERPMails)
                        .values(batch)
                        .returning(["IdSeq"])
                        .execute();

                    affectedRows += result.identifiers.length;
                    const insertedIds = result.identifiers.map((item) => item.IdSeq);

                    if (insertedIds.length === 0) continue;

                    for (let i = 0; i < insertedIds.length; i += idChunkSize) {
                        const chunk = insertedIds.slice(i, i + idChunkSize);

                        const newlyInsertedRecords = await this.ERPMailsRepository
                            .createQueryBuilder('u')
                            .select([
                                'u.IdSeq as "IdSeq"',
                                'u.IdxNo as "IdxNo"',
                                'u.Port as "Port"',
                                'u.Host as "Host"',
                                'u.UserName as "UserName"',
                                'u.Password as "Password"',
                                'u.CodeMail as "CodeMail"'
                            ])
                            .where('u.IdSeq IN (:...chunk)', { chunk })
                            .getRawMany();

                        insertedRecords = [...insertedRecords, ...newlyInsertedRecords];
                    }
                }

                return {
                    affectedRows,
                    message: 'Records inserted successfully',
                    data: insertedRecords,
                };
            })()
        );
    }
    addMailDetails(records: ERPMailDetail[], createdBy: number): Observable<any> {
        if (!records || records.length === 0) {
            return throwError(() => new BadRequestException('No records provided for insertion'));
        }

        const processedRecords = records.map(record => ({ ...record }));
        const batchSize = 100;
        const idChunkSize = 100;
        const batches = this.chunkArray(processedRecords, batchSize);

        return from(
            (async () => {
                let affectedRows = 0;
                let insertedRecords: any[] = [];

                for (const batch of batches) {
                    const result = await this.ERPMailDetailRepository
                        .createQueryBuilder()
                        .insert()
                        .into(ERPMailDetail)
                        .values(batch)
                        .returning(["IdSeq"])
                        .execute();

                    affectedRows += result.identifiers.length;
                    const insertedIds = result.identifiers.map((item) => item.IdSeq);

                    if (insertedIds.length === 0) continue;

                    for (let i = 0; i < insertedIds.length; i += idChunkSize) {
                        const chunk = insertedIds.slice(i, i + idChunkSize);

                        const newlyInsertedRecords = await this.ERPMailDetailRepository
                            .createQueryBuilder('u')
                            .select([
                                'u.IdSeq as "IdSeq"',
                                'u.IdxNo as "IdxNo"',
                                'u.MailSettingsSeq as "MailSettingsSeq"',
                                'u.LanguageSeq as "LanguageSeq"',
                                'u.Subject as "Subject"',
                                'u.PlainText as "PlainText"',
                                'u.FromMail as "FromMail"',
                                'u.HtmlContent as "HtmlContent"'
                            ])
                            .where('u.IdSeq IN (:...chunk)', { chunk })
                            .getRawMany();

                        insertedRecords = [...insertedRecords, ...newlyInsertedRecords];
                    }
                }

                return {
                    affectedRows,
                    message: 'Records inserted successfully',
                    data: insertedRecords,
                };
            })()
        );
    }

    updateEmail(result: ERPMails[], updatedBy: number): Observable<any> {
        if (!result || result.length === 0) {
            return throwError(() => new BadRequestException('No records provided for update'));
        }

        const batchSize = 100;
        const idChunkSize = 100;
        const batches = this.chunkArray(result, batchSize);

        return from(
            (async () => {
                let affectedRows = 0;
                let updatedRecords: any[] = [];

                for (const batch of batches) {
                    const idsToUpdate: number[] = [];

                    for (const record of batch) {
                        const { IdSeq, ...updateData } = record;
                        await this.ERPMailsRepository.update(IdSeq, {
                            ...updateData,
                        });
                        affectedRows++;
                        idsToUpdate.push(IdSeq);
                    }

                    for (let i = 0; i < idsToUpdate.length; i += idChunkSize) {
                        const chunk = idsToUpdate.slice(i, i + idChunkSize);

                        const updatedChunk = await this.ERPMailsRepository
                            .createQueryBuilder('u')
                            .select([
                                'u.IdSeq as "IdSeq"',
                                'u.IdxNo as "IdxNo"',
                                'u.Port as "Port"',
                                'u.Host as "Host"',
                                'u.UserName as "UserName"',
                                'u.Password as "Password"',
                                'u.CodeMail as "CodeMail"'
                            ])
                            .where('u.IdSeq IN (:...chunk)', { chunk })
                            .getRawMany();

                        updatedRecords = [...updatedRecords, ...updatedChunk];
                    }
                }

                return {
                    affectedRows,
                    message: 'Records updated successfully',
                    data: updatedRecords
                };
            })()
        );
    }
    updateMailDetails(result: ERPMailDetail[], updatedBy: number): Observable<any> {
        if (!result || result.length === 0) {
            return throwError(() => new BadRequestException('No records provided for update'));
        }

        const batchSize = 100;
        const idChunkSize = 100;
        const batches = this.chunkArray(result, batchSize);

        return from(
            (async () => {
                let affectedRows = 0;
                let updatedRecords: any[] = [];

                for (const batch of batches) {
                    const idsToUpdate: number[] = [];

                    for (const record of batch) {
                        const { IdSeq, ...updateData } = record;
                        await this.ERPMailDetailRepository.update(IdSeq, {
                            ...updateData,
                        });
                        affectedRows++;
                        idsToUpdate.push(IdSeq);
                    }

                    for (let i = 0; i < idsToUpdate.length; i += idChunkSize) {
                        const chunk = idsToUpdate.slice(i, i + idChunkSize);

                        const updatedChunk = await this.ERPMailDetailRepository
                            .createQueryBuilder('u')
                            .select([
                                'u.IdSeq as "IdSeq"',
                                'u.IdxNo as "IdxNo"',
                                'u.MailSettingsSeq as "MailSettingsSeq"',
                                'u.LanguageSeq as "LanguageSeq"',
                                'u.Subject as "Subject"',
                                'u.PlainText as "PlainText"',
                                'u.FromMail as "FromMail"',
                                'u.HtmlContent as "HtmlContent"'
                            ])
                            .where('u.IdSeq IN (:...chunk)', { chunk })
                            .getRawMany();

                        updatedRecords = [...updatedRecords, ...updatedChunk];
                    }
                }

                return {
                    affectedRows,
                    message: 'Records updated successfully',
                    data: updatedRecords
                };
            })()
        );
    }
    deleteEmail(result: any[]): Observable<any> {
        return defer(async () => {
            const ids = result.map(item => item.IdSeq);
        

            const deleteResult = await this.ERPMailsRepository.delete({ IdSeq: In(ids) });

            return {
                success: true,
                message: (deleteResult.affected ?? 0) > 0
                    ? `${deleteResult.affected} record(s) deleted successfully.`
                    : 'No records were deleted.',
            };
        }).pipe(
            catchError(() => of({
                success: false,
                message: 'An error occurred while trying to delete records.',
            }))
        );
    }
    deleteMailDetails(result: any[]): Observable<any> {
        return defer(async () => {
            const ids = result.map(item => item.IdSeq);

            const deleteResult = await this.ERPMailDetailRepository.delete({ IdSeq: In(ids) });

            return {
                success: true,
                message: (deleteResult.affected ?? 0) > 0
                    ? `${deleteResult.affected} record(s) deleted successfully.`
                    : 'No records were deleted.',
            };
        }).pipe(
            catchError(() => of({
                success: false,
                message: 'An error occurred while trying to delete records.',
            }))
        );
    }
    getEmail(
        filter: Record<string, any> = {},
        date?: string
    ): Observable<{ data: any[]; total: number; message: string; success: boolean }> {
        const query = this.ERPMailsRepository.createQueryBuilder('u');

        query.select([
            'u.IdSeq as "IdSeq"',
            'u.IdxNo as "IdxNo"',
            'u.Port as "Port"',
            'u.Host as "Host"',
            'u.UserName as "UserName"',
            'u.Password as "Password"',
            'u.CodeMail as "CodeMail"'
        ]);

        query.orderBy('u.IdSeq', 'ASC');

        return from(
            (async () => {
                const data = await query.getRawMany();

                return {
                    data,
                    total: data.length,
                    message: 'Success',
                    success: true,
                };
            })()
        );
    }
    getMailDetails(
        result: any[],
        date?: string
    ): Observable<{ data: any[]; total: number; message: string; success: boolean }> {
        const query = this.ERPMailDetailRepository.createQueryBuilder('u');

        query.select([
            'u.IdSeq as "IdSeq"',
            'u.IdxNo as "IdxNo"',
            'u.MailSettingsSeq as "MailSettingsSeq"',
            'u.LanguageSeq as "LanguageSeq"',
            'u.Subject as "Subject"',
            'u.PlainText as "PlainText"',
            'u.FromMail as "FromMail"',
            'u.HtmlContent as "HtmlContent"'
        ]);

        query.where('u.MailSettingsSeq = :mailSettingsSeq', {
            mailSettingsSeq: result[0]?.MailSettingsSeq,
        });

        query.orderBy('u.IdSeq', 'ASC');

        return from(
            (async () => {
                const data = await query.getRawMany();

                return {
                    data,
                    total: data.length,
                    message: 'Success',
                    success: true,
                };
            })()
        );
    }



}
