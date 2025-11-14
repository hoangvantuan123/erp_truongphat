import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseService } from 'src/common/database/sqlServer/ITMV/database.service';
import { sqlServerITMV } from 'src/config/database.config';
import { TCADictionarysWeb } from '../entities/dictionary.entity';
import { TCALanguageWeb } from '../entities/language.entity';
import { LanguageService } from '../service/language.service';
import { LanguageController } from '../controller/language.controller';
@Module({
    imports: [TypeOrmModule.forFeature([TCADictionarysWeb, TCALanguageWeb]), TypeOrmModule.forRoot(sqlServerITMV),],
    providers: [
        DatabaseService,
        LanguageService
    ],
    controllers: [LanguageController],
    exports: [TypeOrmModule],
})
export class LanguageModule { }
