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
import WHAgingLotStockListQuery from '../../components/query/warehouse/whAgingLotStockListQuery'
import WHAgingLotStockListActions from '../../components/actions/warehouse/whAgingLotStockListActions'
import TableWHAgingLotStockList from '../../components/table/warehouse/tableWHAgingLotStockList'
import { SLGWHLotStockListQueryWEB } from '../../../features/warehouse/postWHAgingLotStockList'
import { GetCodeHelp } from '../../../features/codeHelp/getCodeHelp'
import { CompactSelection, GridColumnIcon } from '@glideapps/glide-data-grid'
import Item from 'antd/es/list/Item'
import { loadFromLocalStorageSheet } from '../../../localStorage/sheet/sheet'
import { onRowAppended } from '../../components/sheet/js/onRowAppended'
import TopLoadingBar from 'react-top-loading-bar'
import { togglePageInteraction } from '../../../utils/togglePageInteraction'

export default function WHAgingLotStockList({
  permissions,
  isMobile,
  controllers,
}) {
  const loadingBarRef = useRef(null)
  const { t } = useTranslation()
  const gridRef = useRef(null)
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
      title: t('25431'),
      id: 'LotNo',
      kind: 'Text',
      readonly: true,
      width: 150,
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
      width: 140,
      hasMenu: true,
      visible: true,

      icon: GridColumnIcon.HeaderString,
    },
    {
      title: t('Pallet'),
      id: 'Pallet',
      kind: 'Text',
      readonly: true,
      width: 130,
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
      title: t('Số lượng hết hạn'),
      id: 'ExpireQty',
      kind: 'Text',
      readonly: true,
      width: 120,
      hasMenu: true,
      visible: true,

      icon: GridColumnIcon.HeaderNumber,
    },
    {
      title: t('HSD dưới 3 tháng'),
      id: 'Less3MoQty',
      kind: 'Text',
      readonly: true,
      width: 120,
      hasMenu: true,
      visible: true,

      icon: GridColumnIcon.HeaderNumber,
    },
    {
      title: t('HSD dưới 6 tháng'),
      id: 'Less6MoQty',
      kind: 'Text',
      readonly: true,
      width: 120,
      hasMenu: true,
      visible: true,

      icon: GridColumnIcon.HeaderNumber,
    },
    {
      title: t('HSD dưới 9 tháng'),
      id: 'Less9MoQty',
      kind: 'Text',
      readonly: true,
      width: 120,
      hasMenu: true,
      visible: true,

      icon: GridColumnIcon.HeaderNumber,
    },
    {
      title: t('HSD dưới 12 tháng'),
      id: 'Less12MoQty',
      kind: 'Text',
      readonly: true,
      width: 120,
      hasMenu: true,
      visible: true,

      icon: GridColumnIcon.HeaderNumber,
    },
    {
      title: t('HSD trên 12 tháng'),
      id: 'More12MoQty',
      kind: 'Text',
      readonly: true,
      width: 120,
      hasMenu: true,
      visible: true,

      icon: GridColumnIcon.HeaderNumber,
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
      title: t('17387'),
      id: 'ProdDate',
      kind: 'Text',
      readonly: true,
      width: 120,
      hasMenu: true,
      visible: true,

      icon: GridColumnIcon.HeaderDate,
    },
    {
      title: t('210'),
      id: 'InDate',
      kind: 'Text',
      readonly: true,
      width: 120,
      hasMenu: true,
      visible: true,

      icon: GridColumnIcon.HeaderDate,
    },
    {
      title: t('Ngày hết hạn'),
      id: 'ValiDate',
      kind: 'Text',
      readonly: true,
      width: 120,
      hasMenu: true,
      visible: true,

      icon: GridColumnIcon.HeaderDate,
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
      id: 'ItemClassName',
      kind: 'Text',
      readonly: true,
      width: 120,
      hasMenu: true,
      visible: true,

      icon: GridColumnIcon.HeaderString,
    },
    {
      title: t('28782'),
      id: 'DateFr',
      kind: 'Text',
      readonly: true,
      width: 120,
      hasMenu: true,
      visible: false,

      icon: GridColumnIcon.HeaderDate,
    },
    {
      title: t('100001449'),
      id: 'DateTo',
      kind: 'Text',
      readonly: true,
      width: 120,
      hasMenu: true,
      visible: false,

      icon: GridColumnIcon.HeaderDate,
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
      title: t('12527'),
      id: 'IsUnitQry',
      kind: 'Text',
      readonly: true,
      width: 150,
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
    {
      title: t('BizUnitName'),
      id: 'BizUnitName',
      kind: 'Text',
      readonly: true,
      width: 180,
      hasMenu: true,
      visible: false,

      icon: GridColumnIcon.HeaderString,
    },
    {
      title: t('FactUnitName'),
      id: 'FactUnitName',
      kind: 'Text',
      readonly: true,
      width: 180,
      hasMenu: true,
      visible: true,

      icon: GridColumnIcon.HeaderString,
    },
    {
      title: t('BizUnit'),
      id: 'BizUnit',
      kind: 'Text',
      readonly: true,
      width: 180,
      hasMenu: true,
      visible: false,

      icon: GridColumnIcon.HeaderString,
    },
    {
      title: t('FactUnit'),
      id: 'FactUnit',
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
  const [datawhKindName, setDataWHKindName] = useState([])
  const [dataitemTypeName, setDataItemTypeName] = useState([])
  const [dataWarehouse, setDataWarehouse] = useState([])
  const [dataItemMClass, setDataItemMClass] = useState([])

  const [formData, setFormData] = useState(dayjs().startOf('month') || '')

  const [toDate, setToDate] = useState(dayjs())

  const [bizUnit, setBizUnit] = useState('0')
  const [factUnit, setFactUnit] = useState('0')
  const [whKindName, setWHKindName] = useState('0')
  const [itemTypeName, setItemTypeName] = useState('0')

  const [itemName, setItemName] = useState('')
  const [itemNo, setItemNo] = useState('')
  const [lotNo, setLotNo] = useState('')
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
  const [openHelp, setOpenHelp] = useState(false)
  const [isCellSelected, setIsCellSelected] = useState(false)
  const [onSelectRow, setOnSelectRow] = useState([])
  const [keySelectColumn, setKeySelectColumn] = useState(false)
  const [cols, setCols] = useState(() =>
    loadFromLocalStorageSheet(
      'S_ERP_COLS_PAGE_AGING_LOT_STOCK_LIST',
      defaultCols.filter((col) => col.visible),
    ),
  )

  const [whName, setWhName] = useState('')
  const [whSeq, setWhSeq] = useState('')
  const [Pallet, setPallet] = useState('')
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

  useEffect(() => {
    const savedState = localStorage.getItem('detailsStateWHAgingLotStockList')
    setIsOpenDetails(savedState === 'open')
  }, [])

  const handleToggle = (event) => {
    const isOpen = event.target.open
    setIsOpenDetails(isOpen)
    localStorage.setItem(
      'detailsStateWHAgingLotStockList',
      isOpen ? 'open' : 'closed',
    )
  }

  const fetchSLGWHLotStockListQueryWEB = async () => {
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
          IsUnitQry: '1',
          IsZeroQty: '0',
          BizUnit: bizUnit,
          BizUnitName: Pallet || '',
          DateFr: formData ? formatDate(formData) : '',
          DateTo: toDate ? formatDate(toDate) : '',
          SMWHKind: whKindName,
          WHKindName: '',
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
          ItemClassLSeq: '0',
          ItemClassLName: '',
          ItemClassMSeq: itemMClassSeq,
          ItemClassMName: itemMClassName,
          ItemClassSSeq: '0',
          ItemClassSName: '',
          ItemName: itemName,
          ItemNo: itemNo,
          LotNo: lotNo,
        },
      ]

      const response = await SLGWHLotStockListQueryWEB(formA)
      if (response.data.success) {
        const fetchedData = response.data.data || []
        setData(fetchedData)
        setGridData(fetchedData)
        setIsAPISuccess(true)
        if (loadingBarRef.current) {
          loadingBarRef.current.complete()
        }
        setNumRows(fetchedData.length + 1)
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
      }
    } catch (error) {
      setErrorA(true)
      setIsAPISuccess(true)
      notification.destroy()
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
        codeHelpResponse3,
        codeHelpResponse4,
        codeHelpWarehouse,
        codeHelpItemMClass,
      ] = await Promise.all([
        GetCodeHelpCombo('', 6, 10003, 1, '%', '', '', '', ''),
        GetCodeHelpCombo('', 6, 60001, 1, '%', '', '', '', ''),
        GetCodeHelpCombo('', 6, 19998, 1, '%', '8002', '1001', '1', ''),
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

      setDataBizUnit(codeHelpResponse1?.data)
      setDataFactUnit(codeHelpResponse2?.data || [])
      setDataWHKindName(codeHelpResponse3?.data || [])
      setDataItemTypeName(codeHelpResponse4?.data || [])
      setDataWarehouse(codeHelpWarehouse?.data || [])
      setDataItemMClass(codeHelpItemMClass?.data || [])
    } catch (error) {
      setDataBizUnit([])
      setDataFactUnit([])
      setDataItemTypeName([])
      setDataWHKindName([])
      setDataWarehouse([])
      setDataItemMClass([])
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

  // const nextPage = useCallback(() => {
  //   if (keyPath) {
  //     console.log('keyPath', keyPath)
  //     navigate(`/wms/u/warehouse/inventory/lg-wh-stock-detail-list/${keyPath}`)
  //   }
  // }, [keyPath, navigate])

  const nextPage = useCallback(() => {
    if (keyPath) {
      window.open(
        `/wms/u/warehouse/inventory/lg-wh-stock-detail-list/${keyPath}`,
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
      if (data[0].ItemName !== '') {
        const filteredData = {
          DateFr: data[0].DateFr,
          DateTo: data[0].DateTo,
          ItemN: data[0].EmpName,
          FactUnit: data[0].FactUnit,
          BizUnit: data[0].BizUnit,
          BizUnitName: '',
          ItemName: data[0].ItemName,
          ItemNo: data[0].ItemNo,
          ItemSeq: data[0].ItemSeq,
          Spec: data[0].Spec,
          WHSeq: data[0].WHSeq,
          WHName: data[0].WHName,
          LotNo: data[0].LotNo,
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
        fetchSLGWHLotStockListQueryWEB()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [fetchSLGWHLotStockListQueryWEB])

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
        <title>HPM - {t('Truy vấn tồn kho lô hàng theo từng kho')}</title>
      </Helmet>
      <TopLoadingBar color="blue" height={2} ref={loadingBarRef} />
      <div className="bg-slate-50 p-3  h-[calc(100vh-30px)] overflow-hidden">
        <div className="flex flex-col gap-4 md:grid md:grid-cols-4 md:grid-rows-[auto_1fr] md:gap-4 h-full">
          <div className="col-start-1 col-end-5 row-start-1 w-full rounded-lg ">
            <div className="flex items-center justify-between mb-2">
              <Title level={4} className="mt-2 uppercase opacity-85 ">
                {t('Truy vấn tồn kho lô hàng theo từng kho')}
              </Title>
              <WHAgingLotStockListActions
                data={data}
                nextPage={nextPage}
                debouncedFetchSLGWHLotStockListQueryWEB={
                  fetchSLGWHLotStockListQueryWEB
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
                <WHAgingLotStockListQuery
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
                  datawhKindName={datawhKindName}
                  whKindName={whKindName}
                  setWHKindName={setWHKindName}
                  dataitemTypeName={dataitemTypeName}
                  itemTypeName={itemTypeName}
                  setItemTypeName={setItemTypeName}
                  whName={whName}
                  setWhName={setWhName}
                  setWhSeq={setWhSeq}
                  itemMClassName={itemMClassName}
                  setItemMClassName={setItemMClassName}
                  setItemMClassSeq={setItemMClassSeq}
                  itemName={itemName}
                  setItemName={setItemName}
                  itemNo={itemNo}
                  setItemNo={setItemNo}
                  lotNo={lotNo}
                  setLotNo={setLotNo}
                  setDataWarehouse={setDataWarehouse}
                  dataWarehouse={dataWarehouse}
                  setDataItemMClass={setDataItemMClass}
                  dataItemMClass={dataItemMClass}
                  resetTable={resetTable}
                  resetTable2={resetTable2}
                  setPallet={setPallet}
                  Pallet={Pallet}
                />
              </div>
            </details>
          </div>
          <div className="col-start-1 col-end-5 row-start-2 w-full h-full rounded-lg">
            {
              <TableWHAgingLotStockList
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
