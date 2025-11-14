CREATE TABLE _ERPEmpRecruit (
    IdSeq INT IDENTITY(1,1) PRIMARY KEY,
    EmpID NVARCHAR(255) NULL UNIQUE,
    EmpName NVARCHAR(255) NULL,
    ResidID NVARCHAR(255) NULL UNIQUE,
    EmpFamilyName NVARCHAR(255) NULL,
    EmpFirstName NVARCHAR(255) NULL,
    EntDate NVARCHAR(50) NULL,
    IdxNo INT NULL,
    CreatedBy INT NULL,
    UpdatedBy INT NULL,
    CreatedAt DATETIME NOT NULL DEFAULT GETDATE(),
    UpdatedAt DATETIME NOT NULL DEFAULT GETDATE(),
    DegreeSeq INT NULL,
    BirthDate NVARCHAR(50) NULL,
    SMSexSeq INT NULL,
    IssueDate NVARCHAR(50) NULL,
    IssuePlace NVARCHAR(255) NULL,
    PhoneNumber NVARCHAR(50) NULL,
    Email NVARCHAR(255) NULL,
    CategoryType INT NOT NUL,
    RecruitmentSeq INT NULL,
    InterviewerSeq INT NULL,
    FactNameSeq INT NULL,
    DepartmentSeq INT NULL,
    TeamSeq INT NULL,
    PartNameSeq INT NULL,
    LineModel NVARCHAR(255) NULL,
    JopPositionSeq INT NULL,
    InterviewDate NVARCHAR(50) NULL,
    PerAddrStreet NVARCHAR(255) NULL,
    PerAddrWard NVARCHAR(255) NULL,
    PerAddrDistrict NVARCHAR(255) NULL,
    PerAddrProvince NVARCHAR(255) NULL,
    CurAddrStreet NVARCHAR(255) NULL,
    CurAddrWard NVARCHAR(255) NULL,
    CurAddrDistrict NVARCHAR(255) NULL,
    CurAddrProvince NVARCHAR(255) NULL,
    Ethnic NVARCHAR(100) NULL,
    DistanceKm FLOAT NULL,
    ContractTerm NVARCHAR(100) NULL,
	StatusSync  NVARCHAR(50) NULL, 
	CheckAge  NVARCHAR(50) NULL, 
        Addr NVARCHAR(600) NULL,
    Addr2 NVARCHAR(600) NULL;
);


CREATE TABLE _ERPDefine (
    IdSeq INT IDENTITY(1,1) PRIMARY KEY,
    DefineName NVARCHAR(255) NULL,
    DefineKey INT NULL,
    Description NVARCHAR(MAX) NULL,
    IsActive BIT NULL,
    IdxNo INT NULL,
    CreatedBy INT NULL,
    CreatedAt DATETIME NOT NULL DEFAULT GETDATE(),
    UpdatedBy INT NULL,
    UpdatedAt DATETIME NOT NULL DEFAULT GETDATE()
);



CREATE TABLE _ERPDefineItem (
    IdSeq INT IDENTITY(1,1) PRIMARY KEY,
    DefineSeq INT NULL,
    DefineKey INT NULL,
    DefineItemName NVARCHAR(255) NULL,
    Value INT NULL,
    IsActive BIT NULL,
    IdxNo INT NULL,
    CreatedBy INT NULL,
    CreatedAt DATETIME NOT NULL DEFAULT GETDATE(),
    UpdatedBy INT NULL,
    UpdatedAt DATETIME NOT NULL DEFAULT GETDATE()
);



CREATE TABLE _HrAcademyRecruit (
    IdSeq INT IDENTITY(1,1) PRIMARY KEY,
    EmpSeq INT NULL,
    SchoolName NVARCHAR(255) NULL,
    Major NVARCHAR(255) NULL,
    Years NVARCHAR(50) NULL,
    StartYear NVARCHAR(50) NULL,
    GraduationYear NVARCHAR(50) NULL,
    GraduationRank NVARCHAR(100) NULL,
    IdxNo INT NULL,
    CreatedBy INT NULL,
    CreatedAt DATETIME NOT NULL DEFAULT GETDATE(),
    UpdatedBy INT NULL,
    UpdatedAt DATETIME NOT NULL DEFAULT GETDATE()
);


