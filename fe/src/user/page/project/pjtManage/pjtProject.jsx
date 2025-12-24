import { FilterOutlined } from '@ant-design/icons'
import { CompactSelection, GridColumnIcon } from '@glideapps/glide-data-grid'
import { Menu, message, Typography } from 'antd'
import dayjs from 'dayjs'
import { debounce } from 'lodash'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Helmet } from 'react-helmet'
import { useTranslation } from 'react-i18next'
import { GetCodeHelpCombo } from '../../../../features/codeHelp/getCodeHelpCombo'
import { ArrowIcon } from '../../../components/icons'
const { Title } = Typography

import TopLoadingBar from 'react-top-loading-bar'
import { GetCodeHelpVer2 } from '../../../../features/codeHelp/getCodeHelpVer2'
import { loadFromLocalStorageSheet } from '../../../../localStorage/sheet/sheet'

import { generateEmptyData } from '../../../components/sheet/js/generateEmptyData'
import { updateIndexNo } from '../../../components/sheet/js/updateIndexNo'

import { ClipboardCheck, FileStack } from 'lucide-react'
import { togglePageInteraction } from '../../../../utils/togglePageInteraction'
import { onRowAppended } from '../../../components/sheet/js/onRowAppended'
import ErrorListModal from '../../default/errorListModal'

