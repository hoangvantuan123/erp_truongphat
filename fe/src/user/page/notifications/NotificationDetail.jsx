import { Button } from 'antd';
import { CloseOutlined } from '@ant-design/icons';

const NotificationDetail = ({ notification, onClose, onMarkAsRead }) => {
  if (!notification) {
    return null;
  }

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 p-4 flex-shrink-0">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold text-gray-900">
            {notification.title}
          </h2>
          <Button
            type="text"
            icon={<CloseOutlined />}
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          />
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
          <span><strong>Gửi bởi:</strong> {notification.sender || 'System'}</span>
          <span><strong>Thời gian:</strong> {notification.time}</span>
          <span><strong>Loại:</strong> {notification.type || 'Thông báo'}</span>
          {notification.date && (
            <span><strong>Ngày:</strong> {notification.date}</span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="prose max-w-none">
          <pre className="whitespace-pre-wrap font-sans text-gray-700 text-sm leading-6">
            {notification.fullContent || notification.content}
          </pre>
        </div>
      </div>

      {/* Actions */}
      <div className="border-t border-gray-200 p-4 flex-shrink-0">
        <div className="flex space-x-2">
          <Button type="primary">Phản hồi</Button>
          <Button
            onClick={() => {
              onMarkAsRead(notification.id);
            }}
          >
            {notification.read ? 'Đánh dấu chưa đọc' : 'Đánh dấu đã đọc'}
          </Button>
          <Button danger>Xóa</Button>
        </div>
      </div>
    </div>
  );
};

export default NotificationDetail;