import {
    useState,
    useMemo,
    useEffect,
    useCallback
} from 'react';

import {
    NotificationQ
} from '../../../../features/socket/notification/NotificationQ';
import {
    togglePageInteraction
} from '../../../../utils/togglePageInteraction';
import { HandleError } from '../../../page/default/handleError';
import { NotificationReadStatusA } from '../../../../features/socket/notification/NotificationReadStatusA';
import { encodeBase64Url } from '../../../../utils/decode-JWT';
import { useNotificationStorage } from './useNotificationStorage';
import CryptoJS from 'crypto-js'
export const useNotifications = () => {
    const [activeMenu, setActiveMenu] = useState("inbox");
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [totalPageSize, setTotalPageSize] = useState(0);
    const { 
        unreadCount, 
        saveNotificationCount,
        decrementNotificationCount,
        getNotificationData 
      } = useNotificationStorage();
      
    const [notifications, setNotifications] = useState([]);
    const userFrom = JSON.parse(localStorage.getItem('userInfo'))
    const [selectedNotification, setSelectedNotification] = useState(null);
    const formatDate = (numDate) => {
        if (!numDate) return "";
        const str = numDate.toString();
        return `${str.substring(6, 8)}-${str.substring(4, 6)}-${str.substring(0, 4)}`;
      };
      const nextPage = useCallback((notification) => {
    
        const filteredData = { SupplyContNo: notification?.Title2, SupplyContName: notification?.Title };
        const encryptedData = CryptoJS.AES.encrypt(
          JSON.stringify(filteredData),
          'KEY_PATH_ERP'
        ).toString();
    
        const encryptedToken = encodeBase64Url(encryptedData);
        const route = `/pm/project-mgmt/pm03/${encryptedToken}`;
        const isElectron = !!window?.electron?.openRoute;
        isElectron
          ? window.electron.openRoute(route)
          : window.open(route, '_blank');
    
        localStorage.setItem('COLLAPSED_STATE', JSON.stringify(true));
      }, []);
    
    
      const handleCheckSaveStatus = useCallback(async (notification) => {
        if (notification?.IsRead === true) {
          nextPage(notification);
          return true;
        }
      
        const filteredData = [{
          IdxNo: 0,
          CreatedBy: userFrom?.UserSeq,
          UpdatedBy: userFrom?.UserSeq,
          UserId: userFrom?.UserSeq,
          IsRead: true,
          NotificationIdSeq: notification?.IdSeq,
        }];
      
        if (!filteredData?.[0].NotificationIdSeq) {
          togglePageInteraction(false);
          return true;
        }
      
        togglePageInteraction(true);
      
        try {
          const result = await NotificationReadStatusA(filteredData);
          if (!result?.success) {
            HandleError([result]);
            return;
          }
          decrementNotificationCount();
          const checkData = result?.data || [];
          setNotifications(prev => {
            const updated = prev.map(item => {
              const found = [...checkData].find(x => x?.NotificationIdSeq === item?.IdSeq);
              return found ? {
                ...item,
                IsRead: found.IsRead,
              } : item;
            });
            return updated;
          });
          
          nextPage(notification);
        } catch (error) {
          HandleError([{
            success: false,
            message: error.message || 'Đã xảy ra lỗi khi cập nhật!',
          }]);
        } finally {
          togglePageInteraction(false);
        }
      }, [userFrom]);
    const fetchNotifications = useCallback(async () => {
        togglePageInteraction(true);
        try {
            const params = {
                UserId: userFrom?.UserSeq ,
                Page: currentPage, 
                PageSize: 9999999, 
                KeyItem1: '', 
                OnlyUnread: true,

            };
            const result = await NotificationQ(params);

            if (result.success) {
                togglePageInteraction(false);
              
                const count = result?.data?.[0]?.unreadCount || 0;
                const totalCount = result?.data?.[0]?.totalCount ?? 0;
                const pageSize = result?.data?.[0]?.pageSize ?? 0;
                const totalPages = Math.ceil(totalCount / pageSize);

                setTotalPageSize(totalCount);
                
                  saveNotificationCount(count);
                setNotifications(result?.data?.[0]?.data);
            } else {
                togglePageInteraction(false);
               
            }
        } catch (err) {
            togglePageInteraction(false);
          
        }
      }, [currentPage, pageSize, userFrom?.UserSeq]); 

      useEffect(() => {
        fetchNotifications();
      }, []);


    const currentData = useMemo(() => {
        switch (activeMenu) {
            case "inbox":
                return notifications;
            default:
                return notifications;
        }
    }, [activeMenu, notifications]);

    // ============================
    // 🔥 Đánh dấu đã đọc
    // ============================
    const markAsRead = (id) => {
        setNotifications(prev =>
            prev.map(n => n.id === id ? {
                ...n,
                ReadRow: true
            } : n)
        );
    };

    const markAllAsRead = () => {
        setNotifications(prev =>
            prev.map(n => ({
                ...n,
                ReadRow: true
            }))
        );
    };

    // ============================
    // 🔥 Khi đổi menu
    // ============================
    const handleMenuChange = (menu) => {};

    return {
        activeMenu,
        setActiveMenu: handleMenuChange,

        notifications,
        currentData,

        selectedNotification,
        setSelectedNotification,

        markAsRead,
        markAllAsRead,

        fetchNotifications,
        handleCheckSaveStatus,
        setCurrentPage,
        currentPage,
        setPageSize,
        pageSize,
        totalPageSize
    };
};