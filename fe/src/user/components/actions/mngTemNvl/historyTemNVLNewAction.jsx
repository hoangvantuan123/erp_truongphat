import { Button, Dropdown, Menu, message, Input, Space, Form, InputNumber } from 'antd'
import {
    SaveOutlined,
    SearchOutlined,
    FileTextOutlined, PrinterOutlined,
    DownloadOutlined,
    DeleteOutlined
} from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
export default function HistoryTemNVLNewAction({
    handleSearchData,
    HandOpenFile,
    HandDownloadFile,
    HandPrintFile, handleDeleteDataSheet
}) {

    const { t } = useTranslation()

    return (
        <div className="flex items-center gap-1">
            <Button icon={<SearchOutlined />} size="small" onClick={handleSearchData} className="uppercase"
                color="default" variant="text">
                {t('TRUY VẤN')}
            </Button>
            <Button icon={<DeleteOutlined />} onClick={handleDeleteDataSheet} size="small" className="uppercase"
                color="default" variant="text">
                {t('XÓA FILE')}
            </Button>
            <Button
                icon={<FileTextOutlined />}
                size="small"
                className="uppercase"
                color="default" variant="text"
                onClick={HandOpenFile}
            >
                OPEN FILE
            </Button>
            <Button
                icon={<DownloadOutlined />}
                size="small"
                className="uppercase"
                color="default" variant="text"
                onClick={HandDownloadFile}
            >
                DOWNLOAD FILE
            </Button>

            <Button
                icon={<PrinterOutlined />}
                size="small"
                className="uppercase"
                onClick={HandPrintFile}
                color="default" variant="text"
            >
                IN TEM NVL
            </Button>

        </div>
    )
}
