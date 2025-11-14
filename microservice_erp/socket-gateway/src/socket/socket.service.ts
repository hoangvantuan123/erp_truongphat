import { Injectable } from '@nestjs/common';

@Injectable()
export class SocketService {
  private deviceToSockets = new Map<string, Set<string>>();
  private socketToDevice = new Map<string, string>();

  register(deviceId: string, socketId: string) {
    if (!this.deviceToSockets.has(deviceId)) {
      this.deviceToSockets.set(deviceId, new Set());
    }
    this.deviceToSockets.get(deviceId)?.add(socketId);
    this.socketToDevice.set(socketId, deviceId);
  }

  unregister(socketId: string): string | undefined {
    const deviceId = this.socketToDevice.get(socketId);
    if (deviceId) {
      const socketSet = this.deviceToSockets.get(deviceId);
      socketSet?.delete(socketId);

      if (socketSet && socketSet.size === 0) {
        this.deviceToSockets.delete(deviceId);
      }

      this.socketToDevice.delete(socketId);
    }
    return deviceId;
  }

  getSocketIdsByDeviceId(deviceId: string): Set<string> | undefined {
    return this.deviceToSockets.get(deviceId);
  }

  getDeviceIdBySocketId(socketId: string): string | undefined {
    return this.socketToDevice.get(socketId);
  }



  isDeviceConnected(deviceId: string): any {
    const socketIds = this.deviceToSockets.get(deviceId);
    return socketIds && socketIds.size > 0;
  }

  areDevicesConnected(deviceIds: string[]): Record<string, boolean> {
    const status: Record<string, boolean> = {};

    if (!Array.isArray(deviceIds) || deviceIds.length === 0) {
      return status;
    }

    deviceIds.forEach(deviceId => {
      status[deviceId] = this.isDeviceConnected(deviceId);
    });

    return status;
  }

}
