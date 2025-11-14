import { useState } from 'react'
import { Button } from 'antd'
import {
  SaveOutlined,
  DeleteOutlined,
  UploadOutlined,
  SearchOutlined,
  FileAddOutlined,
  CheckCircleOutlined,
  ScissorOutlined,
  SnippetsOutlined,
  FileDoneOutlined
} from '@ant-design/icons'
import { useTranslation } from 'react-i18next'

export default function PdmmOutQueryListAction({
  fetchData,
  nextPage,
  nextPage2
}) {
  const { t } = useTranslation()
  return (
    <div className="flex items-center gap-2">

      <Button
        icon={<SnippetsOutlined />}
        size="middle"
        className="uppercase"
        onClick={nextPage}
      >
        {t('2511')}
      </Button>
      
      <Button
        type="primary"
        icon={<SearchOutlined />}
        size="middle"
        className="uppercase"
        onClick={fetchData}
      >
        {t('1357')}
      </Button>
    </div>
  )
}
