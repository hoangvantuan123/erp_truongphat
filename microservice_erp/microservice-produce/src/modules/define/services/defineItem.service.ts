import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/common/database/sqlServer/ITMV/database.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { ERPDefineItem } from '../entities/defineItem.entity';
import { ERPDefine } from '../entities/define.entity';
@Injectable()
export class DefineItemService {
  constructor(
    private readonly databaseService: DatabaseService,
    @InjectRepository(ERPDefineItem)
    private readonly ERPDefineItemRepository: Repository<ERPDefineItem>,
  ) { }

  private chunkArray<T>(array: T[], size: number): T[][] {
    const result: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  }

  async addMultiple(
    records: ERPDefineItem[],
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
    let insertedRecords: any[] = [];

    for (const batch of batches) {
      const result = await this.ERPDefineItemRepository.insert(batch);

      const insertedIds = result.identifiers.map((item) => item.IdSeq);
      const newlyInsertedRecords = await this.ERPDefineItemRepository.find({
        where: { IdSeq: In(insertedIds) },
      });
      affectedRows += result.identifiers.length;
      insertedRecords = [...insertedRecords, ...newlyInsertedRecords];
    }

    return {
      affectedRows,
      message: 'Records inserted successfully',
      data: insertedRecords,
    };
  }


  async updateMultiple(
    records: ERPDefineItem[],
    updatedBy: number,
  ): Promise<any> {
    if (!records || records.length === 0) {
      throw new Error('No records provided for update');
    }

    const batchSize = 1000;
    const batches = this.chunkArray(records, batchSize);

    let affectedRows = 0;
    let updatedRecords: any[] = [];

    for (const batch of batches) {
      const updatePromises = batch.map(async (record) => {
        const { IdSeq, ...updateData } = record;
        const dataToUpdate = {
          ...updateData,
          UpdatedBy: updatedBy,
        };

        await this.ERPDefineItemRepository.update(IdSeq, dataToUpdate);
        affectedRows++;
      });

      await Promise.all(updatePromises);

      const updatedIds = batch.map(record => record.IdSeq);
      const newlyUpdatedRecords = await this.ERPDefineItemRepository.find({
        where: { IdSeq: In(updatedIds) },
      });

      updatedRecords = [...updatedRecords, ...newlyUpdatedRecords];
    }

    return {
      affectedRows,
      message: 'Records updated successfully',
      data: updatedRecords,
    };
  }


  async delete(ids: number[]): Promise<any> {
    try {

      const result = await this.ERPDefineItemRepository.delete({
        IdSeq: In(ids),
      });

      return {
        success: true,
        message:
        (result.affected ?? 0) > 0
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


  /*  async findAll(): Promise<{
     data: any[];
     total: number;
     message: string;
     success: boolean;
   }> {
     const query =
       this.ERPDefineItemRepository.createQueryBuilder('q');
 
     query.select('*');
     query.orderBy('q.IdSeq', 'ASC');
 
     const data = await query.getRawMany();
 
     return {
       data,
       total: data.length,
       message: 'Success',
       success: true,
     };
   } */
  async findAll(defineSeq?: number): Promise<{
    data: any[];
    total: number;
    message: string;
    success: boolean;
  }> {
    const query = this.ERPDefineItemRepository.createQueryBuilder('q');

    query.select([
      'q.IdSeq as "IdSeq"',
      'q.DefineItemName as "DefineItemName"',
      'q.DefineSeq as "DefineSeq"',
      'q.IsActive as "IsActive"',
      'q.IdxNo as "IdxNo"',
      's.DefineName as "DefineName"',
    ]);

    query.leftJoin(
      ERPDefine,
      's',
      'q.DefineSeq = s.IdSeq',
    );

    if (defineSeq) {
      query.where('q.DefineSeq = :defineSeq', { defineSeq });
    }

    query.orderBy('q.IdSeq', 'ASC');

    const data = await query.getRawMany();

    return {
      data,
      total: data.length,
      message: 'Success',
      success: true,
    };
  }

  async getHelpQuery(): Promise<{
    data: any[];
    total: number;
    message: string;
    success: boolean;
  }> {
    const query = this.ERPDefineItemRepository.createQueryBuilder('h');

    query.select([
      'h.IdSeq as "IdSeq"',
      'h.DefineItemName as "DefineItemName"',
      'h.DefineSeq as "DefineSeq"',
      'h.IsActive as "IsActive"'
    ]);
    query.where('h.IsActive = :isActive', { isActive: 1 });
    query.orderBy('h.IdSeq', 'ASC');

    const data = await query.getRawMany();

    return {
      data,
      total: data.length,
      message: 'Success',
      success: true,
    };
  }
}
