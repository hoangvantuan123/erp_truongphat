import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { sqlServerITMV } from 'src/config/database.config';
import { JobNotifiProjectService } from '../service/JobNotifiProject.service';
import { Notification } from '../entities/notification.entity';
import { NotificationReadStatus } from '../entities/notificationReadStatus.entity';
import { NotificationDataService } from '../service/notification.service';
import { NotificationsController } from '../controller/notification.controller';
import { NotificationReadStatusDataService } from '../service/notificationReadStatus.service';
import { NotificationReadStatusDataController } from '../controller/NotificationReadStatusData.controller';
@Module({
    imports: [

        TypeOrmModule.forRoot(sqlServerITMV),
        NotificationReadStatus,
        Notification
    ],
    controllers: [NotificationsController, NotificationReadStatusDataController],
    providers: [JobNotifiProjectService, NotificationDataService, NotificationReadStatusDataService],
})
export class JobNotifiModule { }
