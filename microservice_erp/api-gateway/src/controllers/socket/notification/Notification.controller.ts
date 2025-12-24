import { Controller, Post, Body, Req, HttpStatus } from '@nestjs/common';
import { Request } from 'express';
import { lastValueFrom } from 'rxjs';
import { GrpcNotificationService } from 'src/grpc/service/socket/notification/notification.service';
@Controller('v15/socket')
export class NotificationController {
    constructor(private readonly grpcNotificationService: GrpcNotificationService) { }



    @Post('NotificationQ')
    NotificationQ(@Body() body: { result: any, }, @Req() req: Request) {
        if (!body?.result) {
            return { success: false, message: 'Invalid request: Missing "result"' };
        }

        const authorization = req.headers.authorization || '';
        const requestData = { result: body.result, metadata: { authorization } };

        return lastValueFrom(this.grpcNotificationService.NotificationQ(requestData.result, requestData.metadata))
            .then((resu) => {
                return resu;
            })
            .catch((error) => {
                return { success: false, message: 'Internal Server Error' };
            });
    }
    @Post('NotificationReadStatusA')
    NotificationReadStatusA(@Body() body: { result: any, }, @Req() req: Request) {
        if (!body?.result) {
            return { success: false, message: 'Invalid request: Missing "result"' };
        }

        const authorization = req.headers.authorization || '';
        const requestData = { result: body.result, metadata: { authorization } };

        return lastValueFrom(this.grpcNotificationService.NotificationReadStatusA(requestData.result, requestData.metadata))
            .then((resu) => {
                return resu;
            })
            .catch((error) => {
                return { success: false, message: 'Internal Server Error' };
            });
    }

}