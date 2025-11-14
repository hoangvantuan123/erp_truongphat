import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('_ERPGroupsTemp')
export class ERPGroupsTemp {
    @PrimaryColumn('uuid')
    IdSeq: string;

    @Column({ nullable: true })
    GroupsName: string;
    @Column({ nullable: true, unique: true })
    Code: string;
    @Column({ nullable: true })
    Description: string;

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
