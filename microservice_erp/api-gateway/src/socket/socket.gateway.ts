import {
    WebSocketGateway,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
  } from '@nestjs/websockets';
  import { Server, Socket } from 'socket.io';
  import { SocketService } from './socket.service';
  import { MessageDto } from './dto/message.dto';
  
  @WebSocketGateway({
    cors: { origin: '*' },
  })
  export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;
  
    constructor(private readonly socketService: SocketService) {}
  
    handleConnection(client: Socket) {
      const deviceId = client.handshake.query.device_id as string;
  
      if (!deviceId) {
        client.disconnect();
        return;
      }
  
      this.socketService.register(deviceId, client.id);
      console.log(`[CONNECTED] Device ${deviceId} → Socket ${client.id}`);
    }
  
    handleDisconnect(client: Socket) {
      const deviceId = this.socketService.unregister(client.id);
      console.log(`[DISCONNECTED] Device ${deviceId} → Socket ${client.id}`);
    }
  
    @SubscribeMessage('send_message_to_device')
    handleSendMessage(client: Socket, payload: MessageDto) {
      const socketId = this.socketService.getSocketIdByDeviceId(payload.deviceId);
      if (socketId) {
        this.server.to(socketId).emit('receive_message', payload.message);
      } else {
        client.emit('error', 'Device not connected');
      }
    }
  }
  