import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/common/database/sqlServer/ITMV/database.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { ERPDefine } from '../entities/define.entity';
@Injectable()
export class DefineService {
  constructor(
    private readonly databaseService: DatabaseService,
    @InjectRepository(ERPDefine)
    private readonly ERPDefineRepository: Repository<ERPDefine>,
  ) { }

  private chunkArray<T>(array: T[], size: number): T[][] {
    const result: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  }


  async addMultiple(
    records: ERPDefine[],
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
      const result = await this.ERPDefineRepository.insert(batch);

      const insertedIds = result.identifiers.map((item) => item.IdSeq);
      const newlyInsertedRecords = await this.ERPDefineRepository.find({
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
    records: ERPDefine[],
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

        await this.ERPDefineRepository.update(IdSeq, dataToUpdate);
        affectedRows++;
      });

      await Promise.all(updatePromises);

      const updatedIds = batch.map(record => record.IdSeq);
      const newlyUpdatedRecords = await this.ERPDefineRepository.find({
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
      const tablesToCheck = [
        { tableName: '_ERPDefineItem', foreignKey: 'DefineSeq' },
      ];

      for (const { tableName, foreignKey } of tablesToCheck) {
        const idsStr = ids.join(', ');

        const checkDependencyQuery = `
  SELECT COUNT(*) AS count 
  FROM _ERPDefineItem 
  WHERE DefineSeq IN (${idsStr})
`;

        const dependencyResult = await this.databaseService.executeQuery(checkDependencyQuery);




        if (dependencyResult[0].count > 0) {
          return {
            success: false,
            message: `Cannot delete records. They are being used in table ${tableName} with foreign key ${foreignKey}.`,
          };
        }
      }

      const result = await this.ERPDefineRepository.delete({
        IdSeq: In(ids),
      });

      return {
        success: true,
        message:(result.affected ?? 0) > 0
          ? `${result.affected} record(s) deleted successfully.`
          : 'No records found to delete.',
      };
    } catch (error: any) {
      return {
        success: false,
        message: 'An error occurred while trying to delete records.',
        error: error.message,
      };
    }
  }


  async findAll(): Promise<{
    data: any[];
    total: number;
    message: string;
    success: boolean;
  }> {
    const query =
      this.ERPDefineRepository.createQueryBuilder('q');

    query.select('*');
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
    const query = this.ERPDefineRepository.createQueryBuilder('h');

    query.select([
      'h.IdSeq as "IdSeq"',
      'h.DefineName as "DefineName"',
    ]);
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
