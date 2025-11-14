import { useState } from 'react'
import { Button } from 'antd'
import {
  SaveOutlined,
  DeleteOutlined,
  UploadOutlined,
  SearchOutlined,
  FileTextOutlined
} from '@ant-design/icons'
import { useTranslation } from 'react-i18next'

export default function PdmpsProdReqListAction({
  fetchData,
}) {
  const { t } = useTranslation()
  return (
    <div className="flex items-center gap-2">
      <Button
        key="Save"
        icon={<FileTextOutlined />}
        size="middle"
        className="uppercase"
      >
        {t('2509')}
      </Button>
      <Button
        key="Save"
        icon={<FileTextOutlined />}
        size="middle"
        className="uppercase"
      >
        {t('10040110')}
      </Button>
      <Button
        key="Save"
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
