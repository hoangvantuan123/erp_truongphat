import { Button } from 'antd';
import {
    SearchOutlined,
    ContainerOutlined,
    ProfileOutlined
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

export default function PdEquipListAction({
    handleSearch,
    handleDeleteDataSheet,

}) {
    const { t } = useTranslation();
    return (
        <div className="flex items-center gap-1">
            <Button icon={<SearchOutlined />} size="middle" onClick={handleSearch} className="uppercase">
                {t('850000001')}
            </Button>

            <Button icon={<ContainerOutlined />} size="middle" className="uppercase" onClick={handleDeleteDataSheet}>
                {t('800000212')}
            </Button>

            <Button icon={<ProfileOutlined />} size="middle" className="uppercase" onClick={handleDeleteDataSheet}>
                {t('800000211')}
            </Button>

        </div>
    );
}
