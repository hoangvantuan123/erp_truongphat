import { Modal, Button } from 'antd';
import { useTranslation } from 'react-i18next';

export default function Notifi1({
    modalOpen,
    setModalOpen,
    confirmLogout,
}) {
    const { t } = useTranslation();

    return (
        <Modal
            centered
            open={modalOpen}
            onOk={() => setModalOpen(false)}
            onCancel={() => setModalOpen(false)}
            footer={false}
            closable={false}
            maskClosable={false}
        >
            <div className="flex flex-col items-center justify-center">
                <h2 className="text-xl font-semibold mb-4">
                    {t('Thiết bị của bạn đã bị đăng xuất')}
                </h2>
                <p className="text-gray-600 mb-6 text-center">
                    {t('Tài khoản của bạn đã bị đăng xuất khỏi thiết bị này.')}
                </p>

                <div className="flex w-full gap-4">
                    <Button
                        onClick={() => setModalOpen(false)}
                        type="primary"
                        size="large"
                        className="w-full"
                    >
                        {t('Đóng')}
                    </Button>
                </div>
            </div>
        </ Modal>
    );
}