CREATE TABLE _ERPFamilyRecruit (
    IdSeq INT IDENTITY(1,1) PRIMARY KEY,
    EmpSeq INT NULL,
    FamilyTypeSeq INT NULL, -- FK tới bảng Family nếu có

    NationalId NVARCHAR(50) NULL UNIQUE, -- Số CMND/CCCD

    FullName NVARCHAR(255) NULL, -- Họ tên
    EducationLevel NVARCHAR(100) NULL, -- Học lực
    Occupation NVARCHAR(100) NULL, -- Nghề nghiệp
    PhoneNumber NVARCHAR(50) NULL, -- Số điện thoại
    DateOfBirth NVARCHAR(20) NULL, -- Ngày sinh (nên để kiểu DATE nếu dữ liệu chuẩn)

    LivesTogether BIT NOT NULL DEFAULT 0, -- Sống chung (boolean)

    IdxNo INT NULL,
    CreatedBy INT NULL,
    UpdatedBy INT NULL,

    CreatedAt DATETIME NOT NULL DEFAULT GETDATE(),
    UpdatedAt DATETIME NOT NULL DEFAULT GETDATE()
);



CREATE TABLE _ERPLangsRecruit (
    IdSeq INT IDENTITY(1,1) PRIMARY KEY,
    EmpSeq INT NULL,
    LanguageSeq INT NOT NULL,           -- Ngôn ngữ (VD: Tiếng Anh, Tiếng Nhật...) - kiểu số
    CertifiTypeSeq INT NULL,            -- Loại chứng nhận (VD: TOEIC, IELTS, JLPT) - kiểu số
    Score NVARCHAR(255) NULL,           -- Điểm số (VD: 850 TOEIC, N2 JLPT,...)
    StartDate NVARCHAR(50) NULL,
    EndDate NVARCHAR(50) NULL,
    ProfiLevelSeq INT NULL,             -- Cấp bậc (VD: Sơ cấp, Trung cấp, Cao cấp)
    Notes NVARCHAR(MAX) NULL,           -- Ghi chú
    IsLanguageBonus BIT NOT NULL DEFAULT 0, -- Có lương thưởng PC ngoại ngữ không
    IdxNo INT NULL,
    CreatedBy INT NULL,
    UpdatedBy INT NULL,
    CreatedAt DATETIME NOT NULL DEFAULT GETDATE(), -- Thời gian tạo
    UpdatedAt DATETIME NOT NULL DEFAULT GETDATE()  -- Thời gian cập nhật
);


CREATE TABLE _ERPCareerRecruit (
    IdSeq UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
    EmpSeq INT NULL,
    CompanyName NVARCHAR(1000) NULL,
    Position NVARCHAR(100) NULL,
    LaborScale INT NULL,
    JoinDate NVARCHAR(50) NULL,
    ResignDate NVARCHAR(50) NULL,
    JobDescription NTEXT NULL,
    Salary NVARCHAR(100) NULL,
    ReasonForLeaving NTEXT NULL,
    IdxNo INT NULL,
    CreatedBy INT NULL,
    UpdatedBy INT NULL,
    CreatedAt DATETIME NOT NULL DEFAULT GETDATE(),
    UpdatedAt DATETIME NOT NULL DEFAULT GETDATE()
);


CREATE TABLE _ERPCareerItemRecruit (
    IdSeq UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
    EmpSeq INT NULL,
    CareerRecruitSeq UNIQUEIDENTIFIER NULL,
    ProjectName NVARCHAR(255) NULL,
    StartDate NVARCHAR(50) NULL,
    EndDate NVARCHAR(50) NULL,
    JobDescription NVARCHAR(MAX) NULL,      -- ✅ thay TEXT → NVARCHAR(MAX)
    ProjectYears NVARCHAR(50) NULL,
    ProjectSummary NVARCHAR(MAX) NULL,      -- ✅ thay TEXT → NVARCHAR(MAX)
    IdxNo INT NULL,
    CreatedBy INT NULL,
    CreatedAt DATETIME NOT NULL DEFAULT GETDATE(),
    UpdatedBy INT NULL,
    UpdatedAt DATETIME NOT NULL DEFAULT GETDATE()
);


CREATE TABLE _HrOfficeSkillsRecruit (
    IdSeq INT IDENTITY(1,1) PRIMARY KEY,

    EmpSeq INT NULL,

    SkillNameSeq INT NULL,
    SkillTypeSeq INT NULL,

    SkillLevelHigh BIT NOT NULL DEFAULT 0,
    SkillLevelMedium BIT NOT NULL DEFAULT 0,
    SkillLevelLow BIT NOT NULL DEFAULT 0,

    IdxNo INT NULL,

    CreatedBy INT NULL,
    CreatedAt DATETIME NOT NULL DEFAULT GETDATE(),

    UpdatedBy INT NULL,
    UpdatedAt DATETIME NOT NULL DEFAULT GETDATE()
);
