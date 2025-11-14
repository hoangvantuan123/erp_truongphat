import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('_TDAEmpIn')
export class TdaEmpIn {
    @PrimaryColumn()
    CompanySeq: number;

    @PrimaryColumn()
    EmpSeq: number;

    @Column({ length: 20, nullable: true })
    EmpID?: string;

    @Column({ nullable: true })
    UMEmpType?: number;

    @Column({ length: 8, nullable: true })
    EntDate?: string;

    @Column({ length: 8, nullable: true })
    RetireDate?: string;

    @Column({ length: 1, nullable: true })
    IsDisabled?: string;

    @Column({ length: 1, nullable: true })
    IsForeigner?: string;

    @Column({ nullable: true })
    SMBirthType?: number;

    @Column({ length: 8, nullable: true })
    BirthDate?: string;

    @Column({ nullable: true })
    UMNationSeq?: number;

    @Column({ nullable: true })
    SMSexSeq?: number;

    @Column({ length: 1, nullable: true })
    IsMarriage?: string;

    @Column({ length: 8, nullable: true })
    MarriageDate?: string;

    @Column({ nullable: true })
    UMReligionSeq?: number;

    @Column({ length: 200, nullable: true })
    Hobby?: string;

    @Column({ length: 200, nullable: true })
    Speciality?: string;

    @Column({ length: 20, nullable: true })
    Phone?: string;

    @Column({ length: 20, nullable: true })
    Cellphone?: string;

    @Column({ length: 20, nullable: true })
    Extension?: string;

    @Column({ length: 50, nullable: true })
    Email?: string;

    @Column({ length: 600, nullable: true })
    Remark?: string;

    @Column({ nullable: true })
    UMEmployType?: number;

    @Column({ length: 200, nullable: true })
    WishTask1?: string;

    @Column({ length: 200, nullable: true })
    WishTask2?: string;

    @Column({ length: 200, nullable: true })
    Recommender?: string;

    @Column({ length: 200, nullable: true })
    RcmmndrCom?: string;

    @Column({ length: 200, nullable: true })
    RcmmndrRank?: string;

    @Column({ nullable: true })
    PrevEmpSeq?: number;

    @Column({ nullable: true })
    LastUserSeq?: number;

    @Column({ nullable: true })
    LastDateTime?: Date;

    @Column({ precision: 19, scale: 5, nullable: true })
    Height?: number;

    @Column({ precision: 19, scale: 5, nullable: true })
    Weight?: number;

    @Column({ nullable: true })
    SMBloodType?: number;

    @Column({ nullable: true })
    UMHandiType?: number;

    @Column({ nullable: true })
    UMHandiGrd?: number;

    @Column({ length: 8, nullable: true })
    HandiAppdate?: string;

    @Column({ length: 1, nullable: true })
    IsVeteranEmp?: string;

    @Column({ length: 50, nullable: true })
    VeteranNo?: string;

    @Column({ nullable: true })
    UMRelSeq?: number;

    @Column({ length: 1, nullable: true })
    IsJobEmp?: string;

    @Column({ precision: 19, scale: 5, nullable: true })
    EyeLt?: number;

    @Column({ precision: 19, scale: 5, nullable: true })
    EyeRt?: number;

    @Column({ nullable: true })
    People?: number;

    @Column({ nullable: true })
    UMHouseSort?: number;
}
