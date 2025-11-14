import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { SimpleQueryResult } from 'src/common/interfaces/simple-query-result.interface';
import { DatabaseService } from 'src/common/database/sqlServer/ITMV/database.service';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from 'src/common/utils/constants';
import { TCAGroupsWEB } from '../entities/groups.entity';
import { TCAMenusWEB } from '../entities/menus.entity';
import { TCARootMenusWEB } from '../entities/rootMenus.entity';
import { TCARolesUsersWEB } from '../entities/rolesUsers.entity';
import { TCAUserWEB } from 'src/modules/auth/entities/auths.entity';
import { CreateResUsersDto } from '../dto/users.dto';
import { UpdateRoleDto } from '../dto/updateRole.dto';
import { TCADictionarysWeb } from 'src/modules/language/entities/dictionary.entity';

@Injectable()
export class SystemUsersService {
  constructor(
    @InjectRepository(TCAGroupsWEB)
    private readonly resTCAGroupsWEBRepository: Repository<TCAGroupsWEB>,
    @InjectRepository(TCAMenusWEB)
    private readonly resTCAMenusWEBRepository: Repository<TCAMenusWEB>,

    @InjectRepository(TCARootMenusWEB)
    private readonly resTCARootMenusWEBRepository: Repository<TCARootMenusWEB>,

    @InjectRepository(TCARolesUsersWEB)
    private readonly resTCARolesUserWEBRepository: Repository<TCARolesUsersWEB>,
    @InjectRepository(TCADictionarysWeb)
    private readonly TCADictionarysWebRepository: Repository<TCADictionarysWeb>,


    private readonly databaseService: DatabaseService) { }
  private chunkArray<T>(array: T[], size: number): T[][] {
    const result: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  }
  async GetFilteredTCAUserWEB(userId: string, userName: string): Promise<SimpleQueryResult> {
    const query = `
      EXEC GetFilteredTCAUserWEB 
        @UserId = N'${userId}',
        @UserName = N'${userName}';
    `;

    try {
      const result = await this.databaseService.executeQuery(query);
      return { success: true, data: result };
    } catch (error) {
      return { success: false, message: ERROR_MESSAGES.DATABASE_ERROR };
    }
  }

  async createTCAGroupsWEB(
    userId: string,
    createResGroupsDto: Partial<TCAGroupsWEB>,
  ): Promise<{ success: boolean; message: string; data?: any }> {
    try {
      const newGroup = this.resTCAGroupsWEBRepository.create(createResGroupsDto);
      const savedGroup = await this.resTCAGroupsWEBRepository.save(newGroup);
      return {
        success: true,
        message: SUCCESS_MESSAGES.RECORD_CREATED,
        data: savedGroup,
      };
    } catch (error) {
      throw new InternalServerErrorException(`Error creating group: ${error.message}`);
    }
  }

  async findAll(userId: string): Promise<{ data: TCAGroupsWEB[]; total: number }> {


    const [data, total] = await this.resTCAGroupsWEBRepository.findAndCount({
      order: {
        Id: 'ASC',
      },
    });

    return {
      data,
      total,
    };
  }



  async createMenu(
    userId: string,
    createUIMenu: Partial<TCAMenusWEB>,
  ): Promise<{ success: boolean; message: string; data?: TCAMenusWEB }> {
    const menu = this.resTCAMenusWEBRepository.create(createUIMenu);
    await this.resTCAMenusWEBRepository.save(menu);
    return {
      success: true,
      message: 'created successfully',
    };
  }

