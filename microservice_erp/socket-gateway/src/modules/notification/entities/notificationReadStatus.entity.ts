import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';


@Entity('NotificationReadStatus')
export class NotificationReadStatus {
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




    @Column({ nullable: true })
    UserId: number;


    @Column({ default: false })
    IsRead: boolean;


    @Column({ nullable: true, type: 'uuid' })
    NotificationIdSeq: string;
}
