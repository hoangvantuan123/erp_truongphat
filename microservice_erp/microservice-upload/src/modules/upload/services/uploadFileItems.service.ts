import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { DatabaseService } from 'src/common/database/sqlServer/ITMV/database.service';
import { InjectRepository } from '@nestjs/typeorm';
import { ERPUploadsFileItems } from '../entities/uploadFileItems.entity';
import { Repository, In } from 'typeorm';

import * as fs from 'fs/promises';
import { join } from 'path';
@Injectable()
export class UploadFileItemsService {
  constructor(
    private readonly databaseService: DatabaseService,
    @InjectRepository(ERPUploadsFileItems)
    private readonly ERPUploadsFileItemsRepository: Repository<ERPUploadsFileItems>,
  ) {}

  private chunkArray<T>(array: T[], size: number): T[][] {
    const result: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  }

  async addMultiple(records: any[], createdBy: number): Promise<any> {
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
    let insertedRecords: ERPUploadsFileItems[] = [];

    for (const batch of batches) {
      const result = await this.ERPUploadsFileItemsRepository.insert(batch);

      const insertedIds = result.identifiers.map((item) => item.IdSeq);

      const newlyInsertedRecords =
        await this.ERPUploadsFileItemsRepository.createQueryBuilder('file')
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
            'file.CreatedBy = UserSeq.UserSeq',
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

  async UploadFileOrdApprovalReqSave(
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
    let insertedRecords: ERPUploadsFileItems[] = [];

    for (const batch of batches) {
      const result = await this.ERPUploadsFileItemsRepository.insert(batch);

      const insertedIds = result.identifiers.map((item) => item.IdSeq);

      const newlyInsertedRecords =
        await this.ERPUploadsFileItemsRepository.createQueryBuilder('file')
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
            'file.CreatedBy = UserSeq.UserSeq',
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

  async findAll(
    ItemNoSeq?: number,
    FormCode?: string,
    TableName?: string,
  ): Promise<{
    data: any[];
    total: number;
    message: string;
    success: boolean;
  }> {
    const query = this.ERPUploadsFileItemsRepository.createQueryBuilder('file');

    // Chuyển đổi ItemNoSeq từ string sang number
    const itemNoSeqNumber = ItemNoSeq ? Number(ItemNoSeq) : undefined;

    query.select([
      'file.IdSeq as "IdSeq"',
      'file.FormCode as "FormCode"',
      'file.FieldName as "FieldName"',
      'file.OriginalName as "OriginalName"',
      'file.Encoding as "Encoding"',
      'file.MimeType as "MimeType"',
      'file.Destination as "Destination"',
      'file.Filename as "Filename"',
      'file.Favorite as "Favorite"',
      'file.Path as "Path"',
      'file.Size as "Size"',
      'file.IdxNo as "IdxNo"',
      'file.TableName as "TableName"',
      'file.CreatedBy as "CreatedBy"',
      'file.CreatedAt as "CreatedAt"',
      'file.UpdatedBy as "UpdatedBy"',
      'file.UpdatedAt as "UpdatedAt"',
      'UserSeq.UserName as "UserName"',
      'UserSeq.UserId as "UserId"',
    ]);

    query.andWhere('file.ItemNoSeq = :ItemNoSeq', {
      ItemNoSeq: itemNoSeqNumber,
    });
    query.andWhere('file.FormCode = :FormCode', { FormCode: FormCode.trim() });
    query.andWhere('file.TableName = :TableName', {
      TableName: TableName.trim(),
    });

    query.leftJoin(
      '_TCAUser_WEB',
      'UserSeq',
      'file.CreatedBy = UserSeq.UserSeq',
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
      const filesToDelete = await this.ERPUploadsFileItemsRepository.find({
        where: {
          IdSeq: In(ids),
        },
        select: ['Filename'],
      });

      const result = await this.ERPUploadsFileItemsRepository.delete({
        IdSeq: In(ids),
      });

      if (filesToDelete.length > 0) {
        for (const file of filesToDelete) {
          const filePath = join('/var/www/uploads', file.Filename);

          await fs.unlink(filePath).catch((err) => {
            console.error(`Không thể xóa file: ${filePath}`, err);
          });
        }
      }

      return {
        success: true,
        message:
          result.affected > 0
            ? `${result.affected} item(s) deleted successfully.`
            : 'No items found to delete.',
      };
    } catch (error: any) {
      console.error('Error while deleting items:', error);
      return {
        success: false,
        message: 'An error occurred while trying to delete items.',
      };
    }
  }

  async updateFavoriteSeq(IdSeq: number, Favorite: boolean, UpdatedBy: number) {

    const result = await this.ERPUploadsFileItemsRepository.update(
      { IdSeq: IdSeq },
      {
        Favorite: Favorite,
        UpdatedBy: UpdatedBy,
      },
    );

 
    if (result.affected === 0) {
      throw new NotFoundException('Product not found.');
    }

    // Trả về kết quả rõ ràng hơn
    return {
      message: 'Favorite updated successfully.',
      data: {
        IdSeq: IdSeq,
        Favorite: Favorite,
        UpdatedBy: UpdatedBy,
      },
    };
  }
}