  async createRootMenu(
    userId: string,
    createUIRootMenu: Partial<TCARootMenusWEB>,
  ): Promise<{ success: boolean; message: string; data?: TCARootMenusWEB }> {
    const menu = this.resTCARootMenusWEBRepository.create(createUIRootMenu);
    await this.resTCARootMenusWEBRepository.save(menu);
    return {
      success: true,
      message: 'created successfully',
    };
  }
  async findAllRootMenu(
    filter: Record<string, any> = {},
    languageSeq: number // Thêm tham số để lọc theo ngôn ngữ
  ): Promise<{ data: any[]; total: number; message: string }> {
    const query = this.resTCARootMenusWEBRepository.createQueryBuilder('root');

    const addFilterCondition = (filterKey: string, dbField: string) => {
      const values = filter[filterKey];
      if (Array.isArray(values) && values.length > 0) {
        const conditions = values.map((_, index) => `${dbField} ILIKE :${filterKey}${index}`).join(' OR ');
        values.forEach((value, index) => query.setParameter(`${filterKey}${index}`, `%${value}%`));
        query.andWhere(`(${conditions})`);
      }
    };

    addFilterCondition('Label', 'root.Label');
    addFilterCondition('Key', 'root.Key');

    // **LEFT JOIN bảng Dictionary để lấy bản dịch Label**
    query.leftJoin('_TCADictionary_WEB', 'dict', 'root.LabelSeq = dict.WordSeq AND dict.LanguageSeq = :languageSeq');
    query.setParameter('languageSeq', languageSeq);

    // **Chọn các cột cần thiết**
    query.select([
      'root.Id as Id',
      'root.Key as "Key"',
      'root.LabelSeq as LabelSeq',
      'root.Icon as Icon',
      'root.Link as Link',
      'root.Utilities as Utilities',
      'dict.Word as Label' // Lấy bản dịch của Label
    ]);

    query.orderBy('root.Id', 'ASC');

    const data = await query.getRawMany();

    return {
      data,
      total: data.length,
      message: 'Thành công',
    };
  }

  async findAllMenu(
    filter: Record<string, any> = {},
    languageSeq: number,
    date?: string
  ): Promise<{ data: any[]; total: number; message: string }> {
    const query = this.resTCAMenusWEBRepository.createQueryBuilder('menus');

    const addFilterCondition = (filterKey: string, dbField: string) => {
      const values = filter[filterKey];
      if (Array.isArray(values) && values.length > 0) {
        const conditions = values
          .map((_, index) => `${dbField} ILIKE :${filterKey}${index}`)
          .join(' OR ');
        values.forEach((value, index) => query.setParameter(`${filterKey}${index}`, `%${value}%`));
        query.andWhere(`(${conditions})`);
      }
    };

    addFilterCondition('Label', 'menus.Label');
    addFilterCondition('Key', 'menus.[Key]');
    addFilterCondition('MenuRootId', 'menus.MenuRootId');
    addFilterCondition('MenuSubRootId', 'menus.MenuSubRootId');

    query
      .leftJoin('_TCARootMenus_WEB', 'root', 'root.Id = menus.MenuRootId')
      .leftJoin('_TCAMenus_WEB', 'subroot', 'subroot.Id = menus.MenuSubRootId')
      .leftJoin('_TCADictionary_WEB', 'dict', 'menus.LabelSeq = dict.WordSeq AND dict.LanguageSeq = :languageSeq')
      .leftJoin('_TCADictionary_WEB', 'dictSubroot', 'subroot.LabelSeq = dictSubroot.WordSeq AND dictSubroot.LanguageSeq = :languageSeq')
      .leftJoin('_TCADictionary_WEB', 'dictRoot', 'root.LabelSeq = dictRoot.WordSeq AND dictRoot.LanguageSeq = :languageSeq')
      .setParameter('languageSeq', languageSeq);

    query.select([
      'menus.Id as Id',
      'menus.[Key] as "Key"',
      'menus.Link as Link',
      'menus.Type as Type',
      'menus.OrderSeq as OrderSeq',
      'menus.LabelSeq as LabelSeq',
      'menus.MenuRootId as MenuRootId',
      'menus.MenuSubRootId as MenuSubRootId',
      'COALESCE(dict.Word, menus.Label) as Label',
      'dictSubroot.Word as MenuSubRootName',
      'dictRoot.Word as MenuRootName'
    ]);

    query.orderBy('menus.Id', 'ASC');

    const data = await query.getRawMany();

    return {
      data,
      total: data.length,
      message: 'Success',
    };
  }




  async getRootMenusNotInRole(groupId: number): Promise<TCARootMenusWEB[]> {
    try {
      const datas = await this.resTCARootMenusWEBRepository
        .createQueryBuilder('rootMenu')
        .leftJoin(
          TCARolesUsersWEB,
          'roleUser',
          'rootMenu.Id = roleUser.RootMenuId AND roleUser.GroupId = :groupId',
          { groupId }
        )
        .where('roleUser.RootMenuId IS NULL')
        .getMany();

      return datas.length === 0 ? [] : datas;
    } catch (error) {
      throw new InternalServerErrorException('Error fetching datas from database');
    }
  }


