import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { TCADictionarysWeb } from '../entities/dictionary.entity';
import { TCALanguageWeb } from '../entities/language.entity';
import { SimpleQueryResult } from 'src/common/interfaces/simple-query-result.interface';
import { DatabaseService } from 'src/common/database/sqlServer/ITMV/database.service';
import { ERROR_MESSAGES } from 'src/common/utils/constants';

@Injectable()
export class LanguageService {
    constructor(
        private readonly databaseService: DatabaseService,
        @InjectRepository(TCADictionarysWeb)
        private readonly TCADictionarysWebRepository: Repository<TCADictionarysWeb>,
        @InjectRepository(TCALanguageWeb)
        private readonly TCALanguageWebRepository: Repository<TCALanguageWeb>,
    ) { }

    async GetLanguageWeb(languageSeq: string): Promise<SimpleQueryResult> {
        try {
            const result = await this.databaseService.findLanguageSeq(languageSeq);
            return { success: true, data: result };
        } catch (error) {
            return { success: false, message: ERROR_MESSAGES.DATABASE_ERROR };
        }
    }

    private chunkArray<T>(array: T[], size: number): T[][] {
        const result: T[][] = [];
        for (let i = 0; i < array.length; i += size) {
            result.push(array.slice(i, i + size));
        }
        return result;
    }

    async addMultipleLang(records: TCALanguageWeb[], createdBy: number): Promise<any> {
        if (!records || records.length === 0) {
            throw new Error('No records provided for insertion');
        }

        const processedRecords = records.map(record => ({
            ...record,
            LastUserSeq: createdBy
        }));

        const batchSize = 100;
        const idChunkSize = 100;
        const batches = this.chunkArray(processedRecords, batchSize);

        let affectedRows = 0;
        let insertedRecords: any[] = [];

        for (const batch of batches) {
            const result = await this.TCALanguageWebRepository
                .createQueryBuilder()
                .insert()
                .into(TCALanguageWeb)
                .values(batch)
                .execute();

            affectedRows += result.identifiers.length;

            for (const identifier of result.identifiers) {
                await this.TCALanguageWebRepository
                    .createQueryBuilder()
                    .update(TCALanguageWeb)
                    .set({ LanguageSeq: identifier.IdSeq })
                    .where("IdSeq = :id", { id: identifier.IdSeq })
                    .execute();
            }

            const insertedIds = result.identifiers.map((item) => item.IdSeq);

            for (let i = 0; i < insertedIds.length; i += idChunkSize) {
                const chunk = insertedIds.slice(i, i + idChunkSize);

                const newlyInsertedRecords = await this.TCALanguageWebRepository
                    .createQueryBuilder('lang')
                    .select([
                        'lang.IdSeq as "IdSeq"',
                        'lang.LanguageSeq as "LanguageSeq"',
                        'lang.LanguageName as "LanguageName"',
                        'lang.Remark as "Remark"',
                        'lang.SortOrder as "SortOrder"',
                        'lang.IsUse as "IsUse"',
                        'lang.FileName as "FileName"',
                        'lang.LastUserSeq as "LastUserSeq"',
                        'lang.LastDateTime as "LastDateTime"',
                        'lang.LanguageCode as "LanguageCode"',
                        'lang.IdxNo as "IdxNo"'
                    ])
                    .where('lang.IdSeq IN (:...chunk)', { chunk })
                    .getRawMany();

                insertedRecords = [...insertedRecords, ...newlyInsertedRecords];
            }
        }

        return {
            affectedRows,
            message: 'Records inserted successfully',
            data: insertedRecords,
        };
    }



    /*  async addMultipleDictionarys(records: TCADictionarysWeb[], createdBy: number): Promise<any> {
         if (!records || records.length === 0) {
             throw new Error('No records provided for insertion');
         }
         const processedRecords = records.map(record => ({
             ...record,
             LastUserSeq: createdBy
         }));
 
         const batchSize = 400;
         const batches = this.chunkArray(processedRecords, batchSize);
 
         let affectedRows = 0;
         for (const batch of batches) {
             const result = await this.TCADictionarysWebRepository.insert(batch);
             affectedRows += result.identifiers.length;
         }
 
         return {
             affectedRows,
             message: 'Records inserted successfully'
         };
     }
  */

