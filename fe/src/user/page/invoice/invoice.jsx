import { useState, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import { Viewer, Worker } from '@react-pdf-viewer/core'
import '@react-pdf-viewer/core/lib/styles/index.css'
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout'
import '@react-pdf-viewer/default-layout/lib/styles/index.css'
import { getQInvoiceSeq } from '../../../features/invocie/getQSeq'
import { HOST_API_SERVER_9 } from '../../../services'
import { getAInvoice } from '../../../features/invocie/postA'

import {
  Input,
  Modal,
  Typography,
  Form,
  Select,
  Button,
  Card,
  Divider,
  Space,
  Switch,
  Checkbox,
  Drawer,
  Radio,
  message,
  InputNumber,
  Alert,
  Spin,
  Row,
  Col,
  Empty,
} from 'antd'
const { Title } = Typography
const InvoiceView = ({
  isOpenPrint,
  setIsOpenPrint,
  helpTemp,
  path,
  dataPrint,
  setDataPrint,
}) => {
  const navigate = useNavigate()
  const generateInvoiceCode = () => {
    const now = new Date()
    return `INV-${now.getFullYear()}${(now.getMonth() + 1)
      .toString()
      .padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}-${now
      .getHours()
      .toString()
      .padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}${now
      .getSeconds()
      .toString()
      .padStart(2, '0')}${now.getMilliseconds().toString().padStart(3, '0')}`
  }

  const handleBack = () => {
    navigate(-1)
  }
  const defaultLayoutPluginInstance = defaultLayoutPlugin()
  const { id } = useParams()
  const [pdfUrl, setPdfUrl] = useState('')
  const [gridData, setGridData] = useState([])
  const [loading, setLoading] = useState(false)
  const [isAPISuccess, setIsAPISuccess] = useState(true)
  const [temp, setTemp] = useState(null)
  const fetchData = useCallback(async (id) => {
    if (!isAPISuccess) return
    setLoading(true)
    setIsAPISuccess(false)
    let hideLoadingMessage
    try {
      hideLoadingMessage = message.loading(
        'Đang tải dữ liệu, vui lòng chờ...',
        0,
      )
      const response = await getQInvoiceSeq(id)
      const fetchedData = response.data.data || []
      setGridData(fetchedData)
      setPdfUrl(`${HOST_API_SERVER_9}` + fetchedData[0].FormCode + `.pdf`)
    } catch (error) {
      setGridData([])
    } finally {
      if (hideLoadingMessage) hideLoadingMessage()
      setLoading(false)
      setIsAPISuccess(true)
    }
  }, [])
  const onClose = () => {
    setIsOpenPrint(false)
  }
  const handleTemp = (value) => {
    setTemp(value)

    setDataPrint((prev) => ({
      ...prev,
      templatePath: value,
      FileName: generateInvoiceCode(),
      LinkImage1: `http://localhost:8098/api/qrcode?url=${dataPrint?.ReqNo}`,
      LinkImage2:
        'https://cdn.pixabay.com/photo/2016/11/09/23/16/music-1813100_640.png',
      LinkImage3:
        'https://cdn.pixabay.com/photo/2016/11/09/23/16/music-1813100_640.png',
      LinkImage4:
        'https://cdn.pixabay.com/photo/2016/11/09/23/16/music-1813100_640.png',
      sizeImage1: [90, 90],
      sizeImage2: [200, 200],
      sizeImage3: [200, 200],
      sizeImage4: [200, 200],
    }))
  }
  const handleGenerateInvoice = async () => {
    if (!dataPrint) {
      message.error('Dữ liệu in không hợp lệ!')
      return
    }

    setLoading(true)
    const hideLoadingMessage = message.loading(
      'Đang tạo hóa đơn, vui lòng chờ...',
      0,
    )
    try {
      const response = await getAInvoice(dataPrint)
      fetchData(response.data.fileId)
      setPdfUrl(response.data.fileId)
    } catch (error) {
      message.error('Không thể tạo hóa đơn, vui lòng thử lại!')
    } finally {
      hideLoadingMessage()
      setLoading(false)
    }
  }
  return (
    <Drawer
      title={<Title level={5}></Title>}
      open={isOpenPrint}
      onClose={onClose}
      width={1200}
      styles={{
        wrapper: {
          overflow: 'hidden',
          boxShadow: '0',
        },
      }}
      bodyStyle={{ padding: 0 }}
    >
      <Form layout="" className="flex items-center justify-between  p-3">
        <Row className="gap-2 flex items-center">
          <Col>
            <Form.Item
              label={<span className="uppercase text-[9px]">Mẫu hóa đơn</span>}
              className="mb-0"
            >
              <Select
                size="middle"
                showSearch
                style={{ width: 270 }}
                onChange={handleTemp}
                options={[
                  ...(helpTemp.map((item) => ({
                    label: item?.OriginalName,
                    value: item?.Filename,
                  })) || []),
                ]}
              />
            </Form.Item>
          </Col>

          <Col>
            <Form.Item className="mb-0">
              <Button type="primary" onClick={handleGenerateInvoice}>
                Tạo hóa đơn
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <div className=" h-screen overflow-hidden">
        {pdfUrl ? (
          <div className="h-screen">
            <Worker
              workerUrl={`https://unpkg.com/pdfjs-dist@2.10.377/build/pdf.worker.min.js`}
            >
              <Viewer
                fileUrl={pdfUrl}
                plugins={[defaultLayoutPluginInstance]}
              />
            </Worker>
          </div>
        ) : (
          <>
            <div className="text-center flex flex-col items-center justify-center">
              <Empty
                description={<Typography.Text>Chưa có hóa đơn</Typography.Text>}
              >
                <Button type="primary" onClick={() => setIsOpenPrint(false)}>
                  Quay lại
                </Button>
              </Empty>
            </div>
          </>
        )}
      </div>
    </Drawer>
  )
}

export default InvoiceView
