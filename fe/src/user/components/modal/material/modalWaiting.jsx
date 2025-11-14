import { useEffect } from 'react'
import { Modal, Button, Select, Input } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
export default function ModalWaiting({
  modal2Open,
  setModal2Open,
  error,
  resetTable,
  setKeyPath,
}) {
  const handelOnCancel = () => {
    setModal2Open(false)
    if (typeof resetTable === 'function') {
      resetTable()
    }
    if (typeof setKeyPath === 'function') {
      setKeyPath(null)
    }
  }
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Enter') {
        setModal2Open(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [setModal2Open])
  return (
    <Modal
      centered
      open={modal2Open}
      onOk={() => setModal2Open(false)}
      onCancel={handelOnCancel}
      closable={false}
      footer={false}
    >
      <div className="items-center justify-center flex flex-col">
        <ExclamationCircleOutlined className=" text-4xl mb-2 text-red-500" />
        <p className="mt-10 text-lg">{error}</p>
        <Button
          type="primary"
          onClick={() => setModal2Open(false)}
          className="mt-5 w-full"
        >
          OK
        </Button>
      </div>
    </Modal>
  )
}
