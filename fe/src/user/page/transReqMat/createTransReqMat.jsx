import { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet'
import { Typography, notification, message } from 'antd'
const { Title, Text } = Typography
import { FilterOutlined } from '@ant-design/icons'
import { ArrowIcon } from '../../components/icons'
import dayjs from 'dayjs'

import { GetCodeHelpCombo } from '../../../features/codeHelp/getCodeHelpCombo'

import { debounce } from 'lodash'
import { useNavigate, useParams } from 'react-router-dom'
import CryptoJS from 'crypto-js'
import { CompactSelection, GridColumnIcon } from '@glideapps/glide-data-grid'
import { GetCodeHelp } from '../../../features/codeHelp/getCodeHelp'
import {
  CreatedBy,
  UpdatedBy,
} from '../../../features/transReqMat/postTransReqMat'
import TableCreateTransReqMat from '../../components/table/transReqMat/tableCreateTransReqMat'
import CreateTransReqMatActions from '../../components/actions/transReqMat/createTransReqMatActions'
import CreateTransReqMatQuery from '../../components/query/transReqMat/createTransReqMatQuery'
import { onRowAppended } from '../../components/sheet/js/onRowAppended'
import { loadFromLocalStorageSheet } from '../../../localStorage/sheet/sheet'
import { GetCodeHelpByPage } from '../../../features/codeHelp/getCodeHelpByPage'
import {
  GetDataPrint,
  GetReqMatByID,
  GetTemplateTransReq,
} from '../../../features/transReqMat/getTransReqMatDetails'
import { generateEmptyData } from '../../components/sheet/js/generateEmptyData'
import ModalConfirm from '../../components/modal/transReqMat/modalConfirm'
import { filterAndSelectColumns } from '../../../utils/filterUorA'
import { filterAndSelectColumnsA } from '../../../utils/filterA'
import { use } from 'react'
import * as XLSX from 'xlsx'

export default function CreateTransReqMat({ permissions, isMobile }) {
  const { t } = useTranslation()
  const { id } = useParams()
  const gridRef = useRef(null)
  const navigate = useNavigate()
  const secretKey = 'TEST_ACCESS_KEY'
  const formatDate = useCallback((date) => date.format('YYYYMMDD'), [])

  const [modalOpen, setModalOpen] = useState(false)
  const [modalCkeOpen, setModalCkeOpen] = useState(false)

  const [modalCkeOpen5, setModalCkeOpen5] = useState(false)
  const [templatePrint, setTemplatePrint] = useState('')

  const defaultCols = useMemo(
    () => [
      {
        title: '#',
        id: 'Status',
        kind: 'Text',
        readonly: true,
        width: 50,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderLookup,
      },
      {
        title: 'ItemSeq',
        id: 'ItemSeq',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: false,
        icon: GridColumnIcon.HeaderRowID,
      },
      {
        title: t('36157'),
        id: 'ItemName',
        kind: 'Custom',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderString,
      },
      {
        title: t('14910'),
        id: 'ItemNo',
        kind: 'Custom',
        readonly: true,
        width: 200,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderString,
      },
      {
        title: t('551'),
        id: 'Spec',
        kind: 'Custom',
        readonly: true,
        width: 120,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderString,
      },
      {
        title: 'UnitSeq',
        id: 'UnitSeq',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: false,
        icon: GridColumnIcon.HeaderRowID,
      },
      {
        title: t('55251'),
        id: 'UnitName',
        kind: 'Custom',
        readonly: false,
        width: 120,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderString,
      },
      {
        title: t('7516'),
        id: 'Qty',
        kind: 'Text',
        readonly: false,
        width: 120,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderString,
      },
      {
        title: t('1868'),
        id: 'InOutReqDetailKind',
        kind: 'Custom',
        readonly: false,
        width: 150,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderString,
      },
      {
        title: 'InOutReqDetailKindName',
        id: 'InOutReqDetailKindName',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: false,
        icon: GridColumnIcon.HeaderString,
      },

      {
        title: 'STDUnitSeq',
        id: 'STDUnitSeq',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: false,
        icon: GridColumnIcon.HeaderString,
      },

      {
        title: t('2085'),
        id: 'STDUnitName',

        kind: 'Text',
        readonly: false,
        width: 120,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderString,
      },
      {
        title: t('2474'),
        id: 'STDQty',

        kind: 'Text',
        readonly: false,
        width: 120,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderString,
      },
      {
        title: t('31702'),
        id: 'Remark',

        kind: 'Text',
        readonly: false,
        width: 300,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderString,
      },
      {
        title: t('29909'),
        id: 'LotNo',

        kind: 'Text',
        readonly: false,
        width: 120,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderString,
      },
      {
        title: 'ReqSeq',
        id: 'ReqSeq',
        kind: 'Text',
        readonly: false,
        width: 120,
        hasMenu: true,
        visible: false,
        icon: GridColumnIcon.HeaderString,
      },
    ],
    [],
  )

  const [addedRows, setAddedRows] = useState([])
  const [editedRows, setEditedRows] = useState([])
  const [numRowsToAdd, setNumRowsToAdd] = useState(null)
  const [showSearch, setShowSearch] = useState(false)
  const [clickCount, setClickCount] = useState(false)
  const [onSelectRow, setOnSelectRow] = useState([])
  const [openHelp, setOpenHelp] = useState(false)
  const [isCellSelected, setIsCellSelected] = useState(false)
  const [cols, setCols] = useState(() =>
    loadFromLocalStorageSheet(
      'S_ERP_COLS_PAGE_TRANS_REQ_MAT_CREATE',
      defaultCols.filter((col) => col.visible),
    ),
  )

  const [isSent, setIsSent] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [workingTagReq, setWorkingTagReq] = useState('A')

  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([])
  const [dataUnit, setDataUnit] = useState([])
  const [dataStatus, setDataStatus] = useState([])
  const [dataInOutDetailType, setDataInOutDetailType] = useState([])
  const [dataItemName, setDataItemName] = useState([])
  const [dataUnitEA, setDataUnitEA] = useState([])
  const [dateReq, setDateReq] = useState(dayjs())
  const [reqNo, setReqNo] = useState('')
  const [bizUnit, setBizUnit] = useState(0)
  const [bizUnitName, setBizUnitName] = useState('')
  const [transBizUnit, setTransBizUnit] = useState(0)
  const [transBizUnitName, setTransBizUnitName] = useState('')
  const [keyPath, setKeyPath] = useState(null)
  const [checkedPath, setCheckedPath] = useState(false)
  const [isTrans, setIsTrans] = useState('')

  const [gridData, setGridData] = useState([])
  const [isAPISuccess, setIsAPISuccess] = useState(true)

  const [departData, setDepartData] = useState([])
  const [deptSearchSh, setDeptSearchSh] = useState('')
  const [selectionDept, setSelectionDept] = useState({
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty(),
  })
  const [deptName, setDeptName] = useState('')
  const [deptSeq, setDeptSeq] = useState('')
  const [status, setStatus] = useState('')

  const [dataUser, setDataUser] = useState([])
  const [empName, setEmpName] = useState('')
  const [empSeq, setEmpSeq] = useState('')
  const [userId, setUserId] = useState('')
  const [peopleSearchSh, setPeopleSearchSh] = useState('')
  const [selectionPeople, setSelectionPeople] = useState({
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty(),
  })
  const [numRows, setNumRows] = useState(20)

  const [dataWarehouse, setDataWarehouse] = useState([])
  const [warehouseSearchSh, setWarehouseSearchSh] = useState('')

  const [selectionInWarehouse, setSelectionInWarehouse] = useState({
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty(),
  })
  const [inWhName, setInWhName] = useState('')
  const [inWhSeq, setInWhSeq] = useState('')

  const [outWhName, setOutWhName] = useState('')
  const [outWhSeq, setOutWhSeq] = useState('')

  const [inOutReqType, setInOutReqType] = useState(0)

  const [remark, setRemark] = useState('')

  const [maxReqSerl, setMaxReqSerl] = useState(0)

  const [selection, setSelection] = useState({
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty(),
  })

  const [dataMaster, setDataMaster] = useState({})

  const resetTable = () => {
    setSelection({
      columns: CompactSelection.empty(),
      rows: CompactSelection.empty(),
    })
  }

  const fetchTransReqData = async (reqSeq) => {
    setIsAPISuccess(false)

    let hideLoadingMessage
    try {
      hideLoadingMessage = message.loading(
        'Đang tải dữ liệu, vui lòng chờ...',
        0,
      )
      const transResponse = await GetReqMatByID(reqSeq)

      if (transResponse?.success) {
        const fetchedData = transResponse.data || []

        const emptyData = generateEmptyData(50, defaultCols)
        setGridData([...fetchedData, ...emptyData])
        setNumRows(fetchedData.length + emptyData.length)
        setIsAPISuccess(true)
        setMaxReqSerl(transResponse.maxReqSerl)
      } else {
        const emptyData = generateEmptyData(50, defaultCols)
        setGridData(emptyData)
        setNumRows(emptyData.length)
        setIsAPISuccess(true)
        message.error('Có lỗi xảy ra khi tải dữ liệu.')
      }
    } catch (error) {
      const emptyData = generateEmptyData(50, defaultCols)
      setGridData(emptyData)
      setNumRows(emptyData.length)
      setIsAPISuccess(true)
      message.error('Có lỗi xảy ra khi tải dữ liệu.')
    } finally {
      if (hideLoadingMessage) hideLoadingMessage()
      setIsAPISuccess(true)
    }
  }

  useEffect(() => {
    if (id) {
      const data = decryptData(id)
      setDataMaster(data)
      if (data) {
        setBizUnit(data.BizUnit)
        setTransBizUnit(data.TransBizUnit)
        setDeptSeq(data.DeptSeq)
        setDeptName(data.DeptName)
        setEmpSeq(data.EmpSeq)
        setEmpName(data.EmpName)
        setInWhName(data.InWHName)
        setInWhSeq(data.InWHSeq)
        setOutWhName(data.OutWHName)
        setOutWhSeq(data.OutWHSeq)
        setReqNo(data.ReqNo)
        setDateReq(dayjs(data.ReqDate, 'YYYYMMDD'))
        setWorkingTagReq(data?.WorkingTag)
        setInOutReqType(data?.InOutReqType)
        setIsTrans(data?.IsTrans === '0' ? 0 : 1)
      }
    }
    fetchDataTemplate()
  }, [])

  useEffect(() => {
    if (dataMaster?.ReqSeq) {
      fetchTransReqData(dataMaster?.ReqSeq)
    } else {
      const emptyData = generateEmptyData(50, defaultCols)
      setGridData(emptyData)
      setNumRows(emptyData.length)
    }
  }, [dataMaster])

  const fetchCodeHelpData = useCallback(async () => {
    setLoading(true)
    try {
      const [
        codeHelpDataUnit,
        codeHelpComboStatus,
        codeHelpTypeTrans,
        codeHelpItemName,
        codeHelpUnitName,
        codeHelpWarehouse,
        codeHelpPeople,
        codeHelpDept,
      ] = await Promise.all([
        GetCodeHelpCombo('', 6, 10003, 1, '%', '', '', '', ''),
        GetCodeHelpCombo('', 6, 19998, 1, '%', '6036', '', '', ''),
        GetCodeHelpCombo('', 6, 19999, 1, '%', '8012', '1004', '1', ''),
        GetCodeHelp(18001, '', '', '', '', '', '1', '', 1, '', 0, 0, 0),
        GetCodeHelpByPage(10007, '', '', '', '', '', '', 1000, '', 0, 0, 0),
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
        GetCodeHelp(10010, '', '', '', '', '', '', 1, 0, '', 0, 0, 0),
      ])
      setDataUnit(codeHelpDataUnit?.data || [])
      setDataStatus(codeHelpComboStatus?.data || [])
      setDataInOutDetailType(codeHelpTypeTrans?.data || [])
      setDataItemName(codeHelpItemName?.data || [])
      setDataUnitEA(codeHelpUnitName?.data || [])
      setDataWarehouse(codeHelpWarehouse?.data || [])
      setDataUser(codeHelpPeople?.data || [])
      setDepartData(codeHelpDept?.data || [])
    } catch (error) {
      // setDataUnit([])
      // setDataStatus([])
      // setDataInOutDetailType([])
      // setDataItemName([])
      // setDataUnitEA([])
      // setDataUser([])
    } finally {
      setLoading(false)
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

  const handleRowAppend = useCallback(
    (numRowsToAdd) => {
      onRowAppended(cols, setGridData, setNumRows, setAddedRows, numRowsToAdd)
    },
    [cols, setGridData, setNumRows, setAddedRows, numRowsToAdd],
  )

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
      navigate(`/wms/u/warehouse/import-export-mat/trans-req`)
      return null
    }
  }

  const onClickOpenConfirm = () => {
    setModalOpen(true)
  }

  const onClickOpenCke5 = () => {
    setModalCkeOpen5(true)
  }

  const fetchDataTemplate = useCallback(async () => {
    setLoading(true)
    try {
      const dataTemplate = await GetTemplateTransReq()
      setTemplatePrint(dataTemplate.data)
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }, [])

  const onOk = async () => {
    setModalOpen(false)

    const columnsU = [
      'ItemSeq',
      'ItemName',
      'ItemNo',
      'Spec',
      'UnitSeq',
      'UnitName',
      'Qty',
      'InOutReqDetailKind',
      'InOutReqDetailKindName',
      'STDUnitSeq',
      'STDUnitName',
      'STDQty',
      'Remark',
      'LotNo',
    ]
    const columnsA = [
      'ItemSeq',
      'ItemName',
      'ItemNo',
      'Spec',
      'UnitSeq',
      'UnitName',
      'Qty',
      'InOutReqDetailKind',
      'InOutReqDetailKindName',
      'STDUnitSeq',
      'STDUnitName',
      'STDQty',
      'Remark',
      'LotNo',
    ]

    const filterUpdate = filterAndSelectColumns(editedRows, columnsU, 'U')
    const filterAdd = filterAndSelectColumnsA(editedRows, columnsA, 'A')

    if (isSent) return
    setIsSent(true)

    if (filterAdd.length > 0 || filterUpdate.length > 0) {
      const loadingMessage = message.loading('Đang thực hiện lưu dữ liệu...')
      try {
        const payloadMaster = {
          ReqSeq: dataMaster?.ReqSeq || 0,
          ReqSerl: '',
          InOutReqKind: dataMaster?.InOutReqKind || 8023008,
          InOutReqDetailKindName: '',
          InOutReqDetailKind: '',
          BizUnitName: dataMaster?.BizUnitName || bizUnitName,
          BizUnit: bizUnit,
          ReqNo: reqNo || '',
          TransBizUnitName: dataMaster?.TransBizUnitName || transBizUnitName,
          TransBizUnit: transBizUnit,
          ReqDate: formatDate(dateReq),
          CompleteWishDate: '',
          DeptName: deptName,
          DeptSeq: deptSeq || 0,
          EmpName: empName || '',
          EmpSeq: empSeq || 0,
          OutWHName: outWhName,
          OutWHSeq: outWhSeq,
          InWHName: inWhName,
          InWHSeq: inWhSeq || 0,
          InOutReqType: inOutReqType,
          InOutReqDetailType: dataMaster?.InOutReqDetailType || 0,
          Remark: dataMaster?.Remark || remark,
          IsTrans: isTrans,
          IsStop: dataMaster?.IsStop || 0,
          WorkingTagReq: workingTagReq,
          MaxReqSerl: maxReqSerl,
        }

        const promises = []

        if (filterAdd.length > 0) {
          promises.push(CreatedBy(filterAdd, payloadMaster))
        }

        if (filterUpdate.length > 0) {
          promises.push(UpdatedBy(filterUpdate, payloadMaster))
        }

        await Promise.all(promises)

        loadingMessage()
        setIsLoading(false)
        setIsSent(false)
        setEditedRows([])
        setAddedRows([])
        // fetchDataMenus()
        message.success('Lưu dữ liệu thành công!')
      } catch (error) {
        loadingMessage()
        setIsLoading(false)
        setIsSent(false)
        message.error(error.message || 'Có lỗi xảy ra khi lưu dữ liệu')
      }
    } else {
      setIsLoading(false)
      setIsSent(false)
      message.warning('Không có dữ liệu để lưu!')
    }
  }

  const onClickReset = () => {}

  const handleRestSheet = useCallback(async () => {
    const hasWHseq = gridData.some((item) => item.hasOwnProperty('ItemSeq'))
    if (hasWHseq) {
      fetchTransReqData(dataMaster?.ReqSeq)
    } else {
      const allStatusA = gridData.every((item) => item.Status === 'A')

      if (allStatusA) {
        const emptyData = generateEmptyData(50, defaultCols)
        setGridData(emptyData)
        setNumRows(emptyData.length)
      } else {
        fetchTransReqData(dataMaster?.ReqSeq)
      }
    }
  }, [defaultCols, gridData])

  const onClickTransReqPrint = useCallback(async () => {
    const loadingMessage = message.loading('Đang thực hiện in dữ liệu...')
    try {
      const payload = {
        WorkingTag: '',
        IndexNo: '',
        DataSeq: '',
        ReqSeq: dataMaster?.ReqSeq,
      }

      const result = await GetDataPrint(payload)
      if (result) {
        const printWindow = window.open('', '_blank')
        if (printWindow) {
          printWindow.document.open()
          printWindow.document.write(`
            ${result}
          `)
          printWindow.document.close()
          printWindow.focus()
          printWindow.print()
          printWindow.close()
        }
      } else {
        message.error('Không có dữ liệu để in.')
      }

      loadingMessage()
      setIsLoading(false)

      message.success('In thành công!')
    } catch (error) {
      loadingMessage()
      setIsLoading(false)
      message.error(error.message || 'Có lỗi xảy ra khi lưu dữ liệu')
    }
  }, [dataMaster])

  return (
    <>
      <Helmet>
        <title>ITM - {t('Di chuyển vật liệu')}</title>
      </Helmet>
      <div className="bg-slate-50 p-3 h-screen overflow-hidden">
        <div className="flex flex-col gap-4 md:grid md:grid-cols-4 md:grid-rows-[auto_1fr] md:gap-4 h-full">
          <div className="col-start-1 col-end-5 row-start-1 w-full rounded-lg ">
            <div className="flex items-center justify-between mb-2">
              <Title level={4} className="mt-2 uppercase opacity-85 ">
                {t('Nhập yêu cầu Di Chuyển vật liệu')}
              </Title>
              <CreateTransReqMatActions
                onClickOpenConfirm={onClickOpenConfirm}
                openModal={modalOpen}
                setModalOpen={setModalOpen}
                onClickReset={onClickReset}
                onClickTransReqPrint={onClickTransReqPrint}
                onClickOpenCke5={onClickOpenCke5}
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
                <CreateTransReqMatQuery
                  dateReq={dateReq}
                  setDateReq={setDateReq}
                  reqNo={reqNo}
                  setReqNo={setReqNo}
                  bizUnit={bizUnit}
                  setBizUnit={setBizUnit}
                  bizUnitName={bizUnitName}
                  setBizUnitName={setBizUnitName}
                  transBizUnit={transBizUnit}
                  setTransBizUnit={setTransBizUnit}
                  transBizUnitName={transBizUnitName}
                  setTransBizUnitName={setTransBizUnitName}
                  dataUnit={dataUnit}
                  dataStatus={dataStatus}
                  setStatus={setStatus}
                  departData={departData}
                  deptName={deptName}
                  setDeptName={setDeptName}
                  setDeptSeq={setDeptSeq}
                  deptSearchSh={deptSearchSh}
                  setDeptSearchSh={setDeptSearchSh}
                  selectionDept={selectionDept}
                  setSelectionDept={setSelectionDept}
                  dataUser={dataUser}
                  empName={empName}
                  setEmpName={setEmpName}
                  setEmpSeq={setEmpSeq}
                  setUserId={setUserId}
                  peopleSearchSh={peopleSearchSh}
                  setPeopleSearchSh={setPeopleSearchSh}
                  selectionPeople={selectionPeople}
                  setSelectionPeople={setSelectionPeople}
                  dataWarehouse={dataWarehouse}
                  warehouseSearchSh={warehouseSearchSh}
                  setWarehouseSearchSh={setWarehouseSearchSh}
                  selectionInWarehouse={selectionInWarehouse}
                  setSelectionInWarehouse={setSelectionInWarehouse}
                  gridRef={gridRef}
                  dropdownRef={gridRef}
                  inWhName={inWhName}
                  setInWhName={setInWhName}
                  setInWhSeq={setInWhSeq}
                  outWhName={outWhName}
                  setOutWhName={setOutWhName}
                  setOutWhSeq={setOutWhSeq}
                  inOutReqType={inOutReqType}
                  setInOutReqType={setInOutReqType}
                  remark={dataMaster?.Remark}
                  setRemark={setRemark}
                  isTrans={isTrans}
                  setIsTrans={setIsTrans}
                />
              </div>
            </details>
          </div>

          <div className="col-start-1 col-end-5 row-start-2 w-full h-full rounded-lg  overflow-auto">
            <TableCreateTransReqMat
              data={data}
              setEditedRows={setEditedRows}
              setCheckedPath={setCheckedPath}
              checkedPath={checkedPath}
              setKeyPath={setKeyPath}
              loading={loading}
              setData={setData}
              // onCellClicked={onCellClicked}
              setGridData={setGridData}
              gridData={gridData}
              setSelection={setSelection}
              selection={selection}
              showSearch={showSearch}
              setShowSearch={setShowSearch}
              setAddedRows={setAddedRows}
              addedRows={addedRows}
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
              setNumRows={setNumRows}
              setCols={setCols}
              handleRowAppend={handleRowAppend}
              cols={cols}
              defaultCols={defaultCols}
              dataInOutDetailType={dataInOutDetailType}
              dataItemName={dataItemName}
              dataUnitEA={dataUnitEA}
              handleRestSheet={handleRestSheet}
            />
          </div>

          <ModalConfirm
            modalOpen={modalOpen}
            setmodalOpen={setModalOpen}
            resetTable={resetTable}
            MessageConfirm="Xác nhận lưu tiến trình?"
            setKeyPath={setKeyPath}
            onOk={onOk}
          />
        </div>
      </div>
    </>
  )
}
