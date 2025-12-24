import { Button } from 'antd'
import {
  SearchOutlined,
  ImportOutlined,
  MonitorOutlined,
} from '@ant-design/icons'
import { useTranslation } from 'react-i18next'

export default function EmpOrgDeptActions({
  setModalOpen,
  openModal,

  onClickSearch,
  onClickAdd,
  onClickDelete,
  onClickSave,
  onClickSaveHis,
}) {
  const { t } = useTranslation()
  return (
    <div className="flex items-center gap-2">
      <Button
        key="handle-search"
        icon={<MonitorOutlined />}
        size="middle"
        className="uppercase"
        onClick={onClickSearch}
        
      >
        {t('477')}
      </Button>

      {/* <Button
        key="handle-click-add"
        type="primary"
        icon={<ImportOutlined />}
        size="middle"
        className="uppercase"
        onClick={onClickAdd}
        style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
      >
        {t('Thêm')}
      </Button>
       */}
    </div>
  )
}
