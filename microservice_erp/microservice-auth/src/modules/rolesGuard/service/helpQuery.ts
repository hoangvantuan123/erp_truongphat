import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TCARolesUsersWEB } from '../entities/rolesUsers.entity';
import { TCARootMenusWEB } from '../entities/rootMenus.entity';
import { TCAMenusWEB } from '../entities/menus.entity';
import { TCAGroupsWEB } from '../entities/groups.entity';
import { DatabaseService } from 'src/common/database/sqlServer/ITMV/database.service';
import { TCAUserWEB } from 'src/modules/auth/entities/auths.entity';
@Injectable()
export class HelpQueryService {
    constructor(

        @InjectRepository(TCAGroupsWEB)
        private readonly resERPGroupsWEBRepository: Repository<TCAGroupsWEB>,
        @InjectRepository(TCAMenusWEB)
        private readonly resERPMenusWEBRepository: Repository<TCAMenusWEB>,

        @InjectRepository(TCARootMenusWEB)
        private readonly resERPRootMenusWEBRepository: Repository<TCARootMenusWEB>,

        @InjectRepository(TCARolesUsersWEB)
        private readonly resERPRolesUserWEBRepository: Repository<TCARolesUsersWEB>,

        @InjectRepository(TCAUserWEB)
        private readonly resERPUserWEBRepository: Repository<TCAUserWEB>,

        private readonly databaseService: DatabaseService
    ) { }



    async getHelpRootMenu(
        value?: string
    ): Promise<{ success: boolean; message: string; data: TCARootMenusWEB[]; total: number; totalPages: number; currentPage: number }> {
        try {
            let baseQuery = this.resERPRootMenusWEBRepository
                .createQueryBuilder('rootMenu')
                .select([
                    'rootMenu.Id AS Id',
                    'rootMenu.Key AS [Key]',
                    'rootMenu.Label AS Label',
                    'rootMenu.LabelSeq AS LabelSeq',
                    'rootMenu.Icon AS Icon',
                    'rootMenu.Link AS Link',
                    'rootMenu.Utilities AS Utilities'
                ]);

            // Nếu có giá trị tìm kiếm
            if (value && value.trim() !== '') {
                baseQuery = baseQuery.where(
                    '(rootMenu.Label LIKE :value OR rootMenu.Key LIKE :value)',
                    { value: `%${value}%` }
                );
            }

            // Lấy dữ liệu thô
            const rawData = await baseQuery.getRawMany();

          
            const paginatedData = rawData.map(row => {
                return {
                    Id: row.rootMenu_Id,
                    Key: row.rootMenu_Key,
                    Label: row.rootMenu_Label,
                    LabelSeq: row.rootMenu_LabelSeq,
                    Icon: row.rootMenu_Icon,
                    Link: row.rootMenu_Link,
                    Utilities: row.rootMenu_Utilities
                };
            });

           
            const total = rawData.length;

         
            const totalPages = 1;
            const currentPage = 1;

            return {
                success: true,
                message: 'Data retrieved successfully',
                data: rawData, 
                total,
                totalPages,
                currentPage
            };
        } catch (error) {
            
            return {
                success: false,
                message: 'Error fetching data',
                data: [],
                total: 0,
                totalPages: 0,
                currentPage: 1
            };
        }
    }


    async getHelpMenu(
        value?: string
    ): Promise<{ success: boolean; message: string; data: TCAMenusWEB[]; total: number; totalPages: number; currentPage: number }> {
        try {

            let subQuery = this.resERPMenusWEBRepository
                .createQueryBuilder('menu')
                .select([
                    'menu.Id',
                    'menu.MenuRootId',
                    'menu.MenuSubRootId',
                    'menu.Key',
                    'menu.Label',
                    'menu.LabelSeq',
                    'menu.Link',
                    'menu.Type',
                    'menu.OrderSeq'
                ]);

            if (value && value.trim() !== "") {
                subQuery = subQuery.where(
                    `(menu.Label LIKE :value OR menu.Key LIKE :value)`,
                    { value: `%${value}%` }
                );
            }


            const rawData = await subQuery.getRawMany();


            const paginatedData = rawData.map(row => {
                const item: TCAMenusWEB = {
                    Id: row.menu_Id,
                    MenuRootId: row.menu_MenuRootId,
                    MenuSubRootId: row.menu_MenuSubRootId,
                    Key: row.menu_Key,
                    Label: row.menu_Label,
                    LabelSeq: row.menu_LabelSeq,
                    Link: row.menu_Link,
                    Type: row.menu_Type,
                    OrderSeq: row.menu_OrderSeq
                };
                return item;
            });

            const total = rawData.length;
            const totalPages = 1;
            const currentPage = 1;

            return {
                success: true,
                message: 'Data retrieved successfully',
                data: paginatedData,
                total,
                totalPages,
                currentPage
            };
        } catch (error) {
          
            return {
                success: false,
                message: 'Error fetching data',
                data: [],
                total: 0,
                totalPages: 0,
                currentPage: 1
            };
        }
    }


    async getHelpUsers(
        page: number = 1,
        value?: string
    ): Promise<{ success: boolean; message: string; data: any[]; total: number; totalPages: number; currentPage: number }> {
        try {
            page = Math.max(page, 1);

            let baseQuery = this.resERPUserWEBRepository
                .createQueryBuilder('user')
                .select([
                    'user.UserSeq AS UserSeq',
                    'user.UserId AS UserId',
                    'user.UserName AS UserName',
                    `ROW_NUMBER() OVER (ORDER BY user.UserSeq ASC) AS RowNum`
                ])
                .where('user.UserSeq != :adminSeq', { adminSeq: 1 });

            if (value && value.trim() !== '') {
                baseQuery = baseQuery.andWhere(
                    '(user.UserId LIKE :value OR user.UserName LIKE :value)',
                    { value: `%${value}%` }
                );
            }


            const rawData = await baseQuery.getRawMany();


            const total = rawData.length;
            const totalPages = Math.ceil(total / 2000);

            return {
                success: true,
                message: 'Data retrieved successfully',
                data: rawData,
                total,
                totalPages,
                currentPage: page // Đây vẫn là thông tin trang hiện tại mặc dù không phân trang
            };
        } catch (error) {
            return {
                success: false,
                message: 'Error fetching data',
                data: [],
                total: 0,
                totalPages: 0,
                currentPage: page
            };
        }
    }



}
