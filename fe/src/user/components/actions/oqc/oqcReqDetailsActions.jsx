import { Button } from 'antd'
import { SaveOutlined, RedoOutlined, SearchOutlined, DeleteOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'

export default function OqcReqDetailsActions({
  handleSaveData,
  handleRestSheet,
  setModalDeleteConfirm,
  fetchQcTestReportSample
  
}) {
  const { t } = useTranslation()
  return (
    <div className="flex items-center gap-2">
      <Button
        key="handle-iqc-puchase-rest"
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
        key="register-result"
        type="primary"
        icon={<SearchOutlined />}
        size="middle"
        className="uppercase"
        onClick={fetchQcTestReportSample}
      >
        {t('800000116')}
      </Button>

      <Button
        key="register-result"
        type="primary"
        icon={<DeleteOutlined />}
        size="middle"
        className="uppercase"
        onClick={() => {setModalDeleteConfirm(true)}}
        style={{ backgroundColor: '#ff4d4f', borderColor: '#ff4d4f' }}
      >
        {t('308')}
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
