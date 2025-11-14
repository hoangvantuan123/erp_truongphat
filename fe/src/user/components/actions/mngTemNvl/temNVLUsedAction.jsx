import { Button, Dropdown, Menu, message, Input, Space, Form, InputNumber } from 'antd'
import {
    SaveOutlined,
    SearchOutlined,
    FileTextOutlined, DeleteOutlined
} from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
export default function TemNVLUsedAction({
    handleSearchData,
    HandCreateTemFile,
    handleDeleteData,
    handleSaveData
}) {

    const { t } = useTranslation()

    return (
        <div className="flex items-center gap-1">
            <Button icon={<SearchOutlined />} size="small" onClick={handleSearchData} className="uppercase"
                color="default" variant="text">
                {t('TRUY VẤN')}
            </Button>

            <Button onClick={handleSaveData} icon={<SaveOutlined />} size="small" className="uppercase"
                color="default" variant="text">
                {t('Lưu')}
            </Button>

            <Button onClick={HandCreateTemFile} icon={<FileTextOutlined />} size="small" className="uppercase"
                color="default" variant="text">
                {t('TẠO FILE TEM IN')}
            </Button>

        </div>
    )
}
