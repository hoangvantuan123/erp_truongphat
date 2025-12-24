import { Module } from '@nestjs/common';
import { GrpcSPRWkItemService } from './service/hr/dailyAtt/SPRWkItem.service';
import { GrpcCalendarHolidayService } from './service/hr/dailyAtt/CalendarHoliday.service';
import { GrpcWkOverTimeApproveService } from './service/hr/dailyAtt/WkOverTimeApprove.service';
import { GrpcSPRWkAbsEmpService } from './service/hr/dailyAtt/SPRWkAbsEmp.service';
import { GrpcSPRWkMmEmpDaysService } from './service/hr/dailyAtt/SPRWkMmEmpDays.service';
import { GrpcEduTypeService } from './service/hr/edu/hrEduType.service';
import { GrpcEduCourseService } from './service/hr/edu/hrEduCourse.service';
import { GrpcEduClassService } from './service/hr/edu/hrEduClass.service';
import { GrpcEduLecturerService } from './service/hr/edu/hrEduLecturer.service';
import { GrpcSPRWkEmpDdService } from './service/hr/dailyAtt/SPRWkEmpDd.service';
import { GrpcEduPerRstService } from './service/hr/edu/hrEduPerRst.service';
import { gRPCTempFileService } from './service/upload/tempFile.service';
import { GrpcPayConditionService } from './service/report/project/PayCondition.service';
import { GrpcSDACustService } from './service/wh/cust/SDACust.service';
/*  */
import { GrpcProjectMgmtService } from './service/report/project/projectMgmt.service';
import { GrpcBOMService } from './service/produce/BOM/bom.service';
import { GrpcNotificationService } from './service/socket/notification/notification.service';
const AllProviders = [
    GrpcSPRWkItemService,
    GrpcCalendarHolidayService,
    GrpcWkOverTimeApproveService,
    GrpcSPRWkAbsEmpService,
    GrpcSPRWkMmEmpDaysService,
    GrpcEduTypeService,
    GrpcEduCourseService,
    GrpcEduClassService,
    GrpcEduLecturerService,
    GrpcSPRWkEmpDdService,
    GrpcEduPerRstService,
    GrpcProjectMgmtService,
    gRPCTempFileService,
    GrpcPayConditionService,
    GrpcSDACustService,
    GrpcBOMService, GrpcNotificationService

];

@Module({
    imports: [],
    providers: AllProviders,
    controllers: [],
    exports: AllProviders,
})
export class GRPCServiceModule { }
