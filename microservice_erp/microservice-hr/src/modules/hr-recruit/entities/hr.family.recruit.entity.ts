import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity('_ERPFamilyRecruit')
export class ERPFamilyRecruit {
    @PrimaryGeneratedColumn()
    IdSeq: number;
    @Column({ nullable: true })
    EmpSeq: number;
    @Column({ nullable: true })
    FamilyTypeSeq: number; // Mối quan hệ tới bảng Family

    @Column({ nullable: true, unique: true })
    NationalId: string; // Số chứng minh thư nhân dân

    @Column({ nullable: true })
    FullName: string; // Họ tên

    @Column({ nullable: true })
    EducationLevel: string; // Tên học lực

    @Column({ nullable: true })
    Occupation: string; // Nghề nghiệp // CÔng việc 

    @Column({ nullable: true })
    PhoneNumber: string; // Số điện thoại

    @Column({ nullable: true })
    DateOfBirth: string; // Ngày sinh




    @Column({ default: false })
    LivesTogether: boolean; // Sống chung

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
