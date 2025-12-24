import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { Server } from 'socket.io';
import { SocketGateway } from './socket.gateway';
import { JobNotifiProjectService } from 'src/modules/notification/service/JobNotifiProject.service';
import { NotificationDataService } from 'src/modules/notification/service/notification.service';
import { Notification } from 'src/modules/notification/entities/notification.entity';
import { uuidv7 } from 'uuidv7';
import { Observable, filter, from, of, throwError, forkJoin } from 'rxjs';
import { catchError, map, mergeMap, toArray, concatMap, switchMap } from 'rxjs/operators';
@Injectable()
export class NotificationService {
    constructor(private readonly socketGateway: SocketGateway,


        private readonly JobNotifiProjectService: JobNotifiProjectService,
        private readonly notificationDataService: NotificationDataService,
    ) { }
    @Cron('0 */10 * * * *')
    handleCron() {
        const connections = this.socketGateway['connections'];
        connections.forEach((socketIds, deviceId) => {
            socketIds.forEach(socketId => {
                const socket = this.socketGateway.server.sockets.sockets.get(socketId);

                if (socket) {
                    socket.emit('trigger_fe_api_call', {
                        message: 'success',
                        timestamp: Date.now(),
                    });
                }
            });
        });
    }



    @Cron('0 * * * * *')
    handleProjectScan() {
        this.JobNotifiProjectService
            .NotifiProjectQ()
            .pipe(
                filter(results => !!results?.data?.length),

                map(results =>
                    results.data.map(item => {
                        const noti = new Notification();

                        noti.IdSeq = uuidv7();
                        noti.NotificationType = 'SUPPLY_CONTRACT';

                        noti.Title = item.SupplyContName;
                        noti.Title2 = item.SupplyContNo;
                        noti.Title3 = item.PayCondStatus;

                        noti.Content = item.MessageAlarm;
                        noti.Status = item.PayCondStatus;

                        // Id của record nguồn (để trace)
                        noti.JobScanIdSeq = item.IdSeq;

                        return noti;
                    })
                ),



                switchMap((notifications: Notification[]) => {
                    return of(notifications); // hoặc of(null)
                })

            )
            .subscribe({
                next: () => {
                    console.log('Insert notification success');
                },
                error: err => {
                    console.error('Insert notification error', err);
                }
            });
    }

}
