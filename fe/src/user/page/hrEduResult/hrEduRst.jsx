import { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet'
import { Typography, Menu, message } from 'antd'
const { Title } = Typography
import { FilterOutlined } from '@ant-design/icons'
import { ArrowIcon } from '../../components/icons'
import dayjs from 'dayjs'
import { GetCodeHelpCombo } from '../../../features/codeHelp/getCodeHelpCombo'
import { CompactSelection, GridColumnIcon } from '@glideapps/glide-data-grid'
import { debounce } from 'lodash'

import TopLoadingBar from 'react-top-loading-bar'
import { loadFromLocalStorageSheet } from '../../../localStorage/sheet/sheet'
import { GetCodeHelpVer2 } from '../../../features/codeHelp/getCodeHelpVer2'
import { Splitter, SplitterPanel } from 'primereact/splitter'

import { updateIndexNo } from '../../components/sheet/js/updateIndexNo'
import { generateEmptyData } from '../../components/sheet/js/generateEmptyData'

import { ClipboardCheck, FileStack, MapPinOff } from 'lucide-react'
import ErrorListModal from '../default/errorListModal'
import { togglePageInteraction } from '../../../utils/togglePageInteraction'
import useDynamicFilter from '../../components/hooks/sheet/useDynamicFilter'
import { onRowAppended } from '../../components/sheet/js/onRowAppended'

import HrEduRstActions from '../../components/actions/hrEdu/hrEduRstActions'
import HrEduRstQuery from '../../components/query/hrEdu/hrEduRstQuery'
import Edu2Table from '../../components/table/edu-per-rst/edu2Table'
import Edu1Table from '../../components/table/edu-per-rst/edu1Table'
import Edu3Table from '../../components/table/edu-per-rst/edu3Table'
import TableEduRst from '../../components/table/edu-rst/tableEduRst'
import { searchEduRst } from '../../../features/mgn-hr/hr-edu-rst/searchEduRst'
import { getEduRstCost } from '../../../features/mgn-hr/hr-edu-rst/getEduRstCost'
import { getEduRstItemById } from '../../../features/mgn-hr/hr-edu-rst/getEduRstItemById'
import { HrFileQ } from '../../../features/hr/hrFile/HrFileQ'
import { useNavigate } from 'react-router-dom'
import { getEduRstCostBatch } from '../../../features/mgn-hr/hr-edu-rst/getEduRstCostBatch'
import { getEduRstPerObj } from '../../../features/mgn-hr/hr-edu-rst/getEduRstPerObj'
import { getEduRstItemByBatch } from '../../../features/mgn-hr/hr-edu-rst/getEduRstItemByBatch'
export default function HrEduRst({
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
  const activeFetchCountRef = useRef(0)
  const [isAPISuccess, setIsAPISuccess] = useState(true)
  const navigate = useNavigate()

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
        title: t('607'),
        id: 'IsEnd',
        kind: 'Boolean',
        readonly: false,
        width: 150,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: true,
        },
      },

      {
        title: t('3700'),
        id: 'EduRstType',
        kind: 'Text',
        readonly: false,
        width: 150,
        hasMenu: true,
        visible: false,
        trailingRowOptions: {
          disabled: true,
        },
        themeOverride: {
          bgIconHeader: '#DD1144',
          fontFamily: '',
        },
      },
      {
        title: t('3699'),
        id: 'EduRstTypeName',
        kind: 'Text',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: false,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('149'),
        id: 'RegDate',
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
        title: t('10467'),
        id: 'RstNo',
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
        title: t('4'),
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
        title: t('3161'),
        id: 'EmpSeq',
        kind: 'Text',
        readonly: false,
        width: 150,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: true,
        },
        themeOverride: {
          textHeader: '#DD1144',
          bgIconHeader: '#DD1144',
          fontFamily: '',
        },
      },
      {
        title: t('1452'),
        id: 'EmpID',
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
        title: t('5'),
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
        title: t('738'),
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
        title: t('373'),
        id: 'PosName',
        kind: 'Text',
        readonly: false,
        width: 150,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: true,
        },
        themeOverride: {
          textHeader: '#DD1144',
          bgIconHeader: '#DD1144',
          fontFamily: '',
        },
      },
      {
        title: t('2137'),
        id: 'PosSeq',
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
        title: t('1085'),
        id: 'UMEduGrpTypeName',
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
        title: t('1086'),
        id: 'UMEduGrpType',
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
        title: t('1087'),
        id: 'EduClassName',
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
        title: t('10479'),
        id: 'EduClassSeq',
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
        title: t('16580'),
        id: 'IsBatchReq',
        kind: 'Boolean',
        readonly: false,
        width: 150,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: true,
        },
        themeOverride: {
          textHeader: '#DD1144',
          bgIconHeader: '#DD1144',
          fontFamily: '',
        },
      },
      {
        title: t('10475'),
        id: 'EduCourseSeq',
        kind: 'Custom',
        readonly: false,
        width: 150,
        hasMenu: true,
        visible: false,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('19018'),
        id: 'EduCourseName',
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
        title: t('11225'),
        id: 'SMInOutType',
        kind: 'Text',
        readonly: false,
        width: 150,
        hasMenu: true,
        visible: false,
        trailingRowOptions: {
          disabled: true,
        },
        themeOverride: {
          textHeader: '#DD1144',
          bgIconHeader: '#DD1144',
          fontFamily: '',
        },
      },
      {
        title: t('1056'),
        id: 'SMInOutTypeName',
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
        title: t('19022'),
        id: 'UMInstitute',
        kind: 'Text',
        readonly: false,
        width: 150,
        hasMenu: true,
        visible: false,
        trailingRowOptions: {
          disabled: true,
        },
        themeOverride: {
          bgIconHeader: '#DD1144',
          fontFamily: '',
        },
      },
      {
        title: t('10476'),
        id: 'UMInstituteName',
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
        title: t('19031'),
        id: 'UMlocation',
        kind: 'Text',
        readonly: false,
        width: 150,
        hasMenu: true,
        visible: false,
        trailingRowOptions: {
          disabled: true,
        },
        themeOverride: {
          bgIconHeader: '#DD1144',
          fontFamily: '',
        },
      },
      {
        title: t('10490'),
        id: 'UMlocationName',
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
        title: t('27362'),
        id: 'Etclocation',
        kind: 'Custom',
        readonly: false,
        width: 150,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('3550'),
        id: 'LecturerSeq',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: false,
        trailingRowOptions: {
          disabled: true,
        },
      },

      {
        title: t('19413'),
        id: 'LecturerName',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: true,
        },
      },

      {
        title: t('27361'),
        id: 'EtcLecturer',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: true,
        },
      },

      {
        title: t('191'),
        id: 'EduBegDate',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('232'),
        id: 'EduEndDate',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: true,
        },
      },

      {
        title: t('423'),
        id: 'EduDd',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('1656'),
        id: 'EduTm',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: true,
        },
      },

      {
        title: t('21693'),
        id: 'EduPoint',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: true,
        },
      },

      {
        title: t('5208'),
        id: 'SatisLevelName',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: true,
        },
      },

      {
        title: t('22169'),
        id: 'SatisLevel',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: false,
        trailingRowOptions: {
          disabled: true,
        },
      },

      {
        title: t('22322'),
        id: 'SumAmt',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: true,
        },
      },

      {
        title: t('10721'),
        id: 'SumReturnAmt',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: true,
        },
      },

      {
        title: t('1648'),
        id: 'CfmEmpName',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('33652'),
        id: 'EduOkDd',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: true,
        },
      },

      {
        title: t('33653'),
        id: 'EduOkTm',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: true,
        },
      },
      {
        title: t('33654'),
        id: 'EduOkPoint',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: true,
        trailingRowOptions: {
          disabled: true,
        },
      },
    ],
    [t],
  )
  const defaultColsRstItem = useMemo(
    () => [
      {
        title: '',
        id: 'Status',
        kind: 'Text',
        readonly: true,
        width: 50,
        hasMenu: true,
        visible: true,
        themeOverride: {
          textDark: '#225588',
          baseFontStyle: '600 13px',
        },
        icon: GridColumnIcon.HeaderLookup,
      },

      {
        title: t('10468'),
        id: 'RstSeq',
        kind: 'Text',
        readonly: false,
        width: 150,
        hasMenu: true,
        visible: false,
        trailingRowOptions: { disabled: true },
      },
      {
        title: t('10566'),
        id: 'EduItemSeq',
        kind: 'Text',
        readonly: false,
        width: 150,
        hasMenu: true,
        visible: false,
        trailingRowOptions: { disabled: true },
      },

      {
        title: t('18167'),
        id: 'EduItemName',
        kind: 'Text',
        readonly: false,
        width: 280,
        hasMenu: true,
        visible: true,
        trailingRowOptions: { disabled: true },
      },
      {
        title: t('22265'),
        id: 'SMDataType',
        kind: 'Text',
        readonly: false,
        width: 300,
        hasMenu: true,
        visible: false,
        trailingRowOptions: { disabled: true },
      },
      {
        title: t('8060'),
        id: 'SMDataTypeName',
        kind: 'Text',
        readonly: false,
        width: 300,
        hasMenu: true,
        visible: true,
        trailingRowOptions: { disabled: true },
      },
      {
        title: t('9740'),
        id: 'CodeHelpConst',
        kind: 'Text',
        readonly: false,
        width: 300,
        hasMenu: true,
        visible: false,
        trailingRowOptions: { disabled: true },
      },
      {
        title: t('9743'),
        id: 'CodeHelpParams',
        kind: 'Text',
        readonly: false,
        width: 300,
        hasMenu: true,
        visible: false,
        trailingRowOptions: { disabled: true },
      },
      {
        title: t('3083'),
        id: 'RstValueText',
        kind: 'Text',
        readonly: false,
        width: 300,
        hasMenu: true,
        visible: true,
        trailingRowOptions: { disabled: true },
      },
      {
        title: t('362'),
        id: 'Rem',
        kind: 'Text',
        readonly: false,
        width: 300,
        hasMenu: true,
        visible: true,
        trailingRowOptions: { disabled: true },
      },
    ],
    [],
  )

  const defaultColsRstCost = useMemo(
    () => [
      {
        title: '',
        id: 'Status',
        kind: 'Text',
        readonly: true,
        width: 50,
        hasMenu: true,
        visible: true,
        themeOverride: {
          textDark: '#225588',
          baseFontStyle: '600 13px',
        },
        icon: GridColumnIcon.HeaderLookup,
      },
      {
        title: t('19015'),
        id: 'RstSeq',
        kind: 'Text',
        readonly: false,
        width: 220,
        hasMenu: true,
        visible: false,
        themeOverride: {
          textHeader: '#DD1144',
          bgIconHeader: '#DD1144',
          fontFamily: '',
        },
        trailingRowOptions: { disabled: true },
      },
      {
        title: t('6082'),
        id: 'UMCostItem',
        kind: 'Custom',
        readonly: false,
        width: 220,
        hasMenu: true,
        visible: false,
        themeOverride: {
          textHeader: '#DD1144',
          bgIconHeader: '#DD1144',
          fontFamily: '',
        },
        trailingRowOptions: { disabled: true },
      },
      {
        title: t('1054'),
        id: 'UMCostItemName',
        kind: 'Text',
        readonly: false,
        width: 220,
        hasMenu: true,
        visible: true,
        themeOverride: {
          bgIconHeader: '#DD1144',
          fontFamily: '',
        },
        trailingRowOptions: { disabled: true },
      },
      {
        title: t('8654'),
        id: 'RstCost',
        kind: 'Text',
        readonly: false,
        width: 220,
        hasMenu: true,
        visible: true,
        trailingRowOptions: { disabled: true },
      },
      {
        title: t('19237'),
        id: 'IsReturnItem',
        kind: 'Boolean',
        readonly: false,
        width: 220,
        hasMenu: true,
        visible: true,
        trailingRowOptions: { disabled: true },
      },
      {
        title: t('10722'),
        id: 'IsInsur',
        kind: 'Boolean',
        readonly: false,
        width: 220,
        hasMenu: true,
        visible: true,
        trailingRowOptions: { disabled: true },
      },
      {
        title: t('10719'),
        id: 'ReturnAmt',
        kind: 'Text',
        readonly: false,
        width: 220,
        hasMenu: true,
        visible: true,
        trailingRowOptions: { disabled: true },
      },

      {
        title: t('362'),
        id: 'Rem',
        kind: 'Text',
        readonly: false,
        width: 220,
        hasMenu: true,
        visible: true,
        trailingRowOptions: { disabled: true },
      },
      {
        title: t('16518'),
        id: 'UMCostItemOld',
        kind: 'Text',
        readonly: false,
        width: 220,
        hasMenu: true,
        visible: false,
        trailingRowOptions: { disabled: true },
      },
    ],
    [],
  )

  const defaultcolsFile = useMemo(
    () => [
      {
        title: '',
        id: 'Status',
        kind: 'Text',
        readonly: true,
        width: 50,
        hasMenu: true,
        visible: true,
        themeOverride: {
          textDark: '#225588',
          baseFontStyle: '600 13px',
        },
        icon: GridColumnIcon.HeaderLookup,
      },
      {
        title: 'Originalname',
        id: 'Originalname',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: true,
        trailingRowOptions: { disabled: true },
      },
      {
        title: 'Filename',
        id: 'Filename',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: true,
        trailingRowOptions: { disabled: true },
      },
      {
        title: 'Size',
        id: 'Size',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: true,
        trailingRowOptions: { disabled: true },
      },
      {
        title: 'Path',
        id: 'Path',
        kind: 'Text',
        readonly: false,
        width: 200,
        hasMenu: true,
        visible: true,
        trailingRowOptions: { disabled: true },
      },
    ],
    [],
  )

  const [isSent, setIsSent] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [showSearch13, setShowSearch13] = useState(false)
  const [showSearch15, setShowSearch15] = useState(false)
  const [showSearch4, setShowSearch4] = useState(false)

  const [loading, setLoading] = useState(false)

  const [gridData, setGridData] = useState([])

  const [gridDataRstItem, setGridDataRstItem] = useState([])
  const [gridDataRstCost, setGridDataRstCost] = useState([])
  const [gridDataFile, setGridDataFile] = useState([])

  const [numRows, setNumRows] = useState(0)
  const [numRowsDeptHis, setNumRowsDeptHis] = useState(0)
  const [numRowsOrgDept, setNumRowsOrgDept] = useState(0)
  const [numRows15, setNumRows15] = useState(0)

  const [addedRows, setAddedRows] = useState([])
  const [numRowsToAdd, setNumRowsToAdd] = useState(null)

  const [numRowsRstItem, setNumRowsRstItem] = useState(0)

  const [numRowsRstCost, setNumRowsRstCost] = useState(0)

  const [SMDeptTypeData, setSMDeptTypeDataData] = useState([])
  const [UMEduGrpTypeData, setUMEduGrpTypeData] = useState([])
  const [SMDeptType, setSMDeptType] = useState('')

  const [IsUse, setIsUse] = useState([])

  const [QBegDate, setQBegDate] = useState(null)
  const [QEndDate, setQEndDate] = useState(null)

  const [DeptName, setDeptName] = useState('')
  const [DeptSeq, setDeptSeq] = useState('')

  const [TaxNameData, setTaxNameData] = useState([])
  const [AccUnitNameData, setAccUnitNameData] = useState([])
  const [BizUnitNameData, setBizUnitNameData] = useState([])
  const [SlipUnitNameData, setSlipUnitNameData] = useState([])
  const [FactUnitNameData, setFactUnitNameData] = useState([])
  const [UMCostTypeData, setUMCostTypeData] = useState([])

  const [highClassData, setHighClassData] = useState([])
  const [midClassData, setMidClassData] = useState([])
  const [classData, setClassData] = useState([])

  const [eduTypeData, setEduTypeData] = useState([])
  const [courseData, setCourseData] = useState([])

  const [eduRstTypeNameData, setEduRstTypeNameData] = useState([])
  const [eduRstTypeName, setEduRstTypeName] = useState('')
  const [eduRstType, setEduRstType] = useState('')

  const [umEduHighClassName, setUMEduHighClassName] = useState('')
  const [umEduHighClass, setUMEduHighClass] = useState(null)

  const [umEduMidClassName, setUMEduMidClassName] = useState('')
  const [umEduMidClass, setUMEduMidClass] = useState(null)

  const [regBegDate, setRegBegDate] = useState(null)
  const [regEndDate, setRegEndDate] = useState(null)

  const [cfmEmpName, setCfmEmpName] = useState('')
  const [cfmEmpSeq, setCfmEmpSeq] = useState('')
  const [cfmUserId, setCfmUserId] = useState('')
  const [cfmEmpData, setCfmEmpData] = useState([])

  const [eduClassName, setEduClassName] = useState('')
  const [eduClass, setEduClass] = useState(null)
  const [eduTypeName, setEduTypeName] = useState('')
  const [eduTypeSeq, setEduTypeSeq] = useState(null)
  const [eduCourseName, setEduCourseName] = useState('')
  const [eduCourseSeq, setEduCourseSeq] = useState(null)
  const [selectEmp, setSelectEmp] = useState(null)

  const [deptData, setDeptData] = useState([])
  const [deptSearchSh, setDeptSearchSh] = useState('')
  const [selectionDept, setSelectionDept] = useState('')

  const [gridDeptRef, setGridDeptRef] = useState([])

  const [dataUser, setDataUser] = useState([])
  const [empName, setEmpName] = useState('')
  const [empSeq, setEmpSeq] = useState('')
  const [userId, setUserId] = useState('')

  const [helpData08, setHelpData08] = useState([])
  const [helpData09, setHelpData09] = useState([])
  const [helpData12, setHelpData12] = useState([])

  const [editedRows, setEditedRows] = useState([])
  const [editedRowsDeptHis, setEditedRowsDeptHis] = useState([])
  const [editedRowsOrgDept, setEditedRowsOrgDept] = useState([])
  const [addedRowsMgn, setAddedRowsMgn] = useState([])
  const [numRowsToAddMgn, setNumRowsToAddMgn] = useState(null)
  const [addedRowsMold, setAddedRowsMold] = useState([])
  const [numRowsToAddMold, setNumRowsToAddMold] = useState(null)
  const [dataSheetSearch, setDataSheetSearch] = useState([])

  const [FactUnit, setFactUnit] = useState('')

  const [current, setCurrent] = useState('1')
  const secretKey = 'KEY_PATH'
  const [modal2Open, setModal2Open] = useState(false)
  const [errorData, setErrorData] = useState(null)
  const [checkPageA, setCheckPageA] = useState(false)
  const formatDate = (date) => date.format('YYYYMMDD')
  const formatDateSearch = (date) => {
    const d = dayjs(date)
    return d.isValid() ? d.format('YYYYMMDD') : ''
  }
  const [cols, setCols] = useState(() =>
    loadFromLocalStorageSheet(
      'EDU_RST_LIST',
      defaultCols.filter((col) => col.visible),
    ),
  )
  const [selection, setSelection] = useState({
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty(),
  })

  const [selectionDeptHis, setSelectionDeptHis] = useState({
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty(),
  })

  const [colsRstItem, setColsRstItem] = useState(() =>
    loadFromLocalStorageSheet(
      'edu_rst_item_a',
      defaultColsRstItem.filter((col) => col.visible),
    ),
  )

  const [colsRstCost, setColsRstCost] = useState(() =>
    loadFromLocalStorageSheet(
      'edu_rst_cost_a',
      defaultColsRstCost.filter((col) => col.visible),
    ),
  )

  const [colsFile, setColsFile] = useState(() =>
    loadFromLocalStorageSheet(
      'asset_file_a',
      defaultcolsFile.filter((col) => col.visible),
    ),
  )
  const [selectionDeptOrg, setSelectionDeptOrg] = useState({
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty(),
  })

  const [selectionRstItem, setSelectionRstItem] = useState({
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty(),
  })

  const [selectionRstCost, setSelectionRstCost] = useState({
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty(),
  })

  const [selectionFile, setSelectionFile] = useState({
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty(),
  })

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
        HighClassData,
        MidClassData,
        ClassData,
        UMEduGrpTypeData,
        EduTypeData,
        CourseData,
        EduRstTypeNameData,
        DeptData,
        dataUser,
      ] = await Promise.all([
        GetCodeHelpVer2(
          19999,
          '',
          '3907',
          '',
          '',
          '',
          '1',
          '',
          50,
          "IsUse = ''1''",
          0,
          0,
          0,
        ),
        GetCodeHelpVer2(
          19999,
          '',
          '3095',
          '',
          '',
          '',
          '1',
          '',
          50,
          "IsUse = ''1''",
          0,
          0,
          0,
        ),

        GetCodeHelpVer2(20017, '', '', '', '', '', '', '1', 50, '', 0, 0, 0),
        GetCodeHelpCombo('', 6, 19999, 1, '%', '3908', '', '', '', signal),
        GetCodeHelpVer2(20021, '', '', '', '', '', '1', '', 50, '', 0, 0, 0),

        GetCodeHelpVer2(20019, '', '', '', '', '', '1', '1', 50, '', 0, 0, 0),
        GetCodeHelpCombo('', 6, 19999, 1, '%', '3204', '', '', '', signal),

        GetCodeHelpVer2(
          10010,
          '',
          '',
          '',
          '',
          '',
          '1',
          '1',
          50,
          "IsUse = ''1''",
          0,
          0,
          0,
        ),

        GetCodeHelpVer2(
          10009,
          '',
          '',
          '',
          '',
          '',
          '1',
          '1',
          50,
          "IsUse = ''1''",
          0,
          0,
          0,
        ),
      ])

      setHighClassData(HighClassData?.data)
      setMidClassData(MidClassData?.data)
      setClassData(ClassData?.data)
      setUMEduGrpTypeData(UMEduGrpTypeData?.data || [])
      setEduTypeData(EduTypeData?.data)
      setCourseData(CourseData?.data)
      setEduRstTypeNameData(EduRstTypeNameData?.data)
      setDeptData(DeptData?.data)
      setDataUser(dataUser?.data)
    } catch {
      setHighClassData([])
      setMidClassData([])
      setClassData([])
      setUMEduGrpTypeData([])
      setEduTypeData([])
      setCourseData([])
      setEduRstTypeNameData([])
      setDeptData([])
      setDataUser([])
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

  const getSelectedRowsData = () => {
    const selectedRows = selection.rows.items

    return selectedRows.flatMap(([start, end]) =>
      Array.from({ length: end - start }, (_, i) => gridData[start + i]).filter(
        (row) => row !== undefined,
      ),
    )
  }

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

  const handleRowAppendRstItem = useCallback(
    (numRowsToAddMgn) => {
      if (canCreate === false) {
        return
      }
      onRowAppended(
        colsRstItem,
        setGridDataRstItem,
        setNumRowsRstItem,
        setAddedRowsMgn,
        numRowsToAddMgn,
      )
    },
    [
      colsRstItem,
      setGridDataRstItem,
      setNumRowsRstItem,
      setAddedRowsMgn,
      numRowsToAddMgn,
    ],
  )

  const handleRowAppendRstCost = useCallback(
    (numRowsToAddMold) => {
      if (canCreate === false) {
        return
      }
      onRowAppended(
        colsRstCost,
        setGridDataRstCost,
        setNumRowsRstCost,
        setAddedRowsMold,
        numRowsToAddMold,
      )
    },
    [
      colsRstCost,
      setGridDataRstCost,
      setNumRowsRstCost,
      setAddedRowsMold,
      numRowsToAddMold,
    ],
  )

  const [modalOpen, setModalOpen] = useState(false)

  const [isMinusClicked, setIsMinusClicked] = useState(false)
  const [lastClickedCell, setLastClickedCell] = useState(null)
  const [clickedRowData, setClickedRowData] = useState(null)
  const [eduRstSelected, setEduRstSelected] = useState([])

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
          const rowData = gridData[rowIndex]

          const isSelected = selection.rows.hasIndex(rowIndex)

          let newSelected
          if (isSelected) {
            newSelected = selection.rows.remove(rowIndex)
            setEduRstSelected(getSelectedRowsData())
            fetchDataEduRst(rowData)
          } else {
            newSelected = selection.rows.add(rowIndex)
            setEduRstSelected([])
          }
        }
      }
    },
    [gridData, getSelectedRowsData, eduRstSelected],
  )

  const increaseFetchCount = () => {
    activeFetchCountRef.current += 1
  }

  const decreaseFetchCount = () => {
    activeFetchCountRef.current -= 1
    if (activeFetchCountRef.current === 0) {
      loadingBarRef.current?.complete()
      togglePageInteraction(false)
    }
  }

  const fetchGenericData = async ({
    controllerKey,
    postFunction,
    searchParams,
    useEmptyData = true,
    defaultCols,
    afterFetch = () => {},
  }) => {
    increaseFetchCount()

    if (controllers.current[controllerKey]) {
      controllers.current[controllerKey].abort()
      await new Promise((resolve) => setTimeout(resolve, 10))
      return fetchGenericData({
        controllerKey,
        postFunction,
        searchParams,
        afterFetch,
        defaultCols,
        useEmptyData,
      })
    }

    const controller = new AbortController()
    controllers.current[controllerKey] = controller
    const { signal } = controller

    togglePageInteraction(true)
    loadingBarRef.current?.continuousStart()

    try {
      const response = await postFunction(searchParams, signal)
      if (!response.success) {
        HandleError([
          {
            success: false,
            message: response.message || 'Đã xảy ra lỗi vui lòng thử lại!',
          },
        ])
      }
      const data = response.success ? response.data || [] : []

      let mergedData = updateIndexNo(data)

      if (useEmptyData) {
        const emptyData = updateIndexNo(generateEmptyData(100, defaultCols))
        mergedData = updateIndexNo([...data, ...emptyData])
      }

      await afterFetch(mergedData)
    } catch (error) {
      let emptyData = []

      if (useEmptyData) {
        emptyData = updateIndexNo(generateEmptyData(100, defaultCols))
      }

      await afterFetch(emptyData)
    } finally {
      decreaseFetchCount()
      controllers.current[controllerKey] = null
      togglePageInteraction(false)
      loadingBarRef.current?.complete()
    }
  }

  const fetchDataEduRst = useCallback(async (data) => {
    if (!isAPISuccess) {
      message.warning('Không thể thực hiện, vui lòng kiểm tra trạng thái.')
      return
    }

    if (controllers.current && controllers.current.fetchDataEduRst) {
      controllers.current.fetchDataEduRst.abort()
      controllers.current.fetchDataEduRst = null
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

    controllers.current.fetchDataEduRst = controller

    setIsAPISuccess(false)

    try {

      if (data.IsBatchReq === '0' || data.IsEnd === '1') {
        const searchParams = [
          {
            RstSeq: data?.RstSeq || 0,
            ReqSeq: data?.ReqSeq || 0,
          },
        ]

        fetchGenericData({
          controllerKey: 'getEduRstCostBatch',
          postFunction: getEduRstCostBatch,
          searchParams: searchParams,
          useEmptyData: false,
          defaultCols: defaultColsRstCost,
          afterFetch: (data) => {
            setGridDataRstCost(data)
            setNumRowsRstCost(data.length)
          },
        })

        const searchParamsRstItem = [
          {
            ReqSeq: data?.ReqSeq || 0,
            RstSeq: data?.RstSeq || 0,
            EduTypeSeq: data?.EduTypeSeq,
            IsSearch: 1,
          },
        ]

        fetchGenericData({
          controllerKey: 'getEduRstItemByBatch',
          postFunction: getEduRstItemByBatch,
          searchParams: searchParamsRstItem,
          useEmptyData: false,
          defaultCols: defaultColsRstItem,
          afterFetch: (data) => {
            setGridDataRstItem(data)
            setNumRowsRstItem(data.length)
          },
        })

        const searchParamsFile = {
          KeyItem1: data?.RstSeq || 0,
          KeyItem2: 'FILE_EDU_RESULT',
          KeyItem3: '',
        }

        fetchGenericData({
          controllerKey: 'HrFileQ2',
          postFunction: HrFileQ,
          searchParams: searchParamsFile,
          useEmptyData: false,
          defaultCols: defaultcolsFile,
          afterFetch: (data) => {
            setGridDataFile(data)
            setNumRows15(data.length)
          },
        })
      } else {
        const searchParams = [
          {
            RstSeq: data?.RstSeq || 0,
            ReqSeq: data?.ReqSeq || 0,
          },
        ]

        fetchGenericData({
          controllerKey: 'getEduRstCost',
          postFunction: getEduRstCost,
          searchParams: searchParams,
          useEmptyData: false,
          defaultCols: defaultColsRstCost,
          afterFetch: (data) => {
            setGridDataRstCost(data)
            setNumRowsRstCost(data.length)
          },
        })

        const searchParamsRstItem = [
          {
            ReqSeq: data?.ReqSeq || 0,
            RstSeq: data?.RstSeq || 0,
            EduTypeSeq: data?.EduTypeSeq,
            IsSearch: 1,
          },
        ]

        fetchGenericData({
          controllerKey: 'getEduRstItemById',
          postFunction: getEduRstItemById,
          searchParams: searchParamsRstItem,
          useEmptyData: false,
          defaultCols: defaultColsRstItem,
          afterFetch: (data) => {
            setGridDataRstItem(data)
            setNumRowsRstItem(data.length)
          },
        })

        const searchParamsFile = {
          KeyItem1: data?.RstSeq || 0,
          KeyItem2: 'FILE_EDU_RESULT',
          KeyItem3: '',
        }

        fetchGenericData({
          controllerKey: 'HrFileQ2',
          postFunction: HrFileQ,
          searchParams: searchParamsFile,
          useEmptyData: false,
          defaultCols: defaultcolsFile,
          afterFetch: (data) => {
            setGridDataFile(data)
            setNumRows15(data.length)
          },
        })
      }
    } catch (error) {
      const emptyData = generateEmptyData(0, defaultCols)
      const updatedEmptyData = updateIndexNo(emptyData)
      setGridData(updatedEmptyData)
      setNumRows(emptyData.length)
    } finally {
      setIsAPISuccess(true)
      controllers.current.fetchDataEduRst = null
      if (loadingBarRef.current) {
        loadingBarRef.current.complete()
      }
    }
  }, [])

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
          RstNo: '',
          RegBegDate: regBegDate ? dayjs(regBegDate).format('YYYYMMDD') : null,
          RegEndDate: regEndDate ? dayjs(regEndDate).format('YYYYMMDD') : null,
          EduRstType: eduRstType,
          UMEduGrpType: '',
          EduTypeSeq: eduTypeSeq,
          UMEduHighClass: umEduHighClass,
          UMEduMidClass: umEduMidClass,
          EduClassSeq: eduClass,
          EduCourseSeq: eduCourseSeq,
          DeptSeq: DeptSeq,
          CfmEmpSeq: cfmEmpSeq,
          EmpSeq: empSeq,
          IsConfirm: 1,
          IsNotConfirm: 1,
        },
      ]

      const response = await searchEduRst(data)
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
  }, [
    QBegDate,
    QEndDate,
    SMDeptType,
    IsUse,
    DeptName,
    empSeq,
    cfmEmpSeq,
    DeptSeq,
    eduRstType,
    eduTypeSeq,
    umEduHighClass,
    umEduMidClass,
    eduClass,
    eduCourseSeq,
    regBegDate,
    regEndDate,
  ])

  const nextPage = useCallback(() => {
    if (eduRstSelected.length > 0) {
      if (
        eduRstSelected[0].IsBatchReq === '0' ||
        eduRstSelected[0].IsEnd === '1'
      ) {
        navigate(`/hr/edu-result/edu-rst-batch`, { state: { eduRstSelected } })
      } else {
        navigate(`/hr/edu-result/edu-per-rst`, { state: { eduRstSelected } })
      }
    }
  }, [navigate, eduRstSelected])

  return (
    <>
      <Helmet>
        <title>ITM - {t('10040787')}</title>
      </Helmet>
      <TopLoadingBar color="blue" height={2} ref={loadingBarRef} />
      <div className="bg-slate-50 h-[calc(100vh-40px)] overflow-hidden">
        <div className="flex flex-col h-full">
          <div className="col-start-1 col-end-5 row-start-1 w-full">
            <div className="flex items-center justify-between">
              <Title level={4} className="m-2 uppercase opacity-85 ">
                {t('10040787')}
              </Title>
              <HrEduRstActions
                setModalOpen={setModalOpen}
                onClickSearch={onClickSearch}
                onClickPerRst={nextPage}
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
                <HrEduRstQuery
                  HighClassData={highClassData}
                  setHighClassData={setHighClassData}
                  MidClassData={midClassData}
                  setMidClassData={setMidClassData}
                  ClassData={classData}
                  setClassData={setClassData}
                  UMEduGrpTypeData={UMEduGrpTypeData}
                  EduTypeData={eduTypeData}
                  setEduTypeData={setEduTypeData}
                  CourseData={courseData}
                  setCourseData={setCourseData}
                  EduRstTypeNameData={eduRstTypeNameData}
                  EduRstTypeName={eduRstTypeName}
                  setEduRstTypeName={setEduRstTypeName}
                  UMEduHighClassName={umEduHighClassName}
                  setUMEduHighClassName={setUMEduHighClassName}
                  UMEduHighClass={umEduHighClass}
                  setUMEduHighClass={setUMEduHighClass}
                  UMEduMidClassName={umEduMidClassName}
                  setUMEduMidClassName={setUMEduMidClassName}
                  UMEduMidClass={umEduMidClass}
                  setUMEduMidClass={setUMEduMidClass}
                  // UMEduGrpType={umEduGrpType}
                  IsUse={IsUse}
                  setIsUse={setIsUse}
                  RegBegDate={regBegDate}
                  setRegBegDate={setRegBegDate}
                  RegEndDate={regEndDate}
                  setRegEndDate={setRegEndDate}
                  cfmEmpName={cfmEmpName}
                  setCfmEmpName={setCfmEmpName}
                  cfmEmpSeq={cfmEmpSeq}
                  setCfmEmpSeq={setCfmEmpSeq}
                  CfmUserId={cfmUserId}
                  setCfmUserId={setCfmUserId}
                  CfmEmpData={dataUser}
                  eduClassName={eduClassName}
                  setEduClassName={setEduClassName}
                  eduClass={eduClass}
                  setEduClass={setEduClass}
                  eduTypeName={eduTypeName}
                  setEduTypeName={setEduTypeName}
                  setEduTypeSeq={setEduTypeSeq}
                  EduCourseName={eduCourseName}
                  setEduCourseName={setEduCourseName}
                  setEduCourseSeq={setEduCourseSeq}
                  setSelectEmp={setSelectEmp}
                  DeptData={deptData}
                  deptSearchSh={deptSearchSh}
                  setDeptSearchSh={setDeptSearchSh}
                  selectionDept={selectionDept}
                  setSelectionDept={setSelectionDept}
                  deptName={DeptName}
                  setDeptName={setDeptName}
                  deptSeq={DeptSeq}
                  setDeptSeq={setDeptSeq}
                  gridDeptRef={gridDeptRef}
                  dataUser={dataUser}
                  empName={empName}
                  setEmpName={setEmpName}
                  empSeq={empSeq}
                  setEmpSeq={setEmpSeq}
                  userId={userId}
                  setUserId={setUserId}
                />
              </div>
            </details>
          </div>
          <div className="col-start-1 col-end-5 row-start-2 w-full h-full border-t overflow-hidden">
            <Splitter className="w-full h-full" layout="vertical">
              <SplitterPanel size={33} minSize={10}>
                <div className="h-full overflow-auto">
                  <TableEduRst
                    SMDeptTypeData={SMDeptTypeData}
                    TaxNameData={TaxNameData}
                    AccUnitNameData={AccUnitNameData}
                    BizUnitNameData={BizUnitNameData}
                    SlipUnitNameData={SlipUnitNameData}
                    FactUnitNameData={FactUnitNameData}
                    UMCostTypeData={UMCostTypeData}
                    setSelection={setSelection}
                    showSearch={showSearch}
                    setShowSearch={setShowSearch}
                    selection={selection}
                    canEdit={canEdit}
                    cols={cols}
                    setCols={setCols}
                    setGridData={setGridData}
                    gridData={gridData}
                    defaultCols={defaultCols}
                    setNumRows={setNumRows}
                    numRows={numRows}
                    helpData09={helpData09}
                    setHelpData09={setHelpData09}
                    helpData08={helpData08}
                    setHelpData08={setHelpData08}
                    FactUnit={FactUnit}
                    setHelpData12={setHelpData12}
                    helpData12={helpData12}
                    setEditedRows={setEditedRows}
                    handleRowAppend={handleRowAppend}
                    onCellClicked={onCellClicked}
                  />
                </div>
              </SplitterPanel>

              <SplitterPanel size={55} minSize={20}>
                <div className="h-full flex flex-col">
                  <Menu
                    mode="horizontal"
                    selectedKeys={[current]}
                    onClick={(e) => {
                      if (!checkPageA) {
                        setCurrent(e.key)
                      } else {
                        message.warning(t('870000042'))
                      }
                    }}
                    className="border-b"
                    items={[
                      {
                        key: '1',
                        label: (
                          <span className="flex items-center gap-1">
                            <ClipboardCheck size={14} />
                            {t('19026')}
                          </span>
                        ),
                      },

                      {
                        key: '2',
                        label: (
                          <span className="flex items-center gap-1">
                            <FileStack size={14} />
                            {t('20895')}
                          </span>
                        ),
                      },
                      {
                        key: '3',
                        label: (
                          <span className="flex items-center gap-1">
                            <MapPinOff size={14} />
                            {t('18124')}
                          </span>
                        ),
                      },
                    ]}
                  />
                  <div className="flex-1 overflow-auto">
                    {current === '1' && (
                      <>
                        <Edu1Table
                          setSelection={setSelectionRstCost}
                          selection={selectionRstCost}
                          showSearch={showSearch13}
                          setShowSearch={setShowSearch13}
                          numRows={numRowsRstCost}
                          setGridData={setGridDataRstCost}
                          gridData={gridDataRstCost}
                          setNumRows={setNumRowsRstCost}
                          setCols={setColsRstCost}
                          cols={colsRstCost}
                          defaultCols={defaultColsRstCost}
                          canEdit={canEdit}
                          canCreate={canCreate}
                          handleRowAppend={handleRowAppendRstCost}
                          fetchGenericData={fetchGenericData}
                        />
                      </>
                    )}

                    {current === '2' && (
                      <>
                        <Edu2Table
                          setSelection={setSelectionFile}
                          selection={selectionFile}
                          showSearch={showSearch15}
                          setShowSearch={setShowSearch15}
                          numRows={numRows15}
                          setGridData={setGridDataFile}
                          gridData={gridDataFile}
                          setNumRows={setNumRows15}
                          setCols={setColsFile}
                          cols={colsFile}
                          defaultCols={defaultcolsFile}
                          canEdit={canEdit}
                          canCreate={canCreate}
                          dataSheetSearch={dataSheetSearch}
                        />
                      </>
                    )}
                    {current === '3' && (
                      <>
                        <Edu3Table
                          setSelection={setSelectionRstItem}
                          selection={selectionRstItem}
                          showSearch={showSearch4}
                          setShowSearch={setShowSearch4}
                          numRows={numRowsRstItem}
                          setGridData={setGridDataRstItem}
                          gridData={gridDataRstItem}
                          setNumRows={setNumRowsRstItem}
                          setCols={setColsRstItem}
                          cols={colsRstItem}
                          defaultCols={defaultColsRstItem}
                          canEdit={canEdit}
                          canCreate={canCreate}
                          handleRowAppend={handleRowAppendRstItem}
                          helpData09={helpData09}
                          setHelpData09={setHelpData09}
                          fetchGenericData={fetchGenericData}
                        />
                      </>
                    )}
                  </div>
                </div>
              </SplitterPanel>
            </Splitter>
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
