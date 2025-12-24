export const menuData = {
    inbox: [
        {
            id: 1,
            title: 'Hợp đồng mới cần ký',
            content: 'Hợp đồng lao động số HD-2024-001 đã sẵn sàng để ký. Vui lòng kiểm tra và ký hợp đồng trong vòng 3 ngày làm việc.',
            fullContent: `Hợp đồng lao động số HD-2024-001 đã được tạo và sẵn sàng để ký. 

Chi tiết hợp đồng:
- Vị trí: Nhân viên phát triển
- Thời hạn: 12 tháng
- Lương: Thỏa thuận
- Ngày bắt đầu: 01/01/2024
- Phòng ban: Công nghệ thông tin

Vui lòng truy cập hệ thống để xem và ký hợp đồng. Nếu có bất kỳ thắc mắc nào, vui lòng liên hệ Phòng Nhân sự.

Trân trọng,
Phòng Nhân sự`,
            time: '1 ngày trước',
            read: false,
            important: true,
            repository: 'HR System',
            type: 'contract',
            sender: 'Phòng Nhân sự',
            date: '2024-01-15 09:30'
        },
        {
            id: 2,
            title: 'Nhắc nhở gia hạn hợp đồng',
            content: 'Hợp đồng HD-2023-045 sẽ hết hạn trong 15 ngày tới',
            fullContent: `Hợp đồng HD-2023-045 của bạn sẽ hết hạn vào ngày 30/12/2024. 

Thông tin hợp đồng:
- Số hợp đồng: HD-2023-045
- Ngày hết hạn: 30/12/2024
- Còn lại: 15 ngày

Vui lòng liên hệ với quản lý trực tiếp để thảo luận về việc gia hạn hợp đồng.`,
            time: '2 ngày trước',
            read: false,
            important: false,
            repository: 'Contract Management',
            type: 'reminder',
            sender: 'Hệ thống',
            date: '2024-01-14 14:20'
        },
        {
            id: 3,
            title: 'Phiếu lương tháng 12/2024',
            content: 'Phiếu lương tháng 12/2024 đã sẵn sàng. Vui lòng kiểm tra trong hệ thống.',
            fullContent: `Phiếu lương tháng 12/2024 của bạn đã được cập nhật:

- Lương cơ bản: 25,000,000 VND
- Phụ cấp: 3,000,000 VND
- BHXH: -1,800,000 VND
- Thuế TNCN: -1,200,000 VND
- Thực nhận: 25,000,000 VND

Vui lòng kiểm tra chi tiết trong hệ thống payroll.`,
            time: '3 ngày trước',
            read: true,
            important: false,
            repository: 'Payroll System',
            type: 'salary',
            sender: 'Phòng Kế toán',
            date: '2024-01-13 08:15'
        },
        {
            id: 4,
            title: 'Đăng ký nghỉ phép được duyệt',
            content: 'Đơn xin nghỉ phép từ 20-25/01/2024 đã được phê duyệt',
            fullContent: `Đơn xin nghỉ phép của bạn đã được phê duyệt:

- Từ ngày: 20/01/2024
- Đến ngày: 25/01/2024
- Số ngày: 5 ngày
- Loại nghỉ: Nghỉ phép năm
- Người duyệt: Trần Văn A - Trưởng phòng

Chúc bạn có kỳ nghỉ vui vẻ!`,
            time: '4 ngày trước',
            read: true,
            important: false,
            repository: 'Leave Management',
            type: 'approval',
            sender: 'Quản lý trực tiếp',
            date: '2024-01-12 16:45'
        },
        {
            id: 5,
            title: 'CẢNH BÁO: Vi phạm bảo mật',
            content: 'Phát hiện đăng nhập bất thường từ thiết bị mới',
            fullContent: `Hệ thống phát hiện đăng nhập bất thường vào tài khoản của bạn:

- Thời gian: 2024-01-15 02:30
- Địa chỉ IP: 192.168.1.100
- Thiết bị: Chrome trên Windows
- Địa điểm: Hà Nội, Vietnam

Nếu không phải bạn, vui lòng thay đổi mật khẩu ngay lập tức.`,
            time: '5 giờ trước',
            read: false,
            important: true,
            repository: 'Security System',
            type: 'security',
            sender: 'Bộ phận An ninh',
            date: '2024-01-15 02:35'
        },
        {
            id: 6,
            title: 'Training kỹ năng mới',
            content: 'Đăng ký tham gia khóa đào tạo "Kỹ năng quản lý thời gian"',
            fullContent: `Công ty tổ chức khóa đào tạo "Kỹ năng quản lý thời gian":

- Thời gian: 25/01/2024, 09:00-17:00
- Địa điểm: Phòng họp tầng 5
- Giảng viên: Chuyên gia Nguyễn Văn B
- Hạn đăng ký: 20/01/2024

Vui lòng đăng ký tham gia nếu có nhu cầu.`,
            time: '6 ngày trước',
            read: false,
            important: true,
            repository: 'Training System',
            type: 'training',
            sender: 'Phòng Đào tạo',
            date: '2024-01-11 10:00'
        },
        {
            id: 7,
            title: 'Cập nhật chính sách công ty',
            content: 'Chính sách làm việc từ xa mới đã được cập nhật',
            fullContent: `Chính sách làm việc từ xa mới đã được cập nhật:

- Áp dụng từ: 01/02/2024
- Số ngày làm việc từ xa tối đa: 3 ngày/tuần
- Điều kiện áp dụng: Nhân viên chính thức sau 6 tháng
- Quy trình đăng ký: Qua hệ thống ERP

Vui lòng đọc kỹ chính sách mới trước khi áp dụng.`,
            time: '1 tuần trước',
            read: true,
            important: false,
            repository: 'Policy System',
            type: 'policy',
            sender: 'Ban Giám đốc',
            date: '2024-01-10 14:20'
        },
        {
            id: 8,
            title: 'Khảo sát môi trường làm việc',
            content: 'Mời tham gia khảo sát môi trường làm việc năm 2024',
            fullContent: `Công ty đang tiến hành khảo sát môi trường làm việc:

- Thời gian: 15-25/01/2024
- Thời lượng: 10-15 phút
- Mục đích: Cải thiện môi trường làm việc
- Bảo mật: Thông tin được ẩn danh

Vui lòng dành chút thời gian tham gia khảo sát.`,
            time: '2 ngày trước',
            read: false,
            important: false,
            repository: 'Survey System',
            type: 'survey',
            sender: 'Phòng Nhân sự',
            date: '2024-01-14 09:00'
        },
        {
            id: 9,
            title: 'Bảo trì hệ thống',
            content: 'Hệ thống ERP sẽ bảo trì từ 22:00-02:00 ngày 20/01/2024',
            fullContent: `Thông báo bảo trì hệ thống:

- Hệ thống: ERP toàn công ty
- Thời gian: 22:00 20/01/2024 - 02:00 21/01/2024
- Lý do: Nâng cấp phiên bản mới
- Ảnh hưởng: Tất cả dịch vụ sẽ tạm ngừng

Vui lòng lưu lại công việc trước thời gian bảo trì.`,
            time: '3 ngày trước',
            read: true,
            important: true,
            repository: 'IT System',
            type: 'maintenance',
            sender: 'Phòng IT',
            date: '2024-01-13 16:30'
        },
        {
            id: 10,
            title: 'Chúc mừng sinh nhật!',
            content: 'Chúc mừng sinh nhật bạn! Công ty gửi tặng quà sinh nhật',
            fullContent: `Chúc mừng sinh nhật bạn!

Nhân dịp sinh nhật, công ty gửi tặng bạn:
- 1 voucher mua sắm trị giá 500,000 VND
- 1 ngày nghỉ phép có lương
- Thiệp chúc mừng từ Ban lãnh đạo

Vui lòng đến phòng Nhân sự để nhận quà.`,
            time: 'Hôm nay',
            read: false,
            important: false,
            repository: 'HR System',
            type: 'birthday',
            sender: 'Phòng Nhân sự',
            date: '2024-01-15 00:00'
        },
        {
            id: 11,
            title: 'Đánh giá hiệu suất quý IV',
            content: 'Kết quả đánh giá hiệu suất quý IV/2024 đã có',
            fullContent: `Kết quả đánh giá hiệu suất quý IV/2024:

- Xếp loại: Xuất sắc
- Điểm số: 4.8/5.0
- Nhận xét: Hoàn thành xuất sắc các mục tiêu
- Thưởng: 2.5 tháng lương

Vui lòng đăng ký lịch hẹn để thảo luận chi tiết.`,
            time: '1 ngày trước',
            read: false,
            important: true,
            repository: 'Performance System',
            type: 'performance',
            sender: 'Quản lý trực tiếp',
            date: '2024-01-14 15:00'
        },
        {
            id: 12,
            title: 'Lỗi hệ thống chấm công',
            content: 'Khắc phục lỗi chấm công ngày 10/01/2024',
            fullContent: `Thông báo về lỗi hệ thống chấm công:

- Ngày xảy ra: 10/01/2024
- Nguyên nhân: Lỗi kết nối máy chủ
- Giải pháp: Đã khắc phục hoàn toàn
- Ảnh hưởng: Dữ liệu chấm công ngày 10/01

Vui lòng kiểm tra và báo cáo nếu có sai sót.`,
            time: '4 ngày trước',
            read: true,
            important: false,
            repository: 'Timekeeping System',
            type: 'system_error',
            sender: 'Phòng IT',
            date: '2024-01-12 11:30'
        },
        {
            id: 13,
            title: 'Team building cuối năm',
            content: 'Đăng ký tham gia chương trình team building 27-28/01/2024',
            fullContent: `Chương trình team building cuối năm:

- Thời gian: 27-28/01/2024
- Địa điểm: Đà Lạt
- Chi phí: Công ty chi trả 100%
- Hạn đăng ký: 20/01/2024
- Số lượng: 50 người

Đăng ký sớm để giữ chỗ!`,
            time: '5 ngày trước',
            read: false,
            important: true,
            repository: 'Event System',
            type: 'event',
            sender: 'Phòng Hành chính',
            date: '2024-01-11 13:15'
        },
        {
            id: 14,
            title: 'Cập nhật thông tin cá nhân',
            content: 'Yêu cầu cập nhật thông tin cá nhân trước 31/01/2024',
            fullContent: `Yêu cầu cập nhật thông tin cá nhân:

- Lý do: Chuẩn bị báo cáo thuế cuối năm
- Hạn chót: 31/01/2024
- Thông tin cần cập nhật: Địa chỉ, số điện thoại, ngân hàng
- Hướng dẫn: Truy cập portal nhân sự

Vui lòng hoàn thành trước hạn chót.`,
            time: '1 tuần trước',
            read: false,
            important: false,
            repository: 'HR System',
            type: 'reminder',
            sender: 'Phòng Nhân sự',
            date: '2024-01-10 09:45'
        },
        {
            id: 15,
            title: 'Khẩn: Họp khẩn ban giám đốc',
            content: 'Mời họp khẩn với ban giám đốc lúc 14:00 ngày 16/01',
            fullContent: `Mời tham dự cuộc họp khẩn:

- Thời gian: 14:00 ngày 16/01/2024
- Địa điểm: Phòng họp CEO tầng 10
- Thành phần: Trưởng các phòng ban
- Nội dung: Đánh giá kết quả kinh doanh quý IV

Vui lòng chuẩn bị báo cáo chi tiết.`,
            time: '2 ngày trước',
            read: false,
            important: true,
            repository: 'Meeting System',
            type: 'meeting',
            sender: 'Văn phòng Ban giám đốc',
            date: '2024-01-14 10:00'
        }
    ],

    'hexepartisan123/829': [
        {
            id: 16,
            title: 'refactor: refactor import pt project',
            content: 'Đã refactor import project với các cải tiến về performance',
            fullContent: `Refactor import project đã hoàn thành với các thay đổi:

• Tối ưu hóa quá trình import dữ liệu
• Cải thiện hiệu suất xử lý
• Sửa lỗi memory leak
• Thêm validation dữ liệu

Cần review code trước khi merge vào branch main.`,
            time: '1 ngày trước',
            read: false,
            important: true,
            repository: 'hexepartisan123/829',
            type: 'pull_request',
            sender: 'hoangvantuan123',
            date: '2024-01-15 11:45'
        },
        {
            id: 17,
            title: 'fix: Truy van du an nhap du an',
            content: 'Sửa lỗi truy vấn dự án khi nhập dự án mới',
            fullContent: `Đã sửa lỗi truy vấn dự án khi nhập dự án mới:

• Sửa lỗi SQL injection
• Tối ưu hóa query performance
• Thêm index cho bảng projects
• Fix lỗi pagination

Các thay đổi đã được tested và ready for production.`,
            time: '2 ngày trước',
            read: true,
            important: false,
            repository: 'hexepartisan123/829',
            type: 'bug_fix',
            sender: 'hoangvantuan123',
            date: '2024-01-14 16:30'
        },
        {
            id: 18,
            title: 'feat: Add authentication middleware',
            content: 'Thêm middleware xác thực cho API endpoints',
            fullContent: `Đã thêm middleware xác thực:

• JWT token validation
• Role-based access control
• Rate limiting
• Request logging

Middleware đã được tích hợp vào tất cả API routes.`,
            time: '3 ngày trước',
            read: false,
            important: true,
            repository: 'hexepartisan123/829',
            type: 'feature',
            sender: 'developer01',
            date: '2024-01-13 14:20'
        },
        {
            id: 19,
            title: 'docs: Update API documentation',
            content: 'Cập nhật tài liệu API với các endpoint mới',
            fullContent: `Đã cập nhật tài liệu API:

• Thêm documentation cho endpoints mới
• Cập nhật request/response examples
• Thêm troubleshooting guide
• Cập nhật changelog

Documentation available at /api/docs.`,
            time: '4 ngày trước',
            read: true,
            important: false,
            repository: 'hexepartisan123/829',
            type: 'documentation',
            sender: 'tech_writer',
            date: '2024-01-12 10:15'
        },
        {
            id: 20,
            title: 'test: Add unit tests for user service',
            content: 'Bổ sung unit tests cho user service với coverage 95%',
            fullContent: `Đã thêm unit tests cho user service:

• Test coverage: 95%
• Mock database operations
• Test error scenarios
• Integration tests

All tests passing in CI/CD pipeline.`,
            time: '5 ngày trước',
            read: false,
            important: false,
            repository: 'hexepartisan123/829',
            type: 'test',
            sender: 'qa_engineer',
            date: '2024-01-11 16:45'
        },
        {
            id: 21,
            title: 'ci: Setup GitHub Actions workflow',
            content: 'Thiết lập CI/CD pipeline với GitHub Actions',
            fullContent: `Đã thiết lập CI/CD pipeline:

• Automated testing
• Code quality checks
• Security scanning
• Auto deployment to staging

Pipeline triggers on push to main branch.`,
            time: '6 ngày trước',
            read: true,
            important: true,
            repository: 'hexepartisan123/829',
            type: 'ci_cd',
            sender: 'devops_engineer',
            date: '2024-01-10 13:30'
        },
        {
            id: 22,
            title: 'chore: Update dependencies',
            content: 'Cập nhật dependencies lên phiên bản mới nhất',
            fullContent: `Đã cập nhật dependencies:

• React 18.2.0 → 18.3.0
• Node.js 18 → 20
• Security patches
• Performance improvements

All dependencies are now up to date.`,
            time: '1 tuần trước',
            read: false,
            important: false,
            repository: 'hexepartisan123/829',
            type: 'maintenance',
            sender: 'maintainer',
            date: '2024-01-09 11:00'
        },
        {
            id: 23,
            title: 'perf: Optimize database queries',
            content: 'Tối ưu hóa các query database để cải thiện performance',
            fullContent: `Đã tối ưu hóa database queries:

• Add missing indexes
• Rewrite inefficient queries
• Implement query caching
• Reduce N+1 query problems

Performance improved by 40%.`,
            time: '2 ngày trước',
            read: true,
            important: true,
            repository: 'hexepartisan123/829',
            type: 'performance',
            sender: 'dba_specialist',
            date: '2024-01-14 09:15'
        },
        {
            id: 24,
            title: 'security: Fix XSS vulnerability',
            content: 'Sửa lỗi bảo mật XSS trong component input',
            fullContent: `Đã sửa lỗi XSS vulnerability:

• Implement input sanitization
• Add CSP headers
• Escape user input
• Security audit completed

All critical security issues resolved.`,
            time: '3 ngày trước',
            read: false,
            important: true,
            repository: 'hexepartisan123/829',
            type: 'security',
            sender: 'security_team',
            date: '2024-01-13 15:45'
        },
        {
            id: 25,
            title: 'design: Update UI component library',
            content: 'Cập nhật thư viện UI components với design system mới',
            fullContent: `Đã cập nhật UI component library:

• New design system
• Dark mode support
• Accessibility improvements
• Responsive design

All components now follow new design guidelines.`,
            time: '4 ngày trước',
            read: true,
            important: false,
            repository: 'hexepartisan123/829',
            type: 'design',
            sender: 'ui_designer',
            date: '2024-01-12 14:20'
        }
    ],

    // Thêm 75 notifications khác cho các repository/menu khác
    'project-alpha': [
        {
            id: 26,
            title: 'Project kickoff meeting',
            content: 'Cuộc họp khởi động dự án Alpha sẽ diễn ra vào 10:00 ngày mai',
            fullContent: `Project Alpha Kickoff Meeting:
            
- Thời gian: 10:00 ngày 16/01/2024
- Địa điểm: Phòng họp A, tầng 3
- Thành phần: Toàn bộ team dự án
- Nội dung: Giới thiệu dự án, phân công nhiệm vụ

Vui lòng chuẩn bị ý kiến đóng góp.`,
            time: '1 ngày trước',
            read: false,
            important: true,
            repository: 'project-alpha',
            type: 'meeting',
            sender: 'Project Manager',
            date: '2024-01-15 08:00'
        },
        {
            id: 27,
            title: 'Requirements document approved',
            content: 'Tài liệu yêu cầu dự án đã được phê duyệt',
            fullContent: `Tài liệu yêu cầu dự án Alpha đã được phê duyệt:

- Phiên bản: v1.2
- Người phê duyệt: Giám đốc kỹ thuật
- Thay đổi: Đã cập nhật theo feedback
- Next step: Bắt đầu phase thiết kế

Document available in shared drive.`,
            time: '2 ngày trước',
            read: true,
            important: false,
            repository: 'project-alpha',
            type: 'approval',
            sender: 'Business Analyst',
            date: '2024-01-14 11:30'
        }
        // Thêm các notifications khác cho project-alpha...
    ],

    'mobile-app': [
        {
            id: 28,
            title: 'App Store submission',
            content: 'Phiên bản 2.1.0 đã được submit lên App Store',
            fullContent: `Phiên bản mobile app 2.1.0 đã được submit:

- Platform: iOS App Store
- Version: 2.1.0 (build 45)
- Status: Waiting for review
- Expected: 3-5 ngày review

Monitor status in App Store Connect.`,
            time: '6 giờ trước',
            read: false,
            important: true,
            repository: 'mobile-app',
            type: 'deployment',
            sender: 'Release Manager',
            date: '2024-01-15 14:20'
        },
        {
            id: 29,
            title: 'Crash report: v2.0.1',
            content: 'Báo cáo crash từ phiên bản 2.0.1 cần được xử lý',
            fullContent: `Crash report analysis:

- Crash rate: 2.3%
- Affected devices: iOS 15+
- Root cause: Memory pressure
- Priority: High

Need immediate fix for next release.`,
            time: '1 ngày trước',
            read: false,
            important: true,
            repository: 'mobile-app',
            type: 'bug_report',
            sender: 'QA Team',
            date: '2024-01-14 16:45'
        }
        // Thêm các notifications khác cho mobile-app...
    ],

    'data-analytics': [
        {
            id: 30,
            title: 'Monthly report generated',
            content: 'Báo cáo phân tích tháng 12/2024 đã sẵn sàng',
            fullContent: `Monthly analytics report - December 2024:

- Total users: 150,000 (+15% MoM)
- Revenue: 2.5B VND (+22% MoM)
- Key metrics: All targets achieved
- Insights: User engagement increased

Download report from analytics dashboard.`,
            time: '3 ngày trước',
            read: true,
            important: false,
            repository: 'data-analytics',
            type: 'report',
            sender: 'Analytics Team',
            date: '2024-01-13 09:00'
        },
        {
            id: 31,
            title: 'Data pipeline failure',
            content: 'Data pipeline bị lỗi trong quá trình ETL',
            fullContent: `Data pipeline failure detected:

- Time: 2024-01-15 03:45
- Component: ETL Process
- Error: Database connection timeout
- Impact: Delayed reports

Automated recovery in progress.`,
            time: '12 giờ trước',
            read: false,
            important: true,
            repository: 'data-analytics',
            type: 'system_error',
            sender: 'Data Engineering',
            date: '2024-01-15 03:50'
        }
        // Thêm các notifications khác cho data-analytics...
    ],

    // Tiếp tục thêm các repository và notifications cho đến đủ 100...
    'customer-support': [
        {
            id: 32,
            title: 'High priority ticket #CS-1245',
            content: 'Ticket khẩn cấp từ khách hàng VIP cần xử lý ngay',
            fullContent: `High priority support ticket:

- Ticket: #CS-1245
- Customer: Công ty ABC (VIP)
- Issue: System outage affecting operations
- SLA: 1 hour response time

Please handle immediately.`,
            time: '45 phút trước',
            read: false,
            important: true,
            repository: 'customer-support',
            type: 'ticket',
            sender: 'Support System',
            date: '2024-01-15 15:30'
        }
    ],

    'marketing-campaign': [
        {
            id: 33,
            title: 'Campaign performance exceeded',
            content: 'Chiến dịch Q4 đạt hiệu quả vượt 150% KPI',
            fullContent: `Q4 Marketing Campaign Results:

- ROI: 450% (target: 300%)
- Leads generated: 15,000
- Conversion rate: 8.5%
- Cost per lead: 120,000 VND

Campaign extended for 2 more weeks.`,
            time: '2 ngày trước',
            read: true,
            important: true,
            repository: 'marketing-campaign',
            type: 'campaign',
            sender: 'Marketing Team',
            date: '2024-01-14 17:00'
        }
    ],

    // ... tiếp tục thêm cho đến đủ 100 notifications

    'infrastructure': [
        {
            id: 99,
            title: 'Server maintenance completed',
            content: 'Bảo trì server production đã hoàn thành',
            fullContent: `Server maintenance completed successfully:

- Duration: 4 hours
- Services affected: None (maintained redundancy)
- Updates: Security patches applied
- Performance: Improved 15%

All systems operating normally.`,
            time: '8 giờ trước',
            read: true,
            important: false,
            repository: 'infrastructure',
            type: 'maintenance',
            sender: 'Infrastructure Team',
            date: '2024-01-15 06:00'
        }
    ],

    'research-development': [
        {
            id: 100,
            title: 'New patent filed',
            content: 'Đã nộp đơn đăng ký sáng chế mới cho công nghệ AI',
            fullContent: `New patent application filed:

- Title: "Advanced AI Algorithm for Predictive Analytics"
- Application number: PCT/2024/123456
- Inventors: Dr. Nguyen Van C, Dr. Tran Thi D
- Expected grant: 12-18 months

This is our 5th patent this year.`,
            time: '1 tuần trước',
            read: false,
            important: true,
            repository: 'research-development',
            type: 'patent',
            sender: 'R&D Department',
            date: '2024-01-08 14:00'
        }
    ],

    setting: []
};

