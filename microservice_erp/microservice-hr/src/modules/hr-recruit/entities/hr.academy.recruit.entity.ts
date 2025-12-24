import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('_HrAcademyRecruit')
export class HrAcademyRecruit {
    @PrimaryGeneratedColumn()
    IdSeq: number;

    @Column({ nullable: true })
    EmpSeq: number;


    @Column({ nullable: true })
    SchoolName: string; 

    @Column({ nullable: true })
    Major: string;

    @Column({ nullable: true })
    Years: string;

    @Column({ nullable: true })
    StartYear: string;
    @Column({ nullable: true })
    GraduationYear: string;

    @Column({ nullable: true })
    GraduationRank: string;






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
