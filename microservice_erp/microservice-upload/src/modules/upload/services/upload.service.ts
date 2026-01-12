import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/common/database/database.service';
import { InjectRepository } from '@nestjs/typeorm';
import { ERPUploadsFile } from '../entities/uploadFile.entity';
import { Repository, In } from 'typeorm';
@Injectable()
export class UploadService {
  constructor(
    private readonly databaseService: DatabaseService,
    @InjectRepository(ERPUploadsFile)
    private readonly ERPUploadsFileRepository: Repository<ERPUploadsFile>,
  ) { }
  getHello() {
    return { hello: 'world' };
  }
  private chunkArray<T>(array: T[], size: number): T[][] {
    const result: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  }

  async addMultiple(
    records: any[],
    createdBy: number,
  ): Promise<any> {
    if (!records || records.length === 0) {
      throw new Error('No records provided for insertion');
    }

    const processedRecords = records.map((record) => ({
      ...record,
      CreatedBy: createdBy,
    }));

    const batchSize = 1000;
    const batches = this.chunkArray(processedRecords, batchSize);

    let affectedRows = 0;
    let insertedRecords: ERPUploadsFile[] = [];

    for (const batch of batches) {
      const result = await this.ERPUploadsFileRepository.insert(batch);

      const insertedIds = result.identifiers.map((item) => item.IdSeq);

      const newlyInsertedRecords = await this.ERPUploadsFileRepository
        .createQueryBuilder('file')
        .select([
          'file.IdSeq as "IdSeq"',
          'file.FormCode as "FormCode"',
          'file.FieldName as "FieldName"',
          'file.OriginalName as "OriginalName"',
          'file.Encoding as "Encoding"',
          'file.MimeType as "MimeType"',
          'file.Destination as "Destination"',
          'file.Filename as "Filename"',
          'file.Path as "Path"',
          'file.Size as "Size"',
          'file.IdxNo as "IdxNo"',
          'file.CreatedBy as "CreatedBy"',
          'file.CreatedAt as "CreatedAt"',
          'file.UpdatedBy as "UpdatedBy"',
          'file.UpdatedAt as "UpdatedAt"',
          'UserSeq.UserName as "UserName"',
          'UserSeq.UserId as "UserId"',
        ])
        .leftJoin(
          '_TCAUser_WEB',
          'UserSeq',
          'file.CreatedBy = UserSeq.UserSeq'
        )
        .where('file.IdSeq IN (:...insertedIds)', { insertedIds })
        .getRawMany();

      affectedRows += result.identifiers.length;
      insertedRecords = [...insertedRecords, ...newlyInsertedRecords];

    }


    return {
      affectedRows,
      message: 'Records inserted successfully',
      data: insertedRecords,
    };
  }


  async findAll(): Promise<{
    data: any[];
    total: number;
    message: string;
    success: boolean;
  }> {
    const query = this.ERPUploadsFileRepository.createQueryBuilder('file');

    query.select([
      'file.IdSeq as "IdSeq"',
      'file.FormCode as "FormCode"',
      'file.FieldName as "FieldName"',
      'file.OriginalName as "OriginalName"',
      'file.Encoding as "Encoding"',
      'file.MimeType as "MimeType"',
      'file.Destination as "Destination"',
      'file.Filename as "Filename"',
      'file.Path as "Path"',
      'file.Size as "Size"',
      'file.IdxNo as "IdxNo"',
      'file.CreatedBy as "CreatedBy"',
      'file.CreatedAt as "CreatedAt"',
      'file.UpdatedBy as "UpdatedBy"',
      'file.UpdatedAt as "UpdatedAt"',
      'UserSeq.UserName as "UserName"',
      'UserSeq.UserId as "UserId"',
    ]);

    query.leftJoin(
      '_TCAUser_WEB',
      'UserSeq',
      'file.CreatedBy = UserSeq.UserSeq'
    );

    query.orderBy('file.IdSeq', 'ASC');
    const data = await query.getRawMany();

    return {
      data,
      total: data.length,
      message: 'Success',
      success: true,
    };
  }
  async delete(ids: number[]): Promise<any> {
    try {

      const result = await this.ERPUploadsFileRepository.delete({
        IdSeq: In(ids),
      });

      return {
        success: true,
        message:
          result.affected > 0
            ? `${result.affected} perms(s) deleted successfully.`
            : 'No perms found to delete.',
      };
    } catch (error: any) {
      return {
        success: false,
        message: 'An error occurred while trying to delete perms.',
      };
    }
  }

}
