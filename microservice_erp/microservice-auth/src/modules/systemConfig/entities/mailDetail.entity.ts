import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('_ERPMailDetail')
export class ERPMailDetail {

    @PrimaryGeneratedColumn()
    IdSeq: number;

    @Column({ nullable: true })
    MailSettingsSeq: number;

    @Column({ nullable: true })
    LanguageSeq: number;

    @Column({ nullable: true })
    PlainText: string;

    @Column({ nullable: true })
    FromMail: string;

    @Column({ nullable: true })
    HtmlContent: string;

    @Column({ nullable: true })
    IdxNo: number;

}