import { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet'
import {
  BoxPlotFilled,
  FilterOutlined,
  UserSwitchOutlined,
} from '@ant-design/icons'
import { ArrowIcon } from '../../../components/icons'
import { Input, Space, Table, Typography, message, Flex, Splitter } from 'antd'
const { Title, Text } = Typography
import { debounce } from 'lodash'
import { CompactSelection, GridColumnIcon } from '@glideapps/glide-data-grid'
import useKeydownHandler from '../../../components/hooks/sheet/useKeydownHandler'
import { loadFromLocalStorageSheet } from '../../../../localStorage/sheet/sheet'
import { onRowAppended } from '../../../components/sheet/js/onRowAppended'
import useDynamicFilter from '../../../components/hooks/sheet/useDynamicFilter'
import { validateColumns } from '../../../../utils/validateColumns'
import { GetCodeHelpCombo } from '../../../../features/codeHelp/getCodeHelpCombo'

import ErrorListModal from '../../default/errorListModal'
import ModalSheetDelete from '../../../components/modal/default/deleteSheet'
import { UpdatedBy } from '../../../../features/basic/customer/updatedBy'
import CustomerRegistrationQueryDetails from '../../../components/query/basic/customers/customerRegistrationQueryDetails'
import CustRegistBasicInfo from '../../../components/query/basic/customers/custRegistBasicInfo'
import CustRegistTaxInfo from '../../../components/query/basic/customers/custRegistTaxInfo'
import CustRegistBankInfo from '../../../components/query/basic/customers/custRegistBankInfo'
import { useNavigate, useParams } from 'react-router-dom'
import CryptoJS from 'crypto-js'
import {
  GetBankInfoById,
  GetBasicInfoById,
  GetMasterById,
  GetCustKindById,
  GetCustAddInfoById,
  GetCustRemarkById,
} from '../../../../features/basic/customer/getDetails'
import CustomerRegistActionDetails from '../../../components/actions/basic/customers/customerRegistActionDetails'
import CustRegistKindInfo from '../../../components/query/basic/customers/custRegistKindInfo'
import TopLoadingBar from 'react-top-loading-bar';
const columnsError = [
  {
    title: 'Thương hiệu',
    dataIndex: 'FullName',
    key: 'FullName',
  },
  {
    title: 'Tên khách hàng',
    dataIndex: 'CustName',
    key: 'CustName',
  },
  {
    title: 'Kết quả',
    dataIndex: 'result',
    key: 'result',
  },
]

export default function CustomersRegistrationDetails({
  permissions,
  isMobile,
  canCreate,
  canEdit,
  canDelete,
  keyPath,
  setKeyPath, controllers,
  cancelAllRequests
}) {
  const loadingBarRef = useRef(null);
  const { t } = useTranslation()
  const { id } = useParams()
  const navigate = useNavigate()
  const secretKey = 'TEST_ACCESS_KEY'
  const [loading, setLoading] = useState(false)
  const [gridData, setGridData] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [selection, setSelection] = useState({
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty(),
  })

  const defaultCols = useMemo(() => [
    {
      id: 'Sel',
      title: 'Lựa chọn',
      kind: 'Boolean',
      readonly: false,
      hasMenu: true,
      visible: true,
    },
    {
      id: 'UMCustKindName',
      title: 'Loại khách hàng',
      width: 400,
      kind: 'Text',
      readonly: true,
      hasMenu: true,
      visible: true,
    },
    {
      id: 'IsBizNoNon',
      title: 'Có bắt buộc số kinh doanh không?',
      width: 240,
      kind: 'Boolean',
      readonly: true,
      hasMenu: true,
      visible: true,
    },
    {
      id: 'IsBizNoOne',
      title: 'Duy nhất số đăng ký kinh doanh',
      width: 240,
      kind: 'Boolean',
      readonly: true,
      hasMenu: true,
      visible: true,
    },
    {
      id: 'IsRegNoNon',
      title: 'Bắt buộc số chứng minh thư',
      width: 240,
      kind: 'Boolean',
      readonly: true,
      hasMenu: true,
      visible: true,
    },
    {
      id: 'IsRegNoOne',
      title: 'Duy nhất số chứng minh thư',
      width: 240,
      kind: 'Boolean',
      readonly: true,
      hasMenu: true,
      visible: true,
    },
  ])

  const [showSearch, setShowSearch] = useState(false)
  const [lastClickedCell, setLastClickedCell] = useState(null)
  const [addedRows, setAddedRows] = useState([])

  const [editedRows, setEditedRows] = useState([])
  const [onSelectRow, setOnSelectRow] = useState([])
  const [numRowsToAdd, setNumRowsToAdd] = useState(null)
  const [numRows, setNumRows] = useState(0)
  const [clickCount, setClickCount] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSent, setIsSent] = useState(false)
  const [openHelp, setOpenHelp] = useState(false)
  const [isCellSelected, setIsCellSelected] = useState(false)

  const [dataError, setDataError] = useState([])

  const [dataMasterInfo, setDataMasterInfo] = useState([])
  const [dataBankInfo, setDataBankInfo] = useState([])
  const [dataCustKindName, setDataCustKindName] = useState([])
  const [dataCustAddInfo, setDataCustAddInfo] = useState([])

  const [isModalVisible, setIsModalVisible] = useState(false)
  const [count, setCount] = useState(0)
  const [emptyWordIds, setEmptyWordIds] = useState([])
  const lastWordEntryRef = useRef(null)

  const [custName, setCustName] = useState('')
  const [custNo, setCustNo] = useState('')
  const [BizNo, setBizNo] = useState('')
  const [custStatus, setCustStatus] = useState('')
  const [owner, setOwner] = useState('')

  const [custSeq, setCustSeq] = useState('')
  const [fullName, setFullName] = useState('')
  const [countryName, setCountryName] = useState('')
  const [country, setCountry] = useState('')
  const [smCustStatusName, setSmCustStatusName] = useState('')
  const [BizAdd, setBizAdd] = useState('')

  const [EngCustName, setEngCustName] = useState('')
  const [UMChannelName, setUMChannelName] = useState('')
  const [UMChannel, setUMChannel] = useState('')
  const [SMBizPerName, setSMBizPerName] = useState('')
  const [Email, setEmail] = useState('')
  const [TelNo, setTelNo] = useState('')
  const [Fax, setFax] = useState('')
  const [Tel2, setTel2] = useState('')

  const [LawRegNo, setLawRegNo] = useState('')
  const [BizType, setBizType] = useState('')

  const [BankNumber, setBankNumber] = useState('')
  const [BankName, setBankName] = useState('')
  const [BankAccName, setBankAccName] = useState('')
  const [BankPhoneNumber, setBankPhoneNumber] = useState('')
  const [AbbrName, setAbbrName] = useState('')
  const [SpBankPhone, setSpBankPhone] = useState('')
  const [CustRemark, setCustRemark] = useState('')
  const [dataUMChannel, setDataUMChannel] = useState([])

  const [dataBizPername, setDataBizPername] = useState([])
  const [SMBizPersName, setSMBizPersName] = useState('')
  const [SMBizPers, setSMBizPers] = useState('')

  const [dataSMDomForName, setDataSMDomForName] = useState([])
  const [SMDomForName, setSMDomForName] = useState('')
  const [SMDomFor, setSMDomFor] = useState('')

  const [dataUMCoutry, setDataUMCoutry] = useState([])

  const [cols, setCols] = useState(() =>
    loadFromLocalStorageSheet(
      'S_ERP_COLS_PAGE_CUST_KIND',
      defaultCols.filter((col) => col.visible),
    ),
  )

  const [dataSelectCustKind, setDataSelectCustKind] = useState([])

  const [dataCustStatus, setDataCustStatus] = useState([])

  const fieldsToTrack = [
    'Sel',
    'UMCustKindName',
    'IsBizNoOne',
    'IsRegNoNon',
    'IsBizNoOne',
  ]
  const { filterValidEntries, findLastEntry, findMissingIds } =
    useDynamicFilter(gridData, fieldsToTrack)
    useEffect(() => {
      cancelAllRequests();
      message.destroy();
    }, [])
  const resetTable = () => {
    setSelection({
      columns: CompactSelection.empty(),
      rows: CompactSelection.empty(),
    })
  }

  useEffect(() => {
    if (id) {
      const data = decryptData(id)
      if (data) {
        setCustSeq(data?.CustSeq)
      }
    }
  }, [custSeq])

  const decryptData = (encryptedToken) => {
    try {
      const base64Data = decodeBase64Url(encryptedToken)
      const bytes = CryptoJS.AES.decrypt(base64Data, secretKey)
      const decryptedData = bytes.toString(CryptoJS.enc.Utf8)
      return JSON.parse(decryptedData)
    } catch (error) {
      navigate(`/wms/u/basic/customers/register`)
      return null
    }
  }

  const decodeBase64Url = (base64Url) => {
    try {
      let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      const padding =
        base64.length % 4 === 0 ? '' : '='.repeat(4 - (base64.length % 4))
      return base64 + padding
    } catch (error) {
      throw new Error('Invalid Base64 URL')
    }
  }

  const fetchCodeHelpData = useCallback(async () => {
    setLoading(true)
    try {
      const data = [
        {
          CustSeq: custSeq,
        },
      ]

      const [
        dataMasterInfo,
        dataBankInfo,
        dataCustKindName,
        dataCustAddInfo,
        dataCustRemark,
        codeHelpCustStatusName,
        codeHelpChanelName,
        codeHelpSMBizPerName,
        codeHelpSMDomForName,
        codeHelpUMCountry,
      ] = await Promise.all([
        GetMasterById(data),
        GetBankInfoById(data),
        GetCustKindById(data),
        GetCustAddInfoById(data),
        GetCustRemarkById(data),
        GetCodeHelpCombo('', 6, 19998, 1, '%', '2004', '', '', ''),
        GetCodeHelpCombo('', 6, 19999, 1, '%', '8004', '', '', ''),
        GetCodeHelpCombo('', 6, 19998, 1, '%', '4019', '', '', ''),
        GetCodeHelpCombo('', 6, 19998, 1, '%', '1013', '', '', ''),
        GetCodeHelpCombo('', 6, 19999, 1, '%', '1002', '', '', ''),
      ])

      setDataMasterInfo(dataMasterInfo?.data.data[0] || [])
      setDataCustKindName(dataCustKindName?.data.data || [])
      setDataBankInfo(dataBankInfo?.data.data || [])
      setDataCustAddInfo(dataCustAddInfo?.data.data[0])
      setDataCustStatus(codeHelpCustStatusName?.data || [])
      setDataUMChannel(codeHelpChanelName?.data || [])
      setDataBizPername(codeHelpSMBizPerName?.data || [])
      setDataSMDomForName(codeHelpSMDomForName?.data || [])
      setCustRemark(dataCustRemark?.data.data[0].CustRemark)
      setDataUMCoutry(codeHelpUMCountry?.data || [])

      setGridData(dataCustKindName?.data.data)
      setNumRows(dataCustKindName?.data.data.length)
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }, [custSeq])

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
  const openModal = () => {
    setIsModalOpen(true)
  }
  const closeModal = () => {
    setIsModalOpen(false)
  }

  const handleRowAppend = useCallback(
    (numRowsToAdd) => {
      if (canCreate === false) {
        message.warning('Bạn không có quyền thêm dữ liệu')
        return
      }
      onRowAppended(cols, setGridData, setNumRows, setAddedRows, numRowsToAdd)
    },
    [setGridData, setNumRows, setAddedRows, numRowsToAdd],
  )

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  /* HOOKS KEY */
  useKeydownHandler(isCellSelected, setOpenHelp)

  const handleSaveData = useCallback(async () => {
    if (canCreate === false) {
      message.warning('Bạn không có quyền thêm dữ liệu')
      return
    }

    const dataUpdate = [
      {
        FullName: fullName,
        CustName: custName,
        CustNo: custNo,
        LawRegNo: LawRegNo,
        BizAddr: BizAdd,
        BizType: BizType,
        TelNo: TelNo,
        ChannelName: '',
        UMChannelName: UMChannelName,
        UMChannel: UMChannel,
        UMCredLevelName: '',
        SMDomFor: SMDomFor,
        SMDomForName: SMDomForName,
        SMCustStatusName: smCustStatusName,
        SMCustStatus: custStatus,
        Fax: Fax,
        // ZipNo: ZipNo,
        Addr: BizAdd,
        UMCustKindName: '',
        CustRemark: CustRemark,
        BankNumber: BankNumber,
        BankAccName: BankAccName,
        BankName: BankName,
        CustAbbrName: AbbrName,
        CustPhone: TelNo,
        CustPhone2: Tel2,
        Tel2: SpBankPhone,
        Email: Email,
        SMBizPerName: SMBizPerName,
        CustSeq: custSeq,
        dataCustKind: gridData,
        SMBizPers: SMBizPers,
        SMBizPersName: SMBizPersName,
        BizNo: BizNo,
        Owner: owner,
        EngCustName: EngCustName,
      },
    ]

    if (isSent) return
    setIsSent(true)

    try {
      const loadingMessage = message.loading('Đang thực hiện lưu dữ liệu...')
      const promises = []
      promises.push(UpdatedBy(dataUpdate))

      const results = await Promise.all(promises)

      results.forEach((result, index) => {
        if (result.data.success === true) {
          const newData = result.data.data

          if (index === 0) {
            message.success('Thêm thành công!')
          } else {
            message.success('Cập nhật thành công!')
          }
          loadingMessage()
          setIsLoading(false)
          setIsSent(false)
          setEditedRows([])
          setAddedRows([])
          resetTable()
        } else {
          loadingMessage()
          setIsLoading(false)
          setIsSent(false)
          setDataError(result.data.errors)
          setIsModalVisible(true)
          message.error('Có lỗi xảy ra khi lưu dữ liệu')
        }
      })
    } catch (error) {
      setIsLoading(false)
      setIsSent(false)
      message.error(error.message || 'Có lỗi xảy ra khi lưu dữ liệu')
    }
  }, [
    fullName,
    custName,
    custNo,
    owner,
    LawRegNo,
    BizAdd,
    BizType,
    TelNo,
    UMChannelName,
    UMChannel,
    smCustStatusName,
    custStatus,
    Fax,
    BizAdd,
    CustRemark,
    BankNumber,
    BankAccName,
    BankName,
    AbbrName,
    TelNo,
    Tel2,
    Email,
    SMBizPerName,
    custSeq,
    SMBizPers,
    SMDomFor,
    SMDomForName,
    BizNo,
    EngCustName,
    SpBankPhone,
    gridData,
  ])

  return (
    <>
      <Helmet>
        <title>HPM - {t('Chi tiết đăng ký khách hàng')}</title>
      </Helmet>
      <div className="bg-slate-50 p-3 h-screen overflow-hidden">
        <div className="flex flex-col gap-4 md:grid md:grid-cols-4 md:grid-rows-[auto_1fr] md:gap-4 h-full">
          <div className="col-start-1 col-end-5 row-start-1 w-full rounded-lg ">
            <div className="flex items-center justify-between">
              <Title level={4} className="mt-2 uppercase opacity-85 ">
                {t('Chi tiết đăng ký khách hàng')}
              </Title>

              <CustomerRegistActionDetails
                setModalOpen={setModalOpen}
                handleRestSheet={''}
                fetchDataQuery={''}
                openModal={openModal}
                setNumRowsToAdd={setNumRowsToAdd}
                numRowsToAdd={numRowsToAdd}
                setClickCount={setClickCount}
                clickCount={clickCount}
                handleRowAppend={handleRowAppend}
                handleSaveData={handleSaveData}
              />
            </div>
            <details
              className="group p-2 [&_summary::-webkit-details-marker]:hidden border rounded-lg bg-white overflow-y-auto max-h-[730px] "
              open
            >
              <summary className="flex cursor-pointer items-center justify-between gap-1.5 text-gray-900">
                <h2 className="text-xs font-medium flex items-center gap-2  uppercase">
                  <FilterOutlined />
                  Thông tin cơ bản
                </h2>
              </summary>
              <div className="flex p-2 gap-4 ">
                <CustomerRegistrationQueryDetails
                  dataMasterInfo={dataMasterInfo}
                  dataBankInfo={dataBankInfo}
                  custName={custName}
                  setCustName={setCustName}
                  custNo={custNo}
                  setCustNo={setCustNo}
                  custSeq={custSeq}
                  setCustSeq={setCustSeq}
                  fullName={fullName}
                  setFullName={setFullName}
                  UMCountryName={countryName}
                  setUmCountryName={setCountryName}
                  setUMCountry={setCountry}
                  smCustStatusName={smCustStatusName}
                  setSmCustStatusName={setSmCustStatusName}
                  setCustStatus={setCustStatus}
                  dataSMDomForName={dataSMDomForName}
                  SMDomForName={SMDomForName}
                  setSMDomForName={setSMDomForName}
                  setSMDomFor={setSMDomFor}
                  dataCustStatus={dataCustStatus}
                />
              </div>

              <summary className="flex cursor-pointer items-center justify-between gap-1.5 text-gray-900">
                <h2 className="text-xs font-medium flex items-center gap-2  uppercase">
                  <FilterOutlined />
                  Thông tin khách hàng
                </h2>
              </summary>
              <div className="flex p-2 gap-4 ">
                <CustRegistBasicInfo
                  dataMasterInfo={dataMasterInfo}
                  dataCustAddInfo={dataCustAddInfo}
                  UMChannelName={UMChannelName}
                  setUMChannelName={setUMChannelName}
                  setUMChannel={setUMChannel}
                  SMBizPerName={SMBizPerName}
                  setSMBizPerName={setSMBizPerName}
                  EngCustName={EngCustName}
                  setEngCustName={setEngCustName}
                  Email={Email}
                  setEmail={setEmail}
                  TelNo={TelNo}
                  setTelNo={setTelNo}
                  Fax={Fax}
                  setFax={setFax}
                  Tel2={Tel2}
                  setTel2={setTel2}
                  dataUMChannel={dataUMChannel}
                  dataBizPername={dataBizPername}
                  setSMBizPers={setSMBizPers}
                  SMBizPersName={SMBizPersName}
                  setSMBizPersName={setSMBizPersName}
                  setSMDomFor={setSMDomFor}
                />
              </div>

              <summary className="flex cursor-pointer items-center justify-between gap-1.5 text-gray-900">
                <h2 className="text-xs font-medium flex items-center gap-2  uppercase">
                  <FilterOutlined />
                  Thông tin về thuế
                </h2>
              </summary>

              <div className="flex p-2 gap-4 ">
                <CustRegistTaxInfo
                  dataMasterInfo={dataMasterInfo}
                  BizAdd={BizAdd}
                  setBizAdd={setBizAdd}
                  LawRegNo={LawRegNo}
                  setLawRegNo={setLawRegNo}
                  BizNo={BizNo}
                  setBizNo={setBizNo}
                  SMBizPerName={SMBizPerName}
                  setSMBizPerName={setSMBizPerName}
                  TelNo={TelNo}
                  setTelNo={setTelNo}
                  BizType={BizType}
                  setBizType={setBizType}
                  Owner={owner}
                  setOwner={setOwner}
                />
              </div>

              <summary className="flex cursor-pointer items-center justify-between gap-1.5 text-gray-900">
                <h2 className="text-xs font-medium flex items-center gap-2  uppercase">
                  <FilterOutlined />
                  Thông tin ngân hàng
                </h2>
              </summary>
              <div className="flex p-2 gap-4 ">
                <CustRegistBankInfo
                  dataBankInfo={dataBankInfo}
                  BankNumber={BankNumber}
                  setBankNumber={setBankNumber}
                  BankName={BankName}
                  setBankName={setBankName}
                  BankAccName={BankAccName}
                  setBankAccName={setBankAccName}
                  BankPhoneNumber={BankPhoneNumber}
                  setBankPhoneNumber={setBankPhoneNumber}
                  AbbrName={AbbrName}
                  setAbbrName={setAbbrName}
                  SpBankPhone={SpBankPhone}
                  setSpBankPhone={setSpBankPhone}
                />
              </div>

              <summary className="flex cursor-pointer items-center justify-between gap-1.5 text-gray-900">
                <h2 className="text-xs font-medium flex items-center gap-2  uppercase">
                  <FilterOutlined />
                  Phân loại khách hàng
                </h2>
              </summary>
              <div className="h-96">
                <CustRegistKindInfo
                  setSelection={setSelection}
                  selection={selection}
                  setShowSearch={setShowSearch}
                  showSearch={showSearch}
                  setEditedRows={setEditedRows}
                  setOnSelectRow={setOnSelectRow}
                  setOpenHelp={setOpenHelp}
                  openHelp={openHelp}
                  setGridData={setGridData}
                  gridData={gridData}
                  numRows={numRows}
                  handleRowAppend={handleRowAppend}
                  setCols={setCols}
                  cols={cols}
                  defaultCols={defaultCols}
                  setDataSelectCustKind={setDataSelectCustKind}
                />
              </div>

              <summary className="flex cursor-pointer items-center justify-between gap-1.5 text-gray-900">
                <h2 className="text-xs font-medium flex items-center gap-2  uppercase">
                  <FilterOutlined />
                  Ghi chú
                </h2>
              </summary>
              <div className="">
                <Input
                  placeholder=""
                  size="middle"
                  value={CustRemark}
                  className="h-40"
                  allowClear
                  onChange={(e) => setCustRemark(e.target.value)}
                />
              </div>
            </details>
          </div>
        </div>
      </div>
      <ErrorListModal
        dataError={dataError}
        setIsModalVisible={setIsModalVisible}
        isModalVisible={isModalVisible}
        columns={columnsError}
      />
      <ModalSheetDelete
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        confirm={''}
      />
    </>
  )
}
