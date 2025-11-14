import { Button, Dropdown, Menu, message, Input, Space, Form, InputNumber } from 'antd'
import {
    SaveOutlined,
    SearchOutlined,
    DeleteOutlined
} from '@ant-design/icons'
export default function HrBasOrgJobAction({
    handleSaveData,
    fetchData,
    handleDeleteDataSheet
}) {



    return (
        <div className="flex items-center gap-1">
            <Button icon={<SearchOutlined />} size="middle" onClick={fetchData} className="uppercase">
                SEARCH
            </Button>
            <Button icon={<SaveOutlined />} size="middle" className="uppercase" onClick={handleSaveData}>
                Save
            </Button>

            <Button
                icon={<DeleteOutlined />}
                size="middle"
                className="uppercase"

                onClick={handleDeleteDataSheet}
            >
                DELETE
            </Button>

        </div>
    )
}
