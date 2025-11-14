import { useState } from 'react'
import { Button } from 'antd'
import {
  SaveOutlined,
  DeleteOutlined,
  UploadOutlined,
  SearchOutlined,
} from '@ant-design/icons'
import { useTranslation } from 'react-i18next'

export default function PdsfcWorkReportAction({
  fetchData,
  handleSave,
  handleDeleteDataSheet,
  handleSearch
}) {
  const { t } = useTranslation()
  return (
    <div className="flex items-center gap-2">
      <Button
        icon={<SaveOutlined />}
        size="middle"
        onClick={handleSave}
        className="uppercase"
      >
        {t('850000003')}
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
        icon={<SearchOutlined />}
        size="middle"
        className="uppercase"
        onClick={handleSearch}
      >
        {t('Truy vấn')}
      </Button>

    </div>
  )
}
