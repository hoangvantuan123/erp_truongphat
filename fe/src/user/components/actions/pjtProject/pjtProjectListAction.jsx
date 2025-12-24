import {
    ContainerOutlined,
    SearchOutlined
} from '@ant-design/icons';
import { Button } from 'antd';
import { useTranslation } from 'react-i18next';

export default function PjtProjectListAction({
    handleSearch,
    nextPage,
    handleExternalSubmit,
    handleOpenDeleteDataSheet,
    setModalDeleteConfirm

}) {
    const { t } = useTranslation();
    return (
        <div className="flex items-center gap-1">
            <Button icon={<SearchOutlined />} size="middle" onClick={handleSearch} className="uppercase">
                {t('850000001')}
            </Button>

            <Button icon={<ContainerOutlined />} size="middle" className="uppercase" onClick={nextPage}>
                {t('10040561')}
            </Button>
            {/* 
            <Button icon={<ScissorOutlined />} size="middle" className="uppercase" onClick={handleOpenDeleteDataSheet}>
                {t('14207')}
            </Button>
                      <Button icon={<DeleteOutlined />} size="middle" className="uppercase" onClick={() => {setModalDeleteConfirm(true)}}>
                {t('308')}
            </Button> */}


        </div>
    );
}
