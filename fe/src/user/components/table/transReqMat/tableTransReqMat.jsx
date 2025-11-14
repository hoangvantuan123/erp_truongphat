import { useEffect, useState, useCallback, useMemo, useRef } from 'react'
import { DataEditor, GridCellKind } from '@glideapps/glide-data-grid'
import '@glideapps/glide-data-grid/dist/index.css'
import { CompactSelection, GridColumnIcon } from '@glideapps/glide-data-grid'
import { TableOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { reorderColumns } from '../../sheet/js/reorderColumns'
import ModalConfirm from '../../modal/transReqMat/modalConfirm'
import { message } from 'antd'
import dayjs from 'dayjs'
import {
  UpdatedReqByConfirm,
  UpdatedReqByStop,
} from '../../../../features/transReqMat/postTransReqMat'

function TableTransReqMat({
  data,
  onCellClicked,
  gridData,
  setGridData,
  fetchTransReqData,
}) {
  const [showSearch, setShowSearch] = useState(false)
  const ref = (useRef < data) | (null > null)
  const formatDate = useCallback((date) => date.format('DD-MM-YYYY'), [])

  const [editedRows, setEditedRows] = useState([])
  const [modalOpen, setmodalOpen] = useState(false)
  const [keyPath, setKeyPath] = useState(null)
  const [messageConfirm, setMessageConfirm] = useState('')
  const [reqStop, setReqStop] = useState(null)
  const [reqConfirm, setReqConfirm] = useState(null)
  const [indexNo, setIndexNo] = useState('')
  const [isColStop, setIsColStop] = useState(null)
  const [reason, setReason] = useState('')

  const onSearchClose = useCallback(() => setShowSearch(false), [])
  const { t } = useTranslation()
  const [selection, setSelection] = useState({
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty(),
  })

  const columns = useMemo(
    () => [
      {
        title: t('1326'),
        id: 'IsStop',
        kind: 'Boolean',
        readonly: false,
        width: 120,
        hasMenu: true,
        icon: GridColumnIcon.HeaderBoolean,
      },
      {
        title: t('607'),
        id: 'IsPJT',
        kind: 'Boolean',
        readonly: false,
        width: 120,
        hasMenu: true,
        icon: GridColumnIcon.HeaderBoolean,
      },
      {
        title: t('11316'),
        id: 'IsTrans',
        kind: 'Boolean',
        readonly: true,
        width: 120,
        hasMenu: true,
        icon: GridColumnIcon.HeaderBoolean,
      },
      {
        title: t('722'),
        id: 'BizUnitName',

        kind: 'Text',
        readonly: false,
        width: 120,
        hasMenu: true,
        icon: GridColumnIcon.HeaderString,
      },
      {
        title: t('647'),
        id: 'ReqNo',

        kind: 'Text',
        readonly: false,
        width: 120,
        hasMenu: true,
        icon: GridColumnIcon.HeaderCode,
      },
      {
        title: t('718'),
        id: 'TransBizUnitName',

        kind: 'Text',
        readonly: false,
        width: 120,
        hasMenu: true,
        icon: GridColumnIcon.HeaderString,
      },
      {
        title: t('200'),
        id: 'ReqDate',

        kind: 'Text',
        readonly: false,
        width: 120,
        hasMenu: true,
        icon: GridColumnIcon.HeaderTime,
      },
      {
        title: t('419'),
        id: 'CompleteWishDate',

        kind: 'Text',
        readonly: false,
        width: 120,
        hasMenu: true,
        icon: GridColumnIcon.HeaderTime,
      },
      {
        title: t('626'),
        id: 'OutWHName',

        kind: 'Text',
        readonly: false,
        width: 120,
        hasMenu: true,
        icon: GridColumnIcon.HeaderString,
      },
      {
        title: t('584'),
        id: 'InWHName',

        kind: 'Text',
        readonly: false,
        width: 120,
        hasMenu: true,
        icon: GridColumnIcon.HeaderString,
      },
      {
        title: t('366'),
        id: 'DeptName',

        kind: 'Text',
        readonly: false,
        width: 120,
        hasMenu: true,
        icon: GridColumnIcon.HeaderString,
      },
      {
        title: t('360'),
        id: 'EmpName',
        kind: 'Text',
        readonly: false,
        width: 120,
        hasMenu: true,
        icon: GridColumnIcon.HeaderString,
      },
      {
        title: t('369'),
        id: 'SMProgressTypeName',
        kind: 'Text',
        readonly: false,
        width: 120,
        hasMenu: true,
        icon: GridColumnIcon.HeaderString,
      },
      {
        title: t('362'),
        id: 'Remark',
        kind: 'Text',
        readonly: false,
        width: 120,
        hasMenu: true,
        icon: GridColumnIcon.HeaderString,
      },
    ],
    [],
  )

  const [cols, setCols] = useState(columns)
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

  const getData = useCallback(
    ([col, row]) => {
      let kind = GridCellKind.Text
      const person = gridData[row] || {}
      const column = cols[col]
      const columnKey = column?.id || ''
      const value = person[columnKey] || ''

      if (['IsStop', 'IsPJT', 'IsTrans'].includes(columnKey)) {
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

      return {
        kind: kind,
        data: kind === GridCellKind.Boolean ? Boolean(value) : value,
        displayData: kind === GridCellKind.Boolean ? undefined : String(value),
        readonly: column?.readonly || false,
        allowOverlay: true,
        hasMenu: column?.hasMenu || false,
      }
    },
    [gridData, cols],
  )

  const [lastActivated, setLastActivated] = useState(undefined)

  const onCellActivated = useCallback((cell) => {
    console.log('cell', cell)
    setLastActivated(cell)
  }, [])

  const resetTable = () => {
    setSelection({
      columns: CompactSelection.empty(),
      rows: CompactSelection.empty(),
    })
  }

  const onCellEdited = useCallback(
    async (cell, newValue) => {
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

      if (key === 'IsStop') {
        if (newValue.kind === GridCellKind.Boolean) {
          setmodalOpen(true)
          setGridData((prev) => {
            const newData = [...prev]
            const product = newData[row]
            setMessageConfirm(`Tạm dừng yêu cầu số  ${product['ReqNo']} ?`)
            setReqStop(product)
            setIndexNo(row + 1)
            setIsColStop(true)
            return newData
          })
          return
        }
      }
      if (key === 'IsPJT') {
        if (newValue.kind === GridCellKind.Boolean) {
          setmodalOpen(true)
          setGridData((prev) => {
            const newData = [...prev]
            const product = newData[row]
            setMessageConfirm(`Xác nhận yêu cầu số  ${product['ReqNo']}?`)
            setReqConfirm(product)
            setIndexNo(row + 1)
            setIsColStop(false)
            return newData
          })
          return
        }
      }

      setGridData((prevData) => {
        const updatedData = [...prevData]
        if (!updatedData[row]) updatedData[row] = {}

        const currentStatus = updatedData[row]['Status'] || ''
        if (
          newValue.kind === GridCellKind.Text ||
          newValue.kind === GridCellKind.Custom ||
          newValue.kind === GridCellKind.Boolean
        ) {
          updatedData[row][key] =
            newValue.copyData === '' && newValue.displayData === ''
              ? newValue.data
              : newValue.copyData === newValue.displayData
                ? newValue.data
                : newValue.displayData
        }
        if (newValue.kind === GridCellKind.Number) {
          const parseFormattedNumber = (formattedValue) => {
            return parseFloat(String(formattedValue).replace(/,/g, ''))
          }

          updatedData[row][key] =
            newValue.copyData === '' && newValue.displayData === ''
              ? parseFormattedNumber(newValue.data)
              : newValue.copyData === newValue.displayData
                ? parseFormattedNumber(newValue.data)
                : parseFormattedNumber(newValue.displayData)
        }
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
    [cols, gridData],
  )

  const onClickOk = async () => {
    setmodalOpen(false)

    const loadingMessage = message.loading('Đang thực hiện lưu dữ liệu...')
    try {
      const payload = {
        ReqSeq: reqConfirm.ReqSeq,
        IndexNo: indexNo,
        DataSeq: reqConfirm.DataSeq || 1,
        WMSInOutReqSeq: reqConfirm.WMSInOutReqSeq || 8071008,
        reason: reason,
      }

      let result
      loadingMessage()
      if (!isColStop) {
        result = await UpdatedReqByConfirm(payload)
      } else {
        result = await UpdatedReqByStop(payload)
      }

      console.log('result', result)

      if (result?.result != 0) {
        message.error(result?.message)
      } else {
        message.success('Lưu dữ liệu thành công!')
      }

      setEditedRows([])
      fetchTransReqData()
    } catch (error) {
      loadingMessage()
      message.error(error.message || 'Có lỗi xảy ra khi lưu dữ liệu')
    }
  }

  return (
    <div className="w-full gap-1 h-full flex items-center justify-center pb-8  overflow-hidden">
      <div className="w-full h-full flex flex-col border bg-white rounded-lg overflow-hidden ">
        <h2 className="text-xs font-medium flex items-center gap-2 p-2 text-blue-600 uppercase">
          <TableOutlined />
          SHEET DATA
        </h2>
        <DataEditor
          columns={cols}
          getCellContent={getData}
          rows={gridData.length}
          showSearch={showSearch}
          getCellsForSelection={true}
          onSearchClose={onSearchClose}
          width="100%"
          height="100%"
          rowMarkers={('checkbox-visible', 'both')}
          useRef={useRef}
          onColumnResize={onColumnResize}
          smoothScrollY={true}
          smoothScrollX={true}
          rowSelect="single"
          onCellClicked={onCellClicked}
          gridSelection={selection}
          onGridSelectionChange={setSelection}
          onCellEdited={onCellEdited}
          getRowThemeOverride={(i) =>
            i % 2 === 0
              ? undefined
              : {
                  bgCell: '#FBFBFB',
                }
          }
        />
      </div>
      <ModalConfirm
        modalOpen={modalOpen}
        setmodalOpen={setmodalOpen}
        MessageConfirm={messageConfirm}
        onOk={onClickOk}
        resetTable={resetTable}
        setKeyPath={setKeyPath}
        isShowInput={true}
        placeholderMessage={'Lý do'}
        reason={reason}
        setReason={setReason}
      />
    </div>
  )
}

export default TableTransReqMat
