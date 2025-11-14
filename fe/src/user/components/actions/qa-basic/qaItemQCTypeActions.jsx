import { Button } from 'antd'
import { SaveOutlined, RedoOutlined, SearchOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'

export default function QaItemQcTypeActions({
  fetchDataQuery,
  handleSaveData,
}) {
  const { t } = useTranslation()
  return (
    <div className="flex items-center gap-2">
      <Button
        key="register-result"
        type="primary"
        icon={<SearchOutlined />}
        size="middle"
        className="uppercase"
        onClick={fetchDataQuery}
      >
        {t('850000138')}
      </Button>
      <Button
        key="save-purchase-req"
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
