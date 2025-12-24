import { Button } from 'antd'
import {
  MonitorOutlined,
  SaveOutlined,
  ScissorOutlined,
} from '@ant-design/icons'
import { useTranslation } from 'react-i18next'

export default function HrAdmOrdObjActions({
  setModalOpen,
  openModal,
  
  onClickSearch,
  onClickSave,
  onClickDeleteSheet,
  onClickSearchObj,
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
        key="handle-search-obj"
        icon={<MonitorOutlined />}
        size="middle"
        className="uppercase"
        onClick={onClickSearchObj}
        
      >
        {t('13622')}
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
        onClick={onClickDeleteSheet}
      >
        {t('14207')}
      </Button>

      
    </div>
  )
}
