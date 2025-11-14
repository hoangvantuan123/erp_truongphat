import { useState } from 'react'
import {
  Button,
  Dropdown,
  Menu,
  message,
  Input,
  Space,
  Form,
  InputNumber,
} from 'antd'
import {
  SaveOutlined,
  PlusOutlined,
  FileDoneOutlined,
  DeleteOutlined,
  FileExcelOutlined,
  FileTextOutlined,
  DownOutlined,
  SettingOutlined,
} from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

export default function RootMenuManagementActions({
  setClickCount,
  handleDeleteDataSheet,
  data,
  handleSaveData,
  setNumRowsToAdd,
  numRowsToAdd,
}) {
  const { t } = useTranslation()
  const [visible, setVisible] = useState(false)
  const [inputValue, setInputValue] = useState(1)

  const handleInputChange = (e) => {
    setNumRowsToAdd(e.target.value)
  }
  // Hàm xuất CSV
  const exportCSV = () => {
    const worksheet = XLSX.utils.json_to_sheet(data)
    const csv = XLSX.utils.sheet_to_csv(worksheet)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    saveAs(blob, 'rootmenu.csv')
  }

  // Hàm xuất Excel
  const exportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')
    const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    })
    saveAs(blob, 'rootmenu.xlsx')
  }

  // Hàm xuất JSON
  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    })
    saveAs(blob, 'rootmenu.json')
  }

  // Xử lý click menu
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
      case 'delete':
        handleDeleteDataSheet()
        break
      default:
        message.info(`Chức năng này đang phát triển`)
    }
  }
  const handleClick = () => {
    setClickCount((prevCount) => prevCount + 1)
  }

  const menu = (
    <Menu onClick={handleMenuClick} className=" w-40">
      <Menu.SubMenu key="export" title="Export">
        <Menu.Item key="csv" icon={<FileTextOutlined />}>
          CSV Export
        </Menu.Item>
        <Menu.Item key="excel" icon={<FileExcelOutlined />}>
          Excel Export
        </Menu.Item>
        <Menu.Item key="json" icon={<FileTextOutlined />}>
          JSON Export
        </Menu.Item>
      </Menu.SubMenu>
      <Menu.Item key="delete" icon={<DeleteOutlined />} danger>
        Xóa
      </Menu.Item>
    </Menu>
  )

  const handleAddRows = () => {
    if (inputValue && !isNaN(inputValue) && inputValue > 0) {
      setNumRowsToAdd(inputValue)
    }
  }

  const handleSave = () => {
    handleAddRows()
    setVisible(false)
  }

  const handleCancel = () => {
    setVisible(false)
  }
  const rowMenu = (
    <div className=" bg-white  border rounded-lg p-3 w-80">
      <Form layout="vertical">
        <Form.Item label="Enter number of rows">
          <InputNumber
            min={1}
            value={inputValue}
            onChange={(value) => setInputValue(value)}
            style={{
              width: '100%',
              borderRadius: '5px',
            }}
          />
        </Form.Item>
        <Space style={{ width: '100%' }} justify="space-between">
          <Button onClick={() => setVisible(false)}>Cancel</Button>
          <Button
            type="primary"
            onClick={handleSave}
            style={{
              backgroundColor: '#4F46E5',
              borderColor: '#4F46E5',
            }}
          >
            Save
          </Button>
        </Space>
      </Form>
    </div>
  )
  return (
    <div className="flex items-center gap-2">
      <Dropdown overlay={menu}>
        <Button>
          <SettingOutlined /> Actions
        </Button>
      </Dropdown>

      <Dropdown
        overlay={rowMenu}
        trigger={['click']}
        placement="bottomRight"
        visible={visible}
        onVisibleChange={(visible) => setVisible(visible)}
      >
        <Button
          key="Save"
          type="primary"
          icon={<PlusOutlined />}
          size="middle"
          style={{ backgroundColor: '#4F46E5', borderColor: '#4F46E5' }}
        >
          ADD ROWS
        </Button>
      </Dropdown>
      <Button
        key="save"
        type="primary"
        icon={<SaveOutlined />}
        size="middle"
        className="uppercase"
        onClick={handleSaveData}
        style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
      >
        Save
      </Button>
    </div>
  )
}
