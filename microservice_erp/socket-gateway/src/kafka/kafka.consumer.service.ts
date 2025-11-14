import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { SocketGateway } from '../socket/socket.gateway';

@Controller()
export class KafkaConsumerService {
    constructor(private readonly socketGateway: SocketGateway) { }

    @MessagePattern('socket.commands')
    async handleKafkaCommand(@Payload() message: any) {
        const { command, data } = message.value;

        switch (command) {
            case 'disconnect':
                this.socketGateway.disconnectDevice(data.deviceId);
                break;


            default:
                console.warn(`Unknown command: ${command}`);
        }
    }
}
