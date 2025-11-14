import { Injectable } from '@nestjs/common';
import * as bwipjs from 'bwip-js';

@Injectable()
export class BarcodeService {
    generateBarcode(
        text: string,
        bcType: string,
        includetext: boolean,
        callback: (err: Error, png: Buffer) => void
    ): void {
        bwipjs.toBuffer({
            bcid: bcType,       // Loại barcode
            text: text,         // Nội dung cần mã hóa
            scale: 2,           // Tỷ lệ phóng đại 2x
            height: 10,         // Chiều cao thanh, tính bằng millimet
            includetext: includetext,  // Hiển thị văn bản dễ đọc
            textxalign: 'center', // Canh giữa văn bản
            paddingwidth: 5,   // Thêm viền trắng hai bên ngang (đơn vị pixel)
            paddingheight: 5,  // Thêm viền trắng trên và dưới (đơn vị pixel)
            backgroundcolor: undefined // Màu nền trắng
        }, callback);
    }
}
