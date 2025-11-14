import { useState, useRef, useEffect } from "react";
import { UserOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";
import { Avatar, List, Modal, Input, Button, message, Switch, Table, Tag } from "antd";
import { ChangePassword } from "../../../../features/auth/changePassword";
import { useTranslation } from 'react-i18next'
import { PostUpdateUsers } from "../../../../features/system/postUpdateUsers";
import { LaptopOutlined, MobileOutlined, TabletOutlined } from "@ant-design/icons";
import { PostDeviceLogsQ } from "../../../../features/users/deviceLogsQ";
import { getSocket } from "../../../../services/socket";
import { deviceId } from "../../../../services/tokenService";
import dayjs from 'dayjs'
import { initSocket } from "../../../../services/socket";
import Cookies from 'js-cookie'
import ModalCheckLogout from "../logout/modalCheckLogOut";
import ModalCheckAllLogout from "../logout/modalCheckAllLogOut";

export default function Profile({ modalOpen, selectedKey }) {
    const { t } = useTranslation()
    const activeFetchCountRef = useRef(0);
    const userFromLocalStorage = JSON.parse(localStorage.getItem("userInfo"));
    const loadingBarRef = useRef(null);
    // State mở modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorPass, setErrorPass] = useState("");
    const [isEmailVerificationEnabled, setIsEmailVerificationEnabled] = useState(
        userFromLocalStorage?.ForceOtpLogin
    );
    const [gridData, setGridData] = useState([])
    const [statusDevice, setStatusDevice] = useState([])
    const [checkModal, setCheckModal] = useState(false);
    const [checkAllModal, setCheckAllModal] = useState(false);
    const [selectedDevice, setSelectedDevice] = useState(null);
    const increaseFetchCount = () => {
        activeFetchCountRef.current += 1;
    };

    const decreaseFetchCount = () => {
        activeFetchCountRef.current -= 1;
        if (activeFetchCountRef.current === 0) {
            loadingBarRef.current?.complete();
        }
    };

    const fetchData = async () => {
        increaseFetchCount();


        const controller = new AbortController();
        const signal = controller.signal;

        const search = {
            UserSeq: userFromLocalStorage?.UserSeq,
            UserLogin: userFromLocalStorage?.UserId
        };

        try {
            const response = await PostDeviceLogsQ(search, signal);
            if (response.success) {
                const fetchedData = response.data || [];
                const filteredData = Object.values(
                    fetchedData.reduce((acc, curr) => {
                        const id = curr.DeviceId;
                        if (!acc[id] || new Date(curr.LoginTime) > new Date(acc[id].LoginTime)) {
                            acc[id] = curr;
                        }
                        return acc;
                    }, {})
                );

                const sortedData = filteredData.sort((a, b) => {
                    const currentDeviceId = getDeviceIdFromCookie();

                    if (a.DeviceId === currentDeviceId && b.DeviceId !== currentDeviceId) {
                        return -1;
                    }
                    if (b.DeviceId === currentDeviceId && a.DeviceId !== currentDeviceId) {
                        return 1;
                    }

                    return new Date(b.LoginTime) - new Date(a.LoginTime);
                });

                setGridData(sortedData);
            } else {
                message.error(response.errorDetails);
            }
        } catch (error) {
            message(error)
        } finally {
            decreaseFetchCount();
        }
    };
    useEffect(() => {
        if (selectedKey === "profile") {
            fetchData();
        }
    }, [selectedKey]);
    const handleChangePassword = async () => {
        if (!oldPassword || !newPassword || !confirmPassword) {
            setErrorPass(t('870000030'));
            return;
        }
        const isValidLength = newPassword.length >= 15 ||
            (newPassword.length >= 8 && /[a-zA-Z]/.test(newPassword) && /\d/.test(newPassword));

        if (!isValidLength) {
            setErrorPass(t('870000031'))
            return;
        }

        if (newPassword !== confirmPassword) {
            setErrorPass(t('870000032'))
            return;
        }

        if (newPassword === oldPassword) {
            setErrorPass(t('870000033'));
            return;
        }


        try {
            const response = await ChangePassword(userFromLocalStorage.UserId, oldPassword, newPassword);
            if (response.success) {
                message.success(response.message || t('870000034'));
                setNewPassword('');
                setConfirmPassword('');
                setOldPassword('');
                setErrorPass('');
                setIsModalOpen(false)
            } else {
                setErrorPass(response.message);
            }
        } catch (error) {
            setErrorPass(t('870000035'));
        }

    };

    const handleOpenModal = () => {
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setIsModalOpen(true);
    };
    const handleToggleForceOtp = async (checked) => {
        try {
            await PostUpdateUsers([
                { UserSeq: userFromLocalStorage.UserSeq, ForceOtpLogin: checked }
            ]);

            const updatedUser = {
                ...userFromLocalStorage,
                ForceOtpLogin: checked
            };
            localStorage.setItem("userInfo", JSON.stringify(updatedUser));

            message.success(
                checked ? t('Đã bật xác thực email') : t('Đã tắt xác thực email')
            );


            setIsEmailVerificationEnabled(checked);
        } catch (error) {
            message.error(t('Có lỗi xảy ra khi cập nhật'));
        }
    };
    const getDeviceIdFromCookie = () => {
        const key = "device_id";
        return Cookies.get(key);
    };

    const columns = [
        {
            title: 'Thiết bị',
            dataIndex: 'DeviceName',
            key: 'DeviceName',
            render: (text, record) => {
                const [widthStr] = (record.ScreenResolution || '0x0').split('x');
                const width = parseInt(widthStr, 10) || 0;
                let type = 'desktop';

                if (record.IsMobile) {
                    type = 'mobile';
                } else if (record.Platform?.toLowerCase().includes('ipad') || (width >= 768 && width <= 1024)) {
                    type = 'tablet';
                }

                return (
                    <div className="flex items-center gap-2">
                        {type === 'mobile' ? (
                            <MobileOutlined />
                        ) : type === 'tablet' ? (
                            <TabletOutlined />
                        ) : (
                            <LaptopOutlined />
                        )}
                        <span>{text}</span>
                    </div>
                );
            },
        },

        {
            title: 'IP',
            dataIndex: 'IpAddress',
            key: 'IpAddress',
        },
        {
            title: 'DeviceId',
            dataIndex: 'DeviceId',
            key: 'DeviceId',
        },
        {
            title: 'Hoạt động gần nhất',
            dataIndex: 'LoginTime',
            key: 'LoginTime',
            render: (text, record) => {
                const currentDeviceId = getDeviceIdFromCookie();
                return record.DeviceId === currentDeviceId
                    ? 'Now'
                    : dayjs(text).format('HH:mm DD/MM/YYYY');
            },
        },
        {
            title: 'Trạng thái',
            dataIndex: 'StatusLogs',
            key: 'StatusLogs',
            render: (status, record) => {
                const userFromLocalStorage = JSON.parse(localStorage.getItem('userInfo'));

                const deviceIdWithUserSeq = `${record.DeviceId}-${userFromLocalStorage?.UserSeq || ''}`;
                const isOnline = statusDevice[deviceIdWithUserSeq] || false;

                return isOnline ? (
                    <Tag color="green">Online</Tag>
                ) : (
                    <Tag color="default">Offline</Tag>
                );

            },
        },
        {
            title: '',
            key: 'action',
            render: (_, record) => {
                const currentDeviceId = getDeviceIdFromCookie();
                if (record.DeviceId === currentDeviceId) {
                    return null;
                }
                if (record.StatusLogs === false) {
                    return null;
                }

                return (
                    <Button
                        danger
                        size="small"
                        onClick={() => checkLogout(record)}
                    >
                        Đăng xuất
                    </Button>
                );
            },
        },
    ];
    const checkLogout = (record) => {
        setSelectedDevice(record);
        setCheckModal(true);
    };

    const confirmLogout = () => {
        if (selectedDevice) {
            const userFromLocalStorage = JSON.parse(localStorage.getItem('userInfo'));
            const socket = getSocket();
            const deviceIdWithUserSeq = selectedDevice.DeviceId + "-" + (userFromLocalStorage?.UserSeq || "");

            socket.emit('force_disconnect_device', { deviceId: deviceIdWithUserSeq });
            setCheckModal(false);
            setSelectedDevice(null);
        }
    };

    const checkAllLogout = (record) => {
        setCheckAllModal(true);
    };
    const handleLogoutAllDevices = () => {
        const socket = getSocket();
        const userFromLocalStorage = JSON.parse(localStorage.getItem('userInfo'));
        const deviceIds = gridData
            .map(item => item.DeviceId)
            .filter(id => id !== getDeviceIdFromCookie());
        setCheckAllModal(false)
        deviceIds.forEach(deviceId => {
            const deviceIdWithUserSeq = deviceId + "-" + (userFromLocalStorage?.UserSeq || "");
            socket.emit('force_disconnect_device', { deviceId: deviceIdWithUserSeq });
        });
    };


    useEffect(() => {
        let socketRef = null;

        const setupSocket = async () => {
            const socket = await initSocket();
            if (!socket) {
                return;
            }

            socketRef = socket;

            const deviceIds = gridData.map(item => item.DeviceId);

            if (deviceIds.length > 0) {
                const userFromLocalStorage = JSON.parse(localStorage.getItem('userInfo'));

                const deviceIdWithUserSeq = deviceIds.map(deviceId => `${deviceId}-${userFromLocalStorage?.UserSeq}`);

                socket.emit('check_device_status', { deviceIds: deviceIdWithUserSeq });

                const handleDeviceStatus = (status) => {
                    setStatusDevice(status);
                };

                socket.on('device_status', handleDeviceStatus);

                return () => {
                    socket.off('device_status', handleDeviceStatus);
                    socket.disconnect();
                };
            }
        };

        let cleanupFn;

        setupSocket().then((cleanup) => {
            cleanupFn = cleanup;
        });

        return () => {
            if (cleanupFn) cleanupFn();
        };
    }, [gridData]);




    return (
        <div className="h-full overflow-auto scroll-container">
            <ModalCheckLogout
                setModalOpen={setCheckModal}
                modalOpen={checkModal}
                confirmLogout={confirmLogout}
            />
            <ModalCheckAllLogout
                setModalOpen={setCheckAllModal}
                modalOpen={checkAllModal}
                confirmLogout={handleLogoutAllDevices}
            />
            <div className="flex items-center  space-x-4">
                <Avatar shape="square" size={64} icon={<UserOutlined />} />
                <div>
                    <h2 className="text-lg font-medium">{userFromLocalStorage?.UserName}</h2>
                    <p className="text-gray-500 text-sm">{t('850000086')} {userFromLocalStorage?.UserId}</p>
                </div>
            </div>

            <div className="mt-6">
                <h3 className="text-md font-semibold text-gray-700">{t('850000087')}</h3>
                <List className="mt-3">
                    <List.Item>
                        <List.Item.Meta title="Email" description={userFromLocalStorage?.PwdMailAdder ?? '#########'} />
                    </List.Item>
                    <List.Item>
                        <List.Item.Meta title="Số điện thoại" description="#########" />
                    </List.Item>
                </List>
            </div>

            <div className="mt-6">
                <h3 className="text-md font-semibold text-gray-700">{t('850000088')}</h3>
                <List className="mt-3">
                    <List.Item>
                        <List.Item.Meta avatar={<UserOutlined />} title={t('850000089')} description={userFromLocalStorage?.UserId} />
                    </List.Item>
                    <List.Item
                        actions={[
                            <Button type="link" onClick={handleOpenModal}>
                                {t('850000090')}
                            </Button>,
                        ]}
                    >
                        <List.Item.Meta avatar={<LockOutlined />} title={t('850000091')} description="••••••••" />
                    </List.Item>

                    <List.Item
                        actions={[
                            <Switch
                                checked={isEmailVerificationEnabled}
                                onChange={handleToggleForceOtp}
                            />,
                        ]}
                    >
                        <List.Item.Meta
                            avatar={<MailOutlined />}
                            title={t('Xác thực qua Email')}
                            description={
                                isEmailVerificationEnabled
                                    ? t('Tính năng xác thực qua email đang được kích hoạt. Mã xác thực sẽ được gửi đến địa chỉ email của bạn khi đăng nhập.')
                                    : t('Tính năng xác thực qua email hiện đang tắt. Tài khoản không yêu cầu mã xác minh khi đăng nhập.')
                            }
                        />
                    </List.Item>
                </List>
            </div>
            <div className="mt-6">
                <h3 className="text-md font-semibold text-gray-700">{t('Devices')}</h3>
                <List className="mt-3">
                    <List.Item
                        actions={[
                            <Button onClick={checkAllLogout}> Đăng xuất khỏi tất cả các thiết bị</Button>
                        ]}
                    >
                        <List.Item.Meta
                            title={t('Đăng xuất khỏi tất cả các thiết bị')}
                            description={
                                'Đăng xuất khỏi tất cả các phiên đang hoạt động trên các thiết bị khác ngoài thiết bị này.'
                            }
                        />
                    </List.Item>
                    <Table
                        dataSource={gridData}
                        columns={columns}
                        pagination={{
                            pageSize: 3,
                            showSizeChanger: true,
                            pageSizeOptions: ['3', '5', '10'],
                        }}
                        size="small"
                    />

                </List>
            </div>




            <Modal
                title={
                    <div className="flex items-center gap-2">
                        <LockOutlined className="text-blue-500 text-lg" />
                        <span>{t('850000092')}</span>
                    </div>
                }
                open={isModalOpen}
                centered
                closable={false}
                onCancel={() => setIsModalOpen(false)}
                footer={[
                    <Button key="cancel" onClick={() => setIsModalOpen(false)}>
                        {t('850000093')}
                    </Button>,
                    <Button key="submit" type="primary" onClick={handleChangePassword}>
                        {t('850000094')}
                    </Button>,
                ]}
            >
                {/* Mô tả */}
                <div className="mb-4 p-3 bg-gray-100 rounded-md">
                    <h3 className="text-sm font-medium">{t("850000095")}</h3>
                    <p className="text-xs text-gray-600">
                        {t('850000096')}<b>{t('850000097')}</b> {t('850000098')}<b>{t('850000099')}</b> {t('850000100')}
                    </p>
                </div>

                {/* Input nhập mật khẩu */}
                <div className="space-y-4">
                    <Input.Password
                        prefix={<LockOutlined className="text-gray-400" />}
                        placeholder={t('850000101')}
                        value={oldPassword}
                        name="oldPassword"
                        autoComplete="current-password"
                        onChange={(e) => setOldPassword(e.target.value)}
                    />
                    <Input.Password
                        prefix={<LockOutlined className="text-gray-400" />}
                        placeholder={t('850000102')}
                        value={newPassword}
                        name="newPassword"
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <Input.Password
                        prefix={<LockOutlined className="text-gray-400" />}
                        placeholder={t('850000103')}
                        value={confirmPassword}
                        name="confirmPassword"
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>
                {errorPass && (
                    <div className="flex items-center justify-center mb-5 mt-5 gap-2 self-end rounded bg-red-100 p-1 text-red-600">
                        <span className="text-xs font-medium">{errorPass}</span>
                    </div>
                )}
            </Modal>

        </div>
    );
}
