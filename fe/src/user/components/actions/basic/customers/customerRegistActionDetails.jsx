import { useState } from 'react'
import { Button } from 'antd'
import {
    SaveOutlined,
    DeleteOutlined,
    UploadOutlined,
    SearchOutlined,
    FileOutlined
} from '@ant-design/icons'
import { useTranslation } from 'react-i18next'

export default function CustomerRegistActionDetails({
    handleSaveData,
    handleDeleteDataSheet,
    handleSearchData,
}) {
    const { t } = useTranslation()
    return (
        <div className="flex items-center gap-2">
            <Button
                icon={<SearchOutlined />}
                size="middle"
                className="uppercase"
                onClick={handleSearchData}
            >
                {t('Truy vấn')}
            </Button>
            <Button
                icon={<SaveOutlined />}
                size="middle"
                onClick={handleSaveData}
                className="uppercase"
            >
                {t('850000003')}
            </Button>
            <Button
                icon={<DeleteOutlined />}
                size="middle"
                className="uppercase"
                onClick={handleDeleteDataSheet}
            >
                {t('850000068')}
            </Button>


        </div>
    )
}
