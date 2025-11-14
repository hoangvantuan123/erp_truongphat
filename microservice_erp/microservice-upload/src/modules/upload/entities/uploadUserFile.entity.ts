import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('_ERPUploadsUserFile')
export class ERPUploadsUserFile {
    @PrimaryGeneratedColumn()
    IdSeq: number;


    @Column()
    UserId: string;


    @Column({ nullable: true })
    Filename: string;

    @Column({ nullable: true })
    Originalname: string;

    @Column({ nullable: true })
    Type: string;

    @Column({ default: false })
    IsAvatar: boolean;

    @Column({ nullable: true })
    Path: string;

    @Column({ nullable: true })
    Size: number;


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
