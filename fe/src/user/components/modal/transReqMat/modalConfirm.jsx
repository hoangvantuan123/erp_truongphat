import { Modal, Input } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
export default function ModalConfirm({
  modalOpen,
  setmodalOpen,
  MessageConfirm,
  onOk,
  resetTable,
  setKeyPath,
  isShowInput,
  reason,
  setReason,
  placeholderMessage,

}) {
  const handelOnCancel = () => {
    setmodalOpen(false)
    if (typeof resetTable === 'function') {
      resetTable()
    }
    if (typeof setKeyPath === 'function') {
      setKeyPath(null)
    }
  }
  return (
    <Modal
      centered
      open={modalOpen}
      onOk={onOk}
      onCancel={handelOnCancel}
      maskClosable={false}
      closable={false}
    >
      <div className="items-center justify-center flex flex-col">
        <ExclamationCircleOutlined className=" text-4xl mb-2 text-red-500" />
        <p className="mt-10 text-lg">{MessageConfirm}</p>
      </div>
      {
        isShowInput && (
          <div className="items-center justify-center flex flex-col mt-4">
          <Input
            className="text-sm p-2 bg-blue-50 h-36"
            value={reason}
            placeholder={placeholderMessage}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>
        )
      }
      
    </Modal>
  )
}
