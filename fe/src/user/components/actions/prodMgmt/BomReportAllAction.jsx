import { useState } from 'react'
import { Button } from 'antd'
import {
  SaveOutlined,
  DeleteOutlined,
  UploadOutlined,
  SearchOutlined,
} from '@ant-design/icons'
import { useTranslation } from 'react-i18next'

export default function BomReportAllAction({
  fetchData,
}) {
  const { t } = useTranslation()
  return (
    <div className="flex items-center gap-2">
      <Button
        key="Save"
        type="primary"
        icon={<SearchOutlined />}
        size="middle"
        className="uppercase"
        onClick={fetchData}
      >
        {t('850000005')}
      </Button>
    </div>
  )
}
