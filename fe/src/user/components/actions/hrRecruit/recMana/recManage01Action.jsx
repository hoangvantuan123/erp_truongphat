import { useState } from 'react'
import { Button, Dropdown, Menu, message, Input, Space, Form, InputNumber } from 'antd'
import {
    SaveOutlined,

    DeleteOutlined,
    ScissorOutlined,
    SearchOutlined
} from '@ant-design/icons'
export default function RecManage01Action({
    handleSearchData,
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

        </div>
    )
}
