import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('_ERPPrintFile')
export class ERPPrintFile {
    @PrimaryColumn('uuid')
    IdSeq: string;

    @Column({ nullable: true, type: 'uuid' })
    PrintSeq: string;


    @Column({ nullable: true })
    TypeFile: string;

    @Column({ nullable: true })
    Module: string;

    @Column({ nullable: true })
    AssetSeq: string;
    @Column({ nullable: true })
    FileSeq: string;

    @Column({ nullable: true })
    ItemSeq: number;

    @Column({ nullable: true })
    TypePrint: string;
    @Column({ nullable: true })
    TemType: string;

    @Column({ nullable: true })
    QrCode: string;

    @Column({ nullable: true })
    NameFile: string;
    @Column({ nullable: true })
    PathDocx: string;
    @Column({ nullable: true })
    PathPdf: string;

    @Column({ nullable: true })
    PathFile: string;

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

}