  async getMenusNotInRole(groupId: number): Promise<TCAMenusWEB[]> {
    try {
      const datas = await this.resTCAMenusWEBRepository
        .createQueryBuilder('menu')
        .leftJoin(
          TCARolesUsersWEB,
          'roleUser',
          'menu.Id = roleUser.MenuId AND roleUser.GroupId = :groupId',
          { groupId }
        )
        .where('roleUser.MenuId IS NULL')
        .getMany();

      return datas.length === 0 ? [] : datas;
    } catch (error) {
      throw new InternalServerErrorException('Error fetching datas from database');
    }
  }

  async getUsersNotInRole(groupId: number): Promise<CreateResUsersDto[]> {
    try {
      const query = `
        SELECT users."UserId" , users."UserSeq",  users."UserName", users."CompanySeq", users."CustSeq"
        FROM "_TCAUser_WEB" users
        LEFT JOIN "_TCARolesUsers_WEB" roleUser
          ON users."UserId" = roleUser."UserId" AND roleUser."GroupId" = ${groupId}
        WHERE roleUser."UserId" IS NULL;
        `;

      const datas = await this.databaseService.executeQuery(query);

      return datas.length === 0 ? [] : datas;
    } catch (error) {
      throw new InternalServerErrorException('Error fetching datas from database');
    }
  }

  async createRolesRootMenu(
    userId: string,
    rootMenuIds: number[],
    groupId: number,
    type: string,
  ): Promise<{ success: boolean; message: string; data?: TCARolesUsersWEB }> {
    const rolesToCreate = rootMenuIds.map((item) => {
      return this.resTCARolesUserWEBRepository.create({
        GroupId: groupId,
        RootMenuId: item,
        Type: 'rootmenu',
      });
    });
    await this.resTCARolesUserWEBRepository.save(rolesToCreate);
    return {
      success: true,
      message: 'created successfully',
    };
  }

  async createRolesMenu(
    userId: string,
    menuIds: number[],
    groupId: number,
    type: string,
  ): Promise<{ success: boolean; message: string; data?: TCARolesUsersWEB }> {
    const rolesToCreate = menuIds.map((item) => {
      return this.resTCARolesUserWEBRepository.create({
        GroupId: groupId,
        MenuId: item,
        Type: 'menu',
      });
    });
    await this.resTCARolesUserWEBRepository.save(rolesToCreate);
    return {
      success: true,
      message: 'created successfully',
    };
  }

  async createRolesUsers(
    userId: string,
    userIds: string[],
    groupId: number,
    type: string,
  ): Promise<{ success: boolean; message: string; data?: TCARolesUsersWEB }> {
    const rolesToCreate = userIds.map((item) => {
      return this.resTCARolesUserWEBRepository.create({
        GroupId: groupId,
        UserId: item,
        Type: 'user',
      });
    });
    await this.resTCARolesUserWEBRepository.save(rolesToCreate);
    return {
      success: true,
      message: 'created successfully',
    };
  }


