import { Button } from 'antd'
import {
  SearchOutlined,
  ImportOutlined,
  MonitorOutlined,
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
        type="primary"
        icon={<MonitorOutlined />}
        size="middle"
        className="uppercase"
        onClick={onClickSearch}
        
      >
        {t('477')}
      </Button>
      <Button
        key="handle-search-obj"
        type="primary"
        icon={<MonitorOutlined />}
        size="middle"
        className="uppercase"
        onClick={onClickSearchObj}
        
      >
        {t('13622')}
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
        {t('850000003')}
      </Button>
      <Button
        key="Save"
        type="primary"
        icon={<SearchOutlined />}
        size="middle"
        className="uppercase"
        onClick={onClickDeleteSheet}
        style={{ backgroundColor: '#ff4d4f', borderColor: '#ff4d4f' }}
      >
        {t('14207')}
      </Button>

      
    </div>
  )
}
