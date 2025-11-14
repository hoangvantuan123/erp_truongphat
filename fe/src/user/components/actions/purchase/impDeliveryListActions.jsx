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

export default function ImpDeliveryListActions({
  nextPageDelv,
  nextPageExpense,
  debouncedFetchSSLImpDelvInfoQueryWEB,
}) {
  const { t } = useTranslation()
  const [visible, setVisible] = useState(false)
  const [inputValue, setInputValue] = useState(1)

  return (
    <div className="flex items-center gap-2">
      <Button
        key="Delivery"
        type="default"
        icon={<FileDoneOutlined />}
        size="middle"
        className="uppercase"
        color="default"
        variant="filled"
        onClick={nextPageDelv}
        style={{ backgroundColor: '#f0f0f0', borderColor: '#d9d9d9' }}
      >
        Nhập kho nhập khẩu
      </Button>
      <Button
        key="Expense"
        type="default"
        icon={<FileDoneOutlined />}
        size="middle"
        className="uppercase"
        color="default"
        variant="filled"
        onClick={nextPageExpense}
        style={{ backgroundColor: '#f0f0f0', borderColor: '#d9d9d9' }}
      >
        Tính toán giá vốn nhập khẩu
      </Button>
      <Button
        key="Save"
        type="primary"
        icon={<SearchOutlined />}
        size="middle"
        onClick={debouncedFetchSSLImpDelvInfoQueryWEB}
        className="uppercase"
      >
        {t('1357')}
      </Button>
    </div>
  )
}
