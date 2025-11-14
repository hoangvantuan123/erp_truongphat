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
  ScissorOutlined,
  SearchOutlined,
  RestOutlined,
  ReloadOutlined,
} from '@ant-design/icons'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import { useTranslation } from 'react-i18next'
export default function LGEtcInReqActions({
  handleSaveData,
  handleResetData,
  setModalMasterDeleteOpen,
  setModalOpen,
}) {
  const { t } = useTranslation()
  return (
    <div className="flex items-center gap-2">
      <Button
        type="primary"
        icon={<ReloadOutlined />}
        size="middle"
        className="uppercase"
        onClick={handleResetData}
      >
        {t('10041836')}
      </Button>
      <Button
        type="primary"
        danger
        icon={<DeleteOutlined />}
        onClick={() => setModalMasterDeleteOpen(true)}
        size="middle"
      >
        XÓA
      </Button>
      <Button
        type="primary"
        danger
        icon={<ScissorOutlined />}
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
    </div>
  )
}
