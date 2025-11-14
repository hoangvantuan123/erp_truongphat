import { useState } from 'react'
import {
  Button,
  Dropdown,
  Menu,
  message,
  Input,
  Space,
  Form,
  InputNumber,
} from 'antd'
import {
  SaveOutlined,
  DeleteOutlined,
  FileDoneOutlined,
  SearchOutlined,
  FileExcelOutlined,
  FileTextOutlined,
  DownOutlined,
  ExportOutlined,
  SettingOutlined,
  TableOutlined,
} from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

export default function PdmmOutQueryDetailListAction({
  nextPage,
  nextPage2,
  debouncedFetchSLGInOutReqItemListQueryWEB,
}) {
  const { t } = useTranslation()
  const [visible, setVisible] = useState(false)
  const [inputValue, setInputValue] = useState(1)

  return (
    <div className="flex items-center gap-2">
      <Button

        type="default"
        icon={<FileDoneOutlined />}
        size="middle"
        className="uppercase"
        onClick={nextPage2}
      >
       {t('850000168')}
      </Button>
      <Button
        key="Save"
        type="primary"
        icon={<SearchOutlined />}
        size="middle"
        onClick={debouncedFetchSLGInOutReqItemListQueryWEB}
        className="uppercase"
      >
        {t('1357')}
      </Button>
    </div>
  )
}
