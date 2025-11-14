import { Modal, Button, Input } from 'antd'
import { PauseCircleFilled } from '@ant-design/icons'

const { TextArea } = Input
export default function ModalSheetStop({
  modalOpen,
  setModalOpen,
  confirm,
  reason,
  setReason,
  reqNoTitle,
}) {
  return (
    <Modal
      centered
      open={modalOpen}
      onOk={() => setModalOpen(false)}
      onCancel={() => setModalOpen(false)}
      footer={false}
      closable={false}
    >
      <div className="flex flex-col gap-4 w-full">
        {' '}
        {/* Wrap entire content in flex container */}
        <div className="flex items-center p-3 rounded-lg mb-4">
          {' '}
          {/* Top section */}
          <div className="flex items-center">
            <PauseCircleFilled
              style={{
                fontSize: '32px',
                color: 'red',
                marginRight: '16px',
                marginBottom: '16px',
              }}
            />
            <h2 className="text-xl font-semibold mb-4">{reqNoTitle}</h2>
          </div>
          <TextArea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Lý do"
            autoSize={{
              minRows: 5,
              maxRows: 5,
            }}
            autoFocus={true}
          />
        </div>
        <div className="flex justify-between w-full ">
          <Button
            onClick={() => {
              setModalOpen(false)
              setReason('') // Reset reason on cancel
            }}
            type="default"
            size="large"
            className="w-1/2 mr-2"
          >
            Hủy
          </Button>
          <Button
            type="primary"
            confirm
            onClick={() => {
              confirm()
              //setReason('')
            }}
            className="w-1/2"
            size="large"
          >
            Xác nhận
          </Button>
        </div>
      </div>
    </Modal>
  )
}
