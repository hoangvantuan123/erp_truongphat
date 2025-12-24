import { useState, useCallback, useEffect, useRef, useMemo } from 'react'
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
import WHBizStockListQuery from '../../components/query/warehouse/whBizStockListQuery'
import WHBizStockListActions from '../../components/actions/warehouse/whBizStockListActions'
import TableWHBizStockList from '../../components/table/warehouse/tableWHBizStockList'
import { SLGBizUnitStockListQueryWeb } from '../../../features/warehouse/postWHBizStockList'
import { GetCodeHelp } from '../../../features/codeHelp/getCodeHelp'
import { CompactSelection, GridColumnIcon } from '@glideapps/glide-data-grid'
import ModalWaiting from '../../components/modal/material/modalWaiting'
import Item from 'antd/es/list/Item'
import useKeydownHandler from '../../components/hooks/sheet/useKeydownHandler'
import { loadFromLocalStorageSheet } from '../../../localStorage/sheet/sheet'
import { onRowAppended } from '../../components/sheet/js/onRowAppended'
import TopLoadingBar from 'react-top-loading-bar'
import { togglePageInteraction } from '../../../utils/togglePageInteraction'

export default function WHBizStockList({ permissions, isMobile, controllers }) {
  const { t } = useTranslation()
  const gridRef = useRef(null)
  const loadingBarRef = useRef(null)
  const navigate = useNavigate()

  const defaultCols = [
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
      title: t('2090'),
      id: 'ItemName',
      kind: 'Text',
      readonly: true,
      width: 150,
      hasMenu: true,
      visible: true,

      icon: GridColumnIcon.HeaderString,
    },
    {
      title: t('2091'),
      id: 'ItemNo',
      kind: 'Text',
      readonly: true,
      width: 100,
      hasMenu: true,
      visible: true,

      icon: GridColumnIcon.HeaderString,
    },
    {
      title: t('551'),
      id: 'Spec',
      kind: 'Text',
      readonly: true,
      width: 180,
      hasMenu: true,
      visible: true,

      icon: GridColumnIcon.HeaderString,
    },
    {
      title: t('7834'),
      id: 'PrevQty',
      kind: 'Text',
      readonly: true,
      width: 150,
      hasMenu: true,
      visible: true,

      icon: GridColumnIcon.HeaderNumber,
    },
    {
      title: t('8007'),
      id: 'InQty',
      kind: 'Text',
      readonly: true,
      width: 100,
      hasMenu: true,
      visible: true,

      icon: GridColumnIcon.HeaderNumber,
    },
    {
      title: t('9542'),
      id: 'OutQty',
      kind: 'Text',
      readonly: true,
      width: 180,
      hasMenu: true,
      visible: true,

      icon: GridColumnIcon.HeaderNumber,
    },
    {
      title: t('8323'),
      id: 'StockQty',
      kind: 'Text',
      readonly: true,
      width: 180,
      hasMenu: true,
      visible: true,

      icon: GridColumnIcon.HeaderNumber,
    },
    {
      title: t('3259'),
      id: 'AssetName',
      kind: 'Text',
      readonly: true,
      width: 180,
      hasMenu: true,
      visible: true,

      icon: GridColumnIcon.HeaderString,
    },
    {
      title: t('602'),
      id: 'UnitName',
      kind: 'Text',
      readonly: true,
      width: 120,
      hasMenu: true,
      visible: true,

      icon: GridColumnIcon.HeaderString,
    },
    {
      title: t('2115'),
      id: 'ItemClassLName',
      kind: 'Text',
      readonly: true,
      width: 180,
      hasMenu: true,
      visible: true,

      icon: GridColumnIcon.HeaderString,
    },
    {
      title: t('3262'),
      id: 'ItemClassMName',
      kind: 'Text',
      readonly: true,
      width: 180,
      hasMenu: true,
      visible: true,

      icon: GridColumnIcon.HeaderString,
    },
    {
      title: t('592'),
      id: 'ItemClassSName',
      kind: 'Text',
      readonly: true,
      width: 120,
      hasMenu: true,
      visible: true,

      icon: GridColumnIcon.HeaderString,
    },
    {
      title: t('2107'),
      id: 'ItemSeq',
      kind: 'Text',
      readonly: false,
      width: 100,
      hasMenu: true,
      visible: false,

      icon: GridColumnIcon.HeaderString,
    },
    {
      title: t('868'),
      id: 'UnitSeq',
      kind: 'Text',
      readonly: true,
      width: 100,
      hasMenu: true,
      visible: false,

      icon: GridColumnIcon.HeaderString,
    },
    {
      title: t('786'),
      id: 'WHSeq',
      kind: 'Text',
      readonly: true,
      width: 100,
      hasMenu: true,
      visible: false,

      icon: GridColumnIcon.HeaderString,
    },
  ]
  const [loading, setLoading] = useState(false)
  const [loadingA, setLoadingA] = useState(null)
  const [errorA, setErrorA] = useState(false)
  const [data, setData] = useState([])

  const [dataBizUnit, setDataBizUnit] = useState([])
  const [dataFactUnit, setDataFactUnit] = useState([])
  const [dataitemTypeName, setDataItemTypeName] = useState([])
  const [dataItemMClass, setDataItemMClass] = useState([])
  const [formData, setFormData] = useState(dayjs().startOf('month') || '')

  const [toDate, setToDate] = useState(dayjs())

  const [bizUnit, setBizUnit] = useState('0')
  const [factUnit, setFactUnit] = useState('0')
  const [itemTypeName, setItemTypeName] = useState('0')

  const [itemName, setItemName] = useState('')
  const [itemNo, setItemNo] = useState('')
  const [itemSpec, setItemSpec] = useState('')
  const [keyPath, setKeyPath] = useState(null)
  const formatDate = (date) => date.format('YYYYMMDD')

  //Sheet
  // const [isMinusClicked, setIsMinusClicked] = useState(false)
  // const [lastClickedCell, setLastClickedCell] = useState(null)
  // const [clickedRowData, setClickedRowData] = useState(null)
  // const [gridData, setGridData] = useState([])
  const [isOpenDetails, setIsOpenDetails] = useState(false)
  // const [showSearch, setShowSearch] = useState(false)
  // const [selection, setSelection] = useState({
  //   columns: CompactSelection.empty(),
  //   rows: CompactSelection.empty(),
  // })

  const [gridData, setGridData] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selection, setSelection] = useState({
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty(),
  })
  const [showSearch, setShowSearch] = useState(false)
  const [lastClickedCell, setLastClickedCell] = useState(null)
  const [addedRows, setAddedRows] = useState([])

  const [editedRows, setEditedRows] = useState([])
  const [clickedRowData, setClickedRowData] = useState(null)
  const [isMinusClicked, setIsMinusClicked] = useState(false)
  const [numRowsToAdd, setNumRowsToAdd] = useState(null)
  const [numRows, setNumRows] = useState(0)
  const [clickCount, setClickCount] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSent, setIsSent] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [openHelp, setOpenHelp] = useState(false)
  const [isCellSelected, setIsCellSelected] = useState(false)
  const [isCell, setIsCell] = useState(null)
  const [onSelectRow, setOnSelectRow] = useState([])
  const [keySelectColumn, setKeySelectColumn] = useState(false)

  const [cols, setCols] = useState(() =>
    loadFromLocalStorageSheet(
      'S_ERP_COLS_PAGE_STOCK_LIST',
      defaultCols.filter((col) => col.visible),
    ),
  )
  /* CodeHelp */
  const [modalVisible1, setModalVisible1] = useState(false)
  const [data1, setData1] = useState([])
  const [data2, setData2] = useState([])
  const [modalVisible2, setModalVisible2] = useState(false)
  const [loadingCodeHelp, setLoadingCodeHelp] = useState(false)
  const [conditionSeq, setConditionSeq] = useState(1)
  const [subConditionSql, setSubConditionSql] = useState(0)
  const [keyword, setKeyword] = useState('')
  const [itemMClassName, setItemMClassName] = useState('')
  const [itemMClassSeq, setItemMClassSeq] = useState('')
  const [isAPISuccess, setIsAPISuccess] = useState(true)
  const [isQuery, setIsQuery] = useState(false)
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
    message.destroy()
  }, [])

  const fetchSLGBizUnitStockListQueryWeb = async () => {
    if (isAPISuccess === false) {
      message.warning('Không thể thực hiện, vui lòng kiểm tra trạng thái.')
      return
    }
    setIsAPISuccess(false)
    if (loadingBarRef.current) {
      loadingBarRef.current.continuousStart()
    }
    try {
      const formA = [
        {
          BizUnit: bizUnit,
          DateFr: formData ? formatDate(formData) : '',
          DateTo: toDate ? formatDate(toDate) : '',
          FactUnit: factUnit,
          AssetSeq: itemTypeName,
          ItemClassMSeq: itemMClassSeq,
          ItemClassMName: itemMClassName,
          ItemName: itemName,
          ItemNo: itemNo,
          ItemSpec: itemSpec,
        },
      ]

      const response = await SLGBizUnitStockListQueryWeb(formA)
      if (response.data.success) {
        const fetchedData = response.data.data || []
        setData(fetchedData)
        setGridData(fetchedData)
        setIsAPISuccess(true)
        if (loadingBarRef.current) {
          loadingBarRef.current.complete()
        }
        setNumRows(fetchedData.length)
        setIsQuery(true)
        resetTable()
      } else {
        setIsAPISuccess(true)
        if (loadingBarRef.current) {
          loadingBarRef.current.complete()
          message.error('Có lỗi xảy ra khi tải dữ liệu.')
        }
        setData([])
        setGridData([])
        setNumRows(0)
        notification.destroy()
      }
    } catch (error) {
      setErrorA(true)
      setIsAPISuccess(true)
      if (loadingBarRef.current) {
        loadingBarRef.current.complete()
        message.error('Có lỗi xảy ra khi tải dữ liệu.')
      }
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
      const [
        codeHelpResponse1,
        codeHelpResponse2,
        codeHelpResponse4,
        codeHelpItemMClass,
      ] = await Promise.all([
        GetCodeHelpCombo('', 6, 10003, 1, '%', '', '', '', ''),
        GetCodeHelpCombo('', 6, 60001, 1, '%', '', '', '', ''),
        GetCodeHelpCombo('', 6, 10012, 1, '%', '', '', '', ''),
        GetCodeHelp(18098, '', '', '', '', '', '1', '', 1, '', 0, 0, 0),
      ])

      setDataBizUnit(codeHelpResponse1?.data)
      setDataFactUnit(codeHelpResponse2?.data || [])
      setDataItemTypeName(codeHelpResponse4?.data || [])
      setDataItemMClass(codeHelpItemMClass?.data || [])
    } catch (error) {
      setDataBizUnit([])
      setDataFactUnit([])
      setDataItemTypeName([])
      setDataItemMClass([])
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
  //Sheet

  const getSelectedRows = () => {
    const selectedRows = selection.rows.items
    let rows = []
    selectedRows.forEach((range) => {
      const start = range[0]
      const end = range[1] - 1

      for (let i = start; i <= end; i++) {
        if (gridData[i]) {
          rows.push(gridData[i])
        }
      }
    })

    return rows
  }

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
        fetchSLGBizUnitStockListQueryWeb()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [fetchSLGBizUnitStockListQueryWeb])

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
  }

  useEffect(() => {
    debouncedFetchCodeHelpData()
    return () => {
      debouncedFetchCodeHelpData.cancel()
    }
  }, [debouncedFetchCodeHelpData])

  // useEffect(() => {
  //   fetchSLGBizUnitStockListQueryWeb()
  // }, [])
  return (
    <>
      <Helmet>
        <title>ITM - {t('Tồn kho theo sản phẩm')}</title>
      </Helmet>
      <TopLoadingBar color="blue" height={2} ref={loadingBarRef} />
      <div className="bg-slate-50 p-3  h-[calc(100vh-30px)] overflow-hidden">
        <div className="flex flex-col gap-4 md:grid md:grid-cols-4 md:grid-rows-[auto_1fr] md:gap-4 h-full">
          <div className="col-start-1 col-end-5 row-start-1 w-full rounded-lg ">
            <div className="flex items-center justify-between mb-2">
              <Title level={4} className="mt-2 uppercase opacity-85 ">
                {t('Tồn kho theo sản phẩm')}
              </Title>
              <WHBizStockListActions
                debouncedFetchSLGBizUnitStockListQueryWEB={
                  fetchSLGBizUnitStockListQueryWeb
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
              <div className="flex p-2 gap-4">
                <WHBizStockListQuery
                  formData={formData}
                  setFormData={setFormData}
                  setToDate={setToDate}
                  toDate={toDate}
                  dataFactUnit={dataFactUnit}
                  factUnit={factUnit}
                  setFactUnit={setFactUnit}
                  dataBizUnit={dataBizUnit}
                  bizUnit={bizUnit}
                  setBizUnit={setBizUnit}
                  dataitemTypeName={dataitemTypeName}
                  itemTypeName={itemTypeName}
                  setItemTypeName={setItemTypeName}
                  itemMClassName={itemMClassName}
                  setItemMClassName={setItemMClassName}
                  setItemMClassSeq={setItemMClassSeq}
                  itemName={itemName}
                  setItemName={setItemName}
                  itemNo={itemNo}
                  setItemNo={setItemNo}
                  itemSpec={itemSpec}
                  setItemSpec={setItemSpec}
                  setDataItemMClass={setDataItemMClass}
                  dataItemMClass={dataItemMClass}
                />
              </div>
            </details>
          </div>
          <div className="col-start-1 col-end-5 row-start-2 w-full h-full rounded-lg">
            {
              <TableWHBizStockList
                data={data}
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
                setIsQuery={setIsQuery}
                isQuery={isQuery}
              />
            }
          </div>
        </div>
      </div>
    </>
  )
}