    async addMultipleDictionarys(records: TCADictionarysWeb[], createdBy: number): Promise<any> {
        if (!records || records.length === 0) {
            throw new Error('No records provided for insertion');
        }

        // Gán LastUserSeq trước khi insert
        const processedRecords = records.map(record => ({
            ...record,
            LastUserSeq: createdBy
        }));

        const batchSize = 100; // Chia batch để tối ưu hiệu suất
        const idChunkSize = 100;
        const batches = this.chunkArray(processedRecords, batchSize);

        let affectedRows = 0;
        let insertedRecords: any[] = [];

        for (const batch of batches) {
            const result = await this.TCADictionarysWebRepository
                .createQueryBuilder()
                .insert()
                .into(TCADictionarysWeb)
                .values(batch)
                .returning(["IdSeq"])
                .execute();

            affectedRows += result.identifiers.length;
            const insertedIds = result.identifiers.map((item) => item.IdSeq); 
           
            if (insertedIds.length === 0) {
                continue;
            }

            for (let i = 0; i < insertedIds.length; i += idChunkSize) {
                const chunk = insertedIds.slice(i, i + idChunkSize);

                const newlyInsertedRecords = await this.TCADictionarysWebRepository
                    .createQueryBuilder('lang')
                    .select([
                        'lang.IdSeq as "IdSeq"',
                        'lang.LanguageSeq as "LanguageSeq"',
                        'lang.WordSeq as "WordSeq"',
                        'lang.Word as "Word"',
                        'lang.IdxNo as "IdxNo"'
                    ])
                    .where('lang.IdSeq IN (:...chunk)', { chunk })
                    .getRawMany();

                insertedRecords = [...insertedRecords, ...newlyInsertedRecords];
            }
        }

        return {
            affectedRows,
            message: 'Records inserted successfully',
            data: insertedRecords,
        };
    }

    async updateMultipleLang(records: TCALanguageWeb[], updatedBy: number): Promise<any> {
        if (!records || records.length === 0) {
            throw new Error('No records provided for update');
        }

        const batchSize = 1000;
        const batches = this.chunkArray(records, batchSize);

        let affectedRows = 0;

        for (const batch of batches) {
            for (const record of batch) {
                const { LanguageSeq, ...updateData } = record;
                const dataToUpdate = {
                    ...updateData,
                };
                await this.TCALanguageWebRepository.update(LanguageSeq, dataToUpdate);
                affectedRows++;
            }
        }

        return { affectedRows };
    }


    /*   async updateMultipleDictionarys(records: TCADictionarysWeb[], updatedBy: number): Promise<any> {
          if (!records || records.length === 0) {
              throw new Error('No records provided for update');
          }
  
          const batchSize = 1000;
          const batches = this.chunkArray(records, batchSize);
  
          let affectedRows = 0;
  
          for (const batch of batches) {
              for (const record of batch) {
                  const { WordSeq, ...updateData } = record;
                  const dataToUpdate = {
                      ...updateData,
                  };
                  await this.TCADictionarysWebRepository.update(WordSeq, dataToUpdate);
                  affectedRows++;
              }
          }
  
          return { affectedRows };
      }
   */
    async updateMultipleDictionarys(
        records: TCADictionarysWeb[],
        updatedBy: number
    ): Promise<any> {
        if (!records || records.length === 0) {
            throw new Error('No records provided for update');
        }

        const batchSize = 1000;
        const batches = this.chunkArray(records, batchSize);

        let affectedRows = 0;
        let updatedRecords: any[] = [];

        for (const batch of batches) {
            try {
                // Chuyển đổi dữ liệu thành mảng các IdSeq và dữ liệu cần update
                const updatePromises = batch.map(({ IdSeq, ...updateData }) =>
                    this.TCADictionarysWebRepository.update(IdSeq, updateData)
                );

                // Chạy cập nhật đồng thời
                await Promise.all(updatePromises);
                affectedRows += batch.length;

                // Nếu DB hỗ trợ RETURNING, lấy luôn dữ liệu sau update
                const updatedBatch = await this.TCADictionarysWebRepository.find({
                    where: batch.map(({ IdSeq }) => ({ IdSeq })),
                });

                updatedRecords.push(...updatedBatch);
            } catch (error) {
                console.error('Error updating batch:', error);
            }
        }

        return {
            affectedRows,
            message: 'Records updated successfully',
            data: updatedRecords,
        };
    }


