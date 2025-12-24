import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity('_ERPLangsRecruit')
export class ERPLangsRecruit {
    @PrimaryGeneratedColumn()
    IdSeq: number;

    @Column({ nullable: true })
    EmpSeq: number;
    @Column({ nullable: false })
    LanguageSeq: number; // Ngôn ngữ (VD: Tiếng Anh, Tiếng Nhật...)

    @Column({ nullable: true })
    CertifiTypeSeq: number; // Loại chứng nhận (VD: TOEIC, IELTS, JLPT)

    @Column({ nullable: true })
    Score: string; // Điểm số (VD: 850 TOEIC, N2 JLPT,...)


    @Column({ nullable: true })
    StartDate: string;
    @Column({ nullable: true })
    EndDate: string;

    @Column({ nullable: true })
    ProfiLevelSeq: number; // Cấp bậc (VD: Sơ cấp, Trung cấp, Cao cấp)

    @Column({ nullable: true })
    Notes: string; // Ghi chú


    @Column({ default: false })
    IsLanguageBonus: boolean;

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
