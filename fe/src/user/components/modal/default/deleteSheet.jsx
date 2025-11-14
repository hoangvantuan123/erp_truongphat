import { Modal, Button } from 'antd'

export default function ModalSheetDelete({
  modalOpen,
  setModalOpen,
  confirm,
}) {
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
          Bạn có muốn xóa dữ liệu này
        </h2>
        <p className="text-gray-600 mb-6 text-center">
          Bạn có chắc chắn muốn xóa dữ liệu này
        </p>

        <div className="flex w-full gap-4">
          <Button
            onClick={() => setModalOpen(false)}
            type="default"
            size="large"
            className="w-full"
          >
            Hủy
          </Button>
          <Button
            type="primary"
            danger
            onClick={() => {
              confirm();
            }}
            className="w-full"
            size="large"
           
          >
            Xóa
          </Button>
        </div>
      </div>
    </Modal>
  )
}