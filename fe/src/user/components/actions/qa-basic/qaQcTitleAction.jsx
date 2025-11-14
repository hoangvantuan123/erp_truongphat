import { Button } from 'antd'
import { SaveOutlined, RedoOutlined, SearchOutlined, DeleteFilled } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'

export default function QaQcTitleAction({
  fetchData,
  handleSaveData,
  handleRestSheet,
  setModalDeleteConfirm,
  
}) {
  const { t } = useTranslation()
  return (
    <div className="flex items-center gap-2">
      <Button
        key="btn-reset"
        type="primary"
        icon={<RedoOutlined />}
        size="middle"
        className="uppercase"
        onClick={handleRestSheet}
        style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
      >
        {t('850000071')}
      </Button>

      <Button
        key="btn-search"
        type="primary"
        icon={<SearchOutlined />}
        size="middle"
        className="uppercase"
        onClick={fetchData}
      >
        {t('850000138')}
      </Button>

      <Button
        key="btn-delete"
        type="primary"
        icon={<DeleteFilled />}
        size="middle"
        className="uppercase"
        onClick={() => {setModalDeleteConfirm(true)}}
        style={{ backgroundColor: '#ff4d4f', borderColor: '#ff4d4f' }}
      >
        {t('308')}
      </Button>

      <Button
        key="btn-save"
        type="primary"
        icon={<SaveOutlined />}
        size="middle"
        className="uppercase"
        onClick={handleSaveData}
        style={{ backgroundColor: '#ff4d4f', borderColor: '#ff4d4f' }}
      >
        {t('850000148')}
      </Button>
    </div>
  )
}
