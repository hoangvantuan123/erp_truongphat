import { Button, Dropdown, Menu, message, Input, Space, Form, InputNumber } from 'antd'
import {
    SaveOutlined,
    SearchOutlined,
    DeleteOutlined,
    FileSearchOutlined,

} from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
export default function PM03Action({
    handleSearchData,
}) {

    const { t } = useTranslation()

    return (
        <div className="flex items-center gap-1">

            <Button icon={<SearchOutlined />} onClick={handleSearchData} size="middle" className="uppercase">
                {t('Truy vấn')}
            </Button>



        </div>
    )
}
