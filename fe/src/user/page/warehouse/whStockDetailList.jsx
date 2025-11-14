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
import { debounce, set } from 'lodash'
import { useParams, useNavigate } from 'react-router-dom'
import { encodeBase64Url } from '../../../utils/decode-JWT'
import CryptoJS from 'crypto-js'
import WHStockDetailListQuery from '../../components/query/warehouse/whStockDetailListQuery'
import WHStockDetailListActions from '../../components/actions/warehouse/whStockDetailListActions'
import TableWHStockDetailList from '../../components/table/warehouse/tableWHStockDetailList'
import { SLGWHStockDetailListQueryWEB } from '../../../features/warehouse/postWHStockDetailList'
import { GetCodeHelp } from '../../../features/codeHelp/getCodeHelp'
import { CompactSelection, GridColumnIcon } from '@glideapps/glide-data-grid'
import ModalWaiting from '../../components/modal/material/modalWaiting'
import Item from 'antd/es/list/Item'
import { filterAndSelectColumns } from '../../../utils/filterUorA'
import useKeydownHandler from '../../components/hooks/sheet/useKeydownHandler'
import { loadFromLocalStorageSheet } from '../../../localStorage/sheet/sheet'
import { onRowAppended } from '../../components/sheet/js/onRowAppended'
import TopLoadingBar from 'react-top-loading-bar'
import { togglePageInteraction } from '../../../utils/togglePageInteraction'

