import { useState } from 'react'
import { Button, Dropdown, message, Menu } from 'antd'
import {
  SaveOutlined,
  FileDoneOutlined,
  LockOutlined,
  UnlockOutlined,
  SearchOutlined,
  DeleteOutlined,
  UserOutlined,
  FileExcelOutlined,
  FileTextOutlined,
  DownOutlined,
} from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
export default function UserManagementActions({
  handleSearch,
  handleUpdatePassUsers,
  data,
  handleSaveData, 
  handleDeleteDataSheet
}) {
  const { t } = useTranslation()
  
 

  const handleMenuClick = (e) => {
    switch (e.key) {
      case 'csv':
        exportCSV()
        break
      case 'excel':
        exportExcel()
        break
      case 'json':
        exportJSON()
        break
      case 'updatePass':
        handleUpdatePassUsers()
        break
      case 'delete':
        handleDeleteDataSheet()
        break
      default:
        message.info(`Chức năng này đang phát triển`)
    }
  }

  const menu = (
    <Menu onClick={handleMenuClick} className="w-auto">
      
      <Menu.Item key="updatePass" icon={<LockOutlined />}>
        Đặt lại mật khẩu mặc định
      </Menu.Item>
   
      <Menu.Item key="delete" icon={<DeleteOutlined />} danger>
        Xóa
      </Menu.Item>
    </Menu>
  )

  return (
    <div className="flex items-center gap-2">
      <Dropdown overlay={menu}>
        <Button>
          Actions <DownOutlined />
        </Button>
      </Dropdown>

      <Button
        icon={<FileDoneOutlined />}
        size="middle"
        className="uppercase"
        type="default"
        onClick={handleSaveData}
      >
        Lưu
      </Button>

      <Button
        key="Save"
        type="primary"
        icon={<SearchOutlined />}
        size="middle"
        onClick={handleSearch}
        className="uppercase"
      >
        SEARCH
      </Button>
    </div>
  )
}
