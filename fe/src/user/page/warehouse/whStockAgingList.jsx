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
import { debounce, flatMap } from 'lodash'
import { useNavigate } from 'react-router-dom'
import WHStockAgingListQuery from '../../components/query/warehouse/whStockAgingListQuery'
import WHStockAgingListActions from '../../components/actions/warehouse/whStockAgingListActions'
import TableWHStockAgingList from '../../components/table/warehouse/tableWHStockAgingList'
import { SLGWHStockAgingListQueryWEB } from '../../../features/warehouse/postWHStockAgingList'
import { GetCodeHelp } from '../../../features/codeHelp/getCodeHelp'
import { CompactSelection, GridColumnIcon } from '@glideapps/glide-data-grid'
import Item from 'antd/es/list/Item'
import { loadFromLocalStorageSheet } from '../../../localStorage/sheet/sheet'
import { onRowAppended } from '../../components/sheet/js/onRowAppended'
import TopLoadingBar from 'react-top-loading-bar'
import { togglePageInteraction } from '../../../utils/togglePageInteraction'

export default function WHStockAgingList({
  permissions,
  isMobile,
  controllers,
}) {
  const { t } = useTranslation()
  const gridRef = useRef(null)
  const navigate = useNavigate()
  const loadingBarRef = useRef(null)

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
      title: t('783'),
      id: 'WHName',
      kind: 'Text',
      readonly: true,
      width: 120,
      hasMenu: true,
      visible: true,

      icon: GridColumnIcon.HeaderString,
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
      title: t('19142'),
      id: 'Qty',
      kind: 'Text',
      readonly: true,
      width: 120,
      hasMenu: true,
      visible: true,

      icon: GridColumnIcon.HeaderNumber,
    },
    {
      title: t('12374'),
      id: 'CQty',
      kind: 'Text',
      readonly: true,
      width: 120,
      hasMenu: true,
      visible: true,

      icon: GridColumnIcon.HeaderNumber,
    },
    {
      title: t('11527'),
      id: 'Qty1',
      kind: 'Text',
      readonly: true,
      width: 120,
      hasMenu: true,
      visible: true,

      icon: GridColumnIcon.HeaderNumber,
    },
    {
      title: t('11541'),
      id: 'Qty2',
      kind: 'Text',
      readonly: true,
      width: 120,
      hasMenu: true,
      visible: true,

      icon: GridColumnIcon.HeaderString,
    },
    {
      title: t('11563'),
      id: 'Qty3',
      kind: 'Text',
      readonly: true,
      width: 120,
      hasMenu: true,
      visible: true,

      icon: GridColumnIcon.HeaderNumber,
    },

    {
      title: t('11588'),
      id: 'Qty6',
      kind: 'Text',
      readonly: true,
      width: 120,
      hasMenu: true,
      visible: true,

      icon: GridColumnIcon.HeaderNumber,
    },
    {
      title: t('11601'),
      id: 'Qty9',
      kind: 'Text',
      readonly: true,
      width: 120,
      hasMenu: true,
      visible: true,

      icon: GridColumnIcon.HeaderNumber,
    },
    {
      title: t('11529'),
      id: 'Qty12',
      kind: 'Text',
      readonly: true,
      width: 120,
      hasMenu: true,
      visible: true,

      icon: GridColumnIcon.HeaderNumber,
    },
    {
      title: t('49318'),
      id: 'Qty18',
      kind: 'Text',
      readonly: true,
      width: 120,
      hasMenu: true,
      visible: true,

      icon: GridColumnIcon.HeaderNumber,
    },
    {
      title: t('11542'),
      id: 'Qty24',
      kind: 'Text',
      readonly: true,
      width: 120,
      hasMenu: true,
      visible: true,

      icon: GridColumnIcon.HeaderNumber,
    },
    {
      title: t('11571'),
      id: 'Qty36',
      kind: 'Text',
      readonly: true,
      width: 120,
      hasMenu: true,
      visible: true,

      icon: GridColumnIcon.HeaderNumber,
    },
    {
      title: t('11572'),
      id: 'Qty99',
      kind: 'Text',
      readonly: true,
      width: 120,
      hasMenu: true,
      visible: true,

      icon: GridColumnIcon.HeaderNumber,
    },
    {
      title: t('2115'),
      id: 'ItemClassLName',
      kind: 'Text',
      readonly: true,
      width: 120,
      hasMenu: true,
      visible: true,

      icon: GridColumnIcon.HeaderString,
    },
    {
      title: t('3262'),
      id: 'ItemClassMName',
      kind: 'Text',
      readonly: true,
      width: 150,
      hasMenu: true,
      visible: true,

      icon: GridColumnIcon.HeaderString,
    },
    {
      title: t('592'),
      id: 'ItemClassName',
      kind: 'Text',
      readonly: true,
      width: 150,
      hasMenu: true,
      visible: true,

      icon: GridColumnIcon.HeaderString,
    },
    {
      title: t('3259'),
      id: 'AssetName',
      kind: 'Text',
      readonly: false,
      width: 200,
      hasMenu: true,
      visible: true,

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
    {
      title: t('868'),
      id: 'UnitSeq',
      kind: 'Text',
      readonly: true,
      width: 180,
      hasMenu: true,
      visible: false,

      icon: GridColumnIcon.HeaderString,
    },
    {
      title: t('2107'),
      id: 'ItemSeq',
      kind: 'Text',
      readonly: true,
      width: 180,
      hasMenu: true,
      visible: false,

      icon: GridColumnIcon.HeaderString,
    },
    {
      title: t('2136'),
      id: 'UMItemClass',
      kind: 'Text',
      readonly: true,
      width: 180,
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
  const [dataWarehouse, setDataWarehouse] = useState([])
  const [dataitemTypeName, setDataItemTypeName] = useState([])

  const [bizUnit, setBizUnit] = useState('0')
  const [factUnit, setFactUnit] = useState('0')
  const [itemTypeName, setItemTypeName] = useState('0')
  const [itemName, setItemName] = useState('')
  const [itemNo, setItemNo] = useState('')
  const [itemSpec, setItemSpec] = useState('')
  const [keyPath, setKeyPath] = useState(null)
  const formatDate = (date) => date.format('YYYYMMDD')
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
      'S_ERP_COLS_PAGE_STOCK_AGING_LIST',
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
  const [whName, setWhName] = useState('')
  const [whSeq, setWhSeq] = useState('')
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
  useEffect(() => {
    message.destroy()
  }, [])
  useEffect(() => {
    const savedState = localStorage.getItem('detailsStateWHStockAgingList')
    setIsOpenDetails(savedState === 'open')
  }, [])

  const handleToggle = (event) => {
    const isOpen = event.target.open
    setIsOpenDetails(isOpen)
    localStorage.setItem(
      'detailsStateWHStockAgingList',
      isOpen ? 'open' : 'closed',
    )
  }

  const fetchSLGWHStockAgingListQueryWEB = async () => {
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
          IsChangedMst: '1',
          BizUnit: bizUnit,
          BizUnitName: '',
          STDDate: '',
          CustSeq: '0',
          CustName: '',
          QryType: 'S',
          QryTypeName: '',
          FactUnit: factUnit,
          FactUnitName: '',
          WHSeq: whSeq,
          WHName: whName,
          AssetSeq: itemTypeName,
          AssetName: '',
          ItemName: itemName,
          ItemNo: itemNo,
          ItemSpec: itemSpec,
          IsUnitQry: '0',
          IsSubDisplay: '0',
        },
      ]

      const response = await SLGWHStockAgingListQueryWEB(formA)
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
        setData([])
        setGridData([])
        setNumRows(0)
        if (loadingBarRef.current) {
          loadingBarRef.current.complete()
          message.error('Có lỗi xảy ra khi tải dữ liệu.')
        }
        setErrorA(true)
        setIsAPISuccess(true)
      }
    } catch (error) {
      setErrorA(true)
      setIsAPISuccess(true)
      if (loadingBarRef.current) {
        loadingBarRef.current.complete()
        message.error('Có lỗi xảy ra khi tải dữ liệu.')
      }
      notification.destroy()
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
        codeHelpResponseBizUnit,
        codeHelpResponseFactUnit,
        codeHelpResponseItemTypeName,
        codeHelpWarehouse,
      ] = await Promise.all([
        GetCodeHelpCombo('', 6, 10003, 1, '%', '', '', '', ''),
        GetCodeHelpCombo('', 6, 60001, 1, '%', '', '', '', ''),
        GetCodeHelpCombo('', 6, 10012, 1, '%', '', '', '', ''),
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
        GetCodeHelp(18098, '', '', '', '', '', '1', '', 1, '', 0, 0, 0),
      ])

      setDataBizUnit(codeHelpResponseBizUnit?.data)
      setDataFactUnit(codeHelpResponseFactUnit?.data || [])
      setDataItemTypeName(codeHelpResponseItemTypeName?.data || [])
      setDataWarehouse(codeHelpWarehouse?.data || [])
    } catch (error) {
      setDataBizUnit([])
      setDataFactUnit([])
      setDataItemTypeName([])
      setDataWarehouse([])
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
        fetchSLGWHStockAgingListQueryWEB()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [fetchSLGWHStockAgingListQueryWEB])

  useEffect(() => {
    debouncedFetchCodeHelpData()
    return () => {
      debouncedFetchCodeHelpData.cancel()
    }
  }, [debouncedFetchCodeHelpData])

  // useEffect(() => {
  //   fetchSLGWHStockListDynamicQueryWeb()
  // }, [])
  return (
    <>
      <Helmet>
        <title>HPM - {t('Truy vấn thời gian lưu kho của sản phẩm')}</title>
      </Helmet>
      <TopLoadingBar color="blue" height={2} ref={loadingBarRef} />
      <div className="bg-slate-50 p-3  h-[calc(100vh-30px)] overflow-hidden">
        <div className="flex flex-col gap-4 md:grid md:grid-cols-4 md:grid-rows-[auto_1fr] md:gap-4 h-full">
          <div className="col-start-1 col-end-5 row-start-1 w-full rounded-lg ">
            <div className="flex items-center justify-between mb-2">
              <Title level={4} className="mt-2 uppercase opacity-85 ">
                {t('Truy vấn thời gian lưu kho của sản phẩm')}
              </Title>
              <WHStockAgingListActions
                data={data}
                debouncedFetchSLGWHStockAgingListQueryWEB={
                  fetchSLGWHStockAgingListQueryWEB
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
                <WHStockAgingListQuery
                  dataFactUnit={dataFactUnit}
                  factUnit={factUnit}
                  setFactUnit={setFactUnit}
                  dataBizUnit={dataBizUnit}
                  bizUnit={bizUnit}
                  setBizUnit={setBizUnit}
                  dataitemTypeName={dataitemTypeName}
                  itemTypeName={itemTypeName}
                  setItemTypeName={setItemTypeName}
                  whName={whName}
                  setWhName={setWhName}
                  setWhSeq={setWhSeq}
                  itemName={itemName}
                  setItemName={setItemName}
                  itemNo={itemNo}
                  setItemNo={setItemNo}
                  itemSpec={itemSpec}
                  setItemSpec={setItemSpec}
                  setDataWarehouse={setDataWarehouse}
                  dataWarehouse={dataWarehouse}
                  resetTable={resetTable}
                  resetTable2={resetTable2}
                />
              </div>
            </details>
          </div>
          <div className="col-start-1 col-end-5 row-start-2 w-full h-full rounded-lg">
            {
              <TableWHStockAgingList
                data={data}
                //onCellClicked={onCellClicked}
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
