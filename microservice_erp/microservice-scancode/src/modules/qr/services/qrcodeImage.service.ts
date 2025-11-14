import { Injectable } from '@nestjs/common';
import * as qr from 'qr-image';
import * as Jimp from 'jimp';

@Injectable()
export class QrcodeImageService {
    async generateQrCodeWithLogo(url: string, logoUrl: string, size: number = 10): Promise<Buffer> {
        const qrBuffer = qr.imageSync(url, { type: 'png', ec_level: 'H', size: size });
        let qrImage = await Jimp.read(qrBuffer);
        const logo = await Jimp.read(logoUrl);

        qrImage = await this.removeWhiteBackground(qrImage);

        const logoSize = qrImage.bitmap.width / 4;
        logo.resize(logoSize, logoSize);

        const logoPadding = 10;
        logo.contain(
          logoSize + logoPadding,
          logoSize + logoPadding,
          Jimp.HORIZONTAL_ALIGN_CENTER | Jimp.VERTICAL_ALIGN_MIDDLE,
        );

        const xPos = (qrImage.bitmap.width - logo.bitmap.width) / 2;
        const yPos = (qrImage.bitmap.height - logo.bitmap.height) / 2;

        qrImage.composite(logo, xPos, yPos);

        return await qrImage.getBufferAsync(Jimp.MIME_PNG);
    }

    private async removeWhiteBackground(image: Jimp): Promise<Jimp> {
        for (let y = 0; y < image.bitmap.height; y++) {
            for (let x = 0; x < image.bitmap.width; x++) {
                const idx = (image.bitmap.width * y + x) << 2; // Vị trí pixel
                const r = image.bitmap.data[idx];     // Red
                const g = image.bitmap.data[idx + 1]; // Green
                const b = image.bitmap.data[idx + 2]; // Blue

                if (r > 200 && g > 200 && b > 200) {
                    image.bitmap.data[idx + 3] = 0; // Alpha (độ trong suốt)
                }
            }
        }
        return image;
    }
}
