import { Button } from 'antd'
import {
  SearchOutlined,
  ImportOutlined,
  MonitorOutlined,
  ScissorOutlined,
  SaveOutlined,
} from '@ant-design/icons'
import { useTranslation } from 'react-i18next'

export default function HrDaDeptActions({
  setModalOpen,
  openModal,
  
  onClickSearch,
  onClickSave,
  onClickDeleteSheet
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
        key="handle-check_list"
        icon={<SaveOutlined />}
        size="middle"
        className="uppercase"
        onClick={onClickSave}
      >
        {t('850000003')}
      </Button>
      <Button
        key="Save"
        icon={<ScissorOutlined />}
        size="middle"
        className="uppercase"
        onClick={setModalOpen}
      >
        {t('14207')}
      </Button>

      
    </div>
  )
}