import { useLocation } from 'react-router-dom'
import { auPjtProject } from '../../../../features/mgn-hr/pjt-project/AuPjtProject'
import { deletePjt } from '../../../../features/mgn-hr/pjt-project/deletePjt'
import { deletePjtDelv } from '../../../../features/mgn-hr/pjt-project/deletePjtDelv'
import { deletePjtItem } from '../../../../features/mgn-hr/pjt-project/deletePjtItem'
import { searchPjtProjectDetail } from '../../../../features/mgn-hr/pjt-project/searchPjtProjectDetail'
import { filterValidRows } from '../../../../utils/filterUorA'
import PjtProjectAction from '../../../components/actions/pjtProject/pjtProjectAction'
import ModalConfirm from '../../../components/modal/transReqMat/modalConfirm'
import PjtProjectQuery from '../../../components/query/pjtProject/pjtProjectQuery'
import PjtProjectItemTable from '../../../components/table/pjt-project/pjtProjectItemTable'
import PjtProjectTable from '../../../components/table/pjt-project/pjtProjectTable'
import { confirmPjtProject } from '../../../../features/mgn-hr/pjt-project/confirmPjtProject'
export default function PjtProject({
  permissions,
  isMobile,
  canCreate,
  canEdit,
  canDelete,
  controllers,
  cancelAllRequests,
}) {
  const { t } = useTranslation()
  const location = useLocation()
  const loadingBarRef = useRef(null)
  const activeFetchCountRef = useRef(0)
  const [isAPISuccess, setIsAPISuccess] = useState(true)
  const dataSelect = location.state?.selected || []
  const userInfo = localStorage.getItem('userInfo')
  const parsedUserInfo = JSON.parse(userInfo)
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
          disabled: false,
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
  const defaultColsItemDelv = useMemo(
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
        title: t('2092'),
        id: 'SMDelvTypeName',
        kind: 'Text',
        readonly: false,
        width: 150,
        hasMenu: true,
        visible: true,
        trailingRowOptions: { disabled: true },
      },
      {
        title: t('689'),
        id: 'DelvExpectDate',
        kind: 'Text',
        readonly: false,
        width: 280,
        hasMenu: true,
        visible: true,
        trailingRowOptions: { disabled: true },
        themeOverride: {
          textHeader: '#DD1144',
          bgIconHeader: '#DD1144',
          fontFamily: '',
        },
      },
      {
        title: t('5705'),
        id: 'ChangeDeliveyDate',
        kind: 'Text',
        readonly: false,
        width: 280,
        hasMenu: true,
        visible: true,
        trailingRowOptions: { disabled: true },
      },
      {
        title: t('2090'),
        id: 'ItemName',
        kind: 'Custom',
        readonly: false,
        width: 150,
        hasMenu: true,
        visible: true,
        trailingRowOptions: { disabled: true },
        themeOverride: {
          textHeader: '#DD1144',
          bgIconHeader: '#DD1144',
          fontFamily: '',
        },
      },

      {
        title: t('2091'),
        id: 'ItemNo',
        kind: 'Text',
        readonly: false,
        width: 280,
        hasMenu: true,
        visible: true,
        trailingRowOptions: { disabled: true },
      },
      {
        title: t('551'),
        id: 'Spec',
        kind: 'Text',
        readonly: false,
        width: 300,
        hasMenu: true,
        visible: false,
        trailingRowOptions: { disabled: true },
      },
      {
        title: t('602'),
        id: 'UnitName',
        kind: 'Text',
        readonly: false,
        width: 300,
        hasMenu: true,
        visible: true,
        trailingRowOptions: { disabled: true },
      },
      {
        title: t('602'),
        id: 'UnitSeq',
        kind: 'Text',
        readonly: false,
        width: 150,
        hasMenu: true,
        visible: false,
        trailingRowOptions: { disabled: true },
      },
      {
        title: t('2336'),
        id: 'DelvQty',
        kind: 'Text',
        readonly: false,
        width: 300,
        hasMenu: true,
        visible: true,
        trailingRowOptions: { disabled: true },
      },
      {
        title: t('23343'),
        id: 'ISPJTSales',
        kind: 'Boolean',
        readonly: false,
        width: 300,
        hasMenu: true,
        visible: true,
        trailingRowOptions: { disabled: true },
      },
      {
        title: t('4631'),
        id: 'DelvPrice',
        kind: 'Text',
        readonly: false,
        width: 300,
        hasMenu: true,
        visible: true,
        trailingRowOptions: { disabled: true },
      },
      {
        title: t('4629'),
        id: 'DelvAmt',
        kind: 'Text',
        readonly: false,
        width: 300,
        hasMenu: true,
        visible: true,
        trailingRowOptions: { disabled: true },
      },
      {
        title: t('4632'),
        id: 'DelvVatAmt',
        kind: 'Text',
        readonly: false,
        width: 300,
        hasMenu: true,
        visible: true,
        trailingRowOptions: { disabled: true },
      },

      {
        title: t('4659'),
        id: 'SumDelvAmt',
        kind: 'Text',
        readonly: false,
        width: 300,
        hasMenu: true,
        visible: true,
        trailingRowOptions: { disabled: true },
      },

      {
        title: t('698'),
        id: 'DelvCustName',
        kind: 'Custom',
        readonly: false,
        width: 300,
        hasMenu: true,
        visible: true,
        trailingRowOptions: { disabled: true },
      },
      {
        title: t('362'),
        id: 'Remark',
        kind: 'Text',
        readonly: false,
        width: 300,
        hasMenu: true,
        visible: true,
        trailingRowOptions: { disabled: true },
      },
      {
        title: t('4640'),
        id: 'DelvDomPrice',
        kind: 'Text',
        readonly: false,
        width: 300,
        hasMenu: true,
        visible: true,
        trailingRowOptions: { disabled: true },
      },

      {
        title: t('4639'),
        id: 'DelvDomAmt',
        kind: 'Text',
        readonly: false,
        width: 300,
        hasMenu: true,
        visible: true,
        trailingRowOptions: { disabled: true },
      },

      {
        title: t('4642'),
        id: 'SumDelvDomAmt',
        kind: 'Text',
        readonly: false,
        width: 300,
        hasMenu: true,
        visible: true,
        trailingRowOptions: { disabled: true },
      },

      {
        title: t('720'),
        id: 'WBSName',
        kind: 'Text',
        readonly: false,
        width: 300,
        hasMenu: true,
        visible: true,
        trailingRowOptions: { disabled: true },
      },

      {
        title: t('720'),
        id: 'WBSName',
        kind: 'Text',
        readonly: false,
        width: 300,
        hasMenu: true,
        visible: true,
        trailingRowOptions: { disabled: true },
      },

      {
        title: t('720'),
        id: 'WBSSeq',
        kind: 'Text',
        readonly: false,
        width: 300,
        hasMenu: true,
        visible: false,
        trailingRowOptions: { disabled: true },
      },

      {
        title: t('4653'),
        id: 'DelayDesc',
        kind: 'Text',
        readonly: false,
        width: 300,
        hasMenu: true,
        visible: true,
        trailingRowOptions: { disabled: true },
      },

      {
        title: t('36273'),
        id: 'ExpReceiptDate',
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

  const defaultColsPJTItem = useMemo(
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
        title: t('2271'),
        id: 'SMInputTypeName',
        kind: 'Custom',
        readonly: false,
        width: 150,
        hasMenu: true,
        visible: true,
        trailingRowOptions: { disabled: true },
        themeOverride: {
          textHeader: '#DD1144',
          bgIconHeader: '#DD1144',
          fontFamily: '',
        },
      },
      {
        title: t('2271'),
        id: 'SMInputType',
        kind: 'Custom',
        readonly: false,
        width: 150,
        hasMenu: true,
        visible: false,
        trailingRowOptions: { disabled: true },
        themeOverride: {
          textHeader: '#DD1144',
          bgIconHeader: '#DD1144',
          fontFamily: '',
        },
      },
      {
        title: t('2091'),
        id: 'ItemSeq',
        kind: 'Text',
        readonly: false,
        width: 280,
        hasMenu: true,
        visible: false,
        trailingRowOptions: { disabled: true },
      },
      {
        title: t('2090'),
        id: 'ItemName',
        kind: 'Custom',
        readonly: false,
        width: 150,
        hasMenu: true,
        visible: true,
        trailingRowOptions: { disabled: true },
        themeOverride: {
          textHeader: '#DD1144',
          bgIconHeader: '#DD1144',
          fontFamily: '',
        },
      },

      {
        title: t('2091'),
        id: 'ItemNo',
        kind: 'Text',
        readonly: false,
        width: 280,
        hasMenu: true,
        visible: true,
        trailingRowOptions: { disabled: true },
        themeOverride: {
          textHeader: '#DD1144',
          bgIconHeader: '#DD1144',
          fontFamily: '',
        },
      },
      {
        title: t('551'),
        id: 'Spec',
        kind: 'Text',
        readonly: false,
        width: 300,
        hasMenu: true,
        visible: false,
        trailingRowOptions: { disabled: true },
      },
      {
        title: t('602'),
        id: 'UnitName',
        kind: 'Text',
        readonly: false,
        width: 300,
        hasMenu: true,
        visible: true,
        trailingRowOptions: { disabled: true },
      },
      {
        title: t('602'),
        id: 'UnitSeq',
        kind: 'Text',
        readonly: false,
        width: 300,
        hasMenu: true,
        visible: false,
        trailingRowOptions: { disabled: true },
      },
      {
        title: t('3827'),
        id: 'ItemQty',
        kind: 'Text',
        readonly: false,
        width: 300,
        hasMenu: true,
        visible: true,
        trailingRowOptions: { disabled: true },
      },
      {
        title: t('3825'),
        id: 'ItemPrice',
        kind: 'Text',
        readonly: false,
        width: 300,
        hasMenu: true,
        visible: true,
        trailingRowOptions: { disabled: true },
      },
      {
        title: t('491'),
        id: 'ItemAmt',
        kind: 'Text',
        readonly: false,
        width: 300,
        hasMenu: true,
        visible: true,
        trailingRowOptions: { disabled: true },
      },
      {
        title: t('3826'),
        id: 'ItemVatAmt',
        kind: 'Text',
        readonly: false,
        width: 300,
        hasMenu: true,
        visible: true,
        trailingRowOptions: { disabled: true },
      },
      {
        title: t('3836'),
        id: 'SumItemAmt',
        kind: 'Text',
        readonly: false,
        width: 300,
        hasMenu: true,
        visible: true,
        trailingRowOptions: { disabled: true },
      },

      {
        title: t('3831'),
        id: 'ItemDomPrice',
        kind: 'Text',
        readonly: false,
        width: 300,
        hasMenu: true,
        visible: true,
        trailingRowOptions: { disabled: true },
      },

      {
        title: t('3830'),
        id: 'ItemDomAmt',
        kind: 'Text',
        readonly: false,
        width: 300,
        hasMenu: true,
        visible: true,
        trailingRowOptions: { disabled: true },
      },
      {
        title: t('3832'),
        id: 'ItemDomVatAmt',
        kind: 'Text',
        readonly: false,
        width: 300,
        hasMenu: true,
        visible: true,
        trailingRowOptions: { disabled: true },
      },
      {
        title: t('3833'),
        id: 'SumItemDomAmt',
        kind: 'Text',
        readonly: false,
        width: 300,
        hasMenu: true,
        visible: true,
        trailingRowOptions: { disabled: true },
      },

      {
        title: t('362'),
        id: 'Remark',
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


  const [WorkingTag, setWorkingTag] = useState('A')
  const [isSent, setIsSent] = useState(false)
  const [showSearch13, setShowSearch13] = useState(false)
  const [showSearch4, setShowSearch4] = useState(false)
  const [loading, setLoading] = useState(false)

  const [gridDataItemDelv, setGridDataItemDelv] = useState([])
  const [gridDataPJTItem, setGridDataPJTItem] = useState([])

  const [numRowsItemDelv, setNumRowsItemDelv] = useState(0)

  const [numRowsPJTItem, setNumRowsPJTItem] = useState(0)

  const [DeptName, setDeptName] = useState('')
  const [DeptSeq, setDeptSeq] = useState('')
  const [cfmEmpSeq, setCfmEmpSeq] = useState('')

  const [selectEmp, setSelectEmp] = useState(null)

  const [deptData, setDeptData] = useState([])
  const [gridDeptRef, setGridDeptRef] = useState([])

  const [dataUser, setDataUser] = useState([])
  const [dataPjtType, setDataPjtType] = useState([])
  const [dataInoutType, setDataInouType] = useState([])
  const [empName, setEmpName] = useState('')
  const [empSeq, setEmpSeq] = useState('')
  const [userId, setUserId] = useState('')
  const [PJTSeq, setPJTSeq] = useState('')
  const [helpData09, setHelpData09] = useState([])

  const [editedRows, setEditedRows] = useState([])
  const [addedRowsMgn, setAddedRowsMgn] = useState([])
  const [numRowsToAddMgn, setNumRowsToAddMgn] = useState(null)
  const [addedRowsMold, setAddedRowsMold] = useState([])
  const [numRowsToAddMold, setNumRowsToAddMold] = useState(null)

  const [dataBizUnit, setDataBizUnit] = useState([])
  const [dataCustomer, setDataCustomer] = useState([])
  const [dataSMSalesRecognize, setDataSMSalesRecognize] = useState([])
  const [dataSMSalesReceipt, setDataSMSalesReceipt] = useState([])
  const [dataSMExpKindName, setDataSMExpKindName] = useState([])
  const [dataCurrency, setDataCurrency] = useState([])
  const [PJTTypeNameData, setPJTTypeNameData] = useState([])
  const [dataSmInputType, setDataSmInputType] = useState([])
  const [dataSmDelvType, setDataSmDelvType] = useState([])
  const [dataItem, setDataItem] = useState([])

  const [PJTTypeName, setPJTTypeName] = useState('')
  const [PJTType, setPJTType] = useState('')
  const [IsUse, setIsUse] = useState(false)

  const [PlanFrDate, setPlanFrDate] = useState('')
  const [PlanToDate, setPlanToDate] = useState('')

  const [ChargeDeptName, setChargeDeptName] = useState('')
  const [ChargeDeptSeq, setChargeDeptSeq] = useState('')

  const [ChargeEmpName, setChargeEmpName] = useState('')
  const [ChargeEmp, setChargeEmp] = useState('')

  const [ContractFrDate, setContractFrDate] = useState('')
  const [ContractToDate, setContractToDate] = useState('')

  const [PJTName, setPJTName] = useState('')
  const [PJTNo, setPJTNo] = useState('')

  const [ResultStdUnitName, setResultStdUnitName] = useState('')
  const [BizUnit, setBizUnit] = useState('')
  const [BizUnitName, setBizUnitName] = useState('')

  const [CustSeq, setCustSeq] = useState('')
  const [CustName, setCustName] = useState('')

  const [SMSalesRecognizeName, setSMSalesRecognizeName] = useState('')
  const [SMSalesRecognize, setSMSalesRecognize] = useState('')

  const [SMSalesReceiptName, setSMSalesReceiptName] = useState('')
  const [SMSalesReceipt, setSMSalesReceipt] = useState('')

  const [WBSResrcLevel, setWBSResrcLevel] = useState('')
  const [SMExpKindName, setSMExpKindName] = useState('')
  const [SMExpKind, setSMExpKind] = useState('')
  const [pjtType, setPjtType] = useState('')
  const [CurrName, setCurrName] = useState('')
  const [CurrSeq, setCurrSeq] = useState('')
  const [CurrRate, setCurrRate] = useState('')
  const [RegDate, setRegDate] = useState(dayjs())
  const [ContractDate, setContractDate] = useState(dayjs())
  const [Remark, setRemark] = useState('')
  const [current, setCurrent] = useState('1')
  const secretKey = 'KEY_PATH'
  const [modal2Open, setModal2Open] = useState(false)
  const [errorData, setErrorData] = useState(null)
  const [checkPageA, setCheckPageA] = useState(false)
  const formatDate = (date) => date.format('YYYYMMDD')
  const [modalDeleteSheetConfirm, setModalDeleteSheetConfirm] = useState(false)
  const [ProcDate, setProcDate] = useState(dayjs())
  const [CfmCode, setCfmCode] = useState(0)
  const formatDateSearch = (date) => {
    const d = dayjs(date)
    return d.isValid() ? d.format('YYYYMMDD') : ''
  }

  const [selection, setSelection] = useState({
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty(),
  })

  const [colsItemDelv, setColsItemDelv] = useState(() =>
    loadFromLocalStorageSheet(
      'edu_rst_item_a',
      defaultColsItemDelv.filter((col) => col.visible),
    ),
  )

  const [colsPJTItem, setColsPJTItem] = useState(() =>
    loadFromLocalStorageSheet(
      'edu_rst_cost_a',
      defaultColsPJTItem.filter((col) => col.visible),
    ),
  )

  const [selectionItemDelv, setSelectionItemDelv] = useState({
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty(),
  })

  const [selectionPJTItem, setSelectionPJTItem] = useState({
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
        dataBizUnit,
        dataCust,
        dataEmp,
        dataPjtType,
        dataInOutType,
        dataSMSalesRecognize,
        dataSMSalesReceipt,
        DeptData,
        dataUser,
        dataDelvType,
        dataInputType,
        dataItem,
        dataCurr,
      ] = await Promise.all([
        GetCodeHelpCombo('', 6, 10003, 1, '%', '', '', '', '', signal),
        GetCodeHelpVer2(17001, '', '', '', '', '', '1', '', 1, '', 0, 0, 0),
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
        GetCodeHelpCombo('', 6, 70002, 1, '%', '', '', '', '', signal),
        GetCodeHelpCombo('', 6, 19998, 1, '%', '8009', '', '', '', signal),
        GetCodeHelpCombo('', 6, 19998, 1, '%', '7002', '1001', '1', '', signal),
        GetCodeHelpCombo('', 6, 19998, 1, '%', '7046', '', '', '', signal),

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
        GetCodeHelpCombo('', 6, 19998, 1, '%', '7054', '', '', '', signal),
        GetCodeHelpCombo('', 6, 19998, 1, '%', '7017', '', '', '', signal),
        GetCodeHelpVer2(18001, '', '', '', '', '', '1', '', 1, '', 0, 0, 0),
        GetCodeHelpVer2(10005, '', '', '', '', '', '1', '', 1, '', 0, 0, 0),
      ])

      setDataBizUnit(dataBizUnit?.data)
      setDataCustomer(dataCust?.data)
      setDataUser(dataEmp?.data)
      setDataPjtType(dataPjtType?.data || [])
      setDataInouType(dataInOutType?.data)
      setDataSMSalesRecognize(dataSMSalesRecognize?.data)
      setDataSMSalesReceipt(dataSMSalesReceipt?.data)
      setDeptData(DeptData?.data)
      setDataUser(dataUser?.data)
      setDataSmDelvType(dataDelvType?.data)
      setDataSmInputType(dataInputType?.data)
      setDataItem(dataItem?.data)
      setDataCurrency(dataCurr.data)
    } catch {
      setDataBizUnit([])
      setDataCustomer([])
      setDataUser([])
      setDataPjtType([])
      setDataInouType([])
      setDataSMSalesRecognize([])
      setDataSMSalesReceipt([])
      setDeptData([])
      setDataUser([])
      setDataSmDelvType([])
      setDataSmInputType([])
      setDataItem([])
      setDataCurrency([])
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

  const resetTable = () => {
    setSelection({
      columns: CompactSelection.empty(),
      rows: CompactSelection.empty(),
    })
  }

  const getSelectedRowsData = () => {
    const selectedRows = selectionPJTItem.rows.items

    return selectedRows.flatMap(([start, end]) =>
      Array.from(
        { length: end - start },
        (_, i) => gridDataPJTItem[start + i],
      ).filter((row) => row !== undefined),
    )
  }

  const getSelectedRowsDelvData = () => {
    const selectedRows = selectionItemDelv.rows.items

    return selectedRows.flatMap(([start, end]) =>
      Array.from(
        { length: end - start },
        (_, i) => gridDataItemDelv[start + i],
      ).filter((row) => row !== undefined),
    )
  }

  const handleRowAppendItemDelv = useCallback(
    (numRowsToAddMgn) => {
      if (canCreate === false) {
        return
      }
      onRowAppended(
        colsItemDelv,
        setGridDataItemDelv,
        setNumRowsItemDelv,
        setAddedRowsMgn,
        numRowsToAddMgn,
      )
    },
    [
      colsItemDelv,
      setGridDataItemDelv,
      setNumRowsItemDelv,
      setAddedRowsMgn,
      numRowsToAddMgn,
    ],
  )

  const handleRowAppendPJTItem = useCallback(
    (numRowsToAddMold) => {
      if (canCreate === false) {
        return
      }
      onRowAppended(
        colsPJTItem,
        setGridDataPJTItem,
        setNumRowsPJTItem,
        setAddedRowsMold,
        numRowsToAddMold,
      )
    },
    [
      colsPJTItem,
      setGridDataPJTItem,
      setNumRowsPJTItem,
      setAddedRowsMold,
      numRowsToAddMold,
    ],
  )

  const [modalOpen, setModalOpen] = useState(false)

  const [isMinusClicked, setIsMinusClicked] = useState(false)
  const [lastClickedCell, setLastClickedCell] = useState(null)
  const [clickedRowData, setClickedRowData] = useState(null)
  const [pjtItemSelected, setPjtItemSelected] = useState([])

  const [pjtDelvSelected, setPjtDelvSelected] = useState([])

  const onCellPjtItemClicked = useCallback(
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
        if (rowIndex >= 0 && rowIndex < gridDataPJTItem.length) {
          const rowData = gridDataPJTItem[rowIndex]

          const isSelected = selectionPJTItem.rows.hasIndex(rowIndex)

          let newSelected
          if (isSelected) {
            newSelected = selectionPJTItem.rows.remove(rowIndex)
            setPjtItemSelected(getSelectedRowsData())
          } else {
            newSelected = selectionPJTItem.rows.add(rowIndex)
            setPjtItemSelected([])
          }
        }
      }
    },
    [gridDataPJTItem, getSelectedRowsData, pjtItemSelected],
  )

  const onCellPjtDelvClicked = useCallback(
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
        if (rowIndex >= 0 && rowIndex < gridDataItemDelv.length) {
          const rowData = gridDataItemDelv[rowIndex]

          const isSelected = selectionItemDelv.rows.hasIndex(rowIndex)

          let newSelected
          if (isSelected) {
            newSelected = selectionItemDelv.rows.remove(rowIndex)
            setPjtDelvSelected(getSelectedRowsDelvData())
          } else {
            newSelected = selectionItemDelv.rows.add(rowIndex)
            setPjtDelvSelected([])
          }
        }
      }
    },
    [gridDataItemDelv, getSelectedRowsDelvData, pjtDelvSelected],
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

  const onClickSearch = useCallback(async () => {
    const getValidDate = (value) => {
      const date = dayjs(value)
      return date.isValid() ? date : null
    }
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
      const searchParams = [
        {
          PJTSeq: PJTSeq || dataSelect[0].PJTSeq,
        },
      ]

      const response = await searchPjtProjectDetail(searchParams)
      const { dataMaster, dataItem, dataDelv } = response.data

      setPJTSeq(dataMaster[0]?.PJTSeq)
      setPJTName(dataMaster[0]?.PJTName)
      setPJTNo(dataMaster[0]?.PJTNo)
      setPlanFrDate(getValidDate(dataMaster[0]?.PlanFrDate))
      setPlanToDate(getValidDate(dataMaster[0]?.PlanToDate))
      setContractFrDate(getValidDate(dataMaster[0]?.ContractFrDate))
      setContractToDate(getValidDate(dataMaster[0]?.ContractToDate))
      setPJTTypeName(dataMaster[0]?.PJTTypeName)
      setPJTType(dataMaster[0]?.PJTTypeSeq)
      setResultStdUnitName(dataMaster[0]?.ResultStdUnitName)
      setBizUnit(dataMaster[0]?.BizUnit)
      setBizUnitName(dataMaster[0]?.BizUnitName)
      setCustSeq(dataMaster[0]?.CustSeq)
      setCustName(dataMaster[0]?.CustName)
      setSMSalesRecognizeName(dataMaster[0]?.SMSalesRecognizeName)
      setSMSalesRecognize(dataMaster[0]?.SMSalesRecognizeSeq)
      setSMSalesReceiptName(dataMaster[0]?.SMSalesReceiptName)
      setSMSalesReceipt(dataMaster[0]?.SMSalesReceiptSeq)
      setChargeEmpName(dataMaster[0]?.ChargeEmpName)
      setChargeEmp(dataMaster[0]?.ChargeEmpSeq)
      setChargeDeptName(dataMaster[0]?.ChargeDeptName)
      setChargeDeptSeq(dataMaster[0]?.ChargeDeptSeq)
      setWBSResrcLevel(dataMaster[0]?.WBSResrcLevel)
      setSMExpKindName(dataMaster[0]?.SMExpKindName)
      setSMExpKind(dataMaster[0]?.SMExpKind)
      setCurrName(dataMaster[0]?.CurrName)
      setCurrSeq(dataMaster[0]?.CurrSeq)
      setCurrRate(dataMaster[0]?.CurrRate)
      setProcDate(getValidDate(dataMaster[0]?.ProcDate) || dayjs())
      setCfmCode(dataMaster[0]?.CfmCode)

      setRegDate(getValidDate(dataMaster[0]?.RegDate))
      setContractDate(getValidDate(dataMaster[0]?.ContractDate))

      const emptyData = generateEmptyData(0, defaultColsItemDelv)
      const mergedDataDelv = updateIndexNo([...dataDelv, ...emptyData])
      setGridDataItemDelv(mergedDataDelv || [])
      setNumRowsItemDelv(dataDelv?.length)

      const emptyDataPjtItem = generateEmptyData(0, defaultColsPJTItem)
      const mergedDataPJTItem = updateIndexNo([...dataItem, ...emptyDataPjtItem])
      setGridDataPJTItem(mergedDataPJTItem || [])
      setNumRowsPJTItem(dataItem?.length)
    } catch (error) {
      const emptyData = generateEmptyData(10, defaultColsPJTItem)
      const updatedEmptyData = updateIndexNo(emptyData)
      setGridDataPJTItem(updatedEmptyData)
      setNumRowsPJTItem(emptyData.length)
    } finally {
      setIsAPISuccess(true)
      controllers.current.onClickSearch = null
      if (loadingBarRef.current) {
        loadingBarRef.current.complete()
      }
    }
  }, [
    current,
    DeptSeq,
    empSeq,
    empName,
    PJTSeq,
    cfmEmpSeq,
    isAPISuccess,
    gridDataPJTItem,
    gridDataItemDelv,
  ])

  const handleExternalSubmit = useCallback(async () => {
    const formatDateSearch = (date) => {
      const d = dayjs(date)
      return d.isValid() ? d.format('YYYYMMDD') : ''
    }

    const requiredFields = [
      { key: 'SMInputTypeName', label: t('2271') },
      { key: 'ItemName', label: t('2090') },
      { key: 'ItemNo', label: t('2091') },
    ]

    const requiredDelvFields = [
      { key: 'DelvExpectDate', label: t('689') },
      { key: 'ItemName', label: t('2090') },
    ]
    const validateRequiredFields = (data, fields) =>
      data.flatMap((row, i) =>
        fields
          .filter(({ key }) => !row[key]?.toString().trim())
          .map(({ key, label }) => ({
            IDX_NO: i + 1,
            field: key,
            Name: label,
            result: `${label} không được để trống`,
          })),
      )

    const masterData = [
      {
        WorkingTag: WorkingTag,
        PJTSeq: PJTSeq,
        PJTName: PJTName,
        PJTNo: PJTNo,
        PlanFrDate: formatDateSearch(PlanFrDate),
        PlanToDate: formatDateSearch(PlanToDate),
        ContractFrDate: formatDateSearch(ContractFrDate),
        ContractToDate: formatDateSearch(ContractToDate),
        PJTTypeName: PJTTypeName,
        PJTTypeSeq: PJTType,
        ResultStdUnitName: ResultStdUnitName,
        BizUnit: BizUnit,
        BizUnitName: BizUnitName,
        CustSeq: CustSeq,
        CustName: CustName,
        SMSalesRecognizeName: SMSalesRecognizeName,
        SalesRecognize: SMSalesRecognize,
        SMSalesReceiptName: SMSalesReceiptName,
        SMSalesReceipt: SMSalesReceipt,
        ChargeEmpName: ChargeEmpName,
        ChargeEmpSeq: ChargeEmp,
        ChargeDeptName: ChargeDeptName,
        ChargeDeptSeq: ChargeDeptSeq,
        WBSResrcLevel: WBSResrcLevel,
        SMExpKindName: SMExpKindName,
        SMExpKind: SMExpKind,
        CurrName: CurrName,
        CurrSeq: CurrSeq,
        CurrRate: CurrRate,
        RegDate: formatDateSearch(RegDate),
        ContractDate: formatDateSearch(ContractDate),
      },
    ]

    const resulA = filterValidRows(gridDataPJTItem, 'A').map((item) => {
      return {
        ...item,
        WorkingTag: 'A',
        PJTSeq: PJTSeq,
      }
    })

    const resulU = filterValidRows(gridDataPJTItem, 'U').map((item) => {
      return {
        ...item,
        WorkingTag: 'U',
        PJTSeq: PJTSeq,
      }
    })

    const resulDelvA = filterValidRows(gridDataItemDelv, 'A').map((item) => {
      return {
        ...item,
        WorkingTag: 'A',
        PJTSeq: PJTSeq,
      }
    })

    const resulDelvU = filterValidRows(gridDataItemDelv, 'U').map((item) => {
      return {
        ...item,
        WorkingTag: 'U',
        PJTSeq: PJTSeq,
      }
    })

    const errors = [
      ...validateRequiredFields(resulA, requiredFields),
      ...validateRequiredFields(resulU, requiredFields),
      ...validateRequiredFields(resulDelvA, requiredDelvFields),
      ...validateRequiredFields(resulDelvU, requiredDelvFields),
    ]

    if (errors.length > 0) {
      setModal2Open(true)
      setErrorData(errors)
      return
    }

    const dataItem = [...resulA, ...resulU]
    const dataDelv = [...resulDelvA, ...resulDelvU]

    handleSaveBasInfo(masterData, dataItem, dataDelv)
  }, [
    gridDataItemDelv,
    gridDataPJTItem,

    WorkingTag,
    PJTSeq,
    PJTName,
    PJTNo,
    PlanFrDate,
    PlanToDate,
    ContractFrDate,
    ContractToDate,
    PJTTypeName,
    PJTType,
    ResultStdUnitName,
    BizUnit,
    BizUnitName,
    CustSeq,
    CustName,
    SMSalesRecognizeName,
    SMSalesRecognize,
    SMSalesReceiptName,
    SMSalesReceipt,
    ChargeEmpName,
    ChargeEmp,
    ContractDate,
    ChargeDeptSeq,
    RegDate,
  ])

  const handleSaveBasInfo = useCallback(
    async (masterData, dataItem, dataDelv) => {
      if (canCreate === false) {
        message.warning('Bạn không có quyền thêm dữ liệu')
        return
      }

      if (isSent) return
      setIsSent(true)

      try {
        const results = await auPjtProject(masterData, dataItem, dataDelv)

        if (results.success) {
          message.success('Thành công!')

          setIsSent(false)
          resetTable()

          const { logs1, logs2, logs3 } = results?.data

          setPJTSeq(logs1[0]?.PJTSeq)
          setGridDataPJTItem((prev) => {
            const updated = prev.map((item) => {
              const found = logs2.find((x) => x?.IDX_NO === item?.IdxNo)

              return found
                ? {
                    ...item,
                    Status: '',
                    IdSeq: found?.IdSeq,
                    PJTItemSerl: found?.PJTItemSerl,
                  }
                : item
            })
            return updateIndexNo(updated)
          })
          setGridDataItemDelv((prev) => {
            const updated = prev.map((item) => {
              const found = logs3.find((x) => x?.IDX_NO === item?.IdxNo)

              return found
                ? {
                    ...item,
                    Status: '',
                    IdSeq: found?.IdSeq,
                    DelvSerl: found?.DelvSerl,
                  }
                : item
            })
            return updateIndexNo(updated)
          })
        } else {
          const error = [
            {
              IDX_NO: 1,
              Name: 'Duplicate',
              result: results.errors,
            },
          ]
          setIsSent(false)
          setModal2Open(true)
          setErrorData(error)
        }
      } catch (error) {
        setIsSent(false)
        message.error(error.message || 'Có lỗi xảy ra khi lưu dữ liệu')
      }finally{
        onClickSearch()
      }
    },
    [gridDataItemDelv, gridDataPJTItem, PJTSeq],
  )

  useEffect(() => {
    if (dataSelect.length > 0) {
      setEmpSeq(dataSelect[0].EmpSeq)
      setEmpName(dataSelect[0].EmpName)
      setUserId(dataSelect[0].EmpID)
      setDeptName(dataSelect[0].DeptName)
      setDeptSeq(dataSelect[0].DeptSeq)
      setPJTSeq(dataSelect[0].PJTSeq)
      setWorkingTag('U')
      onClickSearch()
    }
    const pjtType = dataPjtType[0]
    const smSalesRecognize = dataSMSalesRecognize[0]
    const smSalesReceipt = dataSMSalesReceipt[0]
    setPJTTypeName(pjtType?.PJTTypeName)
    setPJTType(pjtType?.PJTTypeSeq)

    setSMSalesRecognize(smSalesRecognize?.Value)
    setSMSalesRecognizeName(smSalesRecognize?.MinorName)

    setSMSalesReceiptName(smSalesReceipt?.MinorName)
    setSMSalesReceipt(smSalesReceipt?.Value)
  
  }, [dataSelect])

  const getSelectedRows = (selection, gridData) => {
    if (!selection?.rows?.items) return []

    return selection.rows.items.flatMap(([start, end]) =>
      Array.from({ length: end - start }, (_, i) => {
        const rowIndex = start + i
        const row = gridData[rowIndex]

        if (row) {
          return {
            ...row,
            IdxNo: rowIndex + 1,
          }
        }

        return null
      }).filter(Boolean),
    )
  }

  const handleDeleteDataSheet = useCallback(() => {
    if (canDelete === false) return

    const map = {
      1: [
        {
          selection: selectionPJTItem,
          setSelection: setSelectionPJTItem,
          gridData: gridDataPJTItem,
          setGridData: setGridDataPJTItem,
          setNumRows: setNumRowsPJTItem,
          deleteApi: deletePjtItem,
          resetFn: resetTable(setSelectionPJTItem),
        },
      ],
      2: [
        {
          selection: selectionItemDelv,
          setSelection: setSelectionItemDelv,
          gridData: gridDataItemDelv,
          setGridData: setGridDataItemDelv,
          setNumRows: setNumRowsItemDelv,
          deleteApi: deletePjtDelv,
          resetFn: resetTable(setSelectionItemDelv),
        },
      ],
    }

    const target = map[current]
    if (!target) return

    const processTarget = ({
      selection,
      setSelection,
      gridData,
      setGridData,
      setNumRows,
      deleteApi,
      resetFn,
    }) => {
      const selectedRows = getSelectedRows(selection, gridData)

      const rowsWithStatusD = selectedRows
        .filter(
          (row) => !row.Status || row.Status === 'U' || row.Status === 'D',
        )
        .map((row) => ({
          ...row,
          WorkingTag: 'D',
        }))

      const rowsWithStatusA = selectedRows.filter((row) => row.Status === 'A')

      if (rowsWithStatusD.length > 0 && deleteApi) {
        deleteApi(rowsWithStatusD)
          .then((response) => {
            if (response.success) {
              const deletedIds = rowsWithStatusD.map((item) => item.IdxNo)
              const updatedData = gridData.filter(
                (row) => !deletedIds.includes(row.IdxNo),
              )
              setGridData(updateIndexNo(updatedData))
              setNumRows(updatedData.length)
              resetTable()
            } else {
              setModal2Open(true)
              setErrorData(response?.errors || [])
            }
          })
          .catch((error) => {
            message.error('Có lỗi xảy ra khi xóa!')
          })
      }

      if (rowsWithStatusA.length > 0) {
        const idsWithStatusA = rowsWithStatusA.map((row) => row.Id)
        const remainingRows = gridData.filter(
          (row) => !idsWithStatusA.includes(row.Id),
        )
        setGridData(updateIndexNo(remainingRows))
        setNumRows(remainingRows.length)
        resetFn?.()
      }
    }

    if (Array.isArray(target)) {
      target.forEach(processTarget)
    } else {
      processTarget(target)
    }
    setModalDeleteSheetConfirm(false)
  }, [
    current,
    canDelete,

    gridDataItemDelv,
    setGridDataItemDelv,
    setNumRowsItemDelv,

    selectionItemDelv,
    setSelectionItemDelv,

    selectionPJTItem,
    setSelectionPJTItem,
    gridDataPJTItem,
    setGridDataPJTItem,
    numRowsPJTItem,
  ])

  const handleOpenDeleteDataSheet = useCallback(() => {
    if (pjtDelvSelected.length > 0 || pjtItemSelected.length > 0) {
      setModalDeleteSheetConfirm(true)
    } else {
      message.warning('Chọn dữ liệu để xóa')
    }
  }, [pjtDelvSelected, pjtItemSelected, modalDeleteSheetConfirm])

  const handleDeletePjt = useCallback(
    async (dataMaster, dataItem, dataDelv) => {
      if (canCreate === false) {
        message.warning('Bạn không có quyền xóa dữ liệu')
        return
      }

      if (isSent) return
      setIsSent(true)

      try {
        const results = await deletePjt(dataMaster, dataItem, dataDelv)
        console.log({ results })
        if (results.success) {
          message.success('Xóa thành công!')
          resetTable()
          setIsSent(false)
        } else {
          setModal2Open(true)
          setErrorData(results?.errors || [])
          setIsSent(false)
        }
      } catch (error) {
        console.log(error)
        setIsSent(false)
        message.error(error.message || 'Có lỗi xảy ra khi lưu dữ liệu')
      } finally {
        onClickSearch()
        setModalOpen(false)
      }
    },
    [],
  )
  const handleDelete = useCallback(async () => {
    if (WorkingTag === '') return

    const formatDateSearch = (date) => {
      const d = dayjs(date)
      return d.isValid() ? d.format('YYYYMMDD') : ''
    }

    const masterData = [
      {
        WorkingTag: 'D',
        PJTSeq: PJTSeq,
        PJTName: PJTName,
        PJTNo: PJTNo,
        PlanFrDate: formatDateSearch(PlanFrDate),
        PlanToDate: formatDateSearch(PlanToDate),
        ContractFrDate: formatDateSearch(ContractFrDate),
        ContractToDate: formatDateSearch(ContractToDate),
        PJTTypeName: PJTTypeName,
        PJTTypeSeq: PJTType,
        ResultStdUnitName: ResultStdUnitName,
        BizUnit: BizUnit,
        BizUnitName: BizUnitName,
        CustSeq: CustSeq,
        CustName: CustName,
        SMSalesRecognizeName: SMSalesRecognizeName,
        SalesRecognize: SMSalesRecognize,
        SMSalesReceiptName: SMSalesReceiptName,
        SMSalesReceipt: SMSalesReceipt,
        ChargeEmpName: ChargeEmpName,
        ChargeEmpSeq: ChargeEmp,
        ChargeDeptName: ChargeDeptName,
        ChargeDeptSeq: ChargeDeptSeq,
        WBSResrcLevel: WBSResrcLevel,
        SMExpKindName: SMExpKindName,
        CurrName: CurrName,
        CurrSeq: CurrSeq,
        CurrRate: CurrRate,
        RegDate: formatDateSearch(RegDate),
        ContractDate: formatDateSearch(ContractDate),
      },
    ]

    const requiredFields = []
    const validateRequiredFields = (data, fields) =>
      data.flatMap((row, i) =>
        fields
          .filter(({ key }) => !row[key]?.toString().trim())
          .map(({ key, label }) => ({
            IDX_NO: i + 1,
            field: key,
            Name: label,
            result: `${label} không được để trống`,
          })),
      )

    const resulA = gridDataPJTItem.map((item) => {
      return {
        ...item,
        WorkingTag: 'D',
      }
    })

    const errors = [...validateRequiredFields(resulA, requiredFields)]

    const requiredFieldsMgn = []
    const validateRequiredFieldsMgn = (data, fields) =>
      data.flatMap((row, i) =>
        fields
          .filter(({ key }) => !row[key]?.toString().trim())
          .map(({ key, label }) => ({
            IDX_NO: i + 1,
            field: key,
            Name: label,
            result: `${label} không được để trống`,
          })),
      )

    const resulMgnA = gridDataItemDelv.map((item) => {
      return {
        ...item,
        WorkingTag: 'D',
      }
    })

    const errorsMgn = [
      ...validateRequiredFieldsMgn(resulMgnA, requiredFieldsMgn),
    ]

    if (errors.length > 0) {
      setModal2Open(true)
      setErrorData(errors)
      return
    }
    if (errorsMgn.length > 0) {
      setModal2Open(true)
      setErrorData(errorsMgn)
      return
    }

    const dataRstCost = [...resulA]
    const dataMgn = [...resulMgnA]

    handleDeletePjt(masterData, dataRstCost, dataMgn)
  }, [
    WorkingTag,
    gridDataItemDelv,
    gridDataPJTItem,
    PJTSeq,
    PJTName,
    PJTNo,
    PlanFrDate,
    PlanToDate,
    ContractFrDate,
    ContractToDate,
    PJTTypeName,
    PJTType,
    ResultStdUnitName,
    BizUnit,
    BizUnitName,
    CustSeq,
    CustName,
    SMSalesRecognizeName,
    SMSalesRecognize,
    SMSalesReceiptName,
    SMSalesReceipt,
    ChargeEmpName,
    ChargeEmp,
    ChargeDeptName,
    ChargeDeptSeq,
    WBSResrcLevel,
    SMExpKindName,
    CurrName,
    CurrSeq,
    CurrRate,
    RegDate,
    ContractDate,
  ])

  const handleConfirmProject = useCallback(async () => {
    if (canCreate === false) {
      message.warning('Bạn không có quyền xóa dữ liệu')
      return
    }

    if (isSent) return
    setIsSent(true)

    try {
      const payload = [
        {
          PJTSeq: PJTSeq,
          ProcDate: formatDateSearch(ProcDate),
          ProcEmpSeq: parsedUserInfo.UserSeq,
          ProcDesc: '',
        },
      ]
      const results = await confirmPjtProject(payload)
      if (results.success) {
        message.success('Xác nhận thành công!')
      } else {
        setModal2Open(true)
        setErrorData(results?.errors || [])
        setIsSent(false)
      }
    } catch (error) {
      console.log(error)
      setIsSent(false)
      message.error(error.message || 'Có lỗi xảy ra khi lưu dữ liệu')
    } finally {
      onClickSearch()
      setModalOpen(false)
    }
  }, [PJTSeq, ProcDate, parsedUserInfo.EmpSeq])

  return (
    <>
      <Helmet>
        <title>ITM - {t('10040561')}</title>
      </Helmet>
      <TopLoadingBar color="blue" height={2} ref={loadingBarRef} />
      <div className="bg-slate-50 h-[calc(100vh-40px)] overflow-hidden">
        <div className="flex flex-col h-full">
          <div className="col-start-1 col-end-5 row-start-1 w-full">
            <div className="flex items-center justify-between">
              <Title level={4} className="m-2 uppercase opacity-85 ">
                {t('10040561')}
              </Title>
              <PjtProjectAction
                setModalOpen={setModalOpen}
                onClickSearch={onClickSearch}
                handleExternalSubmit={handleExternalSubmit}
                handleOpenDeleteDataSheet={handleOpenDeleteDataSheet}
              />
            </div>
            <details
              className="group p-2 [&_summary::-webkit-details-marker]:hidden border bg-white"
              open
            >
              <summary className="flex cursor-pointer items-center justify-between gap-1.5 text-gray-900">
                <h2 className="text-xs font-medium flex items-center gap-2  uppercase">
                  <FilterOutlined />
                  {t('353')}
                </h2>
                <span className="relative size-5 shrink-0">
                  <ArrowIcon />
                </span>
              </summary>
              <div className="flex p-2 gap-4">
                <PjtProjectQuery
                  dataBizUnit={dataBizUnit}
                  dataCustomer={dataCustomer}
                  dataPjtType={dataPjtType}
                  dataSMSalesRecognize={dataSMSalesRecognize}
                  dataSMSalesReceipt={dataSMSalesReceipt}
                  dataSMExpKindName={dataSMExpKindName}
                  dataCurrency={dataCurrency}
                  PJTTypeNameData={PJTTypeNameData}
                  PJTTypeName={PJTTypeName}
                  setPJTTypeName={setPJTTypeName}
                  IsUse={IsUse}
                  setIsUse={setIsUse}
                  PlanFrDate={PlanFrDate}
                  setPlanFrDate={setPlanFrDate}
                  PlanToDate={PlanToDate}
                  setPlanToDate={setPlanToDate}
                  setSelectEmp={setSelectEmp}
                  DeptData={deptData}
                  ChargeDeptName={ChargeDeptName}
                  setChargeDeptName={setChargeDeptName}
                  setChargeEmp={setChargeEmp}
                  ChargeDeptSeq={ChargeDeptSeq}
                  setChargeDeptSeq={setChargeDeptSeq}
                  gridDeptRef={gridDeptRef}
                  dataUser={dataUser}
                  ChargeEmpName={ChargeEmpName}
                  setChargeEmpName={setChargeEmpName}
                  empSeq={empSeq}
                  setEmpSeq={setEmpSeq}
                  userId={userId}
                  setUserId={setUserId}
                  ContractFrDate={ContractFrDate}
                  setContractFrDate={setContractFrDate}
                  ContractToDate={ContractToDate}
                  setContractToDate={setContractToDate}
                  PJTName={PJTName}
                  setPJTName={setPJTName}
                  PJTNo={PJTNo}
                  setPJTNo={setPJTNo}
                  ResultStdUnitName={ResultStdUnitName}
                  setResultStdUnitName={setResultStdUnitName}
                  CustSeq={CustSeq}
                  setCustSeq={setCustSeq}
                  CustName={CustName}
                  setCustName={setCustName}
                  setPjtType={setPjtType}
                  SMSalesReceiptName={SMSalesReceiptName}
                  SMSalesRecognizeName={SMSalesRecognizeName}
                  setSMSalesRecognize={setSMSalesRecognize}
                  setSMSalesReceiptName={setSMSalesReceiptName}
                  SMSalesReceipt={SMSalesReceipt}
                  WBSResrcLevel={WBSResrcLevel}
                  setWBSResrcLevel={setWBSResrcLevel}
                  SMExpKindName={SMExpKindName}
                  setSMExpKind={setSMExpKind}
                  setSMExpKindName={setSMExpKindName}
                  CurrName={CurrName}
                  setCurrName={setCurrName}
                  setCurrSeq={setCurrSeq}
                  CurrRate={CurrRate}
                  setCurrRate={setCurrRate}
                  RegDate={RegDate}
                  setRegDate={setRegDate}
                  ContractDate={ContractDate}
                  setContractDate={setContractDate}
                  Remark={Remark}
                  setRemark={setRemark}
                  BizUnitName={BizUnitName}
                  setBizUnitName={setBizUnitName}
                  setBizUnit={setBizUnit}
                  dataInoutType={dataInoutType}
                  CfmCode={CfmCode}
                  setCfmCode={setCfmCode}
                  handleConfirmProject={handleConfirmProject}
                />
              </div>
            </details>
          </div>
          <div className="col-start-1 col-end-5 row-start-2 w-full h-full border-t overflow-hidden">
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
                        {t('2496')}
                      </span>
                    ),
                  },

                  {
                    key: '2',
                    label: (
                      <span className="flex items-center gap-1">
                        <FileStack size={14} />
                        {t('2497')}
                      </span>
                    ),
                  },
                ]}
              />
              <div className="flex-1 overflow-auto">
                {current === '1' && (
                  <>
                    <PjtProjectTable
                      dataSmInputType={dataSmInputType}
                      setDataSmInputType={setDataSmInputType}
                      dataItem={dataItem}
                      setDataItem={setDataItem}
                      setSelection={setSelectionPJTItem}
                      selection={selectionPJTItem}
                      showSearch={showSearch13}
                      setShowSearch={setShowSearch13}
                      numRows={numRowsPJTItem}
                      setGridData={setGridDataPJTItem}
                      gridData={gridDataPJTItem}
                      setNumRows={setNumRowsPJTItem}
                      setCols={setColsPJTItem}
                      cols={colsPJTItem}
                      defaultCols={defaultColsPJTItem}
                      canEdit={canEdit}
                      canCreate={canCreate}
                      handleRowAppend={handleRowAppendPJTItem}
                      fetchGenericData={fetchGenericData}
                      onCellClicked={onCellPjtItemClicked}
                    />
                  </>
                )}

                {current === '2' && (
                  <>
                    <PjtProjectItemTable
                      dataItem={dataItem}
                      setDataItem={setDataItem}
                      dataSmDelvType={dataSmDelvType}
                      setDataSmDelvType={setDataSmDelvType}
                      setSelection={setSelectionItemDelv}
                      selection={selectionItemDelv}
                      showSearch={showSearch4}
                      setShowSearch={setShowSearch4}
                      numRows={numRowsItemDelv}
                      setGridData={setGridDataItemDelv}
                      gridData={gridDataItemDelv}
                      setNumRows={setNumRowsItemDelv}
                      setCols={setColsItemDelv}
                      cols={colsItemDelv}
                      defaultCols={defaultColsItemDelv}
                      canEdit={canEdit}
                      canCreate={canCreate}
                      handleRowAppend={handleRowAppendItemDelv}
                      helpData09={helpData09}
                      setHelpData09={setHelpData09}
                      fetchGenericData={fetchGenericData}
                      onCellClicked={onCellPjtDelvClicked}
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <ErrorListModal
        isModalVisible={modal2Open}
        setIsModalVisible={setModal2Open}
        dataError={errorData}
      />
      <ModalConfirm
        modalOpen={modalDeleteSheetConfirm}
        setmodalOpen={setModalDeleteSheetConfirm}
        MessageConfirm={'Xác nhận xóa sheet dữ liệu?'}
        onOk={handleDeleteDataSheet}
        isShowInput={false}
      />
      <ModalConfirm
        modalOpen={modalOpen}
        setmodalOpen={setModalOpen}
        MessageConfirm={'Xác nhận xóa dữ liệu?'}
        onOk={handleDelete}
        isShowInput={false}
      />
    </>
  )
}
