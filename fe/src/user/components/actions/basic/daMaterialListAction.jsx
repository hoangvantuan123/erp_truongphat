import {
    Button,
} from 'antd'
import {
    SaveOutlined,
    SearchOutlined
} from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
export default function DaMaterialListAction({
    fetchDataQuery,
    handleSaveData,
    handleDeleteDataSheet

}) {
    const { t } = useTranslation()
    return (
        <div className="flex items-center gap-2">

            <Button
                type="primary" danger
                onClick={handleDeleteDataSheet}
                size="middle"
            >
               {t('850000068')}
            </Button>

            <Button
                key="save"
                type="primary"
                icon={<SaveOutlined />}
                size="middle"
                className="uppercase"
                onClick={handleSaveData}
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
                onClick={fetchDataQuery}
            >
                {t('850000005')}
            </Button>
        </div>
    )
}
