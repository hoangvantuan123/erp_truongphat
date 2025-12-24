import { Button } from 'antd';
import {
    SearchOutlined,
    ContainerOutlined,
    ProfileOutlined,
    ScissorOutlined
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

export default function HrEduTypeAction({
    handleSearch,
    handleExternalSubmit,
    handleOpenDeleteDataSheet

}) {
    const { t } = useTranslation();
    return (
        <div className="flex items-center gap-1">
            <Button icon={<SearchOutlined />} size="middle" onClick={handleSearch} className="uppercase">
                {t('850000001')}
            </Button>

            <Button icon={<ContainerOutlined />} size="middle" className="uppercase" onClick={handleExternalSubmit}>
                {t('850000148')}
            </Button>

            <Button icon={<ScissorOutlined />} size="middle" className="uppercase" onClick={handleOpenDeleteDataSheet}>
                {t('14207')}
            </Button>

        </div>
    );
}
