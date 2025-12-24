// hooks/useNotificationStorage.js
import { useState, useEffect, useCallback } from 'react';

const NOTIFICATION_KEY = 'app_notification_data';

export const useNotificationStorage = () => {
  const [unreadCount, setUnreadCount] = useState(() => {
    // Khởi tạo từ localStorage
    try {
      const data = localStorage.getItem(NOTIFICATION_KEY);
      return data ? JSON.parse(data).unreadCount : 0;
    } catch {
      return 0;
    }
  });

  // Lấy số lượng cũ và trừ đi 1
  const decrementNotificationCount = useCallback(() => {
    try {
      const currentData = localStorage.getItem(NOTIFICATION_KEY);
      let currentCount = 0;
      
      if (currentData) {
        const parsed = JSON.parse(currentData);
        currentCount = parsed.unreadCount || 0;
      }
      
      const newCount = Math.max(0, currentCount - 1); 
      
      const data = {
        unreadCount: newCount,
        lastUpdated: new Date().toISOString(),
        source: window.location.origin,
        action: 'decremented'
      };
      
      localStorage.setItem(NOTIFICATION_KEY, JSON.stringify(data));
      setUnreadCount(newCount);
      
      // Kích hoạt storage event
      localStorage.setItem('notification_trigger', Date.now().toString());
      
      // Gửi qua BroadcastChannel
      if (typeof BroadcastChannel !== 'undefined') {
        const channel = new BroadcastChannel('notification_channel');
        channel.postMessage({
          type: 'UPDATE_NOTIFICATION',
          count: newCount,
          oldCount: currentCount,
          action: 'DECREMENT',
          timestamp: new Date().toISOString()
        });
      }
      
      return { oldCount: currentCount, newCount };
    } catch (error) {
      console.error('Failed to decrement notification count:', error);
      return null;
    }
  }, []);

  // Lấy số lượng cũ và cộng thêm (nếu cần)
  const incrementNotificationCount = useCallback((incrementBy = 1) => {
    try {
      const currentData = localStorage.getItem(NOTIFICATION_KEY);
      let currentCount = 0;
      
      if (currentData) {
        const parsed = JSON.parse(currentData);
        currentCount = parsed.unreadCount || 0;
      }
      
      const newCount = currentCount + incrementBy;
      
      const data = {
        unreadCount: newCount,
        lastUpdated: new Date().toISOString(),
        source: window.location.origin,
        action: 'incremented'
      };
      
      localStorage.setItem(NOTIFICATION_KEY, JSON.stringify(data));
      setUnreadCount(newCount);
      
      localStorage.setItem('notification_trigger', Date.now().toString());
      
      if (typeof BroadcastChannel !== 'undefined') {
        const channel = new BroadcastChannel('notification_channel');
        channel.postMessage({
          type: 'UPDATE_NOTIFICATION',
          count: newCount,
          oldCount: currentCount,
          action: 'INCREMENT',
          timestamp: new Date().toISOString()
        });
      }
      
      return { oldCount: currentCount, newCount };
    } catch (error) {
      console.error('Failed to increment notification count:', error);
      return null;
    }
  }, []);

  // Lưu số lượng mới (ghi đè)
  const saveNotificationCount = useCallback((count) => {
    try {
      const oldData = localStorage.getItem(NOTIFICATION_KEY);
      let oldCount = 0;
      
      if (oldData) {
        const parsed = JSON.parse(oldData);
        oldCount = parsed.unreadCount || 0;
      }
      
      const data = {
        unreadCount: count,
        lastUpdated: new Date().toISOString(),
        source: window.location.origin,
        action: 'updated'
      };
      
      localStorage.setItem(NOTIFICATION_KEY, JSON.stringify(data));
      setUnreadCount(count);
      
      localStorage.setItem('notification_trigger', Date.now().toString());
      
      if (typeof BroadcastChannel !== 'undefined') {
        const channel = new BroadcastChannel('notification_channel');
        channel.postMessage({
          type: 'UPDATE_NOTIFICATION',
          count: count,
          oldCount: oldCount,
          action: 'SET',
          timestamp: new Date().toISOString()
        });
      }
      
      return { oldCount, newCount: count };
    } catch (error) {
      console.error('Failed to save notification count:', error);
      return null;
    }
  }, []);

  // Lấy số lượng thông báo hiện tại
  const getNotificationCount = useCallback(() => {
    try {
      const data = localStorage.getItem(NOTIFICATION_KEY);
      return data ? JSON.parse(data).unreadCount : 0;
    } catch {
      return 0;
    }
  }, []);

  // Lấy toàn bộ dữ liệu thông báo
  const getNotificationData = useCallback(() => {
    try {
      const data = localStorage.getItem(NOTIFICATION_KEY);
      return data ? JSON.parse(data) : { unreadCount: 0, lastUpdated: null };
    } catch {
      return { unreadCount: 0, lastUpdated: null };
    }
  }, []);

  // Lắng nghe storage event từ các tab khác
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === NOTIFICATION_KEY || event.key === 'notification_trigger') {
        try {
          const data = localStorage.getItem(NOTIFICATION_KEY);
          if (data) {
            const parsedData = JSON.parse(data);
            setUnreadCount(parsedData.unreadCount);
            
            // Có thể trigger một event custom
            window.dispatchEvent(new CustomEvent('notificationUpdated', {
              detail: parsedData
            }));
          }
        } catch (error) {
          console.error('Failed to parse notification data:', error);
        }
      }
    };

    // Lắng nghe BroadcastChannel messages
    const handleBroadcastMessage = (event) => {
      if (event.data.type === 'UPDATE_NOTIFICATION') {
        setUnreadCount(event.data.count);
        
        // Cập nhật localStorage để đồng bộ
        const currentData = getNotificationData();
        const updatedData = {
          ...currentData,
          unreadCount: event.data.count,
          lastUpdated: new Date().toISOString(),
          source: 'broadcast'
        };
        localStorage.setItem(NOTIFICATION_KEY, JSON.stringify(updatedData));
      }
    };

    // Lắng nghe storage events
    window.addEventListener('storage', handleStorageChange);

    // Lắng nghe BroadcastChannel
    let channel;
    if (typeof BroadcastChannel !== 'undefined') {
      channel = new BroadcastChannel('notification_channel');
      channel.addEventListener('message', handleBroadcastMessage);
    }

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      if (channel) {
        channel.removeEventListener('message', handleBroadcastMessage);
        channel.close();
      }
    };
  }, [getNotificationData]);

  return {
    unreadCount,
    saveNotificationCount,
    getNotificationCount,
    getNotificationData,
    decrementNotificationCount,
    incrementNotificationCount
  };
};