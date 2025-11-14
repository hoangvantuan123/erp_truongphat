
import { useState } from "react";
import { useLocation, Link } from 'react-router-dom'
import { Dropdown, Menu, Avatar, Input, Badge, List, Typography } from 'antd'
import { BellOutlined, SearchOutlined, SettingOutlined, FolderOpenOutlined, LogoutOutlined, UserOutlined } from "@ant-design/icons";
const { Text } = Typography;
import { useTranslation } from 'react-i18next'
export default function BreadcrumbRouter({ menuTransForm, rootMenu }) {
  const location = useLocation()
  const { t } = useTranslation()
  const currentPath = location.pathname
  const userInfo = localStorage.getItem('userInfo')
  const parsedUserInfo = JSON.parse(userInfo)
  const [searchText, setSearchText] = useState("");
  const [filteredResults, setFilteredResults] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(false);
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);
    setOpenDropdown(true);

    if (value === "") {
      setFilteredResults([]);
      return;
    }

    let results = [];
    let isSubmenuSearch = value.startsWith(":sub");

    if (isSubmenuSearch) {
      const keyword = value.replace(":sub", "").trim();

      results = menuTransForm
        .filter(menu => menu.MenuLabel.toLowerCase().includes(keyword))
        .flatMap(menu => menu.subMenu || []);
    } else {
      results = menuTransForm
        .map((menu) => {
          const matchMain = menu.MenuLabel.toLowerCase().includes(value);
          const matchedSubMenu = menu.subMenu?.filter((sub) =>
            sub.MenuLabel.toLowerCase().includes(value)
          );

          if (matchMain || matchedSubMenu?.length) {
            return {
              ...menu,
              subMenu: matchedSubMenu || [],
            };
          }
          return null;
        })
        .filter(Boolean);
    }

    setFilteredResults(results);
  };



  const findRoute = (path, menus) => {
    for (const menu of menus) {
      if (menu.MenuLink === path) {
        return [menu]
      }
      if (menu.subMenu) {
        const subRoute = findRoute(path, menu.subMenu)
        if (subRoute) {
          return [menu, ...subRoute]
        }
      }
    }
    return null
  }

  const breadcrumbItems = currentPath
  .split('/')
  .filter(Boolean)
  .reduce((breadcrumbs, part, index, array) => {
    const path = '/' + array.slice(0, index + 1).join('/')
    const matchedRoute =
      findRoute(path, rootMenu) || findRoute(path, menuTransForm)

    if (matchedRoute) {
      const lastRoute = matchedRoute[matchedRoute.length - 1]

      breadcrumbs.push({
        path: lastRoute.MenuLink,
        breadcrumbName: t(lastRoute.LabelSeq), // <== fix ở đây
        subMenu: lastRoute.subMenu || null,
      })
    }

    return breadcrumbs
  }, [])


  breadcrumbItems.unshift({
    path: '/u/home',
    breadcrumbName: (
      <>
        <span>HOME</span>
      </>
    ),
    subMenu: null,
  })

  const renderSubMenu = (subMenu) => {
    if (!subMenu) return null

    return (
      <Menu>
        {subMenu.map((item) => (
          <Menu.Item key={item.MenuKey}>
            <a className=" uppercase" href={item.MenuLink}>
              {t(item?.LabelSeq)}
            </a>
          </Menu.Item>
        ))}
      </Menu>
    )
  }

  const menu = (
    <Menu className=" w-[250px]" >
      <Menu.Item  >
        <div className="flex flex-col justify-start items-start  gap-2">
          <span>{parsedUserInfo?.UserName || "User"}</span>
          <span className=" text-xs">ID: {parsedUserInfo?.UserId || "User"}</span>
        </div>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="profile" icon={<UserOutlined />}>
        Trang cá nhân
      </Menu.Item>
      <Menu.Item key="settings" icon={<SettingOutlined />}>
        Cài đặt
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" icon={<LogoutOutlined />} danger>
        Đăng xuất
      </Menu.Item>
    </Menu>
  );
  return (
    <div className=" p-2 uppercase text-[10px] bg-white border-b flex items-center justify-between">
      <div>
        {breadcrumbItems.map((item, index) => (
          <span key={item.path} className=" uppercase">
            {index > 0 && <span> / </span>}
            {item.subMenu ? (
              <Dropdown
                overlay={renderSubMenu(item.subMenu)}
              >
                <a className=" uppercase" >
                  {item.breadcrumbName}
                </a>
              </Dropdown>
            ) : (
              <a className=" uppercase" >
                {item.breadcrumbName}
              </a>
            )}
          </span>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <Dropdown
          overlay={
            <div className="w-[300px] bg-white border shadow-lg rounded-lg max-h-80 overflow-y-auto">
              {filteredResults.length > 0 ? (
                <List
                  size="small"
                  dataSource={filteredResults}
                  className="w-full"
                  renderItem={(menu) => (
                    <List.Item key={menu.MenuKey} className="w-full">
                      {searchText.startsWith(":sub") ? (
                        <div className="w-full cursor-pointer hover:text-blue-500">
                          <Link
                            to={menu.MenuLink}
                            onClick={() => {
                              setOpenDropdown(false);
                              setSearchText("");
                              setFilteredResults([]);
                            }}
                            className="flex items-center justify-start break-words whitespace-normal text-xs"
                          >
                            <span className="uppercase break-words whitespace-normal">
                              {menu.MenuLabel}
                            </span>
                          </Link>
                        </div>
                      ) : (
                        <div className="w-full">
                          <Text strong className=" uppercase break-words whitespace-normal flex items-center gap-2 w-full">
                            <FolderOpenOutlined /> {menu.MenuLabel}
                          </Text>
                          <List size="small" className="w-full mt-1">
                            {menu.subMenu.map((sub) => (
                              <List.Item key={sub.MenuKey} className="w-full cursor-pointer hover:text-blue-500">
                                <Link
                                  to={sub.MenuLink}
                                  onClick={() => {
                                    setOpenDropdown(false);
                                    setSearchText("");
                                    setFilteredResults([]);
                                  }}
                                  className="flex items-center justify-start break-words whitespace-normal text-xs"
                                >
                                  <span className="uppercase break-words whitespace-normal">
                                    {sub.MenuLabel}
                                  </span>
                                </Link>
                              </List.Item>
                            ))}
                          </List>
                        </div>
                      )}
                    </List.Item>
                  )}
                />
              ) : (
                <div className="text-center text-gray-500 p-2">Không tìm thấy kết quả</div>
              )}
            </div>
          }
          visible={openDropdown}
          trigger={["click"]}
          onVisibleChange={setOpenDropdown}
        >
          <div className="relative">
            <input
              placeholder="Tìm kiếm menu..."
              onChange={handleSearch}
              value={searchText}
              onClick={() => setOpenDropdown(true)}
              className="w-full py-[px] px-3  border-none border-b border-gray-300 focus:border-gray-500 focus:outline-none focus:ring-0 pe-10 sm:text-sm"
            />

            <span className="pointer-events-none absolute inset-y-0 end-0 grid w-10 place-content-center text-gray-500">
              <SearchOutlined className="text-gray-400" />
            </span>
          </div>


        </Dropdown>
      </div>

    </div>
  )
}
