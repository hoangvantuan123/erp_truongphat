import {
    Button,
} from 'antd'
import {
    UploadOutlined,
    SearchOutlined,
    DeleteOutlined
} from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
export default function BucketAction({
    fetchData,
    showModal,
    handleDelete
}) {
    const { t } = useTranslation()
    return (
        <div className="flex items-center gap-2">
            <Button
                key="delete"
                type="primary"
                icon={<DeleteOutlined />}
                size="middle"
                className="uppercase"
                onClick={handleDelete}
                style={{ backgroundColor: '#ff4d4f', borderColor: '#ff4d4f' }}
            >
                {t('850000068')}
            </Button>
            <Button
                key="upload"
                type="primary"
                icon={<UploadOutlined />}
                size="middle"
                className="uppercase"
                onClick={showModal}
                style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
            >
              {t('850000069')}
            </Button>
            <Button
                key="search"
                type="primary"
                icon={<SearchOutlined />}
                size="middle"
                onClick={fetchData}
                className="uppercase"
            >
                {t('850000005')}
            </Button>
        </div>
    )
}