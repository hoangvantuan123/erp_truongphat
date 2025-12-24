import { Button } from 'antd'
import {
  SearchOutlined,
  ImportOutlined,
  MonitorOutlined,
  ScissorOutlined,
  SaveOutlined,
  EditOutlined,
} from '@ant-design/icons'
import { useTranslation } from 'react-i18next'

export default function HrEduRstActions({
  setModalOpen,
  onClickSearch,
  onClickPerRst,

}) {
  const { t } = useTranslation()
  return (
    <div className="flex items-center gap-2">
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
        icon={<EditOutlined />}
        size="middle"
        className="uppercase"
        onClick={onClickPerRst}
      >
        {t('10000466')}
      </Button>

      
    </div>
  )
}
