import { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet'
import { Typography, message, Form } from 'antd'
const { Title, Text } = Typography
import { debounce, set } from 'lodash'
import { CompactSelection, GridColumnIcon } from '@glideapps/glide-data-grid'
import { loadFromLocalStorageSheet } from '../../../localStorage/sheet/sheet'
import TopLoadingBar from 'react-top-loading-bar'
import ErrorListModal from '../default/errorListModal'
import { togglePageInteraction } from '../../../utils/togglePageInteraction'

import { updateIndexNo } from '../../components/sheet/js/updateIndexNo'
import { HandleError } from '../default/handleError'

import { generateEmptyData } from '../../components/sheet/js/generateEmptyData'

import TablePdEquipList from '../../components/table/pd-equip-list/tablePdEquipList'
import PdEquipListAction from '../../components/actions/assetMng/pdEquipListAction'
import PdEquipListQuery from '../../components/query/assetMng/pdEquipListQuery'
import { SearchPdEquip } from '../../../features/assetMng/searchPdEquip'
import { GetCodeHelpComboVer230427 } from '../../../features/codeHelp/getCodeHelpComboVer230427'
import { GetCodeHelpVer230427 } from '../../../features/codeHelp/getCodeHelpVer230427'
import { useNavigate } from 'react-router-dom'

export default function PdEquipList({
  permissions,
  isMobile,
  canCreate,
  canEdit,
  canDelete,
  controllers,
  cancelAllRequests,
}) {
  const userFrom = JSON.parse(localStorage.getItem('userInfo'))
  const loadingBarRef = useRef(null)
  const activeFetchCountRef = useRef(0)
  const { t } = useTranslation()
  const navigate = useNavigate()

  const defaultcols = useMemo(
    () => [
      {
        title: '',
        id: 'Status',
        kind: 'Text',
        readonly: true,
        width: 50,
        hasMenu: true,
        visible: true,
        themeOverride: {
          textDark: '#225588',
          baseFontStyle: '600 13px',
        },
        icon: GridColumnIcon.HeaderLookup,
      },
      {
        title: t('1575'),
        id: 'ToolSeq',
        kind: 'Text',
        readonly: true,
        width: 100,
        hasMenu: true,
        visible: true,
        themeOverride: {
          textDark: '#225588',
          baseFontStyle: '600 13px',
        },
      },
      {
        title: t('1576'),
        id: 'ToolName',
        kind: 'Text',
        readonly: true,
        width: 200,
        hasMenu: true,
        visible: true,
        themeOverride: {
          textDark: '#225588',
          baseFontStyle: '600 13px',
        },
      },
      {
        title: t('654'),
        id: 'ToolNo',
        kind: 'Text',
        readonly: true,
        width: 200,
        hasMenu: true,
        visible: true,
        themeOverride: {
          textDark: '#225588',
          baseFontStyle: '600 13px',
        },
      },
      {
        title: t('675'),
        id: 'IsMold',
        kind: 'Text',
        readonly: true,
        width: 100,
        hasMenu: true,
        visible: true,
        themeOverride: {
          textDark: '#225588',
          baseFontStyle: '600 13px',
        },
      },
      {
        title: t('2994'),
        id: 'IsRegMold',
        kind: 'Text',
        readonly: true,
        width: 100,
        hasMenu: true,
        visible: true,
        themeOverride: {
          textDark: '#225588',
          baseFontStyle: '600 13px',
        },
      },
      {
        title: t('1579'),
        id: 'UMToolKindName',
        kind: 'Text',
        readonly: true,
        width: 200,
        hasMenu: true,
        visible: true,
        themeOverride: {
          textDark: '#225588',
          baseFontStyle: '600 13px',
        },
      },
      {
        title: t('551'),
        id: 'Spec',
        kind: 'Text',
        readonly: true,
        width: 200,
        hasMenu: true,
        visible: true,
        themeOverride: {
          textDark: '#225588',
          baseFontStyle: '600 13px',
        },
      },
      {
        title: t('1528'),
        id: 'Capacity',
        kind: 'Text',
        readonly: true,
        width: 200,
        hasMenu: true,
        visible: true,
        themeOverride: {
          textDark: '#225588',
          baseFontStyle: '600 13px',
        },
      },
      {
        title: t('1796'),
        id: 'Uses',
        kind: 'Text',
        readonly: true,
        width: 200,
        hasMenu: true,
        visible: true,
        themeOverride: {
          textDark: '#225588',
          baseFontStyle: '600 13px',
        },
      },
      {
        title: t('520'),
        id: 'DeptName',
        kind: 'Text',
        readonly: true,
        width: 200,
        hasMenu: true,
        visible: true,
        themeOverride: {
          textDark: '#225588',
          baseFontStyle: '600 13px',
        },
      },
      {
        title: t('12138'),
        id: 'EmpSeq',
        kind: 'Text',
        readonly: true,
        width: 100,
        hasMenu: true,
        visible: true,
        themeOverride: {
          textDark: '#225588',
          baseFontStyle: '600 13px',
        },
      },
      {
        title: t('661'),
        id: 'EmpName',
        kind: 'Text',
        readonly: true,
        width: 200,
        hasMenu: true,
        visible: true,
        themeOverride: {
          textDark: '#225588',
          baseFontStyle: '600 13px',
        },
      },
      {
        title: t('132'),
        id: 'BuyDate',
        kind: 'Text',
        readonly: true,
        width: 200,
        hasMenu: true,
        visible: true,
        themeOverride: {
          textDark: '#225588',
          baseFontStyle: '600 13px',
        },
      },
      {
        title: t('669'),
        id: 'BuyCost',
        kind: 'Text',
        readonly: true,
        width: 200,
        hasMenu: true,
        visible: true,
        themeOverride: {
          textDark: '#225588',
          baseFontStyle: '600 13px',
        },
      },
      {
        title: t('1512'),
        id: 'SMStatus',
        kind: 'Text',
        readonly: true,
        width: 200,
        hasMenu: true,
        visible: true,
        themeOverride: {
          textDark: '#225588',
          baseFontStyle: '600 13px',
        },
      },
      {
        title: t('534'),
        id: 'PUCustName',
        kind: 'Text',
        readonly: true,
        width: 200,
        hasMenu: true,
        visible: true,
        themeOverride: {
          textDark: '#225588',
          baseFontStyle: '600 13px',
        },
      },
      {
        title: t('1954'),
        id: 'AssetName',
        kind: 'Text',
        readonly: true,
        width: 200,
        hasMenu: true,
        visible: true,
        themeOverride: {
          textDark: '#225588',
          baseFontStyle: '600 13px',
        },
      },
      {
        title: t('1955'),
        id: 'AssetNo',
        kind: 'Text',
        readonly: true,
        width: 200,
        hasMenu: true,
        visible: true,
        themeOverride: {
          textDark: '#225588',
          baseFontStyle: '600 13px',
        },
      },
      {
        title: t('1960'),
        id: 'AssetSeq',
        kind: 'Text',
        readonly: true,
        width: 100,
        hasMenu: true,
        visible: true,
        themeOverride: {
          textDark: '#225588',
          baseFontStyle: '600 13px',
        },
      },
      {
        title: t('1582'),
        id: 'InstallArea',
        kind: 'Text',
        readonly: true,
        width: 200,
        hasMenu: true,
        visible: true,
        themeOverride: {
          textDark: '#225588',
          baseFontStyle: '600 13px',
        },
      },
      {
        title: t('362'),
        id: 'Remark',
        kind: 'Text',
        readonly: true,
        width: 200,
        hasMenu: true,
        visible: true,
        themeOverride: {
          textDark: '#225588',
          baseFontStyle: '600 13px',
        },
      },
      {
        title: t('12442'),
        id: 'SerialNo',
        kind: 'Text',
        readonly: true,
        width: 200,
        hasMenu: true,
        visible: true,
        themeOverride: {
          textDark: '#225588',
          baseFontStyle: '600 13px',
        },
      },
      {
        title: t('19162'),
        id: 'Forms',
        kind: 'Text',
        readonly: true,
        width: 200,
        hasMenu: true,
        visible: true,
        themeOverride: {
          textDark: '#225588',
          baseFontStyle: '600 13px',
        },
      },
      {
        title: t('12255'),
        id: 'BuyCustTel',
        kind: 'Text',
        readonly: true,
        width: 200,
        hasMenu: true,
        visible: true,
        themeOverride: {
          textDark: '#225588',
          baseFontStyle: '600 13px',
        },
      },
      {
        title: t('13938'),
        id: 'ASTelNo',
        kind: 'Text',
        readonly: true,
        width: 200,
        hasMenu: true,
        visible: true,
        themeOverride: {
          textDark: '#225588',
          baseFontStyle: '600 13px',
        },
      },
      {
        title: t('17377'),
        id: 'NationName',
        kind: 'Text',
        readonly: true,
        width: 200,
        hasMenu: true,
        visible: true,
        themeOverride: {
          textDark: '#225588',
          baseFontStyle: '600 13px',
        },
      },
      {
        title: t('17384'),
        id: 'ManuCompnay',
        kind: 'Text',
        readonly: true,
        width: 200,
        hasMenu: true,
        visible: true,
        themeOverride: {
          textDark: '#225588',
          baseFontStyle: '600 13px',
        },
      },

      {
        title: t('3083'),
        id: 'Value',
        kind: 'Text',
        readonly: true,
        width: 200,
        hasMenu: true,
        visible: true,
        themeOverride: {
          textDark: '#225588',
          baseFontStyle: '600 13px',
        },
      },
    ],
    [],
  )
  const [isSent, setIsSent] = useState(false)

  const [gridData, setGridData] = useState([])

  const [selection, setSelection] = useState({
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty(),
  })

  const [showSearch4, setShowSearch4] = useState(false)
  const [numRows, setNumRows] = useState(0)

  const [SMStatusData, setSmStatusData] = useState([])
  const [UmToolKindData, setUmToolKindData] = useState([])
  const [EmpData, setEmpData] = useState([])
  const [AssetData, setAssetData] = useState([])
  const [CustData, setCustData] = useState([])
  const [FactData, setFactData] = useState([])
  const [ItemData, setItemData] = useState([])

  const [helpData09, setHelpData09] = useState([])

  const [dataSeq, setDataSeq] = useState([])

  const [current, setCurrent] = useState('0')
  const [checkPageA, setCheckPageA] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [searchText1, setSearchText1] = useState('')
  const [itemText, setItemText] = useState([])
  const [itemText1, setItemText1] = useState([])
  const [dataSearch, setDataSearch] = useState([])
  const [dataSearch1, setDataSearch1] = useState([])
  const [dataSheetSearch, setDataSheetSearch] = useState([])
  const [dataSheetSearch1, setDataSheetSearch1] = useState([])
  const [modal2Open, setModal2Open] = useState(false)
  const [errorData, setErrorData] = useState(null)
  const [CoNm, setCoNm] = useState('')
  const [keyPath, setKeyPath] = useState(null)
  const [formBasInfo] = Form.useForm()
  const [formMoldInfo] = Form.useForm()

  const [UmToolKindName, setUmToolKindName] = useState('')
  const [UmToolKind, setUmToolKind] = useState(null)

  const [ToolName, setToolName] = useState('')
  const [ToolSeq, setToolSeq] = useState(null)

  const [ToolNo, setToolNo] = useState('')
  const [Spec, setSpec] = useState('')

  const [SMStatus, setSMStatus] = useState('')
  const [SMStatusName, setSMStatusName] = useState('')
  const [InstallArea, setInstallArea] = useState('')

  const [MoveEmpName, setMoveEmpName] = useState('')
  const [EmpName, setEmpName] = useState('')
  const [EmpSeq, setEmpSeq] = useState(null)

  const [DeptName, setDeptName] = useState('')
  const [DeptSeq, setDeptSeq] = useState(null)

  const [AsstName, setAsstName] = useState('')
  const [AsstSeq, setAsstSeq] = useState(null)

  const [AsstNo, setAsstNo] = useState('')
  const [Remark, setRemark] = useState('')
  const [IsMold, setIsMold] = useState(false)

  const [selectedRows, setSelectedRows] = useState([])
  const [isMinusClicked, setIsMinusClicked] = useState(false)
  const [lastClickedCell, setLastClickedCell] = useState(null)
  const [clickedRowData, setClickedRowData] = useState(null)

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault()
      event.returnValue = 'Bạn có chắc chắn muốn rời đi không?'
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [])

  const [cols, setCols] = useState(() =>
    loadFromLocalStorageSheet(
      'pd_equip_list',
      defaultcols.filter((col) => col.visible),
    ),
  )

  const increaseFetchCount = () => {
    activeFetchCountRef.current += 1
  }

  const decreaseFetchCount = () => {
    activeFetchCountRef.current -= 1
    if (activeFetchCountRef.current === 0) {
      loadingBarRef.current?.complete()
      togglePageInteraction(false)
    }
  }

  const fetchGenericData = async ({
    controllerKey,
    postFunction,
    searchParams,
    useEmptyData = true,
    defaultCols,
    afterFetch = () => {},
  }) => {
    increaseFetchCount()

    if (controllers.current[controllerKey]) {
      controllers.current[controllerKey].abort()
      await new Promise((resolve) => setTimeout(resolve, 10))
      return fetchGenericData({
        controllerKey,
        postFunction,
        searchParams,
        afterFetch,
        defaultCols,
        useEmptyData,
      })
    }

    const controller = new AbortController()
    controllers.current[controllerKey] = controller
    const { signal } = controller

    togglePageInteraction(true)
    loadingBarRef.current?.continuousStart()

    try {
      const response = await postFunction(searchParams, signal)
      if (!response.success) {
        HandleError([
          {
            success: false,
            message: response.message || 'Đã xảy ra lỗi vui lòng thử lại!',
          },
        ])
      }
      const data = response.success ? response.data || [] : []

      let mergedData = updateIndexNo(data)

      if (useEmptyData) {
        const emptyData = updateIndexNo(generateEmptyData(100, defaultCols))
        mergedData = updateIndexNo([...data, ...emptyData])
      }

      await afterFetch(mergedData)
    } catch (error) {
      let emptyData = []

      if (useEmptyData) {
        emptyData = updateIndexNo(generateEmptyData(100, defaultCols))
      }

      await afterFetch(emptyData)
    } finally {
      decreaseFetchCount()
      controllers.current[controllerKey] = null
    }
  }

  const getSelectedRows = (selection, gridData) => {
    return (
      selection?.rows?.items?.flatMap(([start, end]) =>
        Array.from(
          { length: end - start },
          (_, i) => gridData[start + i],
        ).filter(Boolean),
      ) || []
    )
  }

  const resetTable = (setSelectionFn) => {
    if (typeof setSelectionFn === 'function') {
      setSelectionFn({
        columns: CompactSelection.empty(),
        rows: CompactSelection.empty(),
      })
    }
  }

  const createResetFn = (setSelectionFn) => () => resetTable(setSelectionFn)

  const handleDeleteDataSheet = useCallback(() => {
    if (canDelete === false) return

    const map = {
      1: {
        selection,
        setSelection,
        gridData,
        setGridData,
        setNumRows,
        deleteApi: null,
        resetFn: resetTable,
      },
    }

    const target = map[current]
    if (!target) return

    const processTarget = ({
      selection,
      setSelection,
      gridData,
      setGridData,
      setNumRows,
      deleteApi,
      resetFn,
    }) => {
      const selectedRows = getSelectedRows(selection, gridData)

      const rowsWithStatusD = selectedRows
        .filter(
          (row) => !row.Status || row.Status === 'U' || row.Status === 'D',
        )
        .map((row) => ({
          ...row,
          Status: 'D',
        }))

      const rowsWithStatusA = selectedRows.filter((row) => row.Status === 'A')

      if (rowsWithStatusD.length > 0 && deleteApi) {
        deleteApi(rowsWithStatusD)
          .then((response) => {
            if (response.success) {
              const deletedIds = rowsWithStatusD.map((item) => item.IdxNo)
              const updatedData = gridData.filter(
                (row) => !deletedIds.includes(row.IdxNo),
              )
              setGridData(updateIndexNo(updatedData))
              setNumRows(updatedData.length)
              resetTable()
            } else {
              setModal2Open(true)
              setErrorData(response?.errors || [])
            }
          })
          .catch((error) => {
            message.error('Có lỗi xảy ra khi xóa!')
          })
      }

      if (rowsWithStatusA.length > 0) {
        const idsWithStatusA = rowsWithStatusA.map((row) => row.Id)
        const remainingRows = gridData.filter(
          (row) => !idsWithStatusA.includes(row.Id),
        )
        setGridData(updateIndexNo(remainingRows))
        setNumRows(remainingRows.length)
        resetFn?.()
      }
    }

    if (Array.isArray(target)) {
      target.forEach(processTarget)
    } else {
      processTarget(target)
    }
  }, [current])

  const fetchCodeHelpData = useCallback(async () => {
    increaseFetchCount()

    if (controllers.current.fetchCodeHelpData) {
      controllers.current.fetchCodeHelpData.abort()
      controllers.current.fetchCodeHelpData = null
      await new Promise((resolve) => setTimeout(resolve, 10))
    }

    loadingBarRef.current?.continuousStart()

    const controller = new AbortController()
    const signal = controller.signal
    controllers.current.fetchCodeHelpData = controller

    try {
      const [
        SMStatusData,
        umToolKindData,
        userData,
        assetData,
        custData,
        factData,
        itemData,
      ] = await Promise.all([
        GetCodeHelpComboVer230427(
          '',
          6,
          19998,
          1,
          '%',
          '6023',
          '',
          '',
          '',
          signal,
        ),
        GetCodeHelpVer230427(
          19999,
          '',
          '6009',
          '',
          '',
          '',
          '',
          1,
          0,
          '',
          0,
          0,
          0,
          signal,
        ),

        GetCodeHelpVer230427(
          10009,
          '',
          '',
          '',
          '',
          '',
          '',
          1,
          0,
          '',
          0,
          0,
          0,
          signal,
        ),

        GetCodeHelpVer230427(
          40007,
          '',
          '',
          '',
          '',
          '',
          '',
          1,
          0,
          '',
          0,
          0,
          0,
          signal,
        ),

        GetCodeHelpVer230427(
          17051,
          '',
          '1002',
          '',
          '',
          '',
          '',
          1,
          0,
          'SMCustStatus = 2004001',
          0,
          0,
          0,
          signal,
        ),

        GetCodeHelpVer230427(
          19999,
          '',
          '1002',
          '',
          '',
          '',
          '',
          1,
          0,
          "IsUse = ''1''",
          0,
          0,
          0,
          signal,
        ),

        GetCodeHelpVer230427(
          18011,
          '',
          '',
          '',
          '',
          '',
          '',
          1,
          0,
          '',
          0,
          0,
          0,
          signal,
        ),
      ])
      setSmStatusData(SMStatusData.data)
      setUmToolKindData(umToolKindData.data)
      setEmpData(userData.data)
      setAssetData(assetData.data)
      setCustData(custData.data)
      setFactData(factData.data)
      setItemData(itemData.data)
    } catch {
      setSmStatusData([])
      setUmToolKindData([])
      setEmpData([])
      setAssetData([])
      setCustData([])
      setFactData([])
      setItemData([])
    } finally {
      decreaseFetchCount()
      controllers.current.fetchCodeHelpData = null
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

  const handleSearch = useCallback(() => {
    const searchParams = [
      {
        ToolName: ToolName,
        ToolNo: ToolNo,
        Spec: Spec,
        SMStatus: SMStatus,
        UmToolKind: UmToolKind,
        EmpSeq: EmpSeq,
        PUCustSeq: '',
        InstallArea: InstallArea,
        DeptSeq: DeptSeq,
        AsstName: AsstName,
        AsstNo: AsstNo,
      },
    ]

    fetchGenericData({
      controllerKey: 'SearchPdEquip',
      postFunction: SearchPdEquip,
      searchParams: searchParams,
      useEmptyData: false,
      defaultCols: null,
      afterFetch: (data) => {
        setGridData(data)
        setNumRows(data.length)
      },
    })
  }, [
    ToolName,
    ToolNo,
    SMStatus,
    UmToolKind,
    EmpSeq,
    InstallArea,
    DeptSeq,
    AsstName,
    AsstNo,
    gridData,
  ])

  useEffect(() => {
    const UserSeq = dataSheetSearch[0]?.EmpSeq
    if (UserSeq == null || UserSeq === '') return

    handleSearch()
  }, [dataSheetSearch])

  const onCellClicked = useCallback(
    (cell, event) => {
      let rowIndex

      if (cell[0] >= 0 && cell[0] < 3) {
        return
      }

      if (cell[0] === -1) {
        rowIndex = cell[1]
        setIsMinusClicked(true)
      } else {
        rowIndex = cell[1]
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

      setSelectedRows(getSelectedRows())

      if (rowIndex >= 0 && rowIndex < gridData.length) {
        const rowData = gridData[rowIndex]

        const filteredData = {
          ToolSeq: rowData.ToolSeq,
          ToolName: rowData.ToolName,
          ToolNo: rowData.ToolNo,
          Spec: rowData.Spec,
          SMStatus: rowData.SMStatus,
          UmToolKindName: rowData.UmToolKindName,
          InstallArea: rowData.InstallArea,
          MoveEmpName: rowData.MoveEmpName,
          EmpName: rowData.EmpName,
          DeptName: rowData.DeptName,
          AsstName: rowData.AsstName,
          AsstNo: rowData.AsstNo,
          Remark: rowData.Remark,
          IsMold: rowData.IsMold,
        }
        setClickedRowData(rowData)
        setLastClickedCell(cell)
        navigate(`/u/asset/asset-manage/pd-equip`, { state: { filteredData } });
      }
    },
    [keyPath, getSelectedRows, selectedRows],
  )

  return (
    <>
      <Helmet>
        <title>{t('800000198')}</title>
      </Helmet>
      <TopLoadingBar color="blue" height={2} ref={loadingBarRef} />
      <div className="bg-slate-50 h-[calc(100vh-35px)] overflow-hidden">
        <div className="flex flex-col  h-full">
          <div className="col-start-1 col-end-5 row-start-1 w-full ">
            <div className="flex p-2 items-end justify-end">
              <PdEquipListAction
                handleSearch={handleSearch}
                handleDeleteDataSheet={handleDeleteDataSheet}
              />
            </div>
            <details
              className="group p-2 [&_summary::-webkit-details-marker]:hidden border-t border-b bg-white"
              open
            >
              <summary
                className="flex cursor-pointer items-center justify-between gap-1.5 text-gray-900"
                onClick={(e) => e.preventDefault()}
              >
                <h2 className="text-[10px] font-medium flex items-center gap-2  uppercase">
                  Truy vấn
                </h2>
              </summary>
              <PdEquipListQuery
                SMStatusData={SMStatusData}
                UmToolKindData={UmToolKindData}
                setUmToolKindData={setUmToolKindData}
                EmpData={EmpData}
                setEmpData={setEmpData}
                AssetData={AssetData}
                UmToolKind={UmToolKind}
                setUmToolKind={setUmToolKind}
                UmToolKindName={UmToolKindName}
                setUmToolKindName={setUmToolKindName}
                setSearchText1={setSearchText1}
                searchText1={searchText1}
                setItemText={setItemText}
                itemText={itemText}
                setDataSearch={setDataSearch}
                dataSearch={dataSearch}
                setDataSearch1={setDataSearch1}
                dataSearch1={dataSearch1}
                setDataSheetSearch={setDataSheetSearch}
                setDataSheetSearch1={setDataSheetSearch1}
                dataSheetSearch={dataSheetSearch}
                setItemText1={setItemText1}
                CoNm={CoNm}
                setCoNm={setCoNm}
                ToolName={ToolName}
                setToolName={setToolName}
                ToolSeq={ToolSeq}
                setToolSeq={setToolSeq}
                ToolNo={ToolNo}
                setToolNo={setToolNo}
                Spec={Spec}
                setSpec={setSpec}
                SMStatus={SMStatus}
                setSMStatus={setSMStatus}
                SMStatusName={SMStatus}
                setSMStatusName={setSMStatusName}
                InstallArea={InstallArea}
                setInstallArea={setInstallArea}
                MoveEmpName={MoveEmpName}
                setMoveEmpName={setMoveEmpName}
                EmpName={EmpName}
                setEmpName={setEmpName}
                EmpSeq={EmpSeq}
                setEmpSeq={setEmpSeq}
                DeptName={DeptName}
                setDeptName={setDeptName}
                DeptSeq={DeptSeq}
                setDeptSeq={setDeptSeq}
                AsstName={AsstName}
                setAsstName={setAsstName}
                AsstSeq={AsstSeq}
                setAsstSeq={setAsstSeq}
                AsstNo={AsstNo}
                setAsstNo={setAsstNo}
                Remark={Remark}
                setRemark={setRemark}
                IsMold={IsMold}
                setIsMold={setIsMold}
                setSearchText={setSearchText}
              />
            </details>
          </div>

          <div className="col-start-1 col-end-5 row-start-2 w-full h-full">
            <TablePdEquipList
              setSelection={setSelection}
              selection={selection}
              showSearch={showSearch4}
              setShowSearch={setShowSearch4}
              numRows={numRows}
              setGridData={setGridData}
              gridData={gridData}
              setNumRows={setNumRows}
              setCols={setCols}
              cols={cols}
              defaultCols={defaultcols}
              canEdit={canEdit}
              canCreate={canCreate}
              helpData09={helpData09}
              setHelpData09={setHelpData09}
              onCellClicked={onCellClicked}
            />
          </div>
        </div>
      </div>
      <ErrorListModal
        isModalVisible={modal2Open}
        setIsModalVisible={setModal2Open}
        dataError={errorData}
      />
    </>
  )
}
