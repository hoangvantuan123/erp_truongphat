import { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet'
import { Input, Space, Table, Typography, message, Tabs, Layout } from 'antd'
const { Title, Text } = Typography
import { FilterOutlined } from '@ant-design/icons'
import { ArrowIcon } from '../../components/icons'
import dayjs from 'dayjs'
import IQCStatusActions from '../../components/actions/material/iqcStatusActions'
import TableIQCStatus from '../../components/table/material/tableIQCStatus'
import { GetCodeHelpCombo } from '../../../features/codeHelp/getCodeHelpCombo'
import { GetIQCStatus } from '../../../features/material/getIQCStatus'
import IqcStatusQuery from '../../components/query/material/iqcStatusQuery'
import { debounce } from 'lodash'
import { useNavigate } from 'react-router-dom'
import { encodeBase64Url } from '../../../utils/decode-JWT'
import CryptoJS from 'crypto-js'
import TopLoadingBar from 'react-top-loading-bar';
export default function IQCStatus({ permissions, isMobile, controllers,
  cancelAllRequests }) {
  const loadingBarRef = useRef(null);
  const { t } = useTranslation()
  const gridRef = useRef(null)
  const navigate = useNavigate()
  const [loadingA, setLoadingA] = useState(false)
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([])
  const [dataUnit, setDataUnit] = useState([])
  const [formData, setFormData] = useState(dayjs().startOf('month'))
  const [toDate, setToDate] = useState(dayjs())
  const [blNo, setBLNo] = useState('')
  const [itemNo, setItemNo] = useState('')
  const [itemName, setItemName] = useState('')
  const [bizUnit, setBizUnit] = useState(0)
  const [checkedRowKey, setCheckedRowKey] = useState(null)
  const [keyPath, setKeyPath] = useState(null)
  const [checkedPath, setCheckedPath] = useState(false)
  const formatDate = useCallback((date) => date.format('YYYYMMDD'), [])
  const [isMinusClicked, setIsMinusClicked] = useState(false)
  const [lastClickedCell, setLastClickedCell] = useState(null)
  const [clickedRowData, setClickedRowData] = useState(null)
  const [clickedRowDataList, setClickedRowDataList] = useState([])
  const [gridData, setGridData] = useState([])
  const [isOpenDetails, setIsOpenDetails] = useState(false)
  const [isAPISuccess, setIsAPISuccess] = useState(true)

  useEffect(() => {
    const savedState = localStorage.getItem('detailsStateDelist')
    setIsOpenDetails(savedState === 'open')
  }, [])

  const handleToggle = (event) => {
    const isOpen = event.target.open
    setIsOpenDetails(isOpen)
    localStorage.setItem('detailsStateDelist', isOpen ? 'open' : 'closed')
  }

  const fetchIQCStatusData = async () => {
    if (controllers.current.fetchIQCStatusData) {
      controllers.current.fetchIQCStatusData.abort();
      controllers.current.fetchIQCStatusData = null;
      await new Promise((resolve) => setTimeout(resolve, 10));
    }
    if (loadingBarRef.current) {
      loadingBarRef.current.continuousStart();
    }
    const controller = new AbortController();
    const signal = controller.signal;

    controllers.current.fetchIQCStatusData = controller;

    setIsAPISuccess(false)
    setLoadingA(true)
    try {
      const iqcStatusResponse = await GetIQCStatus(
        formatDate(formData),
        formatDate(toDate),
        blNo,
        bizUnit,
        itemNo,
        itemName,
        signal
      )
      const fetchedData = iqcStatusResponse?.data || []
      setData(fetchedData)
      setIsAPISuccess(true)
    } catch (error) {
      setData([])
      setIsAPISuccess(true)
      message.error('Có lỗi xảy ra khi tải dữ liệu.')
    } finally {
      setLoadingA(false)
      controllers.current.fetchIQCStatusData = null;
      if (loadingBarRef.current) {
        loadingBarRef.current.complete();
      }
    }
  }

  const fetchCodeHelpData = useCallback(async () => {
    setLoading(true)
    if (controllers.current.fetchCodeHelpData) {
      controllers.current.fetchCodeHelpData.abort();
      controllers.current.fetchCodeHelpData = null;
      await new Promise((resolve) => setTimeout(resolve, 10));
    }
    if (loadingBarRef.current) {
      loadingBarRef.current.continuousStart();
    }
    const controller = new AbortController();
    const signal = controller.signal;

    controllers.current.fetchCodeHelpData = controller;

    try {
      const codeHelpResponse = await GetCodeHelpCombo(
        '',
        6,
        10003,
        1,
        '%',
        '',
        '',
        '',
        '',
        signal
      )
      setDataUnit(codeHelpResponse?.data || [])
    } catch (error) {
      setDataUnit([])
    } finally {
      setLoading(false)
      controllers.current.fetchCodeHelpData = null;
      if (loadingBarRef.current) {
        loadingBarRef.current.complete();
      }
    }
  }, [])

  const debouncedFetchCodeHelpData = useMemo(
    () => debounce(fetchCodeHelpData, 100),
    [fetchCodeHelpData],
  )

  const nextPageStockInMat = useCallback(() => {
    if (keyPath) {
      navigate(`/wms/u/warehouse/material/material-wh-stock-in/${keyPath}`)
    }
  }, [keyPath, navigate])

  const onCellClicked = (cell, event) => {
    let rowIndex

    if (cell[0] !== -1) {
      return
    }

    if (cell[0] === -1) {
      rowIndex = cell[1]
      setIsMinusClicked(true)
    } else {
      rowIndex = cell[0]
      setIsMinusClicked(false)
    }

    if (
      lastClickedCell &&
      lastClickedCell[0] === cell[0] &&
      lastClickedCell[1] === cell[1]
    ) {
      setKeyPath(null)
      setLastClickedCell(null)
      setClickedRowData(null)
      return
    }

    if (rowIndex >= 0 && rowIndex < gridData.length) {
      const rowData = gridData[rowIndex]

      const filteredData = {
        IsPass: rowData.IsPass,
        IsNG: rowData.IsNG,
        BLSeq: rowData.BLSeq,
        BLSerl: rowData.BLSerl,
        TestEndDate: rowData.TestEndDate,
        QCNo: rowData.QCNo,
        BLDate: rowData.BLDate,
        BLNo: rowData.BLNo,
        ItemName: rowData.ItemName,
        ItemNo: rowData.ItemNo,
        Spec: rowData.Spec,
        ItemSeq: rowData.ItemSeq,
        Qty: rowData.Qty,
        OKQty: rowData.OKQty,
        RealSampleQty: rowData.RealSampleQty,
        SMTestResultName: rowData.SMTestResultName,
        Remark: rowData.Remark,
        Memo1: rowData.Memo1,
        Memo2: rowData.Memo2,
      }
      const secretKey = 'TEST_ACCESS_KEY'
      const encryptedData = CryptoJS.AES.encrypt(
        JSON.stringify(filteredData),
        secretKey,
      ).toString()
      const encryptedToken = encodeBase64Url(encryptedData)
      setKeyPath(encryptedToken)
      setClickedRowData(rowData)
      setLastClickedCell(cell)
    }
  }

  useEffect(() => {
    fetchIQCStatusData()
  }, [])

  useEffect(() => {
    debouncedFetchCodeHelpData()
    return () => {
      debouncedFetchCodeHelpData.cancel()
    }
  }, [debouncedFetchCodeHelpData])
  useEffect(() => {
    cancelAllRequests();
    message.destroy();
  }, [])
  return (
    <>
      <Helmet>
        <title>ITM - {t('IQC Status')}</title>
      </Helmet>
      <TopLoadingBar color="blue" height={2} ref={loadingBarRef} />
      <div className="bg-slate-50 p-3 h-screen overflow-hidden">
        <div className="flex flex-col gap-4 md:grid md:grid-cols-4 md:grid-rows-[auto_1fr] md:gap-4 h-full">
          <div className="col-start-1 col-end-5 row-start-1 w-full rounded-lg ">
            <div className="flex items-center justify-between mb-2">
              <Title level={4} className="mt-2 uppercase opacity-85 ">
                {t('IQC Status')}
              </Title>
              <IQCStatusActions
                fetchData={fetchIQCStatusData}
                nextPageStockIn={nextPageStockInMat}
              />
            </div>
            <details
              className="group p-2 [&_summary::-webkit-details-marker]:hidden border rounded-lg bg-white"
              open
            >
              <summary className="flex cursor-pointer items-center justify-between gap-1.5 text-gray-900">
                <h2 className="text-xs font-medium flex items-center gap-2 text-blue-600 uppercase">
                  <FilterOutlined />
                  {t('Điều kiện truy vấn')}
                </h2>
                <span className="relative size-5 shrink-0">
                  <ArrowIcon />
                </span>
              </summary>
              <div className="flex p-2 gap-4">
                <IqcStatusQuery
                  formData={formData}
                  setFormData={setFormData}
                  setBLNo={setBLNo}
                  setToDate={setToDate}
                  toDate={toDate}
                  blNo={blNo}
                  bizUnit={bizUnit}
                  setBizUnit={setBizUnit}
                  dataUnit={dataUnit}
                  setItemNo={setItemNo}
                  itemNo={itemNo}
                  setItemName={setItemName}
                  itemName={itemName}
                />
              </div>
            </details>
          </div>

          <div className="col-start-1 col-end-5 row-start-2 w-full h-full rounded-lg">
            <TableIQCStatus
              data={data}
              loading={loading}
              setData={setData}
              onCellClicked={onCellClicked}
              setGridData={setGridData}
              gridData={gridData}
            />
          </div>
        </div>
      </div>
    </>
  )
}
