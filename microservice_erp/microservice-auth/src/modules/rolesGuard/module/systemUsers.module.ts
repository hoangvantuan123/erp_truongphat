import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseService } from 'src/common/database/sqlServer/ITMV/database.service';
import { sqlServerITMV } from 'src/config/database.config';
import { TCAGroupsWEB } from '../entities/groups.entity';
import { TCAMenusWEB } from '../entities/menus.entity';
import { TCARolesUsersWEB } from '../entities/rolesUsers.entity';
import { SystemUsersService } from '../service/systemUsers.service';
import { SystemUsersController } from '../controller/systemUsers.controller';
import { TCARootMenusWEB } from '../entities/rootMenus.entity';
import { RootMenusService } from '../service/rootMenus.service';
import { RootMenusController } from '../controller/rootMenus.controller';
import { MenusService } from '../service/menu.service';
import { MenusController } from '../controller/menus.controller';
import { TCADictionarysWeb } from 'src/modules/language/entities/dictionary.entity';
import { HelpQueryService } from '../service/helpQuery';
import { HelpQueryController } from '../controller/helpQuery.controller';
import { TCAUserWEB } from 'src/modules/auth/entities/auths.entity';
import { TCAGroupsService } from '../service/group.service';
import { RoleGroupsController } from '../controller/group.controller';
@Module({
    imports: [TypeOrmModule.forFeature([
        TCAGroupsWEB, TCADictionarysWeb, TCAMenusWEB, TCARolesUsersWEB, TCARootMenusWEB, TCAUserWEB,



    ]), TypeOrmModule.forRoot(sqlServerITMV),],
    providers: [
        DatabaseService,
        SystemUsersService,
        RootMenusService,
        MenusService,
        HelpQueryService,
        TCAGroupsService
    ],
    controllers: [SystemUsersController, RootMenusController, MenusController, HelpQueryController, RoleGroupsController],
    exports: [],
})
export class SystemUsersModule { }
