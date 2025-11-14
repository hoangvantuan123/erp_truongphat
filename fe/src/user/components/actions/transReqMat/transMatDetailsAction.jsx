import { useState } from 'react'
import { Button } from 'antd'
import {
  SaveOutlined,
  DeleteOutlined,
  UploadOutlined,
  SearchOutlined,
} from '@ant-design/icons'
import { useTranslation } from 'react-i18next';

export default function TransMatDetailsAction({
  fetchData,
  nextPageTransReqMat,
  isAPISuccess,
}) {
  const { t } =  useTranslation();
  return (
    <div className="flex items-center gap-2">
      <Button
        key="Reset"
        type="default"
        icon={<SaveOutlined />}
        size="middle"
        className="uppercase"
        color="default"
        variant="filled"
        style={{ backgroundColor: '#f0f0f0', borderColor: '#d9d9d9' }}
        onClick={nextPageTransReqMat}
      >
        {t('Xử lý di chuyển vật liệu')}
      </Button>

      <Button
        key="Reset"
        type="default"
        icon={<SaveOutlined />}
        size="middle"
        className="uppercase"
        color="default"
        variant="filled"
        style={{ backgroundColor: '#f0f0f0', borderColor: '#d9d9d9' }}
        onClick={nextPageTransReqMat}
      >
        {t('Xử lý tạm dừng')}
      </Button>

      <Button
        key="Save"
        type="primary"
        icon={<SearchOutlined />}
        size="middle"
        className="uppercase"
        onClick={fetchData}
      >
        SEARCH
      </Button>
    </div>
  )
}
