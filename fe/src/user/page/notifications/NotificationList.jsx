import { useState, useMemo, useEffect } from 'react';
import { Pagination, Empty, Select, Input, Button, Space } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import NotificationItem from './NotificationItem';
const { Option } = Select;
const { Search } = Input;

const NotificationList = ({
  notifications,
  selectedNotification,
  onNotificationClick,
  onMarkAsRead,
  fullView = false,
  onMarkAllAsRead,
  fetchNotifications,
  handleCheckSaveStatus,
  setCurrentPage,
  currentPage,
  setPageSize,
  pageSize,
  totalPageSize
}) => {

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [containerHeight, setContainerHeight] = useState(0);

  const calculateContainerHeight = useMemo(() => {
    const headerHeight = 90; // Chiều cao header với filter
    const paginationHeight = 35; // Chiều cao phân trang
    return `calc(100vh - ${headerHeight + paginationHeight}px)`;
  }, []);

  const containerClass = fullView
    ? "bg-gray-50 flex flex-col min-h-screen"
    : "flex flex-col bg-gray-50";

  // Lọc và tìm kiếm dữ liệu
  const filteredData = useMemo(() => {
    let filtered = notifications;

    if (statusFilter === 'unread') {
      filtered = filtered.filter(notif => !notif.read);
    } else if (statusFilter === 'read') {
      filtered = filtered.filter(notif => notif.read);
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(notif => notif.type === typeFilter);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const safeLower = (value) => (value ?? "").toString().toLowerCase();

      filtered = filtered.filter(notif =>
        safeLower(notif.Title).includes(term) ||
        safeLower(notif.Title2).includes(term) ||
        safeLower(notif.Title3).includes(term) ||
        safeLower(notif.Status).includes(term) ||
        safeLower(notif.Content).includes(term)
      );
      
    }

    return filtered;
  }, [notifications, searchTerm, statusFilter, typeFilter]);

  // Phân trang dữ liệu đã lọc
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredData.slice(startIndex, endIndex);
  }, [filteredData, currentPage, pageSize]);

  // Reset về trang 1 khi filter thay đổi
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, typeFilter]);

  const handlePageChange = (page, size) => {
    console.log('page', page)
    setCurrentPage(page);
    setPageSize(size);
  };

  // Thêm useEffect để trigger API khi currentPage hoặc pageSize thay đổi
/*   useEffect(() => {
    fetchNotifications();
  }, [currentPage, pageSize, fetchNotifications]);

 */


  
  const handleResetFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setTypeFilter('all');
    setCurrentPage(1);
  };

  if (notifications.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <Empty
          description="Không có thông báo nào"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      </div>
    );
  }

  return (
    <div className={containerClass} style={{ height: fullView ? '100vh' : '100%' }}>
      {/* Header với bộ lọc - FIXED HEIGHT */}
      <div className="flex-shrink-0 bg-white border-b border-gray-200 p-3 space-y-2">
        {/* Thanh tìm kiếm */}
        <div className="flex items-center space-x-2">
          <Search
            placeholder="Tìm kiếm thông báo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ flex: 1 }}
            size="small"
            allowClear
          />

          <Button
            icon={<ReloadOutlined />}
            size="small"
            onClick={fetchNotifications}
          >
            Reload
          </Button>

        </div>



        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>
            Hiển thị {paginatedData.length} của {filteredData.length} thông báo
            {filteredData.length !== notifications.length &&
              ` (lọc từ ${notifications.length} thông báo)`
            }
          </span>

          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={totalPageSize}
            onChange={handlePageChange}
            onShowSizeChange={handlePageChange}
            showSizeChanger
            showQuickJumper
            showTotal={(total, range) =>
              `${range[0]}-${range[1]} của ${total} thông báo`
            }
            pageSizeOptions={['10', '20', '50', '100']}
            size="small"
          />
        </div>
      </div>

      {/* Danh sách thông báo - FLEXIBLE HEIGHT với scroll */}
      <div
        className="flex-1 overflow-hidden"
        style={{
          minHeight: '200px',
          maxHeight: calculateContainerHeight
        }}
      >
        <div className="h-full overflow-y-auto">
          <div className="bg-white">
            {paginatedData.map(notification => (
              <NotificationItem
                key={notification.IdSeq}
                notification={notification}
                isSelected={selectedNotification?.IdSeq === notification.IdSeq}
                onSelect={onNotificationClick}
                onMarkAsRead={onMarkAsRead}
                handleCheckSaveStatus={handleCheckSaveStatus}
              />
            ))}
          </div>
        </div>
      </div>


    </div>
  );
};

export default NotificationList;