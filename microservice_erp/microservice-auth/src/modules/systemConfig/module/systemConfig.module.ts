import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseService } from 'src/common/database/sqlServer/ITMV/database.service';
import { sqlServerITMV } from 'src/config/database.config';
import { TCADictionarysWeb } from 'src/modules/language/entities/dictionary.entity';
import { PublicIPsService } from '../service/ipPublic.service';
import { ERPPublicIPs } from '../entities/ipEnity.entity';
import { PublicIPController } from '../controller/ipPublic.controller';
import { ERPMails } from '../entities/mail.entity';
import { ERPMailDetail } from '../entities/mailDetail.entity';
import { MailService } from '../service/mail.service';
import { MailController } from '../controller/mail.controller';
@Module({
    imports: [TypeOrmModule.forFeature([ERPPublicIPs, ERPMails, ERPMailDetail]), TypeOrmModule.forRoot(sqlServerITMV),],
    providers: [
        DatabaseService,
        PublicIPsService,
        MailService
    ],
    controllers: [PublicIPController, MailController],
    exports: [],
})
export class SystemConfigModule { }
