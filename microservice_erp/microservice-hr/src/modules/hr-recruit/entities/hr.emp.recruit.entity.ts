import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity('_ERPEmpRecruit')
export class ERPEmpRecruit {
    // Khóa chính tự tăng
    @PrimaryGeneratedColumn()
    IdSeq: number;

    // Mã nhân viên (duy nhất)
    @Column({ nullable: true, unique: true })
    EmpID: string;

    // Họ tên đầy đủ
    @Column({ nullable: true })
    EmpName: string;

    // Số CMND/CCCD (duy nhất)
    @Column({ nullable: true, unique: true })
    ResidID: string;

    // Họ
    @Column({ nullable: true })
    EmpFamilyName: string;

    // Tên
    @Column({ nullable: true })
    EmpFirstName: string;

    // Ngày tuyển dụng (EntDate)
    @Column({ nullable: true })
    EntDate: string;

    // Mã sắp xếp (nếu có)
    @Column({ nullable: true })
    IdxNo: number;

    // Người tạo bản ghi
    @Column({ nullable: true })
    CreatedBy: number;

    // Người cập nhật bản ghi
    @Column({ nullable: true })
    UpdatedBy: number;

    // Ngày tạo bản ghi
    @CreateDateColumn({ nullable: true })
    CreatedAt: Date;

    // Ngày cập nhật bản ghi
    @UpdateDateColumn({ nullable: true })
    UpdatedAt: Date;

    // Bằng cấp
    @Column({ nullable: true })
    DegreeSeq: number;

    // Ngày sinh
    @Column({ nullable: true })
    BirthDate: string;

    // Giới tính
    @Column({ nullable: true })
    SMSexSeq: number;

    // Ngày cấp CMND/CCCD
    @Column({ nullable: true })
    IssueDate: string;

    // Nơi cấp CMND/CCCD
    @Column({ nullable: true })
    IssuePlace: string;

    // Số điện thoại
    @Column({ nullable: true })
    PhoneNumber: string;

    // Email
    @Column({ nullable: true })
    Email: string;

    // Phân loại ứng viên
    @Column({ nullable: true })
    CategoryType: number;

    // Hình thái tuyển dụng / nhà thầu
    @Column({ nullable: true })
    RecruitmentSeq: number;

    // Người phỏng vấn
    @Column({ nullable: true })
    InterviewerSeq: number;

    // Nhà máy
    @Column({ nullable: true })
    FactNameSeq: number;

    // Phòng ban
    @Column({ nullable: true })
    DepartmentSeq: number;

    // Nhóm
    @Column({ nullable: true })
    TeamSeq: number;

    // Bộ phận
    @Column({ nullable: true })
    PartNameSeq: number;

    // Line / Model sản xuất
    @Column({ nullable: true })
    LineModel: string;

    // Chức vụ
    @Column({ nullable: true })
    JopPositionSeq: number;

    // Ngày phỏng vấn
    @Column({ nullable: true })
    InterviewDate: string;

    // Địa chỉ quê - Đường
    @Column({ nullable: true })
    PerAddrStreet: string;

    // Địa chỉ quê - Phường/Xã
    @Column({ nullable: true })
    PerAddrWard: string;

    // Địa chỉ quê - Quận/Huyện
    @Column({ nullable: true })
    PerAddrDistrict: string;

    // Địa chỉ quê - Tỉnh/Thành phố
    @Column({ nullable: true })
    PerAddrProvince: string;

    // Địa chỉ hiện tại - Đường
    @Column({ nullable: true })
    CurAddrStreet: string;

    // Địa chỉ hiện tại - Phường/Xã
    @Column({ nullable: true })
    CurAddrWard: string;

    // Địa chỉ hiện tại - Quận/Huyện
    @Column({ nullable: true })
    CurAddrDistrict: string;

    // Địa chỉ hiện tại - Tỉnh/Thành phố
    @Column({ nullable: true })
    CurAddrProvince: string;

    // Dân tộc
    @Column({ nullable: true })
    Ethnic: string;

    // Khoảng cách đến công ty (km)
    @Column({ nullable: true, type: 'float' })
    DistanceKm: number;

    // Thời hạn hợp đồng
    @Column({ nullable: true })
    ContractTerm: string;
    @Column({ nullable: true })
    StatusSync: string;
    @Column({ nullable: true })
    CheckAge: string;


    @Column({ nullable: true })
    Addr: string;
    @Column({ nullable: true })
    Addr2: string;



}
