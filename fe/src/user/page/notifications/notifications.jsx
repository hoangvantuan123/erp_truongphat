import { useState, useRef, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Input, Button, Empty } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

import NotificationSidebar from './NotificationSidebar';
import NotificationList from './NotificationList';
import NotificationDetail from './NotificationDetail';
import SettingContent from './SettingContent';
import { NotifiProjectQ } from '../../../features/project/NotifiProjectQ';
import { useNotifications } from '../../components/hooks/notifications/useNotifications';
import { useSplitView } from '../../components/hooks/notifications/useSplitView';
import { initSocket } from '../../../services/socket';
const { Search } = Input;

const Notifications = () => {
    const socketRef = useRef(null);
    const {
        activeMenu,
        setActiveMenu,
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
    } = useNotifications();

    const {
        splitPosition,
        isResizing,
        splitRef,
        handleMouseDown,
        handleMouseMove,
        handleMouseUp
    } = useSplitView();

    const [searchText, setSearchText] = useState('');
    useEffect(() => {
        if (socketRef.current) return;

        const setupSocket = async () => {
            const socket = await initSocket();
            if (!socket) return;

            socketRef.current = socket;
            const searchParams = [{

            }]
            socket.on('trigger_fe_api_call', (data) => {
                fetchNotifications();
            });


            // Cleanup khi unmount
            const handleBeforeUnload = () => { if (socket.connected) socket.disconnect(); };
            window.addEventListener('beforeunload', handleBeforeUnload);

            return () => {
                socket.off();
                if (socket.connected) socket.disconnect();
                window.removeEventListener('beforeunload', handleBeforeUnload);
            };
        };

        setupSocket();

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
            }
        };
    }, []);
    const renderContent = () => {
        if (activeMenu === 'setting') {
            return <SettingContent />;
        }



        return (
            <NotificationList
                notifications={currentData}
                selectedNotification={selectedNotification}
                handleCheckSaveStatus={handleCheckSaveStatus}
                onNotificationClick={setSelectedNotification}
                onMarkAsRead={markAsRead}
                fullView
                fetchNotifications={fetchNotifications}
                setCurrentPage={setCurrentPage}
                currentPage={currentPage}
                setPageSize={setPageSize}
                pageSize={pageSize}
                totalPageSize={totalPageSize}
            />
        );
    };

    return (
        <>
            <Helmet>
                <title>Thông báo</title>
            </Helmet>

            <div className="bg-white h-screen">
                <div className="flex">
                    <NotificationSidebar
                        activeMenu={activeMenu}
                        onMenuChange={setActiveMenu}
                        onNotificationSelect={setSelectedNotification}
                    />

                    {/* Main Content */}
                    <div className="flex-1 min-w-0 flex flex-col h-screen">

                        {/* Content */}
                        <div className="flex-1 overflow-hidden">
                            {activeMenu !== 'setting' && currentData.length === 0 ? (
                                <div className="h-full flex items-center justify-center">
                                    <Empty
                                        description="Không có dữ liệu"
                                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                                    />
                                </div>
                            ) : (
                                renderContent()
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Notifications;