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
  ExportOutlined,
  SettingOutlined,
  TableOutlined,
  SearchOutlined,
  RestOutlined,
} from '@ant-design/icons'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
export default function LGLotNoMasterAction({
  handleSaveData,
  fetchDataQuery,
  setModalOpen,
}) {
  return (
    <div className="flex items-center gap-2">
      <Button
        type="primary"
        danger
        icon={<DeleteOutlined />}
        onClick={() => setModalOpen(true)}
        size="middle"
      >
        XÓA SHEET
      </Button>
      <Button
        key="save"
        type="primary"
        icon={<SaveOutlined />}
        size="middle"
        className="uppercase"
        onClick={handleSaveData}
        style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
      >
        Lưu
      </Button>
      <Button
        key="Save"
        type="primary"
        icon={<SearchOutlined />}
        size="middle"
        className="uppercase"
        onClick={fetchDataQuery}
      >
        Truy vấn
      </Button>
    </div>
  )
}
