import { Module } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
import { SocketService } from './socket.service';
import { ScheduleModule } from '@nestjs/schedule';
import { NotificationService } from './notification.service';
import { JobNotifiProjectService } from 'src/modules/notification/service/JobNotifiProject.service';
import { NotificationDataService } from 'src/modules/notification/service/notification.service';

@Module({
    imports: [
        ScheduleModule.forRoot(),

    ],
    providers: [SocketGateway, SocketService, NotificationService, JobNotifiProjectService, NotificationDataService]

    ,
})
export class SocketModule { }
