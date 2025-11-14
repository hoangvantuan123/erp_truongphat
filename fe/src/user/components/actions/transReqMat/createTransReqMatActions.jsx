import { useState } from 'react'
import { Button } from 'antd'
import {
  SaveOutlined,
  DeleteOutlined,
  UploadOutlined,
  SearchOutlined,
  PrinterOutlined,
} from '@ant-design/icons'
import { useTranslation } from 'react-i18next';

export default function CreateTransReqMatActions({
  onClickOpenConfirm,
  handleRowAppend,
  isAPISuccess,
  onClickTransReqPrint,
  onClickOpenCke5,
}) {
  const { t } = useTranslation();
  const [inputValue, setInputValue] = useState(1)

  const handleAddRows = () => {
    if (inputValue && !isNaN(inputValue) && inputValue > 0) {
      handleRowAppend(inputValue)
    }
  }

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
      >
        {t('Reset')}
      </Button>
      <Button
        key="Reset"
        type="default"
        icon={<PrinterOutlined />}
        size="middle"
        className="uppercase"
        color="default"
        variant="filled"
        style={{ backgroundColor: '#f0f0f0', borderColor: '#d9d9d9' }}
        onClick={onClickTransReqPrint}
      >
        {t('Yêu cầu di chuyển')}
      </Button>
      <Button
        key="Save"
        type="primary"
        icon={<SearchOutlined />}
        size="middle"
        className="uppercase"
        onClick={onClickOpenConfirm}
      >
        {t('Lưu')}
      </Button>
      <Button
        key="print"
        type="primary"
        icon={<SearchOutlined />}
        size="middle"
        className="uppercase"
        onClick={onClickOpenCke5}
      >
        {t('Cấu hình bản in')}
      </Button>
    </div>
  )
}
