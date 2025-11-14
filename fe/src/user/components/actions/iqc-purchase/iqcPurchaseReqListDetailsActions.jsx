import { Button } from 'antd'
import {
  SearchOutlined,
  ImportOutlined,
  MonitorOutlined,
} from '@ant-design/icons'
import { useTranslation } from 'react-i18next'

export default function IqcPurchaseReqListDetailsActions({
  onClickSave,
  onClickReset,
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
        onClick={onClickReset}
        style={{ backgroundColor: '#ff4d4f', borderColor: '#ff4d4f' }}
      >
        {t('850000071')}
      </Button>

      <Button
        key="handle-check_list"
        type="primary"
        icon={<ImportOutlined />}
        size="middle"
        className="uppercase"
        onClick={onClickSave}
        style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
      >
        {t('850000138')}
      </Button>
      

      
    </div>
  )
}
