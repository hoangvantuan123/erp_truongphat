import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { ERPPublicIPs } from '../entities/ipEnity.entity';
import { SimpleQueryResult } from 'src/common/interfaces/simple-query-result.interface';
import { DatabaseService } from 'src/common/database/sqlServer/ITMV/database.service';
import { Observable, from, of, throwError, switchMap, catchError, defer } from 'rxjs';

@Injectable()
export class PublicIPsService {
    constructor(
        private readonly databaseService: DatabaseService,
        @InjectRepository(ERPPublicIPs)
        private readonly ERPPublicIPsRepository: Repository<ERPPublicIPs>,
    ) { }



    private chunkArray<T>(array: T[], size: number): T[][] {
        const result: T[][] = [];
        for (let i = 0; i < array.length; i += size) {
            result.push(array.slice(i, i + size));
        }
        return result;
    }


    addPublicIP(result: any[], createdBy: number): Observable<any> {
        if (!result || result.length === 0) {
            return throwError(() => new BadRequestException('No records provided for insertion'));
        }

        const processedRecords = result.map(({ IdSeq, ...rest }) => ({ ...rest }));

        const batchSize = 100;
        const idChunkSize = 100;
        const batches = this.chunkArray(processedRecords, batchSize);

        return from(
            (async () => {
                let affectedRows = 0;
                let insertedRecords: any[] = [];

                for (const batch of batches) {
                    const result = await this.ERPPublicIPsRepository
                        .createQueryBuilder()
                        .insert()
                        .into(ERPPublicIPs)
                        .values(batch)
                        .returning(["IdSeq"])
                        .execute();

                    affectedRows += result.identifiers.length;
                    const insertedIds = result.identifiers.map((item) => item.IdSeq);

                    if (insertedIds.length === 0) continue;

                    for (let i = 0; i < insertedIds.length; i += idChunkSize) {
                        const chunk = insertedIds.slice(i, i + idChunkSize);

                        const newlyInsertedRecords = await this.ERPPublicIPsRepository
                            .createQueryBuilder('u')
                            .select([
                                'u.IdSeq as "IdSeq"',
                                'u.IdxNo as "IdxNo"',
                                'u.IPAddress as "IPAddress"',
                                'u.Description as "Description"'
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

    updatePublicIP(result: ERPPublicIPs[], updatedBy: number): Observable<any> {
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
                        await this.ERPPublicIPsRepository.update(IdSeq, {
                            ...updateData,
                        });
                        affectedRows++;
                        idsToUpdate.push(IdSeq);
                    }

                    for (let i = 0; i < idsToUpdate.length; i += idChunkSize) {
                        const chunk = idsToUpdate.slice(i, i + idChunkSize);

                        const updatedChunk = await this.ERPPublicIPsRepository
                            .createQueryBuilder('u')
                            .select([
                                'u.IdSeq as "IdSeq"',
                                'u.IdxNo as "IdxNo"',
                                'u.IPAddress as "IPAddress"',
                                'u.Description as "Description"'
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



    findAllERPPublicIPs(
        filter: Record<string, any> = {},
        date?: string
    ): Observable<{ data: any[]; total: number; message: string; success: boolean }> {
        const query = this.ERPPublicIPsRepository.createQueryBuilder('u');

        query.select([
            'u.IdSeq as "IdSeq"',
            'u.IdxNo as "IdxNo"',
            'u.IPAddress as "IPAddress"',
            'u.Description as "Description"'
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

    deletePublicIP(result: any[]): Observable<any> {
        return defer(async () => {
            const ids = result.map(item => item.IdSeq);

            const existingRecords = await this.ERPPublicIPsRepository.find({
                where: { IdSeq: In(ids) },
            });

            if (existingRecords.length === 0) {
                return {
                    success: false,
                    message: 'No Public IP records found to delete.',
                };
            }

            const deleteResult = await this.ERPPublicIPsRepository.delete({ IdSeq: In(ids) });

            return {
                success: true,
                message: (deleteResult.affected ?? 0) > 0
                    ? `${deleteResult.affected} Public IP record(s) deleted successfully.`
                    : 'No Public IP records were deleted.',
            };
        }).pipe(
            catchError(() => of({
                success: false,
                message: 'An error occurred while trying to delete Public IP records.',
            }))
        );
    }


}
