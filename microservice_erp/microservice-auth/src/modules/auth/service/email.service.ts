import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
    sendMailLoginOTP({
        to,
        subject,
        otpCode,
        host,
        port,
        user,
        pass,
    }: {
        to: string;
        subject: string;
        otpCode: string;
        host: string;
        port: number;
        user: string;
        pass: string;
    }): void {
        const transporter = nodemailer.createTransport({
            host,
            port,
            ignoreTLS: true,
            secure: false,
            auth: {
                user,
                pass,
            },
        });

        const plainText = `Mã xác nhận đăng nhập của bạn là: ${otpCode}. Mã có hiệu lực trong 5 phút.`;

        const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>Mã xác thực đăng nhập</title>
            </head>
            <body style="font-family: Arial, sans-serif; background-color: #f7f7f7; padding: 20px;">
                <div style="max-width: 600px; margin: auto; background-color: #fff; padding: 20px; border-radius: 10px;">
                    <h2 style="color: #4a90e2;">Xin chào!</h2>
                    <p>Bạn vừa yêu cầu mã xác thực đăng nhập.</p>
                    <p>Mã xác nhận của bạn là:</p>
                    <div style="text-align: center; margin: 20px 0;">
                        <span style="font-size: 24px; font-weight: bold; color: #000; background-color: #e1f0ff; padding: 10px 20px; border-radius: 8px;">
                            ${otpCode}
                        </span>
                    </div>
                    <p>Mã có hiệu lực trong vòng <strong>5 phút</strong>. Vui lòng không chia sẻ mã này với bất kỳ ai.</p>
                    <hr style="margin: 30px 0;">
                    <p style="font-size: 12px; color: #888;">Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email.</p>
                </div>
            </body>
            </html>
        `;

        transporter.sendMail(
            {
                from: `"[NO REPLY] ERP" <${user}>`,
                to,
                subject,
                text: plainText,
                html: htmlContent,
            },
            (error: any, info: any) => {
                if (error) {
                    console.error('❌ Email sending failed:', error.message);
                } else {
                    console.log('📧 Email sent:', info.messageId);
                }
            }
        );
    }
}
