import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Dropdown, Menu, message, Input, Space, Form, InputNumber } from 'antd'
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
  SearchOutlined
} from '@ant-design/icons'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
export default function LangSysActions({
  fetchData, handleSaveData,
  handleDeleteDataSheet,
  fetchDataDictSys,
  handleSearch
}) {
  const { t } = useTranslation()
  return (
    <div className="flex items-center gap-2">
      <Button
        icon={<SearchOutlined />}
        size="middle"
        className="uppercase"
        onClick={handleSearch}
      >
        {t('850000005')}
      </Button>
      <Button
        icon={<DeleteOutlined />}
        size="middle"
        className="uppercase"
        onClick={handleDeleteDataSheet}
      >
        {t('850000068')}
      </Button>
      <Button
        icon={<SaveOutlined />}
        size="middle"
        className="uppercase"
        onClick={handleSaveData}
      >
        {t('850000003')}
      </Button>

    </div>
  )
}
