import { Button } from 'antd'
import {
  SearchOutlined,
  ImportOutlined,
  MonitorOutlined,
} from '@ant-design/icons'
import { useTranslation } from 'react-i18next'

export default function IqcOutsourceReqListActions({
  fetchDataQuery,
  nextPageStockIn,
  isAPISuccess,
  nextPageDeatails,
  nextPageDeatailsList,
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
        onClick={nextPageDeatails}
        style={{ backgroundColor: '#ff4d4f', borderColor: '#ff4d4f' }}
      >
        {t('800000113')}
      </Button>

      <Button
        key="handle-check_list"
        type="primary"
        icon={<ImportOutlined />}
        size="middle"
        className="uppercase"
        onClick={nextPageDeatailsList}
        style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
      >
        {t('800000112')}
      </Button>
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
