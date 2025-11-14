import { Button } from 'antd'
import {
  SearchOutlined,
} from '@ant-design/icons'
import { useTranslation } from 'react-i18next'

export default function QcFinalBadQtyActions({
  fetchDataQuery,

}) {
  const { t } = useTranslation()
  return (
    <div className="flex items-center gap-2">
      <Button
        key="Save"
        type="primary"
        icon={<SearchOutlined />}
        size="middle"
        className="uppercase"
        onClick={fetchDataQuery}
      >
        {t('850000138')}
      </Button>

    </div>
  )
}
