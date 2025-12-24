import { Button } from 'antd';
import {
    SaveOutlined,
    SearchOutlined,
    DeleteOutlined,
    PrinterOutlined,
    FolderOpenOutlined,
    ScissorOutlined
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

export default function PdEquipAction({
    handleSearch,
    handleDeleteDataSheet,
    handleSaveAll,
    handleDelete,
    handleCheck,
    handleDetail,
    setModalDeleteConfirm

}) {
    const { t } = useTranslation();
    return (
        <div className="flex items-center gap-1">
            <Button icon={<SearchOutlined />} size="middle" onClick={handleSearch} className="uppercase">
                {t('850000001')}
            </Button>

            <Button icon={<SaveOutlined />} size="middle" className="uppercase" onClick={handleSaveAll}>
                {t('850000148')}
            </Button>

            <Button icon={<ScissorOutlined />} size="middle" className="uppercase" onClick={handleDeleteDataSheet}>
                {t('14207')}
            </Button>
            <Button icon={<DeleteOutlined />} size="middle" className="uppercase" onClick={() => {setModalDeleteConfirm(true)}}>
                {t('308')}
            </Button>

            <Button icon={<FolderOpenOutlined />} size="middle" className="uppercase" onClick={handleDeleteDataSheet}>
                {t('800000210')}
            </Button>

            <Button icon={<PrinterOutlined />} size="middle" className="uppercase" onClick={handleDeleteDataSheet}>
                {t('800000211')}
            </Button>

        </div>
    );
}
