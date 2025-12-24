import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity('_HrOfficeSkillsRecruit')
export class HrOfficeSkillsRecruit {
    @PrimaryGeneratedColumn()
    IdSeq: number;

    // Mã ứng viên
    @Column({ nullable: true })
    EmpSeq: number;

    // Tên kỹ năng (VD: Word, Excel...)
    @Column({ nullable: true})
    SkillNameSeq: number;

    // Loại kỹ năng (VD: Office, Software, etc.)
    @Column({ nullable: true})
    SkillTypeSeq: number;

    // Mức độ: 상 (Tốt)
    @Column({ default: false })
    SkillLevelHigh: boolean;

    // Mức độ: 중 (Trung bình)
    @Column({ default: false })
    SkillLevelMedium: boolean;

    // Mức độ: 하 (Kém)
    @Column({ default: false })
    SkillLevelLow: boolean;





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
