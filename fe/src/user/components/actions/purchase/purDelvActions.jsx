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
export default function PurDelvActions({
  handleSaveData,
  setModalMasterDeleteOpen,
  setModalOpen,
}) {
  const { t } = useTranslation()
  return (
    <div className="flex items-center gap-2">
      <Button
        type="primary"
        danger
        icon={<DeleteOutlined />}
        onClick={() => setModalMasterDeleteOpen(true)}
        size="middle"
        className="uppercase"
      >
        {t('308')}
      </Button>
      <Button
        type="primary"
        danger
        icon={<ScissorOutlined />}
        onClick={() => setModalOpen(true)}
        size="middle"
        className="uppercase"
      >
        {t('14207')}
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
        {t('55168')}
      </Button>
    </div>
  )
}
