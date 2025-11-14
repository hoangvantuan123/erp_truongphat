import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TCARootMenusWEB } from '../entities/rootMenus.entity';

@Injectable()
export class RootMenusService {
  constructor(
    @InjectRepository(TCARootMenusWEB)
    private readonly rootMenusRepository: Repository<TCARootMenusWEB>,
  ) { }

  private chunkArray<T>(array: T[], size: number): T[][] {
    const result: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  }

  async addMultipleRootMenu(records: TCARootMenusWEB[]): Promise<any> {
    if (!records || records.length === 0) {
      throw new Error('No records provided for insertion');
    }

    const batchSize = 1000;
    const batches = this.chunkArray(records, batchSize);

    let affectedRows = 0;
    for (const batch of batches) {
      const result = await this.rootMenusRepository.insert(batch);
      affectedRows += result.identifiers.length;
    }

    return { affectedRows };
  }
  async updateMultipleRootMenu(records: TCARootMenusWEB[]): Promise<any> {
    if (!records || records.length === 0) {
      throw new Error('No records provided for update');
    }

    const batchSize = 1000;
    const batches = this.chunkArray(records, batchSize);

    let affectedRows = 0;

    for (const batch of batches) {
      for (const record of batch) {
        const { Id, ...updateData } = record;

        await this.rootMenusRepository.update(Id, updateData);
        affectedRows++;
      }
    }

    return { affectedRows };
  }




  async searchRootMenus(searchValue: string, searchFields: string[]): Promise<{ data: any[]; total: number; message: string }> {
    if (!searchValue) {
      return { data: [], total: 0, message: 'Search value is required' };
    }
  
    const queryBuilder = this.rootMenusRepository.createQueryBuilder('items')
      .select(['items.Id', 'items.Key', 'items.Label']);
  
    searchFields.forEach(field => {
      queryBuilder.orWhere(`items.${field} LIKE :searchValue COLLATE SQL_Latin1_General_CP1_CI_AS`, { searchValue: `%${searchValue}%` });
    });
  
    try {
      const items = await queryBuilder.getMany();
      return { data: items, total: items.length, message: 'Success' };
    } catch (error) {
      return { data: [], total: 0, message: `Error while searching items: ${error.message}` };
    }
  }
  



}
