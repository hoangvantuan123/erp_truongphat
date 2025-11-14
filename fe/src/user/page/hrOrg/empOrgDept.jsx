import { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet'
import { Typography, Menu, message } from 'antd'
const { Title, Text } = Typography
import {
  FilterOutlined,
} from '@ant-design/icons'

import { ArrowIcon } from '../../components/icons'
import dayjs from 'dayjs'
import { GetCodeHelpCombo } from '../../../features/codeHelp/getCodeHelpCombo'
import { CompactSelection, GridColumnIcon } from '@glideapps/glide-data-grid'
import { debounce, set } from 'lodash'

import TopLoadingBar from 'react-top-loading-bar'
import { loadFromLocalStorageSheet } from '../../../localStorage/sheet/sheet'
import { Splitter, SplitterPanel } from 'primereact/splitter'

import ErrorListModal from '../default/errorListModal'
import useDynamicFilter from '../../components/hooks/sheet/useDynamicFilter'
import TableEmpOrgTree from '../../components/table/hr-org-dept/tableEmpOrgTree'
import TableEmpOrgDept from '../../components/table/hr-org-dept/tableEmpOrgDept'
import EmpOrgDeptQuery from '../../components/query/hrDaDept/empOrgDeptQuery'
import EmpOrgDeptActions from '../../components/actions/hr-da-dept/empOrgDeptActions'
import { SearchOrgDeptEmpTreePage } from '../../../features/mgn-hr/org-dept/searchOrgDeptEmpTreePage'
import { GetEmpByOrgDept } from '../../../features/mgn-hr/org-dept/getEmpByOrgDept'
export default function EmpOrgDept({
  permissions,
  isMobile,
  canCreate,
  canEdit,
  canDelete,
  controllers,
  cancelAllRequests,
}) {
  const { t } = useTranslation()
  const loadingBarRef = useRef(null)
  const [isAPISuccess, setIsAPISuccess] = useState(true)

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
        trailingRowOptions: {
          disabled: true,
        },
      },

      {
        title: t('11227'),
        id: 'Photo',
        kind: 'Text',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: false,
        trailingRowOptions: {
          disabled: true,
        },
      },

      {
        title: t('4'),
        id: 'EmpName',
        kind: 'Text',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('3161'),
        id: 'EmpSeq',
        kind: 'Text',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: false,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('1452'),
        id: 'EmpID',
        kind: 'Text',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('737'),
        id: 'IsBoss',
        kind: 'Boolean',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('367'),
        id: 'DeptName',
        kind: 'Text',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('6686'),
        id: 'DeptSeq',
        kind: 'Text',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: false,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('554'),
        id: 'WkDeptName',
        kind: 'Text',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('4302'),
        id: 'WkDeptSeq',
        kind: 'Text',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: false,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('373'),
        id: 'PosName',
        kind: 'Text',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('2137'),
        id: 'PosSeq',
        kind: 'Text',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: false,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('642'),
        id: 'UMJpName',
        kind: 'Text',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: true,
        },
      },

      {
        title: t('9078'),
        id: 'UMJpSeq',
        kind: 'Text',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: false,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('635'),
        id: 'UMPgName',
        kind: 'Text',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('9061'),
        id: 'UMPgSeq',
        kind: 'Text',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: false,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('1296'),
        id: 'UMJdName',
        kind: 'Text',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('9091'),
        id: 'UMJdSeq',
        kind: 'Text',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: false,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('1295'),
        id: 'UMJoName',
        kind: 'Text',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('9088'),
        id: 'UMJoSeq',
        kind: 'Text',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: false,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('11226'),
        id: 'EmpType',
        kind: 'Text',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('1396'),
        id: 'Phone',
        kind: 'Text',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('1069'),
        id: 'CellPhone',
        kind: 'Text',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: true,
        },
      },
    ],
    [t],
  )

  const [showSearch2, setShowSearch2] = useState(false)

  const [loading, setLoading] = useState(false)

  const [gridData, setGridData] = useState([])
  const [numRows, setNumRows] = useState(0)

  const [helpData10, setHelpData10] = useState([])

  const [editedRows, setEditedRows] = useState([])

  const [dataTree, setDataTree] = useState([])
  const [orgTypeData, setOrgTypeData] = useState([])

  const [orgType, setOrgType] = useState('')
  const [orgTypeName, setOrgTypeName] = useState('')

  const [baseDate, setBaseDate] = useState(dayjs())
  const [isDisDate, setIsDisDate] = useState(false)
  const [isOut, setIsOut] = useState(false)
  const [isRetire, setIsRetire] = useState(false)
  const [isWkDept, setIsWkDept] = useState(false)
  const [isNotOne, setIsNotOne] = useState(false)
  const [IsLowDept, setIsLowDept] = useState(false)

  const secretKey = 'KEY_PATH'
  const [modal2Open, setModal2Open] = useState(false)
  const [errorData, setErrorData] = useState(null)
  const formatDate = (date) => date.format('YYYYMMDD')
  const formatDateSearch = (date) => {
    const d = dayjs(date)
    return d.isValid() ? d.format('YYYYMMDD') : ''
  }

  const [selection, setSelection] = useState({
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty(),
  })

  // tree

  const [checkedKeys, setCheckedKeys] = useState([])
  const [selectNode, setSelectNode] = useState(null)
  const [selectedKeys, setSelectedKeys] = useState([])
  const [DeptName, setDeptName] = useState('')

  const [cols, setCols] = useState(() =>
    loadFromLocalStorageSheet(
      'ORG_EMP_DEPT_LIST',
      defaultCols.filter((col) => col.visible),
    ),
  )
  const [modalOpen, setModalOpen] = useState(false)

  const [isMinusClicked, setIsMinusClicked] = useState(false)
  const [lastClickedCell, setLastClickedCell] = useState(null)
  const [clickedRowData, setClickedRowData] = useState(null)
  const [selected, setSelected] = useState([])


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

  useEffect(() => {
    cancelAllRequests()
    message.destroy()
  }, [])

  const fetchCodeHelpData = useCallback(async () => {
    setLoading(true)
    if (controllers.current.fetchCodeHelpData) {
      controllers.current.fetchCodeHelpData.abort()
      controllers.current.fetchCodeHelpData = null
      await new Promise((resolve) => setTimeout(resolve, 10))
    }
    if (loadingBarRef.current) {
      loadingBarRef.current.continuousStart()
    }
    const controller = new AbortController()
    const signal = controller.signal

    controllers.current.fetchCodeHelpData = controller

    try {
      const [OrgType] = await Promise.all([
        GetCodeHelpCombo('', 6, 30031, 1, '%', '', '', '', '', signal),
      ])

      setOrgTypeData(OrgType?.data || [])
    } catch {
      setOrgTypeData([])
    } finally {
      setLoading(false)
      if (loadingBarRef.current) {
        loadingBarRef.current.complete()
      }
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

  const fetchTree = useCallback(async () => {
    setLoading(true)
    if (controllers.current.fetchTree) {
      controllers.current.fetchTree.abort()
      controllers.current.fetchTree = null
      await new Promise((resolve) => setTimeout(resolve, 10))
    }
    if (loadingBarRef.current) {
      loadingBarRef.current.continuousStart()
    }
    const controller = new AbortController()
    const signal = controller.signal

    controllers.current.fetchTree = controller

    try {
      const data = [
        {
          OrgType: orgType || 1,
          baseDate: formatDate(baseDate),
          IsOut: isOut,
          IsRetire: isRetire,
          IsWkDept: isWkDept,
          IsNotOne: isNotOne,
          isLowDept: IsLowDept,
        },
      ]
      const dataTree = await SearchOrgDeptEmpTreePage(data)

      const convertIcon = (iconType) => {
        return iconType === 'folder' ? '' : ''
      }

      const renderTreeNodes = (data) =>
        data.map((item) => ({
          ...item,
          icon: convertIcon(item.icon),
          children: item.children ? renderTreeNodes(item.children) : undefined,
        }))

      setDataTree(renderTreeNodes(dataTree?.data) || [])
    } catch {
      setDataTree([])
    } finally {
      setLoading(false)
      if (loadingBarRef.current) {
        loadingBarRef.current.complete()
      }
      controllers.current.fetchTree = null
    }
  }, [dataTree, orgType, baseDate, isOut, isRetire, isWkDept, isNotOne, isAPISuccess])

  const fetchEmpOrg = useCallback(async (deptSeq) => {
    setLoading(true)
    if (controllers.current.fetchEmpOrg) {
      controllers.current.fetchEmpOrg.abort()
      controllers.current.fetchEmpOrg = null
      await new Promise((resolve) => setTimeout(resolve, 10))
    }
    if (loadingBarRef.current) {
      loadingBarRef.current.continuousStart()
    }
    const controller = new AbortController()
    const signal = controller.signal

    controllers.current.fetchEmpOrg = controller

    try {
      const data = [
        {
          OrgType: orgType || 1,
          baseDate: formatDate(baseDate),
          IsOut: isOut,
          IsRetire: isRetire,
          IsWkDept: isWkDept,
          IsNotOne: isNotOne,
          isLowDept: IsLowDept,
          DeptSeq: deptSeq,
        },
      ]
      const dataEmpt = await GetEmpByOrgDept(data)
      setGridData(dataEmpt?.data || [])
      setNumRows(dataEmpt?.data?.length || 0)
    } catch {
      setGridData([])
    } finally {
      setLoading(false)
      if (loadingBarRef.current) {
        loadingBarRef.current.complete()
      }
      controllers.current.fetchDeptNew = null
    }
  }, [gridData, orgType, baseDate, isOut, isRetire, isWkDept, isNotOne, isAPISuccess])

  useEffect(() => {
    fetchTree()
  }, [])

  const fieldsToTrack = ['IdxNo']

  const { filterValidEntries, findLastEntry, findMissingIds } =
    useDynamicFilter(gridData, fieldsToTrack)

  const resetTable = () => {
    setSelection({
      columns: CompactSelection.empty(),
      rows: CompactSelection.empty(),
    })
  }

  const getSelectedRowsDeptNew = () => {
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



  const onCellClicked = useCallback(
    (cell, event) => {
      let rowIndex

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
        setLastClickedCell(null)
        setClickedRowData(null)
        return
      }
      if (cell[0] === -1) {
        if (rowIndex >= 0 && rowIndex < gridData.length) {
          const isSelected = selection.rows.hasIndex(rowIndex)

          let newSelected
          if (isSelected) {
            newSelected = selection.rows.remove(rowIndex)
            setSelected(getSelectedRowsDeptNew())
          } else {
            newSelected = selection.rows.add(rowIndex)
            setSelected([])
          }
        }
      }
    },
    [gridData, getSelectedRowsDeptNew, selected],
  )

  const onClickSearch = useCallback(async () => {
    fetchTree()
  }, [baseDate, orgType, isOut, isRetire, isNotOne, isWkDept, IsLowDept])


  const removeNodeByKey = (tree, keyToRemove) => {
    return tree
      .map((node) => {
        if (node.key === keyToRemove) return null
        if (node.children) {
          node.children = removeNodeByKey(node.children, keyToRemove)
        }
        return node
      })
      .filter(Boolean)
  }

  const onSelect = (selectedKeys, info) => {
    const selectedKey = info.node.key;
    setDeptName(info.node.DeptName)
    setSelectedKeys(selectedKey)
    setSelectNode(info.node)
    setCheckedKeys((prev) => {
      if (prev.includes(selectedKey)) {
        return prev.filter((key) => key !== selectedKey);
      } else {
        return [...prev, selectedKey];
      }
    });
    fetchEmpOrg(selectedKey)
  };

  return (
    <>
      <Helmet>
        <title>HPM - {t('10040628')}</title>
      </Helmet>
      <TopLoadingBar color="blue" height={2} ref={loadingBarRef} />
      <div className="bg-slate-50 h-[calc(100vh-40px)] overflow-hidden">
        <div className="flex flex-col h-full">
          <div className="col-start-1 col-end-5 row-start-1 w-full">
            <div className="flex items-center justify-between">
              <Title level={4} className="m-2 mr-2 uppercase opacity-85 ">
                {t('10040628')}
              </Title>
              <EmpOrgDeptActions
                setModalOpen={setModalOpen}
                openModal={modalOpen}
                onClickSearch={onClickSearch}

              />
            </div>
            <details
              className="group p-2 [&_summary::-webkit-details-marker]:hidden border rounded-lg bg-white"
              open
            >
              <summary className="flex cursor-pointer items-center justify-between gap-1.5 text-gray-900">
                <h2 className="text-xs font-medium flex items-center gap-2  uppercase">
                  <FilterOutlined />
                  {t('850000014')}
                </h2>
                <span className="relative size-5 shrink-0">
                  <ArrowIcon />
                </span>
              </summary>
              <div className="flex p-2 gap-4">
                <EmpOrgDeptQuery
                  orgTypeData={orgTypeData}
                  orgType={orgType}
                  setOrgType={setOrgType}
                  orgTypeName={orgTypeName}
                  setOrgTypeName={setOrgTypeName}
                  BaseDate={baseDate}
                  setBaseDate={setBaseDate}
                  isOut={isOut}
                  setIsOut={setIsOut}
                  isRetire={isRetire}
                  setIsRetire={setIsRetire}
                  isNotOne={isNotOne}
                  setIsNotOne={setIsNotOne}
                  isWkDept={isWkDept}
                  setIsWkDept={setIsWkDept}
                  IsLowDept={IsLowDept}
                  setIsLowDept={setIsLowDept}
                  DeptName={DeptName}

                />
              </div>
            </details>
          </div>
          <div className="col-start-1 col-end-5 row-start-2 w-full h-full border-t overflow-hidden">
            <Splitter className="w-full h-full">
              <SplitterPanel size={25} minSize={10}>
                <TableEmpOrgTree
                  dataTree={dataTree}
                  setDataTree={setDataTree}
                  checkedKeys={checkedKeys}
                  setCheckedKeys={setCheckedKeys}
                  selectNode={selectNode}
                  setSelectNode={setSelectNode}
                  onSelect={onSelect}
                  selectedKeys={selectedKeys}
                />
              </SplitterPanel>

              <SplitterPanel size={75} minSize={60}>
                <TableEmpOrgDept
                  setSelection={setSelection}
                  showSearch={showSearch2}
                  setShowSearch={setShowSearch2}
                  selection={selection}
                  canEdit={canEdit}
                  cols={cols}
                  setCols={setCols}
                  setGridData={setGridData}
                  gridData={gridData}
                  defaultCols={defaultCols}
                  setNumRows={setNumRows}
                  numRows={numRows}
                  setHelpData10={setHelpData10}
                  helpData10={helpData10}
                  editedRows={editedRows}
                  setEditedRows={setEditedRows}
                  onCellClicked={onCellClicked}
                />
              </SplitterPanel>
            </Splitter>
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
