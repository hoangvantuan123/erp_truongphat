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
  PrinterOutlined
} from '@ant-design/icons'
import { useTranslation } from 'react-i18next'

export default function PdmmOutExtraAction({
  handleSave,
  newFrom,
  handleDeleteDataSheet,
  handleDelete,
  handleCheckOutReqItem,
  handleOnClickPrint
}) {
  const { t } = useTranslation()
  return (
    <div className="flex items-center gap-2">
      <Button
        icon={<PrinterOutlined />}
        size="middle"
        className="uppercase"
        onClick={handleOnClickPrint}
      >
        {t('850000166')}
      </Button>
      <Button
        icon={<CheckCircleOutlined />}
        size="middle"
        className="uppercase"
        onClick={handleCheckOutReqItem}
      >
        {t('29598')}
      </Button>

      <Button
        danger
        icon={<ScissorOutlined />}
        size="middle"
        className="uppercase"
        onClick={handleDeleteDataSheet}

      >
        {t('850000068')}
      </Button>
      <Button
        type="primary"
        danger
        icon={<DeleteOutlined />}
        size="middle"
        className="uppercase"
        onClick={handleDelete}

      >
        {t('308')}
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
