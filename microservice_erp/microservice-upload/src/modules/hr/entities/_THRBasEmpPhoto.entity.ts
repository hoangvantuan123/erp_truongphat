import { Entity, Column, PrimaryColumn, CreateDateColumn } from 'typeorm';

@Entity('_THRBasEmpPhoto')
export class ERPTHRBasEmpPhoto {
    @PrimaryColumn()
    CompanySeq: number;

    @PrimaryColumn()
    EmpSeq: number;

    @Column({ type: 'nvarchar', nullable: true })
    Extention: string;

    @Column({ type: 'nvarchar', nullable: true })
    Photo: string;

    @Column({ type: 'nvarchar', nullable: true })
    EnrollTime: string;

    @Column({ type: 'int', nullable: true })
    FileSize: number;

    @Column({ type: 'int', nullable: true })
    LastUserSeq: number;

    @Column({ type: 'datetime', nullable: true })
    LastDateTime: Date;

    @Column({ type: 'nvarchar', nullable: true })
    ThumbnailPhoto: string;
}
