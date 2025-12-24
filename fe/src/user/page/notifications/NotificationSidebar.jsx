import { Divider, Badge } from 'antd';
import {
  InboxOutlined,
  BellOutlined,
  StarOutlined,
  MailOutlined,
  SettingOutlined
} from '@ant-design/icons';

const MenuItem = ({ item, isActive, onClick }) => (
  <div
    className={`flex items-center justify-between p-2 rounded cursor-pointer text-sm ${
      isActive
        ? 'bg-blue-100 text-blue-700 font-medium'
        : 'hover:bg-gray-100 text-gray-700'
    }`}
    onClick={onClick}
  >
    <div className="flex items-center flex-1 min-w-0">
      <span className={`mr-2 ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
        {item.icon}
      </span>
      <span className="truncate">{item.label}</span>
    </div>
    {item.count > 0 && (
      <Badge
        count={item.count}
        size="small"
        className="ml-1"
        style={{
          backgroundColor: isActive ? '#1890ff' : '#6b7280',
          fontSize: '10px',
          minWidth: '18px',
          height: '18px',
          lineHeight: '18px'
        }}
      />
    )}
  </div>
);

const NotificationSidebar = ({ activeMenu, onMenuChange, onNotificationSelect }) => {
  const mainMenuItems = [
    { key: 'inbox', label: 'Hộp thư đến', icon: <InboxOutlined />, count: 0 },
    /* { key: 'unread', label: 'Chưa đọc', icon: <BellOutlined />, count: 2 },
    { key: 'important', label: 'Quan trọng', icon: <StarOutlined />, count: 1 }, */
  ];

  const repoMenus = [
  /*   { key: '1', label: 'Thông báo hợp đồng', icon: <MailOutlined />, count: 2 },
    { key: '2', label: 'Thông báo NVL hết hạn', icon: <MailOutlined />, count: 3 }, */
  ];

  const securityItems = [
    { key: 'setting', label: 'Cài đặt', icon: <SettingOutlined />, count: 0 },
  ];

  const handleMenuClick = (menuKey) => {
    onMenuChange(menuKey);
    onNotificationSelect(null);
  };

  return (
    <div className="w-64 flex-shrink-0 border-r border-gray-200 bg-gray-50 h-screen overflow-y-auto">
      <div className="p-3">
        {/* Main Menu */}
        <div className="mb-4">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            THÔNG BÁO
          </h3>
          <div className="space-y-1">
            {mainMenuItems.map(item => (
              <MenuItem
                key={item.key}
                item={item}
                isActive={activeMenu === item.key}
                onClick={() => handleMenuClick(item.key)}
              />
            ))}
          </div>
        </div>

       {/*  <Divider className="my-3" />
 */}
        {/* Repository Menus */}
      {/*   <div className="mb-4">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            THƯ
          </h3>
          <div className="space-y-1">
            {repoMenus.map(item => (
              <MenuItem
                key={item.key}
                item={item}
                isActive={activeMenu === item.key}
                onClick={() => handleMenuClick(item.key)}
              />
            ))}
          </div>
        </div> */}
{/* 
        <Divider className="my-3" /> */}

        {/* Security */}
    {/*     <div className="mb-4">
          <div className="space-y-1">
            {securityItems.map(item => (
              <MenuItem
                key={item.key}
                item={item}
                isActive={activeMenu === item.key}
                onClick={() => handleMenuClick(item.key)}
              />
            ))}
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default NotificationSidebar;