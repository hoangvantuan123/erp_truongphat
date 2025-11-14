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
  path: '/connect',
})
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;


  constructor(private readonly socketService: SocketService,

  ) { }

  private connections: Map<string, Set<string>> = new Map();

  private broadcastDeviceStatus() {
    const allDeviceIds = Array.from(this.connections.keys());
    const statusMap = {};

    for (const deviceId of allDeviceIds) {
      statusMap[deviceId] = true;
    }

    this.server.emit('device_status', statusMap);
  }

  handleConnection(client: Socket) {
    const deviceId = client.handshake.query.deviceId as string;

    if (!deviceId) {
      client.disconnect();
      return;
    }


    if (!this.connections.has(deviceId)) {
      this.connections.set(deviceId, new Set());
    }

    const socketIds = this.connections.get(deviceId);
    socketIds?.add(client.id);


    this.socketService.register(deviceId, client.id);

    console.log(`[CONNECTED] ${deviceId} : ${client.id}`);
    this.broadcastDeviceCount();
    this.broadcastDeviceStatus();
  }


  handleDisconnect(client: Socket) {
    const deviceId = this.socketService.unregister(client.id);

    if (deviceId) {
      const socketIds = this.connections.get(deviceId);

      if (socketIds) {
        socketIds.delete(client.id);
        if (socketIds.size === 0) {
          this.connections.delete(deviceId);
        }
      }
      this.broadcastDeviceStatus();
      console.log(`[DISCONNECTED] ${deviceId} : ${client.id}`);
      this.broadcastDeviceCount();

    }
  }
  disconnectDevice(deviceId: string) {
    const socketIds = this.connections.get(deviceId);
    if (!socketIds || socketIds.size === 0) {
      return;
    }

    socketIds.forEach(socketId => {
      const socket = this.server.sockets.sockets.get(socketId);
      if (socket) {
        socket.emit('force_disconnect_notice', 'Bạn đã bị đăng xuất khỏi hệ thống');

        setTimeout(() => {
          socket.disconnect();
          console.log(`🔌 Disconnected socket ${socketId} of device ${deviceId}`);
        }, 50);
      }
    });

    this.connections.delete(deviceId);
    this.broadcastDeviceStatus();
  }


  @SubscribeMessage('send_message_to_device')
  handleSendMessage(client: Socket, payload: MessageDto) {
    const socketIds = this.socketService.getSocketIdsByDeviceId(payload.deviceId);

    if (socketIds && socketIds.size > 0) {
      for (const socketId of socketIds) {
        this.server.to(socketId).emit('receive_message', payload.message);
      }
    } else {
      client.emit('error', 'Device not connected');
    }
  }
  @SubscribeMessage('force_disconnect_device')
  handleForceDisconnect(client: Socket, payload: { deviceId: string }) {
    this.disconnectDevice(payload.deviceId);
  }


  private broadcastDeviceCount() {
    const totalConnections = this.connections.size;
    this.server.emit('total_connections', totalConnections);
  }

  @SubscribeMessage('check_device_status')
  handleCheckDeviceStatus(client: Socket, payload: { deviceIds: string[] }) {
    const status = this.socketService.areDevicesConnected(payload.deviceIds);
    client.emit('device_status', status);
  }



}
