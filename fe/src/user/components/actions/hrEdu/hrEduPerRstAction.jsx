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

export default function HrEduPerRstAction({
    handleSearch,
    handleDeleteDataSheet,
    handleSaveAll,
    handleDelete,
    handleCheck,
    handleDetail,
    setModalDeleteConfirm,
    current,
    handleCheckRstCost,
    handleCheckRstItem,
    handleCheckRstEmp

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

            <Button icon={<SearchOutlined />} size="middle" onClick={handleCheckRstEmp} className="uppercase">
                {t('11777')}
            </Button>
            {
                current === '1' &&
                <Button icon={<SearchOutlined />} size="middle" className="uppercase" onClick={handleCheckRstCost}>
                    {t('19027')}
                </Button>
            }

            {
                current === '3' &&
                <Button icon={<SearchOutlined />} size="middle" className="uppercase" onClick={handleCheckRstItem}>
                    {t('18166')}
                </Button>
            }


        </div>
    );
}
