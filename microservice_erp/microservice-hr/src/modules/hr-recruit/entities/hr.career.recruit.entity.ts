import {
    Entity,
    PrimaryColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity('_ERPCareerRecruit')
export class ERPCareerRecruit {
    @PrimaryColumn('uuid')
    IdSeq: string;

    @Column({ nullable: true })
    EmpSeq: number;

    // Tên công ty (회사명)
    @Column({ nullable: true, length: 255 })
    CompanyName: string;

    // Chức vụ (Position)
    @Column({ nullable: true, length: 100 })
    Position: string;

    // Quy mô lao động (근로자 규모)
    @Column({ nullable: true })
    LaborScale: number;

    // Năm vào công ty (입사)
    @Column({ nullable: true })
    JoinDate: string;

    // Năm thôi việc (퇴사)
    @Column({ nullable: true })
    ResignDate: string;

    // Công việc phụ trách (담당 업무)
    @Column({ nullable: true, type: 'text' })
    JobDescription: string;

    // Mức lương (급여)
    @Column({ nullable: true, length: 100 })
    Salary: string;

    // Lý do xin nghỉ (사직이유)
    @Column({ nullable: true, type: 'text' })
    ReasonForLeaving: string;


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