  async getPaginatedRootMenuRolesWithLabelsRaw(
    groupId: number,
    type: string,
    page: number,
    limit: number,
  ): Promise<{
    data: any[];
    total: number;
    totalPages: number;
  }> {
    try {
      const startRow = (page - 1) * limit + 1;
      const endRow = startRow + limit - 1;
      const data = await this.databaseService.executeQuery(
        `
         SELECT
                rolesUsers."Id" AS "Id",
                rolesUsers."View" AS "View",
                rolesUsers."Edit" AS "Edit",
                rolesUsers."Create" AS "Create",
                rolesUsers."Delete" AS "Delete",
                rolesUsers."RootMenuId" AS "RootMenuId",
                rolesUsers."MenuId" AS "MenuId",
                rolesUsers."GroupId" AS "GroupId",
                rolesUsers."UserId" AS "UserId",
                rolesUsers."Type" AS "Type",
                rolesUsers."Name" AS "Name",
                rootMenus."Label" AS "RootMenuLabel",
                ROW_NUMBER() OVER (ORDER BY rolesUsers."Id" ASC) AS row_num
            FROM "_TCARolesUsers_WEB" rolesUsers
            LEFT JOIN "_TCARootMenus_WEB" rootMenus
            ON rolesUsers."RootMenuId" = rootMenus."Id"
            WHERE rolesUsers."GroupId" = ${groupId}
              AND rolesUsers."Type" = 'rootmenu'
        `,
      );
      const totalResult = await this.databaseService.executeQuery(
        `
        SELECT COUNT(*) AS total
        FROM "_TCARolesUsers_WEB" rolesUsers
        WHERE rolesUsers."GroupId" = ${groupId}
          AND rolesUsers."Type" = 'rootmenu';
        `
      );

      const total = parseInt(totalResult[0]?.total || '0', 10);

      const totalPages = Math.ceil(total / limit);

      return {
        data,
        total,
        totalPages,
      };
    } catch (error) {
      return {
        data: [],
        total: 0,
        totalPages: 0,
      };
    }
  }
  async getPaginatedMenuRolesWithLabelsRaw(
    groupId: number,
    type: string,
    page: number,
    limit: number,
  ): Promise<{
    data: any[];
    total: number;
    totalPages: number;
  }> {
    try {
      const data = await this.databaseService.executeQuery(
        `
        SELECT
                rolesUsers."Id" AS "Id",
                rolesUsers."View" AS "View",
                rolesUsers."Edit" AS "Edit",
                rolesUsers."Create" AS "Create",
                rolesUsers."Delete" AS "Delete",
                rolesUsers."RootMenuId" AS "RootMenuId",
                rolesUsers."MenuId" AS "MenuId",
                rolesUsers."GroupId" AS "GroupId",
                rolesUsers."UserId" AS "UserId",
                rolesUsers."Type" AS "Type",
                rolesUsers."Name" AS "Name",
                menus."Label" AS "MenuLabel",
                menus."Type" AS "MenuType",
                ROW_NUMBER() OVER (ORDER BY rolesUsers."Id" ASC) AS row_num
            FROM "_TCARolesUsers_WEB" rolesUsers
            LEFT JOIN "_TCAMenus_WEB" menus
            ON rolesUsers."MenuId" = menus."Id"
            WHERE rolesUsers."GroupId" = ${groupId}
              AND rolesUsers."Type" = 'menu'
        `,
      );
      const totalResult = await this.databaseService.executeQuery(
        `
        SELECT COUNT(*) AS total
        FROM "_TCARolesUsers_WEB" rolesUsers
        WHERE rolesUsers."GroupId" = ${groupId}
          AND rolesUsers."Type" = 'menu';
        `
      );

      const total = parseInt(totalResult[0]?.total || '0', 10);

      const totalPages = Math.ceil(total / limit);

      return {
        data,
        total,
        totalPages,
      };
    } catch (error) {
      return {
        data: [],
        total: 0,
        totalPages: 0,
      };
    }
  }

  async getPaginatedUserRolesWithLabelsRaw(
    groupId: number,
    type: string,
    page: number,
    limit: number,
  ): Promise<{
    data: any[];
    total: number;
    totalPages: number;
  }> {
    try {
      const data = await this.databaseService.executeQuery(
        `
       SELECT
          rolesUsers."Id" AS "Id",
          rolesUsers."UserId" AS "UserId",
          rolesUsers."Type" AS "Type",
          rolesUsers."Name" AS "Name",
          Users."UserName" AS "UserName"
      FROM "_TCARolesUsers_WEB" rolesUsers
      LEFT JOIN "_TCAUser_WEB" users
      ON rolesUsers."UserId" = users."UserId"
      WHERE rolesUsers."GroupId" = ${groupId}
        AND rolesUsers."Type" = 'user'
        `,
      );
      const totalResult = await this.databaseService.executeQuery(
        `
        SELECT COUNT(*) AS total
        FROM "_TCARolesUsers_WEB" rolesUsers
        WHERE rolesUsers."GroupId" = ${groupId}
          AND rolesUsers."Type" = 'user';
        `
      );

      const total = parseInt(totalResult[0]?.total || '0', 10);

      const totalPages = Math.ceil(total / limit);

      return {
        data,
        total,
        totalPages,
      };
    } catch (error) {
      return {
        data: [],
        total: 0,
        totalPages: 0,
      };
    }
  }



