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
import { onRowAppended } from '../../components/sheet/js/onRowAppended'
import TableOrgTree from '../../components/table/hr-org-dept/tableOrgTree'
import { SearchOrgDeptPage } from '../../../features/mgn-hr/org-dept/searchOrgDeptPage'
import HrOrgDeptActions from '../../components/actions/hr-da-dept/hrOrgDeptActions'
import OrgDeptQuery from '../../components/query/hrDaDept/orgDeptQuery'
import TableDeptNew from '../../components/table/hr-org-dept/tableDeptNew'
import { GetDeptNew } from '../../../features/mgn-hr/org-dept/getDeptNew'
import { AuOrgDept } from '../../../features/mgn-hr/org-dept/AuOrgDept'
export default function OrgDept({
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
          disabled: false,
        },
      },

      {
        title: t('738'),
        id: 'DeptSeq',
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
        title: t('5'),
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
    ],
    [t],
  )

  const [isSent, setIsSent] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [showSearch2, setShowSearch2] = useState(false)
  const [count, setCount] = useState(0)
  const lastWordEntryRef = useRef(null)

  const [loading, setLoading] = useState(false)

  const [gridData, setGridData] = useState([])
  const [gridDataDeptNew, setGridDataDeptNew] = useState([])

  const [numRowsDeptNew, setNumRowsDeptNew] = useState(0)

  const [addedRowsDeptHis, setAddedRowsDeptHis] = useState([])
  const [numRowsToAddDeptHis, setNumRowsToAddDeptHis] = useState([])

  const [helpData10, setHelpData10] = useState([])
  const [editedRowsDeptHis, setEditedRowsDeptHis] = useState([])

  const [dataTree, setDataTree] = useState([])
  const [orgTypeData, setOrgTypeData] = useState([])

  const [orgType, setOrgType] = useState('')
  const [orgTypeName, setOrgTypeName] = useState('')

  const [baseDate, setBaseDate] = useState(dayjs())
  const [isDisDate, setIsDisDate] = useState(false)

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

  const [colsOrgDept, setColsOrgDept] = useState(() =>
    loadFromLocalStorageSheet(
      'ORG_DEPT_LIST',
      defaultCols.filter((col) => col.visible),
    ),
  )
  const [selectionDeptNew, setSelectionDeptNew] = useState({
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty(),
  })

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
          isDisDate: isDisDate,
        },
      ]
      const dataTree = await SearchOrgDeptPage(data)

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
  }, [dataTree, orgType, baseDate, isDisDate, isAPISuccess])

  const fetchDeptNew = useCallback(async () => {
    setLoading(true)
    if (controllers.current.fetchDeptNew) {
      controllers.current.fetchDeptNew.abort()
      controllers.current.fetchDeptNew = null
      await new Promise((resolve) => setTimeout(resolve, 10))
    }
    if (loadingBarRef.current) {
      loadingBarRef.current.continuousStart()
    }
    const controller = new AbortController()
    const signal = controller.signal

    controllers.current.fetchDeptNew = controller

    try {
      const data = [
        {
          OrgType: orgType,
          BaseDate: formatDate(baseDate),
        },
      ]
      const dataDept = await GetDeptNew(data)
      setGridDataDeptNew(dataDept?.data || [])
      setNumRowsDeptNew(dataDept?.data?.length || 0)
    } catch {
      setGridDataDeptNew([])
    } finally {
      setLoading(false)
      if (loadingBarRef.current) {
        loadingBarRef.current.complete()
      }
      controllers.current.fetchDeptNew = null
    }
  }, [gridDataDeptNew, orgType, baseDate])

  useEffect(() => {
    fetchTree()
    fetchDeptNew()
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
    const selectedRows = selectionDeptNew.rows.items
    let rows = []
    selectedRows.forEach((range) => {
      const start = range[0]
      const end = range[1] - 1

      for (let i = start; i <= end; i++) {
        if (gridDataDeptNew[i]) {
          gridDataDeptNew[i]['IdxNo'] = i + 1
          rows.push(gridDataDeptNew[i])
        }
      }
    })

    return rows
  }

  const handleRowAppendDeptHis = useCallback(
    (numRowsToAdd) => {
      if (canCreate === false) {
        message.warning('Bạn không có quyền thêm dữ liệu')
        return
      }
      onRowAppended(
        colsOrgDept,
        setGridDataDeptNew,
        setNumRowsDeptNew,
        setAddedRowsDeptHis,
        numRowsToAdd,
      )
    },
    [
      colsOrgDept,
      setGridDataDeptNew,
      setNumRowsDeptNew,
      setAddedRowsDeptHis,
      numRowsToAddDeptHis,
    ],
  )

  const [modalOpen, setModalOpen] = useState(false)

  const [isMinusClicked, setIsMinusClicked] = useState(false)
  const [lastClickedCell, setLastClickedCell] = useState(null)
  const [clickedRowData, setClickedRowData] = useState(null)
  const [dadeptSelected, setDadeptSelected] = useState([])
  const [deptNewSelected, setDeptNewSelected] = useState([])
  const [deptOrgSelected, setDeptOrgSelected] = useState([])

  const onCellClickedDepNew = useCallback(
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
        if (rowIndex >= 0 && rowIndex < gridDataDeptNew.length) {
          const isSelected = selectionDeptNew.rows.hasIndex(rowIndex)

          let newSelected
          if (isSelected) {
            newSelected = selectionDeptNew.rows.remove(rowIndex)
            setDeptNewSelected(getSelectedRowsDeptNew())
          } else {
            newSelected = selectionDeptNew.rows.add(rowIndex)
            setDeptNewSelected([])
          }
        }
      }
    },
    [gridDataDeptNew, getSelectedRowsDeptNew, deptNewSelected],
  )

  const onClickSearch = useCallback(async () => {
    fetchDeptNew()
    fetchTree()
  }, [baseDate, orgType, isDisDate])

  const onClickSave = useCallback(async () => {
    if (canCreate === false) {
      message.warning('Bạn không có quyền thêm dữ liệu')
      return
    }

    if (isSent) return
    setIsSent(true)

    try {
      const results = await AuOrgDept(dataTree)

      if (results.data.success) {
        message.success('Lưu thành công!')
        setIsSent(false)
      } else {
        setIsSent(false)
        setErrorData(results.data.errors)
        message.error('Có lỗi xảy ra khi lưu dữ liệu')
      }
    } catch (error) {
      setIsSent(false)
      message.error(error.message || 'Có lỗi xảy ra khi lưu dữ liệu')
    } finally {
      onClickSearch()
    }
  }, [dataTree])


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

  const onClickDelete = useCallback(async () => {
    if (checkedKeys.length === 0) {
      message.warning('Vui lòng chọn tổ chức')
      return
    }
    const newTree = removeNodeByKey(
      dataTree,
      checkedKeys[checkedKeys.length - 1],
    )
    setDataTree(newTree)
    setCheckedKeys([])

    const updateGridData = (newData) => {
      setGridDataDeptNew((prevGridData) => {
        const existingDeptSeqSet = new Set(
          prevGridData.map((item) => item.DeptSeq),
        )

        const newItems = newData
          .filter((data) => !existingDeptSeqSet.has(data.DeptSeq))
          .map((data) => ({
            ...data,
            DeptSeq: data.DeptSeq,
          }))
        return [...prevGridData, ...newItems]
      })
    }

    updateGridData([selectNode])
    setNumRowsDeptNew(gridDataDeptNew.length + [selectNode].length)
  }, [dataTree, gridDataDeptNew, checkedKeys, selectNode])

  const addTreeWithParent = (tree, nodesToAdd, parentKey) => {
    const cloneTree = JSON.parse(JSON.stringify(tree))
    const keyMap = new Map()
    const parentMap = new Map()

    const buildMap = (nodes, parent = null) => {
      nodes.forEach((node) => {
        keyMap.set(node.key, node)
        if (parent) {
          parentMap.set(node.key, parent)
        }
        if (node.children) buildMap(node.children, node)
      })
    }

    buildMap(cloneTree)

    if (parentKey && keyMap.has(parentKey)) {
      const parentNode = keyMap.get(parentKey)
      parentNode.children = parentNode.children || []

      const parentLevel = parentNode.Level ?? 0

      nodesToAdd.forEach((item) => {
        const key = item.Seq.toString()
        if (keyMap.has(key)) {
          const oldParent = parentMap.get(key)
          if (oldParent?.children) {
            oldParent.children = oldParent.children.filter(
              (child) => child.key !== key,
            )
          }
        }
      })

      const existingChildren = parentNode.children

      nodesToAdd.forEach((item, index) => {
        const key = item.Seq.toString()

        const newNode = {
          title: item.DeptName || item.NodeName,
          key,
          children: [],
          ...item,
          Level: parentLevel + 1,
          Sort: existingChildren.length + index + 1,
        }

        parentNode.children.push(newNode)
        keyMap.set(key, newNode)
        parentMap.set(key, parentNode)
      })
    }

    return cloneTree
  }

  const onClickAdd = useCallback(() => {
    if (checkedKeys.length === 0) {
      message.warning('Vui lòng lựa chọn tổ chức')
      return
    }
    if (deptNewSelected.length === 0) {
      message.warning('Vui lòng lựa chọn bộ phận')
      return
    }
    const parentKey = checkedKeys[checkedKeys.length - 1]
    const deptAdd = deptNewSelected.map((row) => ({
      ...row,
      ParentSeq: parentKey,
      Seq: row.DeptSeq,
      DeptName: row.DeptName,
      OrgType: orgType || 1,
      BaseDate: formatDate(baseDate),
    }))

    const updatedTree = addTreeWithParent(dataTree, deptAdd, parentKey)
    setDataTree(updatedTree)

    const updateGridData = (newData) => {
      setGridDataDeptNew((prevGridData) => {
        const deptSeqToRemove = new Set(newData.map((item) => item.DeptSeq))
        return prevGridData.filter((item) => !deptSeqToRemove.has(item.DeptSeq))
      })
    }

    updateGridData(deptAdd)
  }, [deptNewSelected, checkedKeys, dataTree, orgType, baseDate])

  return (
    <>
      <Helmet>
        <title>HPM - {t('10039267')}</title>
      </Helmet>
      <TopLoadingBar color="blue" height={2} ref={loadingBarRef} />
      <div className="bg-slate-50 h-[calc(100vh-40px)] overflow-hidden">
        <div className="flex flex-col h-full">
          <div className="col-start-1 col-end-5 row-start-1 w-full">
            <div className="flex items-center justify-between">
              <Title level={4} className="m-2 mr-2 uppercase opacity-85 ">
                {t('10039267')}
              </Title>
              <HrOrgDeptActions
                setModalOpen={setModalOpen}
                openModal={modalOpen}
                onClickSearch={onClickSearch}
                onClickSave={onClickSave}
                onClickDelete={onClickDelete}
                onClickAdd={onClickAdd}
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
                <OrgDeptQuery
                  orgTypeData={orgTypeData}
                  orgType={orgType}
                  setOrgType={setOrgType}
                  orgTypeName={orgTypeName}
                  setOrgTypeName={setOrgTypeName}
                  BaseDate={baseDate}
                  setBaseDate={setBaseDate}
                  IsDisDate={isDisDate}
                  setIsDisDate={setIsDisDate}
                />
              </div>
            </details>
          </div>
          <div className="col-start-1 col-end-5 row-start-2 w-full h-full border-t overflow-hidden">
            <Splitter className="w-full h-full">
              <SplitterPanel size={33} minSize={10}>
                <TableOrgTree
                  dataTree={dataTree}
                  setDataTree={setDataTree}
                  checkedKeys={checkedKeys}
                  setCheckedKeys={setCheckedKeys}
                  selectNode={selectNode}
                  setSelectNode={setSelectNode}
                />
              </SplitterPanel>

              <SplitterPanel size={55} minSize={20}>
                <TableDeptNew
                  setSelection={setSelectionDeptNew}
                  showSearch={showSearch2}
                  setShowSearch={setShowSearch2}
                  selection={selectionDeptNew}
                  canEdit={canEdit}
                  cols={colsOrgDept}
                  setCols={setColsOrgDept}
                  setGridData={setGridDataDeptNew}
                  gridData={gridDataDeptNew}
                  defaultCols={defaultCols}
                  setNumRows={setNumRowsDeptNew}
                  numRows={numRowsDeptNew}
                  setHelpData10={setHelpData10}
                  helpData10={helpData10}
                  editedRowsDeptHis={editedRowsDeptHis}
                  setEditedRows={setEditedRowsDeptHis}
                  handleRowAppend={handleRowAppendDeptHis}
                  onCellClickedDepNew={onCellClickedDepNew}
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
