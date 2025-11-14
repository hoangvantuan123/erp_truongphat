import { Modal, Button } from 'antd'
import { useTranslation } from 'react-i18next'
export default function ModalLogout({
  modalOpen,
  setModalOpen,
  confirmLogout,
}) {
  const { t } = useTranslation()
  return (
    <Modal
      centered
      open={modalOpen}
      onOk={() => setModalOpen(false)}
      onCancel={() => setModalOpen(false)}
      footer={false}
      closable={false}
    >
      <div className="flex flex-col items-center justify-center">
        <h2 className="text-xl font-semibold mb-4">
          {t('850000076')}
        </h2>
        <p className="text-gray-600 mb-6 text-center">
          {t('850000077')}
        </p>

        <div className="flex w-full gap-4">
          <Button
            onClick={() => setModalOpen(false)}
            type="default"
            size="large"
            className="w-full"
          >
            {t('850000078')}
          </Button>
          <Button
            type="primary"
            danger
            onClick={confirmLogout}
            className="w-full"
            size="large"
          >
            {t('850000079')}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
