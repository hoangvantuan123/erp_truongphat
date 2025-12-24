import { useState, useMemo, useEffect } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/vi';

// Cấu hình 1 lần duy nhất
dayjs.extend(relativeTime);
dayjs.locale('vi');

const NotificationItem = ({
  notification,
  isSelected,
  onSelect,
  onMarkAsRead,
  handleCheckSaveStatus
}) => {


  // Cách 1: Dùng useMemo
  const formattedTime = useMemo(() => {
    return dayjs(notification.CreatedAt).fromNow();
  }, [notification.CreatedAt]);

  // Cách 2: Hàm helper
  const formatTime = (timestamp) => {
    return dayjs(timestamp).fromNow();
  };

  return (
    <div
      className={`group relative border-b border-gray-50 last:border-b-0 hover:bg-gray-50 transition-colors cursor-pointer 
        ${!notification.IsRead ? 'bg-blue-50 border-l-4 border-l-blue-500' : 'bg-white'}
        ${isSelected ? 'border-blue-500 bg-gray-100' : ''}`
      }
      onClick={() => handleCheckSaveStatus(notification)}
    >
      <div className="p-4 flex flex-col border-b">

        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2 min-w-0">
            <div className="flex-shrink-0 w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs text-gray-600">
              •
            </div>

            <span className="text-sm font-semibold text-gray-900">{notification.Title}</span>
            <span className="text-xs text-gray-500">{notification.Status}</span>
          </div>

          {notification.IsRead && (
            <button
              className="text-blue-600 text-xs underline hover:text-blue-800"
              onClick={(e) => {
                e.stopPropagation();
                onMarkAsRead(notification.IdSeq);
              }}
            >
              Đã đọc
            </button>
          )}
        </div>

        <div className="text-gray-600 text-sm mb-2 line-clamp-3">
          {notification.Content}
        </div>

        <div className="flex flex-wrap text-xs text-gray-500 space-x-4">
          <span><strong>Số hợp đồng:</strong> {notification.Title2}</span>

          {/* CÁCH ĐƠN GIẢN NHẤT - Dayjs luôn dùng locale đã set */}
          <span>
  <strong>Thời gian:</strong>{" "}
  {dayjs(notification.CreatedAt).format("DD/MM/YYYY HH:mm")}{" "}
  ({dayjs(notification.CreatedAt).fromNow()})
</span>

        </div>

      </div>
    </div>
  );
};

export default NotificationItem;