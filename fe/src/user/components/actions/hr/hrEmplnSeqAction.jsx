import { Button } from 'antd';
import {
    SaveOutlined,
    SearchOutlined,
    DeleteOutlined,
    PrinterOutlined,
    FolderOpenOutlined,
    ScissorOutlined
} from '@ant-design/icons';

export default function HrEmplnSeqAction({
    handleSaveData,
    handleSearch,
    handleDeleteDataSheet,
    handleSaveAll,
    handlePrint

}) {
    return (
        <div className="flex items-center gap-1">
            <Button icon={<SearchOutlined />} size="middle" onClick={handleSearch} className="uppercase">
                SEARCH
            </Button>
            <Button icon={<PrinterOutlined />} onClick={handlePrint} size="middle" className="uppercase">
                IN THÔNG TIN
            </Button>

            <Button icon={<SaveOutlined />} size="middle" className="uppercase" onClick={handleSaveAll}>
                SAVE
            </Button>

            <Button icon={<ScissorOutlined />} size="middle" className="uppercase" onClick={handleDeleteDataSheet}>
                XÓA SHEET
            </Button>

        </div>
    );
}
