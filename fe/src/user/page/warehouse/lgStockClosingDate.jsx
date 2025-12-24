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
import { debounce } from 'lodash'
import { useNavigate } from 'react-router-dom'
import { encodeBase64Url } from '../../../utils/decode-JWT'
import CryptoJS from 'crypto-js'
import { filterAndSelectColumnsAUD } from '../../../utils/filterSheetAUD'
import { GetCodeHelpCombo } from '../../../features/codeHelp/getCodeHelpCombo'

import LGStockClosingDateQuery from '../../components/query/warehouse/lgStockClosingDateQuery'
import LGStockClosingDateActions from '../../components/actions/warehouse/lgStockClosingDateActions'
import TableLGStockDateClosing from '../../components/table/warehouse/tableLGStockDateClosing'

import { GetSCOMClosingDateDynamicQuery } from '../../../features/warehouse/lgStockClosing/postSCOMClosingDateDynamicQuery'
import { PostAUDCloseDate } from '../../../features/warehouse/lgStockClosing/postAUDCloseDate'
import { CompactSelection, GridColumnIcon } from '@glideapps/glide-data-grid'
import { loadFromLocalStorageSheet } from '../../../localStorage/sheet/sheet'
import { onRowAppended } from '../../components/sheet/js/onRowAppended'
import ErrorListModal from '../default/errorListModal'
import TopLoadingBar from 'react-top-loading-bar'
import { togglePageInteraction } from '../../../utils/togglePageInteraction'

