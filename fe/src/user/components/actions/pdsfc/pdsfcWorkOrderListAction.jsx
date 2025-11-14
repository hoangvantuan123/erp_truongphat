import { useState } from 'react'
import { Button } from 'antd'
import {
  SaveOutlined,
  DeleteOutlined,
  UploadOutlined,
  FileSearchOutlined,
  SearchOutlined,
} from '@ant-design/icons'
import { useTranslation } from 'react-i18next'

export default function PdsfcWorkOrderListAction({
  fetchData,
  nextPage
}) {
  const { t } = useTranslation()
  return (
    <div className="flex items-center gap-2">
      <Button
        icon={<FileSearchOutlined />}
        size="middle"
        className="uppercase"
        onClick={nextPage}
      >
        {t('60391')}
      </Button>
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
