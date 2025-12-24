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
import { GetCodeHelp } from '../../../features/codeHelp/getCodeHelp'

import PurDelvInActions from '../../components/actions/purchase/purDelvInActions'
import PurDelvInQuery from '../../components/query/purchase/purDelvInQuery'
import TablePurDelvIn from '../../components/table/purchase/tablePurDelvIn'
import TablePurDelvInItem from '../../components/table/purchase/tablePurDelvInItem'

import { Splitter, SplitterPanel } from 'primereact/splitter'

import { GetReqMasterQuery } from '../../../features/purchase/purDelvIn/getReqMasterQuery'
import { GetReqSheetQuery } from '../../../features/purchase/purDelvIn/getReqSheetQuery'
import { GetMasterQuery } from '../../../features/purchase/purDelvIn/getMasterQuery'
import { GetSheetQuery } from '../../../features/purchase/purDelvIn/getSheetQuery'
import { PostQRCheck } from '../../../features/purchase/purDelvIn/postQRCheck'

import { PostAUD } from '../../../features/purchase/purDelvIn/postAUD'
import { PostMasterDelete } from '../../../features/purchase/purDelvIn/postMasterDelete'
import { PostSheetDelete } from '../../../features/purchase/purDelvIn/postSheetDelete'

import ErrorListModal from '../default/errorListModal'
import { updateIndexNo } from '../../components/sheet/js/updateIndexNo'
import TopLoadingBar from 'react-top-loading-bar'
import { togglePageInteraction } from '../../../utils/togglePageInteraction'

