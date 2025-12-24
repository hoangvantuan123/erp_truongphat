import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('Notification')
export class Notification {
    @PrimaryColumn('uuid')
    IdSeq: string;

    @Column({ nullable: true })
    IdxNo: number;

    @Column({ nullable: true })
    CreatedBy: number;

    @CreateDateColumn()
    CreatedAt: Date;

    @Column({ nullable: true })
    UpdatedBy: number;

    @UpdateDateColumn()
    UpdatedAt: Date;

    // -----------------------------
    // Thông tin bắt buộc bổ sung
    // -----------------------------

    // Loại thông báo (Dự án, Hợp đồng, NVL hết hạn, ...)
    @Column({ nullable: true })
    NotificationType: string;


    @Column({ nullable: true })
    Title: string;
    @Column({ nullable: true })
    Title2: string;

    @Column({ nullable: true })
    Title3: string;

    @Column({ nullable: true })
    Content: string;


    @Column({ nullable: true })
    Status: string;
    @Column({ nullable: true })
    UserId: string;
    @Column({ nullable: true })
    UserSeq: string;


    // ID của job scan tạo ra thông báo này
    @Column({ nullable: true, type: 'uuid' })
    JobScanIdSeq: string;



}
