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
import { CompactSelection } from '@glideapps/glide-data-grid'
import CodeHelpStockOut1 from '../../components/modal/material/codeHelpStockOut1'
import { GetCodeHelp } from '../../../features/codeHelp/getCodeHelp'
import CodeHelpStockOut2 from '../../components/modal/material/codeHelpStockOut2'
import CodeHelpWarehouse from '../../components/modal/warehouse/codeHelpWarehouse'
import TransMatDetailsAction from '../../components/actions/transReqMat/transMatDetailsAction'
import TransMatDetailsQuery from '../../components/query/transReqMat/transMatDetailsQuery'
import TableTransMatDetails from '../../components/table/transReqMat/tableTransMatDetails'
import TransMatDetailsMoreQuery from '../../components/query/transReqMat/transMatDetailsMoreQuery '
import { SearchBy } from '../../../features/transReqMat/getTransReqMatDetails'
import { name } from 'dayjs/locale/vi'

export default function TransMatDetails({ permissions, isMobile }) {
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
  const [checkedRowKey, setCheckedRowKey] = useState(null)
  const [keyPath, setKeyPath] = useState(null)
  const [checkedPath, setCheckedPath] = useState(false)
  const formatDate = useCallback((date) => date.format('YYYYMMDD'), [])
  const [isMinusClicked, setIsMinusClicked] = useState(false)
  const [lastClickedCell, setLastClickedCell] = useState(null)
  const [clickedRowData, setClickedRowData] = useState(null)
  const [clickedRowDataList, setClickedRowDataList] = useState([])
  const [gridData, setGridData] = useState([])
  const [isAPISuccess, setIsAPISuccess] = useState(true)
  const { t } = useTranslation()

  const [modalVisible1, setModalVisible1] = useState(false)
  const [data1, setData1] = useState([])
  const [loadingCodeHelp, setLoadingCodeHelp] = useState(false)
  const [conditionSeq, setConditionSeq] = useState(1)
  const [subConditionSql, setSubConditionSql] = useState(1)
  const [keyword, setKeyword] = useState('')

  const [dataUser, setDataUser] = useState([])
  const [empName, setEmpName] = useState('')
  const [empSeq, setEmpSeq] = useState('')
  const [userId, setUserId] = useState('')
  const [peopleSearchSh, setPeopleSearchSh] = useState('')
  const [selectionPeople, setSelectionPeople] = useState({
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty(),
  })

  const [nameProduct, setNameProduct] = useState('')
  const [codeProduct, setCodeProduct] = useState('')
  const [specProduct, setSpectProduct] = useState('')
  const [typeProductData, setTypeProductData] = useState([])
  const [typeProduct, setTypeProduct] = useState('')
  const [typeTransProduct, setTypeTransProduct] = useState([])
  const [typeTransData, setTypeTransData] = useState([])
  const [lotNo, setLotNo] = useState('')

  const [isTrans, setIsTrans] = useState(0)
  const [empData, setEmData] = useState([])
  const [dataWarehouse, setDataWarehouse] = useState([])
  const [warehouseSearchSh, setWarehouseSearchSh] = useState('')

  const [selectionInWarehouse, setSelectionInWarehouse] = useState({
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty(),
  })

  const [dataInWh, setDataInWh] = useState([])

  const [inWhName, setInWhName] = useState('')
  const [inWhSeq, setInWhSeq] = useState('')

  const [modalVisibleOutWh, setModalVisibleOutWh] = useState(false)
  const [dataOutWh, setDataOutWh] = useState([])
  const [outWhName, setOutWhName] = useState('')
  const [outWhSeq, setOutWhSeq] = useState('')

  const [inOutReqType, setInOutReqType] = useState('')

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

  const [departData, setDepartData] = useState([])
  const [deptSearchSh, setDeptSearchSh] = useState('')
  const [selectionDept, setSelectionDept] = useState({
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty(),
  })
  const [deptName, setDeptName] = useState('')
  const [deptSeq, setDeptSeq] = useState('')
  const [status, setStatus] = useState('')

  const fetchTransReqMatDetailData = async () => {
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

        inWhSeq: inWhSeq,
        inWhName: inWhName,
        outWhSeq: outWhSeq,
        outWhName: outWhName,
        deptSeq: deptSeq,
        deptName: deptName,
        inTrans: '',
        empSeq: empSeq,
        empName: empName,
        smProgressType: status,
        smProgressTypeName: '',
        inOutReqType: inOutReqType || 40,
        itemName: nameProduct,
        itemNo: codeProduct,
        spec: specProduct,
        isTrans: isTrans,
        assetSeq: typeProduct,
        lotNo: lotNo,
        ioReqDetailKind: typeTransProduct,
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
    fetchTransReqMatDetailData()
  }, [])

  const fetchCodeHelpData = useCallback(async () => {
    setLoading(true)
    try {
      const [
        codeHelpDataUnit,
        codeHelpComboStatus,
        codeHelpComboTypeProduct,
        codeHelpComboTypeTransData,
        codeHelpDept,
        codeHelpWarehouse,
        codeHelpPeople,
      ] = await Promise.all([
        GetCodeHelpCombo('', 6, 10003, 1, '%', '', '', '', ''),
        GetCodeHelpCombo('', 6, 19995, 1, '%', '6890', '', '', ''),
        GetCodeHelpCombo('', 6, 10012, 1, '%', '1', '', '', ''),
        GetCodeHelpCombo('', 6, 19999, 1, '%', '8012', '1004', '1', ''),
        GetCodeHelp(10010, '', '', '', '', '', '', 1, 0, '', 0, 0, 0),
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
      ])
      setDataUnit(codeHelpDataUnit?.data || [])
      setDataStatus(codeHelpComboStatus?.data || [])
      setTypeProductData(codeHelpComboTypeProduct?.data || [])
      setTypeTransData(codeHelpComboTypeTransData?.data || [])
      setDepartData(codeHelpDept?.data || [])
      setDataWarehouse(codeHelpWarehouse?.data || [])
      setDataUser(codeHelpPeople?.data || [])
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

    if (cell[0] !== -1) {
      return
    }

    if (cell[0] === -1) {
      rowIndex = cell[1]
      setIsMinusClicked(true)
    } else {
      rowIndex = cell[0]
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
        IsStop: '',
        IsTrans: '',
        BizUnitName: '',
        ReqDate: '',
        ReqNo: '',
        TransBizUnitName: '',
        CompleteWishDate: '',
        OutWHName: '',
        InWHName: '',
        DeptName: '',
        EmpName: '',
        SMProgressTypeName: '',
        Remark: '',
      }
      const secretKey = 'TEST_ACCESS_KEY'
      const encryptedData = CryptoJS.AES.encrypt(
        JSON.stringify(filteredData),
        secretKey,
      ).toString()

      if (isAPISuccess) {
        const encryptedToken = encodeBase64Url(encryptedData)
        setKeyPath(encryptedToken)
        setClickedRowData(rowData)
        setLastClickedCell(cell)
      }
    }
  }
  useEffect(() => {
    debouncedFetchCodeHelpData()
    return () => {
      debouncedFetchCodeHelpData.cancel()
    }
  }, [debouncedFetchCodeHelpData])

  const fetchCodehelpData1 = useCallback(async () => {
    setLoading(true)
    try {
      const response = await GetCodeHelp(
        10010,
        deptName,
        '',
        '',
        '',
        '',
        conditionSeq,
        subConditionSql,
        '1',
        0,
        0,
        0,
      )
      setData1(response?.data || [])
    } catch (error) {
      setData1([])
    } finally {
      setLoading(false)
    }
  }, [conditionSeq, subConditionSql, deptName])

  const fetchCodehelpEmp = useCallback(async () => {
    setLoading(true)
    try {
      const response = await GetCodeHelp(
        10009,
        empName,
        '',
        '',
        '',
        '',
        conditionSeq,
        subConditionSql,
        '1',
        0,
        0,
        0,
      )
      setEmData(response?.data || [])
    } catch (error) {
      setEmData([])
    } finally {
      setLoading(false)
    }
  }, [conditionSeq, subConditionSql, keyword])

  const handleSearch1 = async () => {
    setLoadingCodeHelp(true)
    setModalVisible1(true)
    fetchCodehelpData1()
  }

  const handleSearchOutWh = async () => {
    setLoadingCodeHelp(true)
    setModalVisibleOutWh(true)
    fetchCodehelpWh(false)
  }

  const fetchCodehelpWh = useCallback(
    async (isInWh) => {
      setLoading(true)

      try {
        let whName
        if (!isInWh) {
          whName = outWhName
        } else {
          whName = inWhName
        }
        const response = await GetCodeHelp(
          10006,
          whName,
          bizUnit,
          '',
          '',
          '',
          '1',
          '',
          '',
          0,
          0,
          0,
        )

        setDataInWh(response?.data || [])
        setDataOutWh(response?.data || [])
      } catch (error) {
        setDataInWh([])
        setDataOutWh([])
      } finally {
        setLoading(false)
      }
    },
    [inWhName, outWhName, bizUnit],
  )

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
                {t('Danh mục sản phẩm yêu cầu chuyển vật liệu')}
              </Title>
              <TransMatDetailsAction
                fetchData={fetchTransReqMatDetailData}
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
                <TransMatDetailsQuery
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
                  handleSearch1={handleSearch1}
                  resetTable={resetTable}
                  departData={departData}
                  deptName={deptName}
                  setDeptName={setDeptName}
                  setDeptSeq={setDeptSeq}
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
                  selectionInWarehouse={selectionInWarehouse}
                  setSelectionInWarehouse={setSelectionInWarehouse}
                  gridRef={gridRef}
                  inWhName={inWhName}
                  setInWhName={setInWhName}
                  setInWhSeq={setInWhSeq}
                  outWhName={outWhName}
                  setOutWhName={setOutWhName}
                  setOutWhSeq={setOutWhSeq}
                  handleSearchOutWh={handleSearchOutWh}
                  nameProduct={nameProduct}
                  setNameProduct={setNameProduct}
                  codeProduct={codeProduct}
                  setCodeProduct={setCodeProduct}
                  specProduct={specProduct}
                  setSpectProduct={setSpectProduct}
                  typeTransData={typeTransData}
                  setTypeTrans={setTypeTransProduct}
                  inOutReqType={inOutReqType}
                  setInOutReqType={setInOutReqType}
                />
              </div>
            </details>

            <details
              className="group p-2 [&_summary::-webkit-details-marker]:hidden border rounded-lg bg-white"
              close
            >
              <summary className="flex cursor-pointer items-center justify-between gap-1.5 text-gray-900">
                <h2 className="text-xs font-medium flex items-center gap-2 text-blue-600 uppercase">
                  <FilterOutlined />
                  {t('Xem thêm')}
                </h2>
                <span className="relative size-5 shrink-0">
                  <ArrowIcon />
                </span>
              </summary>
              <div className="flex p-2 gap-4">
                <TransMatDetailsMoreQuery
                  typeProductData={typeProductData}
                  setTypeProduct={setTypeProduct}
                  lotNo={lotNo}
                  setLotNo={setLotNo}
                  setIsTrans={setIsTrans}
                />
              </div>
            </details>
          </div>

          <div className="col-start-1 col-end-5 row-start-2 w-full h-full rounded-lg  overflow-auto">
            <TableTransMatDetails
              data={data}
              setCheckedPath={setCheckedPath}
              checkedPath={checkedPath}
              setKeyPath={setKeyPath}
              loading={loading}
              setData={setData}
              onCellClicked={onCellClicked}
              setGridData={setGridData}
              gridData={gridData}
            />
          </div>
        </div>
      </div>
    </>
  )
}
