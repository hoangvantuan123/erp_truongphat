import { useEffect, useState, useCallback, useMemo, useRef } from 'react'
import { DataEditor, GridCellKind } from '@glideapps/glide-data-grid'
import '@glideapps/glide-data-grid/dist/index.css'
import { Modal } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { CompactSelection } from '@glideapps/glide-data-grid'
function ModalWaiting2({
  modal2Open,
  setModal2Open,
  error,
  resetTable,
  setKeyPath,
  dataError,
}) {
  const [gridData, setGridData] = useState([])
  const [selection, setSelection] = useState({
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty(),
  })
  const ref = useRef()

  const columns = useMemo(
    () => [
      { title: 'Error Code', width: 100 },
      { title: 'Error Message', width: 400 },
    ],
    [],
  )
  const [cols, setCols] = useState([
    { title: 'Error Code', width: 100 },
    { title: 'Error Message', width: 350 },
  ])

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
      const person = gridData[row] || {}
      const { errorMessage, errorCode } = person

      const safeString = (value) => (value != null ? String(value) : '')

      const columnMap = {
        0: { kind: GridCellKind.Text, data: safeString(errorCode) },
        1: { kind: GridCellKind.Text, data: safeString(errorMessage) },
      }

      if (columnMap.hasOwnProperty(col)) {
        const { kind, data } = columnMap[col]
        return { kind, data, displayData: data }
      }

      return { kind: GridCellKind.Text, data: '', displayData: '' }
    },
    [gridData],
  )

  const handleOnCancel = () => {
    setModal2Open(false)
    if (typeof resetTable === 'function') {
      resetTable()
    }
    if (typeof setKeyPath === 'function') {
      setKeyPath(null)
    }
  }

  useEffect(() => {
    const rows = dataError.map((item) => {
      return {
        procedureIndex: item.procedureIndex,
        errorMessage: item.error[0],
        errorCode: item.error[1],
      }
    })
    setGridData(rows)
  }, [dataError])

  return (
    <Modal
      centered
      open={modal2Open}
      onOk={() => setModal2Open(false)}
      onCancel={handleOnCancel}
      closable={false}
      footer={false}
      width={800}
    >
      <div className="items-center justify-center flex flex-col">
        <ExclamationCircleOutlined className="text-4xl mb-2 text-red-500" />
        <p className="mt-10 text-lg">{error}</p>
        <div className="w-full h-full border  rounded-md">
          <DataEditor
            columns={cols}
            getCellContent={getData}
            rows={gridData.length}
            width="100%"
            height="400px"
            onCellClicked={(cell) => console.log('cell', cell)}
            rowMarkers="checkbox-visible"
            useRef={ref}
            gridSelection={selection}
            onGridSelectionChange={setSelection}
            getCellsForSelection={true}
            smoothScrollX={true}
            smoothScrollY={true}
            rowSelect="single"
            freezeColumns="0"
            onColumnResize={onColumnResize}
            onPaste={true}
            getRowThemeOverride={(i) =>
              i % 2 === 0 ? undefined : { bgCell: '#FBFBFB' }
            }
          />
        </div>
      </div>
    </Modal>
  )
}

export default ModalWaiting2
