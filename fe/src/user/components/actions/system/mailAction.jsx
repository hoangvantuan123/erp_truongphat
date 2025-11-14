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

export default function MailAction({
  fetchData,
  handleSaveData,
  handleDelete
}) {
  const { t } = useTranslation()
  return (
    <div className="flex items-center gap-2">
      <Button
        icon={<DeleteOutlined />}
        size="middle"
        className="uppercase"
        onClick={handleDelete}
      >
        {t('850000068')}
      </Button>
      <Button
        type="primary"
        icon={<SaveOutlined />}
        size="middle"
        className="uppercase"
        onClick={handleSaveData}
        style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
      >
        Save
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