  async updateRoles(updateData: UpdateRoleDto[]): Promise<any> {
    const updatePromises = updateData.map(async (update) => {
      const { id, column, value } = update;

      await this.resTCARolesUserWEBRepository
        .createQueryBuilder()
        .update()
        .set({ [column]: value })
        .where('Id = :id', { id })
        .execute();
    });

    await Promise.all(updatePromises);

    return { message: 'Roles updated successfully' };
  }

  async deleteRolesByIds(ids: number[]): Promise<any> {
    try {
      const result = await this.resTCARolesUserWEBRepository.delete({ Id: In(ids) });
      if ((result.affected ?? 0) > 0) {
        return {
          success: true,
          message: `${result.affected} record(s) deleted successfully`,
        };
      } else {
        return {
          success: false,
          message: 'No records found to delete',
        };
      }
    } catch (error) {
      return {
        success: false,
        message: 'Error while deleting records',
        error: error.message,
      };
    }
  }


  async deleteGroupsByIds(ids: number[]): Promise<any> {
    try {
      const result = await this.resTCAGroupsWEBRepository.delete({ Id: In(ids) });

      if ((result.affected ?? 0) > 0) {
        const result2 = await this.resTCARolesUserWEBRepository.delete({ GroupId: In(ids) });

        return {
          success: true,
          message: `${result.affected} group(s) deleted successfully, and ${result2.affected} related record(s) deleted successfully`,
        };
      } else {
        return {
          success: false,
          message: 'No groups found to delete.',
        };
      }
    } catch (error) {
      return {
        success: false,
        message: 'Error while deleting records.',
        error: error.message,
      };
    }
  }

  async deleteMennusByIds(ids: number[]): Promise<any> {
    try {
      const existingRecords = await this.resTCARolesUserWEBRepository.find({
        where: {
          MenuId: In(ids),
        },
      });
      if (existingRecords.length > 0) {
        return {
          success: false,
          message: 'Cannot delete menus because there are related records in TCARolesUsersWEB.',
        };
      }

      const result = await this.resTCAMenusWEBRepository.delete({ Id: In(ids) });

      if ((result.affected ?? 0) > 0) {
        return {
          success: true,
          message: `${result.affected} record(s) deleted successfully`,
        };
      } else {
        return {
          success: false,
          message: 'No records found to delete',
        };
      }
    } catch (error) {
      return {
        success: false,
        message: 'Error while deleting records',
        error: error.message,
      };
    }
  }


  async deleteRootMenusByIds(ids: number[]): Promise<any> {
    try {
      const existingRecords = await this.resTCARolesUserWEBRepository.find({
        where: {
          RootMenuId: In(ids),
        },
      });

      if (existingRecords.length > 0) {
        return {
          success: false,
          message: 'Cannot delete root menus because there are related records in TCARolesUsersWEB.',
        };
      }

      const result = await this.resTCARootMenusWEBRepository.delete({ Id: In(ids) });

      if ((result.affected ?? 0) > 0) {
        return {
          success: true,
          message: `${result.affected} record(s) deleted successfully`,
        };
      } else {
        return {
          success: false,
          message: 'No records found to delete',
        };
      }
    } catch (error) {
      return {
        success: false,
        message: 'Error while deleting records.',
        error: error.message,
      };
    }
  }


