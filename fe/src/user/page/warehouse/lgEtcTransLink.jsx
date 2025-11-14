import { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet'
import { Input, Typography, Row, Col, message, Form, Checkbox } from 'antd'
const { Title, Text } = Typography
import {
  FilterOutlined,
  LoadingOutlined,
  BlockOutlined,
  BarcodeOutlined,
  QrcodeOutlined,
} from '@ant-design/icons'
import { ArrowIcon } from '../../components/icons'
import dayjs from 'dayjs'
import { debounce, set } from 'lodash'
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
import ModalSheetDelete from '../../components/modal/default/deleteSheet'
import ModalMasterDelete from '../../components/modal/default/deleteMaster'
import WarningModal from '../default/warningModal'
import ModalWaiting from '../../components/modal/material/modalWaiting'
import SuccessSubmit from '../default/successSubmit'
import LoadSubmit from '../default/loadSubmit'
import ModalFocus from '../default/focus'

import LGEtcTransActions from '../../components/actions/warehouse/lgEtcTransActions'
import LGEtcTransQuery from '../../components/query/warehouse/lgEtcTransQuery'
import TableLGEtcTrans from '../../components/table/warehouse/tableLGEtcTrans'
import TableLGEtcTransItem from '../../components/table/warehouse/tableLGEtcTransItem'

import { Splitter, SplitterPanel } from 'primereact/splitter'

import { GetReqSheetQuery } from '../../../features/warehouse/lgEtcTrans/getReqSheetQuery'
import { GetSheetQuery } from '../../../features/warehouse/lgEtcTrans/getSheetQuery'

import { PostQRCheck } from '../../../features/warehouse/lgEtcTrans/postQRCheck'

import { PostAUD } from '../../../features/warehouse/lgEtcTrans/postAUD'
import { PostMasterDelete } from '../../../features/warehouse/lgEtcTrans/postMasterDelete'
import { PostSheetDelete } from '../../../features/warehouse/lgEtcTrans/postSheetDelete'

import ErrorListModal from '../default/errorListModal'
import { updateIndexNo } from '../../components/sheet/js/updateIndexNo'
import TopLoadingBar from 'react-top-loading-bar'
import { togglePageInteraction } from '../../../utils/togglePageInteraction'

export default function LGEtcTransLink({
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
  const loadingBarRef = useRef(null)

  /* SOS*/
  const workerRef = useRef(null)
  const [inputCode, setInputCode] = useState(null)
  const [inputBarCode, setInputBarCode] = useState(null)
  const [inputItemNo, setInputItemNo] = useState('')
  const bufferRef = useRef('')

  const [modal2Open, setModal2Open] = useState(false)
  const [result, setResult] = useState(null)
  const [loadingSave, setLoadingSave] = useState(false)
  const [checkBoxIsStop, setCheckBoxIsStop] = useState(false)
  const [modal3Open, setModal3Open] = useState(false)
  const [modal4Open, setModal4Open] = useState(false)
  const [modal5Open, setModal5Open] = useState(false)
  const [error, setError] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [filteredData, setFilteredData] = useState(null)
  const [checkValueIsStop, setCheckValueIsStop] = useState(
    filteredData?.IsStop ? 1 : 0,
  )
  const nameFrom = ' DI CHUYỂN KHO SẢN PHẨM '

  const [localId, setLocalId] = useState(id)
  const secretKey = 'TEST_ACCESS_KEY'
  const gridRef = useRef(null)
  const userInfo = localStorage.getItem('userInfo')
  const parsedUserInfo = JSON.parse(userInfo)
  //Master
  const [totalQuantity, setTotalQuantity] = useState(0)
  const [totalProgressQty, setTotalProgressQty] = useState(0)
  const [totalScanQty, setTotalScanQty] = useState(0)
  const [totalNotProgressQty, setTotalNotProgressQty] = useState(0)
  const [totalAmount, setTotalAmount] = useState(0)
  //Item
  const [totalQuantityItem, setTotalQuantityItem] = useState(0)
  const [totalAmountItem, setTotalAmountItem] = useState(0)

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
        title: t('IsLotMng?'),
        id: 'IsLotMng',
        kind: 'Text',
        readonly: true,
        width: 70,
        hasMenu: true,
        visible: false,
        trailingRowOptions: {
          disabled: true,
        },
        icon: GridColumnIcon.HeaderBoolean,
      },
      {
        title: t('7517'),
        id: 'ReqSerl',
        kind: 'Text',
        readonly: true,
        width: 70,
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
        width: 120,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: true,
        },
        icon: GridColumnIcon.HeaderString,
      },
      {
        title: t('2359'),
        id: 'Price',
        kind: 'Text',
        readonly: true,
        width: 80,
        hasMenu: true,
        visible: false,
        trailingRowOptions: {
          disabled: true,
        },
        icon: GridColumnIcon.HeaderNumber,
      },
      {
        title: t('7516'),
        id: 'Qty',
        kind: 'Text',
        readonly: true,
        width: 100,
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
      {
        title: t('290'),
        id: 'Amt',
        kind: 'Text',
        readonly: true,
        width: 100,
        hasMenu: true,
        visible: false,
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
        title: t('SL đã di chuyển kho'),
        id: 'ProgressQty',
        kind: 'Text',
        readonly: true,
        width: 100,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          hint: '' + formatNumberCellSum(totalProgressQty),
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
        title: t('SL đang Scan'),
        id: 'ProgressingQty',
        kind: 'Text',
        readonly: true,
        width: 100,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          hint: '' + formatNumberCellSum(totalScanQty),
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
        title: t('SL còn lại'),
        id: 'NotProgressQty',
        kind: 'Text',
        readonly: true,
        width: 100,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          hint: '' + formatNumberCellSum(totalNotProgressQty),
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
        title: t('551'),
        id: 'Spec',
        kind: 'Text',
        readonly: true,
        width: 220,
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
        title: t('3039'),
        id: 'InOutReqDetailKindName',
        kind: 'Text',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: false,
        themeOverride: {
          textHeader: '#DD1144',
          bgIconHeader: '#DD1144',
          fontFamily: '',
        },
        trailingRowOptions: {
          disabled: true,
        },
        icon: GridColumnIcon.HeaderString,
      },
      {
        title: t('12557'),
        id: 'InOutReqDetailKind',
        kind: 'Text',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: false,
        trailingRowOptions: {
          disabled: true,
        },
        icon: GridColumnIcon.HeaderString,
      },
      {
        title: t('362'),
        id: 'ItemRemark',
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
        title: t('ReqSeq'),
        id: 'ReqSeq',
        kind: 'Text',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: false,
        trailingRowOptions: {
          disabled: true,
        },
        icon: GridColumnIcon.HeaderString,
      },
      {
        title: t('InOutReqType'),
        id: 'InOutReqType',
        kind: 'Text',
        readonly: true,
        width: 150,
        hasMenu: true,
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
      totalProgressQty,
      totalScanQty,
      totalNotProgressQty,
    ],
  )

  const defaultColsItem = useMemo(
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
        title: t('7517'),
        id: 'InOutSerl',
        kind: 'Text',
        readonly: false,
        width: 100,
        hasMenu: true,
        visible: false,
        trailingRowOptions: {
          disabled: true,
        },
        icon: GridColumnIcon.HeaderString,
      },
      {
        title: t('25431'),
        id: 'LotNo',
        kind: 'Text',
        readonly: true,
        width: 120,
        hasMenu: true,
        visible: true,
        // themeOverride: {
        //   textHeader: '#DD1144',
        //   bgIconHeader: '#DD1144',
        //   fontFamily: '',
        // },
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
        themeOverride: {
          textHeader: '#DD1144',
          bgIconHeader: '#DD1144',
          fontFamily: '',
        },
        trailingRowOptions: {
          disabled: true,
        },
        icon: GridColumnIcon.HeaderString,
      },
      {
        title: t('2359'),
        id: 'Price',
        kind: 'Text',
        readonly: true,
        width: 120,
        hasMenu: true,
        visible: false,
        trailingRowOptions: {
          disabled: true,
        },
        icon: GridColumnIcon.HeaderNumber,
      },
      {
        title: t('Số lượng'),
        id: 'Qty',
        kind: 'Text',
        readonly: true,
        width: 120,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          hint: '' + formatNumberCellSum(totalQuantityItem),
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
        id: 'Amt',
        kind: 'Text',
        readonly: true,
        width: 120,
        hasMenu: true,
        visible: false,
        trailingRowOptions: {
          hint: '' + formatNumberCellSum(totalAmountItem),
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
        title: t('SL Tồn kho'),
        id: 'StkQty',
        kind: 'Text',
        readonly: false,
        width: 150,
        hasMenu: true,
        visible: true,
        // themeOverride: {
        //   textHeader: '#DD1144',
        //   bgIconHeader: '#DD1144',
        //   fontFamily: '',
        // },
        trailingRowOptions: {
          disabled: true,
        },
        icon: GridColumnIcon.HeaderNumber,
      },
      {
        title: t('SL khả dụng'),
        id: 'AliQty',
        kind: 'Text',
        readonly: false,
        width: 150,
        hasMenu: true,
        visible: true,
        // themeOverride: {
        //   textHeader: '#DD1144',
        //   bgIconHeader: '#DD1144',
        //   fontFamily: '',
        // },
        trailingRowOptions: {
          disabled: true,
        },
        icon: GridColumnIcon.HeaderNumber,
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
        title: t('551'),
        id: 'Spec',
        kind: 'Text',
        readonly: true,
        width: 220,
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
        title: t('3039'),
        id: 'InOutDetailKindName',
        kind: 'Text',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: false,
        themeOverride: {
          textHeader: '#DD1144',
          bgIconHeader: '#DD1144',
          fontFamily: '',
        },
        trailingRowOptions: {
          disabled: true,
        },
        icon: GridColumnIcon.HeaderString,
      },
      {
        title: t('12557'),
        id: 'InOutDetailKind',
        kind: 'Text',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: false,
        trailingRowOptions: {
          disabled: true,
        },
        icon: GridColumnIcon.HeaderString,
      },

      {
        title: t('1899'),
        id: 'InOutKindName',
        kind: 'Text',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: false,
        themeOverride: {
          textHeader: '#DD1144',
          bgIconHeader: '#DD1144',
          fontFamily: '',
        },
        trailingRowOptions: {
          disabled: true,
        },
        icon: GridColumnIcon.HeaderString,
      },
      {
        title: t('16626'),
        id: 'InOutKind',
        kind: 'Text',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: false,
        trailingRowOptions: {
          disabled: true,
        },
        icon: GridColumnIcon.HeaderString,
      },

      {
        title: t('362'),
        id: 'InOutRemark',
        kind: 'Text',
        readonly: false,
        width: 150,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: true,
        },
        icon: GridColumnIcon.HeaderString,
      },
      {
        title: t('Barcode'),
        id: 'Barcode',
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
        title: t('InOutSeq'),
        id: 'InOutSeq',
        kind: 'Text',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: false,
        trailingRowOptions: {
          disabled: true,
        },
        icon: GridColumnIcon.HeaderString,
      },
      {
        title: t('ReqSerl'),
        id: 'ReqSerl',
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
        title: t('ReqSeq'),
        id: 'ReqSeq',
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
        title: t('ReqQty'),
        id: 'ReqQty',
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
        title: t('InOutType'),
        id: 'InOutType',
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
    ],
    [t, totalAmountItem, totalQuantityItem],
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

  const [fromDate, setFromDate] = useState(dayjs())
  const formatDate = (date) => date.format('YYYYMMDD')

  const [gridData, setGridData] = useState([])
  const [gridDataItem, setGridDataItem] = useState([])
  const dataRef = useRef(gridData) /* DATA */
  const dataRefSacenHistory = useRef(gridDataItem) /* DATA */
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMasterDeleteOpen, setModalMasterDeleteOpen] = useState(false)

  const [selection, setSelection] = useState({
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty(),
  })
  const [selectionItem, setSelectionItem] = useState({
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty(),
  })
  const [showSearch, setShowSearch] = useState(false)
  const [showSearchItem, setShowSearchItem] = useState(false)

  const [lastClickedCell, setLastClickedCell] = useState(null)
  const [lastClickedCellItem, setLastClickedCellItem] = useState(null)

  const [addedRows, setAddedRows] = useState([])
  const [addedRowsItem, setAddedRowsItem] = useState([])
  const [editedRows, setEditedRows] = useState([])
  const [editedRowsItem, setEditedRowsItem] = useState([])

  const [clickedRowData, setClickedRowData] = useState(null)
  const [clickedRowDataItem, setClickedRowDataItem] = useState(null)
  const [isMinusClicked, setIsMinusClicked] = useState(false)
  const [isMinusClickedItem, setIsMinusClickedItem] = useState(false)

  const [numRowsToAdd, setNumRowsToAdd] = useState(null)
  const [numRowsToAddItem, setNumRowsToAddItem] = useState(null)

  const [numRows, setNumRows] = useState(0)
  const [numRowsItem, setNumRowsItem] = useState(0)

  const [clickCount, setClickCount] = useState(false)
  const [clickCountItem, setClickCountItem] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSent, setIsSent] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [openHelp, setOpenHelp] = useState(false)
  const [openHelpItem, setOpenHelpItem] = useState(false)

  const [isCellSelected, setIsCellSelected] = useState(false)
  const [isCellSelectedItem, setIsCellSelectedItem] = useState(false)
  const [isCellItem, setIsCellItem] = useState(null)
  const [isCell, setIsCell] = useState(null)
  const [onSelectRow, setOnSelectRow] = useState([])
  const [onSelectRowItem, setOnSelectRowItem] = useState([])
  const [keySelectColumn, setKeySelectColumn] = useState(false)

  const [dataError, setDataError] = useState([])

  const [isDeleting, setIsDeleting] = useState(false)
  const [isReset, setIsReset] = useState(false)

  const calculateTotalQuantity = () => {
    const total = gridData.reduce((sum, item) => sum + (item.Qty || 0), 0)
    setTotalQuantity(total)
  }

  const calculateTotalProgressQty = () => {
    const total = gridData.reduce(
      (sum, item) => sum + (item.ProgressQty || 0),
      0,
    )
    setTotalProgressQty(total)
  }

  const calculateTotalScanQty = () => {
    const total = gridData.reduce(
      (sum, item) => sum + (item.ProgressingQty || 0),
      0,
    )
    setTotalScanQty(total)
  }

  const calculateTotalNotProgressQty = () => {
    const total = gridData.reduce(
      (sum, item) => sum + (item.NotProgressQty || 0),
      0,
    )
    setTotalNotProgressQty(total)
  }

  const calculateTotalAmount = () => {
    const total = gridData.reduce((sum, item) => sum + (item.Amt || 0), 0)
    setTotalAmount(total)
  }

  const calculateTotalQuantityItem = () => {
    const total = gridDataItem.reduce((sum, item) => sum + (item.Qty || 0), 0)
    setTotalQuantityItem(total)
  }

  const calculateTotalAmountItem = () => {
    const total = gridDataItem.reduce((sum, item) => sum + (item.Amt || 0), 0)
    setTotalAmountItem(total)
  }

  useEffect(() => {
    calculateTotalQuantity()
    calculateTotalAmount()
    calculateTotalProgressQty()
    calculateTotalScanQty()
    calculateTotalNotProgressQty()
    calculateTotalQuantityItem()
    calculateTotalAmountItem()
  }, [gridData, gridDataItem])

  const [cols, setCols] = useState(() =>
    loadFromLocalStorageSheet(
      'S_ERP_COLS_PAGE_ETC_TRANS',
      defaultCols.filter((col) => col.visible),
    ),
  )
  useEffect(() => {
    setCols(defaultCols.filter((col) => col.visible))
  }, [defaultCols])

  const [colsItem, setColsItem] = useState(() =>
    loadFromLocalStorageSheet(
      'S_ERP_COLS_PAGE_ETC_TRANS_ITEM',
      defaultCols.filter((col) => col.visible),
    ),
  )
  useEffect(() => {
    setColsItem(defaultColsItem.filter((col) => col.visible))
  }, [defaultColsItem])

  /* CodeHelp */
  const [bizUnit, setBizUnit] = useState('0')
  const [bizUnitName, setBizUnitName] = useState('')
  const [bizUnitTrans, setBizUnitTrans] = useState('0')
  const [bizUnitNameTrans, setBizUnitNameTrans] = useState('')
  const [typeName, setTypeName] = useState('0')
  const [typeSName, setTypeSName] = useState('')
  const [stockType, setStockType] = useState('')
  const [status, setStatus] = useState('')
  const [empName, setEmpName] = useState('')
  const [empSeq, setEmpSeq] = useState('')
  const [deptName, setDeptName] = useState('')
  const [deptSeq, setDeptSeq] = useState('0')
  const [custName, setCustName] = useState('')
  const [custSeq, setCustSeq] = useState('')
  const [reqSeq, setReqSeq] = useState('0')
  const [inOutSeq, setInOutSeq] = useState('0')
  const [inOutNo, setInOutNo] = useState('')
  const [etcReqNo, setEtcReqNo] = useState('')
  const [remark, setRemark] = useState('')
  const [isConfirm, setIsConfirm] = useState('')
  const [isStop, setIsStop] = useState('0')
  const [whNameIn, setWHNameIn] = useState('')
  const [whSeqIn, setWHSeqIn] = useState('')
  const [whNameOut, setWHNameOut] = useState('')
  const [whSeqOut, setWHSeqOut] = useState('')

  const [isAPISuccess, setIsAPISuccess] = useState(true)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isModalWarning, setIsModalWarning] = useState(false)

  const [count, setCount] = useState(0)
  const [emptyWordIds, setEmptyWordIds] = useState([])
  const lastWordEntryRef = useRef(null)
  const [clickCellName, setClickCellName] = useState([])
  const [onConfirm, setOnConfirm] = useState(false)
  const [onDiscard, setOnDiscard] = useState(false)

  const fieldsToTrack = ['ItemNo']
  const { filterValidEntries, findLastEntry, findMissingIds } =
    useDynamicFilter(gridDataItem, fieldsToTrack)

  const resetTable = () => {
    setSelection({
      columns: CompactSelection.empty(),
      rows: CompactSelection.empty(),
    })
  }

  const resetTableItem = () => {
    setSelectionItem({
      columns: CompactSelection.empty(),
      rows: CompactSelection.empty(),
    })
  }
  useEffect(() => {
    if (parsedUserInfo && parsedUserInfo.UserName) {
      setEmpName(parsedUserInfo.UserName)
      setEmpSeq(parsedUserInfo.EmpSeq)
    }
  }, [])

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
    cancelAllRequests()
    message.destroy()
  }, [])
  useEffect(() => {
    if (id) {
      const data = decryptData(id)
      setReqSeq(data.ReqSeq)
      setInOutSeq(data.InOutSeq)
      if (data) {
        fetchSheetQuery(data.ReqSeq, data.InOutSeq)
      }
    }
  }, [id])

  const handleChange = (e) => {
    setInputBarCode(e.target.value)
  }
  const handleEnter = () => {
    if (inputBarCode) {
      handleCheckBarcode(inputBarCode)
    }
  }
  const onChange = (e) => {
    setCheckBoxIsStop(e.target.checked)
    const value = e.target.checked ? 1 : 0
    setCheckValueIsStop(value)
  }

  const addToScanHistory = useCallback((dataResSuccess, callback) => {
    const newLotNo = dataResSuccess?.LotNo?.trim().toLowerCase()
    const newBarcode = dataResSuccess?.Barcode?.trim().toLowerCase()

    setGridDataItem((prevHistory) => {
      const newItem = {
        Status: 'A',
        InOutSerl: '0',
        LotNo: dataResSuccess?.LotNo,
        ItemNo: dataResSuccess?.ItemNo,
        Price: dataResSuccess?.Price,
        Qty: dataResSuccess?.Qty,
        Amt: dataResSuccess?.Amt,
        StkQty: dataResSuccess?.StkQty,
        AliQty: dataResSuccess?.AliQty,
        ItemName: dataResSuccess?.ItemName,
        Spec: dataResSuccess?.Spec,
        ItemSeq: dataResSuccess?.ItemSeq,
        UnitSeq: dataResSuccess?.UnitSeq,
        UnitName: dataResSuccess?.UnitName,
        InOutDetailKindName: dataResSuccess?.InOutDetailKindName,
        InOutDetailKind: dataResSuccess?.InOutDetailKind,
        InOutKindName: dataResSuccess?.InOutKindName,
        InOutKind: dataResSuccess?.InOutKind,
        InOutRemark: dataResSuccess?.InOutRemark,
        Barcode: dataResSuccess?.Barcode,
        InOutSeq: '0',
        ReqSerl: dataResSuccess?.ReqSerl,
        InOutType: dataResSuccess?.InOutReqType,
        ReqQty: dataResSuccess?.ReqQty,
        ReqSeq: dataResSuccess?.InOutReqSeq,
      }
      const updatedHistory = [...prevHistory, newItem] // Thêm item mới vào mảng
      const updatedHistoryWithIdxNo = updatedHistory.map((item, index) => ({
        // Thêm IdxNo
        ...item,
        IdxNo: index + 1,
      }))

      callback()
      return updatedHistoryWithIdxNo // Trả về mảng đã cập nhật IdxNo
    })
  }, [])

  const handleCheckBarcode = useCallback((barcode) => {
    const currentTableData = dataRef.current
    const currentScanHistory = dataRefSacenHistory.current
    workerRef.current.postMessage({
      type: 'CHECK_BARCODE',
      barcode,
      tableData: currentTableData,
      tableScanHistory: currentScanHistory,
    })
  }, [])

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'Enter' && bufferRef.current.trim()) {
        const barcode = bufferRef.current
          .trim()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-zA-Z0-9/.\-*%_]/g, '')

        if (inputBarCode === '' || inputBarCode === null) {
          handleCheckBarcode(barcode)
        } else {
          handleCheckBarcode(inputBarCode)
        }
        // if (barcode === inputBarCode && inputBarCode !== '') {
        //   handleCheckBarcode(barcode)
        // } else {
        //   handleCheckBarcode(barcode)
        // }
        //setInputCode(barcode)
        bufferRef.current = ''
      } else if (e.key.length === 1) {
        const normalizedKey = e.key
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
        if (/^[a-zA-Z0-9/.\-*%_]{1}$/.test(normalizedKey)) {
          bufferRef.current += normalizedKey
        }
      }
    }

    const handleFocus = () => setStatus(true)

    const handleBlur = () => setStatus(false)

    const handleClick = () => setStatus(true)

    window.addEventListener('keypress', handleKeyPress)
    window.addEventListener('focus', handleFocus)
    window.addEventListener('blur', handleBlur)
    document.addEventListener('click', handleClick)

    return () => {
      window.removeEventListener('keypress', handleKeyPress)
      window.removeEventListener('focus', handleFocus)
      window.removeEventListener('blur', handleBlur)
      document.removeEventListener('click', handleClick)
    }
  }, [inputBarCode])

  const debouncedCheckBarcode = useCallback(
    debounce(async (formData, resultMessage) => {
      if (loadingBarRef.current) {
        loadingBarRef.current.continuousStart()
      }
      const resSuccess = await PostQRCheck(formData)
      if (resSuccess.data.success) {
        const dataResSuccess = resSuccess.data.data[0]
        if (loadingBarRef.current) {
          loadingBarRef.current.complete()
          message.success(resultMessage)
        }
        setInputBarCode(null)
        setInputCode(null)
        setIsModalVisible(false)
        addToScanHistory(dataResSuccess, () => {
          setGridData((prevData) =>
            prevData.map((item) =>
              item.ItemNo === formData[0].ItemNo &&
              item.ReqSerl === formData[0].InOutReqItemSerl
                ? {
                    ...item,
                    ProgressingQty:
                      (item?.ProgressingQty || 0) + formData[0].Qty,
                    NotProgressQty:
                      (item?.NotProgressQty || 0) - formData[0].Qty,
                  }
                : item,
            ),
          )
        })
      } else {
        if (loadingBarRef.current) {
          loadingBarRef.current.complete()
          setDataError(resSuccess.data.errors)
        }
        setIsModalVisible(true)
      }
    }, 100),
    [],
  )

  useEffect(() => {
    workerRef.current = new Worker(
      new URL('../../../workers/workerEtcTrans.js', import.meta.url),
    )

    workerRef.current.onmessage = async (event) => {
      const { success, message: resultMessage, data: resultData } = event.data
      if (success) {
        if (resultData) {
          const {
            itemNo,
            qty,
            lot,
            dc,
            reel,
            barcode,
            ItemSeq,
            UnitSeq,
            UnitName,
            ReqSeq,
            ReqSerl,
            InOutDetailKind,
            InOutDetailKindName,
            Price,
            Amt,
            InOutReqType,
            ReqQty,
            InWHSeq,
            OutWHSeq,
            ScanQty,
          } = resultData

          const formData = [
            {
              InOutReqSeq: ReqSeq,
              InOutReqItemSerl: ReqSerl,
              ItemSeq: ItemSeq,
              UnitSeq: UnitSeq,
              UnitName: UnitName,
              ItemNo: itemNo,
              LotNo: lot,
              Qty: qty,
              DateCode: dc,
              ReelNo: reel,
              Barcode: barcode,
              InOutDetailKind: InOutDetailKind,
              InOutDetailKindName: InOutDetailKindName,
              Price: Price,
              Amt: Amt,
              InOutReqType: InOutReqType,
              ReqQty: ReqQty,
              InWHSeq: InWHSeq,
              OutWHSeq: OutWHSeq,
              ScanQty: ScanQty,
            },
          ]
          setInputItemNo(itemNo)
          debouncedCheckBarcode(formData, resultMessage)
        }
      } else {
        setModal2Open(true)
        setError(resultMessage)
        setInputBarCode('')
      }
    }
    return () => {
      workerRef.current.terminate()
      debouncedCheckBarcode.cancel()
    }
  }, [filteredData, debouncedCheckBarcode])

  useEffect(() => {
    dataRef.current = gridData
    dataRefSacenHistory.current = gridDataItem
    setNumRowsItem(gridDataItem.length)
  }, [gridData, gridDataItem])

  const fetchSheetQuery = async (reqSeq, inOutSeq) => {
    try {
      if (loadingBarRef.current) {
        loadingBarRef.current.continuousStart()
      }
      const etcOutResponse = await GetReqSheetQuery(reqSeq)
      const inOutResponse = await GetSheetQuery(inOutSeq)

      if (etcOutResponse?.success && inOutResponse?.success) {
        const fetchedData = etcOutResponse.data.data || []
        const fetchedDataItem = inOutResponse.data.data || []

        if (fetchedData.length > 0) {
          setGridData(fetchedData)
          setFilteredData(fetchedData)
          setNumRows(fetchedData.length)
        }

        if (fetchedDataItem.length > 0) {
          setBizUnit(fetchedDataItem[0].BizUnit)
          setBizUnitName(fetchedDataItem[0].BizUnitName)
          setBizUnitTrans(fetchedDataItem[0].ReqBizUnit)
          setBizUnitNameTrans(fetchedDataItem[0].ReqBizUnitName)
          setFromDate(dayjs(fetchedDataItem[0].InOutDate))
          setTypeName(fetchedDataItem[0].InOutType)
          setTypeSName(fetchedDataItem[0].InOutTypeName)
          setDeptName(fetchedDataItem[0].DeptName)
          setDeptSeq(fetchedDataItem[0].DeptSeq)
          setReqSeq(fetchedDataItem[0].ReqSeq)
          setEtcReqNo(fetchedDataItem[0].ReqNo)
          setCustName(fetchedDataItem[0].CustName)
          setCustSeq(fetchedDataItem[0].CustSeq)
          setWHSeqIn(fetchedDataItem[0].InWHSeq)
          setWHNameIn(fetchedDataItem[0].InWHName)
          setWHSeqOut(fetchedDataItem[0].OutWHSeq)
          setWHNameOut(fetchedDataItem[0].OutWHName)
          setRemark(fetchedDataItem[0].MRemark)
          setInOutNo(fetchedDataItem[0].InOutNo)
          setInOutSeq(fetchedDataItem[0].InOutSeq)
          setGridDataItem(fetchedDataItem)
          setNumRowsItem(fetchedDataItem.length)
        }
        setIsAPISuccess(true)
        if (loadingBarRef.current) {
          loadingBarRef.current.complete()
        }
      } else {
        const emptyData = generateEmptyData(0, defaultCols)
        setGridData(emptyData)
        setNumRows(emptyData.length)
        const emptyDataItem = generateEmptyData(0, defaultColsItem)
        setGridDataItem(emptyDataItem)
        setNumRowsItem(emptyDataItem.length)
        setIsAPISuccess(true)
        if (loadingBarRef.current) {
          loadingBarRef.current.complete()
          message.error('Có lỗi xảy ra khi tải dữ liệu.')
        }
      }
    } catch (error) {
      const emptyData = generateEmptyData(0, defaultCols)
      setGridData(emptyData)
      setNumRows(emptyData.length)
      const emptyDataItem = generateEmptyData(0, defaultColsItem)
      setGridDataItem(emptyDataItem)
      setNumRowsItem(emptyDataItem.length)
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

  const getSelectedRowsItem = () => {
    const selectedRowsItem = selectionItem.rows.items
    let rows = []
    selectedRowsItem.forEach((range) => {
      const start = range[0]
      const end = range[1] - 1

      for (let i = start; i <= end; i++) {
        if (gridDataItem[i]) {
          gridDataItem[i]['IdxNo'] = i + 1
          rows.push(gridDataItem[i])
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

  const handleRowAppendItem = useCallback(
    (numRowsToAdd) => {
      if (canCreate === false) {
        message.warning('Bạn không có quyền thêm dữ liệu')
        return
      }
      //onRowAppended(cols, setGridData, setNumRows, setAddedRows, numRowsToAdd)
    },
    [
      colsItem,
      setGridDataItem,
      setNumRowsItem,
      setAddedRowsItem,
      numRowsToAddItem,
    ],
  )

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault()
        setShowSearchItem(true)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  /* HOOKS KEY */
  useKeydownHandler(isCellSelected, setOpenHelp)
  useKeydownHandler(isCellSelectedItem, setOpenHelpItem)

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
  }

  const onCellClickedItem = (cell, event) => {
    if (cell.length >= 2 && cell[0] === 1) {
      setIsCellSelectedItem(true)
    } else {
      setIsCellSelectedItem(false)
      setIsMinusClickedItem(false)
      setLastClickedCellItem(null)
      setClickedRowDataItem(null)
    }

    if (
      lastClickedCellItem &&
      lastClickedCellItem[0] === cell[0] &&
      lastClickedCellItem[1] === cell[1]
    ) {
      setIsCellSelectedItem(false)
      setIsMinusClickedItem(false)
      setLastClickedCellItem(null)
      setClickedRowDataItem(null)
      return
    }

    let rowIndex

    if (cell[0] !== -1) {
      return
    }

    if (cell[0] === -1) {
      rowIndex = cell[1]
      setIsMinusClickedItem(true)
    } else {
      rowIndex = cell[0]
      setIsMinusClickedItem(false)
    }

    if (rowIndex >= 0 && rowIndex < gridDataItem.length) {
      const rowDataItem = gridDataItem[rowIndex]
      setClickedRowDataItem(rowDataItem)
      setLastClickedCellItem(cell)
    }
  }

  const handleOnDiscard = () => {
    setIsModalWarning(false)
    setEditedRowsItem([])
    setGridDataItem([])
    setClickedRowDataItem(null)
    setOnDiscard(true)
    resetTableItem()
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

    if (typeName === '0' || typeName === '') {
      message.warning('"Phân loại sản phẩm" không được để trống hoặc null!')
      return
    }

    if (whSeqOut === '0' || whSeqOut === '') {
      message.warning('"Kho xuất kho" không được để trống hoặc null!')
      return
    }

    const dataMaster = [
      {
        InOutSeq: inOutSeq,
        InOutNo: inOutNo,
        InOutType: typeName,
        InOutDate: fromDate ? formatDate(fromDate) : '',
        BizUnit: bizUnit,
        BizUnitName: bizUnitName,
        TransBizUnit: bizUnitTrans,
        TransBizUnitName: bizUnitNameTrans,
        DeptSeq: deptSeq,
        DeptName: deptName,
        InWHSeq: whSeqIn,
        InWHName: whNameIn,
        OutWHSeq: whSeqOut,
        OutWHName: whNameOut,
        CustSeq: custSeq,
        CustName: custName,
        EmpSeq: empSeq,
        EmpName: empName,
        Remark: remark,
      },
    ]

    const columnsA = [
      'Status',
      'InOutSeq',
      'InOutSerl',
      'ItemName',
      'ItemNo',
      'Spec',
      'ItemSeq',
      'UnitName',
      'UnitSeq',
      'Price',
      'Qty',
      'Amt',
      'InOutDetailKindName',
      'InOutDetailKind',
      'Remark',
      'LotNo',
      'StkQty',
      'AliQty',
      'InOutType',
      'InOutRemark',
      'ReqSerl',
      'ReqSeq',
      'ReqQty',
      'IdxNo',
    ]

    const validEntries = filterValidEntries()
    setCount(validEntries.length)
    const lastEntry = findLastEntry(validEntries)
    if (lastWordEntryRef.current?.Id !== lastEntry?.Id) {
      lastWordEntryRef.current = lastEntry
    }
    const missingIds = findMissingIds(lastEntry)
    setEmptyWordIds(missingIds)

    const dataSheetAUD = filterAndSelectColumnsAUD(gridDataItem, columnsA)
    if (missingIds.length > 0) {
      message.warning(
        'Vui lòng kiểm tra lại các mục được tạo phải theo đúng thứ tự tuần tự trước khi lưu!',
      )
      return
    }
    if (!validateColumns(dataSheetAUD, ['ItemName'])) {
      message.warning('Cột "Tên sản phẩm" không được để trống hoặc null!')
      return
    }
    if (!validateColumns(dataSheetAUD, ['InOutDetailKind'])) {
      message.warning(
        'Cột "Phân loại di chuyển kho" không được để trống hoặc null!',
      )
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
        setGridDataItem((prevGridData) => {
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

      results.forEach((result, index) => {
        if (result.data.success) {
          const newData = result.data.data
          togglePageInteraction(false)
          setIsAPISuccess(true)
          if (loadingBarRef.current) {
            loadingBarRef.current.complete()
            message.success('Lưu dữ liệu thành công!')
          }
          setIsLoading(false)
          setIsSent(false)
          setInOutSeq(result.data.data[0].InOutSeq)
          setInOutNo(result.data.data[0].InOutNo)
          setEditedRows([])
          updateGridData(newData)
          resetTableItem()
          fetchSheetQuery(reqSeq)
        } else {
          message.destroy()
          setIsLoading(false)
          setIsSent(false)
          setDataError(result.data.errors)
          setIsModalVisible(true)
          togglePageInteraction(false)
          setIsAPISuccess(true)
          if (loadingBarRef.current) {
            loadingBarRef.current.complete()
            message.error('Có lỗi xảy ra khi lưu dữ liệu')
          }
        }
      })
    } catch (error) {
      togglePageInteraction(false)
      setIsAPISuccess(true)
      if (loadingBarRef.current) {
        loadingBarRef.current.complete()
        message.error(error.message || 'Có lỗi xảy ra khi lưu dữ liệu')
      }
    }
  }, [
    gridDataItem,
    inOutSeq,
    inOutNo,
    typeName,
    fromDate,
    bizUnit,
    bizUnitName,
    bizUnitTrans,
    bizUnitNameTrans,
    deptSeq,
    deptName,
    whSeqIn,
    whNameIn,
    whSeqOut,
    whNameOut,
    custSeq,
    custName,
    empSeq,
    empName,
    remark,
    isAPISuccess,
  ])

  const handleDeleteDataSheet = useCallback(
    (e) => {
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
      if (isDeleting) {
        message.warning('Đang xử lý, vui lòng chờ...')
        return
      }

      const dataMaster = [
        {
          InOutSeq: inOutSeq,
          InOutNo: inOutNo,
          InOutType: typeName,
          InOutDate: fromDate ? formatDate(fromDate) : '',
          BizUnit: bizUnit,
          BizUnitName: bizUnitName,
          TransBizUnit: bizUnitTrans,
          TransBizUnitName: bizUnitNameTrans,
          DeptSeq: deptSeq,
          DeptName: deptName,
          InWHSeq: whSeqIn,
          InWHName: whNameIn,
          OutWHSeq: whSeqOut,
          OutWHName: whNameOut,
          CustSeq: custSeq,
          CustName: custName,
          EmpSeq: empSeq,
          EmpName: empName,
          Remark: remark,
        },
      ]
      const selectedRowsItem = getSelectedRowsItem()

      const idsWithStatusD = selectedRowsItem
        .filter(
          (row) => !row.Status || row.Status === 'U' || row.Status === 'D',
        )
        .map((row) => {
          row.Status = 'D'
          return row
        })

      const rowsWithStatusA = selectedRowsItem.filter(
        (row) => row.Status === 'A',
      )
      if (idsWithStatusD.length === 0 && rowsWithStatusA.length === 0) {
        message.warning('Vui lòng chọn các mục cần xóa!')
        setModalOpen(false)
        return
      }

      if (idsWithStatusD.length > 0) {
        const selectedItems = idsWithStatusD.map(
          ({ ReqSerl, ItemNo, Qty }) => ({
            ReqSerl,
            ItemNo,
            Qty,
          }),
        )
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
              //const idsWithStatusDList = idsWithStatusD.map((row) => row.IdxNo)
              const idsWithStatusDList = idsWithStatusD
                .map((row) => row.IdxNo)
                .concat(rowsWithStatusA?.map((row) => row.IdxNo))
              const remainingRows = gridDataItem.filter(
                (row) => !idsWithStatusDList.includes(row.IdxNo),
              )
              const updatedEmptyData = updateIndexNo(remainingRows)
              setGridDataItem(updatedEmptyData)
              setNumRowsItem(remainingRows.length)
              resetTableItem()
              setModalOpen(false)
              fetchSheetQuery(reqSeq)
              togglePageInteraction(false)
              setIsAPISuccess(true)
              if (loadingBarRef.current) {
                loadingBarRef.current.complete()
                message.success('Xóa thành công!')
              }
            } else {
              setDataError(response.data.errors)
              setIsModalVisible(true)
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
            setIsDeleting(false)
          })
      } else {
        const selectedItems = rowsWithStatusA.map(
          ({ ReqSerl, ItemNo, Qty }) => ({
            ReqSerl,
            ItemNo,
            Qty,
          }),
        )

        const idsWithStatusA = rowsWithStatusA.map((row) => row.IdxNo)
        const remainingRows = gridDataItem.filter(
          (row) => !idsWithStatusA.includes(row.IdxNo),
        )

        const remainingEditedRows = editedRowsItem.filter(
          (editedRow) => !idsWithStatusA.includes(editedRow.updatedRow?.IdxNo),
        )

        setModalOpen(false)
        setIsAPISuccess(true)
        message.success('Xóa thành công!')
        setEditedRowsItem(remainingEditedRows)
        setGridDataItem(remainingRows)
        setNumRowsItem(remainingRows.length)
        resetTable()

        setGridData((prevData) =>
          prevData.map((item) => {
            const selectedItemsMatching = selectedItems.filter(
              (selected) =>
                selected.ItemNo === item.ItemNo &&
                selected.ReqSerl === item.ReqSerl,
            )
            if (selectedItemsMatching.length > 0) {
              const totalQty = selectedItemsMatching.reduce(
                (sum, selected) => sum + selected.Qty,
                0,
              )

              return {
                ...item,
                ProgressingQty: Math.max(0, item.ProgressingQty - totalQty), // Đảm bảo ProgressQty không âm
                NotProgressQty: item.NotProgressQty + totalQty,
              }
            }
            return item
          }),
        )
      }
    },
    [
      canDelete,
      gridDataItem,
      selectionItem,
      editedRowsItem,
      isDeleting,
      gridData,
      inOutSeq,
      inOutNo,
      typeName,
      fromDate,
      bizUnit,
      bizUnitName,
      bizUnitTrans,
      bizUnitNameTrans,
      deptSeq,
      deptName,
      whSeqIn,
      whNameIn,
      whSeqOut,
      whNameOut,
      custSeq,
      custName,
      empSeq,
      empName,
      remark,
      isAPISuccess,
    ],
  )

  const handleDeleteDataMaster = useCallback(
    (e) => {
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
      if (isDeleting) {
        message.warning('Đang xử lý, vui lòng chờ...')
        return
      }

      const dataMaster = [
        {
          InOutSeq: inOutSeq,
          InOutNo: inOutNo,
          InOutType: typeName,
          InOutDate: fromDate ? formatDate(fromDate) : '',
          BizUnit: bizUnit,
          BizUnitName: bizUnitName,
          TransBizUnit: bizUnitTrans,
          TransBizUnitName: bizUnitNameTrans,
          DeptSeq: deptSeq,
          DeptName: deptName,
          InWHSeq: whSeqIn,
          InWHName: whNameIn,
          OutWHSeq: whSeqOut,
          OutWHName: whNameOut,
          CustSeq: custSeq,
          CustName: custName,
          EmpSeq: empSeq,
          EmpName: empName,
          Remark: remark,
        },
      ]
      const selectedRowsItem = gridDataItem

      const idsWithStatusD = selectedRowsItem
        .filter(
          (row) => !row.Status || row.Status === 'U' || row.Status === 'D',
        )
        .map((row) => {
          row.Status = 'D'
          return row
        })

      const rowsWithStatusA = selectedRowsItem.filter(
        (row) => row.Status === 'A',
      )
      if (idsWithStatusD.length === 0 && rowsWithStatusA.length === 0) {
        message.warning('Vui lòng chọn các mục cần xóa!')
        setModalMasterDeleteOpen(false)
        return
      }

      if (idsWithStatusD.length > 0) {
        const selectedItems = idsWithStatusD.map(
          ({ ReqSerl, ItemNo, Qty }) => ({
            ReqSerl,
            ItemNo,
            Qty,
          }),
        )
        setIsDeleting(true)
        togglePageInteraction(true)
        setIsAPISuccess(false)
        if (loadingBarRef.current) {
          loadingBarRef.current.continuousStart()
        }
        PostMasterDelete(dataMaster, idsWithStatusD)
          .then((response) => {
            if (response.data.success) {
              message.destroy()
              setModalMasterDeleteOpen(false)
              const idsWithStatusDList = idsWithStatusD.map((row) => row.IdxNo)
              const remainingRows = gridDataItem.filter(
                (row) => !idsWithStatusDList.includes(row.IdxNo),
              )
              const updatedEmptyData = updateIndexNo(remainingRows)
              setGridDataItem(updatedEmptyData)
              setNumRowsItem(remainingRows.length)
              resetTableItem()
              fetchSheetQuery(reqSeq)
              setInOutNo('')
              setInOutSeq('0')
              togglePageInteraction(false)
              setIsAPISuccess(true)
              if (loadingBarRef.current) {
                loadingBarRef.current.complete()
                message.success('Xóa thành công!')
              }
            } else {
              setModalMasterDeleteOpen(false)
              setDataError(response.data.errors)
              setIsModalVisible(true)
              setIsAPISuccess(true)
              togglePageInteraction(false)
              if (loadingBarRef.current) {
                loadingBarRef.current.complete()
                message.error(response.data.message || 'Xóa thất bại!')
              }
            }
          })
          .catch((error) => {
            setModalMasterDeleteOpen(false)
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
        const selectedItems = rowsWithStatusA.map(
          ({ ReqSerl, ItemNo, Qty }) => ({
            ReqSerl,
            ItemNo,
            Qty,
          }),
        )

        const idsWithStatusA = rowsWithStatusA.map((row) => row.IdxNo)
        const remainingRows = gridDataItem.filter(
          (row) => !idsWithStatusA.includes(row.IdxNo),
        )

        const remainingEditedRows = editedRowsItem.filter(
          (editedRow) => !idsWithStatusA.includes(editedRow.updatedRow?.IdxNo),
        )

        setModalMasterDeleteOpen(false)
        setIsAPISuccess(true)
        message.success('Xóa thành công!')
        setEditedRowsItem(remainingEditedRows)
        setGridDataItem(remainingRows)
        setNumRowsItem(remainingRows.length)
        resetTable()

        setGridData((prevData) =>
          prevData.map((item) => {
            const selectedItemsMatching = selectedItems.filter(
              (selected) =>
                selected.ItemNo === item.ItemNo &&
                selected.ReqSerl === item.ReqSerl,
            )
            if (selectedItemsMatching.length > 0) {
              const totalQty = selectedItemsMatching.reduce(
                (sum, selected) => sum + selected.Qty,
                0,
              )

              return {
                ...item,
                ProgressingQty: Math.max(0, item.ProgressingQty - totalQty), // Đảm bảo ProgressQty không âm
                NotProgressQty: item.NotProgressQty + totalQty,
              }
            }
            return item
          }),
        )
      }
    },
    [
      canDelete,
      gridDataItem,
      selectionItem,
      editedRowsItem,
      isDeleting,
      gridData,
      inOutSeq,
      inOutNo,
      typeName,
      fromDate,
      bizUnit,
      bizUnitName,
      bizUnitTrans,
      bizUnitNameTrans,
      deptSeq,
      deptName,
      whSeqIn,
      whNameIn,
      whSeqOut,
      whNameOut,
      custSeq,
      custName,
      empSeq,
      empName,
      remark,
      isAPISuccess,
    ],
  )

  const handleRestSheet = useCallback(async () => {
    const emptyData = generateEmptyData(50, defaultCols)
    setGridData(emptyData)
    setNumRows(emptyData.length)
  }, [defaultCols, gridData])

  const handleResetData = useCallback(async () => {
    setIsReset(true)
    setLocalId('')
    setInOutSeq('0')
    setInOutNo('')
    const emptyData = generateEmptyData(0, defaultColsItem)
    setGridDataItem(emptyData)
    setNumRowsItem(emptyData.length)
    resetTableItem()
    fetchSheetQuery(reqSeq)
  }, [defaultColsItem, gridDataItem])

  return (
    <>
      <Helmet>
        <title>HPM - {t('Di chuyển kho sản phẩm')}</title>
      </Helmet>
      <TopLoadingBar color="blue" height={2} ref={loadingBarRef} />
      <div className="bg-slate-50 p-3  h-[calc(100vh-30px)] overflow-hidden">
        <div className="flex flex-col gap-4 md:grid md:grid-cols-4 md:grid-rows-[auto_1fr] md:gap-4 h-full">
          <div className="col-start-1 col-end-5 row-start-1 w-full rounded-lg ">
            <div className="flex items-center justify-between mb-2">
              <Title level={4} className="mt-2 uppercase opacity-85 ">
                {t('Di chuyển kho sản phẩm')}
              </Title>
              <LGEtcTransActions
                status={status}
                setModalOpen={setModalOpen}
                setModalMasterDeleteOpen={setModalMasterDeleteOpen}
                handleResetData={handleResetData}
                handleSaveData={handleSaveData}
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
                <LGEtcTransQuery
                  fromDate={fromDate}
                  setFromDate={setFromDate}
                  bizUnitName={bizUnitName}
                  bizUnitNameTrans={bizUnitNameTrans}
                  typeSName={typeSName}
                  whNameIn={whNameIn}
                  whNameOut={whNameOut}
                  custName={custName}
                  userName={empName}
                  deptName={deptName}
                  inOutNo={inOutNo}
                  remark={remark}
                  setRemark={setRemark}
                />
              </div>
            </details>
          </div>
          <div className="col-start-1 flex gap-3 col-end-5 row-start-2 w-full  h-[calc(100%-1 0px)]   rounded-lg  overflow-hidden">
            <Splitter className="w-full h-full">
              <SplitterPanel size={50} minSize={10}>
                <TableLGEtcTrans
                  onCellClicked={onCellClicked}
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
                  inputItemNo={inputItemNo}
                />
              </SplitterPanel>
              <SplitterPanel size={50} minSize={20}>
                <div className="h-14 w-full border rounded-lg bg-white mb-1 p-0">
                  <Form layout="vertical">
                    <Row className="gap-2 flex items-center">
                      <Col>
                        <QrcodeOutlined
                          style={{
                            fontSize: '42px',
                            marginTop: '-12px',
                            marginLeft: '20px',
                          }}
                        />
                        {/* <BarcodeOutlined
                          style={{
                            fontSize: '40px',
                            marginTop: '-10px',
                            marginLeft: '20px',
                          }}
                        /> */}
                      </Col>
                      <Col className="w-[50%]">
                        <Form.Item>
                          <Input
                            placeholder="Thông tin barcode sản phẩm"
                            size="middle"
                            value={inputBarCode}
                            onChange={handleChange}
                            onPressEnter={handleEnter}
                            //autoFocus={true}
                            style={{
                              fontSize: '18px',
                              fontWeight: 'bold',
                              marginTop: '10px',
                              border: '2px solid #000',
                            }}
                          />
                        </Form.Item>
                      </Col>
                      {/* <Col>
                        <Form.Item>
                          <Checkbox
                            onChange={onChange}
                            style={{
                              fontSize: '14px',
                              marginTop: '10px',
                              fontWeight: 'bold',
                            }}
                          >
                            {checkBoxIsStop ? (
                              <span className=" uppercase">Hoàn thành</span>
                            ) : (
                              <span className="uppercase">Chưa hoàn thành</span>
                            )}
                          </Checkbox>
                        </Form.Item>
                      </Col> */}
                    </Row>
                  </Form>
                </div>
                <TableLGEtcTransItem
                  onCellClicked={onCellClickedItem}
                  setSelection={setSelectionItem}
                  selection={selectionItem}
                  showSearch={showSearchItem}
                  setShowSearch={setShowSearchItem}
                  setAddedRows={setAddedRowsItem}
                  addedRows={addedRowsItem}
                  setEditedRows={setEditedRowsItem}
                  editedRows={editedRowsItem}
                  setNumRowsToAdd={setNumRowsToAddItem}
                  clickCount={clickCountItem}
                  numRowsToAdd={numRowsToAddItem}
                  numRows={numRowsItem}
                  onSelectRow={onSelectRowItem}
                  openHelp={openHelpItem}
                  setOpenHelp={setOpenHelpItem}
                  setOnSelectRow={setOnSelectRowItem}
                  setIsCellSelected={setIsCellSelectedItem}
                  isCellSelected={isCellSelectedItem}
                  setGridData={setGridDataItem}
                  gridData={gridDataItem}
                  setNumRows={setNumRowsItem}
                  setCols={setColsItem}
                  handleRowAppend={handleRowAppendItem}
                  cols={colsItem}
                  defaultCols={defaultColsItem}
                  canCreate={canCreate}
                  handleRestSheet={handleRestSheet}
                  canEdit={canEdit}
                />
              </SplitterPanel>
            </Splitter>
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
      <ModalWaiting
        modal2Open={modal2Open}
        setModal2Open={setModal2Open}
        error={error}
      />
      <LoadSubmit setModal4Open={setModal4Open} modal4Open={modal4Open} />
      <SuccessSubmit
        setModal5Open={setModal5Open}
        modal5Open={modal5Open}
        successMessage={successMessage}
      />
      <ModalFocus status={status} setStatus={setStatus} nameFrom={nameFrom} />
    </>
  )
}
