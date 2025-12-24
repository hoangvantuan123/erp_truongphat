import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseService } from 'src/common/database/sqlServer/ITMV/database.service';
import { sqlServerITMV } from 'src/config/database.config';
import { GenerateXmlService } from '../generate-xml/generate-xml.service';

import { HrEduTypeController } from '../controller/hrEduType.controller';
import { HrEduTypeService } from '../service/hrEduType.service';
import { HrEduCourseController } from '../controller/hrEduCourse.controller';
import { HrEduCourseService } from '../service/hrEduCourse.service';
import { HrEduClassController } from '../controller/hrEduClass.controller';
import { HrEduClassService } from '../service/hrEduClass.service';
import { HrEduLecturerController } from '../controller/hrEduLecturer.controller';
import { HrEduLecturerService } from '../service/hrEduLecturer.service';
import { HrEduPerRstService } from '../service/hrEduPerRst.service';
import { HrEduPerRstController } from '../controller/hrEduPerRst.controller';

@Module({
  imports: [TypeOrmModule.forFeature([]), TypeOrmModule.forRoot(sqlServerITMV)],
  controllers: [
    HrEduTypeController,
    HrEduCourseController,
    HrEduClassController,
    HrEduLecturerController,
    HrEduPerRstController,
  ],
  providers: [
    DatabaseService,
    GenerateXmlService,
    HrEduTypeService,
    HrEduCourseService,
    HrEduClassService,
    HrEduLecturerService,
    HrEduPerRstService,
  ],
})
export class HrEduModule {}
