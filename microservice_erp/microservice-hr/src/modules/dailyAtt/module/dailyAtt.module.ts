import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseService } from 'src/common/database/sqlServer/ITMV/database.service';
import { sqlServerITMV } from 'src/config/database.config';
import { GenerateXmlService } from '../generate-xml/generate-xml.service';
import { SPRWkItemService } from '../service/SPRWkItem.service';
import { SPRWkItemController } from '../controller/SPRWkItem.controller';
import { CalendarHolidayService } from '../service/calendarHoliday.service';
import { CalendarHolidayController } from '../controller/calendarHoliday.controller';
import { WkOverTimeApproveService } from '../service/wkOverTimeApprove.service';
import { WkOverTimeApproveController } from '../controller/WkOverTimeApprove.controller';
import { SPRWkAbsEmpService } from '../service/SPRWkAbsEmp.service';
import { SPRWkAbsEmpController } from '../controller/SPRWkAbsEmp.controller';
import { SPRWkMmEmpDaysService } from '../service/SPRWkMmEmpDays.service';
import { SPRWkMmEmpDaysController } from '../controller/SPRWkMmEmpDays.controller';
import { SPRWkEmpDdService } from '../service/SPRWkEmpDd.service';
import { SPRWkEmpDdController } from '../controller/SPRWkEmpDd.controller';
@Module({
    imports: [
        TypeOrmModule.forRoot(sqlServerITMV),
    ],
    controllers: [
        SPRWkItemController,
        CalendarHolidayController,
        WkOverTimeApproveController,
        SPRWkAbsEmpController,
        SPRWkMmEmpDaysController,
        SPRWkEmpDdController
    ]
    ,
    providers: [
        DatabaseService,
        GenerateXmlService,
        SPRWkItemService,
        CalendarHolidayService,
        WkOverTimeApproveService,
        SPRWkAbsEmpService,
        SPRWkMmEmpDaysService,
        SPRWkEmpDdService

    ],
})
export class DailyAttModule { }
