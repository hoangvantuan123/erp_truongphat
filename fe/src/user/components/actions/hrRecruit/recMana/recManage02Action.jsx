import { useState } from 'react'
import { Button, Dropdown, Menu, message, Input, Space, Form, InputNumber } from 'antd'
import {
    SaveOutlined,

    DeleteOutlined,
    ScissorOutlined,
    SearchOutlined
} from '@ant-design/icons'
export default function RecManage02Action({
    handleSearchData,
    handleDeleteDataSheet,
    handleSaveData,
    handleDeleteDataSheetItem
}) {
    return (
        <div className="flex items-center gap-2">

            <Button
                key="Save"
                icon={<SearchOutlined />}
                className="uppercase"
                onClick={handleSearchData}
            >
                SEARCH
            </Button>
            <Button
                key="save"
                icon={<SaveOutlined />}
                className="uppercase"
                onClick={handleSaveData}
            >
                Save
            </Button>
            <Button
                icon={<DeleteOutlined />}
                className="uppercase"
                onClick={handleDeleteDataSheet}
            >
                XÓA NHÓM
            </Button>
            <Button
                icon={<ScissorOutlined />}
                className="uppercase"
                onClick={handleDeleteDataSheetItem}
            >
                XÓA MỤC
            </Button>
        </div>
    )
}
