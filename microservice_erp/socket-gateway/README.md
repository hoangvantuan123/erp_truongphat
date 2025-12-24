CREATE TABLE Notification (
    IdSeq UNIQUEIDENTIFIER NOT NULL,
    IdxNo INT NULL,
    CreatedBy INT NULL,
    CreatedAt DATETIME NOT NULL DEFAULT GETDATE(),
    UpdatedBy INT NULL,
    UpdatedAt DATETIME NOT NULL DEFAULT GETDATE(),

    -- -----------------------------
    -- Thông tin bắt buộc bổ sung
    -- -----------------------------

    -- Loại thông báo (Dự án, Hợp đồng, NVL hết hạn, ...)
    NotificationType NVARCHAR(100) NULL,

    Title NVARCHAR(555) NULL,
    Title2 NVARCHAR(555) NULL,
    Title3 NVARCHAR(555) NULL,

    Content NVARCHAR(MAX) NULL,

    Status NVARCHAR(50) NULL,

    -- ID của job scan tạo ra thông báo này
    JobScanIdSeq UNIQUEIDENTIFIER NULL

);
