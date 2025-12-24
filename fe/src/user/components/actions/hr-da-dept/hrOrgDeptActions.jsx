import { Button } from 'antd'
import {
  SearchOutlined,
  ImportOutlined,
  MonitorOutlined,
  ScissorOutlined,
  SaveOutlined,
} from '@ant-design/icons'
import { useTranslation } from 'react-i18next'

export default function HrOrgDeptActions({
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

      <Button
        key="handle-click-add"
        icon={<ImportOutlined />}
        size="middle"
        className="uppercase"
        onClick={onClickAdd}
      >
        {t('Thêm')}
      </Button>
      <Button
        key="handle-click-save"
        icon={<SaveOutlined />}
        size="middle"
        className="uppercase"
        onClick={onClickSave}
      >
        {t('850000003')}
      </Button>
      <Button
        key="handle-click-delete"
        icon={<ScissorOutlined />}
        size="middle"
        className="uppercase"
        onClick={onClickDelete}

      >
        {t('Xóa')}
      </Button>
      
    </div>
  )
}
