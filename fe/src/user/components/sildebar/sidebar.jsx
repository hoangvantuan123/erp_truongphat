import {
  Layout,
  Menu,
  Typography,
  Checkbox,
  Dropdown,
  Button,
  Tooltip,
  Badge,
  Avatar,
  Divider,
  List,
  Popover,
  Empty,

} from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import { useState, useEffect, useCallback } from 'react'
import SidebarContent from './styled/toggleSidebar'
import Logo from '../../../assets/192.png'
import { useTranslation } from 'react-i18next'
import {
  SettingOutlined,
  SearchOutlined,
  AppstoreOutlined,
  AppstoreAddOutlined,
  UserOutlined,
  PlusOutlined,
  FolderOpenOutlined,
  FolderOutlined,
  BellOutlined,
  LogoutOutlined
} from '@ant-design/icons'
import { SettingIcon, FileMenuIcon, LogoutIcon } from './icon'
import { iconMapping } from './dataMenu'
import Cookies from 'js-cookie'
const { Sider, Footer } = Layout
const { SubMenu } = Menu
const { Title, Text } = Typography
const menuStyle = { borderInlineEnd: 'none' }
import './static/css/scroll_container.css'
import ModalLogout from '../modal/logout/modalLogout'
import ModalSetting from '../modal/setting/modalSetting'
import { getSocket } from '../../../services/socket'
import { deviceId } from '../../../services/tokenService'
const Sidebar = ({ permissions, rootMenu, menuTransForm, setCollapsed, collapsed, handleCancelRequest }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const userFromLocalStorage = JSON.parse(localStorage.getItem('userInfo'))
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [openSetting, setOpenSetting] = useState(false)
  const [selectedItems, setSelectedItems] = useState(() => {
    const storedSelections =
      JSON.parse(localStorage.getItem('selectedMenuItems')) || []
    return storedSelections
  })

  const [isMobile, setIsMobile] = useState(false)
  const [menu, setMenu] = useState(() => {
    const savedMenuState = localStorage.getItem('menu')
    return savedMenuState ? JSON.parse(savedMenuState) : true
  })

  const [isMenu, setIsMenu] = useState(localStorage.getItem('isMenu') || null)
  const [labelMenu, setLabelMenu] = useState(
    localStorage.getItem('labelMenu') || null,
  )
  const [logoutDrawerVisible, setLogoutDrawerVisible] = useState(false)
  const [menuVisible, setMenuVisible] = useState(false)
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState(
    sessionStorage.getItem('current_action_phone'),
  )
  const [currentAction, setCurrentAction] = useState(
    sessionStorage.getItem('current_action'),
  )

  const toggleSidebar = () => {
    setCollapsed((prevState) => {
      const newState = !prevState
      localStorage.setItem('COLLAPSED_STATE', JSON.stringify(newState))
      return newState
    })
  }

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768)
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const handleonclickMenu = (e) => {
    setIsMenu(e.RootMenuKey)
    setLabelMenu(e.LabelSeq)
    localStorage.setItem('isMenu', e.RootMenuKey)
    localStorage.setItem('labelMenu', e.LabelSeq)
    localStorage.setItem('menu', false)
    setCollapsed(false)
    setMenu(!menu)
  }

  if (location.pathname === '/u/login') {
    return null
  }

  const handleOnClickMenuItem = (e) => {
    sessionStorage.setItem('current_action', e.key)
    setCurrentAction(e.key)
  }

  const handleOnClickMenuItemPhone = (e) => {
    sessionStorage.setItem('current_action_phone', e)
    setActiveTab(e)
  }

  const handleOnClickMenu = () => {
    setMenu(!menu)
    localStorage.setItem('menu', false)
  }
  const handleOnClickMenuFast = (e) => {
    setIsMenu(e.RootMenuKey)
    setLabelMenu(e.LabelSeq)
    localStorage.setItem('isMenu', e.RootMenuKey)
    localStorage.setItem('labelMenu', e.LabelSeq)
    setCollapsed(false)
    localStorage.setItem('COLLAPSED_STATE', false)
  }

  const handleCheckboxChange = (e, itemKey) => {
    const newSelectedItems = e.target.checked
      ? [...selectedItems, itemKey]
      : selectedItems.filter((key) => key !== itemKey)
    setSelectedItems(newSelectedItems)

    localStorage.setItem('selectedMenuItems', JSON.stringify(newSelectedItems))
    setMenuVisible(false)
  }

  const openModalShowLogout = () => {
    setLogoutDrawerVisible(true)
  }

  const openModalShowSeeting = () => {
    setOpenSetting(true)
  }
  const confirmLogout = useCallback(async () => {
    const socket = getSocket();

    socket.once('disconnect', () => {
      console.log('🔌 Socket disconnected');
      navigate('/u/login');
    });

    socket.disconnect();

    Cookies.remove('a_a');
    localStorage.removeItem('userInfo');
    localStorage.removeItem('rolesMenu');

    navigate('/u/login');
  }, []);



  const shortcutMenuItems = rootMenu
    .filter((item) => item.View === true)
    .map((item) => ({
      key: item.RootMenuKey,
      label: (
        <Checkbox
          checked={selectedItems.includes(item.RootMenuKey)}
          onChange={(e) => handleCheckboxChange(e, item.RootMenuKey)}
        >
          <span className="ml-3 uppercase">{t(item.LabelSeq)}</span>
        </Checkbox>
      )
    }))

  const shortcutMenu = { items: shortcutMenuItems }


  const menuUser = (
    <Menu className=" w-[250px]" >
      <Menu.Item  >
        <div className="flex flex-col justify-start items-start  gap-2">
          <span>{userFromLocalStorage?.UserName || "User"}</span>
          <span className=" text-xs">ID: {userFromLocalStorage?.UserId || "User"}</span>
        </div>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="profile" icon={<UserOutlined />}>
        {t('850000075')}
      </Menu.Item>
      <Menu.Item key="settings" icon={<SettingOutlined />} onClick={openModalShowSeeting}>
        {t('850000073')}
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item onClick={openModalShowLogout} key="logout" icon={<LogoutOutlined />} danger>
        {t('850000074')}
      </Menu.Item>
    </Menu>
  );
  return (
    <>
      <ModalSetting

        setModalOpen={setOpenSetting}
        modalOpen={openSetting}
      />
      <ModalLogout
        setModalOpen={setLogoutDrawerVisible}
        modalOpen={logoutDrawerVisible}
        confirmLogout={confirmLogout}
      />
      {!isMobile ? (
        <div className="flex border-t">
          <div className="flex h-screen w-16 flex-col justify-between border-e bg-white">
            <div>
              <Link to="/u/home">
                <div className="inline-flex size-16 items-center justify-center">
                  <img
                    src={Logo}
                    className=" w-10 cursor-pointer p-2   border rounded-lg h-auto  "
                  />
                </div>
              </Link>

              <div className="border-t border-gray-100">
                <div className="px-2">
                  <div className="py-4">
                    <a
                      onClick={handleOnClickMenu}
                      className="group relative flex justify-center rounded px-2 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                    >
                      <AppstoreAddOutlined style={{ fontSize: '20px' }} />
                    </a>
                  </div>

                  <ul className="space-y-1 border-t border-gray-100 pt-4">
                    {rootMenu
                      .map((item) => {
                        if (item.View === true) {
                          return item.RootMenuUtilities ? (
                            <li key={item.RootMenuKey}>
                              <Tooltip title={t(item?.LabelSeq)} placement="right">
                                <a
                                  onClick={() => handleOnClickMenuFast(item)}
                                  className="group relative flex justify-center rounded-md px-2 py-2 border mb-2 text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                                >
                                  {iconMapping[item.RootMenuIcon]}
                                </a>
                              </Tooltip>
                            </li>
                          ) : null
                        }
                        return null
                      })}

                 {/*    <li>
                      <Dropdown
                        menu={shortcutMenu}
                        placement="bottomLeft"
                        visible={menuVisible}
                        trigger={['click']}
                        onVisibleChange={(flag) => setMenuVisible(flag)}
                      >
                        <a className="group relative flex justify-center  rounded-lg px-2 py-2 border mb-2 text-gray-500 hover:bg-gray-50 hover:text-gray-700">
                          <PlusOutlined style={{ fontSize: '20px' }} />
                        </a>
                      </Dropdown>
                    </li> */}
                  </ul>
                </div>
              </div>
            </div>

            <div className="sticky  gap-3 flex-col inset-x-0 bottom-0 border-t border-gray-100 bg-white p-2 flex justify-between items-center">
              <div className='mt-2'>
                <Badge count={0} overflowCount={99} size="large">
                  <BellOutlined className="text-xl cursor-pointer hover:text-gray-700" />
                </Badge>
              </div>
              {/* Avatar */}
              <Dropdown overlay={menuUser} trigger={['click']} placement="bottomRight">
                <div className='border p-2 rounded-lg'>
                  <Avatar
                    size="small"
                    icon={<UserOutlined />}
                    className="cursor-pointer hover:opacity-80"
                  />
                </div>


              </Dropdown>


            </div>

          </div>
          {menu && (
            <Sider
              width={350}
              theme="light"
              className="p-1 border-r h-screen overflow-auto scroll-container "
            >
              <SidebarContent collapsed={collapsed} toggleSidebar={handleOnClickMenu} />
              <div className="mb-5"></div>
              <Text className=" font-medium opacity-60 text-xs">MENU</Text>

              <Menu
                style={menuStyle}
                mode="inline"
                defaultSelectedKeys={[`${currentAction}`]}
                className="border-r-0"
                onClick={(e) => handleOnClickMenuItem(e)}
              >
                {rootMenu.map(
                  (item) =>
                    item.View === true && (
                      <Menu.Item key={item.RootMenuKey}>
                        <Link
                          onClick={() => handleonclickMenu(item)}
                          className="flex items-center justify-start text-xs"
                        >
                          {iconMapping[item?.RootMenuIcon]}
                          <span className="ml-3 uppercase">{t(item?.LabelSeq)}</span>
                        </Link>
                      </Menu.Item>
                    )
                )}
              </Menu>
            </Sider>
          )}

          {isMenu !== null && (
            <Sider
              width={350}
              theme="light"
              collapsed={collapsed}
              collapsedWidth={0}
              onCollapse={toggleSidebar}
              className={`${collapsed ? 'p-0 border-none' : 'p-2 border-r'
                } h-screen overflow-auto scroll-container transition-all duration-300 ease-in-out`}
            >
              <SidebarContent collapsed={collapsed} toggleSidebar={toggleSidebar} />
              <div className="mb-5"></div>
              {!collapsed && (
                <Text className=" font-medium opacity-60 uppercase text-xs" >{t(labelMenu)}</Text>
              )}

              <Menu
                style={menuStyle}
                mode="inline"
                defaultSelectedKeys={[`${currentAction}`]}
                className="border-r-0"
                onClick={(e) => handleOnClickMenuItem(e)}
              >
                {menuTransForm
                  .sort((a, b) => a.OrderSeq - b.OrderSeq)
                  .map((item) => {
                    if (item?.MenuKey === isMenu && item?.View === true) {
                      if (item?.MenuType === 'submenu') {
                        return (
                          <Menu.SubMenu
                            key={item.Id}

                            title={
                              <span className="flex items-center justify-start text-xs">
                                <FolderOpenOutlined style={{ fontSize: '20px' }} />
                                <span className="ml-3 uppercase break-words whitespace-normal">
                                  {t(item?.LabelSeq)}
                                </span>
                              </span>
                            }
                          >
                            {item.subMenu
                              ?.filter((subItem) => subItem?.View === true)
                              .sort((a, b) => a.OrderSeq - b.OrderSeq)
                              .map((subItem) => (
                                <Menu.Item key={subItem.MenuKey}>
                                  <Link
                                    to={subItem.MenuLink}
                                    className="flex items-center justify-start break-words whitespace-normal text-xs"
                                  >
                                    <span className="uppercase break-words whitespace-normal">
                                      {t(subItem.LabelSeq)}
                                    </span>
                                  </Link>
                                </Menu.Item>
                              ))}
                          </Menu.SubMenu>
                        )
                      } else if (item?.MenuType === 'menu') {
                        return (
                          <Menu.Item key={item.Id}>
                            <Link
                              to={item.MenuLink}
                              className="flex items-center justify-start break-words whitespace-normal"
                            >
                              <FolderOutlined style={{ fontSize: '18px' }} />
                              <span className="ml-3 uppercase break-words whitespace-normal">
                                {t(item.LabelSeq)}
                              </span>
                            </Link>
                          </Menu.Item>
                        )
                      }
                    }
                    return null
                  })}
              </Menu>
            </Sider>
          )}
        </div>
      ) : (
        <Footer className="fixed bottom-0 z-50 w-full bg-white border-t-[1px] border-b-0 pt-3 pb-7 p-0">
        </Footer>
      )}
    </>
  )
}

export default Sidebar