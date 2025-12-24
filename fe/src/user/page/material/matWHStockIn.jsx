import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet'
import { Typography, message, Modal } from 'antd'
const { Title } = Typography
import 'moment/locale/vi'
import MatWHStockInActions from '../../components/actions/material/matWHStockInActions'
import TableTransferMatWHStockInBarcode from '../../components/table/material/tableTransferMatWHStockInBarcode'
import { FilterOutlined } from '@ant-design/icons'
import MatWHStockInQuery from '../../components/query/material/matWHStockInQuery'
import { ArrowIcon } from '../../components/icons'
import CryptoJS from 'crypto-js'
import ModalMatWHStockIn from '../../components/modal/material/modalMatWHStockIn'
import ErrorPage from '../../components/modal/default/errorPage'
import { GetMatWHStockInList } from '../../../features/material/getMatWHStockInList'
import debounce from 'lodash.debounce'
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '../../../utils/constants'
import { CheckAllProceduresMatWHStockIn } from '../../../features/material/postCheckAllProceduresMatWHStockIn'
import LoadSubmit from '../default/loadSubmit'
import SuccessSubmit from '../default/successSubmit'
import { CompactSelection } from '@glideapps/glide-data-grid'
import { escapeXml } from '../../../utils/escapeXml'
import TopLoadingBar from 'react-top-loading-bar';
export default function MatWHStockIn({ permissions, isMobile, controllers,
  cancelAllRequests }) {
  const loadingBarRef = useRef(null);
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { id } = useParams()

  const [loading, setLoading] = useState(true)
  const gridRef = useRef(null)
  const [result, setResult] = useState(null)
  const [loadingSave, setLoadingSave] = useState(false)
  const [data, setData] = useState([])
  const bufferRef = useRef('')
  const dataRef = useRef(data)
  const [modal2Open, setModal2Open] = useState(false)
  const [modal3Open, setModal3Open] = useState(false)
  const [modal4Open, setModal4Open] = useState(false)
  const [modal5Open, setModal5Open] = useState(false)
  const [error, setError] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [status, setStatus] = useState(false)
  const [filteredData, setFilteredData] = useState(null)
  const secretKey = 'TEST_ACCESS_KEY'
  const [selection, setSelection] = useState({
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty(),
  })

  const [isOpenDetails, setIsOpenDetails] = useState(false)

  useEffect(() => {
    const savedState = localStorage.getItem('detailsStateMatWH')
    setIsOpenDetails(savedState === 'open')
  }, [])

  const handleToggle = (event) => {
    const isOpen = event.target.open
    setIsOpenDetails(isOpen)
    localStorage.setItem('detailsStateMatWH', isOpen ? 'open' : 'closed')
  }

  const Format = useCallback((date) => {
    const d = new Date(date)
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${year}${month}${day}`
  }, [])

  const DateIn = Format(new Date())

  const decodeBase64Url = (base64Url) => {
    try {
      let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      const padding =
        base64.length % 4 === 0 ? '' : '='.repeat(4 - (base64.length % 4))
      return base64 + padding
    } catch (error) {
      throw new Error('Invalid Base64 URL')
    }
  }

  const fetchMatWHData = async (blSeq, blSerl) => {
    if (controllers.current.fetchMatWHData) {
      controllers.current.fetchMatWHData.abort();
      controllers.current.fetchMatWHData = null;
      await new Promise((resolve) => setTimeout(resolve, 10));
    }
    if (loadingBarRef.current) {
      loadingBarRef.current.continuousStart();
    }
    const controller = new AbortController();
    const signal = controller.signal;

    controllers.current.fetchMatWHData = controller;
    try {
      setLoading(true)
      const response = await GetMatWHStockInList(blSeq, blSerl, signal)
      setData(response?.data || [])
    } catch (error) {
      setData([])
    } finally {
      setLoading(false)
      if (loadingBarRef.current) {
        loadingBarRef.current.complete();
      }
      controllers.current.fetchMatWHData = null;
    }
  }

  const decryptData = (encryptedToken) => {
    try {
      const base64Data = decodeBase64Url(encryptedToken)
      const bytes = CryptoJS.AES.decrypt(base64Data, secretKey)
      const decryptedData = bytes.toString(CryptoJS.enc.Utf8)
      return JSON.parse(decryptedData)
    } catch (error) {
      navigate(`/wms/u/warehouse/material/waiting-iqc-status`)
      setModal3Open(true)
      return null
    }
  }

  useEffect(() => {
    if (id) {
      const data = decryptData(id)
      if (data) {
        setFilteredData(data)
        fetchMatWHData(data?.BLSeq, data?.BLSerl)
      }
    }
  }, [id])

  const createXmlDataCloseCheck = (data) => {
    return `
        <DataBlock1>
            <WorkingTag>A</WorkingTag>
            <IDX_NO>1</IDX_NO>
            <Status>0</Status>
            <DataSeq>1</DataSeq>
            <Selected>1</Selected>
            <TABLE_NAME>DataBlock1</TABLE_NAME>
            <IsChangedMst>1</IsChangedMst>
            <BizUnit>${escapeXml(data.BizUnit)}</BizUnit>
            <Date>${data.InOutDate}</Date>
            <ServiceSeq>2669</ServiceSeq>
            <MethodSeq>2</MethodSeq>
            <DtlUnitSeq>1</DtlUnitSeq>
        </DataBlock1>
    `
  }

  // Hàm tạo XML cho CloseItemCheck
  const createXmlCloseItemCheck = (row, index) => `
    <DataBlock2>
        <WorkingTag>A</WorkingTag>
        <IDX_NO>${index + 1}</IDX_NO>
        <DataSeq>${index + 1}</DataSeq>
        <Status>0</Status>
        <Selected>0</Selected>
        <ItemSeq>${row.ItemSeq}</ItemSeq>
        <ServiceSeq>2669</ServiceSeq>
        <MethodSeq>0</MethodSeq>
        <BizUnit>${escapeXml(row.BizUnit)}</BizUnit>
        <Date>${row.InOutDate}</Date>
        <DeptSeq>${row.DeptSeq}</DeptSeq>
        <BizUnitOld>${row.BizUnit}</BizUnitOld>
        <DateOld>${row.InOutDate}</DateOld>
        <DeptSeqOld>${row.DeptSeq}</DeptSeqOld>
    </DataBlock2>
`

  // Hàm tạo XML cho InOutDailyCheck
  const createXmlInOutDailyCheck = (data) => {
    return `
        <DataBlock1>
            <WorkingTag>A</WorkingTag>
            <IDX_NO>1</IDX_NO>
            <Status>0</Status>
            <DataSeq>1</DataSeq>
            <Selected>1</Selected>
            <TABLE_NAME>DataBlock1</TABLE_NAME>
            <IsChangedMst>0</IsChangedMst>
            <InOutSeq>0</InOutSeq>
            <InOutNo />
            <InOutType>82</InOutType>
            <InOutDetailType>0</InOutDetailType>
            <IsTrans>0</IsTrans>
            <IsCompleted>1</IsCompleted>
            <CompleteDeptSeq>${data.DeptSeq}</CompleteDeptSeq>
            <CompleteEmpSeq>${data.EmpSeq}</CompleteEmpSeq>
            <CompleteDate>${data.InOutDate}</CompleteDate>
            <ReqBizUnit>${escapeXml(data.BizUnit)}</ReqBizUnit>
            <ReqBizUnitName>${data.BizUnitName}</ReqBizUnitName>
            <InWHSeq>${data.MatWhSeq}</InWHSeq>
            <InWHName>${data.MatWhName}</InWHName>
            <InOutDate>${data.InOutDate}</InOutDate>
            <BizUnit>${escapeXml(data.BizUnit)}</BizUnit>
            <BizUnitName>${data.BizUnitName}</BizUnitName>
            <OutWHSeq>${data.WaitWhSeq}</OutWHSeq>
            <OutWHName>${data.WaitWhName}</OutWHName>
            <DeptSeq>${data.DeptSeq}</DeptSeq>
            <DeptName>${data.DeptName}</DeptName>
            <EmpSeq>${data.EmpSeq}</EmpSeq>
            <EmpName>${data.EmpName}</EmpName>
            <Remark />
            <Memo />
        </DataBlock1>
    `
  }

  // Hàm tạo XML cho InOutDailyItemCheck
  const createXmlInOutDailyItemCheck = (row, index) => `
    <DataBlock2>
        <WorkingTag>A</WorkingTag>
        <IDX_NO>${index + 1}</IDX_NO>
        <DataSeq>${index + 1}</DataSeq>
        <Status>0</Status>
        <Selected>0</Selected>
        <InOutSerl>0</InOutSerl>
        <InOutKind>8023008</InOutKind>
        <ItemName>${escapeXml(row.ItemName)}</ItemName>
        <ItemNo>${row.ItemNo}</ItemNo>
        <Spec>${row.Spec}</Spec>
        <ItemSeq>${row.ItemSeq}</ItemSeq>
        <UnitName>${escapeXml(row.UnitName)}</UnitName>
        <UnitSeq>${row.UnitSeq}</UnitSeq>
        <Qty>${row.Qty}</Qty>
        <InOutDetailKindName>Sản phẩm bình thường</InOutDetailKindName>
        <InOutDetailKind>8012001</InOutDetailKind>
        <STDUnitName>${escapeXml(row.UnitName)}</STDUnitName>
        <STDQty>${row.Qty}</STDQty>
        <SerialNo />
        <LotNo>${row.LotNo}</LotNo>
        <InOutRemark>WEB</InOutRemark>
        <InWHName>${escapeXml(row.MatWhName)}</InWHName>
        <InWHSeq>${row.MatWhSeq}</InWHSeq>
        <OutWHName>${escapeXml(row.WaitWhName)}</OutWHName>
        <OutWHSeq>${row.WaitWhSeq}</OutWHSeq>
        <Price>0</Price>
        <Amt>0</Amt>
        <EtcOutAmt>0</EtcOutAmt>
        <EtcOutVAT>0</EtcOutVAT>
        <OriQty>0</OriQty>
        <OriSTDQty>0</OriSTDQty>
        <TABLE_NAME>DataBlock2</TABLE_NAME>
        <InOutSeq />
        <InOutType>82</InOutType>
    </DataBlock2>
`

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault()
      setLoadingSave(true)
      setResult(null)
      setModal4Open(true)
      if (loadingBarRef.current) {
        loadingBarRef.current.continuousStart();
      }
      if (data.length === 0) {
        setLoadingSave(false)
        setModal2Open(true)
        setModal4Open(false)
        setResult(null)
        setError('Chưa có dữ liệu để gửi. Vui lòng quét dữ liệu trước khi gửi.')
        return
      }
      const xmlSCOMCloseCheckWEB = createXmlDataCloseCheck(data[0])
      const xmlSCOMCloseItemCheckWEB = data
        .map(createXmlCloseItemCheck)
        .join('\n')
      const xmlInOutDailyCheckWEB = createXmlInOutDailyCheck(data[0])
      const xmlInOutDailyItemCheckWEB = data
        .map(createXmlInOutDailyItemCheck)
        .join('\n')

      try {
        const response = await CheckAllProceduresMatWHStockIn(data, {
          xmlSCOMCloseCheckWEB: xmlSCOMCloseCheckWEB,
          xmlSCOMCloseItemCheckWEB: xmlSCOMCloseItemCheckWEB,
          xmlInOutDailyCheckWEB: xmlInOutDailyCheckWEB,
          xmlInOutDailyItemCheckWEB: xmlInOutDailyItemCheckWEB,
        })

        setResult(response)
        if (response.success) {
          navigate(`/wms/u/warehouse/material/waiting-iqc-status`)
          setModal4Open(false)
          setModal5Open(true)
          setSuccessMessage('Tất cả các dữ liệu đã được thực thi thành công!')
          setData([])
        } else {
          setModal4Open(false)
          setModal2Open(true)
          setError(response.message)
        }
      } catch (error) {
        setModal4Open(false)
        setResult({ error: error.message })
        setModal2Open(true)
        setError(error.message)
      } finally {
        if (loadingBarRef.current) {
          loadingBarRef.current.complete();
        }
        setLoadingSave(false)
      }
    },
    [data],
  )
  useEffect(() => {
    cancelAllRequests();
    message.destroy();
  }, [])
  return (
    <>
      <Helmet>
        <title>ITM - {t('Material WH Stock In')}</title>
      </Helmet>
      <TopLoadingBar color="blue" height={2} ref={loadingBarRef} />
      <div className="bg-slate-50 p-3 h-screen overflow-hidden">
        <div className="flex flex-col gap-4 md:grid md:grid-cols-4 md:grid-rows-[auto_1fr] md:gap-4 h-full">
          <div className="col-start-1 col-end-5 row-start-1 w-full rounded-lg ">
            <div className="flex items-center justify-between mb-2">
              <Title level={4} className="mt-2 uppercase opacity-85">
                Material WH Stock In
              </Title>
              <MatWHStockInActions
                status={status}
                handleSubmit={handleSubmit}
              />
            </div>
            <details
              className="group p-2 [&_summary::-webkit-details-marker]:hidden border rounded-lg bg-white"
              open={isOpenDetails}
              onToggle={handleToggle}
            >
              <summary className="flex cursor-pointer items-center justify-between gap-1.5 text-gray-900">
                <h2 className="text-xs font-medium flex items-center gap-2 text-blue-600">
                  <FilterOutlined />
                  {t('Điều kiện truy vấn')}
                </h2>
                <span className="relative size-5 shrink-0">
                  <ArrowIcon />
                </span>
              </summary>
              <div className="flex p-2 gap-4">
                <MatWHStockInQuery filteredData={filteredData} />
              </div>
            </details>
          </div>

          <div className="col-start-1 col-end-5 row-start-2 w-full h-full rounded-lg  overflow-auto">
            <TableTransferMatWHStockInBarcode
              data={data}
              loading={loading}
              setData={setData}
            />
          </div>
        </div>
      </div>
      <ModalMatWHStockIn
        modal2Open={modal2Open}
        setModal2Open={setModal2Open}
        error={error}
      />
      <LoadSubmit setModal4Open={setModal4Open} modal4Open={modal4Open} />
      <SuccessSubmit
        setModal5Open={setModal5Open}
        modal5Open={modal5Open}
        successMessage={successMessage}
      />
      <ErrorPage
        modal3Open={modal3Open}
        setModal3Open={setModal3Open}
        pathRouter="/wms/u/warehouse/material/waiting-iqc-status"
      />
    </>
  )
}
