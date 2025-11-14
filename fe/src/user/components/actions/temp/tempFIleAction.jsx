import { useState } from 'react'
import { Button, Dropdown, Menu, message, Input, Space, Form, InputNumber } from 'antd'
import {
    SaveOutlined,

    DeleteOutlined,
    ScissorOutlined,
    SearchOutlined
} from '@ant-design/icons'
export default function TempFileAction({
    handleSearchData,
    handleDeleteDataSheet,
    handleSaveData,
}) {
    return (
        <div className="flex items-center gap-2">

            <Button
                key="Save"
                icon={<SearchOutlined />}
                size="small"
                className="uppercase"
                color="default" variant="text"
                onClick={handleSearchData}
            >
                SEARCH
            </Button>
            <Button
                key="save"
                icon={<SaveOutlined />}
                size="small"
                className="uppercase"
                color="default" variant="text"
                onClick={handleSaveData}
            >
                Save
            </Button>
            <Button
                icon={<DeleteOutlined />}
                size="small"
                className="uppercase"
                color="default" variant="text"
                onClick={handleDeleteDataSheet}
            >
                XÓA NHÓM
            </Button>
        </div>
    )
}
