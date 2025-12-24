import { Button } from 'antd'
import {
  MonitorOutlined,
  SaveOutlined,
} from '@ant-design/icons'
import { useTranslation } from 'react-i18next'

export default function HrEduRstEndActions({
  onClickSearch,
  onClickSave,

}) {
  const { t } = useTranslation()
  return (
    <div className="flex items-center gap-2 mr-2">
      <Button
        key="handle-check"
        icon={<MonitorOutlined />}
        size="middle"
        className="uppercase"
        onClick={onClickSearch}

      >
        {t('477')}
      </Button>

    
      <Button
        key="Save"
        icon={<SaveOutlined />}
        size="middle"
        className="uppercase"
        onClick={onClickSave}
      >
        {t('55168')}
      </Button>

    </div>
  )
}
