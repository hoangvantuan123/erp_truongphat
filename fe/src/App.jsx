import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import UserRouter from './user/routes/userRouter'
import './App.css'
import '@glideapps/glide-data-grid/dist/index.css'
import { Modal } from 'antd'
import { initializeDatabase } from './IndexedDB/initializeDatabase'
const App = () => {
  const [isModalVisible, setIsModalVisible] = useState(false)

  const isIndexedDBSupported = () => {
    return 'indexedDB' in window
  }
  const isWebWorkerSupported = () => {
    return typeof Worker !== 'undefined'
  }
  const checkBrowserSupport = () => {
    const indexedDBSupported = isIndexedDBSupported()
    const webWorkerSupported = isWebWorkerSupported()

    if (!indexedDBSupported) {
      setIsModalVisible(true)
    }

    if (!webWorkerSupported) {
      setIsModalVisible(true)
    }

    if (!indexedDBSupported || !webWorkerSupported) {
      setIsModalVisible(true)
    }
  }

  useEffect(() => {
    checkBrowserSupport()
  }, [])
  useEffect(() => {
    const initialize = async () => {
      await initializeDatabase();
    };

    initialize();
  }, []);


  
  return (
    <div className="h-screen overflow-hidden ">
      <UserRouter />
      <Modal
        title="Cảnh báo"
        open={isModalVisible}
        footer={null}
        closable={false}
        maskClosable={false}
        centered={true}
      >
        <p>
          Môi trường của bạn không hỗ trợ các tính năng cần thiết. Vui lòng sử
          dụng môi trường hiện đại hơn để tiếp tục.
        </p>
      </Modal>
    </div>
  )
}

export default App
