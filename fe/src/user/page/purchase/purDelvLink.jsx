import { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet'
import { Input, Typography, Row, Col, Upload, message, Menu, Form } from 'antd'
const { Title, Text } = Typography
import {
  FilterOutlined,
  LoadingOutlined,
  BlockOutlined,
} from '@ant-design/icons'
import { ArrowIcon } from '../../components/icons'
import dayjs from 'dayjs'
import { debounce } from 'lodash'
import { useNavigate, useParams } from 'react-router-dom'
import CryptoJS from 'crypto-js'
import { CompactSelection, GridColumnIcon } from '@glideapps/glide-data-grid'
import useKeydownHandler from '../../components/hooks/sheet/useKeydownHandler'
import { loadFromLocalStorageSheet } from '../../../localStorage/sheet/sheet'
import { onRowAppended } from '../../components/sheet/js/onRowAppended'
import { filterAndSelectColumnsAUD } from '../../../utils/filterSheetAUD'
import { generateEmptyData } from '../../components/sheet/js/generateEmptyData'
import useDynamicFilter from '../../components/hooks/sheet/useDynamicFilter'
import { validateColumns } from '../../../utils/validateColumns'
import { formatNumberCellSum } from '../../../utils/formatNumberCellSum'
import { GetCodeHelpCombo } from '../../../features/codeHelp/getCodeHelpCombo'
import { GetCodeHelp } from '../../../features/codeHelp/getCodeHelp'
import ModalSheetDelete from '../../components/modal/default/deleteSheet'
import ModalMasterDelete from '../../components/modal/default/deleteMaster'
import WarningModal from '../default/warningModal'

import PurDelvActions from '../../components/actions/purchase/purDelvActions'
import PurDelvQuery from '../../components/query/purchase/purDelvQuery'
import TablePurDelv from '../../components/table/purchase/tablePurDelv'
import TableUploadFileOrdPO from '../../components/table/purchase/tableUploadFileOrdPO'
const menuStyle = {}

import { GetMasterQuery } from '../../../features/purchase/purDelvLink/getMasterQuery'
import { GetSheetQuery } from '../../../features/purchase/purDelvLink/getSheetQuery'
import { getQFileSeq } from './../../../features/basic/daMaterialList/getQFileSeq'

import { PostAUD } from '../../../features/purchase/purDelv/postAUD'
import { PostMasterDelete } from '../../../features/purchase/purDelv/postMasterDelete'
import { PostSheetDelete } from '../../../features/purchase/purDelv/postSheetDelete'

import { uploadFilesItems } from './../../../features/upload/postFileItems'
import { PostDFilesItems } from './../../../features/upload/postDFileItems'
import ErrorListModal from '../default/errorListModal'
import { updateIndexNo } from '../../components/sheet/js/updateIndexNo'
import TopLoadingBar from 'react-top-loading-bar'
import { togglePageInteraction } from '../../../utils/togglePageInteraction'
import { allowedTypes } from './../../../utils/allowedTypes'

export default function PurDelvLink({
  permissions,
  isMobile,
  canCreate,
  canEdit,
  canDelete,
  abortControllerRef,
  controllers,
  cancelAllRequests,
}) {
  const { t } = useTranslation()
  const { id } = useParams()
  const [localId, setLocalId] = useState(id)
  const secretKey = 'TEST_ACCESS_KEY'
  const gridRef = useRef(null)
  const loadingBarRef = useRef(null)
  const userInfo = localStorage.getItem('userInfo')
  const parsedUserInfo = JSON.parse(userInfo)
  const [totalQuantity, setTotalQuantity] = useState(0)
  const [totalQuantityApproval, setTotalQuantityApproval] = useState(0)
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
        title: t('POSeq'),
        id: 'POSeq',
        kind: 'Text',
        readonly: true,
        width: 100,
        hasMenu: true,
        visible: false,
        trailingRowOptions: {
          disabled: true,
        },
        icon: GridColumnIcon.HeaderString,
      },
      {
        title: t('POSerl'),
        id: 'POSerl',
        kind: 'Text',
        readonly: true,
        width: 100,
        hasMenu: true,
        visible: false,
        trailingRowOptions: {
          disabled: true,
        },
        icon: GridColumnIcon.HeaderString,
      },
      {
        title: t('DelvSeq'),
        id: 'DelvSeq',
        kind: 'Text',
        readonly: true,
        width: 100,
        hasMenu: true,
        visible: false,
        trailingRowOptions: {
          disabled: true,
        },
        icon: GridColumnIcon.HeaderString,
      },
      {
        title: t('DelvSerl'),
        id: 'DelvSerl',
        kind: 'Text',
        readonly: true,
        width: 100,
        hasMenu: true,
        visible: false,
        trailingRowOptions: {
          disabled: true,
        },
        icon: GridColumnIcon.HeaderString,
      },
      {
        title: t('2090'),
        id: 'ItemName',
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
        title: t('2091'),
        id: 'ItemNo',
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
        title: t('551'),
        id: 'Spec',
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
        title: t('2107'),
        id: 'ItemSeq',
        kind: 'Text',
        readonly: true,
        width: 120,
        hasMenu: true,
        visible: false,
        trailingRowOptions: {
          disabled: true,
        },
        icon: GridColumnIcon.HeaderRowID,
      },
      {
        title: t('602'),
        id: 'UnitName',
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
        title: t('868'),
        id: 'UnitSeq',
        kind: 'Text',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: false,
        trailingRowOptions: {
          disabled: true,
        },
        icon: GridColumnIcon.HeaderRowID,
      },
      {
        title: t('2359'),
        id: 'Price',
        kind: 'Text',
        readonly: false,
        width: 150,
        hasMenu: true,
        visible: true,
        themeOverride: {
          textHeader: '#DD1144',
          bgIconHeader: '#DD1144',
          fontFamily: '',
        },
        trailingRowOptions: {
          disabled: true,
        },
        icon: GridColumnIcon.HeaderNumber,
      },
      {
        title: t('POAmt'),
        id: 'POAmt',
        kind: 'Text',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: false,
        trailingRowOptions: {
          disabled: true,
        },
        icon: GridColumnIcon.HeaderNumber,
      },
      {
        title: t('Số lượng đặt hàng'),
        id: 'POQty',
        kind: 'Text',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          hint: '' + formatNumberCellSum(totalQuantityApproval),
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
        title: t('12392'),
        id: 'Qty',
        kind: 'Text',
        readonly: false,
        width: 150,
        hasMenu: true,
        visible: true,
        // themeOverride: {
        //   textHeader: '#DD1144',
        //   bgIconHeader: '#DD1144',
        //   baseFontStyle: '600 13px',
        // },
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

      {
        title: t('290'),
        id: 'CurAmt',
        kind: 'Text',
        readonly: true,
        width: 150,
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
        title: t('2449'),
        id: 'IsVAT',
        kind: 'Boolean',
        readonly: true,
        width: 100,
        hasMenu: true,
        visible: false,
        icon: GridColumnIcon.HeaderBoolean,
      },
      {
        title: t('2450'),
        id: 'VATRate',
        kind: 'Text',
        readonly: false,
        width: 120,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: true,
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
        title: t('7638'),
        id: 'DomPrice',
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
        title: t('BasicAmt'),
        id: 'BasicAmt',
        kind: 'Text',
        readonly: true,
        width: 100,
        hasMenu: true,
        visible: false,
        trailingRowOptions: {
          disabled: true,
        },
        icon: GridColumnIcon.HeaderNumber,
      },
      {
        title: t('362'),
        id: 'Remark',
        kind: 'Text',
        readonly: false,
        width: 150,
        hasMenu: false,
        visible: true,
        trailingRowOptions: {
          disabled: true,
        },
        icon: GridColumnIcon.HeaderString,
      },
      {
        title: t('Memo1'),
        id: 'Memo1',
        kind: 'Text',
        readonly: false,
        width: 150,
        hasMenu: false,
        visible: false,
        trailingRowOptions: {
          disabled: true,
        },
        icon: GridColumnIcon.HeaderString,
      },
      {
        title: t('Memo2'),
        id: 'Memo2',
        kind: 'Text',
        readonly: false,
        width: 150,
        hasMenu: false,
        visible: false,
        trailingRowOptions: {
          disabled: true,
        },
        icon: GridColumnIcon.HeaderString,
      },
      {
        title: t('Memo3'),
        id: 'Memo3',
        kind: 'Text',
        readonly: false,
        width: 150,
        hasMenu: false,
        visible: false,
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
      totalQuantityApproval,
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
  const defaultColsC = useMemo(
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
      },
      {
        title: 'IdSeq',
        id: 'IdSeq',
        kind: 'Text',
        readonly: true,
        width: 200,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderRowID,
      },
      {
        title: 'Tên file gốc',
        id: 'OriginalName',
        kind: 'Uri',
        readonly: true,
        width: 300,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderUri,
      },
      {
        title: 'Kích đúp vào dòng ở cột này để tải file',
        id: 'Filename',
        kind: 'Text',
        readonly: true,
        width: 300,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderString,
      },
      {
        title: 'Size',
        id: 'Size',
        kind: 'Text',
        readonly: true,
        width: 200,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderNumber,
      },
    ],
    [t],
  )
  const [loading, setLoading] = useState(false)

  const [dataBizUnit, setDataBizUnit] = useState([])
  const [dataPurTypeName, setDataPurTypeName] = useState([])
  const [dataPaymentType, setDataPaymentType] = useState([])
  const [dataCurrName, setDataCurrName] = useState([])

  const [dataItemName, setDataItemName] = useState([])
  const [dataWarehouse, setDataWarehouse] = useState([])
  const [dataDeptName, setDataDeptName] = useState([])
  const [dataUserName, setDataUserName] = useState([])
  const [dataCustName, setDataCustName] = useState([])

  const [fromDate, setFromDate] = useState(dayjs())
  const formatDate = (date) => date.format('YYYYMMDD')

  const [isOpenDetails, setIsOpenDetails] = useState(false)
  const [gridData, setGridData] = useState([])
  const [gridDataC, setGridDataC] = useState([])
  const [fileList, setFileList] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMasterDeleteOpen, setModalMasterDeleteOpen] = useState(false)

  const [selection, setSelection] = useState({
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty(),
  })
  const [selectionC, setSelectionC] = useState({
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty(),
  })
  const [showSearch, setShowSearch] = useState(false)
  const [lastClickedCell, setLastClickedCell] = useState(null)
  const [addedRows, setAddedRows] = useState([])
  const [addedRowsC, setAddedRowsC] = useState([])
  const [editedRows, setEditedRows] = useState([])
  const [editedRowsC, setEditedRowsC] = useState([])
  const [clickedRowData, setClickedRowData] = useState(null)
  const [isMinusClicked, setIsMinusClicked] = useState(false)
  const [numRowsToAdd, setNumRowsToAdd] = useState(null)
  const [numRows, setNumRows] = useState(0)
  const [numRowsC, setNumRowsC] = useState(0)
  const [clickCount, setClickCount] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSent, setIsSent] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [openHelp, setOpenHelp] = useState(false)
  const [isCellSelected, setIsCellSelected] = useState(false)
  const [isCell, setIsCell] = useState(null)
  const [onSelectRow, setOnSelectRow] = useState([])
  const [keySelectColumn, setKeySelectColumn] = useState(false)
  const [dataCommissionCust, setDataCommissionCust] = useState([])
  const [dataError, setDataError] = useState([])
  const [dataSub, setDataSub] = useState([])
  const [isDeleting, setIsDeleting] = useState(false)
  const [isReset, setIsReset] = useState(false)
  const calculateTotalQuantity = () => {
    const total = gridData.reduce((sum, item) => sum + (item.Qty || 0), 0)
    setTotalQuantity(total)
  }
  const calculateTotalQuantityApproval = () => {
    const total = gridData.reduce((sum, item) => sum + (item.POQty || 0), 0)
    setTotalQuantityApproval(total)
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
    calculateTotalQuantityApproval()
  }, [gridData])

  const [cols, setCols] = useState(() =>
    loadFromLocalStorageSheet(
      'S_ERP_COLS_PAGE_PUR_ORD_PO',
      defaultCols.filter((col) => col.visible),
    ),
  )
  const [colsC, setColsC] = useState(() =>
    loadFromLocalStorageSheet(
      'ORD_PO_UPLOAD',
      defaultColsC.filter((col) => col.visible),
    ),
  )
  useEffect(() => {
    setCols(defaultCols.filter((col) => col.visible))
    setColsC(defaultColsC.filter((col) => col.visible))
  }, [defaultCols, defaultColsC])

  /* CodeHelp */
  const [bizUnit, setBizUnit] = useState('0')
  const [bizUnitName, setBizUnitName] = useState('')
  const [purTypeName, setPurTypeName] = useState('0')
  const [stockType, setStockType] = useState('')
  const [status, setStatus] = useState('')
  const [empName, setEmpName] = useState('')
  const [empSeq, setEmpSeq] = useState('')
  const [deptName, setDeptName] = useState('')
  const [deptSeq, setDeptSeq] = useState('0')
  const [custName, setCustName] = useState('')
  const [custSeq, setCustSeq] = useState('')
  const [delvSeq, setDelvSeq] = useState('0')
  const [delvNo, setDelvNo] = useState('')
  const [delvMngNo, setDelvMngNo] = useState('')
  const [remark, setRemark] = useState('')
  const [isConfirm, setIsConfirm] = useState('')
  const [isStop, setIsStop] = useState('0')
  const [whName, setWhName] = useState('')
  const [whSeq, setWhSeq] = useState('0')
  const [current, setCurrent] = useState('0')
  const [currName, setCurrName] = useState('')
  const [currSeq, setCurrSeq] = useState('0')
  const [exRate, setExRate] = useState(0)
  const [basicAmt, setBasicAmt] = useState(0)
  const [pOSeq, setPOSeq] = useState('0')

  const handleMenuClick = (e) => {
    setCurrent(e.key)
  }
  const [isAPISuccess, setIsAPISuccess] = useState(true)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isModalWarning, setIsModalWarning] = useState(false)

  const [count, setCount] = useState(0)
  const [emptyWordIds, setEmptyWordIds] = useState([])
  const lastWordEntryRef = useRef(null)
  const [clickCellName, setClickCellName] = useState([])
  const [onConfirm, setOnConfirm] = useState(false)
  const [onDiscard, setOnDiscard] = useState(false)

  const fieldsToTrack = ['ItemName']
  const { filterValidEntries, findLastEntry, findMissingIds } =
    useDynamicFilter(gridData, fieldsToTrack)

  const resetTable = () => {
    setSelection({
      columns: CompactSelection.empty(),
      rows: CompactSelection.empty(),
    })
    setSelectionC({
      columns: CompactSelection.empty(),
      rows: CompactSelection.empty(),
    })
  }
  useEffect(() => {
    cancelAllRequests()
    message.destroy()
  }, [])

  // useEffect(() => {
  //   if (parsedUserInfo && parsedUserInfo.UserName) {
  //     setEmpName(parsedUserInfo.UserName)
  //     setEmpSeq(parsedUserInfo.EmpSeq)
  //   }
  // }, [])

  // useEffect(() => {
  //   if (!gridData || !gridData.some((item) => item.Status === 'A')) {
  //     const emptyData = generateEmptyData(50, defaultCols)
  //     const updatedEmptyData = updateIndexNo(emptyData)
  //     setGridData(updatedEmptyData)
  //     setNumRows(emptyData.length)
  //     return
  //   }
  // }, [])

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

  const decryptData = (encryptedToken) => {
    try {
      const base64Data = decodeBase64Url(encryptedToken)
      const bytes = CryptoJS.AES.decrypt(base64Data, secretKey)
      const decryptedData = bytes.toString(CryptoJS.enc.Utf8)
      return JSON.parse(decryptedData)
    } catch (error) {
      console.log('error', error)
      return null
    }
  }
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault()
      event.returnValue = ''
      return ''
    }
    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [])
  useEffect(() => {
    if (id) {
      const data = decryptData(id)
      if (data) {
        fetchDataFileSeq(data.DelvSeq, 'file')
        fetchMasterQuery(data.DelvSeq)
        fetchSheetQuery(data.DelvSeq)
      }
    }
  }, [id])

  const fetchDataFileSeq = useCallback(async (ItemNoSeq, FormCode) => {
    const controller = new AbortController()
    const signal = controller.signal
    const TableName = '_TPUDelv'
    try {
      const response = await getQFileSeq(ItemNoSeq, FormCode, TableName, signal)
      if (response.success) {
        const fetchedData = response.data.data || []
        setGridDataC(fetchedData)
        setNumRowsC(fetchedData.length)
      } else {
        message.error(response.data.message || 'Có lỗi xảy ra khi lấy dữ liệu!')
      }
    } catch (error) {
      setGridDataC([])
      setNumRowsC(0)
    } finally {
    }
  }, [])

  const fetchMasterQuery = async (delvSeq) => {
    try {
      const query = [{ DelvSeq: delvSeq }]
      const masterResponse = await GetMasterQuery(query)

      if (masterResponse.data.success) {
        const data = masterResponse.data.data || []
        if (data) {
          setFromDate(dayjs())
          setBizUnit(data[0].BizUnit)
          setPurTypeName(data[0].SMImpType)
          setEmpName(data[0].EmpName)
          setEmpSeq(data[0].EmpSeq)
          setDeptName(data[0].DeptName)
          setDeptSeq(data[0].DeptSeq)
          setCurrName(data[0].CurrName)
          setCurrSeq(data[0].CurrSeq)
          setBasicAmt(data[0].BasicAmt)
          setExRate(data[0].ExRate)
          setCustName(data[0].CustName)
          setCustSeq(data[0].CustSeq)
          setWhSeq(data[0].WHSeq)
          setWhName(data[0].WHName)
          setDelvSeq(data[0].DelvSeq)
          setDelvMngNo(data[0].DelvMngNo)
          setDelvNo(data[0].DelvNo)
          setRemark(data[0].Remark)
        }
        setIsAPISuccess(true)
      } else {
        setIsAPISuccess(true)
      }
    } catch (error) {
      setIsAPISuccess(true)
    } finally {
      setIsAPISuccess(true)
    }
  }

  const fetchSheetQuery = async (delvSeq) => {
    try {
      if (loadingBarRef.current) {
        loadingBarRef.current.continuousStart()
      }
      const query = [{ DelvSeq: delvSeq }]
      const sheetResponse = await GetSheetQuery(query)

      if (sheetResponse.data.success) {
        const fetchedData = sheetResponse.data.data || []
        setGridData(fetchedData)
        setNumRows(fetchedData.length)
        setIsAPISuccess(true)
        if (loadingBarRef.current) {
          loadingBarRef.current.complete()
        }
      } else {
        setGridData([])
        setNumRows(0)
        setIsAPISuccess(true)
        if (loadingBarRef.current) {
          loadingBarRef.current.complete()
          message.error('Có lỗi xảy ra khi tải dữ liệu.')
        }
      }
    } catch (error) {
      setGridData([])
      setNumRows(0)
      setIsAPISuccess(true)
      if (loadingBarRef.current) {
        loadingBarRef.current.complete()
        message.error('Có lỗi xảy ra khi tải dữ liệu.')
      }
    } finally {
      if (loadingBarRef.current) {
        loadingBarRef.current.complete()
      }
      setIsAPISuccess(true)
    }
  }

  const fetchCodeHelpData = useCallback(async () => {
    setLoading(true)
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
        codeHelpPurTypeName,
        codeHelpWarehouse,
        codeHelpDeptName,
        codeHelpUserName,
        codeHelpCustName,
        codeHelpExrateCurr,
      ] = await Promise.all([
        GetCodeHelpCombo('', 6, 10003, 1, '%', '', '', '', ''),
        GetCodeHelpCombo('', 6, 19998, 1, '%', '8008', '1004', '1', ''),
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
        GetCodeHelp(
          10005,
          '',
          formatDate(fromDate),
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
      ])

      setDataBizUnit(codeHelpBizUnit?.data || [])
      setDataPurTypeName(codeHelpPurTypeName?.data || [])
      setDataWarehouse(codeHelpWarehouse?.data || [])
      setDataDeptName(codeHelpDeptName?.data || [])
      setDataUserName(codeHelpUserName?.data || [])
      setDataCustName(codeHelpCustName?.data || [])
      setDataCurrName(codeHelpExrateCurr?.data || [])
    } catch (error) {
      setDataBizUnit([])
      setDataPurTypeName([])
      setDataWarehouse([])
      setDataDeptName([])
      setDataUserName([])
      setDataCustName([])
      setDataCurrName([])
    } finally {
      setLoading(false)
      if (loadingBarRef.current) {
        loadingBarRef.current.complete()
      }
      controllers.current.fetchCodeHelpController = null
    }
  }, [bizUnit, fromDate])

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

  //Sheet
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

  const getSelectedRowsC = () => {
    const selectedRows = selectionC.rows.items
    let rows = []
    selectedRows.forEach((range) => {
      const start = range[0]
      const end = range[1] - 1

      for (let i = start; i <= end; i++) {
        if (gridDataC[i]) {
          gridDataC[i]['IdxNo'] = i + 1
          rows.push(gridDataC[i])
        }
      }
    })

    return rows
  }

  const handleRowAppend = useCallback(
    (numRowsToAdd) => {
      if (canCreate === false) {
        message.warning('Bạn không có quyền thêm dữ liệu')
        return
      }
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
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  /* HOOKS KEY */
  useKeydownHandler(isCellSelected, setOpenHelp)

  const handleOnDiscard = () => {
    setIsModalWarning(false)
    setEditedRows([])
    setGridData([])
    setClickedRowData(null)
    setOnDiscard(true)
    resetTable()
  }

  const handleUploadFiles = async (fileList, formCode, delvSeq) => {
    if (fileList.length === 0) {
      return false
    }
    if (loadingBarRef.current) {
      loadingBarRef.current.continuousStart()
    }
    const formData = new FormData()
    fileList.forEach((file) => {
      formData.append('files', file.originFileObj)
    })
    formData.append('itemNoSeq', delvSeq)
    formData.append('tableName', '_TPUDelv')
    formData.append('formCode', formCode)
    const result = await uploadFilesItems(formData)
    setIsModalOpen(false)
    if (result.data.success) {
      if (loadingBarRef.current) {
        loadingBarRef.current.complete()
      }
      // const newData = result.data.data
      // setGridDataC(newData)
      // setNumRowsC(newData.length)
      fetchDataFileSeq(delvSeq, 'file')
      setFileList([])
      return true
    } else {
      message.error(result.message || 'Upload failed.')
      return false
    }
  }
  const handleSaveData = useCallback(async () => {
    if (isAPISuccess === false) {
      message.warning(
        'Đang thực hiện tác vụ khác, vui lòng kiểm tra trạng thái.',
      )
      return
    }
    if (canCreate === false) {
      message.warning('Bạn không có quyền thêm dữ liệu')
      if (loadingBarRef.current) {
        loadingBarRef.current.complete()
      }
      return
    }

    if (fromDate === '' || fromDate === null) {
      message.warning('"Ngày yêu cầu" không được để trống hoặc null!')
      return
    }
    if (bizUnit === '0' || bizUnit === '') {
      message.warning('"Đơn vị kinh doanh" không được để trống hoặc null!')
      return
    }

    if (delvMngNo === '') {
      message.warning('"Số quản lý giao hàng" không được để trống hoặc null!')
      return
    }

    if (purTypeName === '0' || purTypeName === '') {
      message.warning('"Phân loại mua hàng" không được để trống hoặc null!')
      return
    }
    if (currSeq === '0' || currSeq === '') {
      message.warning('"Tiền tệ" không được để trống hoặc null!')
      return
    }
    if (exRate === '0' || exRate === '') {
      message.warning('"Tỷ giá" không được để trống hoặc null!')
      return
    }
    if (empSeq === '0' || empSeq === '') {
      message.warning('"Người phụ trách" không được để trống hoặc null!')
      return
    }
    if (deptSeq === '0' || deptSeq === '') {
      message.warning('"Bộ phận yêu cầu" không được để trống hoặc null!')
      return
    }
    if (custSeq === '0' || custSeq === '') {
      message.warning('"Khách hàng" không được để trống hoặc null!')
      return
    }

    if (whSeq === '0' || whSeq === '') {
      message.warning('"Kho nhập kho" không được để trống hoặc null!')
      return
    }

    const dataMaster = [
      {
        DelvSeq: delvSeq,
        DelvNo: delvNo,
        DelvDate: fromDate ? formatDate(fromDate) : '',
        BizUnit: bizUnit,
        CurrSeq: currSeq,
        CurrName: currName,
        ExRate: exRate,
        DeptSeq: deptSeq,
        DeptName: deptName,
        WHSeq: whSeq,
        WHName: whName,
        CustSeq: custSeq,
        CustName: custName,
        EmpSeq: empSeq,
        EmpName: empName,
        Remark: remark,
        DelvMngNo: delvMngNo,
        SMImpType: purTypeName,
        POSeq: pOSeq,
      },
    ]

    const columnsA = [
      'Status',
      'IdxNo',
      'Id',
      'POSeq',
      'POSerl',
      'DelvSeq',
      'DelvSerl',
      'ItemName',
      'ItemNo',
      'Spec',
      'ItemSeq',
      'UnitName',
      'UnitSeq',
      'Price',
      'POQty',
      'Qty',
      'CurAmt',
      'POAmt',
      'IsVAT',
      'VATRate',
      'CurVAT',
      'TotCurAmt',
      'DomPrice',
      'DomAmt',
      'DomVAT',
      'TotDomAmt',
      'Remark',
      'Memo1',
      'Memo2',
      'Memo3',
    ]

    const validEntries = filterValidEntries()
    setCount(validEntries.length)
    const lastEntry = findLastEntry(validEntries)
    if (lastWordEntryRef.current?.Id !== lastEntry?.Id) {
      lastWordEntryRef.current = lastEntry
    }
    const missingIds = findMissingIds(lastEntry)
    setEmptyWordIds(missingIds)

    const dataSheetAUD = filterAndSelectColumnsAUD(gridData, columnsA)
    if (!validateColumns(dataSheetAUD, ['Qty'])) {
      message.warning('Cột "Số lượng yêu cầu" không được để trống hoặc null!')
      return
    }
    if (!validateColumns(dataSheetAUD, ['Price'])) {
      message.warning('Cột "Đơn giá" không được để trống hoặc null!')
      return
    }

    togglePageInteraction(true)
    setIsAPISuccess(false)
    if (loadingBarRef.current) {
      loadingBarRef.current.continuousStart()
    }
    try {
      const promises = []
      promises.push(PostAUD(dataMaster, dataSheetAUD))
      const results = await Promise.all(promises)
      const updateGridData = (newData) => {
        setGridData((prevGridData) => {
          const updatedGridData = prevGridData.map((item) => {
            const matchingData = newData.find(
              (data) => data.IDX_NO === item.IdxNo,
            )

            if (matchingData) {
              return matchingData
            }
            return item
          })

          return updatedGridData
        })
      }

      if (results[0].data.success) {
        const newData = results[0].data.data
        togglePageInteraction(false)
        setIsAPISuccess(true)
        if (loadingBarRef.current) {
          loadingBarRef.current.complete()
          message.success('Lưu dữ liệu thành công!')
        }
        setIsSent(false)
        setDelvSeq(newData[0].DelvSeq)
        setDelvNo(newData[0].DelvNo)
        setEditedRows([])
        updateGridData(newData)
        resetTable()
        return newData[0].DelvSeq
      } else {
        togglePageInteraction(false)
        setIsAPISuccess(true)
        setIsAPISuccess(true)
        setIsSent(false)
        setDataError(results[0].data.errors)
        setIsModalVisible(true)
        if (loadingBarRef.current) {
          loadingBarRef.current.complete()
          message.error('Có lỗi xảy ra khi lưu dữ liệu')
        }
        return null
      }
    } catch (error) {
      togglePageInteraction(false)
      setIsAPISuccess(true)
      setIsSent(false)
      if (loadingBarRef.current) {
        loadingBarRef.current.complete()
        message.error('Có lỗi xảy ra khi lưu dữ liệu')
      }
      return null
    }
  }, [
    gridData,
    pOSeq,
    delvNo,
    delvMngNo,
    currName,
    currSeq,
    exRate,
    purTypeName,
    delvSeq,
    fromDate,
    bizUnit,
    deptSeq,
    deptName,
    whSeq,
    whName,
    custSeq,
    custName,
    empSeq,
    empName,
    remark,
    isAPISuccess,
    canCreate,
  ])

  const handleSaveAll = async () => {
    try {
      const newDelvSeq = await handleSaveData()
      if (newDelvSeq && newDelvSeq !== '0') {
        const saveB = await handleUploadFiles(fileList, 'file', newDelvSeq)
        if (!saveB) {
          console.log('Upload failed')
        }
      } else {
        console.log('Save A failed')
      }
    } catch (error) {
      console.log('Error saving', error)
    } finally {
    }
  }

  const handleDeleteDataSheet = useCallback(
    (e) => {
      setModalOpen(false)
      if (isAPISuccess === false) {
        message.warning(
          'Đang thực hiện tác vụ khác, vui lòng kiểm tra trạng thái.',
        )
        return
      }
      if (canDelete === false) {
        message.warning('Bạn không có quyền xóa dữ liệu')
        return
      }

      const dataMaster = [
        {
          DelvSeq: delvSeq,
          DelvNo: delvNo,
          DelvDate: fromDate ? formatDate(fromDate) : '',
          BizUnit: bizUnit,
          CurrSeq: currSeq,
          CurrName: currName,
          ExRate: exRate,
          DeptSeq: deptSeq,
          DeptName: deptName,
          WHSeq: whSeq,
          WHName: whName,
          CustSeq: custSeq,
          CustName: custName,
          EmpSeq: empSeq,
          EmpName: empName,
          Remark: remark,
          DelvMngNo: delvMngNo,
          SMImpType: purTypeName,
        },
      ]

      const selectedRows = getSelectedRows()

      const selectedRowsC = getSelectedRowsC()
      const idsWithStatusD = selectedRows
        .filter(
          (row) => !row.Status || row.Status === 'U' || row.Status === 'D',
        )
        .map((row) => {
          row.Status = 'D'
          return row
        })

      const rowsWithStatusA = selectedRows.filter((row) => row.Status === 'A')

      const idsWithStatusFileD = selectedRowsC
        .filter(
          (row) => !row.Status || row.Status === 'U' || row.Status === 'D',
        )
        .map((row) => {
          row.Status = 'D'
          return row
        })

      const rowsWithStatusFileA = selectedRowsC.filter(
        (row) => row.Status === 'A',
      )

      if (
        idsWithStatusD.length === 0 &&
        rowsWithStatusA.length === 0 &&
        idsWithStatusFileD.length === 0 &&
        rowsWithStatusFileA.length === 0
      ) {
        message.warning('Vui lòng chọn các mục cần xóa!')
        return
      }
      if (idsWithStatusD.length > 0) {
        setIsDeleting(true)
        togglePageInteraction(true)
        setIsAPISuccess(false)
        if (loadingBarRef.current) {
          loadingBarRef.current.continuousStart()
        }
        PostSheetDelete(dataMaster, idsWithStatusD)
          .then((response) => {
            message.destroy()
            if (response.data.success) {
              const idsWithStatusDList = idsWithStatusD.map((row) => row.IdxNo)
              const remainingRows = gridData.filter(
                (row) => !idsWithStatusDList.includes(row.IdxNo),
              )
              const updatedEmptyData = updateIndexNo(remainingRows)
              setGridData(updatedEmptyData)
              setNumRows(remainingRows.length)
              resetTable()
              togglePageInteraction(false)
              setIsAPISuccess(true)
              if (loadingBarRef.current) {
                loadingBarRef.current.complete()
                message.success('Xóa thành công!')
              }
            } else {
              togglePageInteraction(false)
              setDataError(response.data.errors)
              setIsAPISuccess(true)
              setIsModalVisible(true)
              if (loadingBarRef.current) {
                loadingBarRef.current.complete()
                message.error(response.data.message || 'Xóa thất bại!')
              }
            }
          })
          .catch((error) => {
            togglePageInteraction(false)
            setIsAPISuccess(true)
            if (loadingBarRef.current) {
              loadingBarRef.current.complete()
              message.error('Có lỗi xảy ra khi xóa!')
            }
          })
          .finally(() => {
            togglePageInteraction(false)
            setIsAPISuccess(true)
            if (loadingBarRef.current) {
              loadingBarRef.current.complete()
            }
            setIsDeleting(false)
          })
      }

      if (rowsWithStatusA.length > 0) {
        const idsWithStatusA = rowsWithStatusA.map((row) => row.IdxNo)
        const remainingRows = gridData.filter(
          (row) => !idsWithStatusA.includes(row.IdxNo),
        )
        setGridData(remainingRows)
        setNumRows(remainingRows.length)
        resetTable()
      }

      if (idsWithStatusFileD.length > 0) {
        togglePageInteraction(true)
        setIsAPISuccess(false)
        if (loadingBarRef.current) {
          loadingBarRef.current.continuousStart()
        }
        const idsWithStatusFileDIdSeq = idsWithStatusFileD.map(
          (row) => row.IdSeq,
        )
        PostDFilesItems(idsWithStatusFileDIdSeq)
          .then((result) => {
            if (result.success) {
              const updatedGridDataC = gridDataC.filter(
                (item) => !idsWithStatusFileDIdSeq.includes(item.IdSeq),
              )
              setGridDataC(updatedGridDataC)
              setNumRowsC(updatedGridDataC.length)
              setFileList([])
              resetTable()
              togglePageInteraction(false)
              setIsAPISuccess(true)
              if (loadingBarRef.current) {
                loadingBarRef.current.complete()
                message.success('Xóa thành công!')
              }
            } else {
              togglePageInteraction(false)
              setIsAPISuccess(true)
              if (loadingBarRef.current) {
                loadingBarRef.current.complete()
                message.error(response.data.message || 'Xóa thất bại!')
              }
            }
          })
          .catch((error) => {
            togglePageInteraction(false)
            setIsAPISuccess(true)
            if (loadingBarRef.current) {
              loadingBarRef.current.complete()
              message.error('Có lỗi xảy ra khi xóa!')
            }
          })
          .finally(() => {
            togglePageInteraction(false)
            setIsAPISuccess(true)
            if (loadingBarRef.current) {
              loadingBarRef.current.complete()
            }
          })
      }

      if (rowsWithStatusFileA.length > 0) {
        const idsWithStatusFileA = rowsWithStatusFileA.map((row) => row.IdxNo)
        const remainingFileRows = gridDataC.filter(
          (row) => !idsWithStatusFileA.includes(row.IdxNo),
        )
        setGridDataC(remainingFileRows)
        setNumRowsC(remainingFileRows.length)
        resetTable()
      }
    },
    [
      gridData,
      gridDataC,
      selection,
      selectionC,
      delvSeq,
      delvNo,
      delvMngNo,
      currName,
      currSeq,
      exRate,
      purTypeName,
      fromDate,
      bizUnit,
      deptSeq,
      deptName,
      whSeq,
      whName,
      custSeq,
      custName,
      empSeq,
      empName,
      remark,
      isAPISuccess,
      canDelete,
    ],
  )

  const handleDeleteDataMaster = useCallback(async () => {
    setModalMasterDeleteOpen(false)
    if (isAPISuccess === false) {
      message.warning(
        'Đang thực hiện tác vụ khác, vui lòng kiểm tra trạng thái.',
      )
      return
    }
    if (canDelete === false) {
      message.warning('Bạn không có quyền xóa dữ liệu')
      return
    }

    const dataMaster = [
      {
        DelvSeq: delvSeq,
        DelvNo: delvNo,
        DelvDate: fromDate ? formatDate(fromDate) : '',
        BizUnit: bizUnit,
        CurrSeq: currSeq,
        CurrName: currName,
        ExRate: exRate,
        DeptSeq: deptSeq,
        DeptName: deptName,
        WHSeq: whSeq,
        WHName: whName,
        CustSeq: custSeq,
        CustName: custName,
        EmpSeq: empSeq,
        EmpName: empName,
        Remark: remark,
        DelvMngNo: delvMngNo,
        SMImpType: purTypeName,
      },
    ]

    const selectedRows = gridData
    const idsWithStatusD = selectedRows
      .filter(
        (row) =>
          row.DelvSeq !== undefined &&
          row.DelvSeq !== '0' &&
          row.DelvSeq !== '',
      )
      .map((row) => {
        row.Status = 'D'
        return row
      })

    const selectedRowsC = gridDataC
    const idsWithStatusFileD = selectedRowsC
      .filter(
        (row) =>
          row.IdSeq !== undefined && row.IdSeq !== '0' && row.IdSeq !== '',
      )
      .map((row) => {
        row.Status = 'D'
        return row
      })

    if (delvSeq === '0' || delvSeq === '' || idsWithStatusD.length === 0) {
      resetTable()
      message.warning('Không có dữ liệu để xóa!')
      return
    }

    if (idsWithStatusD.length > 0) {
      setIsDeleting(true)
      togglePageInteraction(true)
      setIsAPISuccess(false)
      if (loadingBarRef.current) {
        loadingBarRef.current.continuousStart()
      }
      PostMasterDelete(dataMaster, idsWithStatusD)
        .then((response) => {
          message.destroy()
          if (response.data.success) {
            const idsWithStatusDList = idsWithStatusD.map((row) => row.IdxNo)
            const remainingRows = gridData.filter(
              (row) => !idsWithStatusDList.includes(row.IdxNo),
            )
            const updatedEmptyData = updateIndexNo(remainingRows)
            setGridData(updatedEmptyData)
            setNumRows(remainingRows.length)
            resetTable()
            if (idsWithStatusFileD.length > 0) {
              const idsWithStatusFileDIdSeq = idsWithStatusFileD.map(
                (row) => row.IdSeq,
              )
              PostDFilesItems(idsWithStatusFileDIdSeq)
            }
            togglePageInteraction(false)
            setIsAPISuccess(true)
            if (loadingBarRef.current) {
              loadingBarRef.current.complete()
              message.success('Xóa thành công!')
            }
            handleResetData()
          } else {
            togglePageInteraction(false)
            setDataError(response.data.errors)
            setIsAPISuccess(true)
            setIsModalVisible(true)
            if (loadingBarRef.current) {
              loadingBarRef.current.complete()
              message.error(response.data.message || 'Xóa thất bại!')
            }
          }
        })
        .catch((error) => {
          togglePageInteraction(false)
          setIsAPISuccess(true)
          if (loadingBarRef.current) {
            loadingBarRef.current.complete()
            message.error('Có lỗi xảy ra khi xóa!')
          }
        })
        .finally(() => {
          togglePageInteraction(false)
          setIsAPISuccess(true)
          if (loadingBarRef.current) {
            loadingBarRef.current.complete()
          }
          setIsDeleting(false)
        })
    }
  }, [
    gridData,
    gridDataC,
    selection,
    selectionC,
    delvSeq,
    delvNo,
    delvMngNo,
    currName,
    currSeq,
    exRate,
    purTypeName,
    fromDate,
    bizUnit,
    deptSeq,
    deptName,
    whSeq,
    whName,
    custSeq,
    custName,
    empSeq,
    empName,
    remark,
    isAPISuccess,
    canDelete,
  ])

  const handleResetData = useCallback(async () => {
    setIsReset(true)
    setBizUnit('0')
    setBizUnitName('')
    setFromDate(dayjs())
    setDelvNo('')
    setDeptName('')
    setDeptSeq('0')
    setWhName('')
    setWhSeq('')
    setDelvSeq('0')
    setPOSeq('0')
    setDelvMngNo('')
    setCustName('')
    setCustSeq('0')
    setEmpName('')
    setEmpSeq('0')
    setRemark('')
    setGridData([])
    setNumRows(0)
    setGridDataC([])
    setNumRowsC(0)
    resetTable()
  }, [defaultCols, defaultColsC, gridData, gridDataC])

  const uploadProps = {
    fileList,
    onChange: (info) => {
      const { file, fileList } = info
      const customizedFileList = fileList.map((file, index) => ({
        OriginalName: file.response?.filename || file.name,
        Size: file.size,
        Status: 'A',
      }))

      setGridDataC((prevData) => {
        const filteredOldData = prevData.filter((item) => item.Status !== 'A')

        const mergedData = [...filteredOldData, ...customizedFileList]
        const updatedData = updateIndexNo(mergedData)

        setNumRowsC(updatedData.length)
        return updatedData
      })

      setFileList(fileList)
    },
    beforeUpload: (file) => {
      const isAllowedType = allowedTypes.includes(file.type)
      const isSizeValid = file.size / 1024 / 1024 < 20
      if (!isAllowedType) {
        message.error(
          'Chỉ được phép tải hình ảnh, tệp Excel, Word, PDF và PowerPoint!',
        )
        return Upload.LIST_IGNORE
      }

      if (!isSizeValid) {
        message.error('Tệp tin phải nhỏ hơn 20MB!')
        return Upload.LIST_IGNORE
      }

      return false
    },
    showUploadList: false,
  }

  const items = [
    {
      key: '0',
      label: 'Thông tin giao hàng trong nước',
      children: (
        <TablePurDelv
          //onCellClicked={onCellClicked}
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
          canCreate={canCreate}
          canEdit={canEdit}
          exRate={exRate}
          basicAmt={basicAmt}
        />
      ),
    },
    {
      key: '1',
      label: 'Quản lý tệp tin đính kèm',
      children: (
        <TableUploadFileOrdPO
          uploadProps={uploadProps}
          setSelection={setSelectionC}
          selection={selectionC}
          setAddedRows={setAddedRowsC}
          addedRows={addedRowsC}
          numRows={numRowsC}
          setGridData={setGridDataC}
          gridData={gridDataC}
          setNumRows={setNumRowsC}
          setCols={setColsC}
          cols={colsC}
          defaultCols={defaultColsC}
          canEdit={canEdit}
          dataSub={dataSub}
        />
      ),
    },
  ]

  return (
    <>
      <Helmet>
        <title>ITM - {t('Nhập giao hàng trong nước')}</title>
      </Helmet>
      <TopLoadingBar color="blue" height={2} ref={loadingBarRef} />
      <div
        className={`bg-slate-50 p-3 h-full overflow-hidden relative app-content  `}
      >
        <div className="flex flex-col gap-4 md:grid md:grid-cols-4 md:grid-rows-[auto_1fr] md:gap-4 h-full">
          <div className="col-start-1 col-end-5 row-start-1 w-full rounded-lg ">
            <div className="flex items-center justify-between mb-2">
              <Title level={4} className="mt-2 uppercase opacity-85 ">
                {t('Nhập giao hàng trong nước')}
              </Title>
              <PurDelvActions
                setModalOpen={setModalOpen}
                setModalMasterDeleteOpen={setModalMasterDeleteOpen}
                handleSaveData={handleSaveAll}
              />
            </div>
            <details
              className="group p-2 [&_summary::-webkit-details-marker]:hidden border rounded-lg bg-white"
              open
            >
              <summary className="flex cursor-pointer items-center justify-between gap-1.5 text-gray-900">
                <h2 className="text-xs font-medium flex items-center gap-2 text-blue-600 uppercase">
                  <BlockOutlined />
                  {t('Master Data')}
                </h2>
                <span className="relative size-5 shrink-0">
                  <ArrowIcon />
                </span>
              </summary>
              <div className="flex p-2 gap-4">
                <PurDelvQuery
                  fromDate={fromDate}
                  setFromDate={setFromDate}
                  bizUnit={bizUnit}
                  dataBizUnit={dataBizUnit}
                  setBizUnit={setBizUnit}
                  setBizUnitName={setBizUnitName}
                  purTypeName={purTypeName}
                  dataPurTypeName={dataPurTypeName}
                  setPurTypeName={setPurTypeName}
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
                  currName={currName}
                  setCurrName={setCurrName}
                  setCurrSeq={setCurrSeq}
                  dataCurrName={dataCurrName}
                  exRate={exRate}
                  setExRate={setExRate}
                  basicAmt={basicAmt}
                  setBasicAmt={setBasicAmt}
                  delvNo={delvNo}
                  setDelvNo={setDelvNo}
                  delvMngNo={delvMngNo}
                  setDelvMngNo={setDelvMngNo}
                  remark={remark}
                  setRemark={setRemark}
                  isReset={isReset}
                  setIsReset={setIsReset}
                />
              </div>
            </details>
          </div>
          <div className="col-start-1 flex gap-3 col-end-5 row-start-2 w-full     rounded-lg  overflow-hidden">
            <div className="w-full gap-1 h-full flex items-center justify-center">
              {/* <div className="w-full h-full flex flex-col border bg-white rounded-lg "> */}
              <div className="h-full w-full flex border-t border bg-white rounded-lg">
                <Menu
                  onClick={handleMenuClick}
                  selectedKeys={[current]}
                  mode="vertical"
                  style={menuStyle}
                >
                  {items.map((item) => (
                    <Menu.Item key={item.key} icon={item.icon}>
                      <span className="text-xs">{item.label}</span>
                    </Menu.Item>
                  ))}
                </Menu>

                <div className="col-start-1 col-end-5 row-start-2 w-full rounded-lg h-full">
                  {items.find((item) => item.key === current)?.children}
                </div>
              </div>
              {/* </div> */}
            </div>
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
        confirm={handleDeleteDataSheet}
      />
      <ModalMasterDelete
        modalOpen={modalMasterDeleteOpen}
        setModalOpen={setModalMasterDeleteOpen}
        confirm={handleDeleteDataMaster}
      />

      <WarningModal
        setIsModalVisible={setIsModalWarning}
        handleOnDiscard={handleOnDiscard}
        handleOnConfirm={handleSaveData}
        isModalVisible={isModalWarning}
      />
    </>
  )
}