    async findAllLangSys(
        filter: Record<string, any> = {},
        date?: string
    ): Promise<{ data: any[]; total: number; message: string, success: boolean }> {
        const query = this.TCALanguageWebRepository.createQueryBuilder('lang');

        if (filter.LanguageName) {
            const LanguageName = filter.LanguageName;
            query.andWhere(
                '(LOWER(lang.LanguageName) LIKE LOWER(:LanguageName) OR LOWER(lang.LanguageCode) LIKE LOWER(:LanguageName) OR LOWER(lang.Remark) LIKE LOWER(:LanguageName))',
                { LanguageName: `%${LanguageName}%` }
            );
        }

        query.select([
            'lang.IdSeq as "IdSeq"',
            'lang.LanguageSeq as "LanguageSeq"',
            'lang.LanguageName as "LanguageName"',
            'lang.Remark as "Remark"',
            'lang.SortOrder as "SortOrder"',
            'lang.IsUse as "IsUse"',
            'lang.FileName as "FileName"',
            'lang.LastUserSeq as "LastUserSeq"',
            'lang.LastDateTime as "LastDateTime"',
            'lang.LanguageCode as "LanguageCode"'
        ]);

        query.orderBy('lang.LanguageSeq', 'ASC');

        const data = await query.getRawMany();

        return {
            data,
            total: data.length,
            message: 'Success',
            success: true,
        };
    }
    async findAllDictionary(
        filter: Record<string, any> = {},
        date?: string,
        page: number = 1,
        pageSize: number = 10000
    ): Promise<{ data: any[]; total: number; totalPages: number; currentPage: number; message: string; success: boolean }> {

        const languageSeq = parseInt(filter.LanguageSeq, 10) || 0;
        const wordSeq = filter.wordSeq ? parseInt(filter.wordSeq, 10) : null;
        const word = filter.wordText ? `%${filter.wordText}%` : null; // Tìm kiếm tương đối

        if (!languageSeq) {
            return {
                data: [],
                total: 0,
                totalPages: 0,
                currentPage: page,
                message: 'Invalid LanguageSeq',
                success: false
            };
        }

        // Điều kiện lọc dữ liệu
        let whereClause = `WHERE dict.LanguageSeq = @0`;
        const params: any[] = [languageSeq];

        // Xử lý wordSeq
        if (wordSeq !== null) {
            whereClause += ` AND dict.WordSeq = @${params.length}`;
            params.push(wordSeq);
        }

        // Xử lý wordText (tránh lỗi khi NULL)
        if (word !== null) {
            whereClause += ` AND dict.Word LIKE @${params.length}`;
            params.push(word);
        }

        // Truy vấn tổng số bản ghi
        const totalRecordsQuery = `
            SELECT COUNT(*) AS total
            FROM _TCADictionary_WEB dict
            LEFT JOIN _TCALanguage_WEB lang ON lang.LanguageSeq = dict.LanguageSeq
            ${whereClause}
        `;

        const totalRecordsResult = await this.TCADictionarysWebRepository.query(totalRecordsQuery, params);
        const totalRecords = totalRecordsResult.length > 0
            ? parseInt(String(Object.values(totalRecordsResult[0])[0]), 10) || 0
            : 0;

        const totalPages = totalRecords > 0 ? Math.ceil(totalRecords / pageSize) : 0;

        if (totalRecords === 0) {
            return {
                data: [],
                total: 0,
                totalPages: 0,
                currentPage: page,
                message: 'No data found',
                success: true
            };
        }

        const offset = (page - 1) * pageSize + 1;
        let endRow = page * pageSize;
        if (endRow > totalRecords) endRow = totalRecords;

        if (offset > totalRecords) {
            return {
                data: [],
                total: totalRecords,
                totalPages,
                currentPage: page,
                message: 'No data found',
                success: true
            };
        }

        // Truy vấn lấy dữ liệu theo phân trang
        const paginatedQuery = `
            WITH CTE AS (
                SELECT
                    dict.IdSeq,
                    dict.WordSeq,
                    dict.Word,
                    dict.Description,
                    dict.LanguageSeq,
                    lang.LanguageName,
                    lang.LanguageCode,
                    dict.LastUserSeq,
                    dict.LastDateTime,
                    dict.CompanySeq,
                    dict.PgmSeq,
                    ROW_NUMBER() OVER (ORDER BY dict.WordSeq ASC) AS RowNum
                FROM _TCADictionary_WEB dict
                LEFT JOIN _TCALanguage_WEB lang ON lang.LanguageSeq = dict.LanguageSeq
                ${whereClause}
            )
            SELECT * FROM CTE WHERE RowNum BETWEEN @${params.length} AND @${params.length + 1}
        `;

        params.push(offset, endRow);
        const data = await this.TCADictionarysWebRepository.query(paginatedQuery, params);

        return {
            data,
            total: totalRecords,
            totalPages,
            currentPage: page,
            message: 'Success',
            success: true
        };
    }









    async deleteLangsIds(ids: number[]): Promise<any> {
        try {
            const usedLangs = await this.TCADictionarysWebRepository.find({
                where: { LanguageSeq: In(ids) },
            });

            if (usedLangs.length > 0) {
                return {
                    success: false,
                    message: 'Some languages are being used and cannot be deleted.',
                };
            }

            const result = await this.TCALanguageWebRepository.delete({ LanguageSeq: In(ids) });

            return {
                success: true,
                message: (result.affected ?? 0) > 0
                    ? `${result.affected} language(s) deleted successfully.`
                    : 'No languages found to delete.',
            };
        } catch (error: any) {
            return {
                success: false,
                message: 'An error occurred while trying to delete languages.',
            };
        }
    }

    async deleteDictionarysIds(ids: number[]): Promise<any> {
        try {

            const result = await this.TCADictionarysWebRepository.delete({ IdSeq: In(ids) });

            return {
                success: true,
                message: (result.affected ?? 0) > 0
                    ? `${result.affected} language(s) deleted successfully.`
                    : 'No languages found to delete.',
            };
        } catch (error: any) {
            return {
                success: false,
                message: 'An error occurred while trying to delete languages.',
            };
        }
    }

}
