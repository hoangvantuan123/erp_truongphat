import { Button, Dropdown, Menu, message, Input, Space, Form, InputNumber } from 'antd'
import {
    SaveOutlined,
    SearchOutlined,
    DeleteOutlined,
    FileTextOutlined, ArrowLeftOutlined,
    ScanOutlined
} from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
export default function StockReal6SeqAction({
    handleSearchData,
}) {

    const { t } = useTranslation()

    return (
        <div className="flex flex-wrap items-center gap-2">

            <Button icon={<SearchOutlined />} size="middle" onClick={handleSearchData} className="uppercase"
                color="default" variant="text">
                {t('TRUY VẤN')}
            </Button>
            <Button icon={<SaveOutlined />} size="middle" className="uppercase"
                color="default" variant="text">
                {t('Lưu')}
            </Button>
            <Button icon={<DeleteOutlined />} size="middle" className="uppercase"
                color="default" variant="text">
                {t('Xóa')}
            </Button>



        </div>
    )
}
