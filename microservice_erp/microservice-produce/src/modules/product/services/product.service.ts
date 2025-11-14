import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/common/database/sqlServer/ITMV/database.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { ERPAddItems } from '../entities/addItems.entity';
@Injectable()
export class ProductService {
  constructor(
    private readonly databaseService: DatabaseService,
    @InjectRepository(ERPAddItems)
    private readonly ERPAddItemsRepository: Repository<ERPAddItems>,
  ) { }

  private chunkArray<T>(array: T[], size: number): T[][] {
    const result: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  }


  async addMultiple(
    records: ERPAddItems[],
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
      try {
        const result = await this.ERPAddItemsRepository.insert(batch);

        const insertedIds = result.identifiers.map((item) => item.IdSeq);

        const newlyInsertedRecords = await this.ERPAddItemsRepository
          .createQueryBuilder('q')
          .select([
            'q.IdSeq as "IdSeq"',
            'q.P_N as "P_N"',
            'q.RefDES as "RefDES"',
            'q.Maker as "Maker"',
            'q.MfrPartNumber as "MfrPartNumber"',
            'q.Description as "Description"',
            'q.IdxNo as "IdxNo"',
            'q.Col01 as "Col01"',
            'q.Col02 as "Col02"',
            'q.Col03 as "Col03"',
            'q.Col04 as "Col04"',
            'q.Col05 as "Col05"',
            'q.Col06 as "Col06"'
          ])
          .where('q.IdSeq IN (:...insertedIds)', { insertedIds })
          .getRawMany();

        affectedRows += result.identifiers.length;
        insertedRecords = [...insertedRecords, ...newlyInsertedRecords];
      } catch (error) {
        throw new Error(`Failed to insert batch: ${error.message}`);
      }
    }

    return {
      affectedRows,
      message: 'Records inserted successfully',
      data: insertedRecords,
    };
  }
  async updateMultiple(
    records: ERPAddItems[],
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
      const idsToUpdate = batch.map((record) => record.IdSeq);

      for (const record of batch) {
        const { IdSeq, ...updateData } = record;
        const dataToUpdate = {
          ...updateData,
          UpdatedBy: updatedBy,
        };

        await this.ERPAddItemsRepository.update(IdSeq, dataToUpdate);
      }

      affectedRows += batch.length;

      const newlyUpdatedRecords = await this.ERPAddItemsRepository
        .createQueryBuilder('q')
        .select([
          'q.IdSeq as "IdSeq"',
          'q.P_N as "P_N"',
          'q.RefDES as "RefDES"',
          'q.Maker as "Maker"',
          'q.MfrPartNumber as "MfrPartNumber"',
          'q.Description as "Description"',
          'q.IdxNo as "IdxNo"',
          'q.Col01 as "Col01"',
          'q.Col02 as "Col02"',
          'q.Col03 as "Col03"',
          'q.Col04 as "Col04"',
          'q.Col05 as "Col05"',
          'q.Col06 as "Col06"'
        ])
        .where('q.IdSeq IN (:...idsToUpdate)', { idsToUpdate })
        .getRawMany();

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
      /*    const tablesToCheck = [
           { tableName: '_ERPProdOrders', foreignKey: 'ProductSeq' },
           { tableName: '_ERPProdPart', foreignKey: 'ProductSeq' },
           { tableName: '_ERPProdPartUser', foreignKey: 'ProductSeq' }
         ];
   
         const idsStr = ids.join(', ');
   
         const dependencyChecks = tablesToCheck.map(async ({ tableName, foreignKey }) => {
           const checkDependencyQuery = `
                   SELECT COUNT(*) AS count
                   FROM ${tableName}
                   WHERE ${foreignKey} IN (${idsStr})
               `;
           const result = await this.databaseService.executeQuery(checkDependencyQuery);
           return { tableName, count: result[0].count };
         });
   
         const dependencies = await Promise.all(dependencyChecks);
   
         const violatingTable = dependencies.find(dep => dep.count > 0);
         if (violatingTable) {
           return {
             success: false,
             message: `Cannot delete records. They are being used in table ${violatingTable.tableName}.`,
           };
         }
    */
      const result = await this.ERPAddItemsRepository.delete({
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



  async findAll(ItemNoSeq?: number): Promise<{
    data: any[];
    total: number;
    message: string;
    success: boolean;
  }> {
    const query = this.ERPAddItemsRepository.createQueryBuilder('q');

    query.select([
      'q.IdSeq as "IdSeq"',
      'q.P_N as "P_N"',
      'q.RefDES as "RefDES"',
      'q.Maker as "Maker"',
      'q.MfrPartNumber as "MfrPartNumber"',
      'q.Description as "Description"',
      'q.Col01 as "Col01"',
      'q.Col02 as "Col02"',
      'q.Col03 as "Col03"',
      'q.Col04 as "Col04"',
      'q.Col05 as "Col05"',
      'q.Col06 as "Col06"'
    ]);


    if (ItemNoSeq) {
      query.where('q.ItemNoSeq = :ItemNoSeq', { ItemNoSeq });
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

}
