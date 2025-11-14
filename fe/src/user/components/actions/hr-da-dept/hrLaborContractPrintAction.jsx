import { Button } from 'antd'
import {
  SearchOutlined,
  ImportOutlined,
  MonitorOutlined,
} from '@ant-design/icons'
import { useTranslation } from 'react-i18next'

export default function HrLaborContractPrintActions({
  
  onClickSearch,
  onClickPrint,

}) {
  const { t } = useTranslation()
  return (
    <div className="flex items-center gap-2">
      <Button
        key="handle-check"
        type="primary"
        icon={<MonitorOutlined />}
        size="middle"
        className="uppercase"
        onClick={onClickSearch}
        
      >
        {t('477')}
      </Button>
     

      <Button
        key="handle-check_list"
        type="primary"
        icon={<ImportOutlined />}
        size="middle"
        className="uppercase"
        onClick={onClickPrint}
        style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
      >
        {t('16555')}
      </Button>
      

      
    </div>
  )
}
