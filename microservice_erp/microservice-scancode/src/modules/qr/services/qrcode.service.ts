import { Injectable } from '@nestjs/common';
import * as qr from 'qr-image';
import { PNG } from 'pngjs';

@Injectable()
export class QrcodeService {
  generateQrCode(url: string): Buffer {
    const qrBuffer = qr.imageSync(url, { type: 'png' });

    const png = PNG.sync.read(qrBuffer);
    for (let y = 0; y < png.height; y++) {
      for (let x = 0; x < png.width; x++) {
        const idx = (png.width * y + x) << 2;
        if (
          png.data[idx] === 255 &&
          png.data[idx + 1] === 255 &&
          png.data[idx + 2] === 255
        ) {
          png.data[idx + 3] = 0; 
        }
      }
    }

    return PNG.sync.write(png);
  }
}
