import {
    Button,
} from 'antd'
import {
    SaveOutlined,
    SearchOutlined
} from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
export default function CustomerRegistrationAction({
    handleSaveData,
    fetchDataQuery, 
    setModalOpen,
    nextToPageDetails,
}) {
    const { t } = useTranslation()
    return (
        <div className="flex items-center gap-2">
           
            <Button
                type="primary" danger
                onClick={() => setModalOpen(true)}
                size="middle"
            >
                XÓA SHEET
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
                Save
            </Button>
            <Button
                key="Save"
                type="primary"
                icon={<SearchOutlined />}
                size="middle"
                className="uppercase"
                onClick={fetchDataQuery}
            >
                SEARCH
            </Button>
            <Button
                key="Details"
                type="primary"
                icon={<SearchOutlined />}
                size="middle"
                className="uppercase"
                onClick={nextToPageDetails}
            >
                Chi tiết
            </Button>
        </div>
    )
}
