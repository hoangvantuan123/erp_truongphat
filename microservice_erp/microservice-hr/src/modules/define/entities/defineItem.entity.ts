import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('_ERPDefineItem')
export class ERPDefineItem {
    @PrimaryGeneratedColumn()
    IdSeq: number;

    @Column({ nullable: true })
    DefineSeq: number;


    @Column({ nullable: true })
    DefineKey: number;
    @Column({ nullable: true })
    DefineItemName: string;

    @Column({ nullable: true })
    Value?: number;

    @Column({ nullable: true })
    IsActive: boolean;

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