export default function WHStockDetailList({
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
      title: t('2377'),
      id: 'InOutDate',
      kind: 'Text',
      readonly: true,
      width: 120,
      hasMenu: true,
      visible: true,

      icon: GridColumnIcon.HeaderDate,
    },
    {
      title: t('2271'),
      id: 'InOutName',
      kind: 'Text',
      readonly: true,
      width: 120,
      hasMenu: true,
      visible: true,

      icon: GridColumnIcon.HeaderString,
    },
    {
      title: t('3201'),
      id: 'InOutKindName',
      kind: 'Text',
      readonly: true,
      width: 150,
      hasMenu: true,
      visible: true,

      icon: GridColumnIcon.HeaderString,
    },
    {
      title: t('9273'),
      id: 'InOutNo',
      kind: 'Text',
      readonly: true,
      width: 120,
      hasMenu: true,
      visible: true,

      icon: GridColumnIcon.HeaderString,
    },
    {
      title: t('8007'),
      id: 'InQty',
      kind: 'Text',
      readonly: true,
      width: 120,
      hasMenu: true,
      visible: true,

      icon: GridColumnIcon.HeaderNumber,
    },
    {
      title: t('9542'),
      id: 'OutQty',
      kind: 'Text',
      readonly: true,
      width: 100,
      hasMenu: true,
      visible: true,

      icon: GridColumnIcon.HeaderNumber,
    },
    {
      title: t('8323'),
      id: 'StockQty',
      kind: 'Text',
      readonly: true,
      width: 150,
      hasMenu: true,
      visible: true,

      icon: GridColumnIcon.HeaderNumber,
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
      title: t('584'),
      id: 'InWHName',
      kind: 'Text',
      readonly: true,
      width: 150,
      hasMenu: true,
      visible: true,

      icon: GridColumnIcon.HeaderString,
    },
    {
      title: t('626'),
      id: 'OutWHName',
      kind: 'Text',
      readonly: true,
      width: 150,
      hasMenu: true,
      visible: true,

      icon: GridColumnIcon.HeaderString,
    },
    {
      title: t('6'),
      id: 'InOutCustName',
      kind: 'Text',
      readonly: true,
      width: 100,
      hasMenu: true,
      visible: true,

      icon: GridColumnIcon.HeaderString,
    },
    {
      title: t('5'),
      id: 'InOutDeptName',
      kind: 'Text',
      readonly: true,
      width: 180,
      hasMenu: true,
      visible: true,

      icon: GridColumnIcon.HeaderString,
    },
    {
      title: t('360'),
      id: 'InOutEmpName',
      kind: 'Text',
      readonly: true,
      width: 120,
      hasMenu: true,
      visible: true,

      icon: GridColumnIcon.HeaderString,
    },
    {
      title: t('362'),
      id: 'Remark',
      kind: 'Text',
      readonly: true,
      width: 120,
      hasMenu: true,
      visible: true,

      icon: GridColumnIcon.HeaderString,
    },
    {
      title: t('602'),
      id: 'UnitName',
      kind: 'Text',
      readonly: false,
      width: 100,
      hasMenu: true,
      visible: true,

      icon: GridColumnIcon.HeaderString,
    },
    {
      title: t('1939'),
      id: 'InOutType',
      kind: 'Text',
      readonly: true,
      width: 100,
      hasMenu: true,
      visible: false,

      icon: GridColumnIcon.HeaderString,
    },
    {
      title: t('8075'),
      id: 'InOutDetailKindName',
      kind: 'Text',
      readonly: true,
      width: 100,
      hasMenu: true,
      visible: true,

      icon: GridColumnIcon.HeaderString,
    },
    {
      title: t('4443'),
      id: 'FunctionWHName',
      kind: 'Text',
      readonly: true,
      width: 180,
      hasMenu: true,
      visible: true,

      icon: GridColumnIcon.HeaderString,
    },
    {
      title: t('8072'),
      id: 'InOutSeq',
      kind: 'Text',
      readonly: true,
      width: 120,
      hasMenu: true,
      visible: false,

      icon: GridColumnIcon.HeaderString,
    },
    {
      title: t('16740'),
      id: 'InOutSerl',
      kind: 'Text',
      readonly: true,
      width: 150,
      hasMenu: true,
      visible: false,

      icon: GridColumnIcon.HeaderString,
    },
    {
      title: t('3202'),
      id: 'InOutKind',
      kind: 'Text',
      readonly: true,
      width: 100,
      hasMenu: true,
      visible: false,

      icon: GridColumnIcon.HeaderString,
    },
    {
      title: t('8076'),
      id: 'InOutDetailKind',
      kind: 'Text',
      readonly: true,
      width: 180,
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
      title: t('3262'),
      id: 'ItemClassMName',
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
  const { id } = useParams()
  const secretKey = 'TEST_ACCESS_KEY'
  const [dataBizUnit, setDataBizUnit] = useState([])
  const [dataFactUnit, setDataFactUnit] = useState([])
  const [dataWarehouse, setDataWarehouse] = useState([])
  const [dataItemName, setDataItemName] = useState([])

  const [formData, setFormData] = useState(dayjs().startOf('month') || '')
  const [toDate, setToDate] = useState(dayjs())
  const [bizUnit, setBizUnit] = useState('0')
  const [factUnit, setFactUnit] = useState('0')
  const [bizUnitName, setBizUnitName] = useState('')
  const [lotNo, setLotNo] = useState('')
  const [factUnitName, setFactUnitName] = useState('')
  const [whInOutName, setWHInOutName] = useState('0')
  const formatDate = (date) => date.format('YYYYMMDD')
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
      'S_ERP_COLS_PAGE_STOCK_DETAIL_LIST',
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
  const [whSeq, setWhSeq] = useState('0')
  const [itemName, setItemName] = useState('')
  const [itemSeq, setItemSeq] = useState('0')
  const [itemNo, setItemNo] = useState('')
  const [itemSpec, setItemSpec] = useState('')
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
    const savedState = localStorage.getItem('detailsStateWHStockDetailList')
    setIsOpenDetails(savedState === 'open')
  }, [])

  const handleToggle = (event) => {
    const isOpen = event.target.open
    setIsOpenDetails(isOpen)
    localStorage.setItem(
      'detailsStateWHStockDetailList',
      isOpen ? 'open' : 'closed',
    )
  }

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

  const decryptData = (encryptedToken) => {
    try {
      const base64Data = decodeBase64Url(encryptedToken)
      const bytes = CryptoJS.AES.decrypt(base64Data, secretKey)
      const decryptedData = bytes.toString(CryptoJS.enc.Utf8)
      return JSON.parse(decryptedData)
    } catch (error) {
      return null
    }
  }

  useEffect(() => {
    if (id) {
      const data = decryptData(id)
      setFormData(dayjs(data.DateFr))
      setToDate(dayjs(data.DateTo))
      setBizUnit(data.BizUnit)
      setLotNo(data.BizUnitName)
      setFactUnit(data.FactUnit)
      setFactUnitName(data.FactUnitName)
      setWhSeq(data.WHSeq)
      setWhName(data.WHName)
      setItemSeq(data.ItemSeq)
      setItemName(data.ItemName)
      setItemNo(data.ItemNo)
      setItemSpec(data.Spec)
      fetchSLGWHStockDetailListQueryWeb([
        {
          Spec: data?.Spec,
          BizUnit: data?.BizUnit,
          DateFr: data?.DateFr,
          DateTo: data?.DateTo,
          FactUnit: data?.FactUnit,
          WHSeq: data.WHSeq,
          WHName: data?.WHName,
          ItemSeq: data?.ItemSeq,
          ItemName: data?.ItemName,
          ItemNo: data?.ItemNo,
          BizUnitName: data.BizUnitName,
          StockType: 0,
        },
      ])
    }
  }, [id])

  const fetchSLGWHStockDetailListQueryWeb = async (formB) => {
    if (isAPISuccess === false) {
      message.warning('Không thể thực hiện, vui lòng kiểm tra trạng thái.')
      return
    }
    setIsAPISuccess(false)
    if (loadingBarRef.current) {
      loadingBarRef.current.continuousStart()
    }
    try {
      const response = await SLGWHStockDetailListQueryWEB(formB)
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
      if (loadingBarRef.current) {
        loadingBarRef.current.complete()
        message.error('Có lỗi xảy ra khi tải dữ liệu.')
      }
    } finally {
      notification.destroy()
      setIsAPISuccess(true)
      if (loadingBarRef.current) {
        loadingBarRef.current.complete()
      }
    }
  }

  const fetchSLGWHStockDetailListQueryWebQ = async () => {
    if (isAPISuccess === false) {
      message.warning('Không thể thực hiện, vui lòng kiểm tra trạng thái.')
      return
    }
    if (!bizUnit || bizUnit === '0') {
      message.warning('Bạn chưa chọn đơn vị kinh doanh!')
      return
    }

    if (!whSeq || whSeq === '0') {
      message.warning('Bạn chưa nhập thông tin kho!')
      return
    }
    if (!itemSeq || itemSeq === '0') {
      message.warning('Bạn chưa nhập thông tin sản phẩm')
      return
    }
    setIsAPISuccess(false)
    if (loadingBarRef.current) {
      loadingBarRef.current.continuousStart()
    }
    try {
      const formA = [
        {
          Spec: itemSpec,
          BizUnit: bizUnit,
          DateFr: formData?.format('YYYYMMDD'),
          DateTo: toDate?.format('YYYYMMDD'),
          FactUnit: factUnit,
          WHSeq: whSeq,
          WHName: whName,
          ItemSeq: itemSeq,
          ItemName: itemName,
          ItemNo: itemNo,
          BizUnitName: lotNo,
          StockType: whInOutName,
        },
      ]
      const response = await SLGWHStockDetailListQueryWEB(formA)
      if (response.data.success) {
        const fetchedData = response?.data.data || []
        setData(fetchedData)
        setGridData(fetchedData)
        setIsAPISuccess(true)
        if (loadingBarRef.current) {
          loadingBarRef.current.complete()
        }
        setNumRows(fetchedData.length)
        setIsQuery(true)
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
      if (loadingBarRef.current) {
        loadingBarRef.current.complete()
        message.error('Có lỗi xảy ra khi tải dữ liệu.')
      }
    } finally {
      if (loadingBarRef.current) {
        loadingBarRef.current.complete()
      }
      setIsAPISuccess(true)
    }
  }
  // useEffect(() => {
  //     fetchSLGWHStockDetailListQueryWeb()
  // })

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
        codeHelpWarehouse,
        codeHelpItemName,
      ] = await Promise.all([
        GetCodeHelpCombo('', 6, 10003, 1, '%', '', '', '', ''),
        GetCodeHelpCombo('', 6, 60001, 1, '%', '', '', '', ''),
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
        GetCodeHelp(18001, '', '', '', '', '', '1', '', 1, '', 0, 0, 0),
      ])

      setDataBizUnit(codeHelpResponse1?.data)
      setDataFactUnit(codeHelpResponse2?.data || [])
      setDataWarehouse(codeHelpWarehouse?.data || [])
      setDataItemName(codeHelpItemName?.data || [])
    } catch (error) {
      setDataBizUnit([])
      setDataFactUnit([])
      setDataWarehouse([])
      setDataItemName([])
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
        fetchSLGWHStockDetailListQueryWebQ()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [fetchSLGWHStockDetailListQueryWebQ])

  const handleSearch1 = async () => {
    setLoadingCodeHelp(true)
    setModalVisible1(true)
  }
  const handleSearch2 = async () => {
    setLoadingCodeHelp(true)
    setModalVisible2(true)
  }

  useEffect(() => {
    debouncedFetchCodeHelpData()
    return () => {
      debouncedFetchCodeHelpData.cancel()
    }
  }, [debouncedFetchCodeHelpData])

  return (
    <>
      <Helmet>
        <title>HPM - {t('10040274')}</title>
      </Helmet>
      <TopLoadingBar color="blue" height={2} ref={loadingBarRef} />
      <div className="bg-slate-50 p-3  h-[calc(100vh-30px)] overflow-hidden">
        <div className="flex flex-col gap-4 md:grid md:grid-cols-4 md:grid-rows-[auto_1fr] md:gap-4 h-full">
          <div className="col-start-1 col-end-5 row-start-1 w-full rounded-lg ">
            <div className="flex items-center justify-between mb-2">
              <Title level={4} className="mt-2 uppercase opacity-85 ">
                {t('10040274')}
              </Title>
              <WHStockDetailListActions
                data={data}
                debouncedFetchSLGWHStockDetailListQueryWEB={
                  fetchSLGWHStockDetailListQueryWebQ
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
                <WHStockDetailListQuery
                  formData={formData}
                  setFormData={setFormData}
                  setToDate={setToDate}
                  toDate={toDate}
                  dataFactUnit={dataFactUnit}
                  factUnit={factUnit}
                  setFactUnit={setFactUnit}
                  factUnitName={factUnitName}
                  setFactUnitName={setFactUnitName}
                  dataBizUnit={dataBizUnit}
                  bizUnit={bizUnit}
                  setBizUnit={setBizUnit}
                  bizUnitName={bizUnitName}
                  setBizUnitName={setBizUnitName}
                  handleSearchWH={handleSearch1}
                  handleSearchItemName={handleSearch2}
                  whInOutName={whInOutName}
                  setWHInOutName={setWHInOutName}
                  whName={whName}
                  setWhName={setWhName}
                  setWhSeq={setWhSeq}
                  itemName={itemName}
                  setItemName={setItemName}
                  setItemSeq={setItemSeq}
                  itemNo={itemNo}
                  setItemNo={setItemNo}
                  itemSpec={itemSpec}
                  setItemSpec={setItemSpec}
                  lotNo={lotNo}
                  setLotNo={setLotNo}
                  setDataWarehouse={setDataWarehouse}
                  dataWarehouse={dataWarehouse}
                  setDataItemName={setDataItemName}
                  dataItemName={dataItemName}
                  resetTable={resetTable}
                  resetTable2={resetTable2}
                />
              </div>
            </details>
          </div>
          <div className="col-start-1 col-end-5 row-start-2 w-full h-full rounded-lg">
            {
              <TableWHStockDetailList
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
