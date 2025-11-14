import { Modal, Button } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

export default function ModalCheckAllLogout({
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
    >
      <div className="flex flex-col items-center justify-center text-center">
        <ExclamationCircleOutlined className="text-4xl text-yellow-500 mb-4" />

        <h2 className="text-xl font-semibold mb-2">
          {t('Xác nhận đăng xuất tất cả thiết bị')}
        </h2>

        <p className="text-gray-600 mb-6">
          {t('Bạn có chắc chắn muốn đăng xuất tài khoản khỏi tất cả các thiết bị không?')}
        </p>

        <div className="flex w-full gap-4">
          <Button
            onClick={() => setModalOpen(false)}
            type="default"
            size="large"
            className="w-full"
          >
            {t('Huỷ bỏ')}
          </Button>
          <Button
            type="primary"
            danger
            onClick={confirmLogout}
            className="w-full"
            size="large"
          >
            {t('Đăng xuất tất cả')}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
