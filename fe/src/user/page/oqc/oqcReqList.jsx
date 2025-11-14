import { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet'
import { FilterOutlined } from '@ant-design/icons'

import { Typography, message } from 'antd'
const { Title } = Typography
import { debounce } from 'lodash'
import dayjs from 'dayjs'
import { CompactSelection, GridColumnIcon } from '@glideapps/glide-data-grid'

import ErrorListModal from '../default/errorListModal'
import ModalSheetDelete from '../../components/modal/default/deleteSheet'

import { ArrowIcon } from '../../components/icons'
import { GetCodeHelpCombo } from '../../../features/codeHelp/getCodeHelpCombo'
import { GetCodeHelp } from '../../../features/codeHelp/getCodeHelp'
import { filterAndSelectColumns } from '../../../utils/filterUorA'
import useKeydownHandler from '../../components/hooks/sheet/useKeydownHandler'
import { loadFromLocalStorageSheet } from '../../../localStorage/sheet/sheet'
import { onRowAppended } from '../../components/sheet/js/onRowAppended'
import { generateEmptyData } from '../../components/sheet/js/generateEmptyData'
import useDynamicFilter from '../../components/hooks/sheet/useDynamicFilter'
import { validateCheckColumns } from '../../../utils/validateColumns'
import { updateIndexNo } from '../../components/sheet/js/updateIndexNo'
import { useNavigate } from 'react-router-dom'
import CryptoJS from 'crypto-js'
import { encodeBase64Url } from '../../../utils/decode-JWT'

import TopLoadingBar from 'react-top-loading-bar'
import OqcReqListActions from '../../components/actions/oqc/oqcReqListActions'
import OqcReqListQuery from '../../components/query/oqc/oqcReqListQuery'
import TableOqcReqList from '../../components/table/oqc/tableOqcReqList'
import { GetCodeHelpComboVer2 } from '../../../features/codeHelp/getCodeHelpComboVer2'
import { GetCodeHelpVer2 } from '../../../features/codeHelp/getCodeHelpVer2'
import { SearchOqcReqPage } from '../../../features/oqc/searchOqcReqPage'
import { formatNumberCellSum } from '../../../utils/formatNumberCellSum'

export default function OqcReqList({
  permissions,
  isMobile,
  canCreate,
  canEdit,
  canDelete,
  controllers,
}) {
  const { t } = useTranslation()
  const formatDate = (date) => (date ? date.format('YYYYMMDD') : '')
  const loadingBarRef = useRef(null)
  const [totalOrderQty, setTotalOrderQty] = useState(0)
  const [totalStdOrderQty, setTotalStdOrderQty] = useState(0)
  const [totalQty, setTotalQty] = useState(0)
  const [totalStdQty, setTotalStdQty] = useState(0)
  const [totalOKQty, setTotalOKQty] = useState(0)
  const [totalStdOKQty, setTotalStdOKQty] = useState(0)
  const [totalRemainQty, setTotalRemainQty] = useState(0)
  const [totalStdRemainQty, setTotalStdRemainQty] = useState(0)
  const [totalBadQty, setTotalBadQty] = useState(0)
  const [totalStdBadQty, setTotalStdBadQty] = useState(0)
  const [totalStdGoodInQty, setTotalStdGoodInQty] = useState(0)
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
          disabled: true,
        },
      },
      {
        title: t('3'),
        id: 'Factunit',
        kind: 'Text',
        readonly: true,
        width: 200,
        hasMenu: true,
        visible: false,
        icon: GridColumnIcon.HeaderRowID,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('3'),
        id: 'FactUnitName',
        kind: 'Text',
        readonly: true,
        width: 200,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderRowID,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('474'),
        id: 'SourceTypeName',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderString,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('744'),
        id: 'DeptName',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderString,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('218'),
        id: 'WorkDate',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderString,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('1985'),
        id: 'DelvNo',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderRowID,
        trailingRowOptions: {
          disabled: true,
        },
      },

      {
        title: t('1524'),
        id: 'ItemName',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderString,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('2035'),
        id: 'ItemNo',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderString,
        trailingRowOptions: {
          disabled: true,
        },
      },

      {
        title: t('551'),
        id: 'Spec',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderArray,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('2627'),
        id: 'QCNo',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderRowID,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('120'),
        id: 'TestEndDate',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderRowID,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('16930'),
        id: 'OrderQty',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderArray,
        trailingRowOptions: {
          hint: '' + formatNumberCellSum(totalOrderQty),
          addIcon: GridColumnIcon.HeaderMath,
          disabled: false,
          themeOverride: {
            textDark: '#009CA6',
            bgIconHeader: '#009CA6',
            accentColor: '#009CA6',
            accentLight: '#009CA620',
            fgIconHeader: '#FFFFFF',
            baseFontStyle: '700 13px',
          },
        },
      },

      {
        title: t('51412'),
        id: 'StdOrderQty',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderNumber,
        trailingRowOptions: {
          hint: '' + formatNumberCellSum(totalStdOrderQty),
          addIcon: GridColumnIcon.HeaderMath,
          disabled: false,
          themeOverride: {
            textDark: '#009CA6',
            bgIconHeader: '#009CA6',
            accentColor: '#009CA6',
            accentLight: '#009CA620',
            fgIconHeader: '#FFFFFF',
            baseFontStyle: '700 13px',
          },
        },
      },
      {
        title: t('2647'),
        id: 'ProcName',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderNumber,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('2627'),
        id: 'Qty',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderNumber,
        trailingRowOptions: {
          hint: '' + formatNumberCellSum(totalQty),
          addIcon: GridColumnIcon.HeaderMath,
          disabled: false,
          themeOverride: {
            textDark: '#009CA6',
            bgIconHeader: '#009CA6',
            accentColor: '#009CA6',
            accentLight: '#009CA620',
            fgIconHeader: '#FFFFFF',
            baseFontStyle: '700 13px',
          },
        },
      },
      {
        title: t('4519'),
        id: 'StdQty',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderArray,
        trailingRowOptions: {
          hint: '' + formatNumberCellSum(totalStdQty),
          addIcon: GridColumnIcon.HeaderMath,
          disabled: false,
          themeOverride: {
            textDark: '#009CA6',
            bgIconHeader: '#009CA6',
            accentColor: '#009CA6',
            accentLight: '#009CA620',
            fgIconHeader: '#FFFFFF',
            baseFontStyle: '700 13px',
          },
        },
      },
      {
        title: t('10537'),
        id: 'OKQty',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderString,
        trailingRowOptions: {
          hint: '' + formatNumberCellSum(totalOKQty),
          addIcon: GridColumnIcon.HeaderMath,
          disabled: false,
          themeOverride: {
            textDark: '#009CA6',
            bgIconHeader: '#009CA6',
            accentColor: '#009CA6',
            accentLight: '#009CA620',
            fgIconHeader: '#FFFFFF',
            baseFontStyle: '700 13px',
          },
        },
      },
      {
        title: t('51410'),
        id: 'StdOKQty',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderString,
        trailingRowOptions: {
          hint: '' + formatNumberCellSum(totalStdOKQty),
          addIcon: GridColumnIcon.HeaderMath,
          disabled: false,
          themeOverride: {
            textDark: '#009CA6',
            bgIconHeader: '#009CA6',
            accentColor: '#009CA6',
            accentLight: '#009CA620',
            fgIconHeader: '#FFFFFF',
            baseFontStyle: '700 13px',
          },
        },
      },
      {
        title: t('21424'),
        id: 'RemainQty',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderString,
        trailingRowOptions: {
          hint: '' + formatNumberCellSum(totalRemainQty),
          addIcon: GridColumnIcon.HeaderMath,
          disabled: false,
          themeOverride: {
            textDark: '#009CA6',
            bgIconHeader: '#009CA6',
            accentColor: '#009CA6',
            accentLight: '#009CA620',
            fgIconHeader: '#FFFFFF',
            baseFontStyle: '700 13px',
          },
        },
      },
      {
        title: t('51405'),
        id: 'StdRemainQty',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderString,
        trailingRowOptions: {
          hint: '' + formatNumberCellSum(totalStdRemainQty),
          addIcon: GridColumnIcon.HeaderMath,
          disabled: false,
          themeOverride: {
            textDark: '#009CA6',
            bgIconHeader: '#009CA6',
            accentColor: '#009CA6',
            accentLight: '#009CA620',
            fgIconHeader: '#FFFFFF',
            baseFontStyle: '700 13px',
          },
        },
      },
      {
        title: t('6009'),
        id: 'BadQty',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderString,
        trailingRowOptions: {
          hint: '' + formatNumberCellSum(totalBadQty),
          addIcon: GridColumnIcon.HeaderMath,
          disabled: false,
          themeOverride: {
            textDark: '#009CA6',
            bgIconHeader: '#009CA6',
            accentColor: '#009CA6',
            accentLight: '#009CA620',
            fgIconHeader: '#FFFFFF',
            baseFontStyle: '700 13px',
          },
        },
      },

      {
        title: t('4516'),
        id: 'StdBadQty',
        kind: 'Custom',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderArray,
        trailingRowOptions: {
          hint: '' + formatNumberCellSum(totalStdBadQty),
          addIcon: GridColumnIcon.HeaderMath,
          disabled: false,
          themeOverride: {
            textDark: '#009CA6',
            bgIconHeader: '#009CA6',
            accentColor: '#009CA6',
            accentLight: '#009CA620',
            fgIconHeader: '#FFFFFF',
            baseFontStyle: '700 13px',
          },
        },
      },
      {
        title: t('2646'),
        id: 'GoodInQty',
        kind: 'Custom',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: false,
        icon: GridColumnIcon.HeaderArray,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('51406'),
        id: 'StdGoodInQty',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderRowID,
        trailingRowOptions: {
          hint: '' + formatNumberCellSum(totalStdGoodInQty),
          addIcon: GridColumnIcon.HeaderMath,
          disabled: false,
          themeOverride: {
            textDark: '#009CA6',
            bgIconHeader: '#009CA6',
            accentColor: '#009CA6',
            accentLight: '#009CA620',
            fgIconHeader: '#FFFFFF',
            baseFontStyle: '700 13px',
          },
        },
      },
      {
        title: t('13503'),
        id: 'NotInQty',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: false,
        icon: GridColumnIcon.HeaderRowID,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('51407'),
        id: 'StdNotInQty',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: false,
        icon: GridColumnIcon.HeaderRowID,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('1529'),
        id: 'UnitName',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderArray,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('6428'),
        id: 'UnitSeq',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderString,
        trailingRowOptions: {
          disabled: true,
        },
      },

      {
        title: t('2085'),
        id: 'StdUnitName',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: false,
        icon: GridColumnIcon.HeaderString,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('2473'),
        id: 'StdUnitSeq',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: false,
        icon: GridColumnIcon.HeaderString,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('25431'),
        id: 'LOTNo',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: false,
        icon: GridColumnIcon.HeaderString,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('29614'),
        id: 'FromSerial',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: false,
        icon: GridColumnIcon.HeaderString,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('29613'),
        id: 'ToSerial',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: false,
        icon: GridColumnIcon.HeaderString,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('738'),
        id: 'DeptSeq',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: false,
        icon: GridColumnIcon.HeaderString,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('659'),
        id: 'ProcSeq',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: false,
        icon: GridColumnIcon.HeaderString,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('6443'),
        id: 'SourceSeq',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: false,
        icon: GridColumnIcon.HeaderString,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('16246'),
        id: 'SourceKind',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: false,
        icon: GridColumnIcon.HeaderString,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('3097'),
        id: 'ItemSeq',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: false,
        icon: GridColumnIcon.HeaderString,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('3662'),
        id: 'QCSeq',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: false,
        icon: GridColumnIcon.HeaderString,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('22129'),
        id: 'SMTestResult',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: false,
        icon: GridColumnIcon.HeaderString,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('2631'),
        id: 'EmpSeq',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: false,
        icon: GridColumnIcon.HeaderString,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('2631'),
        id: 'EmpName',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: false,
        icon: GridColumnIcon.HeaderString,
        trailingRowOptions: {
          disabled: true,
        },
      },

      {
        title: t('1059'),
        id: 'WorkCenterName',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: false,
        icon: GridColumnIcon.HeaderString,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('1062'),
        id: 'WorkCenterSeq',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: false,
        icon: GridColumnIcon.HeaderString,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('1981'),
        id: 'WorkTypeName',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: false,
        icon: GridColumnIcon.HeaderString,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('6'),
        id: 'CustName',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: false,
        icon: GridColumnIcon.HeaderString,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('362'),
        id: 'Remark',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: false,
        icon: GridColumnIcon.HeaderString,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('19799'),
        id: 'Memo1',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: false,
        icon: GridColumnIcon.HeaderString,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('19800'),
        id: 'Memo2',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: false,
        icon: GridColumnIcon.HeaderString,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('6995'),
        id: 'TestDocNo',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: false,
        icon: GridColumnIcon.HeaderString,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('14831'),
        id: 'SampleNo',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: false,
        icon: GridColumnIcon.HeaderString,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('48376'),
        id: 'IsReCfm',
        kind: 'Boolean',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: false,
        icon: GridColumnIcon.HeaderString,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('1903'),
        id: 'IsGoodInNm',
        kind: 'Custom',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: true,
        icon: GridColumnIcon.HeaderString,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('1903'),
        id: 'IsGoodIn',
        kind: 'Custom',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: false,
        icon: GridColumnIcon.HeaderString,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('592'),
        id: 'ItemClassSName',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: false,
        icon: GridColumnIcon.HeaderString,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('3262'),
        id: 'ItemClassMName',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: false,
        icon: GridColumnIcon.HeaderString,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('2115'),
        id: 'ItemClassLName',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: false,
        icon: GridColumnIcon.HeaderString,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('24860'),
        id: 'ItemClassSSeq',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: false,
        icon: GridColumnIcon.HeaderString,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('18850'),
        id: 'ItemClassMSeq',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: false,
        icon: GridColumnIcon.HeaderString,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('10305'),
        id: 'ItemClassLSeq',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: false,
        icon: GridColumnIcon.HeaderString,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: 'IDX_NO',
        id: 'IDX_NO',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: false,
        icon: GridColumnIcon.HeaderString,
        trailingRowOptions: {
          disabled: true,
        },
      },
    ],
    [
      t,
      totalOrderQty,
      totalStdOrderQty,
      totalQty,
      totalStdQty,
      totalOKQty,
      totalStdOKQty,
      totalRemainQty,
      totalStdRemainQty,
      totalBadQty,
      totalStdBadQty,
      totalStdGoodInQty,
    ],
  )
  const [loading, setLoading] = useState(false)
  const [gridData, setGridData] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [selection, setSelection] = useState({
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty(),
  })
  const [showSearch, setShowSearch] = useState(false)
  const [lastClickedCell, setLastClickedCell] = useState(null)
  const [addedRows, setAddedRows] = useState([])

  const [editedRows, setEditedRows] = useState([])
  const [clickedRowData, setClickedRowData] = useState(null)
  const [isMinusClicked, setIsMinusClicked] = useState(false)
  const [numRowsToAdd, setNumRowsToAdd] = useState(null)
  const [numRows, setNumRows] = useState(0)
  const [clickCount, setClickCount] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSent, setIsSent] = useState(false)
  const [openHelp, setOpenHelp] = useState(false)
  const [isCellSelected, setIsCellSelected] = useState(false)
  const [onSelectRow, setOnSelectRow] = useState([])
  const [dataError, setDataError] = useState([])
  const [isDeleting, setIsDeleting] = useState(false)
  const [cols, setCols] = useState(() =>
    loadFromLocalStorageSheet(
      'S_ERP_COLS_PAGE_OQC_PAGE',
      defaultCols.filter((col) => col.visible),
    ),
  )

  const [isAPISuccess, setIsAPISuccess] = useState(true)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [count, setCount] = useState(0)
  const lastWordEntryRef = useRef(null)

  /* Q */

  const [QCDateFrom, setQCDateFrom] = useState('')
  const [QCDateTo, setQCDateTo] = useState('')
  const [CustSeq, setCustSeq] = useState('')

  const [FactUnit, setFactUnit] = useState('')
  const [FactUnitName, setFactUnitName] = useState('')
  const [CustName, setCustName] = useState('')
  const [TestEndDate, setTestEndDate] = useState('')
  const [TestEndDateTo, setTestEndDateTo] = useState('')
  const [WorkDate, setWorkDate] = useState(dayjs().startOf('month'))
  const [WorkDateTo, setWorkDateTo] = useState(dayjs())
  const [SMQcTypeName, setSMQcTypeName] = useState('')
  const [SMQcType, setSMQcType] = useState('')
  const [DeptName, setDeptName] = useState('')
  const [WorkCenterName, setWorkCenterName] = useState('')
  const [WorkCenter, setWorkCenter] = useState('')
  const [IsGoodInNm, setIsGoodInNm] = useState('')
  const [IsGoodIn, setIsGoodIn] = useState('')
  const [WorkTypeName, setWorkTypeName] = useState('')
  const [WorkType, setWorkType] = useState('')
  const [DelvNo, setDelvNo] = useState('')
  const [ItemName, setItemName] = useState('')
  const [ItemNo, setItemNo] = useState('')
  const [QCNo, setQCNo] = useState('')
  const [LotNo, setLotNo] = useState('')
  //  Data code help
  const [dataCustomer, setDataCustomer] = useState([])

  const [dataBizUnit, setDataBizUnit] = useState([])
  const [dataSMQcType, setDataSMQcType] = useState([])
  const [dataWorkTypeName, setDataWorkTypeName] = useState([])
  const [dataWorkCenter, setDataWorkCenter] = useState([])
  const [dataIsGoodInNm, setDataIsGoodInNm] = useState([])

  const navigate = useNavigate()
  const [keyPath, setKeyPath] = useState('')
  const [dataSelect, setDataSelect] = useState([])

  const fieldsToTrack = [
    'Select',
    'BizUnitName',
    'BizUnit',
    'SourceTypeName',
    'BLDate',
    'CustName',
    'BLRefNo',
    'BLNo',
    'DeptName',
    'EmpName',
    'PJTName',
    'PJTNo',
    'PJTSeq',
    'WBSSeq',
    'ItemName',
    'ItemNo',
    'Spec',
    'UnitName',
    'ItemClassLName',
    'ItemClassMName',
    'ItemClassName',
    'Qty',
    'QCNo',
    'QCDate',
    'QCEmpName',
    'OkQty',
    'BadQty',
    'LOTNo',
    'FromSerial',
    'BLSeq',
    'ToSerial',
    'BLSerl',
    'ItemSeq',
    'SourceSeq',
    'SourceSerl',
    'SourceType',
    'QCSeq',
    'SMTestResultName',
    'SMTestResult',
    'Remark',
    'AssetSeq',
    'AssetName',
    'DelvDate',
  ]
  const { filterValidEntries, findLastEntry, findMissingIds } =
    useDynamicFilter(gridData, fieldsToTrack)

  const resetTable = () => {
    setSelection({
      columns: CompactSelection.empty(),
      rows: CompactSelection.empty(),
    })
  }

  const calculateTotalOrderQty = () => {
    const total = gridData.reduce((sum, item) => sum + (item.OrderQty || 0), 0)
    setTotalOrderQty(total)
  }
  const calculateTotalStdOrderQty = () => {
    const total = gridData.reduce((sum, item) => sum + (item.StdOrderQty || 0), 0)
    setTotalStdOrderQty(total)
  }
  const calculateTotalQty = () => {
    const total = gridData.reduce((sum, item) => sum + (item.Qty || 0), 0)
    setTotalQty(total)
  }

  const calculateTotalStdQty = () => {
    const total = gridData.reduce((sum, item) => sum + (item.StdQty || 0), 0)
    setTotalStdQty(total)
  }  
  
  const calculateTotalOKQty = () => {
    const total = gridData.reduce((sum, item) => sum + (item.OKQty || 0), 0)
    setTotalOKQty(total)
  }

  const calculateTotalStdOKQty = () => {
    const total = gridData.reduce((sum, item) => sum + (item.StdOKQty || 0), 0)
    setTotalStdOKQty(total)
  }

  const calculateTotalRemainQty = () => {
    const total = gridData.reduce((sum, item) => sum + (item.RemainQty || 0), 0)
    setTotalRemainQty(total)
  }

  const calculateTotalStdRemainQty = () => {
    const total = gridData.reduce((sum, item) => sum + (item.StdRemainQty || 0), 0)
    setTotalStdRemainQty(total)
  }

  const calculateTotalBadQty = () => {
    const total = gridData.reduce((sum, item) => sum + (item.BadQty || 0), 0)
    setTotalBadQty(total)
  }

  const calculateTotalStdBadQty = () => {
    const total = gridData.reduce((sum, item) => sum + (item.StdBadQty || 0), 0)
    setTotalStdBadQty(total)
  }

  const calculateTotalStdGoodInQty = () => {
    const total = gridData.reduce((sum, item) => sum + (item.StdGoodInQty || 0), 0)
    setTotalStdGoodInQty(total)
  }

    useEffect(() => {
      calculateTotalOrderQty()
      calculateTotalStdOrderQty()
      calculateTotalQty()
      calculateTotalStdQty()
      calculateTotalOKQty()
      calculateTotalStdOKQty()
      calculateTotalRemainQty()
      calculateTotalStdRemainQty()
      calculateTotalBadQty()
      calculateTotalStdBadQty()
      calculateTotalStdGoodInQty()
      setCols(defaultCols.filter((col) => col.visible))
    }, [gridData, defaultCols])

  const validRequiredField = useCallback(() => {
    return !(FactUnit === null || FactUnit === undefined || FactUnit === '');
  }, [FactUnit, FactUnitName, WorkDateTo, WorkDate ])


  const fetchData = useCallback(async () => {
    if (!isAPISuccess) {
      message.warning('Không thể thực hiện, vui lòng kiểm tra trạng thái.')
      return
    }

    if(!validRequiredField()){
      message.warning(`Bắt buộc lựa chọn ${t('3')}`)
      return
    }

    if (controllers.current && controllers.current.fetchData) {
      controllers.current.fetchData.abort()
      controllers.current.fetchData = null
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

    controllers.current.fetchData = controller

    setIsAPISuccess(false)
    try {
      const data = [
        {
          FactUnit: FactUnit,
          FactUnitName: FactUnitName,
          WorkDate: formatDate(WorkDate),
          WorkDateTo: formatDate(WorkDateTo),
          TestEndDate: formatDate(TestEndDate),
          TestEndDateTo: formatDate(TestEndDateTo),
          DeptName: DeptName,
          IsGoodInNm: IsGoodInNm,
          IsGoodIn: IsGoodIn,
          DelvNo: DelvNo,
          SMQcType: SMQcType,
          LotNo: LotNo,
          QcNo: QCNo,
          WorkCenterName: WorkCenterName,
          WorkCenter: WorkCenter,
          WorkTypeName: WorkTypeName,
          WorkType: WorkType,
          CustSeq: CustSeq,
          ItemName: ItemName,
          ItemNo: ItemNo,
          CustName: CustName,
        },
      ]

      const response = await SearchOqcReqPage(data)
      const fetchedData = response.data.data || []

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
      setIsAPISuccess(true)
    } finally {
      setIsAPISuccess(true)
      controllers.current.fetchData = null
      if (loadingBarRef.current) {
        loadingBarRef.current.complete()
      }
    }
  }, [
    FactUnit,
    FactUnitName,
    WorkDate,
    WorkDateTo,
    TestEndDate,
    TestEndDateTo,
    DeptName,
    IsGoodInNm,
    IsGoodIn,
    DelvNo,
    LotNo,
    QCNo,
    WorkCenterName,
    WorkCenter,
    WorkTypeName,
    WorkType,
    CustSeq,
    ItemName,
    ItemNo,
    CustName,
    isAPISuccess,
    SMQcType,
    validRequiredField,
  ])

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
        dataBizUnit,
        dataSMQcType,
        dataCustomer,
        dataIsGoodInNm,
        dataWorkCenter,
        dataWorkTypeName,
        
      ] = await Promise.all([
        GetCodeHelpCombo('', 6, 60001, 1, '%', '', '', '', ''),
        GetCodeHelpCombo('', 6, 19998, 1, '%', '6035', '1002', '', ''),
        GetCodeHelp(17041, '', '', '', '', '', '1', '', 1, '', 0, 0, 0),
        GetCodeHelpComboVer2('', 6, 19998, 1, '%', '6043', '', '', ''),
        GetCodeHelpVer2(60002, '', '', '', '', '', '1', '',1000, 'IsYn = 1', 0, 0, 0),
        GetCodeHelpComboVer2('', 6, 19998, 1, '%', '6502', '', '', ''),
      ])

      setDataBizUnit(dataBizUnit.data)
      setDataSMQcType(dataSMQcType.data)
      setDataCustomer(dataCustomer.data)
      setDataIsGoodInNm(dataIsGoodInNm.data)
      setDataWorkCenter(dataWorkCenter.data)
      setDataWorkTypeName(dataWorkTypeName.data)

    } catch (error) {
    } finally {
      setLoading(false)
      if (loadingBarRef.current) {
        loadingBarRef.current.complete()
      }
      controllers.current.fetchCodeHelpData = null
    }
  }, [])

  const fetchCodeHelpByFactUnit = useCallback(async () => {
    
    try {
      const [
        dataWorkCenter,
        
      ] = await Promise.all([
   
        GetCodeHelpVer2(60002, '', FactUnit, '', '', '', '1', '',1000, 'IsYn = 1', 0, 0, 0)
      ])

      setDataWorkCenter(dataWorkCenter.data)

    } catch (error) {
    }
  }, [FactUnit])

  useEffect(()=> {
    fetchCodeHelpByFactUnit()
  }, [FactUnit])


  const debouncedFetchCodeHelpData = useMemo(
    () => debounce(fetchCodeHelpData, 200),
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

  const getSelectedRows = () => {
    const selectedRows = selection.rows.items
    let rows = []
    selectedRows.forEach((range) => {
      const start = range[0]
      const end = range[1] - 1

      for (let i = start; i <= end; i++) {
        if (gridData[i]) {
          rows.push(gridData[i])
        }
      }
    })

    return rows
  }

  const handleRowAppend = useCallback(
    (numRowsToAdd) => {
      
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

  const nextPageDeatails = useCallback(() => {
    if (keyPath) {
      navigate(`/qc/u/qc-finish-detail/${keyPath}`)
    } else {
      message.warning('Lựa chọn đề nghị xử lý kiểm tra')
    }
  }, [dataSelect, navigate])

  const nextPageDeatailsList = useCallback(() => {
    if (dataSelect.length > 0) {
      navigate(`/qc/u/qc-finish-detail-list`, { state: { dataSelect } })
    } else {
      if (!keyPath) {
        message.warning('Lựa chọn đề nghị xử lý kiểm tra')
        return
      }
      navigate(`/qc/u/qc-finish-detail/${keyPath}`)
    }
  }, [navigate, keyPath, dataSelect])

  const getSelectRows = () => {
    const selectedRows = selection.rows.items
    let rows = []
    selectedRows.forEach((range) => {
      const start = range[0]
      const end = range[1] - 1

      for (let i = start; i <= end; i++) {
        if (gridData[i]) {
          rows.push(gridData[i])
        }
      }
    })

    return rows
  }

  const onCellClicked = useCallback(
    (cell, event) => {
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

      setDataSelect(getSelectRows())

      if (rowIndex >= 0 && rowIndex < gridData.length) {
        const rowData = gridData[rowIndex]
        const secretKey = 'TEST_ACCESS_KEY'
        const encryptedData = CryptoJS.AES.encrypt(
          JSON.stringify(rowData),
          secretKey,
        ).toString()

        const encryptedToken = encodeBase64Url(encryptedData)
        setKeyPath(encryptedToken)
        setClickedRowData(rowData)
        setLastClickedCell(cell)
      }
    },
    [keyPath, getSelectRows, dataSelect],
  )

  const handleSaveData = useCallback(async () => {
    if (canCreate === false) {
      message.warning('Bạn không có quyền thêm dữ liệu')
      return
    }
    const requiredColumns = [
      'ItemName',
      'ItemNo',
      'AssetName',
      'UnitName',
      'SMStatusName',
      'ItemClassSName',
    ]

    const columnsU = [
      'FactUnitName',
      'SourceTypeName',
      'DeptName',
      'WorkDate',
      'DelvNo',
      'ProdPlanNo',
      'OrderNo',
      'ItemName',
      'ItemNo',
      'Spec',
      'ProcName',
      'QCNo',
      'TestEndDate',
      'OrderQty',
      'StdOrderQty',
      'Qty',
      'StdQty',
      'OKQty',
      'StdOKQty',
      'RemainQty',
      'StdRemainQty',
      'BadQty',
      'StdBadQty',
      'GoodInQty',
      'StdGoodInQty',
      'NotInQty',
      'StdNotInQty',
      'UnitName',
      'UnitSeq',
      'StdUnitName',
      'StdUnitSeq',
      'LOTNo',
      'FromSerial',
      'ToSerial',
      'DeptSeq',
      'ProcSeq',
      'SourceSeq',
      'SourceKind',
      'ItemSeq',
      'QCSeq',
      'SMTestResult',
      'EmpSeq',
      'EmpName',
      'WorkCenterName',
      'WorkCenterSeq',
      'WorkTypeName',
      'CustName',
      'Remark',
      'Memo1',
      'Memo2',
      'TestDocNo',
      'SampleNo',
      'IsReCfm',
      'IsGoodInNm',
      'ItemClassSName',
      'ItemClassMName',
      'ItemClassLName',
      'ItemClassSSeq',
      'ItemClassMSeq',
      'ItemClassLSeq',
    ]

    const columnsA = [
      'FactUnitName',
      'SourceTypeName',
      'DeptName',
      'WorkDate',
      'DelvNo',
      'ProdPlanNo',
      'OrderNo',
      'ItemName',
      'ItemNo',
      'Spec',
      'ProcName',
      'QCNo',
      'TestEndDate',
      'OrderQty',
      'StdOrderQty',
      'Qty',
      'StdQty',
      'OKQty',
      'StdOKQty',
      'RemainQty',
      'StdRemainQty',
      'BadQty',
      'StdBadQty',
      'GoodInQty',
      'StdGoodInQty',
      'NotInQty',
      'StdNotInQty',
      'UnitName',
      'UnitSeq',
      'StdUnitName',
      'StdUnitSeq',
      'LOTNo',
      'FromSerial',
      'ToSerial',
      'DeptSeq',
      'ProcSeq',
      'SourceSeq',
      'SourceKind',
      'ItemSeq',
      'QCSeq',
      'SMTestResult',
      'EmpSeq',
      'EmpName',
      'WorkCenterName',
      'WorkCenterSeq',
      'WorkTypeName',
      'CustName',
      'Remark',
      'Memo1',
      'Memo2',
      'TestDocNo',
      'SampleNo',
      'IsReCfm',
      'IsGoodInNm',
      'ItemClassSName',
      'ItemClassMName',
      'ItemClassLName',
      'ItemClassSSeq',
      'ItemClassMSeq',
      'ItemClassLSeq',
    ]

    const validEntries = filterValidEntries()
    setCount(validEntries.length)
    const lastEntry = findLastEntry(validEntries)

    if (lastWordEntryRef.current?.Id !== lastEntry?.Id) {
      lastWordEntryRef.current = lastEntry
    }

    const missingIds = findMissingIds(lastEntry)
    if (missingIds.length > 0) {
      message.warning(
        'Vui lòng kiểm tra lại các mục được tạo phải theo đúng thứ tự tuần tự trước khi lưu!',
      )
      return
    }

    const resulU = filterAndSelectColumns(gridData, columnsU, 'U')
    const resulA = filterAndSelectColumns(gridData, columnsA, 'A')

    const validationMessage = validateCheckColumns(
      [...resulU, ...resulA],
      [...columnsU, ...columnsA],
      requiredColumns,
    )

    if (validationMessage !== true) {
      message.warning(validationMessage)
      return
    }

    if (isSent) return

    setIsSent(true)

    if (resulA.length > 0 || resulU.length > 0) {
      try {
        const promises = []

        if (resulA.length > 0) {
          promises.push(PostA(resulA))
        }

        if (resulU.length > 0) {
          promises.push(PostU(resulU))
        }

        const results = await Promise.all(promises)
        const updateGridData = (newData) => {
          setGridData((prevGridData) => {
            const updatedGridData = prevGridData.map((item) => {
              const matchingData = newData.find(
                (data) => data.IDX_NO === item.IdxNo,
              )

              if (matchingData) {
                return {
                  ...matchingData,
                  IdxNo: matchingData.IDX_NO,
                }
              }
              return item
            })

            return updatedGridData
          })
        }
        results.forEach((result, index) => {
          if (result.data.success) {
            const newData = result.data.data
            if (index === 0) {
              message.success('Thêm thành công!')
            } else {
              message.success('Cập nhật  thành công!')
            }

            setIsLoading(false)
            setIsSent(false)
            setEditedRows([])
            updateGridData(newData)
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
        loadingMessage()
        setIsLoading(false)
        setIsSent(false)
        message.error(error.message || 'Có lỗi xảy ra khi lưu dữ liệu')
      }
    } else {
      setIsLoading(false)
      setIsSent(false)
      message.warning('Không có dữ liệu để lưu!')
    }
  }, [editedRows])

  const handleDeleteDataSheet = useCallback(
    (e) => {
      if (canDelete === false) {
        message.warning('Bạn không có quyền xóa dữ liệu')
        return
      }

      if (isDeleting) {
        message.warning('Đang xử lý, vui lòng chờ...')
        return
      }

      const selectedRows = getSelectedRows()

      const idsWithStatusD = selectedRows
        .filter(
          (row) => !row.Status || row.Status === 'U' || row.Status === 'D',
        )
        .map((row) => {
          row.Status = 'D'
          return row
        })

      const rowsWithStatusA = selectedRows.filter((row) => row.Status === 'A')

      if (idsWithStatusD.length === 0 && rowsWithStatusA.length === 0) {
        message.warning('Vui lòng chọn các mục cần xóa!')
        setModalOpen(false)
        return
      }
      if (idsWithStatusD.length > 0) {
        setIsDeleting(true)
        PostD(idsWithStatusD)
          .then((response) => {
            message.destroy()
            if (response.data.success) {
              const remainingRows = gridData.filter(
                (row) =>
                  !idsWithStatusD.some(
                    (deletedRow) =>
                      deletedRow?.IDX_NO ||
                      deletedRow.IdxNo === row.IdxNo ||
                      row.IDX_NO,
                  ),
              )
              const updatedData = updateIndexNo(remainingRows)
              setGridData(updatedData)
              setNumRows(updatedData.length)
              resetTable()
              setModalOpen(false)
              message.success('Xóa thành công!')
            } else {
              setDataError(response.data.errors)
              setIsModalVisible(true)

              message.error(response.data.message || 'Xóa thất bại!')
            }
          })
          .catch((error) => {
            message.destroy()
            message.error('Có lỗi xảy ra khi xóa!')
          })
          .finally(() => {
            setIsDeleting(false)
          })
      }

      if (rowsWithStatusA.length > 0) {
        const idsWithStatusA = rowsWithStatusA.map((row) => row.Id)
        const remainingRows = gridData.filter(
          (row) => !idsWithStatusA.includes(row.Id),
        )
        const remainingEditedRows = editedRows.filter(
          (editedRow) => !idsWithStatusA.includes(editedRow.updatedRow.Id),
        )
        setModalOpen(false)
        message.success('Xóa thành công!')
        const updatedDataEditedRows = updateIndexNo(remainingEditedRows)
        const updatedRemainingRows = updateIndexNo(remainingRows)
        setEditedRows(updatedDataEditedRows)
        setGridData(updatedRemainingRows)
        setNumRows(remainingRows.length)
        resetTable()
      }
    },
    [canDelete, gridData, selection, editedRows, isDeleting],
  )

  const handleRestSheet = useCallback(async () => {
    const hasWHseq = gridData.some((item) => item.hasOwnProperty('WHseq'))
    if (hasWHseq) {
      fetchData()
    } else {
      const allStatusA = gridData.every((item) => item.Status === 'A')

      if (allStatusA) {
        const emptyData = generateEmptyData(20, defaultCols)
        setGridData(emptyData)
        setNumRows(emptyData.length)
      } else {
        fetchData()
      }
    }
  }, [defaultCols, gridData])

  return (
    <>
      <Helmet>
        <title>HPM - {t('800000147')}</title>
      </Helmet>
      <TopLoadingBar color="blue" height={2} ref={loadingBarRef} />
      <div className="bg-slate-50 p-3 h-screen overflow-hidden">
        <div className="flex flex-col gap-4 md:grid md:grid-cols-4 md:grid-rows-[auto_1fr] md:gap-4 h-full">
          <div className="col-start-1 col-end-5 row-start-1 w-full rounded-lg ">
            <div className="flex items-center justify-between">
              <Title level={4} className="mt-2 uppercase opacity-85 ">
                {t('800000147')}
              </Title>
              <OqcReqListActions
                setModalOpen={setModalOpen}
                handleRestSheet={handleRestSheet}
                fetchDataQuery={fetchData}
                openModal={openModal}
                handleDeleteDataSheet={handleDeleteDataSheet}
                handleSaveData={handleSaveData}
                setNumRowsToAdd={setNumRowsToAdd}
                numRowsToAdd={numRowsToAdd}
                setClickCount={setClickCount}
                clickCount={clickCount}
                handleRowAppend={handleRowAppend}
                nextPageDeatails={nextPageDeatails}
                nextPageDeatailsList={nextPageDeatailsList}
              />
            </div>
            <details
              className="group p-2 [&_summary::-webkit-details-marker]:hidden border rounded-lg bg-white"
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
                <OqcReqListQuery
                  dataBizUnit = {dataBizUnit}
                  dataSMQcType = {dataSMQcType}
                  dataIsGoodInNm = {dataIsGoodInNm}
                  dataWorkTypeName ={dataWorkTypeName}
                  dataWorkCenter = {dataWorkCenter}
                  dataCustomer = {dataCustomer}
                
                  setFactUnit ={setFactUnit}
                  setFactUnitName= {setFactUnitName}
                
                  WorkDate= {WorkDate}
                  setWorkDate ={setWorkDate}
                  WorkDateTo ={WorkDateTo}
                  setWorkDateTo = {setWorkDateTo}
                
                  TestEndDate ={TestEndDate}
                  setTestEndDate ={setTestEndDate}
                  TestEndDateTo ={TestEndDateTo}
                  setTestEndDateTo ={setTestEndDateTo}
                
                  QCDateFrom ={QCDateFrom}
                  setQCDateFrom ={setQCDateFrom}
                  QCDateTo ={QCDateTo}
                  setQCDateTo ={setQCDateTo}
                
                  DeptName ={DeptName}
                  setDeptName ={setDeptName}
                
                  IsGoodInNm ={IsGoodInNm}
                  setIsGoodInNm ={setIsGoodInNm}

                  IsGoodIn ={IsGoodIn}
                  setIsGoodIn ={setIsGoodIn}
                
                  DelvNo ={DelvNo}
                  setDelvNo ={setDelvNo}
                  SMQcTypeName= {SMQcTypeName}
                  setSMQcTypeName = {setSMQcTypeName}
                  setSMQcType ={setSMQcType}
                  LotNo ={LotNo}
                  setLotNo ={setLotNo}
                
                  QcNo ={QCNo}
                  setQcNo ={setQCNo}
                
                  WorkCenterName ={WorkCenterName}
                  setWorkCenterName= {setWorkCenterName}
                  WorkCenter ={WorkCenter}
                  setWorkCenter= {setWorkCenter}
                
                  WorkTypeName ={WorkTypeName}
                  setWorkTypeName ={setWorkTypeName}
                  WorkType ={WorkType}
                  setWorkType = {setWorkType}
                
                  CustSeq ={CustSeq}
                  setCustSeq ={setCustSeq}
                
                  ItemName ={ItemName}
                  setItemName ={setItemName}
                  ItemNo = {ItemNo}
                  setItemNo={setItemNo}
                  CustName = {CustName}
                  setCustName ={setCustName}
                />
              </div>
            </details>
          </div>

          <div className="col-start-1 col-end-5 row-start-2 w-full h-full rounded-lg  overflow-auto">
            <TableOqcReqList
              dataIsGoodInNm = {dataIsGoodInNm}
              handleRestSheet={handleRestSheet}
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
              canCreate={canCreate}
              canEdit={canEdit}
           
            />
          </div>
        </div>
      </div>
      <ErrorListModal
        dataError={dataError}
        setIsModalVisible={setIsModalVisible}
        isModalVisible={isModalVisible}
      />
      <ModalSheetDelete
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        confirm={handleDeleteDataSheet}
      />
    </>
  )
}
