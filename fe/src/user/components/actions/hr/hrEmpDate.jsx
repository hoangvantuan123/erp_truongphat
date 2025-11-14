import { Button, Dropdown, Menu, message, Input, Space, Form, InputNumber } from 'antd'
import {
    SaveOutlined,
    SearchOutlined,
    DeleteOutlined
} from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
export default function HrEmpDateActions({
    handleSaveData,
    fetchData,
    handleDeleteDataSheet
}) {

    const { t } = useTranslation()

    return (
        <div className="flex items-center gap-1">
            <Button icon={<SearchOutlined />} size="middle" onClick={fetchData} className="uppercase">
                {t('1357')}
            </Button>
            <Button icon={<SaveOutlined />} size="middle" className="uppercase" onClick={handleSaveData}>
                {t('10000003')}
            </Button>


        </div>
    )
}
