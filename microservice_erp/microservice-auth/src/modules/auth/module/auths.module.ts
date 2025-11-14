import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseService } from 'src/common/database/sqlServer/ITMV/database.service';
import { UserAuthService } from '../service/user.service';
import { AuthService } from '../service/auths.service';
import { TCAUserWEB } from '../entities/auths.entity';
import { sqlServerITMV } from 'src/config/database.config';
import { AuthController } from '../controller/auths.controller';
import { ERPUserLoginLogs } from '../entities/userLoginLogs.entity';
import { EmailService } from '../service/email.service';
import { TdaEmpIn } from '../entities/empIn.entity';
@Module({
    imports: [TypeOrmModule.forFeature([TCAUserWEB, ERPUserLoginLogs, TdaEmpIn]), TypeOrmModule.forRoot(sqlServerITMV),],
    providers: [
        DatabaseService,
        AuthService,
        UserAuthService,
        EmailService
    ],
    controllers: [AuthController],
    exports: [],
})
export class AuthsModule { }
