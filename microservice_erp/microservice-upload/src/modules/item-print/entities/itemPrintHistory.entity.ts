import { Entity, PrimaryColumn, Column, UpdateDateColumn, CreateDateColumn } from 'typeorm';

@Entity('ItemPrintHistory')
export class ItemPrintHistory {
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

    @Column({ nullable: true, type: 'uuid' })
    ItemPrintSeq: string;

    @Column({ type: 'decimal', precision: 18, scale: 2, nullable: true })
    OldQty: number;

    @Column({ type: 'decimal', precision: 18, scale: 2, nullable: true })
    NewQty: number;


    @Column({ nullable: true })
    QrcodeOld: string;


}