  async findSubmenus(languageSeq: number): Promise<{ data: any[]; total: number; message: string, success: boolean }> {
    const query = this.resTCAMenusWEBRepository.createQueryBuilder('menus');

    query.andWhere('menus.Type = :type', { type: 'submenu' });

    // **LEFT JOIN bảng Root Menu & SubRoot Menu**
    query
      .leftJoin('_TCARootMenus_WEB', 'root', 'root.Id = menus.MenuRootId')
      .leftJoin('_TCAMenus_WEB', 'subroot', 'subroot.Id = menus.MenuSubRootId');

    // **LEFT JOIN bảng Dictionary để lấy bản dịch**
    query
      .leftJoin('_TCADictionary_WEB', 'dictMenu', 'menus.LabelSeq = dictMenu.WordSeq AND dictMenu.LanguageSeq = :languageSeq')
      .leftJoin('_TCADictionary_WEB', 'dictRoot', 'root.LabelSeq = dictRoot.WordSeq AND dictRoot.LanguageSeq = :languageSeq')
      .leftJoin('_TCADictionary_WEB', 'dictSubroot', 'subroot.LabelSeq = dictSubroot.WordSeq AND dictSubroot.LanguageSeq = :languageSeq');

    query.setParameter('languageSeq', languageSeq);

    // **Chọn các cột cần thiết**
    query.select([
      'menus.Id as Id',
      'menus.[Key] as "Key"',
      'menus.LabelSeq as LabelSeq',
      'menus.Link as Link',
      'menus.Type as Type',
      'menus.OrderSeq as OrderSeq',
      'menus.MenuRootId as MenuRootId',
      'menus.MenuSubRootId as MenuSubRootId',

      'COALESCE(dictMenu.Word, menus.Label) as Label',
      'COALESCE(dictRoot.Word, root.Label) as MenuRootName',
      'COALESCE(dictSubroot.Word, subroot.Label) as MenuSubRootName',
    ]);

    query.orderBy('menus.Id', 'ASC');

    try {
      const data = await query.getRawMany();
      if (data.length === 0) {
        return {
          data: [],
          total: 0,
          success: true,
          message: 'No matching menus found',
        };
      }
      return {
        data,
        total: data.length,
        success: true,
        message: 'Success',
      };
    } catch (error) {
      return {
        data: [],
        total: 0,
        success: false,
        message: `Error: ${error.message}`,
      };
    }
  }


  async addMultiplerRoleUsers(records: TCARolesUsersWEB[]): Promise<any> {
    if (!records || records.length === 0) {
      throw new Error('No records provided for insertion');
    }

    const processedRecords = records.map((record) => ({
      ...record,
    }));

    const batchSize = 100;
    const batches = this.chunkArray(processedRecords, batchSize);

    let affectedRows = 0;
    let insertedRecords: any[] = [];

    const queryRunner = this.resTCARolesUserWEBRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      for (const batch of batches) {
        await queryRunner.manager
          .createQueryBuilder()
          .insert()
          .into(TCARolesUsersWEB)
          .values(batch)
          .execute();

        const batchInserted = await queryRunner.manager
          .createQueryBuilder(TCARolesUsersWEB, 'q')
          .select([
            'q.Id as "Id"',
            'q.View as "View"',
            'q.Edit as "Edit"',
            'q.Create as "Create"',
            'q.Delete as "Delete"',
            'q.RootMenuId as "RootMenuId"',
            'q.MenuId as "MenuId"',
            'q.GroupId as "GroupId"',
            'q.UserId as "UserId"',
            'q.Type as "Type"',
            'q.IdxNo as "IdxNo"',
            'user.UserName as "UserName"',
            'user.UserSeq as "UserSeq"',
            'menu.Label as "MenuLabel"',
            'menu.Type as "MenuType"',
            'rootMenu.Label as "RootMenuLabel"',
          ])
          .leftJoin('_TCAUser_WEB', 'user', 'q.UserId = user.UserId')
          .leftJoin('_TCARootMenus_WEB', 'rootMenu', 'q.RootMenuId = rootMenu.Id')
          .leftJoin('_TCAMenus_WEB', 'menu', 'q.MenuId = menu.Id')
          .where(`q.Id IN (
            SELECT TOP (${batch.length}) Id FROM _TCARolesUsers_WEB ORDER BY Id DESC
          )`)
          .orderBy('q.Id', 'DESC')
          .getRawMany();

        affectedRows += batch.length;
        insertedRecords = [...insertedRecords, ...batchInserted];
      }

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new Error(`Insert failed: ${error.message}`);
    } finally {
      await queryRunner.release();
    }

