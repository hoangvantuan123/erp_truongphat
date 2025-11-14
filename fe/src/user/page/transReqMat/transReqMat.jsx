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
import { useNavigate } from 'react-router-dom'
import { encodeBase64Url } from '../../../utils/decode-JWT'
import CryptoJS from 'crypto-js'
import TransReqMatActions from '../../components/actions/transReqMat/transReqMatActions'
import TransReqMatQuery from '../../components/query/transReqMat/transReqMatQuery'
import TableTransReqMat from '../../components/table/transReqMat/tableTransReqMat'
import { CompactSelection } from '@glideapps/glide-data-grid'
import { GetCodeHelp } from '../../../features/codeHelp/getCodeHelp'
import { SearchBy } from '../../../features/transReqMat/postTransReqMat'
import { reorderColumns } from '../../components/sheet/js/reorderColumns'

export default function TransReqMat({ permissions, isMobile }) {
  const gridRef = useRef(null)
  const navigate = useNavigate()

  const [loadingA, setLoadingA] = useState(false)
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([])
  const [dataUnit, setDataUnit] = useState([])
  const [dataStatus, setDataStatus] = useState([])
  const [fromDate, setFromDate] = useState(dayjs().startOf('month'))
  const [toDate, setToDate] = useState(dayjs())
  const [reqNo, setReqNo] = useState('')
  const [bizUnit, setBizUnit] = useState(0)
  const [transBizUnit, setTransBizUnit] = useState(0)
  const [keyPath, setKeyPath] = useState(null)
  const [checkedPath, setCheckedPath] = useState(false)
  const formatDate = useCallback((date) => date.format('YYYYMMDD'), [])
  const [isMinusClicked, setIsMinusClicked] = useState(false)
  const [lastClickedCell, setLastClickedCell] = useState(null)
  const [clickedRowData, setClickedRowData] = useState(null)
  const [gridData, setGridData] = useState([])
  const [isAPISuccess, setIsAPISuccess] = useState(true)
  const { t } = useTranslation()

  const [inOutReqType, setInOutReqType] = useState('')

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

  const [dataWarehouse, setDataWarehouse] = useState([])
  const [warehouseSearchSh, setWarehouseSearchSh] = useState('')

  const [selectionInWarehouse, setSelectionInWarehouse] = useState({
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty(),
  })

  const [inWhName, setInWhName] = useState('')
  const [whSeq, setWhSeq] = useState('')

  const [outWhName, setOutWhName] = useState('')
  const [outWhSeq, setOutWhSeq] = useState('')

  const [selection, setSelection] = useState({
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty(),
  })

  const resetTable = () => {
    setSelection({
      columns: CompactSelection.empty(),
      rows: CompactSelection.empty(),
    })
  }

  const fetchTransReqData = async () => {
    if (!isAPISuccess) {
      return
    }
    setLoadingA(true)
    setIsAPISuccess(false)

    let hideLoadingMessage
    try {
      hideLoadingMessage = message.loading(
        'Đang tải dữ liệu, vui lòng chờ...',
        0,
      )
      const searchBody = {
        changeMst: '0',
        bizUnit: bizUnit,
        bizUnitName: '',
        reqDateFr: formatDate(fromDate),
        reqDateTo: formatDate(toDate),
        reqNo: reqNo,
        transBizUnit: transBizUnit,
        transBizUnitName: '',

        inWhSeq: whSeq,
        inWhName: inWhName,
        outWhSeq: outWhSeq,
        outWhName: outWhName,
        deptSeq: deptSeq,
        deptName: deptName,
        inTrans: '',
        empSeq: empSeq,
        empName: empName,
        smProgressType: status,
        inOutReqType: inOutReqType || 40,
      }
      const transResponse = await SearchBy(searchBody)

      if (transResponse?.success) {
        setGridData(transResponse?.data || [])

        setIsAPISuccess(true)
      } else {
        setData([])
        setIsAPISuccess(true)
        message.error('Có lỗi xảy ra khi tải dữ liệu.')
      }
    } catch (error) {
      setData([])
      setIsAPISuccess(true)
      message.error('Có lỗi xảy ra khi tải dữ liệu.')
    } finally {
      if (hideLoadingMessage) hideLoadingMessage()
      setIsAPISuccess(true)
      setLoadingA(false)
    }
  }

  useEffect(() => {
    fetchTransReqData()
  }, [])

  const fetchCodeHelpData = useCallback(async () => {
    setLoading(true)
    try {
      const [
        codeHelpDataUnit,
        codeHelpComboStatus,
        codeHelpWarehouse,
        codeHelpPeople,
        codeHelpDept,
      ] = await Promise.all([
        GetCodeHelpCombo('', 6, 10003, 1, '%', '', '', '', ''),
        GetCodeHelpCombo('', 6, 19995, 1, '%', '6889', '', '', ''),
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
      setDataWarehouse(codeHelpWarehouse?.data || [])
      setDataUser(codeHelpPeople?.data || [])
      setDepartData(codeHelpDept?.data || [])
    } catch (error) {
      setDataUnit([])
    } finally {
      setLoading(false)
    }
  }, [bizUnit])

  const debouncedFetchCodeHelpData = useMemo(
    () => debounce(fetchCodeHelpData, 100),
    [fetchCodeHelpData],
  )

  const nextPageTransMaterial = useCallback(() => {
    if (keyPath) {
      navigate(`/wms/u/warehouse/import-export-mat/create-trans-req/${keyPath}`)
    } else {
      navigate(`/wms/u/warehouse/import-export-mat/create-trans-req`)
    }
  }, [keyPath, navigate])

  const onCellClicked = (cell, event) => {
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

    if (rowIndex >= 0 && rowIndex < gridData.length) {
      const rowData = gridData[rowIndex]

      const filteredData = {
        BizUnit: rowData.BizUnit,
        BizUnitName: rowData.BizUnitName,
        DeptName: rowData.DeptName,
        DeptSeq: rowData.DeptSeq,
        EmpName: rowData.EmpName,
        EmpSeq: rowData.EmpSeq,
        FactUnit: rowData.FactUnit,
        FactUnitName: rowData.FactUnitName,
        InOutReqDetailType: rowData.InOutReqDetailType,
        InOutReqType: rowData.InOutReqType,
        InOutReqTypeName: rowData.InOutReqTypeName,
        InWHName: rowData.InWHName,
        InWHSeq: rowData.InWHSeq,
        IsNotQC: rowData.IsNotQC,
        IsPJT: rowData.IsPJT,
        IsStop: rowData.IsStop,
        IsTrans: rowData.IsTrans,

        OutWHName: rowData.OutWHName,
        OutWHSeq: rowData.OutWHSeq,
        PJTName: rowData.PJTName,
        PJTNo: rowData.PJTNo,
        PJTSeq: rowData.PJTSeq,
        Remark: rowData.Remark,
        ReqDate: rowData.ReqDate,
        ReqNo: rowData.ReqNo,
        ReqSeq: rowData.ReqSeq,
        // SMProgressTypeName: rowData.SMProgressTypeName,
        TransBizUnit: rowData.TransBizUnit,
        TransBizUnitName: rowData.TransBizUnitName,
        WorkingTag: 'U',
      }

      const secretKey = 'TEST_ACCESS_KEY'
      const encryptedData = CryptoJS.AES.encrypt(
        JSON.stringify(filteredData),
        secretKey,
      ).toString()

      const encryptedToken = encodeBase64Url(encryptedData)
      setKeyPath(encryptedToken)
      setClickedRowData(rowData)
      setLastClickedCell(cell)
      navigate(
        `/wms/u/warehouse/import-export-mat/create-trans-req/${encryptedToken}`,
      )
    }
  }

  useEffect(() => {
    debouncedFetchCodeHelpData()
    return () => {
      debouncedFetchCodeHelpData.cancel()
    }
  }, [debouncedFetchCodeHelpData])

  return (
    <>
      <Helmet>
        <title>HPM - {t('Di chuyển vật liệu')}</title>
      </Helmet>
      <div className="bg-slate-50 p-3 h-screen overflow-hidden">
        <div className="flex flex-col gap-4 md:grid md:grid-cols-4 md:grid-rows-[auto_1fr] md:gap-4 h-full">
          <div className="col-start-1 col-end-5 row-start-1 w-full rounded-lg ">
            <div className="flex items-center justify-between mb-2">
              <Title level={4} className="mt-2 uppercase opacity-85 ">
                {t('Di Chuyển vật liệu')}
              </Title>
              <TransReqMatActions
                fetchData={fetchTransReqData}
                nextPageTransReqMat={nextPageTransMaterial}
                isAPISuccess={isAPISuccess}
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
                <TransReqMatQuery
                  fromDate={fromDate}
                  setFromDate={setFromDate}
                  toDate={toDate}
                  setToDate={setToDate}
                  reqNo={reqNo}
                  setReqNo={setReqNo}
                  bizUnit={bizUnit}
                  setBizUnit={setBizUnit}
                  transBizUnit={transBizUnit}
                  setTransBizUnit={setTransBizUnit}
                  dataUnit={dataUnit}
                  dataStatus={dataStatus}
                  setStatus={setStatus}
                  departData={departData}
                  deptName={deptName}
                  setDeptName={setDeptName}
                  deptSeq={deptSeq}
                  setDeptSeq={setDeptSeq}
                  resetTable={resetTable}
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
                  inWhName={inWhName}
                  setInWhName={setInWhName}
                  selectionInWarehouse={selectionInWarehouse}
                  setSelectionInWarehouse={setSelectionInWarehouse}
                  setWhSeq={setWhSeq}
                  outWhName={outWhName}
                  setOutWhName={setOutWhName}
                  setOutWhSeq={setOutWhSeq}
                  inOutReqType={inOutReqType}
                  setInOutReqType={setInOutReqType}
                />
              </div>
            </details>
          </div>

          <div className="col-start-1 col-end-5 row-start-2 w-full h-full rounded-lg  overflow-auto">
            <TableTransReqMat
              data={data}
              setCheckedPath={setCheckedPath}
              checkedPath={checkedPath}
              setKeyPath={setKeyPath}
              loading={loading}
              setData={setData}
              onCellClicked={onCellClicked}
              setGridData={setGridData}
              gridData={gridData}
              fetchTransReqData={fetchTransReqData}
            />
          </div>
        </div>
      </div>
    </>
  )
}
