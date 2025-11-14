import { Button, Dropdown, Menu, message, Input, Space, Form, InputNumber } from 'antd'
import {
    SaveOutlined,
    SearchOutlined,
    DeleteOutlined,
    FileSearchOutlined
} from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
export default function AcctBalanceAction({
    handleSearchData,
    AcctDetailedBalanceListNextPage,
    AccRemBalanceLedgerNextPage
}) {

    const { t } = useTranslation()

    return (
        <div className="flex items-center gap-1">

            <Button onClick={AcctDetailedBalanceListNextPage} icon={<FileSearchOutlined />} size="middle" className="uppercase">
                {t('10041895')}
            </Button>
            <Button icon={<FileSearchOutlined />} onClick={AccRemBalanceLedgerNextPage} size="middle" className="uppercase">
                {t('10041896')}
            </Button>
            <Button icon={<SearchOutlined />} size="middle" onClick={handleSearchData} className="uppercase">
                {t('1357')}
            </Button>


        </div>
    )
}