export default function LGStockClosingDate({
  permissions,
  isMobile,
  canEdit,
  canCreate,
  setCollapsed,
  collapsed,
  abortControllerRef,
  controllers,
  cancelAllRequests,
}) {
  const { t } = useTranslation()
  const userInfo = localStorage.getItem('userInfo')
  const parsedUserInfo = JSON.parse(userInfo)
  const gridRef = useRef(null)
  const navigate = useNavigate()
  const loadingBarRef = useRef(null)

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
        title: t('BizUnit'),
        id: 'BizUnit',
        kind: 'Text',
        readonly: true,
        width: 100,
        hasMenu: true,
        visible: false,
        icon: GridColumnIcon.HeaderString,
      },
      {
        title: t('Đơn vị kinh doanh'),
        id: 'BizUnitName',
        kind: 'Text',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderString,
      },
      {
        title: t('Ngày tháng năm'),
        id: 'ClosingDate',
        kind: 'Text',
        readonly: true,
        width: 100,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderString,
      },
      {
        title: t('Thứ'),
        id: 'ClosingDay',
        kind: 'Text',
        readonly: true,
        width: 100,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderString,
      },
      {
        title: t('Nguyên vật liệu'),
        id: 'IsCloseMaterial',
        kind: 'Boolean',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderBoolean,
      },
      {
        title: t('Hàng hóa thành phẩm'),
        id: 'IsCloseItem',
        kind: 'Boolean',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderBoolean,
      },
    ],
    [t],
  )

  const columnsError = useMemo(
    () => [
      {
        title: t('Dòng bị lỗi'),
        dataIndex: 'IDX_NO',
        key: 'IDX_NO',
        width: 100,
        icon: GridColumnIcon.HeaderString,
      },
      {
        title: t('Data'),
        dataIndex: 'Name',
        key: 'Name',
        width: 200,
        icon: GridColumnIcon.HeaderString,
      },
      {
        title: t('Kết quả'),
        dataIndex: 'result',
        key: 'result',
        width: 400,
        icon: GridColumnIcon.HeaderString,
      },
    ],
    [t],
  )

  const [data, setData] = useState([])
  const [inOutYYMM, setInOutYYMM] = useState(dayjs().startOf('month'))
  const formatDate = (date) => date.format('YYYYMM')
  const [bizUnit, setBizUnit] = useState('0')
  const [bizUnitName, setBizUnitName] = useState('')
  const [dataBizUnit, setDataBizUnit] = useState([])
  //Sheet
  const [isOpenDetails, setIsOpenDetails] = useState(false)
  const [gridData, setGridData] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)

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
  const [dataError, setDataError] = useState([])

  const [cols, setCols] = useState(() =>
    loadFromLocalStorageSheet(
      'S_ERP_COLS_PAGE_STOCK_CLOSING_DATE_LIST',
      defaultCols.filter((col) => col.visible),
    ),
  )
  useEffect(() => {
    setCols(defaultCols.filter((col) => col.visible))
  }, [defaultCols])

  const [isAPISuccess, setIsAPISuccess] = useState(true)
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

  const fetchDataQuery = async () => {
    if (isAPISuccess === false) {
      message.warning('Không thể thực hiện, vui lòng kiểm tra trạng thái.')
      return
    }

    if (!bizUnit || bizUnit === '0') {
      message.warning('Bạn chưa chọn bộ phận kinh doanh.')
      return
    }
    setIsAPISuccess(false)
    if (loadingBarRef.current) {
      loadingBarRef.current.continuousStart()
    }

    try {
      const data = [
        {
          ClosingYearMonth: inOutYYMM ? formatDate(inOutYYMM) : '',
          BizUnit: bizUnit,
        },
      ]

      const response = await GetSCOMClosingDateDynamicQuery(data)
      if (response.data.success) {
        const fetchedData = response.data.data || []
        setData(fetchedData)
        setGridData(fetchedData)
        setIsAPISuccess(true)
        if (loadingBarRef.current) {
          loadingBarRef.current.complete()
        }
        setNumRows(fetchedData.length)
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
      const [codeHelpBizUnit] = await Promise.all([
        GetCodeHelpCombo('', 6, 10003, 1, '%', '', '', '', ''),
      ])

      setDataBizUnit(codeHelpBizUnit?.data || [])
    } catch (error) {
      setDataBizUnit([])
    } finally {
      if (loadingBarRef.current) {
        loadingBarRef.current.complete()
      }
      controllers.current.fetchCodeHelpController = null
    }
  }, [])

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

  //Sheet
  const getSelectedRows = () => {
    const selectedRows = selection.rows.items
    let rows = []
    selectedRows.forEach((range) => {
      const start = range[0]
      const end = range[1] - 1

      for (let i = start; i <= end; i++) {
        if (gridData[i]) {
          gridData[i]['IdxNo'] = i + 1
          rows.push(gridData[i])
        }
      }
    })
    return rows
  }

  const handleSaveData = useCallback(async () => {
    if (isAPISuccess === false) {
      message.warning(
        'Đang thực hiện tác vụ khác, vui lòng kiểm tra trạng thái.',
      )
      return
    }
    if (canCreate === false) {
      message.warning('Bạn không có quyền xử lý tổng hợp tồn kho')
      return
    }
    const columnsA = [
      'Status',
      'RowIDX',
      'ClosingDate',
      'ClosingDay',
      'IsCloseMaterial',
      'IsCloseItem',
      'BizUnit',
      'BizUnitName',
    ]
    const dataSheetAUD = filterAndSelectColumnsAUD(gridData, columnsA)
    setIsAPISuccess(false)
    togglePageInteraction(true)
    if (loadingBarRef.current) {
      loadingBarRef.current.continuousStart()
    }
    try {
      const promises = []
      promises.push(PostAUDCloseDate(dataSheetAUD))
      const results = await Promise.all(promises)

      results.forEach((result, index) => {
        if (result.data.success) {
          const newData = result.data.data
          if (loadingBarRef.current) {
            loadingBarRef.current.complete()
            message.success('Lưu dữ liệu thành công!')
          }
          togglePageInteraction(false)
          setIsAPISuccess(true)
          setEditedRows([])
          fetchDataQuery()
        } else {
          togglePageInteraction(false)
          setIsAPISuccess(true)
          setDataError(result.data.errors)
          setIsModalVisible(true)
          if (loadingBarRef.current) {
            loadingBarRef.current.complete()
            message.error('Có lỗi xảy ra khi lưu dữ liệu')
          }
        }
      })
    } catch (error) {
      togglePageInteraction(false)
      setIsAPISuccess(true)
      if (loadingBarRef.current) {
        loadingBarRef.current.complete()
        message.error(error.message || 'Có lỗi xảy ra khi lưu dữ liệu')
      }
    }
  }, [gridData, isAPISuccess, getSelectedRows])

  const handleRowAppend = useCallback(
    (numRowsToAdd) => {
      //onRowAppended(cols, setGridData, setNumRows, setAddedRows, numRowsToAdd)
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
        fetchDataQuery()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [fetchDataQuery])

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
      setLastClickedCell(null)
      setClickedRowData(null)
      return
    }
  }

  return (
    <>
      <Helmet>
        <title>ITM - {t('Xử lý khóa sổ kho theo ngày')}</title>
      </Helmet>
      <TopLoadingBar color="blue" height={2} ref={loadingBarRef} />
      <div className="bg-slate-50 p-3  h-[calc(100vh-30px)] overflow-hidden">
        <div className="flex flex-col gap-4 md:grid md:grid-cols-4 md:grid-rows-[auto_1fr] md:gap-4 h-full">
          <div className="col-start-1 col-end-5 row-start-1 w-full rounded-lg ">
            <div className="flex items-center justify-between mb-2">
              <Title level={4} className="mt-2 uppercase opacity-85 ">
                {t('Xử lý khóa sổ kho theo ngày')}
              </Title>
              <LGStockClosingDateActions
                fetchDataQuery={fetchDataQuery}
                handleSaveData={handleSaveData}
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
              <LGStockClosingDateQuery
                inOutYYMM={inOutYYMM}
                setInOutYYMM={setInOutYYMM}
                bizUnit={bizUnit}
                setBizUnit={setBizUnit}
                dataBizUnit={dataBizUnit}
              />
            </details>
          </div>
          <div className="col-start-1 col-end-5 row-start-2 w-full h-full rounded-lg">
            {
              <TableLGStockDateClosing
                onCellClicked={onCellClicked}
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
                canEdit={canEdit}
              />
            }
          </div>
        </div>
      </div>
      <ErrorListModal
        dataError={dataError}
        setIsModalVisible={setIsModalVisible}
        isModalVisible={isModalVisible}
        columns={columnsError}
      />
    </>
  )
}
