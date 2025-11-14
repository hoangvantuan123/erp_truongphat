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
        icon={<SearchOutlined />}
        size="middle"
        className="uppercase"
        onClick={fetchDataQuery}
      >
        Truy vấn
      </Button>

      <Button
        icon={<SaveOutlined />}
        size="middle"
        className="uppercase"
        onClick={handleSaveData}
      >
        Lưu
      </Button>


      <Button
        icon={<DeleteOutlined />}
        onClick={() => setModalOpen(true)}
        size="middle"
      >
        XÓA SHEET
      </Button>
    </div>
  )
}
