import { useState, useCallback, useEffect, useRef, useMemo, lazy } from 'react'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet'
import {
  Input,
  notification,
  Table,
  Typography,
  message,
  Spin,
  Layout,
} from 'antd'
const { Title, Text } = Typography
import { FilterOutlined, LoadingOutlined } from '@ant-design/icons'
import { ArrowIcon } from '../../components/icons'
import dayjs from 'dayjs'
import { GetCodeHelpCombo } from '../../../features/codeHelp/getCodeHelpCombo'
import { debounce } from 'lodash'
import { useNavigate } from 'react-router-dom'
import { encodeBase64Url } from '../../../utils/decode-JWT'
import CryptoJS from 'crypto-js'
import LGWHStockRealOpenListQuery from '../../components/query/warehouse/lgWHStockRealOpenListQuery'
import LGWHStockRealOpenListActions from '../../components/actions/warehouse/lgWHStockRealOpenListActions'
import TableLGWHStockRealOpenList from '../../components/table/warehouse/tableLGWHStockRealOpenList'
import { GetSLGWHStockRealOpenListQuery } from '../../../features/warehouse/postSLGWHStockRealOpenListQuery'
import { GetCodeHelp } from '../../../features/codeHelp/getCodeHelp'
import { CompactSelection, GridColumnIcon } from '@glideapps/glide-data-grid'
import { loadFromLocalStorageSheet } from '../../../localStorage/sheet/sheet'
import { onRowAppended } from '../../components/sheet/js/onRowAppended'
import ModalWaiting from '../../components/modal/material/modalWaiting'
import TopLoadingBar from 'react-top-loading-bar'
import { togglePageInteraction } from '../../../utils/togglePageInteraction'

