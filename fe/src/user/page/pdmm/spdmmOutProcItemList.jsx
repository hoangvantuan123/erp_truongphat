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

import { CompactSelection, GridColumnIcon } from '@glideapps/glide-data-grid'
import { loadFromLocalStorageSheet } from '../../../localStorage/sheet/sheet'
import TopLoadingBar from 'react-top-loading-bar'
import PdmmOutQueryDetailListAction from '../../components/actions/pdmm/pdmmOutQueryDetailListAction'
import { GetCodeHelpVer2 } from '../../../features/codeHelp/getCodeHelpVer2'
import { GetCodeHelpComboVer2 } from '../../../features/codeHelp/getCodeHelpComboVer2'
import { togglePageInteraction } from '../../../utils/togglePageInteraction'
import { PostQSPDMMOutProcItemList } from '../../../features/pdmm/postQSPDMMOutProcItemList'
import TablespdmmOutProcItemList from '../../components/table/pdmm/tablespdmmOutProcItemList'
import SpdmmOutProcItemListQuery from '../../components/query/pdmm/spdmmOutProcItemListQuery'
import { GetWcQuery } from '../../../features/wc/wcQ'
export default function SpdmmOutProcItemList({
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
        title: t('3'),
        id: 'FactUnitName',
        kind: 'Text',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderString,
      },
      {
        title: t('8211'),
        id: 'MatOutNo',
        kind: 'Text',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderString,
      },
      {
        title: t('245'),
        id: 'MatOutDate',
        kind: 'Text',
        readonly: true,
        width: 100,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderString,
      },
      {
        title: t('2090'),
        id: 'ItemName',
        kind: 'Text',
        readonly: true,
        width: 200,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderString,
      },
      {
        title: t('2091'),
        id: 'ItemNo',
        kind: 'Text',
        readonly: true,
        width: 200,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderString,
      },
      {
        title: t('551'),
        id: 'Spec',
        kind: 'Text',
        readonly: true,
        width: 200,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderString,
      },
      {
        title: t('2107'),
        id: 'ItemSeq',
        kind: 'Text',
        readonly: true,
        width: 100,
        hasMenu: true,
        visible: false,
        icon: GridColumnIcon.HeaderString,
      },
      {
        title: t('UnitName'),
        id: 'UnitName',
        kind: 'Text',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderString,
      },
      {
        title: t('338'),
        id: 'MatReqQty',
        kind: 'Text',
        readonly: true,
        width: 220,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderNumber,
      },
      {
        title: t('4383'),
        id: 'ItemQty',
        kind: 'Text',
        readonly: true,
        width: 220,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderNumber,
      },
      {
        title: t('13522'),
        id: 'StdUnitQty',
        kind: 'Text',
        readonly: true,
        width: 220,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderNumber,
      },


      {
        title: t('366'),
        id: 'DeptName',
        kind: 'Text',
        readonly: true,
        width: 200,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderString,
      },
      {
        title: t('DeptSeq'),
        id: 'DeptSeq',
        kind: 'Text',
        readonly: true,
        width: 100,
        hasMenu: true,
        visible: false,
        icon: GridColumnIcon.HeaderString,
      },
      {
        title: t('623'),
        id: 'EmpName',
        kind: 'Text',
        readonly: true,
        width: 200,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderString,
      },
      {
        title: t('EmpSeq'),
        id: 'EmpSeq',
        kind: 'Text',
        readonly: true,
        width: 200,
        hasMenu: true,
        visible: false,
        icon: GridColumnIcon.HeaderString,
      },
      {
        title: t('626'),
        id: 'OutWHName',
        kind: 'Text',
        readonly: true,
        width: 180,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderString,
      },
      {
        title: t('InWHName'),
        id: 'InWHName',
        kind: 'Text',
        readonly: true,
        width: 180,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderString,
      },
      {
        title: t('WorkCenterName'),
        id: 'WorkCenterName',
        kind: 'Text',
        readonly: true,
        width: 180,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderString,
      },
      {
        title: t('ItemLotNo'),
        id: 'ItemLotNo',
        kind: 'Text',
        readonly: true,
        width: 180,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderString,
      },
      {
        title: t('WorkCenterSeq'),
        id: 'WorkCenterSeq',
        kind: 'Text',
        readonly: true,
        width: 180,
        hasMenu: true,
        visible: false,
        icon: GridColumnIcon.HeaderString,
      },



      {
        title: t('8072'),
        id: 'OutReqSeq',
        kind: 'Text',
        readonly: true,
        width: 120,
        hasMenu: true,
        visible: false,
        icon: GridColumnIcon.HeaderString,
      },
      {
        title: t('3151'),
        id: 'FactUnit',
        kind: 'Text',
        readonly: true,
        width: 120,
        hasMenu: true,
        visible: false,
        icon: GridColumnIcon.HeaderString,
      },
      {
        title: t('9563'),
        id: 'OutWHSeq',
        kind: 'Text',
        readonly: true,
        width: 120,
        hasMenu: true,
        visible: false,
        icon: GridColumnIcon.HeaderString,
      },
      {
        title: t('262'),
        id: 'ReqDate',
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
        width: 150,
        hasMenu: true,
        visible: true,
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

  const [keyPath, setKeyPath] = useState(null)
  const formatDate = (date) => date.format('YYYYMMDD')

  //Sheet
  const [gridData, setGridData] = useState([])
  const [isQuery, setIsQuery] = useState(false)
  const [selection, setSelection] = useState({
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty(),
  })
  const [showSearch, setShowSearch] = useState(false)
  const [addedRows, setAddedRows] = useState([])
  const [editedRows, setEditedRows] = useState([])
  const [numRowsToAdd, setNumRowsToAdd] = useState(null)
  const [numRows, setNumRows] = useState(0)
  const [clickCount, setClickCount] = useState(false)
  const [openHelp, setOpenHelp] = useState(false)
  const [isCellSelected, setIsCellSelected] = useState(false)
  const [onSelectRow, setOnSelectRow] = useState([])
  const [dataSearch, setDataSearch] = useState(null)
  const [dataSearch2, setDataSearch2] = useState(null)
  const [cols, setCols] = useState(() =>
    loadFromLocalStorageSheet(
      'spdmm_out_proc_item_list_a',
      defaultCols.filter((col) => col.visible),
    ),
  )
  useEffect(() => {
    setCols(defaultCols.filter((col) => col.visible))
  }, [defaultCols])
  const [whName, setWhName] = useState('')
  const [whSeq, setWhSeq] = useState('')

  /* CodeHelp */
  const [empName, setEmpName] = useState('')
  const [empSeq, setEmpSeq] = useState('')
  const [custName, setCustName] = useState('')
  const [custSeq, setCustSeq] = useState('')
  const [deptName, setDeptName] = useState('')
  const [deptSeq, setDeptSeq] = useState('0')
  const [etcReqNo, setEtcReqNo] = useState('')
  const [MatOutNo, setMatOutNo] = useState('')
  const [isAPISuccess, setIsAPISuccess] = useState(true)


  const [dataSheetSearch, setDataSheetSearch] = useState([])
  const [dataSheetSearch2, setDataSheetSearch2] = useState([])
  const [searchText, setSearchText] = useState('')
  const [searchText2, setSearchText2] = useState('')
  const [itemText, setItemText] = useState('')
  const [itemText2, setItemText2] = useState('')
  const [helpData07, setHelpData07] = useState([])

  const [searchText3, setSearchText3] = useState('')
  const [itemText3, setItemText3] = useState('')
  const [dataSearch3, setDataSearch3] = useState(null)
  const [dataSheetSearch3, setDataSheetSearch3] = useState([])


  const [searchText4, setSearchText4] = useState('')
  const [itemText4, setItemText4] = useState('')
  const [dataSearch4, setDataSearch4] = useState(null)
  const [dataSheetSearch4, setDataSheetSearch4] = useState([])


  const [searchText5, setSearchText5] = useState('')
  const [itemText5, setItemText5] = useState('')
  const [dataSearch5, setDataSearch5] = useState(null)
  const [dataSheetSearch5, setDataSheetSearch5] = useState([])


  const [LotNo, setLotNo] = useState('')
  const resetTable = () => {
    setSelection({
      columns: CompactSelection.empty(),
      rows: CompactSelection.empty(),
    })
  }

  useEffect(() => {
    cancelAllRequests()
    message.destroy()
  }, [])

  useEffect(() => {
    if (parsedUserInfo && parsedUserInfo.UserName) {
      setEmpName(parsedUserInfo.UserName)
      setEmpSeq(parsedUserInfo.EmpSeq)
    }
  }, [])


  const fetchSLGInOutReqItemListQueryWEB = async () => {
    if (loadingBarRef.current) {
      loadingBarRef.current.continuousStart()
    }
    togglePageInteraction(true)
    try {
      const data = {
        IsChangedMst: '0',
        InOutReqType: typeName === undefined ? '0' : typeName,
        FactUnit: bizUnit,
        MatOutDate: fromDate ? formatDate(fromDate) : '',
        MatOutDateTo: toDate ? formatDate(toDate) : '',
        OutWHName: whName,
        SMProgressType: status,
        SMProgressTypeName: '',
        InOutReqDetailKind: stockType,
        InOutReqDetailKindName: '',
        CustSeq: custSeq,
        CustName: custName,
        DeptName: dataSearch?.BeDeptName || dataSearch?.DeptName || '',
        EmpSeq: dataSearch2?.EmpSeq || '',
        DeptSeq: dataSearch2?.DeptSeq || dataSearch2?.BeDeptSeq || '',
        ItemName: itemName,
        ItemNo: itemNo,
        EmpName: dataSearch2?.EmpName || '',
        OutReqNo: etcReqNo,
        MatOutNo: MatOutNo,
        ItemLotNo: LotNo,
        WorkCenterName: dataSearch3?.WorkCenterName || '',
        WorkCenterSeq: dataSearch3?.WorkCenterSeq || '',
        InWHSeq: dataSearch5?.WHSeq || '',
        OutWHSeq: dataSearch4?.WHSeq || '',

      }

      const response = await PostQSPDMMOutProcItemList(data)
      if (response.success) {
        const fetchedData = response.data || []
        setData(fetchedData)
        setGridData(fetchedData)
        setIsAPISuccess(true)

        setNumRows(fetchedData.length + 1)
        setIsQuery(true)
        resetTable()
      } else {
        setData([])
        setGridData([])
        setNumRows(1)
      }
    } catch (error) {
      message.error('Có lỗi xảy ra khi tải dữ liệu.')
    } finally {
      if (loadingBarRef.current) {
        loadingBarRef.current.complete()
      }
      togglePageInteraction(false)
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
      const search = {
        FactUnit: '',
        SMWorkCenterType: '',
        WorkCenterName: '',
        DeptName: ''

      };
      const [
        codeHelpBizUnit,
        codeHelpTypeName,
        codeHelpStatus,
        codeHelpStockType,
        codeHelpWarehouse,
        codeHelpDeptName,
        codeHelpUserName,
        help07,
      ] = await Promise.all([
        GetCodeHelpComboVer2('', 6, 10003, 1, '%', '', '', '', ''),
        GetCodeHelpComboVer2('', 6, 19999, 1, '%', '1028534', '', '', ''),
        GetCodeHelpComboVer2('', 6, 19995, 1, '%', '3329', '', '', ''),
        GetCodeHelpComboVer2('', 6, 19999, 1, '%', '8025', '', '', ''),
        GetCodeHelpVer2(
          10006,
          '',
          '',
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
        GetCodeHelpVer2(10010, '', '', '', '', '', '', 1, 0, '', 0, 0, 0, signal),
        GetCodeHelpVer2(10009, '', '', '', '', '', '', 1, 0, '', 0, 0, 0, signal),
        GetWcQuery(search, signal)
      ])

      setDataBizUnit(codeHelpBizUnit?.data || [])
      setDataTypeName(codeHelpTypeName?.data || [])
      setDataStatus(codeHelpStatus?.data || [])
      setDataStockType(codeHelpStockType?.data || [])
      setDataWarehouse(codeHelpWarehouse?.data || [])
      setDataDeptName(codeHelpDeptName?.data || [])
      setDataUserName(codeHelpUserName?.data || [])
      setHelpData07(help07?.data || [])


    } catch (error) {
      setDataBizUnit([])
      setDataTypeName([])
      setDataStatus([])
      setDataStockType([])
      setDataWarehouse([])
      setDataDeptName([])
      setDataUserName([])
      setDataCustName([])
      setHelpData07([])
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


  const nextPage = useCallback(() => {
    if (keyPath) {
      window.open(`/wms/u/prod_mgmt/pdmm/pdmm_out_query_detail_list/${keyPath}`, '_blank')
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
      const filteredData = {
        MatOutSeq: data[0]?.MatOutSeq,
        OutReqSeq: data[0]?.OutReqSeq,
        MatOutNo: data[0]?.MatOutNo,
        key: "MatOutSeq",
      }
      const secretKey = 'KEY_PATH'
      const encryptedData = CryptoJS.AES.encrypt(
        JSON.stringify(filteredData),
        secretKey
      ).toString()
      const encryptedToken = encodeBase64Url(encryptedData)
      setKeyPath(encryptedToken)
    } else {
      setKeyPath(null)
    }
  }, [selection.rows.items, gridData])

  const handleRowAppend = useCallback(
    (numRowsToAdd) => {

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
        fetchSLGInOutReqItemListQueryWEB()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [fetchSLGInOutReqItemListQueryWEB])
  const nextPage2 = useCallback(() => {
    if (keyPath) {
      window.open(`/wms/u/prod_mgmt/pdmm/pdmm_out_query_detail_list/${keyPath}`, '_blank')
      localStorage.setItem('COLLAPSED_STATE', JSON.stringify(true))
    }
  }, [keyPath])
  return (
    <>
      <Helmet>
        <title>HPM - {t('Truy vấn yêu cầu xuất kho theo từng vật liệu')}</title>
      </Helmet>
      <TopLoadingBar color="blue" height={2} ref={loadingBarRef} />
      <div className="bg-slate-50 h-[calc(100vh-35px)] overflow-hidden">
        <div className="flex flex-col h-full">
          <div className="col-start-1 col-end-5 row-start-1 w-full">
            <div className="flex p-2 items-end justify-end">
              <PdmmOutQueryDetailListAction
                nextPage={nextPage}
                debouncedFetchSLGInOutReqItemListQueryWEB={
                  fetchSLGInOutReqItemListQueryWEB
                }
                nextPage2={nextPage2}
              />
            </div>
            <details
              className="group p-2 [&_summary::-webkit-details-marker]:hidden border-t  bg-white"
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
              <SpdmmOutProcItemListQuery
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
                stockType={stockType}
                dataStockType={dataStockType}
                setStockType={setStockType}
                status={status}
                dataStatus={dataStatus}
                setStatus={setStatus}
                whName={whName}
                setWhName={setWhName}
                setWhSeq={setWhSeq}
                dataWarehouse={dataWarehouse}
                setDataWarehouse={setDataWarehouse}
                custName={custName}
                setCustName={setCustName}
                setCustSeq={setCustSeq}
                dataCustName={dataCustName}
                userName={empName}
                setUserName={setEmpName}
                setUserSeq={setEmpSeq}
                dataUserName={dataUserName}
                deptName={deptName}
                setDeptName={setDeptName}
                setDeptSeq={setDeptSeq}
                dataDeptName={dataDeptName}
                etcReqNo={etcReqNo}
                setEtcReqNo={setEtcReqNo}
                itemName={itemName}
                setItemName={setItemName}
                itemNo={itemNo}
                setItemNo={setItemNo}


                setDataSheetSearch={setDataSheetSearch}
                dataSheetSearch={dataSheetSearch}
                setDataSheetSearch2={setDataSheetSearch2}
                setItemText2={setItemText2}
                itemText2={itemText2}
                setSearchText2={setSearchText2}

                searchText2={searchText2}
                setDataDeptName={setDataDeptName}
                setDataUserName={setDataUserName}
                controllers={controllers}
                searchText={searchText}
                itemText={itemText}
                setItemText={setItemText}
                setSearchText={setSearchText}
                setDataSearch={setDataSearch}
                setDataSearch2={setDataSearch2}
                setMatOutNo={setMatOutNo}
                MatOutNo={MatOutNo}
                setLotNo={setLotNo}
                LotNo={LotNo}


                helpData07={helpData07}
                setHelpData07={setHelpData07}


                setSearchText3={setSearchText3}
                searchText3={searchText3}
                itemText3={itemText3}
                setItemText3={setItemText3}
                setDataSearch3={setDataSearch3}
                setDataSheetSearch3={setDataSheetSearch3}
                dataSearch3={dataSearch3}

                setDataSheetSearch4={setDataSheetSearch4}
                dataSheetSearch4={dataSheetSearch4}
                setSearchText4={setSearchText4}
                searchText4={searchText4}
                itemText4={itemText4}
                setItemText4={setItemText4}
                setDataSearch4={setDataSearch4}

                setDataSheetSearch5={setDataSheetSearch5}
                dataSheetSearch5={dataSheetSearch5}
                setSearchText5={setSearchText5}
                searchText5={searchText5}
                itemText5={itemText5}
                setItemText5={setItemText5}
                setDataSearch5={setDataSearch5}

              />
            </details>
          </div>
          <div className="col-start-1 col-end-5 row-start-2 w-full  border-t h-full rounded-lg">
            <TablespdmmOutProcItemList
              data={data}
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

          </div>
        </div>
      </div>


    </>
  )
}
