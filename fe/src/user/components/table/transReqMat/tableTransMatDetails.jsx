import { useEffect, useState, useCallback, useMemo, useRef } from 'react'
import { DataEditor, GridCellKind } from '@glideapps/glide-data-grid'
import { CompactSelection, GridColumnIcon } from '@glideapps/glide-data-grid'
import { TableOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import ModalConfirm from '../../modal/transReqMat/modalConfirm'
import { reorderColumns } from '../../sheet/js/reorderColumns'

function TableTransMatDetails({ data, onCellClicked, gridData, setGridData }) {
  const [showSearch, setShowSearch] = useState(false)
  const ref = (useRef < data) | (null > null)
  const [vals, setVals] = useState([false, false, false])
  const [modalOpen, setmodalOpen] = useState(false)
  const [messageConfirm, setMessageConfirm] = useState('')
  const [keyPath, setKeyPath] = useState(null)
  const [reason, setReason] = useState('')

  const [reqStop, setReqStop] = useState(null)
  const [reqConfirm, setReqConfirm] = useState(null)
  const [indexNo, setIndexNo] = useState('')
  const [isColStop, setIsColStop] = useState(null)

  const onSearchClose = useCallback(() => setShowSearch(false), [])
  const { t } = useTranslation()
  const [selection, setSelection] = useState({
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty(),
  })

  const columns = useMemo(
    () => [
      {
        title: t('607'),
        id: 'Confirm',
        kind: 'Boolean',
        readonly: false,
        width: 120,
        hasMenu: true,
        icon: GridColumnIcon.HeaderBoolean,
      },
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
        title: t('8949'),
        id: 'StopEmpName',
        kind: 'Text',
        readonly: false,
        width: 120,
        hasMenu: true,
        icon: GridColumnIcon.HeaderString,
      },
      {
        title: t('17582'),
        id: 'StopDate',

        kind: 'Text',
        readonly: false,
        width: 120,
        hasMenu: true,
        icon: GridColumnIcon.HeaderTime,
      },
      {
        title: t('8947'),
        id: 'StopRemark',

        kind: 'Text',
        readonly: false,
        width: 120,
        hasMenu: true,
        icon: GridColumnIcon.HeaderString,
      },
      {
        title: t('11316'),
        id: 'IsTrans',

        kind: 'Text',
        readonly: false,
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
        icon: GridColumnIcon.HeaderString,
      },
      {
        title: t('718'),
        id: 'OutWHName',

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
        icon: GridColumnIcon.HeaderDate,
      },
      {
        title: t('419'),
        id: 'CompleteWishDate',

        kind: 'Text',
        readonly: false,
        width: 120,
        hasMenu: true,
        icon: GridColumnIcon.HeaderDate,
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
        title: t('2090'),
        id: 'ItemName',
        kind: 'Text',
        readonly: false,
        width: 120,
        hasMenu: true,
        icon: GridColumnIcon.HeaderString,
      },
      {
        title: t('2091'),
        id: 'ItemNo',
        kind: 'Text',
        readonly: false,
        width: 120,
        hasMenu: true,
        icon: GridColumnIcon.HeaderString,
      },
      {
        title: t('551'),
        id: 'Spec',
        kind: 'Text',
        readonly: false,
        width: 120,
        hasMenu: true,
        icon: GridColumnIcon.HeaderString,
      },
      {
        title: t('602'),
        id: 'UnitName',
        kind: 'Text',
        readonly: false,
        width: 120,
        hasMenu: true,
        icon: GridColumnIcon.HeaderString,
      },
      {
        title: t('7516'),
        id: 'Qty',
        kind: 'Text',
        readonly: false,
        width: 120,
        hasMenu: true,
        icon: GridColumnIcon.HeaderNumber,
      },
      {
        title: t('9106'),
        id: 'ProgressQty',
        kind: 'Text',
        readonly: false,
        width: 120,
        hasMenu: true,
        icon: GridColumnIcon.HeaderNumber,
      },
      {
        title: t('13511'),
        id: 'NotProgressQty',
        kind: 'Text',
        readonly: false,
        width: 120,
        hasMenu: true,
        icon: GridColumnIcon.HeaderNumber,
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
        title: t('2085'),
        id: 'STDUnitName',
        kind: 'Text',
        readonly: false,
        width: 120,
        hasMenu: true,
        icon: GridColumnIcon.HeaderString,
      },
      {
        title: t('2474'),
        id: 'STDQty',
        kind: 'Text',
        readonly: false,
        width: 120,
        hasMenu: true,
        icon: GridColumnIcon.HeaderNumber,
      },
      {
        title: t('1868'),
        id: 'InOutReqDetailKindName',
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
        title: t('623'),
        id: 'EmpName',
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
      {
        title: t('25431'),
        id: 'LotNo',
        kind: 'Text',
        readonly: false,
        width: 120,
        hasMenu: true,
        icon: GridColumnIcon.HeaderString,
      },
      {
        title: t('17780'),
        id: 'ProgressQuery',
        kind: 'Text',
        readonly: false,
        width: 120,
        hasMenu: true,
        icon: GridColumnIcon.HeaderString,
      },
      {
        title: t('16242'),
        id: 'SourceQuery',
        kind: 'Text',
        readonly: false,
        width: 120,
        hasMenu: true,
        icon: GridColumnIcon.HeaderString,
      },
      {
        title: t('2454'),
        id: 'SourceRefNo',
        kind: 'Text',
        readonly: false,
        width: 120,
        hasMenu: true,
        icon: GridColumnIcon.HeaderString,
      },
      {
        title: t('1815'),
        id: 'SourceNo',
        kind: 'Text',
        readonly: false,
        width: 120,
        hasMenu: true,
        icon: GridColumnIcon.HeaderString,
      },
      {
        title: t('18830'),
        id: 'ItemRemark',
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

      const boundingBox = document.body.getBoundingClientRect()

      if (['Confirm', 'IsStop', 'IsTrans'].includes(columnKey)) {
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

      if (key === 'Confirm') {
        if (newValue.kind === GridCellKind.Boolean) {
          setmodalOpen(true)
          setGridData((prev) => {
            const newData = [...prev]
            const product = newData[row]
            setMessageConfirm(`Xác nhận yêu cầu số  ${product['ReqNo']} ?`)
            setReqStop(product)
            setIndexNo(row + 1)
            setIsColStop(true)
            return newData
          })
          return
        }
      }

      if (key === 'IsStop') {
        if (newValue.kind === GridCellKind.Boolean) {
          setmodalOpen(true)
          setGridData((prev) => {
            const newData = [...prev]
            const product = newData[row]
            setMessageConfirm(`Tạm dừng yêu cầu số  ${product['ReqNo']}?`)
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

  const [lastActivated, setLastActivated] = useState(undefined)

  const onCellActivated = useCallback((cell) => {
    console.log('cell', cell)
    setLastActivated(cell)
  }, [])

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

  const resetTable = () => {
    setSelection({
      columns: CompactSelection.empty(),
      rows: CompactSelection.empty(),
    })
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
          // freezeColumns={5}
          freezeTrailingRows={1}
          getRowThemeOverride={(i) =>
            i % 2 === 0
              ? undefined
              : {
                  bgCell: '#FBFBFB',
                }
          }
          fillHandle={true}
          onCellEdited={onCellEdited}
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

export default TableTransMatDetails
