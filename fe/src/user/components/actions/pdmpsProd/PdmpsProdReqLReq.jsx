import { useState } from 'react'
import { Button } from 'antd'
import {
  SaveOutlined,
  DeleteOutlined,
  UploadOutlined,
  SearchOutlined,
  FileAddOutlined,
} from '@ant-design/icons'
import { useTranslation } from 'react-i18next'

export default function PdmpsProdReqLReqAction({
  handleSave,
  newFrom,
  handleDeleteDataSheet,
}) {
  const { t } = useTranslation()
  return (
    <div className="flex items-center gap-2">
      <Button

        type="primary"
        icon={<DeleteOutlined />}
        size="middle"
        className="uppercase"
        onClick={handleDeleteDataSheet}
        style={{ backgroundColor: '#ff4d4f', borderColor: '#ff4d4f' }}
      >
        {t('850000068')}
      </Button>
      <Button

        type="primary"
        icon={<FileAddOutlined />}
        size="middle"
        className="uppercase"
        onClick={newFrom}
      >
        {t('850000072')}
      </Button>
      <Button
        type="primary"
        icon={<SaveOutlined />}
        size="middle"
        className="uppercase"
        onClick={handleSave}
      >
        {t('850000003')}
      </Button>
    </div>
  )
}
