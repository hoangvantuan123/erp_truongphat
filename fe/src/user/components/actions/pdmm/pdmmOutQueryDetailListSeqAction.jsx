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
  FileSearchOutlined,
  ReloadOutlined,
} from '@ant-design/icons'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import { useTranslation } from 'react-i18next'
export default function PdmmOutQueryDetailListSeqAction({
  status,
  handleSaveData,
  handleResetData,
  setModalMasterDeleteOpen,
  setModalOpen,
  handleOpenLogs,
  handleOpenCheckLogsScan
}) {
  const { t } = useTranslation()
  return (
    <div className="flex items-center gap-2">
      {status ? (
        <>
          <span className="inline-flex items-center justify-center rounded-lg w-20 bg-emerald-100 px-5 py-[6px] text-emerald-700">
            <p className="whitespace-nowrap text-sm">LIVE</p>
          </span>
        </>
      ) : (
        <>
          <span className="inline-flex items-center justify-center rounded-lg w-20 bg-red-100 px-5 py-[6px] text-red-700">
            <p className="whitespace-nowrap text-sm">OFF</p>
          </span>
        </>
      )}
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
        icon={<FileSearchOutlined />}
        size="middle"
        className="uppercase"
        onClick={handleOpenLogs}
      >
        {t('Check Logs Scan')}
      </Button>
      <Button
        icon={<FileSearchOutlined />}
        size="middle"
        className="uppercase"
        onClick={handleOpenCheckLogsScan}
      >
        {t('Trạng thái Scan')}
      </Button>
      <Button
        type="primary"
        danger
        icon={<DeleteOutlined />}
        onClick={() => setModalMasterDeleteOpen(true)}
        size="middle"
      >
        {t('308')}
      </Button>
      <Button
        type="primary"
        danger
        icon={<ScissorOutlined />}
        onClick={() => setModalOpen(true)}
        size="middle"
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
