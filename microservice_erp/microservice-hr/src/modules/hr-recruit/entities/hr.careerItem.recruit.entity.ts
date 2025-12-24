import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    PrimaryColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity('_ERPCareerItemRecruit')
export class ERPCareerItemRecruit {
    @PrimaryColumn('uuid')
    IdSeq: string;


    @Column({ nullable: true })
    EmpSeq: number;
    @Column({ nullable: true, type: 'uuid' })
    CareerRecruitSeq: string;
    // Tên dự án (프로젝트 이름)
    @Column({ nullable: true, length: 255 })
    ProjectName: string;

    // Ngày bắt đầu (시작일)
    @Column({ nullable: true })
    StartDate: string;

    // Ngày kết thúc (종료일)
    @Column({ nullable: true })
    EndDate: string;

    // Công việc phụ trách (담당 업무)
    @Column({ nullable: true, type: 'text' })
    JobDescription: string;

    // Số năm tham gia dự án (년수)
    @Column({ nullable: true })
    ProjectYears: string;

    // Khái quát dự án
    @Column({ nullable: true, type: 'text' })
    ProjectSummary: string;



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
