import { useState } from 'react'
import { ConfigProvider, Descriptions, Input } from 'antd'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'
import 'dayjs/locale/vi'

dayjs.locale('vi')

export default function StockReal6SeqQuery({
  helpData01,
}) {
  const { t } = useTranslation()
  const [dropdownVisible, setDropdownVisible] = useState(false)
  const [dropdownVisible2, setDropdownVisible2] = useState(false)
  const [dropdownVisible3, setDropdownVisible3] = useState(false)
  const langCode = localStorage.getItem('language')
  const [displayValue, setDisplayValue] = useState('All')
  const [displayValue2, setDisplayValue2] = useState('All')

  const safeData = helpData01?.[0] || {}

  const formatDate = (dateStr) => {
    if (!dateStr || typeof dateStr !== 'string' || dateStr.length !== 8) return ''
    const year = dateStr.slice(0, 4)
    const month = dateStr.slice(4, 6)
    const day = dateStr.slice(6, 8)
    return `${day}/${month}/${year}`
  }

  return (
    <div className="w-full">
      <ConfigProvider>
        <Descriptions
          size="small"
          bordered
          style={{ borderRadius: 0 }}
          column={1}
          labelStyle={{
            backgroundColor: '#fafafa',
            fontWeight: 600,
            fontSize: '10px',
            padding: '4px 8px'
          }}
          contentStyle={{
            padding: 0,
            backgroundColor: 'white'
          }}
        >

          <Descriptions.Item label={<span className="uppercase  font-bold">Ngày yêu cầu</span>}>
            <div className="flex items-center gap-2 px-2 py-1">
              <Input
                maxLength={350}
                size="small"
                value={formatDate(safeData.StkDate)}
                variant="borderless"
                className="w-full text-blue-800"
                readOnly
              />
            </div>
          </Descriptions.Item>

          <Descriptions.Item label={<span className="uppercase font-bold">Bộ phận kinh doanh</span>}>
            <div className="px-2 py-1">
              <Input
                readOnly
                variant="borderless"
                value={safeData.BizUnitName || ''}
                className="w-full cursor-pointer text-blue-800"
                size="small"
              />
            </div>
          </Descriptions.Item>

          <Descriptions.Item label={<span className="uppercase font-bold">Kho kiểm kê</span>}>
            <div className="relative px-2 py-1">
              <Input
                value={safeData.WHName || ''}
                variant="borderless"
                readOnly
                className="w-full cursor-pointer text-blue-800"
                size="small"
              />
            </div>
          </Descriptions.Item>

          <Descriptions.Item label={<span className="uppercase font-bold">Số kiểm tra</span>}>
            <div className="px-2 py-1">
              <Input
                maxLength={350}
                size="small"
                value={safeData.StkMngNo || ''}
                variant="borderless"
                className="w-full text-blue-800"
                readOnly
              />
            </div>
          </Descriptions.Item>

          <Descriptions.Item label={<span className="uppercase font-bold">Phân loại kiểm tra</span>}>
            <div className="px-2 py-1">
              <Input
                maxLength={350}
                size="small"
                value={safeData.InventoryTypeName || ''}
                variant="borderless"
                className="w-full text-blue-800"
                readOnly
              />
            </div>
          </Descriptions.Item>

          <Descriptions.Item label={<span className="uppercase font-bold">Người phụ trách</span>}>
            <div className="relative px-2 py-1">
              <Input
                value={safeData.EmpName || ''}
                variant="borderless"
                readOnly
                className="w-full cursor-pointer text-blue-800"
                size="small"
              />
            </div>
          </Descriptions.Item>

        </Descriptions>
      </ConfigProvider>
    </div>
  )
}
