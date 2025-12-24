import { FilterOutlined } from '@ant-design/icons'
import { CompactSelection, GridColumnIcon } from '@glideapps/glide-data-grid'
import { message, Typography } from 'antd'
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

import { togglePageInteraction } from '../../../../utils/togglePageInteraction'
import { onRowAppended } from '../../../components/sheet/js/onRowAppended'
import ErrorListModal from '../../default/errorListModal'

import { useNavigate } from 'react-router-dom'
import { auHrEduRstEnd } from '../../../../features/mgn-hr/hr-edu-rst/AuHrEduRstEnd'
import { searchPjtProjectList } from '../../../../features/mgn-hr/pjt-project/searchPjtProjectList'
import { filterValidRows } from '../../../../utils/filterUorA'
import PjtProjectListAction from '../../../components/actions/pjtProject/pjtProjectListAction'
import PjtProjectListQuery from '../../../components/query/pjtProject/pjtProjectListQuery'
import PjtProjectListTable from '../../../components/table/pjt-project/pjtProjectListTable'
export default function PjtProjectList({
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
          disabled: false,
        },
      },
      {
        title: t('2'),
        id: 'BizUnitName',
        kind: 'Text',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: true,
        themeOverride: {
          textDark: '#225588',
          baseFontStyle: '600 13px',
        },
      },
      {
        title: t('852'),
        id: 'PJTName',
        kind: 'Text',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: true,
        themeOverride: {
          textDark: '#225588',
          baseFontStyle: '600 13px',
        },
      },
      {
        title: t('371'),
        id: 'PJTNo',
        kind: 'Text',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: true,
        themeOverride: {
          textDark: '#225588',
          baseFontStyle: '600 13px',
        },
      },
      {
        title: t('10409'),
        id: 'PJTRev',
        kind: 'Text',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: true,
        themeOverride: {
          textDark: '#225588',
          baseFontStyle: '600 13px',
        },
      },
      {
        title: t('3872'),
        id: 'PlanFrDate',
        kind: 'Text',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: true,
        themeOverride: {
          textDark: '#225588',
          baseFontStyle: '600 13px',
        },
      },
      {
        title: t('3884'),
        id: 'PlanToDate',
        kind: 'Text',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: true,
        themeOverride: {
          textDark: '#225588',
          baseFontStyle: '600 13px',
        },
      },
      {
        title: t('2391'),
        id: 'ContractFrDate',
        kind: 'Text',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: true,
        themeOverride: {
          textDark: '#225588',
          baseFontStyle: '600 13px',
        },
      },
      {
        title: t('392'),
        id: 'ContractToDate',
        kind: 'Text',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: true,
        themeOverride: {
          textDark: '#225588',
          baseFontStyle: '600 13px',
        },
      },
      {
        title: t('127'),
        id: 'QryTo',
        kind: 'Text',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: true,
        themeOverride: {
          textDark: '#225588',
          baseFontStyle: '600 13px',
        },
      },
      {
        title: t('372'),
        id: 'PJTTypeName',
        kind: 'Text',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: true,
        themeOverride: {
          textDark: '#225588',
          baseFontStyle: '600 13px',
        },
      },
      {
        title: t('6'),
        id: 'CustName',
        kind: 'Text',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: true,
        themeOverride: {
          textDark: '#225588',
          baseFontStyle: '600 13px',
        },
      },
      {
        title: t('1415'),
        id: 'SMSalesRecognizeName',
        kind: 'Text',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: true,
        themeOverride: {
          textDark: '#225588',
          baseFontStyle: '600 13px',
        },
      },
      {
        title: t('758'),
        id: 'ChargeDeptName',
        kind: 'Text',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: true,
        themeOverride: {
          textDark: '#225588',
          baseFontStyle: '600 13px',
        },
      },
      {
        title: t('1263'),
        id: 'ChargeEmpName',
        kind: 'Text',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: true,
        themeOverride: {
          textDark: '#225588',
          baseFontStyle: '600 13px',
        },
      },
      {
        title: t('36855'),
        id: 'PMName',
        kind: 'Text',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: true,
        themeOverride: {
          textDark: '#225588',
          baseFontStyle: '600 13px',
        },
      },
      {
        title: t('363'),
        id: 'CurrName',
        kind: 'Text',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: true,
        themeOverride: {
          textDark: '#225588',
          baseFontStyle: '600 13px',
        },
      },
      {
        title: t('854'),
        id: 'PJTAmt',
        kind: 'Number',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: true,
        themeOverride: {
          textDark: '#225588',
          baseFontStyle: '600 13px',
        },
      },
      {
        title: t('55343'),
        id: 'ItemDomAmt',
        kind: 'Number',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: true,
        themeOverride: {
          textDark: '#225588',
          baseFontStyle: '600 13px',
        },
      },
      {
        title: t('364'),
        id: 'CurrRate',
        kind: 'Number',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: true,
        themeOverride: {
          textDark: '#225588',
          baseFontStyle: '600 13px',
        },
      },
      {
        title: t('1294'),
        id: 'SMStatusName',
        kind: 'Text',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: true,
        themeOverride: {
          textDark: '#225588',
          baseFontStyle: '600 13px',
        },
      },
      {
        title: t('55343'),
        id: 'ItmeDomAmt',
        kind: 'Number',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: true,
        themeOverride: {
          textDark: '#225588',
          baseFontStyle: '600 13px',
        },
      },
      {
        title: t('1174'),
        id: 'CurrSeq',
        kind: 'Number',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: false,
        themeOverride: {
          textDark: '#225588',
          baseFontStyle: '600 13px',
        },
      },
      {
        title: t('12560'),
        id: 'ISHR',
        kind: 'Boolean',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: false,
        themeOverride: {
          textDark: '#225588',
          baseFontStyle: '600 13px',
        },
      },
      {
        title: t('1675'),
        id: 'ResultStdUnitName',
        kind: 'Text',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: false,
        themeOverride: {
          textDark: '#225588',
          baseFontStyle: '600 13px',
        },
      },
      {
        title: t('1960'),
        id: 'ConstAsstName',
        kind: 'Text',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: false,
        themeOverride: {
          textDark: '#225588',
          baseFontStyle: '600 13px',
        },
      },
      {
        title: t('14201'),
        id: 'ISWBS',
        kind: 'Boolean',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: false,
        themeOverride: {
          textDark: '#225588',
          baseFontStyle: '600 13px',
        },
      },
      {
        title: t('18474'),
        id: 'SrcPJTSeq',
        kind: 'Number',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: false,
        themeOverride: {
          textDark: '#225588',
          baseFontStyle: '600 13px',
        },
      },
      {
        title: t('17002'),
        id: 'ISBOM',
        kind: 'Boolean',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: false,
        themeOverride: {
          textDark: '#225588',
          baseFontStyle: '600 13px',
        },
      },
      {
        title: t('16175'),
        id: 'SMPriceKind',
        kind: 'Text',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: false,
        themeOverride: {
          textDark: '#225588',
          baseFontStyle: '600 13px',
        },
      },
      {
        title: t('15635'),
        id: 'ISBgt',
        kind: 'Boolean',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: false,
        themeOverride: {
          textDark: '#225588',
          baseFontStyle: '600 13px',
        },
      },
      {
        title: t('13334'),
        id: 'SMSalesRecognize',
        kind: 'Text',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: false,
        themeOverride: {
          textDark: '#225588',
          baseFontStyle: '600 13px',
        },
      },
      {
        title: t('15417'),
        id: 'ISMember',
        kind: 'Boolean',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: false,
        themeOverride: {
          textDark: '#225588',
          baseFontStyle: '600 13px',
        },
      },
      {
        title: t('1174'),
        id: 'CurrSeq',
        kind: 'Number',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: false,
        themeOverride: {
          textDark: '#225588',
          baseFontStyle: '600 13px',
        },
      },

      {
        title: t('15592'),
        id: 'ResultStdUnitSeq',
        kind: 'Number',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: false,
        themeOverride: {
          textDark: '#225588',
          baseFontStyle: '600 13px',
        },
      },
      {
        title: t('12560'),
        id: 'ISFR',
        kind: 'Boolean',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: false,
        themeOverride: {
          textDark: '#225588',
          baseFontStyle: '600 13px',
        },
      },
      {
        title: t('36239'),
        id: 'ConstAsstSeq',
        kind: 'Number',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: false,
        themeOverride: {
          textDark: '#225588',
          baseFontStyle: '600 13px',
        },
      },
      {
        title: t('17894'),
        id: 'ChargeEmpSeq',
        kind: 'Text',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: false,
        themeOverride: {
          textDark: '#225588',
          baseFontStyle: '600 13px',
        },
      },
      {
        title: t('17772'),
        id: 'SMStatusSeq',
        kind: 'Number',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: false,
        themeOverride: {
          textDark: '#225588',
          baseFontStyle: '600 13px',
        },
      },
      {
        title: t('3151'),
        id: 'BizUnit',
        kind: 'Text',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: false,
        themeOverride: {
          textDark: '#225588',
          baseFontStyle: '600 13px',
        },
      },
      {
        title: t('849'),
        id: 'PJTSeq',
        kind: 'Number',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: false,
        themeOverride: {
          textDark: '#225588',
          baseFontStyle: '600 13px',
        },
      },
      {
        title: t('3269'),
        id: 'CCtrSeq',
        kind: 'Number',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: false,
        themeOverride: {
          textDark: '#225588',
          baseFontStyle: '600 13px',
        },
      },
      {
        title: t('694'),
        id: 'CustSeq',
        kind: 'Number',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: false,
        themeOverride: {
          textDark: '#225588',
          baseFontStyle: '600 13px',
        },
      },
      {
        title: t('17583'),
        id: 'PJTStopEmpSeq',
        kind: 'Number',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: false,
        themeOverride: {
          textDark: '#225588',
          baseFontStyle: '600 13px',
        },
      },
      {
        title: t('17889'),
        id: 'ChargeDeptSeq',
        kind: 'Number',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: false,
        themeOverride: {
          textDark: '#225588',
          baseFontStyle: '600 13px',
        },
      },
      {
        title: t('3'),
        id: 'FactUnitName',
        kind: 'Text',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: false,
        themeOverride: {
          textDark: '#225588',
          baseFontStyle: '600 13px',
        },
      },
      {
        title: t('10404'),
        id: 'PJTTypeSeq',
        kind: 'Text',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: false,
        themeOverride: {
          textDark: '#225588',
          baseFontStyle: '600 13px',
        },
      },
      {
        title: t('18943'),
        id: 'PJTEndEmpSeq',
        kind: 'Text',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: false,
        themeOverride: {
          textDark: '#225588',
          baseFontStyle: '600 13px',
        },
      },
      {
        title: t('15896'),
        id: 'SMBgtBuild',
        kind: 'Boolean',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: false,
        themeOverride: {
          textDark: '#225588',
          baseFontStyle: '600 13px',
        },
      },
      {
        title: t('15896'),
        id: 'SMBgtBuildName',
        kind: 'Text',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: false,
        themeOverride: {
          textDark: '#225588',
          baseFontStyle: '600 13px',
        },
      },
      {
        title: t('493'),
        id: 'ContractName',
        kind: 'Text',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: false,
        themeOverride: {
          textDark: '#225588',
          baseFontStyle: '600 13px',
        },
      },
      {
        title: t('498'),
        id: 'ContractSeq',
        kind: 'Number',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: false,
        themeOverride: {
          textDark: '#225588',
          baseFontStyle: '600 13px',
        },
      },
      {
        title: t('607'),
        id: 'ISCfm',
        kind: 'Boolean',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: false,
        themeOverride: {
          textDark: '#225588',
          baseFontStyle: '600 13px',
        },
      },
      {
        title: t('427'),
        id: 'PJTCfmDate',
        kind: 'Text',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: false,
        themeOverride: {
          textDark: '#225588',
          baseFontStyle: '600 13px',
        },
      },
      {
        title: t('33200'),
        id: 'PJTCfmUserName',
        kind: 'Text',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: true,
        themeOverride: {
          textDark: '#225588',
        },
      },
      {
        title: t('33572'),
        id: 'PJTCfmUserSeq',
        kind: 'Number',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: true,
        themeOverride: {
          textDark: '#225588',
        },
      },
      {
        title: t('36274'),
        id: 'CfmReason',
        kind: 'Text',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: true,
        themeOverride: {
          textDark: '#225588',
        },
      },
      {
        title: t('949'),
        id: 'SMExpKindName',
        kind: 'Text',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: true,
        themeOverride: {
          textDark: '#225588',
        },
      },
      {
        title: t('12654'),
        id: 'SMExpKind',
        kind: 'Number',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: true,
        themeOverride: {
          textDark: '#225588',
        },
      },
      {
        title: t('3164'),
        id: 'FactUnit',
        kind: 'Text',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: true,
        themeOverride: {
          textDark: '#225588',
        },
      },
      {
        title: t('217'),
        id: 'QryFr',
        kind: 'Text',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: true,
        themeOverride: {
          textDark: '#225588',
        },
      },
      {
        title: t('2066'),
        id: 'RegUserName',
        kind: 'Text',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: true,
        themeOverride: {
          textDark: '#225588',
        },
      },
      {
        title: t('188'),
        id: 'LastDate',
        kind: 'Text',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: true,
        themeOverride: {
          textDark: '#225588',
        },
      },
      {
        title: t('1629'),
        id: 'LastUserName',
        kind: 'Text',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: true,
        themeOverride: {
          textDark: '#225588',
        },
      },
      {
        title: t('17851'),
        id: 'PJTRevSeq',
        kind: 'Number',
        readonly: true,
        width: 150,
        hasMenu: true,
        visible: true,
        themeOverride: {
          textDark: '#225588',
        },
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
        title: t('2271'),
        id: 'SMInputTypeName',
        kind: 'Text',
        readonly: false,
        width: 150,
        hasMenu: true,
        visible: false,
        trailingRowOptions: { disabled: true },
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
        kind: 'Text',
        readonly: false,
        width: 150,
        hasMenu: true,
        visible: false,
        trailingRowOptions: { disabled: true },
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
        id: 'SumItemDomAmt',
        kind: 'Remark',
        readonly: false,
        width: 300,
        hasMenu: true,
        visible: true,
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
  const [showSearch13, setShowSearch13] = useState(false)

  const [loading, setLoading] = useState(false)

  const [gridDataRstItem, setGridDataRstItem] = useState([])
  const [gridData, setGridData] = useState([])

  const [addedRows, setAddedRows] = useState([])
  const [numRowsToAdd, setNumRowsToAdd] = useState(null)

  const [numRows, setNumRows] = useState(0)

  const [selectEmp, setSelectEmp] = useState(null)

  const [deptData, setDeptData] = useState([])

  const [gridDeptRef, setGridDeptRef] = useState([])

  const [dataUser, setDataUser] = useState([])
  const [empName, setEmpName] = useState('')
  const [empSeq, setEmpSeq] = useState('')
  const [userId, setUserId] = useState('')

  const [current, setCurrent] = useState('1')
  const secretKey = 'KEY_PATH'
  const [modal2Open, setModal2Open] = useState(false)
  const [errorData, setErrorData] = useState(null)
  const [dataBizUnit, setDataBizUnit] = useState([])
  const [dataCustomer, setDataCustomer] = useState([])
  const [dataSMSalesRecognize, setDataSMSalesRecognize] = useState([])
  const [dataSMSalesReceipt, setDataSMSalesReceipt] = useState([])
  const [dataSMExpKindName, setDataSMExpKindName] = useState([])
  const [dataCurrency, setDataCurrency] = useState([])
  const [PJTTypeNameData, setPJTTypeNameData] = useState([])
  const [BizUnit, setBizUnit] = useState([])
  const [PJTTypeName, setPJTTypeName] = useState('')
  const [PJTType, setPJTType] = useState('')

  const [PlanFrDate, setPlanFrDate] = useState('')
  const [PlanToDate, setPlanToDate] = useState('')

  const [ChargeDeptName, setChargeDeptName] = useState('')
  const [ChargeDeptSeq, setChargeDeptSeq] = useState('')

  const [ChargeEmpName, setChargeEmpName] = useState('')

  const [ContractFrDate, setContractFrDate] = useState('')
  const [ContractToDate, setContractToDate] = useState('')
  const [PJTName, setPJTName] = useState('')
  const [PJTNo, setPJTNo] = useState('')
  const [ResultStdUnitName, setResultStdUnitName] = useState('')
  const [CustSeq, setCustSeq] = useState('')
  const [CustName, setCustName] = useState('')
  const [SMSalesRecognizeName, setSMSalesRecognizeName] = useState(null)
  const [SMSalesRecognize, setSMSalesRecognize] = useState(null)
  const [SMSalesReceiptName, setSMSalesReceiptName] = useState(null)
  const [SMSalesReceipt, setSMSalesReceipt] = useState(null)
  const [WBSResrcLevel, setWBSResrcLevel] = useState(null)
  const [SMExpKindName, setSMExpKindName] = useState(null)
  const [SMExpKind, setSMExpKind] = useState(null)
  const [CurrName, setCurrName] = useState(null)
  const [CurrSeq, setCurrSeq] = useState(null)
  const [CurrRate, setCurrRate] = useState(null)
  const [QryFr, setQryFr] = useState(null)
  const [QryTo, setQryTo] = useState(null)
  const [SMStatusSeq, setSMStatusSeq] = useState(null)
  const [FactUnit, setFactUnit] = useState(null)
  const [FactUnitName, setFactUnitName] = useState(null)
  const [PMSeq, setPMSeq] = useState(null)
  const [PJTTypeSeq, setPJTTypeSeq] = useState(null)

  const [cols, setCols] = useState(() =>
    loadFromLocalStorageSheet(
      'pjt_project_list_a',
      defaultCols.filter((col) => col.visible),
    ),
  )

  const [selection, setSelection] = useState({
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
        DeptData,
        dataPjtType,
        dataSMSalesRecognize,
        dataSMSalesReceipt,
        dataSMExpKindName,
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
        GetCodeHelpCombo('', 6, 70002, 1, '%', '', '', '', '', signal),
        GetCodeHelpCombo('', 6, 19998, 1, '%', '7002', '1001', '1', '', signal),
        GetCodeHelpCombo('', 6, 19998, 1, '%', '8009', '', '', '', signal),
      ])

      setDataBizUnit(dataBizUnit?.data)
      setDataCustomer(dataCust?.data)
      setDataUser(dataEmp?.data)
      setDeptData(DeptData?.data)
      setPJTTypeNameData(dataPjtType?.data || [])
      setDataSMSalesRecognize(dataSMSalesRecognize?.data)
      setDataSMSalesReceipt(dataSMSalesReceipt?.data)
      setDataSMExpKindName(dataSMExpKindName?.data)
    } catch {
      setDataBizUnit([])
      setDataCustomer([])
      setDataUser([])
      setDeptData([])
      setPJTTypeNameData([])
      setDataSMSalesRecognize([])
      setDataSMSalesReceipt([])
      setDataSMExpKindName([])
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

  const [modalOpen, setModalOpen] = useState(false)

  const [isMinusClicked, setIsMinusClicked] = useState(false)
  const [lastClickedCell, setLastClickedCell] = useState(null)
  const [clickedRowData, setClickedRowData] = useState(null)
  const [selected, setSelected] = useState([])

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
            setSelected(getSelectedRowsData())
          } else {
            newSelected = selection.rows.add(rowIndex)
            setSelected([])
          }
        }
      }
    },
    [gridData, getSelectedRowsData, selected],
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
          BizUnit: BizUnit,
          PlanFrDate: PlanFrDate ? dayjs(PlanFrDate).format('YYYYMMDD') : null,
          PlanToDate: PlanToDate ? dayjs(PlanToDate).format('YYYYMMDD') : null,
          QryFr: QryFr ? dayjs(QryFr).format('YYYYMMDD') : null,
          QryTo: QryTo ? dayjs(QryTo).format('YYYYMMDD') : null,
          PJTTypeSeq: PJTTypeSeq,
          PJTName: PJTName,
          PJTNo: PJTNo,
          SMSalesRecognize: SMSalesRecognize,
          SMStatusSeq: SMStatusSeq,
          CustSeq: CustSeq,
          ChargeDeptSeq: ChargeDeptSeq,
          ChargeEmpSeq: empSeq,
          SMExpKind: SMExpKind,
          FactUnit: FactUnit,
          FactUnitName: FactUnitName,
          PMSeq: PMSeq,
          ContractFrDate: ContractFrDate
            ? dayjs(ContractFrDate).format('YYYYMMDD')
            : null,
          ContractToDate: ContractToDate
            ? dayjs(ContractToDate).format('YYYYMMDD')
            : null,
        },
      ]

      const response = await searchPjtProjectList(data)
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
    BizUnit,
    FactUnit,
    FactUnitName,
    PMSeq,
    SMExpKind,
    SMSalesRecognize,
    SMStatusSeq,
    QryFr,
    PlanFrDate,
    PlanToDate,
    PJTName,
    PJTNo,
    CustSeq,
    ChargeDeptSeq,
    ContractFrDate,
    ContractToDate,
    QryTo,
    empSeq,
  ])

  const handleExternalSubmit = useCallback(async () => {
    const formatDateSearch = (date) => {
      const d = dayjs(date)
      return d.isValid() ? d.format('YYYYMMDD') : ''
    }

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

    const resulU = filterValidRows(gridData, 'U').map((item) => {
      return {
        ...item,
        WorkingTag: 'U',
      }
    })

    const errors = [...validateRequiredFields(resulU, requiredFields)]

    if (errors.length > 0) {
      setModal2Open(true)
      setErrorData(errors)
      return
    }

    const dataRstCost = [...resulU]

    handleSaveBasInfo(dataRstCost)
  }, [gridData, gridData, gridDataRstItem, gridData, gridDataRstItem])

  const handleSaveBasInfo = useCallback(
    async (dataRst) => {
      if (canCreate === false) {
        message.warning('Bạn không có quyền thêm dữ liệu')
        return
      }

      if (isSent) return
      setIsSent(true)

      try {
        const results = await auHrEduRstEnd(dataRst)

        if (results.success) {
          message.success('Thành công!')

          setIsSent(false)
          resetTable()

          const newData = results?.data?.logs2
          setGridData((prev) => {
            const updated = prev.map((item) => {
              const found = newData.find((x) => x?.IDX_NO === item?.IdxNo)

              return found
                ? {
                    ...item,
                    Status: '',
                    IdSeq: found?.IdSeq,
                    EduTypeSeq: found?.EduTypeSeq,
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
      }
    },
    [gridData],
  )

  const nextPage = useCallback(() => {
    if (selected.length > 0) {
      console.log({ selected })
      navigate(`/pm/project-mgmt/pjt-project`, { state: { selected } })
    }
  }, [navigate, selected])

  return (
    <>
      <Helmet>
        <title>ITM - {t('10044335')}</title>
      </Helmet>
      <TopLoadingBar color="blue" height={2} ref={loadingBarRef} />
      <div className="bg-slate-50 h-[calc(100vh-40px)] overflow-hidden">
        <div className="flex flex-col h-full">
          <div className="col-start-1 col-end-5 row-start-1 w-full">
            <div className="flex items-center justify-between">
              <Title level={4} className="m-2 uppercase opacity-85 ">
                {t('10044335')}
              </Title>
              <PjtProjectListAction
                setModalOpen={setModalOpen}
                handleSearch={onClickSearch}
                nextPage={nextPage}
                onClickSave={handleExternalSubmit}
              />
            </div>
            <details
              className="group p-2 [&_summary::-webkit-details-marker]:hidden border bg-white"
              open
            >
              <summary className="flex cursor-pointer items-center justify-between gap-1.5 text-gray-900">
                <h2 className="text-xs font-medium flex items-center gap-2  uppercase">
                  <FilterOutlined />
                  {t('359')}
                </h2>
                <span className="relative size-5 shrink-0">
                  <ArrowIcon />
                </span>
              </summary>
              <div className="flex p-2 gap-4">
                <PjtProjectListQuery
                  dataBizUnit={dataBizUnit}
                  dataCustomer={dataCustomer}
                  dataSMSalesRecognize={dataSMSalesRecognize}
                  dataSMSalesReceipt={dataSMSalesReceipt}
                  dataSMExpKindName={dataSMExpKindName}
                  dataCurrency={dataCurrency}
                  setBizUnit={setBizUnit}
                  PJTTypeNameData={PJTTypeNameData}
                  PJTTypeName={PJTTypeName}
                  setPJTTypeName={setPJTTypeName}
                  setPJTType={setPJTType}
                  PlanFrDate={PlanFrDate}
                  setPlanFrDate={setPlanFrDate}
                  PlanToDate={PlanToDate}
                  setPlanToDate={setPlanToDate}
                  setSelectEmp={setSelectEmp}
                  DeptData={deptData}
                  ChargeDeptName={ChargeDeptName}
                  setChargeDeptName={setChargeDeptName}
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
                  setSMSalesRecognizeName={setSMSalesRecognizeName}
                  SMSalesReceiptName={SMSalesReceiptName}
                  setSMSalesReceiptName={setSMSalesReceiptName}
                  SMSalesReceipt={SMSalesReceipt}
                  WBSResrcLevel={WBSResrcLevel}
                  setWBSResrcLevel={setWBSResrcLevel}
                  SMExpKindName={SMExpKindName}
                  setSMExpKindName={setSMExpKindName}
                  CurrName={CurrName}
                  setCurrName={setCurrName}
                  setCurrSeq={setCurrSeq}
                  CurrRate={CurrRate}
                  setCurrRate={setCurrRate}
                  QryFr={QryFr}
                  setQryFr={setQryFr}
                  QryTo={QryTo}
                  setQryTo={setQryTo}
                />
              </div>
            </details>
          </div>
          <div className="col-start-1 col-end-5 row-start-2 w-full h-full border-t overflow-hidden">
            <div className="h-full flex flex-col">
              <div className="flex-1 overflow-auto">
                <PjtProjectListTable
                  setSelection={setSelection}
                  selection={selection}
                  showSearch={showSearch13}
                  setShowSearch={setShowSearch13}
                  numRows={numRows}
                  setGridData={setGridData}
                  gridData={gridData}
                  setNumRows={setNumRows}
                  setCols={setCols}
                  cols={cols}
                  defaultCols={defaultCols}
                  canEdit={canEdit}
                  canCreate={canCreate}
                  fetchGenericData={fetchGenericData}
                  onCellClicked={onCellClicked}
                />
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
    </>
  )
}
