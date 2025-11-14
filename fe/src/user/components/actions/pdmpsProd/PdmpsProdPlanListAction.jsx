import { useState } from 'react'
import { Button } from 'antd'
import {
  SaveOutlined,
  DeleteOutlined,
  SnippetsOutlined,
  SearchOutlined,
} from '@ant-design/icons'
import { useTranslation } from 'react-i18next'

export default function PdmpsProdPlanListAction({
  fetchData,
  nextPage
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
        {t('2509')}
      </Button>
      <Button
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
