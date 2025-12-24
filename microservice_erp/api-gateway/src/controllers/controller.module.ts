import { Module } from '@nestjs/common';
/*  */
import { GRPCServiceModule } from 'src/grpc/grpc.module';

import { SPRWkItemController } from './hr/dailyAtt/SPRWkItem.controller';
import { HrEduTypeController } from './hr/edu/hr_edu_type.controller';
import { HrEduCourseController } from './hr/edu/hr_edu_course.controller';
import { HrEduClassController } from './hr/edu/hr_edu_class.controller';

import { CalendarHolidayController } from './hr/dailyAtt/CalendarHoliday.controller';
import { WkOverTimeApproveController } from './hr/dailyAtt/WkOverTimeApprove.controller';
import { SPRWkAbsEmpController } from './hr/dailyAtt/SPRWkAbsEmp.controller';
import { SPRWkMmEmpDaysController } from './hr/dailyAtt/SPRWkMmEmpDays.controller';
import { HrEduLecturerController } from './hr/edu/hr_edu_lecturer.controller';
import { SPRWkEmpDdController } from './hr/dailyAtt/SPRWkEmpDd.controller';
import { HrEduPerRstController } from './hr/edu/hr_edu_per_rst.controller';
import { ProjectMgmtController } from './report/ProjectMgmt.controller';
import { TempFileController } from './upload/tempFIle.controller';
import { PayConditionController } from './report/PayCondition.controller';
import { SDACustController } from './warehouse/customers/SDACust.controller';
import { SPBOMController } from './produce/BOM/BOMReportAll.controller';
import { NotificationController } from './socket/notification/Notification.controller';


const AllProviders = [
    SPRWkItemController,
    CalendarHolidayController,
    WkOverTimeApproveController,
    SPRWkAbsEmpController,
    SPRWkMmEmpDaysController,
    HrEduTypeController,
    HrEduCourseController,
    HrEduClassController,
    HrEduLecturerController,
    SPRWkEmpDdController,
    HrEduPerRstController,
    ProjectMgmtController,
    TempFileController,
    PayConditionController,
    SDACustController,
    SPBOMController,
    NotificationController
];

@Module({
    imports: [GRPCServiceModule],
    providers: [],
    controllers: AllProviders,
    exports: [],
})
export class ControllersModule { }
