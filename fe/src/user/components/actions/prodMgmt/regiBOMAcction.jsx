import {
    Button,
} from 'antd'
import {
    UploadOutlined,
    SearchOutlined,
    DeleteOutlined, SaveOutlined, FileAddOutlined
} from '@ant-design/icons'
import { useTranslation } from 'react-i18next'

export default function RegiBOMAcction({
    handleSave,
    handleDeleteDataSheet,
    handleSearch,
    handleResetFrom
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
                onClick={handleDeleteDataSheet}
                style={{ backgroundColor: '#ff4d4f', borderColor: '#ff4d4f' }}
            >
                {t('850000068')}
            </Button>
            <Button
                key="upload"
                type="primary"
                icon={<SaveOutlined />}
                size="middle"
                className="uppercase"
                onClick={handleSave}
                style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
            >
                {t('850000003')}
            </Button>
            <Button
                key="search"
                type="primary"
                icon={<SearchOutlined />}
                size="middle"
                className="uppercase"
                onClick={handleSearch}
            >
                {t('850000005')}
            </Button>
            <Button
                key="search"
                icon={<FileAddOutlined />}
                size="middle"
                style={{ backgroundColor: '#f0f0f0', borderColor: '#d9d9d9' }}
                className="uppercase"
                onClick={handleResetFrom}
            >
              {t('850000072')}
            </Button>
        </div>
    )
}