export default function PurDelvInLink({
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
  const nameFrom = ' NHẬP KHO SẢN PHẨM NHẬP KHẨU '

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
  // const [totalAmountVAT, setTotalAmountVAT] = useState(0)
  // const [totalTotAmount, setTotalTotAmount] = useState(0)
  // const [totalDomAmount, setTotalDomAmount] = useState(0)
  // const [totalDomVATAmount, setTotalDomVATAmount] = useState(0)
  // const [totalTotDomAmount, setTotalTotDomAmount] = useState(0)
  //Item
  const [totalQuantityItem, setTotalQuantityItem] = useState(0)
  const [totalAmountItem, setTotalAmountItem] = useState(0)
  // const [totalAmountVATItem, setTotalAmountVATItem] = useState(0)
  // const [totalTotAmountItem, setTotalTotAmountItem] = useState(0)
  // const [totalDomAmountItem, setTotalDomAmountItem] = useState(0)
  // const [totalDomVATAmountItem, setTotalDomVATAmountItem] = useState(0)
  // const [totalTotDomAmountItem, setTotalTotDomAmountItem] = useState(0)

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
        id: 'DelvSerl',
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
        visible: true,
        trailingRowOptions: {
          disabled: true,
        },
        icon: GridColumnIcon.HeaderNumber,
      },
      {
        title: t('Số lượng giao hàng'),
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
        id: 'CurAmt',
        kind: 'Text',
        readonly: true,
        width: 100,
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
        title: t('SL đã nhập kho'),
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
        title: t('2450'),
        id: 'VATRate',
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
        title: t('1032'),
        id: 'CurVAT',
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
        title: t('945'),
        id: 'TotCurAmt',
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
        visible: false,
        trailingRowOptions: {
          disabled: true,
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
        visible: false,
        trailingRowOptions: {
          disabled: true,
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
        visible: false,
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
        title: t('DelvSeq'),
        id: 'DelvSeq',
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
        title: t('DelvInSerl'),
        id: 'DelvInSerl',
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
        visible: true,
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
        id: 'CurAmt',
        kind: 'Text',
        readonly: true,
        width: 120,
        hasMenu: true,
        visible: true,
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
        title: t('17387'),
        id: 'CreateDate',
        kind: 'Text',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: true,
        },
        icon: GridColumnIcon.HeaderDate,
      },
      {
        title: t('210'),
        id: 'RegDate',
        kind: 'Text',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: true,
        },
        icon: GridColumnIcon.HeaderDate,
      },
      {
        title: t('YYWW'),
        id: 'YYWW',
        kind: 'Text',
        readonly: true,
        width: 80,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: true,
        },
        icon: GridColumnIcon.HeaderDate,
      },
      {
        title: t('2450'),
        id: 'VATRate',
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
        title: t('1032'),
        id: 'CurVAT',
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
        title: t('945'),
        id: 'TotCurAmt',
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
        visible: false,
        trailingRowOptions: {
          disabled: true,
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
        visible: false,
        trailingRowOptions: {
          disabled: true,
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
        visible: false,
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
        title: t('SMImpType'),
        id: 'SMImpType',
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
        id: 'Remark',
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
        title: t('DelvInSeq'),
        id: 'DelvInSeq',
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
        title: t('DelvQty'),
        id: 'DelvQty',
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
        title: t('DelvAmt'),
        id: 'DelvAmt',
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
    const total = gridData.reduce((sum, item) => sum + (item.CurAmt || 0), 0)
    setTotalAmount(total)
  }

  const calculateTotalQuantityItem = () => {
    const total = gridDataItem.reduce((sum, item) => sum + (item.Qty || 0), 0)
    setTotalQuantityItem(total)
  }

  const calculateTotalAmountItem = () => {
    const total = gridDataItem.reduce(
      (sum, item) => sum + (item.CurAmt || 0),
      0,
    )
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
      'S_ERP_COLS_PAGE_PUR_DELVIN',
      defaultCols.filter((col) => col.visible),
    ),
  )
  useEffect(() => {
    setCols(defaultCols.filter((col) => col.visible))
  }, [defaultCols])

  const [colsItem, setColsItem] = useState(() =>
    loadFromLocalStorageSheet(
      'S_ERP_COLS_PAGE_PUR_DELVIN_ITEM',
      defaultCols.filter((col) => col.visible),
    ),
  )
  useEffect(() => {
    setColsItem(defaultColsItem.filter((col) => col.visible))
  }, [defaultColsItem])

  /* CodeHelp */
  const [bizUnit, setBizUnit] = useState('0')
  const [bizUnitName, setBizUnitName] = useState('')
  const [typeName, setTypeName] = useState('0')
  const [smImpTypeName, setSmImpTypeName] = useState('')
  const [status, setStatus] = useState('')
  const [empName, setEmpName] = useState('')
  const [empSeq, setEmpSeq] = useState('')
  const [deptName, setDeptName] = useState('')
  const [deptSeq, setDeptSeq] = useState('0')
  const [custName, setCustName] = useState('')
  const [custSeq, setCustSeq] = useState('')
  const [exRate, setExRate] = useState(0)
  const [currName, setCurrName] = useState('')
  const [currSeq, setCurrSeq] = useState(0)
  const [delvSeq, setDelvSeq] = useState('0')
  const [delvSerl, setDelvSerl] = useState('0')
  const [delvInSeq, setDelvInSeq] = useState('0')

  const [delvInNo, setDelvInNo] = useState('')
  const [delvNo, setDelvNo] = useState('')
  const [remark, setRemark] = useState('')
  const [whName, setWhName] = useState('')
  const [whSeq, setWhSeq] = useState('0')

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
      setDelvSeq(data.DelvSeq)
      setDelvInSeq(data.DelvInSeq)
      if (data) {
        fetchMasterQuery(data.DelvInSeq)
        fetchSheetLinkQuery(data.DelvInSeq)
        fetchSheetQuery(data.DelvSeq)
      }
    }
  }, [id])

  const fetchMasterQuery = async (delvSeq) => {
    try {
      const masterResponse = await GetMasterQuery(delvSeq)

      if (masterResponse.data.success) {
        const fetchedData = masterResponse.data.data || []

        if (fetchedData.length > 0) {
          setBizUnit(fetchedData[0].BizUnit)
          setBizUnitName(fetchedData[0].BizUnitName)
          setTypeName(fetchedData[0].SMImpType)
          setSmImpTypeName(fetchedData[0].SMImpTypeName)
          setDeptName(fetchedData[0].DeptName)
          setDeptSeq(fetchedData[0].DeptSeq)
          setDelvInSeq(fetchedData[0].DelvInSeq)
          setDelvInNo(fetchedData[0].DelvInNo)
          setCustName(fetchedData[0].CustName)
          setCustSeq(fetchedData[0].CustSeq)
          setExRate(fetchedData[0].ExRate)
          setCurrSeq(fetchedData[0].CurrSeq)
          setCurrName(fetchedData[0].CurrName)
          setRemark(fetchedData[0].Remark)
          setWhName(fetchedData[0].WHName)
          setWhSeq(fetchedData[0].WHSeq)
          setFromDate(dayjs(fetchedData[0].DelvDate))
        }
      } else {
        setIsAPISuccess(true)
        message.error('Có lỗi xảy ra khi tải dữ liệu.')
      }
    } catch (error) {
      message.error('Có lỗi xảy ra khi tải dữ liệu.')
    } finally {
      setIsAPISuccess(true)
    }
  }

  const fetchSheetLinkQuery = async (delvInSeq) => {
    try {
      if (loadingBarRef.current) {
        loadingBarRef.current.continuousStart()
      }
      const sheetResponse = await GetSheetQuery(delvInSeq)

      if (sheetResponse.data.success) {
        const fetchedData = sheetResponse.data.data || []
        setGridDataItem(fetchedData)
        setNumRowsItem(fetchedData.length)
        setIsAPISuccess(true)
        if (loadingBarRef.current) {
          loadingBarRef.current.complete()
        }
      } else {
        const emptyData = generateEmptyData(0, defaultCols)
        setGridDataItem(emptyData)
        setNumRowsItem(emptyData.length)
        setIsAPISuccess(true)
        if (loadingBarRef.current) {
          loadingBarRef.current.complete()
        }
        message.error('Có lỗi xảy ra khi tải dữ liệu.')
      }
    } catch (error) {
      const emptyData = generateEmptyData(0, defaultCols)
      setGridDataItem(emptyData)
      setNumRowsItem(emptyData.length)
      setIsAPISuccess(true)
      if (loadingBarRef.current) {
        loadingBarRef.current.complete()
      }
      message.error('Có lỗi xảy ra khi tải dữ liệu.')
    } finally {
      setIsAPISuccess(true)
      //if (loadingBarRef.current) {
      //loadingBarRef.current.complete()
      //}
    }
  }

  const fetchSheetQuery = async (delvSeq) => {
    try {
      if (loadingBarRef.current) {
        loadingBarRef.current.continuousStart()
      }
      const sheetResponse = await GetReqSheetQuery(delvSeq)

      if (sheetResponse.data.success) {
        const fetchedData = sheetResponse.data.data || []
        setGridData(fetchedData)
        setNumRows(fetchedData.length)
        setIsAPISuccess(true)
        if (loadingBarRef.current) {
          loadingBarRef.current.complete()
        }
      } else {
        const emptyData = generateEmptyData(0, defaultCols)
        setGridData(emptyData)
        setNumRows(emptyData.length)
        setIsAPISuccess(true)
        if (loadingBarRef.current) {
          loadingBarRef.current.complete()
        }
        message.error('Có lỗi xảy ra khi tải dữ liệu.')
      }
    } catch (error) {
      const emptyData = generateEmptyData(0, defaultCols)
      setGridData(emptyData)
      setNumRows(emptyData.length)
      setIsAPISuccess(true)
      if (loadingBarRef.current) {
        loadingBarRef.current.complete()
      }
      message.error('Có lỗi xảy ra khi tải dữ liệu.')
    } finally {
      setIsAPISuccess(true)
      //if (loadingBarRef.current) {
      //loadingBarRef.current.complete()
      //}
    }
  }

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
    setGridDataItem((prevHistory) => {
      const newItem = {
        Status: 'A',
        DelvInSerl: '0',
        LotNo: dataResSuccess?.LotNo,
        ItemNo: dataResSuccess?.ItemNo,
        Price: dataResSuccess?.Price,
        Qty: dataResSuccess?.Qty,
        CurAmt: dataResSuccess?.CurAmt,
        TotCurAmt: dataResSuccess?.TotCurAmt,
        CurVAT: dataResSuccess?.CurVAT,
        DomPrice: dataResSuccess?.DomPrice,
        DomAmt: dataResSuccess?.DomAmt,
        DomVAT: dataResSuccess?.DomVAT,
        TotDomAmt: dataResSuccess?.TotDomAmt,
        CreateDate: dataResSuccess?.CreateDate,
        RegDate: dataResSuccess?.RegDate,
        ItemName: dataResSuccess?.ItemName,
        Spec: dataResSuccess?.Spec,
        ItemSeq: dataResSuccess?.ItemSeq,
        UnitSeq: dataResSuccess?.UnitSeq,
        UnitName: dataResSuccess?.UnitName,
        SMImpTypeName: dataResSuccess?.SMImpTypeName,
        SMImpType: dataResSuccess?.SMImpType,
        Remark: dataResSuccess?.Remark,
        Barcode: dataResSuccess?.Barcode,
        DelvInSeq: '0',
        YYWW: dataResSuccess?.YYWW,
        DelvSerl: dataResSuccess?.DelvSerl,
        InOutType: dataResSuccess?.InOutType,
        DelvQty: dataResSuccess?.DelvQty,
        DelvAmt: dataResSuccess?.DelvAmt,
        DelvSeq: dataResSuccess?.DelvSeq,
        IsLotMng: dataResSuccess?.IsLotMng,
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
      if (whSeq === '0' || whSeq === '') {
        message.warning('"Kho nhập kho" không được để trống hoặc null!')
        return
      }
      if (loadingBarRef.current) {
        loadingBarRef.current.continuousStart()
      }
      const resSuccess = await PostQRCheck(formData)
      if (resSuccess.data.success) {
        const dataResSuccess = resSuccess.data.data[0]
        if (loadingBarRef.current) {
          loadingBarRef.current.complete()
        }
        message.success(resultMessage)
        setInputBarCode(null)
        setInputCode(null)
        setIsModalVisible(false)
        addToScanHistory(dataResSuccess, () => {
          setGridData((prevData) =>
            prevData.map((item) =>
              item.ItemNo === formData[0].ItemNo &&
              item.DelvSerl === formData[0].DelvSerl
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
        }
        setDataError(resSuccess.data.errors)
        setIsModalVisible(true)
      }
    }, 100),
    [whSeq, gridData],
  )

  useEffect(() => {
    workerRef.current = new Worker(
      new URL('../../../workers/workerPurDelvIn.js', import.meta.url),
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
            DelvSeq,
            DelvSerl,
            SMImpType,
            SMImpTypeName,
            Price,
            CurAmt,
            DomPrice,
            DomAmt,
            InOutType,
            DelvQty,
            DelvAmt,
            IsLotMng,
          } = resultData

          const formData = [
            {
              DelvSeq: DelvSeq,
              DelvSerl: DelvSerl,
              ItemSeq: ItemSeq,
              UnitSeq: UnitSeq,
              UnitName: UnitName,
              ItemNo: itemNo,
              LotNo: lot,
              Qty: qty,
              DateCode: dc,
              ReelNo: reel,
              Barcode: barcode,
              SMImpType: SMImpType,
              SMImpTypeName: SMImpTypeName,
              Price: Price,
              CurAmt: CurAmt,
              DomPrice: DomPrice,
              DomAmt: DomAmt,
              InOutType: InOutType,
              DelvQty: DelvQty,
              DelvAmt: DelvAmt,
              IsLotMng: IsLotMng,
            },
          ]
          setInputItemNo(itemNo)
          setDelvSerl(DelvSerl)
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
      message.warning('"Ngày nhập kho" không được để trống hoặc null!')
      return
    }
    if (bizUnit === '0' || bizUnit === '') {
      message.warning('"Đơn vị kinh doanh" không được để trống hoặc null!')
      return
    }

    if (typeName === '0' || typeName === '') {
      message.warning('"Phân loại mua hàng" không được để trống hoặc null!')
      return
    }

    if (whSeq === '0' || whSeq === '') {
      message.warning('"Kho nhập kho" không được để trống hoặc null!')
      return
    }

    const dataMaster = [
      {
        DelvInSeq: delvInSeq,
        DelvInNo: delvInNo,
        SMImpType: typeName,
        DelvInDate: fromDate ? formatDate(fromDate) : '',
        BizUnit: bizUnit,
        BizUnitName: bizUnitName,
        DeptSeq: deptSeq,
        DeptName: deptName,
        WHSeq: whSeq,
        WHName: whName,
        CustSeq: custSeq,
        CustName: custName,
        EmpSeq: empSeq,
        EmpName: empName,
        CurrSeq: currSeq,
        CurrName: currName,
        ExRate: exRate,
        Remark: remark,
        DelvNo: delvNo,
      },
    ]
    console.log('dataMaster', dataMaster)
    const columnsA = [
      'Status',
      'IsLotMng',
      'DelvInSeq',
      'DelvInSerl',
      'ItemName',
      'ItemNo',
      'Spec',
      'ItemSeq',
      'UnitName',
      'UnitSeq',
      'Price',
      'Qty',
      'CurAmt',
      'TotCurAmt',
      'CurVAT',
      'DomPrice',
      'DomAmt',
      'DomVAT',
      'TotDomAmt',
      'SMImpTypeName',
      'SMImpType',
      'Remark',
      'LotNo',
      'CreateDate',
      'RegDate',
      'InOutType',
      'DelvSerl',
      'DelvSeq',
      'DelvQty',
      'DelvAmt',
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
    setIsAPISuccess(false)
    togglePageInteraction(true)
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
          if (loadingBarRef.current) {
            loadingBarRef.current.complete()
            message.success('Lưu dữ liệu thành công!')
          }
          togglePageInteraction(false)
          setIsAPISuccess(true)
          setDelvInSeq(result.data.data[0].DelvInSeq)
          setDelvInNo(result.data.data[0].DelvInNo)
          setEditedRows([])
          updateGridData(newData)
          resetTableItem()
          fetchSheetQuery(delvSeq)
        } else {
          if (loadingBarRef.current) {
            loadingBarRef.current.complete()
          }
          togglePageInteraction(false)
          setIsAPISuccess(true)
          setDataError(result.data.errors)
          setIsModalVisible(true)
          message.error('Có lỗi xảy ra khi lưu dữ liệu')
        }
      })
    } catch (error) {
      if (loadingBarRef.current) {
        loadingBarRef.current.complete()
      }
      togglePageInteraction(false)
      setIsAPISuccess(true)
      message.error(error.message || 'Có lỗi xảy ra khi lưu dữ liệu')
    }
  }, [
    canCreate,
    gridDataItem,
    selectionItem,
    editedRowsItem,
    isDeleting,
    gridData,
    delvInSeq,
    delvInNo,
    typeName,
    fromDate,
    bizUnit,
    bizUnitName,
    deptSeq,
    deptName,
    whSeq,
    whName,
    custSeq,
    custName,
    empSeq,
    empName,
    currName,
    currSeq,
    exRate,
    remark,
    delvNo,
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

      const dataMaster = [
        {
          DelvInSeq: delvInSeq,
          DelvInNo: delvInNo,
          SMImpType: typeName,
          DelvInDate: fromDate ? formatDate(fromDate) : '',
          BizUnit: bizUnit,
          BizUnitName: bizUnitName,
          DeptSeq: deptSeq,
          DeptName: deptName,
          WHSeq: whSeq,
          WHName: whName,
          CustSeq: custSeq,
          CustName: custName,
          EmpSeq: empSeq,
          EmpName: empName,
          CurrSeq: currSeq,
          CurrName: currName,
          ExRate: exRate,
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
        setIsAPISuccess(false)
        togglePageInteraction(true)
        if (loadingBarRef.current) {
          loadingBarRef.current.continuousStart()
        }
        PostSheetDelete(dataMaster, idsWithStatusD)
          .then((response) => {
            message.destroy()
            if (response.data.success) {
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
              fetchSheetQuery(delvSeq)
              if (loadingBarRef.current) {
                loadingBarRef.current.complete()
                message.success('Xóa dữ liệu thành công!')
              }
              togglePageInteraction(false)
              setIsAPISuccess(true)
            } else {
              setDataError(response.data.errors)
              setIsModalVisible(true)
              if (loadingBarRef.current) {
                loadingBarRef.current.complete()
              }
              togglePageInteraction(false)
              setIsAPISuccess(true)
              message.error(response.data.message || 'Xóa thất bại!')
            }
          })
          .catch((error) => {
            setDataError(response.data.errors)
            setIsModalVisible(true)
            if (loadingBarRef.current) {
              loadingBarRef.current.complete()
            }
            message.error('Có lỗi xảy ra khi xóa!')
          })
          .finally(() => {
            setIsAPISuccess(true)
            if (loadingBarRef.current) {
              loadingBarRef.current.complete()
            }
          })
      } else {
        const selectedItems = rowsWithStatusA.map(
          ({ DelvSerl, ItemNo, Qty }) => ({
            DelvSerl,
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
                selected.DelvSerl === item.DelvSerl,
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
      delvInSeq,
      delvInNo,
      typeName,
      fromDate,
      bizUnit,
      bizUnitName,
      deptSeq,
      deptName,
      whSeq,
      whName,
      custSeq,
      custName,
      empSeq,
      empName,
      currName,
      currSeq,
      exRate,
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
          DelvInSeq: delvInSeq,
          DelvInNo: delvInNo,
          SMImpType: typeName,
          DelvInDate: fromDate ? formatDate(fromDate) : '',
          BizUnit: bizUnit,
          BizUnitName: bizUnitName,
          DeptSeq: deptSeq,
          DeptName: deptName,
          WHSeq: whSeq,
          WHName: whName,
          CustSeq: custSeq,
          CustName: custName,
          EmpSeq: empSeq,
          EmpName: empName,
          CurrSeq: currSeq,
          CurrName: currName,
          ExRate: exRate,
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
        setIsDeleting(true)
        setIsAPISuccess(false)
        togglePageInteraction(true)
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
              fetchSheetQuery(delvSeq)
              setDelvInNo('')
              setDelvInSeq('0')
              if (loadingBarRef.current) {
                loadingBarRef.current.complete()
                message.success('Xóa dữ liệu thành công!')
              }
              togglePageInteraction(false)
              setIsAPISuccess(true)
            } else {
              if (loadingBarRef.current) {
                loadingBarRef.current.complete()
              }
              togglePageInteraction(false)
              setIsAPISuccess(true)
              setModalMasterDeleteOpen(false)
              setDataError(response.data.errors)
              setIsModalVisible(true)
              message.error(response.data.message || 'Xóa thất bại!')
            }
          })
          .catch((error) => {
            if (loadingBarRef.current) {
              loadingBarRef.current.complete()
            }
            togglePageInteraction(false)
            setIsAPISuccess(true)
            setModalMasterDeleteOpen(false)
            message.error('Có lỗi xảy ra khi xóa!')
          })
          .finally(() => {
            if (loadingBarRef.current) {
              loadingBarRef.current.complete()
            }
            togglePageInteraction(false)
            setIsAPISuccess(true)
            setIsDeleting(false)
          })
      }

      if (rowsWithStatusA.length > 0) {
        const selectedItems = rowsWithStatusA.map(
          ({ DelvSerl, ItemNo, Qty }) => ({
            DelvSerl,
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
                selected.DelvSerl === item.DelvSerl,
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
      delvInSeq,
      delvInNo,
      typeName,
      fromDate,
      bizUnit,
      bizUnitName,
      deptSeq,
      deptName,
      whSeq,
      whName,
      custSeq,
      custName,
      empSeq,
      empName,
      currName,
      currSeq,
      exRate,
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
    setDelvInSeq('0')
    setDelvInNo('')
    const emptyData = generateEmptyData(0, defaultColsItem)
    setGridDataItem(emptyData)
    setNumRowsItem(emptyData.length)
    resetTableItem()
    fetchSheetQuery(delvSeq)
  }, [defaultColsItem, gridDataItem])

  return (
    <>
      <Helmet>
        <title>ITM - {t('Nhập kho mua hàng trong nước')}</title>
      </Helmet>
      <TopLoadingBar color="blue" height={2} ref={loadingBarRef} />
      <div
        className={`bg-slate-50 p-3 h-screen overflow-hidden relative app-content  `}
      >
        <div className="flex flex-col gap-4 md:grid md:grid-cols-4 md:grid-rows-[auto_1fr] md:gap-4 h-full">
          <div className="col-start-1 col-end-5 row-start-1 w-full rounded-lg ">
            <div className="flex items-center justify-between mb-2">
              <Title level={4} className="mt-2 uppercase opacity-85 ">
                {t('Nhập kho mua hàng trong nước')}
              </Title>
              <PurDelvInActions
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
                <PurDelvInQuery
                  fromDate={fromDate}
                  setFromDate={setFromDate}
                  bizUnitName={bizUnitName}
                  smImpTypeName={smImpTypeName}
                  whName={whName}
                  custName={custName}
                  userName={empName}
                  deptName={deptName}
                  delvInNo={delvInNo}
                  remark={remark}
                  setRemark={setRemark}
                  exRate={exRate}
                  currName={currName}
                />
              </div>
            </details>
          </div>
          <div className="col-start-1 flex gap-3 col-end-5 row-start-2 w-full  h-[calc(100%-1 0px)]   rounded-lg  overflow-hidden">
            <Splitter className="w-full h-full">
              <SplitterPanel size={50} minSize={10}>
                <TablePurDelvIn
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
                  delvSerl={delvSerl}
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
                      </Col>
                      <Col className="w-[50%]">
                        <Form.Item>
                          <Input
                            placeholder="Nhập thông tin barcode sản phẩm"
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
                    </Row>
                  </Form>
                </div>
                <TablePurDelvInItem
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