    return {
      affectedRows,
      message: 'Records inserted successfully',
      data: insertedRecords,
    };
  }



  async updateMultipleRoleUsers(records: TCARolesUsersWEB[]): Promise<any> {
    if (!records || records.length === 0) {
      throw new Error('No records provided for update');
    }

    const batchSize = 150;
    const batches = this.chunkArray(records, batchSize);
    let affectedRows = 0;

    const queryRunner = this.resTCARolesUserWEBRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      for (const batch of batches) {
        for (const record of batch) {
          const { Id, ...updateData } = record;

          if (!Id || Object.keys(updateData).length === 0) continue;

          // Trim string fields to avoid SQL errors
          for (const key in updateData) {
            if (typeof updateData[key] === 'string') {
              updateData[key] = updateData[key].trim();
            }
          }

          const updateResult = await queryRunner.manager
            .createQueryBuilder()
            .update(TCARolesUsersWEB)
            .set(updateData)
            .where('Id = :id', { id: Id })
            .execute();

          if (updateResult.affected && updateResult.affected > 0) {
            affectedRows++;
          }
        }
      }

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new Error(`Update failed: ${error.message}`);
    } finally {
      await queryRunner.release();
    }

    // Fetch updated records in smaller chunks to avoid parameter limit issues
    const updatedRecords: TCARolesUsersWEB[] = [];
    const idChunks = this.chunkArray(records.map((r) => r.Id), batchSize);

    for (const ids of idChunks) {
      const chunkRecords = await this.resTCARolesUserWEBRepository
        .createQueryBuilder('q')
        .select([
          'q.Id as "Id"',
          'q.View as "View"',
          'q.Edit as "Edit"',
          'q.Create as "Create"',
          'q.Delete as "Delete"',
          'q.RootMenuId as "RootMenuId"',
          'q.MenuId as "MenuId"',
          'q.GroupId as "GroupId"',
          'q.UserId as "UserId"',
          'q.Type as "Type"',
          'q.IdxNo as "IdxNo"',
          'user.UserName as "UserName"',
          'user.UserSeq as "UserSeq"',
          'menu.Label as "MenuLabel"',
          'menu.Type as "MenuType"',
          'rootMenu.Label as "RootMenuLabel"',
        ])
        .leftJoin('_TCAUser_WEB', 'user', 'q.UserId = user.UserId')
        .leftJoin('_TCARootMenus_WEB', 'rootMenu', 'q.RootMenuId = rootMenu.Id')
        .leftJoin('_TCAMenus_WEB', 'menu', 'q.MenuId = menu.Id')
        .where('q.Id IN (:...ids)', { ids })
        .getRawMany();

      updatedRecords.push(...chunkRecords);
    }

    return {
      affectedRows,
      message: 'Records updated successfully',
      data: updatedRecords,
    };
  }

  async deleteMultipleRoleGroup(ids: number[]): Promise<any> {
    try {
      const tablesToCheck = [
        { tableName: '_TCARolesUsers_WEB', foreignKey: 'GroupId', nameTable: "Bảng nhóm quyền" },
      ];

      const idsStr = ids.join(', ');

      const dependencyChecks = tablesToCheck.map(async ({ tableName, foreignKey, nameTable }) => {
        const checkDependencyQuery = `
                SELECT COUNT(*) AS count
                FROM ${tableName}
                WHERE ${foreignKey} IN (${idsStr})
            `;
        const result = await this.databaseService.executeQuery(checkDependencyQuery);
        return { tableName, count: result[0].count, nameTable };
      });

      const dependencies = await Promise.all(dependencyChecks);

      const violatingTable = dependencies.find(dep => dep.count > 0);
      if (violatingTable) {
        return {
          success: false,
          message: `Không thể xóa bản ghi. Chúng đang được sử dụng trong bảng ${violatingTable.nameTable}.`,
        };
      }

      const result = await this.resTCAGroupsWEBRepository.delete({
        Id: In(ids),
      });

      return {
        success: true,
        message: (result.affected ?? 0) > 0
          ? `${result.affected} bản ghi đã được xóa thành công.`
          : 'Không tìm thấy bản ghi nào để xóa.',
      };
    } catch (error: any) {
      return {
        success: false,
        message: 'Đã xảy ra lỗi khi cố gắng xóa bản ghi.',
        error: error.message,
      };
    }
  }
  async deleteRolesIds(ids: number[]): Promise<any> {
    try {

      const result = await this.resTCARolesUserWEBRepository.delete({ Id: In(ids) });

      return {
        success: true,
        message: (result.affected ?? 0) > 0
          ? `${result.affected} role(s) deleted successfully.`
          : 'No role found to delete.',
      };
    } catch (error: any) {
      return {
        success: false,
        message: 'An error occurred while trying to delete role.',
      };
    }
  }


}
