import { Button, Dropdown, Menu, message, Input, Space, Form, InputNumber } from 'antd'
import {
    SaveOutlined,
    SearchOutlined,
    FileTextOutlined, ArrowLeftOutlined,
} from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
export default function StockReal6Action({
    handleSearchData,
    nextPage
}) {

    const { t } = useTranslation()

    return (
        <div className="flex items-center  ">
            {/* 
            <Button icon={<ArrowLeftOutlined />} size="middle" className="uppercase"
                color="default" variant="text">
                {t('Quay lại')}
            </Button> */}

            <Button icon={<SearchOutlined />} size="middle" onClick={handleSearchData} className="uppercase"
                color="default" variant="text">
                {t('TRUY VẤN')}
            </Button>


            <Button icon={<FileTextOutlined />} onClick={nextPage} size="middle" className="uppercase"
                color="default" variant="text">
                {t('Scan kết quả')}
            </Button>

        </div>
    )
}
