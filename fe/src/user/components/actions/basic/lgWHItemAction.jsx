import { useState } from 'react'
import { Button, Dropdown, Menu, message, Space, Form, InputNumber } from 'antd'
import {
    SaveOutlined,
    PlusOutlined,
    FileDoneOutlined,
    DeleteOutlined,
    FileExcelOutlined,
    FileTextOutlined,
    DownOutlined,
    ExportOutlined,
    SettingOutlined,
    RestOutlined,
    SearchOutlined,
} from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
export default function LgWHItemAction({
    handleSaveData,
    fetchDataQuery,
    setModalOpen,

}) {
    const { t } = useTranslation()

    return (
        <div className="flex items-center gap-2">

            <Button
                type="primary" danger
                onClick={() => setModalOpen(true)}
                size="middle"
            >
                {t('850000068')}
            </Button>

            <Button
                key="save"
                type="primary"
                icon={<SaveOutlined />}
                size="middle"
                className="uppercase"
                onClick={handleSaveData}
                style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
            >
                {t('850000003')}
            </Button>
            <Button
                key="Save"
                type="primary"
                icon={<SearchOutlined />}
                size="middle"
                className="uppercase"
                onClick={() => {
                    fetchDataQuery();

                }}
            >
                {t('850000005')}
            </Button>
        </div>
    )
}
