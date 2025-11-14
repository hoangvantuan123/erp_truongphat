import { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet'
import {
  Input,
  notification,
  Table,
  Typography,
  message,
  Spin,
  Layout,
} from 'antd'
const { Title, Text } = Typography
import { FilterOutlined, LoadingOutlined } from '@ant-design/icons'
import { ArrowIcon } from '../../components/icons'
import dayjs from 'dayjs'
import { GetCodeHelpCombo } from '../../../features/codeHelp/getCodeHelpCombo'
import { debounce } from 'lodash'
import { useNavigate } from 'react-router-dom'
import { encodeBase64Url } from '../../../utils/decode-JWT'
import CryptoJS from 'crypto-js'
import { formatNumberCellSum } from '../../../utils/formatNumberCellSum'
import PurOrderPOListQuery from '../../components/query/purchase/purOrderPOListQuery'
import PurOrderPOListActions from '../../components/actions/purchase/purOrderPOListActions'
import TablePurOrdPOList from '../../components/table/purchase/tablePurOrdPOList'
import { GetSheetQuery } from '../../../features/purchase/purOrdPOList/getSheetQuery'
import { PostPOListConfirm } from '../../../features/purchase/purOrdPOList/postPOListConfirm'
import { PostPOListStop } from '../../../features/purchase/purOrdPOList/postPOListStop'
import { GetCodeHelp } from '../../../features/codeHelp/getCodeHelp'
import ModalSheetConfirm from '../../components/modal/default/confirmSheet'
import ModalSheetStop from '../../components/modal/default/stopSheet'
import ErrorListModal from '../default/errorListModal'
import { CompactSelection, GridColumnIcon } from '@glideapps/glide-data-grid'
import Item from 'antd/es/list/Item'
import { loadFromLocalStorageSheet } from '../../../localStorage/sheet/sheet'
import { onRowAppended } from '../../components/sheet/js/onRowAppended'
import TopLoadingBar from 'react-top-loading-bar'
import { togglePageInteraction } from '../../../utils/togglePageInteraction'

export default function PurOrdPOList({
  permissions,
  isMobile,
  canEdit,
  controllers,
}) {
  const { t } = useTranslation()
  const userInfo = localStorage.getItem('userInfo')
  const parsedUserInfo = JSON.parse(userInfo)
  const gridRef = useRef(null)
  const navigate = useNavigate()
  const loadingBarRef = useRef(null)
  const [totalQuantity, setTotalQuantity] = useState(0)
  const [totalAmount, setTotalAmount] = useState(0)
  const [totalAmountVAT, setTotalAmountVAT] = useState(0)
  const [totalTotAmount, setTotalTotAmount] = useState(0)
  const [totalDomAmount, setTotalDomAmount] = useState(0)
  const [totalDomVATAmount, setTotalDomVATAmount] = useState(0)
  const [totalTotDomAmount, setTotalTotDomAmount] = useState(0)

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
        trailingRowOptions: {
          disabled: true,
        },
        icon: GridColumnIcon.HeaderLookup,
      },
      {
        title: t('607'),
        id: 'Confirm',
        kind: 'Boolean',
        readonly: false,
        width: 120,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: true,
        },
        icon: GridColumnIcon.HeaderBoolean,
      },
      {
        title: t('1326'),
        id: 'IsStop',
        kind: 'Boolean',
        readonly: false,
        width: 120,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: true,
        },
        icon: GridColumnIcon.HeaderBoolean,
      },
      {
        title: t('2'),
        id: 'BizUnitName',
        kind: 'Text',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: true,
        },
        icon: GridColumnIcon.HeaderString,
      },
      {
        title: t('651'),
        id: 'PONo',
        kind: 'Text',
        readonly: true,
        width: 120,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: true,
        },
        icon: GridColumnIcon.HeaderString,
      },
      {
        title: t('Số quản lý đơn đặt hàng'),
        id: 'POMngNo',
        kind: 'Text',
        readonly: true,
        width: 120,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: true,
        },
        icon: GridColumnIcon.HeaderString,
      },
      {
        title: t('166'),
        id: 'PODate',
        kind: 'Text',
        readonly: true,
        width: 100,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: true,
        },
        icon: GridColumnIcon.HeaderString,
      },
      {
        title: t('731'),
        id: 'DeptName',
        kind: 'Text',
        readonly: true,
        width: 200,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: true,
        },
        icon: GridColumnIcon.HeaderString,
      },
      {
        title: t('994'),
        id: 'EmpName',
        kind: 'Text',
        readonly: true,
        width: 200,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: true,
        },
        icon: GridColumnIcon.HeaderString,
      },
      {
        title: t('534'),
        id: 'CustName',
        kind: 'Text',
        readonly: true,
        width: 200,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: true,
        },
        icon: GridColumnIcon.HeaderString,
      },
      {
        title: t('584'),
        id: 'WHName',
        kind: 'Text',
        readonly: true,
        width: 180,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: true,
        },
        icon: GridColumnIcon.HeaderString,
      },
      {
        title: t('996'),
        id: 'Qty',
        kind: 'Text',
        readonly: true,
        width: 120,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          hint: '' + formatNumberCellSum(totalQuantity),
          addIcon: GridColumnIcon.HeaderMath,
          disabled: false,
          themeOverride: {
            textDark: '#009CA6',
            bgIconHeader: '#009CA6',
            accentColor: '#009CA6',
            accentLight: '#009CA620',
            fgIconHeader: '#FFFFFF',
            baseFontStyle: '500 13px',
          },
        },
        icon: GridColumnIcon.HeaderNumber,
      },
      // {
      //   title: t('2359'),
      //   id: 'Price',
      //   kind: 'Text',
      //   readonly: true,
      //   width: 120,
      //   hasMenu: true,
      //   visible: true,
      //   icon: GridColumnIcon.HeaderNumber,
      // },
      {
        title: t('5546'),
        id: 'CurAmt',
        kind: 'Text',
        readonly: true,
        width: 120,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          hint: '' + formatNumberCellSum(totalAmount),
          addIcon: GridColumnIcon.HeaderMath,
          disabled: false,
          themeOverride: {
            textDark: '#009CA6',
            bgIconHeader: '#009CA6',
            accentColor: '#009CA6',
            accentLight: '#009CA620',
            fgIconHeader: '#FFFFFF',
            baseFontStyle: '500 13px',
          },
        },
        icon: GridColumnIcon.HeaderNumber,
      },
      {
        title: t('1032'),
        id: 'CurVAT',
        kind: 'Text',
        readonly: true,
        width: 120,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          hint: '' + formatNumberCellSum(totalAmountVAT),
          addIcon: GridColumnIcon.HeaderMath,
          disabled: false,
          themeOverride: {
            textDark: '#009CA6',
            bgIconHeader: '#009CA6',
            accentColor: '#009CA6',
            accentLight: '#009CA620',
            fgIconHeader: '#FFFFFF',
            baseFontStyle: '500 13px',
          },
        },
        icon: GridColumnIcon.HeaderNumber,
      },
      {
        title: t('945'),
        id: 'TotCurAmt',
        kind: 'Text',
        readonly: true,
        width: 120,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          hint: '' + formatNumberCellSum(totalTotAmount),
          addIcon: GridColumnIcon.HeaderMath,
          disabled: false,
          themeOverride: {
            textDark: '#009CA6',
            bgIconHeader: '#009CA6',
            accentColor: '#009CA6',
            accentLight: '#009CA620',
            fgIconHeader: '#FFFFFF',
            baseFontStyle: '500 13px',
          },
        },
        icon: GridColumnIcon.HeaderNumber,
      },
      {
        title: t('689'),
        id: 'DelvDate',
        kind: 'Text',
        readonly: true,
        width: 120,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: true,
        },
        icon: GridColumnIcon.HeaderString,
      },
      {
        title: t('629'),
        id: 'SMImpTypeName',
        kind: 'Text',
        readonly: true,
        width: 120,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: true,
        },
        icon: GridColumnIcon.HeaderString,
      },
      {
        title: t('362'),
        id: 'Remark',
        kind: 'Text',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: true,
        },
        icon: GridColumnIcon.HeaderString,
      },
      {
        title: t('13071'),
        id: 'CurrName',
        kind: 'Text',
        readonly: true,
        width: 120,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: true,
        },
        icon: GridColumnIcon.HeaderString,
      },
      {
        title: t('364'),
        id: 'ExRate',
        kind: 'Text',
        readonly: true,
        width: 120,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: true,
        },
        icon: GridColumnIcon.HeaderNumber,
      },
      // {
      //   title: t('7638'),
      //   id: 'DomPrice',
      //   kind: 'Text',
      //   readonly: true,
      //   width: 120,
      //   hasMenu: true,
      //   visible: true,
      //   icon: GridColumnIcon.HeaderNumber,
      // },
      {
        title: t('1817'),
        id: 'DomAmt',
        kind: 'Text',
        readonly: true,
        width: 120,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          hint: '' + formatNumberCellSum(totalDomAmount),
          addIcon: GridColumnIcon.HeaderMath,
          disabled: false,
          themeOverride: {
            textDark: '#009CA6',
            bgIconHeader: '#009CA6',
            accentColor: '#009CA6',
            accentLight: '#009CA620',
            fgIconHeader: '#FFFFFF',
            baseFontStyle: '500 13px',
          },
        },
        icon: GridColumnIcon.HeaderNumber,
      },
      {
        title: t('2477'),
        id: 'DomVAT',
        kind: 'Text',
        readonly: true,
        width: 120,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          hint: '' + formatNumberCellSum(totalDomVATAmount),
          addIcon: GridColumnIcon.HeaderMath,
          disabled: false,
          themeOverride: {
            textDark: '#009CA6',
            bgIconHeader: '#009CA6',
            accentColor: '#009CA6',
            accentLight: '#009CA620',
            fgIconHeader: '#FFFFFF',
            baseFontStyle: '500 13px',
          },
        },
        icon: GridColumnIcon.HeaderNumber,
      },
      {
        title: t('16267'),
        id: 'TotDomAmt',
        kind: 'Text',
        readonly: true,
        width: 120,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          hint: '' + formatNumberCellSum(totalTotDomAmount),
          addIcon: GridColumnIcon.HeaderMath,
          disabled: false,
          themeOverride: {
            textDark: '#009CA6',
            bgIconHeader: '#009CA6',
            accentColor: '#009CA6',
            accentLight: '#009CA620',
            fgIconHeader: '#FFFFFF',
            baseFontStyle: '500 13px',
          },
        },
        icon: GridColumnIcon.HeaderNumber,
      },
      {
        title: t('369'),
        id: 'SMCurrStatusName',
        kind: 'Text',
        readonly: true,
        width: 120,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: true,
        },
        icon: GridColumnIcon.HeaderString,
      },
      {
        title: t('9437'),
        id: 'LastUserName',
        kind: 'Text',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: true,
        },
        icon: GridColumnIcon.HeaderString,
      },
      {
        title: t('1235'),
        id: 'LastDateTime',
        kind: 'Text',
        readonly: true,
        width: 120,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: true,
        },
        icon: GridColumnIcon.HeaderString,
      },
      {
        title: t('31392'),
        id: 'POSeq',
        kind: 'Text',
        readonly: true,
        width: 120,
        hasMenu: true,
        visible: false,
        trailingRowOptions: {
          disabled: true,
        },
        icon: GridColumnIcon.HeaderString,
      },
      {
        title: t('1174'),
        id: 'CurrSeq',
        kind: 'Text',
        readonly: true,
        width: 120,
        hasMenu: true,
        visible: false,
        trailingRowOptions: {
          disabled: true,
        },
        icon: GridColumnIcon.HeaderString,
      },
      {
        title: t('3151'),
        id: 'BizUnit',
        kind: 'Text',
        readonly: true,
        width: 120,
        hasMenu: true,
        visible: false,
        trailingRowOptions: {
          disabled: true,
        },
        icon: GridColumnIcon.HeaderString,
      },
      {
        title: t('782'),
        id: 'WHSeq',
        kind: 'Text',
        readonly: true,
        width: 120,
        hasMenu: true,
        visible: false,
        trailingRowOptions: {
          disabled: true,
        },
        icon: GridColumnIcon.HeaderString,
      },
      {
        title: t('Ngày xác nhận'),
        id: 'CfmDate',
        kind: 'Text',
        readonly: true,
        width: 120,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: true,
        },
        icon: GridColumnIcon.HeaderDate,
      },
      {
        title: t('Mã người xác nhận'),
        id: 'CfmEmpId',
        kind: 'Text',
        readonly: true,
        width: 120,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: true,
        },
        icon: GridColumnIcon.HeaderString,
      },
      {
        title: t('Tên người xác nhận'),
        id: 'CfmEmpName',
        kind: 'Text',
        readonly: true,
        width: 180,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: true,
        },
        icon: GridColumnIcon.HeaderString,
      },
      {
        title: t('Lý do xác nhận'),
        id: 'CfmReason',
        kind: 'Text',
        readonly: true,
        width: 200,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: true,
        },
        icon: GridColumnIcon.HeaderString,
      },
      {
        title: t('Lý do dừng lại'),
        id: 'StopReason',
        kind: 'Text',
        readonly: true,
        width: 200,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: true,
        },
        icon: GridColumnIcon.HeaderString,
      },
    ],
    [
      t,
      totalAmount,
      totalQuantity,
      totalAmountVAT,
      totalDomAmount,
      totalDomVATAmount,
      totalTotAmount,
      totalTotDomAmount,
    ],
  )
  const columnsError = useMemo(
    () => [
      {
        title: t('Dòng bị lỗi'),
        dataIndex: 'IDX_NO',
        key: 'IDX_NO',
        width: 100,
        icon: GridColumnIcon.HeaderString,
      },
      {
        title: t('Data'),
        dataIndex: 'Name',
        key: 'Name',
        width: 200,
        icon: GridColumnIcon.HeaderString,
      },
      {
        title: t('Kết quả'),
        dataIndex: 'result',
        key: 'result',
        width: 400,
        icon: GridColumnIcon.HeaderString,
      },
    ],
    [t],
  )
  const [loading, setLoading] = useState(false)
  const [loadingA, setLoadingA] = useState(null)
  const [errorA, setErrorA] = useState(false)
  const [data, setData] = useState([])

  const [dataBizUnit, setDataBizUnit] = useState([])
  const [dataStatus, setDataStatus] = useState([])
  const [dataPurTypeName, setDataPurTypeName] = useState([])

  const [dataWarehouse, setDataWarehouse] = useState([])
  const [dataDeptName, setDataDeptName] = useState([])
  const [dataUserName, setDataUserName] = useState([])
  const [dataCustName, setDataCustName] = useState([])

  const [fromDate, setFromDate] = useState(dayjs().startOf('month') || '')
  const [toDate, setToDate] = useState(dayjs())

  const [bizUnit, setBizUnit] = useState('0')
  const [purTypeName, setPurTypeName] = useState('0')
  const [documentNo, setDocumentNo] = useState('')
  const [pOMngNo, setPOMngNo] = useState('')
  const [status, setStatus] = useState('0')

  const [keyPath, setKeyPath] = useState(null)
  const formatDate = (date) => date.format('YYYYMMDD')

  //Sheet
  const [isOpenDetails, setIsOpenDetails] = useState(false)
  const [gridData, setGridData] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalConfirmOpen, setModalConfirmOpen] = useState(false)
  const [modalStopOpen, setModalStopOpen] = useState(false)
  const [isQuery, setIsQuery] = useState(false)
  const [selection, setSelection] = useState({
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty(),
  })
  const [showSearch, setShowSearch] = useState(false)
  const [lastClickedCell, setLastClickedCell] = useState(null)
  const [addedRows, setAddedRows] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSent, setIsSent] = useState(false)
  const [editedRows, setEditedRows] = useState([])
  const [clickedRowData, setClickedRowData] = useState(null)
  const [isMinusClicked, setIsMinusClicked] = useState(false)
  const [numRowsToAdd, setNumRowsToAdd] = useState(null)
  const [numRows, setNumRows] = useState(0)
  const [clickCount, setClickCount] = useState(false)
  const [openHelp, setOpenHelp] = useState(false)
  const [isCellSelected, setIsCellSelected] = useState(false)
  const [onSelectRow, setOnSelectRow] = useState([])
  const [keySelectColumn, setKeySelectColumn] = useState(false)
  const calculateTotalQuantity = () => {
    const total = gridData.reduce((sum, item) => sum + (item.Qty || 0), 0)
    setTotalQuantity(total)
  }
  const calculateTotalAmount = () => {
    const total = gridData.reduce((sum, item) => sum + (item.CurAmt || 0), 0)
    setTotalAmount(total)
  }
  const calculateTotalAmountVAT = () => {
    const total = gridData.reduce((sum, item) => sum + (item.CurVAT || 0), 0)
    setTotalAmountVAT(total)
  }
  const calculateTotalTotAmount = () => {
    const total = gridData.reduce((sum, item) => sum + (item.TotCurAmt || 0), 0)
    setTotalTotAmount(total)
  }
  const calculateTotalDomAmount = () => {
    const total = gridData.reduce((sum, item) => sum + (item.DomAmt || 0), 0)
    setTotalDomAmount(total)
  }
  const calculateTotalDomVATAmount = () => {
    const total = gridData.reduce((sum, item) => sum + (item.DomVAT || 0), 0)
    setTotalDomVATAmount(total)
  }
  const calculateTotDomTotalAmount = () => {
    const total = gridData.reduce((sum, item) => sum + (item.TotDomAmt || 0), 0)
    setTotalTotDomAmount(total)
  }

  useEffect(() => {
    calculateTotalQuantity()
    calculateTotalAmount()
    calculateTotalAmountVAT()
    calculateTotalTotAmount()
    calculateTotalDomAmount()
    calculateTotalDomVATAmount()
    calculateTotDomTotalAmount()
  }, [gridData])

  const [cols, setCols] = useState(() =>
    loadFromLocalStorageSheet(
      'S_ERP_COLS_PAGE_ORD_PO_LIST',
      defaultCols.filter((col) => col.visible),
    ),
  )
  useEffect(() => {
    setCols(defaultCols.filter((col) => col.visible))
  }, [defaultCols])
  const [dataError, setDataError] = useState([])
  const [whName, setWhName] = useState('')
  const [whSeq, setWhSeq] = useState('')

  /* CodeHelp */
  const [empName, setEmpName] = useState('')
  const [empSeq, setEmpSeq] = useState('')
  const [custName, setCustName] = useState('')
  const [custSeq, setCustSeq] = useState('')
  const [deptName, setDeptName] = useState('')
  const [deptSeq, setDeptSeq] = useState('0')
  const [pOSeq, setPOSeq] = useState('')

  const [reason, setReason] = useState('')
  const [isAPISuccess, setIsAPISuccess] = useState(true)
  const [reqNoTitle, setReqNoTitle] = useState('')
  const [isConfirm, setIsConfirm] = useState('')
  const [isStop, setIsStop] = useState('0')
  const [pONo, setPONo] = useState('')
  const [rowIndex, setRowIndex] = useState('')

  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isModalWarning, setIsModalWarning] = useState(false)

  const [selection2, setSelection2] = useState({
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty(),
  })
  const [selection3, setSelection3] = useState({
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty(),
  })

  const resetTable = () => {
    setSelection({
      columns: CompactSelection.empty(),
      rows: CompactSelection.empty(),
    })
  }
  const resetTable2 = () => {
    setSelection2({
      columns: CompactSelection.empty(),
      rows: CompactSelection.empty(),
    })
  }
  const resetTable3 = () => {
    setSelection3({
      columns: CompactSelection.empty(),
      rows: CompactSelection.empty(),
    })
  }

  useEffect(() => {
    message.destroy()
    if (parsedUserInfo && parsedUserInfo.UserName) {
      setEmpName(parsedUserInfo.UserName)
      setEmpSeq(parsedUserInfo.EmpSeq)
    }
  }, [])

  useEffect(() => {
    const savedState = localStorage.getItem('detailsStateOrdPOList')
    setIsOpenDetails(savedState === 'open')
  }, [])

  const handleToggle = (event) => {
    const isOpen = event.target.open
    setIsOpenDetails(isOpen)
    localStorage.setItem('detailsStateOrdPOList', isOpen ? 'open' : 'closed')
  }

  const fetchSPUORDPOListQueryWEB = async () => {
    if (isAPISuccess === false) {
      message.warning('Không thể thực hiện, vui lòng kiểm tra trạng thái.')
      return
    }
    setIsAPISuccess(false)
    if (loadingBarRef.current) {
      loadingBarRef.current.continuousStart()
    }
    try {
      const data = [
        {
          IsChangedMst: '0',
          BizUnit: bizUnit,
          BizUnitName: '',
          PODateFr: fromDate ? formatDate(fromDate) : '',
          PODateTo: toDate ? formatDate(toDate) : '',
          WHSeq: whSeq,
          DocumentNo: documentNo,
          POMngNo: pOMngNo,
          CustSeq: custSeq,
          CustName: custName,
          DeptSeq: deptSeq,
          DeptName: deptName,
          EmpSeq: empSeq,
          EmpName: empName,
          SMCurrStatus: status,
        },
      ]

      const response = await GetSheetQuery(data)
      if (response.data.success) {
        const fetchedData = response.data.data || []
        setData(fetchedData)
        setGridData(fetchedData)
        setIsAPISuccess(true)
        if (loadingBarRef.current) {
          loadingBarRef.current.complete()
        }
        setNumRows(fetchedData.length)
        setIsQuery(true)
        resetTable()
      } else {
        setData([])
        setGridData([])
        setNumRows(0)
        if (loadingBarRef.current) {
          loadingBarRef.current.complete()
          message.error('Có lỗi xảy ra khi tải dữ liệu.')
        }
      }
    } catch (error) {
      setErrorA(true)
      setIsAPISuccess(true)
      if (loadingBarRef.current) {
        loadingBarRef.current.complete()
        message.error('Có lỗi xảy ra khi tải dữ liệu.')
      }
    } finally {
      setIsAPISuccess(true)
      //if (loadingBarRef.current) {
      //loadingBarRef.current.complete()
      //}
    }
  }

  const fetchCodeHelpData = useCallback(async () => {
    if (controllers.current.fetchCodeHelpController) {
      controllers.current.fetchCodeHelpController.abort()
      controllers.current.fetchCodeHelpController = null
      await new Promise((resolve) => setTimeout(resolve, 10))
    }
    if (loadingBarRef.current) {
      loadingBarRef.current.continuousStart()
    }
    const controller = new AbortController()
    const signal = controller.signal

    controllers.current.fetchCodeHelpController = controller
    try {
      const [
        codeHelpBizUnit,
        codeHelpStatus,
        codeHelpWarehouse,
        codeHelpDeptName,
        codeHelpUserName,
        codeHelpCustName,
      ] = await Promise.all([
        GetCodeHelpCombo('', 6, 10003, 1, '%', '', '', '', ''),
        GetCodeHelpCombo('', 6, 19998, 1, '%', '6036', '', '', ''),
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
        GetCodeHelp(10010, '', '', '', '', '', '1', '', 1, '', 0, 0, 0),
        GetCodeHelp(90003, '', '', '', '', '', '1', '', 1, '', 0, 0, 0),
        GetCodeHelp(17001, '', '', '', '', '', '1', '', 1, '', 0, 0, 0),
      ])

      setDataBizUnit(codeHelpBizUnit?.data || [])
      setDataStatus(codeHelpStatus?.data || [])
      setDataWarehouse(codeHelpWarehouse?.data || [])
      setDataDeptName(codeHelpDeptName?.data || [])
      setDataUserName(codeHelpUserName?.data || [])
      setDataCustName(codeHelpCustName?.data || [])
    } catch (error) {
      setDataBizUnit([])
      setDataStatus([])
      setDataWarehouse([])
      setDataDeptName([])
      setDataUserName([])
      setDataCustName([])
    } finally {
      if (loadingBarRef.current) {
        loadingBarRef.current.complete()
      }
      controllers.current.fetchCodeHelpController = null
    }
  }, [bizUnit])

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

  // const nextPage = useCallback(() => {
  //   if (keyPath) {
  //     navigate(`/pur/u/pur-order/ord-approval-req/${keyPath}`)
  //   }
  // }, [keyPath, navigate])

  const nextPage = useCallback(() => {
    if (keyPath) {
      window.open(`/pur/u/purchase/ord-po-link/${keyPath}`, '_blank')
    }
  }, [keyPath])
  //Sheet

  const getSelectedRowsData = () => {
    const selectedRows = selection.rows.items

    return selectedRows.flatMap(([start, end]) =>
      Array.from({ length: end - start }, (_, i) => gridData[start + i]).filter(
        (row) => row !== undefined,
      ),
    )
  }
  useEffect(() => {
    const data = getSelectedRowsData()
    if (data && data.length > 0) {
      if (data[0].POSeq !== '') {
        const filteredData = {
          POSeq: data[0].POSeq,
        }
        const secretKey = 'TEST_ACCESS_KEY'
        const encryptedData = CryptoJS.AES.encrypt(
          JSON.stringify(filteredData),
          secretKey,
        ).toString()
        const encryptedToken = encodeBase64Url(encryptedData)
        setKeyPath(encryptedToken)
      } else {
        setKeyPath(null)
      }
    } else {
      setKeyPath(null)
    }
  }, [selection.rows.items, gridData])

  const handleRowAppend = useCallback(
    (numRowsToAdd) => {
      //onRowAppended(cols, setGridData, setNumRows, setAddedRows, numRowsToAdd)
    },
    [cols, setGridData, setNumRows, setAddedRows, numRowsToAdd],
  )

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault()
        setShowSearch(true)
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'q') {
        e.preventDefault()
        fetchSPUORDPOListQueryWEB()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [fetchSPUORDPOListQueryWEB])

  const handleConfirmDataSheet = useCallback(async () => {
    if (isAPISuccess === false) {
      message.warning(
        'Đang thực hiện tác vụ khác, vui lòng kiểm tra trạng thái.',
      )
      return
    }

    let resulAUD = [
      {
        RowIndex: rowIndex,
        Reason: reason,
        POSeq: pOSeq,
        IsConfirm: isConfirm,
      },
    ]
    console.log('resulAUD', resulAUD)
    if (isSent) return
    setIsSent(true)
    if (resulAUD.length > 0) {
      setIsAPISuccess(false)
      if (loadingBarRef.current) {
        loadingBarRef.current.continuousStart()
      }

      try {
        const promises = []

        if (resulAUD.length > 0) {
          promises.push(PostPOListConfirm(resulAUD))
        }

        const results = await Promise.all(promises)
        results.forEach((result, index) => {
          if (result.data.success) {
            setIsAPISuccess(true)
            if (loadingBarRef.current) {
              loadingBarRef.current.complete()
              message.success('Xác nhận yêu cầu thành công!')
            }

            setIsLoading(false)
            setIsSent(false)
            setEditedRows([])
            setModalConfirmOpen(false)
            fetchSPUORDPOListQueryWEB()
            setReason('')
            resetTable()
          } else {
            setIsAPISuccess(true)
            if (loadingBarRef.current) {
              loadingBarRef.current.complete()
              message.error('Có lỗi xảy ra khi xác nhận yêu cầu')
            }
            setIsLoading(false)
            setIsSent(false)
            setDataError(result.data.errors)
            setModalConfirmOpen(false)
            setIsModalVisible(true)
            setReason('')
          }
        })
      } catch (error) {
        setIsAPISuccess(true)
        setIsLoading(false)
        setIsSent(false)
        setModalConfirmOpen(false)
        setReason('')
        if (loadingBarRef.current) {
          loadingBarRef.current.complete()
          message.error(error.message || 'Có lỗi xảy ra khi xác nhận yêu cầu')
        }
      }
    } else {
      setIsAPISuccess(true)
      setIsLoading(false)
      setIsSent(false)
      setModalConfirmOpen(false)
      setReason('')
      if (loadingBarRef.current) {
        loadingBarRef.current.complete()
        message.warning('Không có dữ liệu để xác nhận!')
      }
    }
  }, [rowIndex, reason, pOSeq, isConfirm, isAPISuccess])

  const handleStopDataSheet = useCallback(async () => {
    if (isAPISuccess === false) {
      message.warning(
        'Đang thực hiện tác vụ khác, vui lòng kiểm tra trạng thái.',
      )
      return
    }
    let resulAUD = [
      {
        RowIndex: rowIndex,
        Reason: reason,
        POSeq: pOSeq,
        IsStop: isStop,
      },
    ]

    if (isSent) return
    setIsSent(true)
    if (resulAUD.length > 0 || resulAUD.length > 0) {
      setIsAPISuccess(false)
      if (loadingBarRef.current) {
        loadingBarRef.current.continuousStart()
      }
      try {
        const promises = []

        if (resulAUD.length > 0) {
          promises.push(PostPOListStop(resulAUD))
        }

        const results = await Promise.all(promises)
        results.forEach((result, index) => {
          if (result.data.success) {
            setIsAPISuccess(true)
            if (loadingBarRef.current) {
              loadingBarRef.current.complete()
              message.success('Xác nhận dừng yêu cầu thành công!')
            }
            setIsLoading(false)
            setIsSent(false)
            setEditedRows([])
            setModalStopOpen(false)
            setReason('')
            fetchSPUORDPOListQueryWEB()
            resetTable()
          } else {
            setIsAPISuccess(true)
            if (loadingBarRef.current) {
              loadingBarRef.current.complete()
              message.error('Có lỗi xảy ra khi xác nhận dừng yêu cầu')
            }
            setIsLoading(false)
            setIsSent(false)
            setDataError(result.data.errors)
            setModalStopOpen(false)
            setIsModalVisible(true)
            setReason('')
          }
        })
      } catch (error) {
        setIsAPISuccess(true)
        setIsLoading(false)
        setIsSent(false)
        setModalStopOpen(false)
        setReason('')
        if (loadingBarRef.current) {
          loadingBarRef.current.complete()
          message.error(
            error.message || 'Có lỗi xảy ra khi xác nhận dừng yêu cầu',
          )
        }
      }
    } else {
      setIsAPISuccess(true)
      if (loadingBarRef.current) {
        loadingBarRef.current.complete()
        message.warning('Không có dữ liệu để xác nhận dừng yêu cầu!')
      }
      setIsSent(false)
      setModalStopOpen(false)
      setReason('')
    }
  }, [rowIndex, reason, pOSeq, isStop, isAPISuccess])
  return (
    <>
      <Helmet>
        <title>HPM - {t('Truy vấn đặt mua hàng trong nước')}</title>
      </Helmet>
      <TopLoadingBar color="blue" height={2} ref={loadingBarRef} />
      <div
        className={`bg-slate-50 p-3 h-screen overflow-hidden relative app-content  `}
      >
        <div className="flex flex-col gap-4 md:grid md:grid-cols-4 md:grid-rows-[auto_1fr] md:gap-4 h-full">
          <div className="col-start-1 col-end-5 row-start-1 w-full rounded-lg ">
            <div className="flex items-center justify-between mb-2">
              <Title level={4} className="mt-2 uppercase opacity-85 ">
                {t('Truy vấn đặt mua hàng trong nước')}
              </Title>
              <PurOrderPOListActions
                nextPage={nextPage}
                debouncedFetchSPUORDPOListQueryWEB={fetchSPUORDPOListQueryWEB}
              />
            </div>
            <details
              className="group p-2 [&_summary::-webkit-details-marker]:hidden border rounded-lg bg-white"
              open
            >
              <summary className="flex cursor-pointer items-center justify-between gap-1.5 text-gray-900">
                <h2 className="text-xs font-medium flex items-center gap-2 text-blue-600 uppercase">
                  <FilterOutlined />
                  {t('359')}
                </h2>
                <span className="relative size-5 shrink-0">
                  <ArrowIcon />
                </span>
              </summary>
              <div className="flex p-2 gap-4">
                <PurOrderPOListQuery
                  fromDate={fromDate}
                  setFromDate={setFromDate}
                  setToDate={setToDate}
                  toDate={toDate}
                  bizUnit={bizUnit}
                  dataBizUnit={dataBizUnit}
                  setBizUnit={setBizUnit}
                  status={status}
                  dataStatus={dataStatus}
                  setStatus={setStatus}
                  whName={whName}
                  setWhName={setWhName}
                  setWhSeq={setWhSeq}
                  dataWarehouse={dataWarehouse}
                  custName={custName}
                  setCustName={setCustName}
                  setCustSeq={setCustSeq}
                  dataCustName={dataCustName}
                  userName={empName}
                  setUserName={setEmpName}
                  setUserSeq={setEmpSeq}
                  dataUserName={dataUserName}
                  deptName={deptName}
                  setDeptName={setDeptName}
                  setDeptSeq={setDeptSeq}
                  dataDeptName={dataDeptName}
                  documentNo={documentNo}
                  setDocumentNo={setDocumentNo}
                  pOMngNo={pOMngNo}
                  setPOMngNo={setPOMngNo}
                />
              </div>
            </details>
          </div>
          <div className="col-start-1 col-end-5 row-start-2 w-full h-full rounded-lg">
            {
              <TablePurOrdPOList
                setSelection={setSelection}
                selection={selection}
                showSearch={showSearch}
                setShowSearch={setShowSearch}
                setAddedRows={setAddedRows}
                addedRows={addedRows}
                setEditedRows={setEditedRows}
                editedRows={editedRows}
                setNumRowsToAdd={setNumRowsToAdd}
                clickCount={clickCount}
                numRowsToAdd={numRowsToAdd}
                numRows={numRows}
                onSelectRow={onSelectRow}
                openHelp={openHelp}
                setOpenHelp={setOpenHelp}
                setOnSelectRow={setOnSelectRow}
                setIsCellSelected={setIsCellSelected}
                isCellSelected={isCellSelected}
                setGridData={setGridData}
                gridData={gridData}
                setNumRows={setNumRows}
                setCols={setCols}
                handleRowAppend={handleRowAppend}
                cols={cols}
                defaultCols={defaultCols}
                canEdit={canEdit}
                setModalConfirmOpen={setModalConfirmOpen}
                setModalStopOpen={setModalStopOpen}
                setPOSeq={setPOSeq}
                setPONo={setPONo}
                setIsConfirm={setIsConfirm}
                setIsStop={setIsStop}
                setRowIndex={setRowIndex}
                setReqNoTitle={setReqNoTitle}
                setIsQuery={setIsQuery}
                isQuery={isQuery}
              />
            }
          </div>
        </div>
      </div>
      <ErrorListModal
        dataError={dataError}
        setIsModalVisible={setIsModalVisible}
        isModalVisible={isModalVisible}
        columns={columnsError}
      />
      <ModalSheetConfirm
        modalOpen={modalConfirmOpen}
        setModalOpen={setModalConfirmOpen}
        confirm={handleConfirmDataSheet}
        reason={reason}
        setReason={setReason}
        reqNoTitle={reqNoTitle}
      />
      <ModalSheetStop
        modalOpen={modalStopOpen}
        setModalOpen={setModalStopOpen}
        confirm={handleStopDataSheet}
        reason={reason}
        setReason={setReason}
        reqNoTitle={reqNoTitle}
      />
    </>
  )
}