export default function LGWHStockRealOpenList({
  permissions,
  isMobile,
  canEdit,
  setCollapsed,
  collapsed,
  abortControllerRef,
  controllers,
  cancelAllRequests,
}) {
  const loadingBarRef = useRef(null)
  const { t } = useTranslation()
  const userInfo = localStorage.getItem('userInfo')
  const parsedUserInfo = JSON.parse(userInfo)
  const gridRef = useRef(null)
  const navigate = useNavigate()

  const defaultCols = useMemo(
    () => [
      {
        title: '',
        id: 'Status',
        kind: 'Text',
        readonly: true,
        width: 50,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderLookup,
      },

      {
        title: t('Đã nhập kết quả?'),
        id: 'IsStkReal',
        kind: 'Boolean',
        readonly: true,
        width: 120,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderBoolean,
      },

      {
        title: t('2'),
        id: 'BizUnitName',
        kind: 'Text',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderString,
      },
      {
        title: t('21653'),
        id: 'StkMngSeq',
        kind: 'Text',
        readonly: true,
        width: 100,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderString,
      },
      {
        title: t('21656'),
        id: 'StkMngNo',
        kind: 'Text',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderString,
      },
      {
        title: t('Kho kiểm kê'),
        id: 'WHName',
        kind: 'Text',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderString,
      },
      {
        title: t('Mã Kho kiểm kê'),
        id: 'WHSeq',
        kind: 'Text',
        readonly: true,
        width: 100,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderString,
      },
      {
        title: t('21652'),
        id: 'StkDate',
        kind: 'Text',
        readonly: true,
        width: 120,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderDate,
      },
      {
        title: t('360'),
        id: 'EmpName',
        kind: 'Text',
        readonly: true,
        width: 200,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderString,
      },
      {
        title: t('4780'),
        id: 'EmpSeq',
        kind: 'Text',
        readonly: true,
        width: 100,
        hasMenu: true,
        visible: false,
        icon: GridColumnIcon.HeaderString,
      },
    ],

    [t],
  )
  const [data, setData] = useState([])
  const [dataBizUnit, setDataBizUnit] = useState([])
  const [dataStatus, setDataStatus] = useState([])
  const [dataTypeName, setDataTypeName] = useState([])
  const [dataStockType, setDataStockType] = useState([])

  const [dataWarehouse, setDataWarehouse] = useState([])
  const [dataDeptName, setDataDeptName] = useState([])
  const [dataUserName, setDataUserName] = useState([])
  const [dataCustName, setDataCustName] = useState([])

  const [fromDate, setFromDate] = useState(dayjs().startOf('month') || '')
  const [toDate, setToDate] = useState(dayjs())

  const [bizUnit, setBizUnit] = useState('0')
  const [itemName, setItemName] = useState('')
  const [itemNo, setItemNo] = useState('')
  const [typeName, setTypeName] = useState('0')
  const [stockType, setStockType] = useState('0')
  const [status, setStatus] = useState('0')

  const [etcInReq, setEtcInReq] = useState('')

  const [keyPath, setKeyPath] = useState(null)
  const [keyPathCheck, setKeyPathCheck] = useState(null)
  const formatDate = (date) => date.format('YYYYMMDD')

  //Sheet
  const [isOpenDetails, setIsOpenDetails] = useState(false)
  const [gridData, setGridData] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isQuery, setIsQuery] = useState(false)
  const [selection, setSelection] = useState({
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty(),
  })
  const [showSearch, setShowSearch] = useState(false)
  const [lastClickedCell, setLastClickedCell] = useState(null)
  const [addedRows, setAddedRows] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSent, setIsSent] = useState(false)
  const [editedRows, setEditedRows] = useState([])
  const [clickedRowData, setClickedRowData] = useState(null)
  const [isMinusClicked, setIsMinusClicked] = useState(false)
  const [numRowsToAdd, setNumRowsToAdd] = useState(null)
  const [numRows, setNumRows] = useState(0)
  const [clickCount, setClickCount] = useState(false)
  const [openHelp, setOpenHelp] = useState(false)
  const [isCellSelected, setIsCellSelected] = useState(false)
  const [onSelectRow, setOnSelectRow] = useState([])
  const [keySelectColumn, setKeySelectColumn] = useState(false)

  const [cols, setCols] = useState(() =>
    loadFromLocalStorageSheet(
      'S_ERP_COLS_PAGE_STOCK_REAL_OPEN_LIST',
      defaultCols.filter((col) => col.visible),
    ),
  )
  useEffect(() => {
    setCols(defaultCols.filter((col) => col.visible))
  }, [defaultCols])
  const [dataError, setDataError] = useState([])
  const [whName, setWhName] = useState('')
  const [whSeq, setWhSeq] = useState('')
  const [stkMngNo, setStkMngNo] = useState('')
  /* CodeHelp */
  const [empName, setEmpName] = useState('')
  const [empSeq, setEmpSeq] = useState('')

  const [checkIsStop, setCheckIsStop] = useState(false)
  const [checkIsConfirm, setCheckIsConfirm] = useState(false)
  const [isAPISuccess, setIsAPISuccess] = useState(true)
  const [reqNoTitle, setReqNoTitle] = useState('')
  const [isConfirm, setIsConfirm] = useState('')
  const [isStop, setIsStop] = useState('0')
  const [rowIndex, setRowIndex] = useState('')

  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isModalWarning, setIsModalWarning] = useState(false)

  const [selection2, setSelection2] = useState({
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty(),
  })
  const [selection3, setSelection3] = useState({
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty(),
  })

  const resetTable = () => {
    setSelection({
      columns: CompactSelection.empty(),
      rows: CompactSelection.empty(),
    })
  }
  const resetTable2 = () => {
    setSelection2({
      columns: CompactSelection.empty(),
      rows: CompactSelection.empty(),
    })
  }
  const resetTable3 = () => {
    setSelection3({
      columns: CompactSelection.empty(),
      rows: CompactSelection.empty(),
    })
  }
  useEffect(() => {
    cancelAllRequests()
    message.destroy()
    if (parsedUserInfo && parsedUserInfo.UserName) {
      setEmpName(parsedUserInfo.UserName)
      setEmpSeq(parsedUserInfo.EmpSeq)
    }
  }, [])

  const fetchSLGWHStockRealOpenListQueryWEB = async () => {
    if (isAPISuccess === false) {
      message.warning('Không thể thực hiện, vui lòng kiểm tra trạng thái.')
      return
    }

    setIsAPISuccess(false)
    if (loadingBarRef.current) {
      loadingBarRef.current.continuousStart()
    }
    try {
      const data = [
        {
          IsChangedMst: typeName === undefined ? '0' : typeName,
          BizUnit: bizUnit,
          StkDate: fromDate ? formatDate(fromDate) : '',
          StkDateTo: toDate ? formatDate(toDate) : '',
          WHSeq: whSeq,
          StkMngNo: stkMngNo,
          EmpSeq: empSeq,
        },
      ]

      const response = await GetSLGWHStockRealOpenListQuery(data)
      if (response.data.success) {
        const fetchedData = response.data.data || []
        setIsQuery(true)
        setData(fetchedData)
        setGridData(fetchedData)
        setIsAPISuccess(true)
        if (loadingBarRef.current) {
          loadingBarRef.current.complete()
        }
        setNumRows(fetchedData.length)
        resetTable()
      } else {
        setGridData([])
        setIsAPISuccess(true)
        if (loadingBarRef.current) {
          loadingBarRef.current.complete()
        }
        message.error('Có lỗi xảy ra khi tải dữ liệu.')
      }
    } catch (error) {
      setIsAPISuccess(true)
      if (loadingBarRef.current) {
        loadingBarRef.current.complete()
      }
      message.error('Có lỗi xảy ra khi tải dữ liệu.')
    } finally {
      setIsAPISuccess(true)
      //if (loadingBarRef.current) {
      //loadingBarRef.current.complete()
      //}
    }
  }

  const fetchCodeHelpData = useCallback(async () => {
    if (controllers.current.fetchCodeHelpController) {
      controllers.current.fetchCodeHelpController.abort()
      controllers.current.fetchCodeHelpController = null
      await new Promise((resolve) => setTimeout(resolve, 10))
    }
    if (loadingBarRef.current) {
      loadingBarRef.current.continuousStart()
    }
    const controller = new AbortController()
    const signal = controller.signal

    controllers.current.fetchCodeHelpController = controller
    try {
      const [codeHelpBizUnit, codeHelpWarehouse, codeHelpUserName] =
        await Promise.all([
          GetCodeHelpCombo('', 6, 10003, 1, '%', '', '', '', ''),
          GetCodeHelp(
            10006,
            '',
            bizUnit || '',
            '',
            '',
            '',
            '1',
            '',
            1,
            '',
            0,
            0,
            0,
          ),
          GetCodeHelp(90003, '', '', '', '', '', '1', '', 1, '', 0, 0, 0),
        ])

      setDataBizUnit(codeHelpBizUnit?.data || [])
      setDataWarehouse(codeHelpWarehouse?.data || [])
      setDataUserName(codeHelpUserName?.data || [])
    } catch (error) {
      setDataBizUnit([])
      setDataWarehouse([])
      setDataUserName([])
    } finally {
      if (loadingBarRef.current) {
        loadingBarRef.current.complete()
      }
      controllers.current.fetchCodeHelpController = null
    }
  }, [bizUnit])

  const debouncedFetchCodeHelpData = useMemo(
    () => debounce(fetchCodeHelpData, 100),
    [fetchCodeHelpData],
  )

  useEffect(() => {
    debouncedFetchCodeHelpData()
    return () => {
      debouncedFetchCodeHelpData.cancel()
    }
  }, [debouncedFetchCodeHelpData])

  const handClose = () => {
    setCollapsed(!collapsed)
    localStorage.setItem('COLLAPSED_STATE', false)
  }

  // const nextPage = useCallback(() => {
  //   if (keyPath) {
  //     navigate(`/wms/u/warehouse/stock-real/stock-real-open/${keyPath}`)
  //     handClose()
  //   }
  // }, [keyPath, navigate])

  // const nextPageCheck = useCallback(() => {
  //   if (keyPathCheck) {
  //     navigate(
  //       `/wms/u/warehouse/stock-real/stock-real-open-result/${keyPathCheck}`,
  //     )
  //     handClose()
  //   }
  // }, [keyPathCheck, navigate])

  const nextPage = useCallback(() => {
    if (keyPath) {
      window.open(
        `/wms/u/warehouse/stock-real/stock-real-open/${keyPath}`,
        '_blank',
      )
    }
  }, [keyPath])

  const nextPageCheck = useCallback(() => {
    if (keyPath) {
      window.open(
        `/wms/u/warehouse/stock-real/stock-real-open-result/${keyPath}`,
        '_blank',
      )
    }
  }, [keyPath])
  //Sheet

  const getSelectedRowsData = () => {
    const selectedRows = selection.rows.items

    return selectedRows.flatMap(([start, end]) =>
      Array.from({ length: end - start }, (_, i) => gridData[start + i]).filter(
        (row) => row !== undefined,
      ),
    )
  }
  useEffect(() => {
    const data = getSelectedRowsData()
    if (data && data.length > 0) {
      if (data[0].StkMngSeq !== '') {
        const filteredData = {
          StkMngSeq: data[0].StkMngSeq,
          IsStkReal: data[0].IsStkReal,
        }
        const secretKey = 'TEST_ACCESS_KEY'
        const encryptedData = CryptoJS.AES.encrypt(
          JSON.stringify(filteredData),
          secretKey,
        ).toString()
        const encryptedToken = encodeBase64Url(encryptedData)
        setKeyPath(encryptedToken)
      } else {
        setKeyPath(null)
      }
    } else {
      setKeyPath(null)
    }
  }, [selection.rows.items, gridData])

  const handleRowAppend = useCallback(
    (numRowsToAdd) => {
      onRowAppended(cols, setGridData, setNumRows, setAddedRows, numRowsToAdd)
    },
    [cols, setGridData, setNumRows, setAddedRows, numRowsToAdd],
  )

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault()
        setShowSearch(true)
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'q') {
        fetchSLGWHStockRealOpenListQueryWEB()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [fetchSLGWHStockRealOpenListQueryWEB])

  return (
    <>
      <Helmet>
        <title>ITM - {t('Truy vấn kiểm tra tồn kho thực tế')}</title>
      </Helmet>
      <TopLoadingBar color="blue" height={2} ref={loadingBarRef} />
      <div className="bg-slate-50 p-3  h-[calc(100vh-30px)] overflow-hidden">
        <div className="flex flex-col gap-4 md:grid md:grid-cols-4 md:grid-rows-[auto_1fr] md:gap-4 h-full">
          <div className="col-start-1 col-end-5 row-start-1 w-full rounded-lg ">
            <div className="flex items-center justify-between mb-2">
              <Title level={4} className="mt-2 uppercase opacity-85 ">
                {t('Truy vấn kiểm tra tồn kho thực tế')}
              </Title>
              <LGWHStockRealOpenListActions
                nextPage={nextPage}
                nextPageCheck={nextPageCheck}
                debouncedFetchSLGWHStockRealOpenListQueryWEB={
                  fetchSLGWHStockRealOpenListQueryWEB
                }
              />
            </div>
            <details
              className="group p-2 [&_summary::-webkit-details-marker]:hidden border rounded-lg bg-white"
              open
            >
              <summary className="flex cursor-pointer items-center justify-between gap-1.5 text-gray-900">
                <h2 className="text-xs font-medium flex items-center gap-2 text-blue-600 uppercase">
                  <FilterOutlined />
                  {t('359')}
                </h2>
                <span className="relative size-5 shrink-0">
                  <ArrowIcon />
                </span>
              </summary>
              <LGWHStockRealOpenListQuery
                fromDate={fromDate}
                setFromDate={setFromDate}
                setToDate={setToDate}
                toDate={toDate}
                bizUnit={bizUnit}
                dataBizUnit={dataBizUnit}
                setBizUnit={setBizUnit}
                typeName={typeName}
                dataTypeName={dataTypeName}
                setTypeName={setTypeName}
                whName={whName}
                setWhName={setWhName}
                setWhSeq={setWhSeq}
                dataWarehouse={dataWarehouse}
                userName={empName}
                setUserName={setEmpName}
                setUserSeq={setEmpSeq}
                dataUserName={dataUserName}
                stkMngNo={stkMngNo}
                setStkMngNo={setStkMngNo}
              />
            </details>
          </div>
          <div className="col-start-1 col-end-5 row-start-2 w-full h-full rounded-lg">
            {
              <TableLGWHStockRealOpenList
                setSelection={setSelection}
                selection={selection}
                showSearch={showSearch}
                setShowSearch={setShowSearch}
                setAddedRows={setAddedRows}
                addedRows={addedRows}
                setEditedRows={setEditedRows}
                editedRows={editedRows}
                setNumRowsToAdd={setNumRowsToAdd}
                clickCount={clickCount}
                numRowsToAdd={numRowsToAdd}
                numRows={numRows}
                onSelectRow={onSelectRow}
                openHelp={openHelp}
                setOpenHelp={setOpenHelp}
                setOnSelectRow={setOnSelectRow}
                setIsCellSelected={setIsCellSelected}
                isCellSelected={isCellSelected}
                setGridData={setGridData}
                gridData={gridData}
                setNumRows={setNumRows}
                setCols={setCols}
                handleRowAppend={handleRowAppend}
                cols={cols}
                defaultCols={defaultCols}
                setIsQuery={setIsQuery}
                isQuery={isQuery}
              />
            }
          </div>
        </div>
      </div>

      {/* <ModalWaiting
        modal2Open={checkIsConfirm}
        setModal2Open={setCheckIsConfirm}
        resetTable={resetTable}
        error="Đã nhập kết quả kiểm tra tồn kho thực tế!"
        setKeyPath={setKeyPathCheck}
      /> */}
    </>
  )
}
