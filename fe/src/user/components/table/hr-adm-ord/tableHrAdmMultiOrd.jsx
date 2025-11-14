import { useEffect, useState, useCallback, useMemo, useRef } from 'react'
import { DataEditor, GridCellKind } from '@glideapps/glide-data-grid'
import { useTranslation } from 'react-i18next'
import { useLayer } from 'react-laag'
import LayoutMenuSheet from '../../sheet/jsx/layoutMenu'
import LayoutStatusMenuSheet from '../../sheet/jsx/layoutStatusMenu'
import { Drawer, Checkbox, message, Button } from 'antd'
import { saveToLocalStorageSheet } from '../../../../localStorage/sheet/sheet'
import { loadFromLocalStorageSheet } from '../../../../localStorage/sheet/sheet'
import { reorderColumns } from '../../sheet/js/reorderColumns'
import useOnFill from '../../hooks/sheet/onFillHook'
import { useExtraCells } from '@glideapps/glide-data-grid-cells'
import { updateIndexNo } from '../../sheet/js/updateIndexNo'
import { CellsItemNameV01 } from '../../sheet/cells/cellsItemNameV01'
import dayjs from 'dayjs'
import { CellsEmpNameV2 } from '../../sheet/cells/cellsEmpNamev2'
import { CellsOrdName } from '../../sheet/cells/cellsOrdName'
import { CellDeptName } from '../../sheet/cells/cellsDeptName'
import { CellPosName } from '../../sheet/cells/cellsPosName'
import { CellsUMJpName } from '../../sheet/cells/cellsUMJpName'
import { CellsUMPgName } from '../../sheet/cells/cellsUMPgName'
import { CellsUMJdName } from '../../sheet/cells/cellsUMJdName'
import { CellsUMJoName } from '../../sheet/cells/cellsUMJoName'
import { CellsJobName } from '../../sheet/cells/cellsJobName'
import { CellsPuName } from '../../sheet/cells/cellsPuName'
import { CellsPtName } from '../../sheet/cells/cellsPtName'
import { CellsUMWsName } from '../../sheet/cells/cellsUMWsName'
import { updateEditedRows } from '../../sheet/js/updateEditedRows'
import { GetAdmOrdByEmp } from '../../../../features/mgn-hr/hr-adm-ord/getAdmOrdByEmp'
function TableHrAdmMultiOrd({
  dataUser,
  setDataUser,
  OrdData,
  setOrdData,
  DeptData,
  setDeptData,
  PosData,
  setPosData,
  UMJpNameData,
  setUMJpNameData,

  UMPgNameData,
  setUMPgNameData,
  UMJdNameData,
  setUMJdNameData,
  UMJoNameData,
  setUMJoNameData,
  PuNameData,
  setPuNameData,
  PtNameData,
  setPtNameData,
  UMWsNameData,
  setUMWsNameData,
  EntRetTypeNameData,
  setEntRetTypeNameData,
  JobNameData,
  setJobNameData,

  setSelection,
  selection,
  setShowSearch,
  showSearch,
  setEditedRows,
  setGridData,
  gridData,
  setNumRows,
  numRows,
  handleRowAppend,
  setCols,
  cols,
  defaultCols,
  dataNaWare,
  handleRestSheet,
  canEdit,
  setHelpData10,
  helpData10,
  onCellClicked,

  loadingBarRef,
  isAPISuccess,
  setIsAPISuccess,
}) {
  const { t } = useTranslation()
  const gridRef = useRef(null)
  const [open, setOpen] = useState(false)
  const cellProps = useExtraCells()
  const onFill = useOnFill(setGridData, cols)
  const onSearchClose = useCallback(() => setShowSearch(false), [])
  const [showMenu, setShowMenu] = useState(null)
  const controllers = useRef({})
  const [isLoading, setIsLoading] = useState(false)
  const formatDate = (date) => (date ? dayjs(date).format('YYYYMMDD') : '')
  const dateFormat = (date) => (date ? dayjs(date).format('YYYY-MM-DD') : '')

  const [hiddenColumns, setHiddenColumns] = useState(() => {
    return loadFromLocalStorageSheet('HR_ADM_ORD_MULTI_H', [])
  })
  const [hoverRow, setHoverRow] = useState(undefined)

  const onItemHovered = useCallback(
    (args) => {
      const [_, row] = args.location
      const lastRowIndex = numRows - 1

      if (row === lastRowIndex) {
        setHoverRow(undefined)
      } else {
        setHoverRow(args.kind !== 'cell' ? undefined : row)
      }
    },
    [numRows],
  )

  const onHeaderMenuClick = useCallback((col, bounds) => {
    if (cols[col]?.id === 'Status') {
      setShowMenu({
        col,
        bounds,
        menuType: 'statusMenu',
      })
    } else {
      setShowMenu({
        col,
        bounds,
        menuType: 'defaultMenu',
      })
    }
  }, [])

  const [keybindings, setKeybindings] = useState({
    downFill: true,
    rightFill: true,
    selectColumn: false,
  })
  const columnNames = [
    'EmpName',
    'OrdName',
    'DeptName',
    'PosName',
    'UMJpName',
    'UMPgName',
    'UMJdName',
    'UMJoName',
    'JobName',
    'PuName',
    'PtName',
    'UMWsName',
    'WkDeptName',
  ]
  const grayColumns = ['EmpID', 'CurrOrdDate', 'CurrOrdName']

  const highlightRegions = columnNames.map((columnName) => ({
    color: grayColumns.includes(columnName) ? '#f0f0f0' : '#e8f0ff',
    range: {
      x: reorderColumns(cols).indexOf(columnName),
      y: 0,
      width: 1,
      height: numRows,
    },
  }))
  const getData = useCallback(
    ([col, row]) => {
      const person = gridData[row] || {}
      const column = cols[col]
      const columnKey = column?.id || ''
      const value = person[columnKey] || ''

      const cellConfig = {
        EmpName: {
          kind: 'cells-emp-name-v2',
          allowedValues: dataUser,
          setCacheData: setDataUser,
        },
        OrdName: {
          kind: 'cells-ord-name',
          allowedValues: OrdData,
          setCacheData: setOrdData,
        },
        DeptName: {
          kind: 'cells-dept-name',
          allowedValues: DeptData,
          setCacheData: setDeptData,
        },
        PosName: {
          kind: 'cells-pos-name',
          allowedValues: PosData,
          setCacheData: setPosData,
        },

        UMJpName: {
          kind: 'cells-umjp-name',
          allowedValues: UMJpNameData,
          setCacheData: setUMJpNameData,
        },

        UMPgName: {
          kind: 'cells-umpg-name',
          allowedValues: UMPgNameData,
          setCacheData: setUMPgNameData,
        },
        UMJdName: {
          kind: 'cells-umjd-name',
          allowedValues: UMJdNameData,
          setCacheData: setUMJdNameData,
        },
        UMJoName: {
          kind: 'cells-umjo-name',
          allowedValues: UMJoNameData,
          setCacheData: setUMJoNameData,
        },

        JobName: {
          kind: 'cells-job-name',
          allowedValues: JobNameData,
          setCacheData: setPuNameData,
        },

        PuName: {
          kind: 'cells-pu-name',
          allowedValues: PuNameData,
          setCacheData: setPuNameData,
        },

        PtName: {
          kind: 'cells-pt-name',
          allowedValues: PtNameData,
          setCacheData: setPtNameData,
        },

        UMWsName: {
          kind: 'cells-umws-name',
          allowedValues: UMWsNameData,
          setCacheData: setUMWsNameData,
        },

        WkDeptName: {
          kind: 'cells-dept-name',
          allowedValues: DeptData,
          setCacheData: setDeptData,
        },
      }

      if (cellConfig[columnKey]) {
        return {
          kind: GridCellKind.Custom,
          allowOverlay: true,
          copyData: String(value),
          data: {
            kind: cellConfig[columnKey].kind,
            allowedValues: cellConfig[columnKey].allowedValues,
            setCacheData: cellConfig[columnKey].setCacheData,
            value: value,
          },
          displayData: String(value),
          readonly: column?.readonly || false,
          hasMenu: column?.hasMenu || false,
        }
      }

      if (
        columnKey === 'IsBoss' ||
        columnKey === 'IsWkOrd' ||
        columnKey === 'IsLast'
      ) {
        const booleanValue =
          value === 1 || value === '1'
            ? true
            : value === 0 || value === '0'
              ? false
              : Boolean(value)
        return {
          kind: GridCellKind.Boolean,
          data: booleanValue,
          allowOverlay: true,
          hasMenu: column?.hasMenu || false,
        }
      }

      if (columnKey === 'OrdDate' || 
        columnKey === 'CurrOrdDate' 

      ) {          
      return {
        kind: GridCellKind.Text,
        data: value,
        displayData: dateFormat(value || '') || '',
        readonly: false,
        allowOverlay: true,
        hasMenu: false,
      }
    }

      return {
        kind: GridCellKind.Text,
        data: value,
        copyData: String(value),
        displayData: String(value),
        readonly: column?.readonly || false,
        allowOverlay: true,
        hasMenu: column?.hasMenu || false,
        isEditing: true,
      }
    },
    [gridData, cols, dataUser],
  )

  const onKeyUp = useCallback(
    (event) => {
      if (event.key === 'Backspace') {
        const [col, row] = event.location

        setGridData((prev) => {
          const newData = [...prev]
          if (newData[row]) {
            const column = cols[col - 1]
          }
          return newData
        })
      }
    },
    [cols, gridData],
  )

  const onEmpCellClick = useCallback(
    async (
      EmpSeq,
      OrdDate,
      OrdSeq,
      DeptSeq,
      PosSeq,
      UMJpSeq,
      UMPgSeq,
      UMJdSeq,
      UMJoSeq,
      PuSeq,
      PtSeq,
      UMWsSeq,
      product,
      
    ) => {
      if (!isAPISuccess) {
        message.warning('Không thể thực hiện, vui lòng kiểm tra trạng thái.')
        return
      }

      if (controllers.current && controllers.current.onEmpCellClick) {
        controllers.current.onEmpCellClick.abort()
        controllers.current.onEmpCellClick = null
        if (loadingBarRef.current) {
          loadingBarRef.current.continuousStart()
        }
        await new Promise((resolve) => setTimeout(resolve, 10))
      }
      if (loadingBarRef.current) {
        loadingBarRef.current.continuousStart()
      }
      const controller = new AbortController()
      const signal = controller.signal

      controllers.current.onEmpCellClick = controller

      setIsAPISuccess(false)

      try {
        const data = [
          {
            EmpSeq: EmpSeq,
            OrdDate: formatDate(OrdDate),
            OrdSeq: OrdSeq,
            DeptSeq: DeptSeq,
            PosSeq: PosSeq,
            UMJpSeq: UMJpSeq,
            UMPgSeq: UMPgSeq,
            UMJdSeq: UMJdSeq,
            UMJoSeq: UMJoSeq,
            PuSeq: PuSeq,
            PtSeq: PtSeq,
            UMWsSeq: UMWsSeq,
          },
        ]

        const response = await GetAdmOrdByEmp(data)
        
        const fetchedData = response.data || []

        if (fetchedData.length > 0) {

          product['EmpName'] = fetchedData[0].EmpName
          product['EmpSeq'] = fetchedData[0].EmpSeq
          product['EmpID'] = fetchedData[0].EmpID
          product['CurrOrdDate'] = fetchedData[0].CurrOrdDate
          product['CurrOrdName'] = fetchedData[0].CurrOrdName
          product['OrdDate'] = fetchedData[0].OrdDate
          product['OrdName'] = fetchedData[0].OrdName
          product['OrdSeq'] = fetchedData[0].OrdSeq
          product['DeptName'] = fetchedData[0].DeptName
          product['DeptSeq'] = fetchedData[0].DeptSeq
          product['PosName'] = fetchedData[0].PosName
          product['PosSeq'] = fetchedData[0].PosSeq
          product['UMJpName'] = fetchedData[0].UMJpName
          product['UMJpSeq'] = fetchedData[0].UMJpSeq
          product['Ps'] = fetchedData[0].Ps
          product['UMPgName'] = fetchedData[0].UMPgName
          product['UMPgSeq'] = fetchedData[0].UMPgSeq
          product['UMJdName'] = fetchedData[0].UMJdName
          product['UMJdSeq'] = fetchedData[0].UMJdSeq
          product['UMJoName'] = fetchedData[0].UMJoName
          product['UMJoSeq'] = fetchedData[0].UMJoSeq
          product['JobName'] = fetchedData[0].JobName
          product['JobSeq'] = fetchedData[0].JobSeq
          product['PuName'] = fetchedData[0].PuName
          product['PuSeq'] = fetchedData[0].PuSeq
          product['PtName'] = fetchedData[0].PtName
          product['PtSeq'] = fetchedData[0].PtSeq
          product['UMWsName'] = fetchedData[0].UMWsName
          product['UMWsSeq'] = fetchedData[0].UMWsSeq
          product['IsBoss'] = fetchedData[0].IsBoss
          product['IsWkOrd'] = fetchedData[0].IsWkOrd
          product['WkDeptName'] = fetchedData[0].WkDeptName
          product['WkDeptSeq'] = fetchedData[0].WkDeptSeq
          product['Contents'] = fetchedData[0].Contents
          product['Remark'] = fetchedData[0].Remark
          product['IsLast'] = fetchedData[0].IsLast
          

        }
      } catch (error) {
      } finally {
        setIsAPISuccess(true)
        controllers.current.onEmpCellClick = null
        if (loadingBarRef.current) {
          loadingBarRef.current.complete()
        }
      }
    },
    [isAPISuccess, loadingBarRef],
  )

  const onCellEdited = useCallback(
    async (cell, newValue) => {
      if (canEdit === false) {
        message.warning('Bạn không có quyền chỉnh sửa dữ liệu')
        return
      }
      if (
        newValue.kind !== GridCellKind.Text &&
        newValue.kind !== GridCellKind.Custom &&
        newValue.kind !== GridCellKind.Boolean &&
        newValue.kind !== GridCellKind.Number
      ) {
        return
      }

      const indexes = reorderColumns(cols)
      const [col, row] = cell
      const key = indexes[col]

      if (key === 'EmpName') {
        if (newValue.kind === GridCellKind.Custom) {
          setGridData((prev) => {
            const newData = [...prev]
            const product = newData[row]
            let selectedName = newValue.data[0]
            const checkCopyData = newValue.copyData
            if (!selectedName) {
              selectedName = dataUser.find(
                (item) => item.EmpName === checkCopyData,
              )
            }
            if (selectedName) {
              product['EmpName'] = selectedName.EmpName
              product['EmpSeq'] = selectedName.EmpSeq

              onEmpCellClick(
                selectedName.EmpSeq,
                selectedName.OrdDate,
                selectedName.OrdSeq,
                selectedName.DeptSeq,
                selectedName.PosSeq,
                selectedName.UMJpSeq,
                selectedName.UMPgSeq,
                selectedName.UMJdSeq,
                selectedName.UMJoSeq,
                selectedName.PuSeq,
                selectedName.PtSeq,
                selectedName.UMWsSeq,
                product,
              )
            } else {
              product['EmpName'] = ''
              product['EmpSeq'] = ''
            }

            product.isEdited = true
            product['IdxNo'] = row + 1
            const currentStatus = product['Status'] || 'U'
            product['Status'] = currentStatus === 'A' ? 'A' : 'U'

            setEditedRows((prevEditedRows) =>
              updateEditedRows(prevEditedRows, row, newData, currentStatus),
            )

            return newData
          })
          return
        }
      }

      if (key === 'OrdName') {
        if (newValue.kind === GridCellKind.Custom) {
          setGridData((prev) => {
            const newData = [...prev]
            const product = newData[row]
            let selectedName = newValue.data[0]
            const checkCopyData = newValue.copyData
            if (!selectedName) {
              selectedName = OrdData.find(
                (item) => item.OrdName === checkCopyData,
              )
            }
            if (selectedName) {
              product['OrdName'] = selectedName.OrdName
              product['OrdSeq'] = selectedName.OrdSeq
            } else {
              product['OrdName'] = ''
              product['OrdSeq'] = ''
            }

            product.isEdited = true
            product['IdxNo'] = row + 1
            const currentStatus = product['Status'] || 'U'
            product['Status'] = currentStatus === 'A' ? 'A' : 'U'

            setEditedRows((prevEditedRows) =>
              updateEditedRows(prevEditedRows, row, newData, currentStatus),
            )

            return newData
          })
          return
        }
      }

      if (key === 'DeptName') {
        if (newValue.kind === GridCellKind.Custom) {
          setGridData((prev) => {
            const newData = [...prev]
            const product = newData[row]
            let selectedName = newValue.data[0]
            const checkCopyData = newValue.copyData
            if (!selectedName) {
              selectedName = DeptData.find(
                (item) => item.BeDeptName === checkCopyData,
              )
            }
            if (selectedName) {
              product['DeptName'] = selectedName.BeDeptName
              product['DeptSeq'] = selectedName.BeDeptSeq
            } else {
              product['DeptName'] = ''
              product['DeptSeq'] = ''
            }

            product.isEdited = true
            product['IdxNo'] = row + 1
            const currentStatus = product['Status'] || 'U'
            product['Status'] = currentStatus === 'A' ? 'A' : 'U'

            setEditedRows((prevEditedRows) =>
              updateEditedRows(prevEditedRows, row, newData, currentStatus),
            )

            return newData
          })
          return
        }
      }

      if (key === 'PosName') {
        if (newValue.kind === GridCellKind.Custom) {
          setGridData((prev) => {
            const newData = [...prev]
            const product = newData[row]
            let selectedName = newValue.data[0]
            const checkCopyData = newValue.copyData
            if (!selectedName) {
              selectedName = PosData.find(
                (item) => item.MinorName === checkCopyData,
              )
            }
            if (selectedName) {
              product['PosName'] = selectedName.MinorName
              product['PosSeq'] = selectedName.Value
            } else {
              product['PosName'] = ''
              product['PosSeq'] = ''
            }

            product.isEdited = true
            product['IdxNo'] = row + 1
            const currentStatus = product['Status'] || 'U'
            product['Status'] = currentStatus === 'A' ? 'A' : 'U'

            setEditedRows((prevEditedRows) =>
              updateEditedRows(prevEditedRows, row, newData, currentStatus),
            )

            return newData
          })
          return
        }
      }

      if (key === 'UMJpName') {
        if (newValue.kind === GridCellKind.Custom) {
          setGridData((prev) => {
            const newData = [...prev]
            const product = newData[row]
            let selectedName = newValue.data[0]
            const checkCopyData = newValue.copyData
            if (!selectedName) {
              selectedName = UMJpNameData.find(
                (item) => item.MinorName === checkCopyData,
              )
            }
            if (selectedName) {
              product['UMJpName'] = selectedName.MinorName
              product['UMJpSeq'] = selectedName.Value
            } else {
              product['UMJpName'] = ''
              product['UMJpSeq'] = ''
            }

            product.isEdited = true
            product['IdxNo'] = row + 1
            const currentStatus = product['Status'] || 'U'
            product['Status'] = currentStatus === 'A' ? 'A' : 'U'

            setEditedRows((prevEditedRows) =>
              updateEditedRows(prevEditedRows, row, newData, currentStatus),
            )

            return newData
          })
          return
        }
      }

      if (key === 'UMPgName') {
        if (newValue.kind === GridCellKind.Custom) {
          setGridData((prev) => {
            const newData = [...prev]
            const product = newData[row]
            let selectedName = newValue.data[0]
            const checkCopyData = newValue.copyData
            if (!selectedName) {
              selectedName = UMPgNameData.find(
                (item) => item.MinorName === checkCopyData,
              )
            }
            if (selectedName) {
              product['UMPgName'] = selectedName.MinorName
              product['UMPgSeq'] = selectedName.Value
            } else {
              product['UMPgName'] = ''
              product['UMPgSeq'] = ''
            }

            product.isEdited = true
            product['IdxNo'] = row + 1
            const currentStatus = product['Status'] || 'U'
            product['Status'] = currentStatus === 'A' ? 'A' : 'U'

            setEditedRows((prevEditedRows) =>
              updateEditedRows(prevEditedRows, row, newData, currentStatus),
            )

            return newData
          })
          return
        }
      }

      if (key === 'UMJdName') {
        if (newValue.kind === GridCellKind.Custom) {
          setGridData((prev) => {
            const newData = [...prev]
            const product = newData[row]
            let selectedName = newValue.data[0]
            const checkCopyData = newValue.copyData
            if (!selectedName) {
              selectedName = UMJdNameData.find(
                (item) => item.MinorName === checkCopyData,
              )
            }
            if (selectedName) {
              product['UMJdName'] = selectedName.MinorName
              product['UMJdSeq'] = selectedName.Value
            } else {
              product['UMJdName'] = ''
              product['UMJdSeq'] = ''
            }

            product.isEdited = true
            product['IdxNo'] = row + 1
            const currentStatus = product['Status'] || 'U'
            product['Status'] = currentStatus === 'A' ? 'A' : 'U'

            setEditedRows((prevEditedRows) =>
              updateEditedRows(prevEditedRows, row, newData, currentStatus),
            )

            return newData
          })
          return
        }
      }

      if (key === 'UMJoName') {
        if (newValue.kind === GridCellKind.Custom) {
          setGridData((prev) => {
            const newData = [...prev]
            const product = newData[row]
            let selectedName = newValue.data[0]
            const checkCopyData = newValue.copyData
            if (!selectedName) {
              selectedName = UMJoNameData.find(
                (item) => item.MinorName === checkCopyData,
              )
            }
            if (selectedName) {
              product['UMJoName'] = selectedName.MinorName
              product['UMJoSeq'] = selectedName.Value
            } else {
              product['UMJoName'] = ''
              product['UMJoSeq'] = ''
            }

            product.isEdited = true
            product['IdxNo'] = row + 1
            const currentStatus = product['Status'] || 'U'
            product['Status'] = currentStatus === 'A' ? 'A' : 'U'

            setEditedRows((prevEditedRows) =>
              updateEditedRows(prevEditedRows, row, newData, currentStatus),
            )

            return newData
          })
          return
        }
      }

      if (key === 'JobName') {
        if (newValue.kind === GridCellKind.Custom) {
          setGridData((prev) => {
            const newData = [...prev]
            const product = newData[row]
            let selectedName = newValue.data[0]
            const checkCopyData = newValue.copyData
            if (!selectedName) {
              selectedName = JobNameData.find(
                (item) => item.JobName === checkCopyData,
              )
            }
            if (selectedName) {
              product['JobName'] = selectedName.JobName
              product['JobSeq'] = selectedName.JobSeq
            } else {
              product['JobName'] = ''
              product['JobSeq'] = ''
            }

            product.isEdited = true
            product['IdxNo'] = row + 1
            const currentStatus = product['Status'] || 'U'
            product['Status'] = currentStatus === 'A' ? 'A' : 'U'

            setEditedRows((prevEditedRows) =>
              updateEditedRows(prevEditedRows, row, newData, currentStatus),
            )

            return newData
          })
          return
        }
      }

      if (key === 'PuName') {
        if (newValue.kind === GridCellKind.Custom) {
          setGridData((prev) => {
            const newData = [...prev]
            const product = newData[row]
            let selectedName = newValue.data[0]
            const checkCopyData = newValue.copyData
            if (!selectedName) {
              selectedName = PuNameData.find(
                (item) => item.PuName === checkCopyData,
              )
            }
            if (selectedName) {
              product['PuName'] = selectedName.PuName
              product['PuSeq'] = selectedName.PuSeq
            } else {
              product['PuName'] = ''
              product['PuSeq'] = ''
            }

            product.isEdited = true
            product['IdxNo'] = row + 1
            const currentStatus = product['Status'] || 'U'
            product['Status'] = currentStatus === 'A' ? 'A' : 'U'

            setEditedRows((prevEditedRows) =>
              updateEditedRows(prevEditedRows, row, newData, currentStatus),
            )

            return newData
          })
          return
        }
      }

      if (key === 'PtName') {
        if (newValue.kind === GridCellKind.Custom) {
          setGridData((prev) => {
            const newData = [...prev]
            const product = newData[row]
            let selectedName = newValue.data[0]
            const checkCopyData = newValue.copyData
            if (!selectedName) {
              selectedName = PtNameData.find(
                (item) => item.PtName === checkCopyData,
              )
            }
            if (selectedName) {
              product['PtName'] = selectedName.PtName
              product['PtSeq'] = selectedName.PtSeq
            } else {
              product['PtName'] = ''
              product['PtSeq'] = ''
            }

            product.isEdited = true
            product['IdxNo'] = row + 1
            const currentStatus = product['Status'] || 'U'
            product['Status'] = currentStatus === 'A' ? 'A' : 'U'

            setEditedRows((prevEditedRows) =>
              updateEditedRows(prevEditedRows, row, newData, currentStatus),
            )

            return newData
          })
          return
        }
      }

      if (key === 'UMWsName') {
        if (newValue.kind === GridCellKind.Custom) {
          setGridData((prev) => {
            const newData = [...prev]
            const product = newData[row]
            let selectedName = newValue.data[0]
            const checkCopyData = newValue.copyData
            if (!selectedName) {
              selectedName = UMWsNameData.find(
                (item) => item.MinorName === checkCopyData,
              )
            }
            if (selectedName) {
              product['UMWsName'] = selectedName.MinorName
              product['UMWsSeq'] = selectedName.Value
            } else {
              product['UMWsName'] = ''
              product['UMWsSeq'] = ''
            }

            product.isEdited = true
            product['IdxNo'] = row + 1
            const currentStatus = product['Status'] || 'U'
            product['Status'] = currentStatus === 'A' ? 'A' : 'U'

            setEditedRows((prevEditedRows) =>
              updateEditedRows(prevEditedRows, row, newData, currentStatus),
            )

            return newData
          })
          return
        }
      }

      if (key === 'WkDeptName') {
        if (newValue.kind === GridCellKind.Custom) {
          setGridData((prev) => {
            const newData = [...prev]
            const product = newData[row]
            let selectedName = newValue.data[0]
            const checkCopyData = newValue.copyData
            if (!selectedName) {
              selectedName = DeptData.find(
                (item) => item.BeDeptName === checkCopyData,
              )
            }
            if (selectedName) {
              product['WkDeptName'] = selectedName.BeDeptName
              product['WkDeptSeq'] = selectedName.BeDeptSeq
            } else {
              product['WkDeptName'] = ''
              product['WkDeptSeq'] = ''
            }

            product.isEdited = true
            product['IdxNo'] = row + 1
            const currentStatus = product['Status'] || 'U'
            product['Status'] = currentStatus === 'A' ? 'A' : 'U'

            setEditedRows((prevEditedRows) =>
              updateEditedRows(prevEditedRows, row, newData, currentStatus),
            )

            return newData
          })
          return
        }
      }

      setGridData((prevData) => {
        const updatedData = [...prevData]
        if (!updatedData[row]) updatedData[row] = {}

        const currentStatus = updatedData[row]['Status'] || ''
        updatedData[row][key] = newValue.data
        updatedData[row]['Status'] = currentStatus === 'A' ? 'A' : 'U'

        setEditedRows((prevEditedRows) => {
          const existingIndex = prevEditedRows.findIndex(
            (editedRow) => editedRow.rowIndex === row,
          )

          const updatedRowData = {
            rowIndex: row,
            updatedRow: updatedData[row],
            status: currentStatus === 'A' ? 'A' : 'U',
          }

          if (existingIndex === -1) {
            return [...prevEditedRows, updatedRowData]
          } else {
            const updatedEditedRows = [...prevEditedRows]
            updatedEditedRows[existingIndex] = updatedRowData
            return updatedEditedRows
          }
        })

        return updatedData
      })
    },
    [canEdit, cols, gridData, isAPISuccess],
  )

  const onColumnResize = useCallback(
    (column, newSize) => {
      const index = cols.indexOf(column)
      if (index !== -1) {
        const newCol = {
          ...column,
          width: newSize,
        }
        const newCols = [...cols]
        newCols.splice(index, 1, newCol)
        setCols(newCols)
      }
    },
    [cols],
  )

  const { renderLayer, layerProps } = useLayer({
    isOpen: showMenu !== null,
    triggerOffset: 4,
    onOutsideClick: () => setShowMenu(null),
    trigger: {
      getBounds: () => ({
        bottom: (showMenu?.bounds.y ?? 0) + (showMenu?.bounds.height ?? 0),
        height: showMenu?.bounds.height ?? 0,
        left: showMenu?.bounds.x ?? 0,
        right: (showMenu?.bounds.x ?? 0) + (showMenu?.bounds.width ?? 0),
        top: showMenu?.bounds.y ?? 0,
        width: showMenu?.bounds.width ?? 0,
      }),
    },
    placement: 'bottom-start',
    auto: true,
    possiblePlacements: ['bottom-start', 'bottom-end'],
  })

  const handleSort = (columnId, direction) => {
    setGridData((prevData) => {
      const rowsWithStatusA = prevData.filter((row) => row.Status === 'A')
      const rowsWithoutStatusA = prevData.filter((row) => row.Status !== 'A')

      const sortedData = rowsWithoutStatusA.sort((a, b) => {
        if (a[columnId] < b[columnId]) return direction === 'asc' ? -1 : 1
        if (a[columnId] > b[columnId]) return direction === 'asc' ? 1 : -1
        return 0
      })

      const updatedData = updateIndexNo([...sortedData, ...rowsWithStatusA])

      return updatedData
    })

    setShowMenu(null)
  }

  const updateHiddenColumns = (newHiddenColumns) => {
    setHiddenColumns((prevHidden) => {
      const newHidden = [...new Set([...prevHidden, ...newHiddenColumns])]
      saveToLocalStorageSheet('HR_ADM_ORD_MULTI_H', newHidden)
      return newHidden
    })
  }

  const updateVisibleColumns = (newVisibleColumns) => {
    setCols((prevCols) => {
      const newCols = [...new Set([...prevCols, ...newVisibleColumns])]
      const uniqueCols = newCols.filter(
        (col, index, self) => index === self.findIndex((c) => c.id === col.id),
      )
      saveToLocalStorageSheet('HR_ADM_ORD_MULTI', uniqueCols)
      return uniqueCols
    })
  }

  // Hàm ẩn cột
  const handleHideColumn = (colIndex) => {
    const columnId = cols[colIndex]?.id
    if (cols.length > 1) {
      updateHiddenColumns([columnId])
      setCols((prevCols) => {
        const newCols = prevCols.filter((_, idx) => idx !== colIndex)
        const uniqueCols = newCols.filter(
          (col, index, self) =>
            index === self.findIndex((c) => c.id === col.id),
        )
        saveToLocalStorageSheet('HR_ADM_ORD_MULTI', uniqueCols)
        return uniqueCols
      })
      setShowMenu(null)
    }
  }
  // Hàm rEST LẤY LẠI CỘT DỮ LIỆU

  const handleReset = () => {
    setCols(defaultCols.filter((col) => col.visible))
    setHiddenColumns([])
    localStorage.removeItem('HR_ADM_ORD_MULTI')
    localStorage.removeItem('HR_ADM_ORD_MULTI_H')
    setShowMenu(null)
  }

  const onColumnMoved = useCallback((startIndex, endIndex) => {
    setCols((prevCols) => {
      const updatedCols = [...prevCols]
      const [movedColumn] = updatedCols.splice(startIndex, 1)
      updatedCols.splice(endIndex, 0, movedColumn)
      saveToLocalStorageSheet('HR_ADM_ORD_MULTI', updatedCols)
      return updatedCols
    })
  }, [])

  const showDrawer = () => {
    const invisibleCols = defaultCols
      .filter((col) => col.visible === false)
      .map((col) => col.id)
    const currentVisibleCols = loadFromLocalStorageSheet(
      'HR_ADM_ORD_MULTI',
      [],
    ).map((col) => col.id)
    const newInvisibleCols = invisibleCols.filter(
      (col) => !currentVisibleCols.includes(col),
    )
    updateHiddenColumns(newInvisibleCols)
    updateVisibleColumns(
      defaultCols.filter(
        (col) => col.visible && !hiddenColumns.includes(col.id),
      ),
    )
    setOpen(true)
    setShowMenu(null)
  }
  const onClose = () => {
    setOpen(false)
  }

  const handleCheckboxChange = (columnId, isChecked) => {
    if (isChecked) {
      const restoredColumn = defaultCols.find((col) => col.id === columnId)
      setCols((prevCols) => {
        const newCols = [...prevCols, restoredColumn]
        saveToLocalStorageSheet('HR_ADM_ORD_MULTI', newCols)
        return newCols
      })
      setHiddenColumns((prevHidden) => {
        const newHidden = prevHidden.filter((id) => id !== columnId)
        saveToLocalStorageSheet('HR_ADM_ORD_MULTI_H', newHidden)
        return newHidden
      })
    } else {
      setCols((prevCols) => {
        const newCols = prevCols.filter((col) => col.id !== columnId)
        saveToLocalStorageSheet('HR_ADM_ORD_MULTI', newCols)
        return newCols
      })
      setHiddenColumns((prevHidden) => {
        const newHidden = [...prevHidden, columnId]
        saveToLocalStorageSheet('HR_ADM_ORD_MULTI_H', newHidden)
        return newHidden
      })
    }
  }

  return (
    <div className="w-full  h-full flex items-center justify-center">
      <div className="w-full h-full flex flex-col bg-white  overflow-x-hidden overflow-hidden ">
        <DataEditor
          {...cellProps}
          ref={gridRef}
          columns={cols}
          getCellContent={getData}
          onFill={onFill}
          rows={numRows}
          showSearch={showSearch}
          onSearchClose={onSearchClose}
          rowMarkers="both"
          rowSelect="multi"
          gridSelection={selection}
          onGridSelectionChange={setSelection}
          getCellsForSelection={true}
          width="100%"
          height="100%"
          headerHeight={30}
          freezeTrailingRows={1}
          onRowAppended={() => handleRowAppend(1)}
          rowHeight={27}
          freezeColumns={1}
          getRowThemeOverride={(rowIndex) => {
            if (rowIndex === hoverRow) {
              return {
                bgCell: '#f7f7f7',
                bgCellMedium: '#f0f0f0',
              }
            }
            return undefined
          }}
          overscrollY={0}
          overscrollX={0}
          smoothScrollX={true}
          smoothScrollY={true}
          onPaste={true}
          fillHandle={true}
          keybindings={keybindings}
          isDraggable={false}
          onColumnResize={onColumnResize}
          onHeaderMenuClick={onHeaderMenuClick}
          onColumnMoved={onColumnMoved}
          onKeyUp={onKeyUp}
          onItemHovered={onItemHovered}
          highlightRegions={highlightRegions}
          onCellClicked={onCellClicked}
          onCellEdited={onCellEdited}
          customRenderers={[
            CellsItemNameV01,
            CellsEmpNameV2,
            CellsOrdName,
            CellDeptName,
            CellPosName,
            CellsUMJpName,
            CellsUMPgName,
            CellsUMJdName,
            CellsUMJoName,
            CellsJobName,
            CellsPuName,
            CellsPtName,
            CellsUMWsName,
          ]}
        />
        {showMenu !== null &&
          renderLayer(
            <div
              {...layerProps}
              className="border  w-72 rounded-lg bg-white shadow-lg cursor-pointer"
            >
              {showMenu.menuType === 'statusMenu' ? (
                <LayoutStatusMenuSheet
                  showMenu={showMenu}
                  data={gridData}
                  handleRowAppend={handleRowAppend}
                  handleRestSheet={handleRestSheet}
                  handleSort={handleSort}
                  cols={cols}
                  renderLayer={renderLayer}
                  setShowSearch={setShowSearch}
                  setShowMenu={setShowMenu}
                  layerProps={layerProps}
                  handleReset={handleReset}
                  showDrawer={showDrawer}
                />
              ) : (
                <LayoutMenuSheet
                  showMenu={showMenu}
                  handleSort={handleSort}
                  handleHideColumn={handleHideColumn}
                  cols={cols}
                  renderLayer={renderLayer}
                  setShowSearch={setShowSearch}
                  setShowMenu={setShowMenu}
                  layerProps={layerProps}
                />
              )}
            </div>,
          )}
        <Drawer title="CÀI ĐẶT SHEET" onClose={onClose} open={open}>
          {defaultCols.map(
            (col) =>
              col.id !== 'Status' && (
                <div key={col.id} style={{ marginBottom: '10px' }}>
                  <Checkbox
                    checked={!hiddenColumns.includes(col.id)}
                    onChange={(e) =>
                      handleCheckboxChange(col.id, e.target.checked)
                    }
                  >
                    {col.title}
                  </Checkbox>
                </div>
              ),
          )}
        </Drawer>
      </div>
    </div>
  )
}

export default TableHrAdmMultiOrd
