import { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet'
import { Typography, Menu, message } from 'antd'
const { Title, Text } = Typography
import { FilterOutlined } from '@ant-design/icons'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'

import { ArrowIcon } from '../../components/icons'
import dayjs from 'dayjs'
import { GetCodeHelpCombo } from '../../../features/codeHelp/getCodeHelpCombo'
import { CompactSelection, GridColumnIcon } from '@glideapps/glide-data-grid'
import { debounce, set } from 'lodash'

import TopLoadingBar from 'react-top-loading-bar'
import { loadFromLocalStorageSheet } from '../../../localStorage/sheet/sheet'

import ErrorListModal from '../default/errorListModal'
import useDynamicFilter from '../../components/hooks/sheet/useDynamicFilter'

import { GetCodeHelpVer2 } from '../../../features/codeHelp/getCodeHelpVer2'

import { onRowAppended } from '../../components/sheet/js/onRowAppended'
import { generateEmptyData } from '../../components/sheet/js/generateEmptyData'
import { updateIndexNo } from '../../components/sheet/js/updateIndexNo'
import HrLaborContractPrintActions from '../../components/actions/hr-da-dept/hrLaborContractPrintAction'
import HrLaborContractPrintQuery from '../../components/query/hrCertificate/hrLaborContractPrintQuery'
import TableHrLaborContractPrint from '../../components/table/hr-certificate/tableHrLaborContractPrint'
import { SearchLaborContractPrint } from '../../../features/mgn-hr/hr-certificate/searchLaborContractPrint'
import { PrintLaborContract } from '../../../features/mgn-hr/hr-certificate/printLaborContract'
export default function HrLaborContractPrint({
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

  const CertificateTypeData = [
    {
      label: t('800000196'),
      value: 1,
    },
    {
      label: t('800000195'),
      value: 2,
    },
  ]

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
        title: t('1480'),
        id: 'EmpName',
        kind: 'Text',
        readonly: false,
        width: 150,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('712'),
        id: 'DeptName',
        kind: 'Text',
        readonly: false,
        width: 150,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('493'),
        id: 'ContractKindName',
        kind: 'Text',
        readonly: false,
        width: 150,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('196'),
        id: 'ContractDate',
        kind: 'Text',
        readonly: false,
        width: 150,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('191'),
        id: 'FromDate',
        kind: 'Text',
        readonly: false,
        width: 150,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('232'),
        id: 'ToDate',
        kind: 'Text',
        readonly: false,
        width: 150,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('215'),
        id: 'EntDate',
        kind: 'Text',
        readonly: false,
        width: 150,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('503'),
        id: 'ContractNo',
        kind: 'Text',
        readonly: false,
        width: 150,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('501'),
        id: 'ContractKindName',
        kind: 'Text',
        readonly: false,
        width: 150,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('501'),
        id: 'ContractKind',
        kind: 'Text',
        readonly: false,
        width: 150,
        hasMenu: true,
        visible: false,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('362'),
        id: 'Remark',
        kind: 'Text',
        readonly: false,
        width: 150,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('14322'),
        id: 'DeptSeq',
        kind: 'Text',
        readonly: false,
        width: 150,
        hasMenu: true,
        visible: false,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('1452'),
        id: 'EmpSeq',
        kind: 'Text',
        readonly: false,
        width: 150,
        hasMenu: true,
        visible: false,
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

  const [DeptData, setDeptData] = useState([])
  const [EmpTypeNameData, setEmpTypeNameData] = useState([])
  const [ContractKindData, setContractKindData] = useState([])
  const [dataUser, setDataUser] = useState([])

  const [EmpName, setEmpName] = useState('')
  const [EmpSeq, setEmpSeq] = useState('')
  const [DeptSeq, setDeptSeq] = useState('')

  const [EmpID, setEmpID] = useState('')

  const [contractKind, setContractKind] = useState('')
  const [ContractKindName, setContractKindName] = useState('')
  const [beginDate, setBeginDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [empType, setEmpType] = useState('')

  const [certificateType, setCertificateType] = useState('')
  const [certificateTypeName, setCertificateTypeName] = useState('')


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

  const [addedRows, setAddedRows] = useState([])
  const [numRowsToAdd, setNumRowsToAdd] = useState(null)

  // tree
  const [DeptName, setDeptName] = useState('')

  const [cols, setCols] = useState(() =>
    loadFromLocalStorageSheet(
      'HR_LABOR_CONTRACT_PRINT',
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
      const [
        DeptDataRes,
        EmpTypeNameDataRes,
        ContractKindDataRes,
        dataUserRes,
      ] = await Promise.all([
        GetCodeHelpVer2(
          10010,
          '',
          '',
          '',
          '',
          '',
          '1',
          '',
          1000,
          "IsUse = ''1''",
          0,
          0,
          0,
        ),
        GetCodeHelpCombo('', 6, 19999, 1, '%', '2000022', '', '', '', signal),
        GetCodeHelpCombo('', 6, 19998, 1, '%', '1000447', '', '', '', signal),

        GetCodeHelpVer2(10009, '', '', '', '', '', '1', '', 1000, '', 0, 0, 0),
      ])

      setDeptData(DeptDataRes.data)
      setEmpTypeNameData(EmpTypeNameDataRes.data)
      setContractKindData(ContractKindDataRes.data)
      setDataUser(dataUserRes.data)
    } catch {
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

  const fieldsToTrack = ['IdxNo']

  const { filterValidEntries, findLastEntry, findMissingIds } =
    useDynamicFilter(gridData, fieldsToTrack)

  const resetTable = () => {
    setSelection({
      columns: CompactSelection.empty(),
      rows: CompactSelection.empty(),
    })
  }

  const getSelectedRows = () => {
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
            setSelected(getSelectedRows())
          } else {
            newSelected = selection.rows.add(rowIndex)
            setSelected([])
          }
        }
      }
    },
    [gridData, getSelectedRows, selected],
  )

  const handleRowAppend = useCallback(
    (numRowsToAdd) => {
      if (canCreate === false) {
        message.warning('Bạn không có quyền thêm dữ liệu')
        return
      }
      onRowAppended(cols, setGridData, setNumRows, setAddedRows, numRowsToAdd)
    },
    [cols, setGridData, setNumRows, setAddedRows, numRowsToAdd],
  )

  const onClickSearch = useCallback(async () => {
    if (!isAPISuccess) {
      message.warning('Không thể thực hiện, vui lòng kiểm tra trạng thái.')
      return
    }

    if (controllers.current && controllers.current.onClickSearch) {
      controllers.current.onClickSearch.abort()
      controllers.current.onClickSearch = null
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

    controllers.current.onClickSearch = controller

    setIsAPISuccess(false)

    try {
      const data = [
        {
          DeptSeq: DeptSeq,
          ContractKind: contractKind,
          EmpSeq: EmpSeq,
          BeginDate: formatDateSearch(beginDate),
          EndDate: formatDateSearch(endDate),
          EmpType: empType,
        },
      ]

      const response = await SearchLaborContractPrint(data)
      const fetchedData = response.data || []

      const emptyData = generateEmptyData(0, defaultCols)
      const combinedData = [...fetchedData, ...emptyData]
      const updatedData = updateIndexNo(combinedData)
      setGridData(updatedData)
      setNumRows(fetchedData.length + emptyData.length)
    } catch (error) {
      const emptyData = generateEmptyData(0, defaultCols)
      const updatedEmptyData = updateIndexNo(emptyData)
      setGridData(updatedEmptyData)
      setNumRows(emptyData.length)
    } finally {
      setIsAPISuccess(true)
      controllers.current.onClickSearch = null
      if (loadingBarRef.current) {
        loadingBarRef.current.complete()
      }
    }
  }, [DeptSeq, contractKind, EmpSeq, beginDate, endDate, empType])

  const onClickPrint = useCallback(async () => {
    if (!isAPISuccess) {
      message.warning('Không thể thực hiện, vui lòng kiểm tra trạng thái.')
      return
    }

    if (selected.length === 0) {
      message.warning('Lựa chọn ít nhất một bản ghi để in!')
      return
    }

    if (controllers.current && controllers.current.onClickPrint) {
      controllers.current.onClickPrint.abort()
      controllers.current.onClickPrint = null
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

    controllers.current.onClickPrint = controller

    setIsAPISuccess(false)

    try {
      const data = selected.map((item) => ({
        ContractDate: item.ContractDate,
        ContractKind: item.ContractKind,
        EmpSeq: item.EmpSeq,
        CertificateType: certificateType,
      }))

      const response = await PrintLaborContract(data)

      if (!response.success) {
        message.error(
          response?.errors || 'Lỗi khi in hợp đồng lao động. Vui lòng thử lại sau.',
        )
        return
      } else {
        const fileBase64 = response.data

        if (fileBase64.length === 0) {
          message.warn('Không có file base64 trong phản hồi')
        } else if (fileBase64.length <= 5) {
          fileBase64.forEach((file) => {
            const fileBase64 = file?.FilePdfBase64
            const fileName = file?.FileName || 'document.pdf'

            if (fileBase64) {
              const byteCharacters = atob(fileBase64)
              const byteNumbers = new Array(byteCharacters.length)
                .fill()
                .map((_, i) => byteCharacters.charCodeAt(i))
              const byteArray = new Uint8Array(byteNumbers)

              const blob = new Blob([byteArray], { type: 'application/pdf' })
              const blobUrl = URL.createObjectURL(blob)

              window.open(blobUrl, '_blank')
            } else {
              message.warn(`Không có dữ liệu file PDF cho ${fileName}`)
            }
          })
        } else {
          const zip = new JSZip()

          fileBase64.forEach((file, index) => {
            const fileBase64 = file?.FilePdfBase64
            const fileName =
              (file?.FileName || `document_${index + 1}`) + '.pdf'

            if (fileBase64) {
              zip.file(fileName, fileBase64, { base64: true })
            }
          })

          const zipBlob = await zip.generateAsync({ type: 'blob' })
          saveAs(zipBlob, 'hop_dong_lao_dong.zip')
        }
      }
    } catch (error) {
      console.log(error)
      setIsAPISuccess(true)
    } finally {
      setIsAPISuccess(true)
      controllers.current.onClickPrint = null
      if (loadingBarRef.current) {
        loadingBarRef.current.complete()
      }
    }
  }, [selected, isAPISuccess, certificateType])

  return (
    <>
      <Helmet>
        <title>ITM - {t('110001418')}</title>
      </Helmet>
      <TopLoadingBar color="blue" height={2} ref={loadingBarRef} />
      <div className="bg-slate-50 h-[calc(100vh-40px)] overflow-hidden">
        <div className="flex flex-col h-full">
          <div className="col-start-1 col-end-5 row-start-1 w-full">
            <div className="flex items-center justify-between">
              <Title level={4} className="m-2 mr-2 uppercase opacity-85 ">
                {t('110001418')}
              </Title>
              <HrLaborContractPrintActions
                setModalOpen={setModalOpen}
                openModal={modalOpen}
                onClickSearch={onClickSearch}
                onClickPrint={onClickPrint}
              />
            </div>
            <details
              className="group p-2 [&_summary::-webkit-details-marker]:hidden border bg-white"
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
                <HrLaborContractPrintQuery
                  DeptData={DeptData}
                  dataUser={dataUser}
                  CertificateTypeData={CertificateTypeData}
                  ContractKindData={ContractKindData}
                  EmpTypeNameData={EmpTypeNameData}
                  ContractKind={contractKind}
                  setContractKind={setContractKind}
                  ContractKindName={ContractKindName}
                  setContractKindName={setContractKindName}
                  BeginDate={beginDate}
                  setBeginDate={setBeginDate}
                  EndDate={endDate}
                  setEndDate={setEndDate}
                  EmpTypeName={empType}
                  setEmpType={setEmpType}
                  EmpName={EmpName}
                  setEmpName={setEmpName}
                  EmpSeq={EmpSeq}
                  setEmpSeq={setEmpSeq}
                  EmpID={EmpID}
                  setEmpID={setEmpID}
                  DeptName={DeptName}
                  setDeptName={setDeptName}
                  DeptSeq={DeptSeq}
                  setDeptSeq={setDeptSeq}
                  CertificateType={certificateType}
                  setCertificateType={setCertificateType}
                  CertificateTypeName={certificateTypeName}
                  setCertificateTypeName={setCertificateTypeName}
                />
              </div>
            </details>
          </div>
          <div className="col-start-1 col-end-5 row-start-2 w-full h-full border-t overflow-hidden">
            <TableHrLaborContractPrint
              dataUser={dataUser}
              setDataUser={setDataUser}
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
              handleRowAppend={handleRowAppend}
              loadingBarRef={loadingBarRef}
              isAPISuccess={isAPISuccess}
              setIsAPISuccess={setIsAPISuccess}
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
