import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('_ERPUploadsFileItems')
export class ERPUploadsFileItems {
    @PrimaryGeneratedColumn()
    IdSeq: number;

    @Column({ nullable: true })
    FormCode: string;

    @Column({ nullable: true })
    FieldName: string;

    @Column({ type: 'nvarchar', nullable: true })
    OriginalName?: string;


    @Column({ nullable: true })
    Encoding?: string;

    @Column({ nullable: true })
    MimeType?: string;
    @Column({ nullable: true })
    Destination: string;
    @Column({ nullable: true })
    Filename: string;

    @Column({ nullable: true })
    ItemNoSeq: number;
    @Column({ nullable: true })
    Path: string;

    @Column({ nullable: true })
    TableName: string;

    @Column({ nullable: true })
    Size: number;
    @Column({ nullable: true })
    Favorite: boolean;


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
