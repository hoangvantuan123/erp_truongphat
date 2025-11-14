import { ArrowLeftIcon } from '../../icons'
import TableStockOUtFiFoA from './tableStockOutFiFoA'
import TableStockOUtFiFoB from './tableStockOutFiFoB'

function TableTransferStockOutFiFo({
  sampleTableA,
  sampleTableB,
  setSelection,
  selection,
  setInputItemNo,
  inputItemNo,
}) {
  return (
    <div className="w-full gap-1 h-full flex items-center justify-center">
      <div className="w-[55%] h-full flex flex-col border bg-white rounded-lg overflow-hidden pb-7">
        <div className=" text-xs font-medium flex items-center gap-2 p-2 text-blue-600 uppercase ">
          THÔNG TIN BARCODE
        </div>
        <TableStockOUtFiFoB
          data={sampleTableB}
          setSelection={setSelection}
          selection={selection}
        />
      </div>
      <div className="w-[45%] h-full flex flex-col border bg-white rounded-lg overflow-hidden pb-7">
        <div className=" text-xs font-medium flex items-center gap-2 p-2 text-blue-600 uppercase ">
          THÔNG TIN ĐƠN HÀNG
        </div>
        <TableStockOUtFiFoA
          data={sampleTableA}
          setInputItemNo={setInputItemNo}
          inputItemNo={inputItemNo}
        />
      </div>
    </div>
  )
}

export default TableTransferStockOutFiFo
