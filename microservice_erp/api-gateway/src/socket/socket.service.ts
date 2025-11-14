import { Injectable } from '@nestjs/common';

@Injectable()
export class SocketService {
  private deviceToSocket = new Map<string, string>();
  private socketToDevice = new Map<string, string>();

  register(deviceId: string, socketId: string) {
    this.deviceToSocket.set(deviceId, socketId);
    this.socketToDevice.set(socketId, deviceId);
  }

  unregister(socketId: string): string | undefined {
    const deviceId = this.socketToDevice.get(socketId);
    if (deviceId) {
      this.deviceToSocket.delete(deviceId);
      this.socketToDevice.delete(socketId);
    }
    return deviceId;
  }

  getSocketIdByDeviceId(deviceId: string): string | undefined {
    return this.deviceToSocket.get(deviceId);
  }
}
