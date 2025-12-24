import { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet'
import { Typography, Menu, message } from 'antd'
const { Title, Text } = Typography
import { FilterOutlined } from '@ant-design/icons'
import { ArrowIcon } from '../../components/icons'
import dayjs from 'dayjs'
import { GetCodeHelp } from '../../../features/codeHelp/getCodeHelp'
import { GetCodeHelpCombo } from '../../../features/codeHelp/getCodeHelpCombo'
import { CompactSelection, GridColumnIcon } from '@glideapps/glide-data-grid'
import { debounce, set } from 'lodash'
import {
    useNavigate,
    useParams,
    createBrowserRouter,
    RouterProvider,
} from 'react-router-dom'
import TopLoadingBar from 'react-top-loading-bar';
import { loadFromLocalStorageSheet } from '../../../localStorage/sheet/sheet'
import { togglePageInteraction } from '../../../utils/togglePageInteraction'
import { GetCodeHelpVer2 } from '../../../features/codeHelp/getCodeHelpVer2'
import { GetWcQuery } from '../../../features/wc/wcQ'
import { Splitter, SplitterPanel } from 'primereact/splitter'
import { PostSPDSFCWorkReportMatQ } from '../../../features/pdsfc/postSPDSFCWorkReportMatQ'
import PdsfcWorkReportAction from '../../components/actions/pdsfc/pdsfcWorkReportAction'
import PdsfcWorkReportQuery from '../../components/query/pdsfc/pdsfcWorkReportQuery'
import TablepdsfcWorkReport from '../../components/table/pdsfc/tablepdsfcWorkReport'
import PdsfcWorkReportSeqQuery from '../../components/query/pdsfc/pdsfcWorkReportSeqQuery'
import Tablepdsf1968 from '../../components/table/pdsfc/tablepdsf1968'
import Tablepdsf1573 from '../../components/table/pdsfc/tablepdsf1573'
import Tablepdsf512 from '../../components/table/pdsfc/tablepdsf512'
import Tablepdsf14289 from '../../components/table/pdsfc/tablepdsf14289'
import Tablepdsf51676 from '../../components/table/pdsfc/tablepdsf51676'
import { updateIndexNo } from '../../components/sheet/js/updateIndexNo'
import { generateEmptyData } from '../../components/sheet/js/generateEmptyData'
import { PostSPDSFCWorkReportQ2 } from '../../../features/pdsfc/postSPDSFCWorkReportQ2'
import { PostSPDSFCWorkReportWorkEmpQ } from '../../../features/pdsfc/postSPDSFCWorkReportWorkEmpQ'
import { PostSPDSFCWorkReportNonWorkQ } from '../../../features/pdsfc/postSPDSFCWorkReportNonWorkQ'
import { PostSLGInOutDailyItemQ } from '../../../features/pdsfc/postSLGInOutDailyItemQ'
import { PostSLGInOutDailyQ } from '../../../features/pdsfc/postSLGInOutDailyQ'
import { PostSPDSFCWorkReportAUD } from '../../../features/pdsfc/postSPDSFCWorkReportAUD'
import { validateCheckColumns } from '../../../utils/validateColumns'
import { filterAndSelectColumns } from '../../../utils/filterUorA'
import { filterValidRows } from '../../../utils/filterUorA'
import { PostSPDSFCWorkReportMatAUD } from '../../../features/pdsfc/postSPDSFCWorkReportMatAUD'
import { PostSPDSFCWorkReportWorkEmpAUD } from '../../../features/pdsfc/postSPDSFCWorkReportWorkEmpAUD'
import { PostSLGLotNoMasterAUD } from '../../../features/pdsfc/postSLGLotNoMasterAUD'
import { PostSPDSFCWorkReportNonWorkAUD } from '../../../features/pdsfc/postSPDSFCWorkReportNonWorkAUD'
import { PostSLGInOutDailyD } from '../../../features/pdsfc/postSLGLotNoMasterD'
import { PostSLGInOutDailyDItem } from '../../../features/pdsfc/postSLGInOutDailyDItem'
import { PostSPDSFCWorkReportMatQCheck } from '../../../features/pdsfc/postSPDSFCWorkReportMatQCheck'

import CryptoJS from 'crypto-js'
import {
    Package,
    MonitorSmartphone,
    Plane,
    Tag,
    PowerOff
} from 'lucide-react';
import { use } from 'i18next'
import ErrorListModal from '../default/errorListModal'
export default function PdsfcWorkReport({ permissions,
    isMobile,
    canCreate,
    canEdit,
    canDelete,
    controllers,
    cancelAllRequests


}) {
    const { t } = useTranslation()
    const gridRef = useRef(null)
    const activeFetchCountRef = useRef(0);
    const navigate = useNavigate()
    const { seq } = useParams()
    const loadingBarRef = useRef(null);
    const defaultCols = useMemo(() => [
        {
            title: '',
            id: 'Status',
            kind: 'Text',
            readonly: true,
            width: 50,
            hasMenu: true,
            visible: true,
            icon: GridColumnIcon.HeaderLookup
        },


        {
            title: t('Work center'),
            id: 'WorkCenterName',
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
            title: t('1985'),
            id: 'WorkOrderNo',
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
            title: t('1773'),
            id: 'GoodItemName',
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
            title: t('1774'),
            id: 'GoodItemNo',
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
            title: t('16000'),
            id: 'GoodItemSpec',
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
            title: t('2252'),
            id: 'ProcRevName',
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
            title: t('809'),
            id: 'ItemBomRevName',
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
            title: t('510'),
            id: 'ProcName',
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
            title: t('2102'),
            id: 'AssyItemName',
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
            title: t('2101'),
            id: 'AssyItemNo',
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
            title: t('2846'),
            id: 'AssyItemSpec',
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
            title: t('1529'),
            id: 'ProdUnitName',
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
            title: t('16930'),
            id: 'OrderQty',
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
            title: t('2647'),
            id: 'ProdQty',
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
            title: t('7145'),
            id: 'OKQty',
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
            title: t('6009'),
            id: 'BadQty',
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
            title: t('8226'),
            id: 'WorkStartTime',
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
            title: t('8258'),
            id: 'WorkEndTime',
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
            title: t('350'),
            id: 'WorkHour',
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
            title: t('8232'),
            id: 'ProcHour',
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
            title: t('1982'),
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
            title: t('LotNo'),
            id: 'RealLotNo',
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
            title: t('8269'),
            id: 'WorkCondition1',
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
            title: t('8270'),
            id: 'WorkCondition2',
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
            title: t('8271'),
            id: 'WorkCondition3',
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
            title: t('8272'),
            id: 'WorkCondition4',
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
            title: t('8273'),
            id: 'WorkCondition5',
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
            title: t('8274'),
            id: 'WorkCondition6',
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
            title: t('22278'),
            id: 'WorkCondition7',
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
            title: t('4519'),
            id: 'StdUnitProdQty',
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
            title: t('4521'),
            id: 'StdUnitOKQty',
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
            title: t('4516'),
            id: 'StdUnitBadQty',
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
            title: t('1981'),
            id: 'WorkType',
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
            title: t('362'),
            id: 'Remark',
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
            title: t('8256'),
            id: 'ToSeq',
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
            title: t('3093'),
            id: 'IsProcQC',
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
            title: t('3240'),
            id: 'IsLastProc',
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
            title: t('2461'),
            id: 'FromQty',
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
            title: t('1524'),
            id: 'ProdPlanNo',
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
            title: t('16878'),
            id: 'IsMatInPut',
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
            title: t('GoodInSeq'),
            id: 'GoodInSeq',
            kind: 'Text',
            readonly: true,
            width: 200,
            hasMenu: true,
            visible: false,
            trailingRowOptions: {
                disabled: true,
            },
        },

    ], [t]);
    const defaultCols2 = useMemo(() => [
        {
            title: '',
            id: 'Status',
            kind: 'Text',
            readonly: true,
            width: 50,
            hasMenu: true,
            visible: true,
            icon: GridColumnIcon.HeaderLookup
        },



        {
            title: t('2170'),
            id: 'MatItemName',
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
            title: t('2169'),
            id: 'MatItemNo',
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
            title: t('1969'),
            id: 'MatItemSpec',
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
            title: t('602'),
            id: 'MatUnitName',
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
            title: t('6700'),
            id: 'NeedQty',
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
            title: t('9992'),
            id: 'Qty',
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
            title: t('2474'),
            id: 'StdUnitQty',
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
            title: t('LotNo'),
            id: 'RealLotNo',
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
            title: t('6842'),
            id: 'IsConsign',
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
            title: t('16878'),
            id: 'IsLotMng',
            kind: 'Text',
            readonly: false,
            width: 150,
            hasMenu: true,
            visible: true,
            trailingRowOptions: {
                disabled: true,
            },
        },




    ], [t]);
    const defaultCols3 = useMemo(() => [
        {
            title: '',
            id: 'Status',
            kind: 'Text',
            readonly: true,
            width: 50,
            hasMenu: true,
            visible: true,
            icon: GridColumnIcon.HeaderLookup
        },



        {
            title: t('1576'),
            id: 'ToolName',
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
            title: t('654'),
            id: 'ToolNo',
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
            title: t('1982'),
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
            title: t('3233'),
            id: 'PrepareHour',
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
            title: t('100'),
            id: 'WorkHour',
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
            title: t('675'),
            id: 'IsDie',
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
            title: t('4381'),
            id: 'ToolCondition1',
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
            title: t('Cavity'),
            id: 'Cavity',
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
            title: t('369'),
            id: 'SMStatusName',
            kind: 'Text',
            readonly: false,
            width: 150,
            hasMenu: true,
            visible: true,
            trailingRowOptions: {
                disabled: true,
            },
        },



    ], [t]);
    const defaultCols4 = useMemo(() => [
        {
            title: '',
            id: 'Status',
            kind: 'Text',
            readonly: true,
            width: 50,
            hasMenu: true,
            visible: true,
            icon: GridColumnIcon.HeaderLookup
        },



        {
            title: t('UMWorkCenterEmpType'),
            id: 'UMWorkCenterEmpType',
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
            title: t('7547'),
            id: 'UMWorkCenterEmpName',
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
            title: t('4305'),
            id: 'WorkStartTime',
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
            title: t('8258'),
            id: 'WorkEndTime',
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
            title: t('7916'),
            id: 'EmpCnt',
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
            title: t('1656'),
            id: 'WorkHour',
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
            title: t('8232'),
            id: 'ManHour',
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
            title: t('360'),
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
            title: t('Serl'),
            id: 'Serl',
            kind: 'Text',
            readonly: true,
            width: 150,
            hasMenu: true,
            visible: false,
            trailingRowOptions: {
                disabled: true,
            },
        },



    ], [t]);
    const defaultCols5 = useMemo(() => [
        {
            title: '',
            id: 'Status',
            kind: 'Text',
            readonly: true,
            width: 50,
            hasMenu: true,
            visible: true,
            icon: GridColumnIcon.HeaderLookup
        },



        {
            title: t('1786'),
            id: 'ItemName',
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
            title: t('2091'),
            id: 'ItemNo',
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
            title: t('551'),
            id: 'Spec',
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
            title: t('602'),
            id: 'UnitName',
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
            title: t('2359'),
            id: 'Price',
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
            title: t('1628'),
            id: 'Qty',
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
            title: t('290'),
            id: 'Amt',
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
            title: t('3039'),
            id: 'InOutDetailKindName',
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
            title: t('InOutDetailKind'),
            id: 'InOutDetailKind',
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
            title: t('2085'),
            id: 'STDUnitName',
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
            title: t('2474'),
            id: 'STDQty',
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
            title: t('LotNo'),
            id: 'LotNo',
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
        },



    ], [t]);
    const defaultCols6 = useMemo(() => [
        {
            title: '',
            id: 'Status',
            kind: 'Text',
            readonly: true,
            width: 50,
            hasMenu: true,
            visible: true,
            icon: GridColumnIcon.HeaderLookup
        },



        {
            title: t('51674'),
            id: 'UMNonWorkTypeL',
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
            title: t('51675'),
            id: 'UMNonWorkTypeS',
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
            title: t('4305'),
            id: 'WorkStartTime',
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
            title: t('8258'),
            id: 'WorkEndTime',
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
            title: t('1576'),
            id: 'ToolName',
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
            title: t('654'),
            id: 'ToolNo',
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
            title: t('33405'),
            id: 'NonWorkHour',
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
            title: t('51676'),
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



    ], [t]);
    const [loadingA, setLoadingA] = useState(false)
    const [showSearch, setShowSearch] = useState(false)
    const [showSearch2, setShowSearch2] = useState(false)
    const [showSearch3, setShowSearch3] = useState(false)
    const [showSearch4, setShowSearch4] = useState(false)
    const [showSearch5, setShowSearch5] = useState(false)
    const [showSearch6, setShowSearch6] = useState(false)
    const [loading, setLoading] = useState(false)
    const [dataSeq, setDataSeq] = useState([])
    const [gridDataLogs, setGridDataLogs] = useState([])
    const [gridData, setGridData] = useState([])
    const [gridData2, setGridData2] = useState([])
    const [gridData3, setGridData3] = useState([])
    const [gridData4, setGridData4] = useState([])
    const [gridData5, setGridData5] = useState([])
    const [gridData6, setGridData6] = useState([])
    const [gridData7, setGridData7] = useState([])
    const [numRowsLogs, setNumRowsLogs] = useState(0)
    const [numRows, setNumRows] = useState(0)
    const [numRows2, setNumRows2] = useState(0)
    const [numRows3, setNumRows3] = useState(0)
    const [numRows4, setNumRows4] = useState(0)
    const [numRows5, setNumRows5] = useState(0)
    const [numRows6, setNumRows6] = useState(0)
    const [numRows7, setNumRows7] = useState(0)
    const [searchText, setSearchText] = useState('')
    const [searchText2, setSearchText2] = useState('')
    const [itemText, setItemText] = useState('')
    const [itemText2, setItemText2] = useState('')
    const [dataSearch, setDataSearch] = useState(null)
    const [dataSearch2, setDataSearch2] = useState(null)
    const [helpData01, setHelpData01] = useState([])
    const [helpData02, setHelpData02] = useState([])
    const [helpData03, setHelpData03] = useState([])
    const [helpData04, setHelpData04] = useState([])
    const [helpData07, setHelpData07] = useState([])
    const [helpData08, setHelpData08] = useState([])
    const [helpData09, setHelpData09] = useState([])
    const [helpData10, setHelpData10] = useState([])
    const [helpData11, setHelpData11] = useState([])
    const [helpData12, setHelpData12] = useState([])
    const [helpData13, setHelpData13] = useState([])
    const [helpData14, setHelpData14] = useState([])
    const [dataSheetSearch, setDataSheetSearch] = useState([])
    const [dataSheetSearch2, setDataSheetSearch2] = useState([])
    const [editedRows, setEditedRows] = useState([])

    const [dataWarehouse, setDataWarehouse] = useState([])
    const [dataSheetSearch3, setDataSheetSearch3] = useState([])
    const [searchText3, setSearchText3] = useState('')
    const [itemText3, setItemText3] = useState('')
    const [dataSearch3, setDataSearch3] = useState('')

    const [dataSheetSearch4, setDataSheetSearch4] = useState([])
    const [searchText4, setSearchText4] = useState('')
    const [itemText4, setItemText4] = useState('')
    const [dataSearch4, setDataSearch4] = useState('')

    const [dataSheetSearch5, setDataSheetSearch5] = useState([])
    const [searchText5, setSearchText5] = useState('')
    const [itemText5, setItemText5] = useState('')
    const [dataSearch5, setDataSearch5] = useState('')

    const [formData, setFormData] = useState(dayjs())
    const [toDate, setToDate] = useState(dayjs())
    const [FactUnit, setFactUnit] = useState('')

    const [current, setCurrent] = useState('1');
    const secretKey = 'KEY_PATH'
    const [modal2Open, setModal2Open] = useState(false)
    const [errorData, setErrorData] = useState(null)
    const [BizUnit, setBizUnit] = useState(null)
    const [checkPageA, setCheckPageA] = useState(false)
    const formatDate = (date) => date.format('YYYYMMDD')
    const [cols, setCols] = useState(() =>
        loadFromLocalStorageSheet(
            'pdsfc_work_report_a',
            defaultCols.filter((col) => col.visible)
        )
    )
    const [selection, setSelection] = useState({
        columns: CompactSelection.empty(),
        rows: CompactSelection.empty()
    })

    const [cols2, setCols2] = useState(() =>
        loadFromLocalStorageSheet(
            'pdsfc_work_report_1968_a',
            defaultCols2.filter((col) => col.visible)
        )
    )
    const [selection2, setSelection2] = useState({
        columns: CompactSelection.empty(),
        rows: CompactSelection.empty()
    })
    const [cols3, setCols3] = useState(() =>
        loadFromLocalStorageSheet(
            'pdsfc_work_report_1573_a',
            defaultCols3.filter((col) => col.visible)
        )
    )
    const [selection3, setSelection3] = useState({
        columns: CompactSelection.empty(),
        rows: CompactSelection.empty()
    })

    const [cols4, setCols4] = useState(() =>
        loadFromLocalStorageSheet(
            'pdsfc_work_report_512_a',
            defaultCols4.filter((col) => col.visible)
        )
    )
    const [selection4, setSelection4] = useState({
        columns: CompactSelection.empty(),
        rows: CompactSelection.empty()
    })
    const [cols5, setCols5] = useState(() =>
        loadFromLocalStorageSheet(
            'pdsfc_work_report_14289_a',
            defaultCols5.filter((col) => col.visible)
        )
    )
    const [selection5, setSelection5] = useState({
        columns: CompactSelection.empty(),
        rows: CompactSelection.empty()
    })


    const [cols6, setCols6] = useState(() =>
        loadFromLocalStorageSheet(
            'pdsfc_work_report_51676_a',
            defaultCols6.filter((col) => col.visible)
        )
    )
    const [selection6, setSelection6] = useState({
        columns: CompactSelection.empty(),
        rows: CompactSelection.empty()
    })

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
            return null
        }
    }

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
        cancelAllRequests();
        message.destroy();
    }, [])

    useEffect(() => {
        const emptyData = generateEmptyData(100, defaultCols)
        const updatedEmptyData = updateIndexNo(emptyData)
        setGridData(updatedEmptyData)
        setNumRows(emptyData.length)

        setGridData2(updatedEmptyData)
        setNumRows2(emptyData.length)

        setGridData4(updatedEmptyData)
        setNumRows4(emptyData.length)

        setGridData5(updatedEmptyData)
        setNumRows5(emptyData.length)

        setGridData6(updatedEmptyData)
        setNumRows6(emptyData.length)
    }, [])



    const increaseFetchCount = () => {
        activeFetchCountRef.current += 1;
    };

    const decreaseFetchCount = () => {
        activeFetchCountRef.current -= 1;
        if (activeFetchCountRef.current === 0) {
            loadingBarRef.current?.complete();
            togglePageInteraction(false);
        }
    };

    const fetchCodeHelpData = useCallback(async () => {
        increaseFetchCount();

        if (controllers.current.fetchCodeHelpData) {
            controllers.current.fetchCodeHelpData.abort();
            controllers.current.fetchCodeHelpData = null;
            await new Promise((resolve) => setTimeout(resolve, 10));
        }

        loadingBarRef.current?.continuousStart();

        const controller = new AbortController();
        const signal = controller.signal;
        controllers.current.fetchCodeHelpData = controller;

        setLoading(true);

        try {
            const search = {
                FactUnit: '',
                SMWorkCenterType: '',
                WorkCenterName: '',
                DeptName: ''
            };

            const [help01, help03, help04, help07, help08, help09, help10, help11, help12, help13, help14] = await Promise.all([
                GetCodeHelpVer2(10010, '', '', '', '', '', '', 1, 0, '', 0, 0, 0, signal),
                GetCodeHelpCombo('', 6, 19998, 1, '%', '6041', '', '', '', signal),
                GetCodeHelpCombo('', 6, 60001, 1, '%', '', '', '', '', signal),
                GetWcQuery(search, signal),
                GetCodeHelpVer2(
                    10006,
                    '',
                    '',
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
                GetCodeHelpVer2(10009, '', '', '', '', '', '', 1, 0, '', 0, 0, 0, signal),
                GetCodeHelpVer2(18001, '', '', '', '', '', '', 1, 0, '', 0, 0, 0, signal),
                GetCodeHelpCombo('', 6, 19999, 1, '%', '8026', '', '', '', signal),
                GetCodeHelpCombo('', 6, 19998, 1, '%', '6041', '', '', '', signal),
                GetCodeHelpCombo('', 6, 19999, 1, '%', '6015', '', '', '', signal),
                GetCodeHelpVer2(60003, '', '', '', '', '', '2', 1, 0, '', 0, 0, 0, signal),
            ]);

            setHelpData01(help01?.data || []);
            setHelpData03(help03?.data || []);
            setHelpData04(help04?.data || []);
            setHelpData07(help07?.data || []);
            setDataWarehouse(help08?.data || [])
            setHelpData08(help09?.data || [])
            setHelpData10(help10?.data || [])
            setHelpData11(help11?.data || [])
            setHelpData12(help12?.data || [])
            setHelpData13(help13?.data || [])
            setHelpData14(help14?.data || [])
        } catch {
            setHelpData01([]);
            setHelpData03([]);
            setHelpData04([]);
            setHelpData07([]);
            setDataWarehouse([]);
            setHelpData08([]);
            setHelpData11([])
            setHelpData12([])
        } finally {
            decreaseFetchCount();
            controllers.current.fetchCodeHelpData = null;
            setLoading(false);
        }
    }, []);



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

    const fetchGenericData = async ({
        controllerKey,
        postFunction,
        setGridData,
        setNumRows,
        searchParams,
        afterFetch = () => { },
    }) => {
        increaseFetchCount();

        if (controllers.current[controllerKey]) {
            controllers.current[controllerKey].abort();
            await new Promise((resolve) => setTimeout(resolve, 10));
            return fetchGenericData({
                controllerKey,
                postFunction,
                setGridData,
                setNumRows,
                searchParams,
                afterFetch,
            });
        }

        const controller = new AbortController();
        controllers.current[controllerKey] = controller;
        const { signal } = controller;

        togglePageInteraction(true);
        loadingBarRef.current?.continuousStart();

        try {
            const response = await postFunction(searchParams, signal);
            const emptyData = updateIndexNo(generateEmptyData(100, defaultCols));

            if (response.success) {
                const data = response.data || [];
                const mergedData = updateIndexNo([...data, ...emptyData]);

                if (typeof setGridData === 'function') {
                    setGridData(mergedData);
                }
                if (typeof setNumRows === 'function') {
                    setNumRows(mergedData.length + 1);
                }

                await afterFetch(mergedData);
            } else {
                if (typeof setGridData === 'function') {
                    setGridData(emptyData);
                }
                if (typeof setNumRows === 'function') {
                    setNumRows(emptyData.length + 1);
                }
            }
        } catch (error) {
            const mergedData = updateIndexNo([...data, ...emptyData]);

            if (typeof setGridData === 'function') {
                setGridData(mergedData);
            }
            if (typeof setNumRows === 'function') {
                setNumRows(mergedData.length + 1);
            }
        } finally {
            decreaseFetchCount();
            controllers.current[controllerKey] = null;
        }
    };
    const fetchSLGInOutDailyQ = (search) => {
        increaseFetchCount();

        if (controllers.current.fetchSLGInOutDailyQ) {
            controllers.current.fetchSLGInOutDailyQ.abort();
            return new Promise((resolve) => setTimeout(resolve, 10)).then(() => fetchSLGInOutDailyQ(search));
        }

        const controller = new AbortController();
        const signal = controller.signal;
        controllers.current.fetchSLGInOutDailyQ = controller;

        togglePageInteraction(true);
        loadingBarRef.current?.continuousStart();

        PostSLGInOutDailyQ(search, signal)
            .then((response) => {
                if (response.success) {
                    const data = response.data || [];
                    setGridData7(data[0])
                    setSearchText4(data[0]?.EmpName)
                    setSearchText3(data[0]?.InWHName)
                    setDataSheetSearch3(data)
                    setDataSheetSearch4(data)
                } else {
                    setGridData7([]);
                }
            })
            .catch(() => {
                setGridData7([]);
            })
            .finally(() => {
                decreaseFetchCount();
                controllers.current.fetchSLGInOutDailyQ = null;
            });
    };
    useEffect(() => {
        if (!seq) return;

        const decrypted = decryptData(seq);
        if (!decrypted) return;
        setDataSeq(decrypted);
        if (decrypted?.NewRow === true) {
            const newData = ([decrypted] || []).map(item => ({
                ...item,
                Status: 'A',
            }));
            setCheckPageA(true)
            if (decrypted.length === 0) {
                message.warning(t(t('870000043')));
                return;
            }
            setGridData(prevGridData => {
                let updatedGridData = [...prevGridData];

                newData.forEach(newItem => {
                    const lastFilledIndex = [...updatedGridData]
                        .reverse()
                        .findIndex(row => row.WorkOrderSeq && row.WorkOrderSeq !== "");

                    const insertIndex = lastFilledIndex !== -1
                        ? updatedGridData.length - lastFilledIndex
                        : 0;

                    updatedGridData.splice(insertIndex, 0, newItem);
                });

                updatedGridData = updatedGridData.map((row, idx) => ({
                    ...row,
                    IdxNo: idx + 1,

                }));

                setNumRows(updatedGridData.length);
                return updatedGridData;
            });
        } else {
            setCheckPageA(false)
            const searchParams = {
                WorkReportSeq: decrypted?.WorkReportSeq,
                FactUnit: decrypted?.FactUnit,
                DeptSeq: decrypted?.DeptSeq,
                DeptName: decrypted?.DeptName,
                WorkDate: decrypted?.WorkDate,
                WorkCenterSeq: decrypted?.WorkCenterSeq,
                WorkCenterName: decrypted?.WorkCenterName,
            };

            fetchGenericData({
                controllerKey: 'fetchData',
                postFunction: PostSPDSFCWorkReportQ2,
                setGridData: setGridData,
                setNumRows: setNumRows,
                searchParams,
                afterFetch: async (mergedData) => {
                    const firstItem = mergedData[0];
                    if (firstItem?.SubEtcInSeq) {
                        const searchParamsWithSubEtchSeq = {
                            InOutSeq: firstItem.SubEtcInSeq,
                        };
                        await fetchGenericData({
                            controllerKey: 'fetchSLGInOutDailyItemQ',
                            postFunction: PostSLGInOutDailyItemQ,
                            setGridData: setGridData5,
                            setNumRows: setNumRows5,
                            searchParams: searchParamsWithSubEtchSeq,
                        });
                        await fetchSLGInOutDailyQ(searchParamsWithSubEtchSeq);

                    }
                },
            });

            fetchGenericData({
                controllerKey: 'fetchSPDSFCWorkReportMatQ',
                postFunction: PostSPDSFCWorkReportMatQ,
                setGridData: setGridData2,
                setNumRows: setNumRows2,
                searchParams,
            });

            fetchGenericData({
                controllerKey: 'fetchSPDSFCWorkReportWorkEmpQ',
                postFunction: PostSPDSFCWorkReportWorkEmpQ,
                setGridData: setGridData4,
                setNumRows: setNumRows4,
                searchParams,
                afterFetch: async (mergedData) => {
                    const helpDataMap = new Map(helpData13.map(item => [item.Value, item.MinorName]));


                },
            });

            fetchGenericData({
                controllerKey: 'fetchSPDSFCWorkReportNonWorkQ',
                postFunction: PostSPDSFCWorkReportNonWorkQ,
                setGridData: setGridData6,
                setNumRows: setNumRows6,
                searchParams,
            });
        }




    }, [seq]);

    const handleSave = useCallback(async () => {
        if (!canCreate) return true;
        const resulA = filterValidRows(gridData, 'A').map(item => ({
            ...item,
            WorkingTag: 'A',
            FactUnitMater: FactUnit,
            DateMater: formatDate(formData),
            DeptSeqMater: dataSheetSearch?.[0]?.BeDeptSeq || dataSheetSearch?.[0]?.DeptSeq || 0

        }));
        const resulU = filterValidRows(gridData, 'U')
            .map(item => ({
                ...item,
                WorkingTag: 'U',
                FactUnitMater: FactUnit,
                DateMater: formatDate(formData),
                DeptSeqMater: dataSheetSearch?.[0]?.BeDeptSeq || dataSheetSearch?.[0]?.DeptSeq || 0

            }));

        if (resulA.length === 0 && resulU.length === 0) {
            togglePageInteraction(false);
            loadingBarRef.current?.complete();
            message.warning(t('870000041'));
            return true;
        }



        togglePageInteraction(true);
        loadingBarRef.current?.continuousStart();

        try {
            const apiCalls = [];
            if (resulA.length > 0) apiCalls.push(PostSPDSFCWorkReportAUD(resulA));
            if (resulU.length > 0) apiCalls.push(PostSPDSFCWorkReportAUD(resulU));

            const results = await Promise.all(apiCalls);
            const isSuccess = results.every(result => result?.success);

            if (isSuccess) {
                const mergedData = results.flatMap(result => result?.data?.logs2 || []);

                const mergedMap = new Map(
                    mergedData.map(item => [item.IDX_NO, item])
                );

                setGridData(prevGrid => {
                    const updated = prevGrid.map(item => {
                        const matched = mergedMap.get(item.IdxNo);

                        if (matched) {
                            return {
                                ...item,
                                Status: '',
                                GoodInSeq: matched.GoodInSeq,
                                AssyItemSeq: matched.AssyItemSeq,
                                BadQty: matched.BadQty,
                                DeptSeq: matched.DeptSeq,
                                FactUnit: matched.FactUnit,
                                GoodItemSeq: matched.GoodItemSeq,
                                OKQty: matched.OKQty,
                                OldOKQty: matched.OldOKQty,
                                OldStdUnitOKQty: matched.OldStdUnitOKQty,
                                ProcRev: matched.ProcRev,
                                WorkOrderNo: matched.WorkOrderNo,
                                WorkDate: matched.WorkDate,
                                WorkOrderSeq: matched.WorkOrderSeq,
                                WorkCenterSeq: matched.WorkCenterSeq,
                                ProdUnitSeq: matched.ProdUnitSeq,
                                WorkStartTime: matched.WorkStartTime,
                                WorkEndTime: matched.WorkEndTime,
                                WorkHour: matched.WorkHour,
                                WorkerQty: matched.WorkerQty,
                                WorkType: matched.WorkType,
                                RealLotNo: matched.RealLotNo,
                                EmpSeq: matched.EmpSeq,
                                WorkCondition1: matched.WorkCondition1,
                                WorkCondition2: matched.WorkCondition2,
                                WorkCondition3: matched.WorkCondition3,
                                WorkCondition4: matched.WorkCondition4,
                                WorkCondition5: matched.WorkCondition5,
                                WorkCondition6: matched.WorkCondition6,
                                WorkCondition7: matched.WorkCondition7,
                                Remark: matched.Remark,
                                IsLastProc: matched.IsLastProc,
                                IsPjt: matched.IsPjt,
                                PJTSeq: matched.PJTSeq,
                                WBSSeq: matched.WBSSeq,
                                WorkTimeGroup: matched.WorkTimeGroup,
                                ItemBomRevName: matched.ItemBomRevName,
                                LossCostQty: matched.LossCostQty,
                                DisuseQty: matched.DisuseQty,
                                ReOrderQty: matched.ReOrderQty,
                                StdUnitReOrderQty: matched.StdUnitReOrderQty,
                                StdUnitLossCostQty: matched.StdUnitLossCostQty,
                                StdUnitDisuseQty: matched.StdUnitDisuseQty,
                                SampleQty: matched.SampleQty,
                                StdSampleQty: matched.StdSampleQty,
                                SampleUnitSeq: matched.SampleUnitSeq,
                                SerialNoFrom: matched.SerialNoFrom,
                                SerialNoTo: matched.SerialNoTo,
                                WorkReportSeq: matched.WorkReportSeq,
                            };
                        }

                        return item;
                    });

                    return updateIndexNo(updated);
                });

            } else {
                const errorItems = results.flatMap(result => result?.errors || []);
                setModal2Open(true);
                setErrorData(errorItems);
                message.error(t('870000040'));
            }

        } catch (error) {
            message.error(`Đã xảy ra lỗi: ${error.message || 'Unknown error'}`);
        } finally {
            loadingBarRef.current?.complete();
            togglePageInteraction(false);
        }
    }, [gridData, canCreate, formData, FactUnit, dataSheetSearch]);

    const handleSave2 = useCallback(async () => {
        if (!canCreate || checkPageA) return true;

        const resulA = filterValidRows(gridData2, 'A').map(item => ({
            ...item,
            WorkingTag: 'A',
            FactUnit: FactUnit,
            Date: formatDate(formData),
            DeptSeq: dataSheetSearch?.[0]?.BeDeptSeq || dataSheetSearch?.[0]?.DeptSeq || 0,
            WorkReportSeq: dataSeq?.WorkReportSeq,
            WorkDate: dataSeq?.WorkDate,
            ProcSeq: dataSeq?.ProcSeq,


        }));
        const resulU = filterValidRows(gridData2, 'U')
            .map(item => ({
                ...item,
                WorkingTag: 'U',
                FactUnit: FactUnit,
                Date: formatDate(formData),
                DeptSeq: dataSheetSearch?.[0]?.BeDeptSeq || dataSheetSearch?.[0]?.DeptSeq || 0,
                WorkReportSeq: dataSeq?.WorkReportSeq,
                WorkDate: dataSeq?.WorkDate,
                ProcSeq: dataSeq?.ProcSeq,

            }));

        if (resulA.length === 0 && resulU.length === 0) {
            togglePageInteraction(false);
            loadingBarRef.current?.complete();
            message.warning(t('870000041'));
            return true;
        }



        togglePageInteraction(true);
        loadingBarRef.current?.continuousStart();

        try {
            const apiCalls = [];
            if (resulA.length > 0) apiCalls.push(PostSPDSFCWorkReportMatAUD(resulA));
            if (resulU.length > 0) apiCalls.push(PostSPDSFCWorkReportMatAUD(resulU));

            const results = await Promise.all(apiCalls);
            const isSuccess = results.every(result => result?.success);
            if (isSuccess) {
                const mergedData = results.flatMap(result => result?.data?.logs2 || []);
                const mergedMap = new Map(
                    mergedData.map(item => [item.IDX_NO, item])
                );

                setGridData2(prevGrid => {
                    const updated = prevGrid.map(item => {
                        const matched = mergedMap.get(item.IdxNo);

                        if (matched) {
                            return {
                                ...item,
                                Status: '',
                                InOutDataSerl: matched.InOutDataSerl,
                                IDX_NO: matched.IDX_NO,
                                DataSeq: matched.DataSeq,
                                InWHSeq: matched.InWHSeq,
                                LastUserSeq: matched.LastUserSeq,
                                OutWHSeq: matched.OutWHSeq,
                                Qty: matched.Qty,
                                UnitSeq: matched.UnitSeq,
                                InOutKind: matched.InOutKind,
                                InOutDetailKind: matched.InOutDetailKind,
                                StdUnitQty: matched.STDQty,
                            };
                        }

                        return item;
                    });

                    return updateIndexNo(updated);
                });
            } else {
                const errorItems = results.flatMap(result => result?.errors || []);
                setModal2Open(true);
                setErrorData(errorItems);
                message.error(t('870000040'));
            }

        } catch (error) {
            message.error(`Đã xảy ra lỗi: ${error.message || 'Unknown error'}`);
        } finally {
            loadingBarRef.current?.complete();
            togglePageInteraction(false);
        }

    }, [gridData2, canCreate, formData, FactUnit, dataSheetSearch]);
    const handleSave4 = useCallback(async () => {
        if (!canCreate || checkPageA) return true;
        const resulA = filterValidRows(gridData4, 'A').map(item => ({
            ...item,
            WorkingTag: 'A',
            FactUnit: FactUnit,
            Date: formatDate(formData),
            DeptSeq: dataSheetSearch?.[0]?.BeDeptSeq || dataSheetSearch?.[0]?.DeptSeq || 0,
            WorkReportSeq: dataSeq?.WorkReportSeq,
            WorkDate: dataSeq?.WorkDate,
            ProcSeq: dataSeq?.ProcSeq,


        }));
        const resulU = filterValidRows(gridData4, 'U')
            .map(item => ({
                ...item,
                WorkingTag: 'U',
                FactUnit: FactUnit,
                Date: formatDate(formData),
                DeptSeq: dataSheetSearch?.[0]?.BeDeptSeq || dataSheetSearch?.[0]?.DeptSeq || 0,
                WorkReportSeq: dataSeq?.WorkReportSeq,
                WorkDate: dataSeq?.WorkDate,
                ProcSeq: dataSeq?.ProcSeq,

            }));

        if (resulA.length === 0 && resulU.length === 0) {
            togglePageInteraction(false);
            loadingBarRef.current?.complete();
            message.warning(t('870000041'));
            return true;
        }



        togglePageInteraction(true);
        loadingBarRef.current?.continuousStart();

        try {
            const apiCalls = [];
            if (resulA.length > 0) apiCalls.push(PostSPDSFCWorkReportWorkEmpAUD(resulA));
            if (resulU.length > 0) apiCalls.push(PostSPDSFCWorkReportWorkEmpAUD(resulU));

            const results = await Promise.all(apiCalls);

            const isSuccess = results.every(result => result?.success);
            if (isSuccess) {
                const mergedData = results.flatMap(result => result?.data?.logs1 || []);
                const mergedMap = new Map(
                    mergedData.map(item => [item.IDX_NO, item])
                );

                setGridData4(prevGrid => {
                    const updated = prevGrid.map(item => {
                        const matched = mergedMap.get(item.IdxNo);

                        if (matched) {
                            return {
                                ...item,
                                Status: '',
                                IDX_NO: matched.IDX_NO,
                            };
                        }

                        return item;
                    });

                    return updateIndexNo(updated);
                });
            } else {
                const errorItems = results.flatMap(result => result?.errors || []);
                setModal2Open(true);
                setErrorData(errorItems);
                message.error(t('870000040'));
            }

        } catch (error) {
            message.error(`Đã xảy ra lỗi: ${error.message || 'Unknown error'}`);
        } finally {
            loadingBarRef.current?.complete();
            togglePageInteraction(false);
        }

    }, [gridData4, canCreate, formData, FactUnit, dataSheetSearch]);
    const handleSave5 = useCallback(async () => {
        if (!canCreate || checkPageA) return true;
        const WorkingTag = gridData7?.InOutNo && gridData7?.InOutSeq ? 'U' : 'A';

        const headerData = {
            BizUnit: BizUnit ?? 0,
            InWHSeq: dataSheetSearch3[0]?.WHSeq ?? 0,
            InWHName: dataSheetSearch3[0]?.WHName ?? 0,
            EmpSeq: dataSheetSearch4[0]?.EmpSeq ?? 0,
            EmpName: dataSheetSearch4[0]?.EmpName ?? 0,
            DeptSeq: dataSheetSearch?.[0]?.BeDeptSeq || dataSheetSearch?.[0]?.DeptSeq || 0,
            InOutDate: formatDate(formData),
            WorkingTag: WorkingTag,
            InOutNo: gridData7?.InOutNo ?? 0,
            InOutSeq: gridData7?.InOutSeq ?? 0,
        };
        const resulA = filterValidRows(gridData5, 'A').map(item => ({
            ...item,
            WorkingTag: 'A',
            FactUnit: FactUnit,
            Date: formatDate(formData),
            DeptSeq: dataSheetSearch?.[0]?.BeDeptSeq || dataSheetSearch?.[0]?.DeptSeq || 0,
            WorkReportSeq: dataSeq?.WorkReportSeq,
            WorkDate: dataSeq?.WorkDate,
            ProcSeq: dataSeq?.ProcSeq,
            InOutNo: gridData7?.InOutNo,
            InOutSeq: gridData7?.InOutSeq,

        }));
        const resulU = filterValidRows(gridData5, 'U')
            .map(item => ({
                ...item,
                WorkingTag: 'U',
                FactUnit: FactUnit,
                Date: formatDate(formData),
                DeptSeq: dataSheetSearch?.[0]?.BeDeptSeq || dataSheetSearch?.[0]?.DeptSeq || 0,
                WorkReportSeq: dataSeq?.WorkReportSeq,
                WorkDate: dataSeq?.WorkDate,
                ProcSeq: dataSeq?.ProcSeq,
                InOutNo: gridData7?.InOutNo,
                InOutSeq: gridData7?.InOutSeq,
                BizUnit: BizUnit ?? gridData7?.BizUnit,
                BizUnitName: gridData7?.BizUnitName,

            }));

        if (resulA.length === 0 && resulU.length === 0) {
            togglePageInteraction(false);
            loadingBarRef.current?.complete();
            message.warning(t('870000041'));
            return true;
        }



        togglePageInteraction(true);
        loadingBarRef.current?.continuousStart();

        try {
            const apiCalls = [];
            if (resulA.length > 0) apiCalls.push(PostSLGLotNoMasterAUD(resulA, headerData));
            if (resulU.length > 0) apiCalls.push(PostSLGLotNoMasterAUD(resulU, headerData));

            const results = await Promise.all(apiCalls);

            const isSuccess = results.every(result => result?.success);
            if (isSuccess) {
                const mergedData = results.flatMap(result => result?.data?.logs2 || []);
                const mergedDataMater = results.flatMap(result => result?.data?.logs1 || []);
                setGridData7(mergedDataMater[0]);

                const mergedMap = new Map(
                    mergedData.map(item => [item.IDX_NO, item])
                );

                setGridData5(prevGrid => {
                    const updated = prevGrid.map(item => {
                        const matched = mergedMap.get(item.IdxNo);

                        if (matched) {
                            return {
                                ...item,
                                Status: '',
                                InOutSerl: matched.InOutSerl,
                                InOutSeq: matched.InOutSeq,
                                IDX_NO: matched.IDX_NO,
                                STDUnitName: matched.STDUnitName,
                                STDQty: matched.STDQty,
                            };
                        }

                        return item;
                    });

                    return updateIndexNo(updated);
                });
            } else {
                const errorItems = results.flatMap(result => result?.errors || []);
                setModal2Open(true);
                setErrorData(errorItems);
                message.error(t('870000040'));
            }

        } catch (error) {
            message.error(`Đã xảy ra lỗi: ${error.message || 'Unknown error'}`);
        } finally {
            loadingBarRef.current?.complete();
            togglePageInteraction(false);
        }

    }, [gridData5, canCreate, formData, FactUnit, dataSheetSearch, dataSheetSearch3, dataSheetSearch4, BizUnit, gridData7]);
    const handleSave5D = useCallback(async () => {
        if (!canCreate || checkPageA) return true;

        const headerData = [{
            BizUnit: BizUnit ?? gridData7?.BizUnit,
            BizUnitName: gridData7?.BizUnitName,
            InWHSeq: dataSheetSearch3[0]?.WHSeq ?? gridData7?.InWHSeq,
            InWHName: dataSheetSearch3[0]?.WHName ?? gridData7?.InWHName,
            EmpSeq: dataSheetSearch4[0]?.EmpSeq ?? gridData7?.EmpSeq,
            EmpName: dataSheetSearch4[0]?.EmpName ?? gridData7?.EmpName,
            DeptSeq: dataSheetSearch?.[0]?.BeDeptSeq || dataSheetSearch?.[0]?.DeptSeq || gridData7?.DeptSeq,
            InOutDate: gridData7?.InOutDate,
            WorkingTag: 'A',
            InOutNo: gridData7?.InOutNo ?? 0,
            InOutSeq: gridData7?.InOutSeq ?? 0,
        }]


        togglePageInteraction(true);
        loadingBarRef.current?.continuousStart();

        try {
            const apiCalls = [];
            if (headerData.length > 0) apiCalls.push(PostSLGInOutDailyD(headerData));

            const results = await Promise.all(apiCalls);

            const isSuccess = results.every(result => result?.success);

            if (isSuccess) {
                const emptyData = generateEmptyData(100, defaultCols)
                const updatedEmptyData = updateIndexNo(emptyData)
                setGridData5(updatedEmptyData)
                setNumRows5(emptyData.length)
                setGridData7(null)
                setDataSheetSearch([])
                setDataSheetSearch4([])
                setSearchText4('')
                setSearchText3('')
            } else {
                const errorItems = results.flatMap(result => result?.errors || []);
                setModal2Open(true);
                setErrorData(errorItems);
                message.error(t('870000040'));
            }

        } catch (error) {
            message.error(`Đã xảy ra lỗi: ${error.message || 'Unknown error'}`);
        } finally {
            loadingBarRef.current?.complete();
            togglePageInteraction(false);
        }

    }, [gridData5, canCreate, formData, FactUnit, dataSheetSearch, dataSheetSearch3, dataSheetSearch4, BizUnit, gridData7]);

    const handleSave6 = useCallback(async () => {
        if (!canCreate || checkPageA) return true;
        const resulA = filterValidRows(gridData6, 'A').map(item => ({
            ...item,
            WorkingTag: 'A',
            FactUnit: FactUnit,
            Date: formatDate(formData),
            DeptSeq: dataSheetSearch?.[0]?.BeDeptSeq || dataSheetSearch?.[0]?.DeptSeq || 0,
            WorkReportSeq: dataSeq?.WorkReportSeq,
            WorkDate: dataSeq?.WorkDate,
            ProcSeq: dataSeq?.ProcSeq,


        }));
        const resulU = filterValidRows(gridData6, 'U')
            .map(item => ({
                ...item,
                WorkingTag: 'U',
                FactUnit: FactUnit,
                Date: formatDate(formData),
                DeptSeq: dataSheetSearch?.[0]?.BeDeptSeq || dataSheetSearch?.[0]?.DeptSeq || 0,
                WorkReportSeq: dataSeq?.WorkReportSeq,
                WorkDate: dataSeq?.WorkDate,
                ProcSeq: dataSeq?.ProcSeq,

            }));

        if (resulA.length === 0 && resulU.length === 0) {
            togglePageInteraction(false);
            loadingBarRef.current?.complete();
            message.warning(t('870000041'));
            return true;
        }



        togglePageInteraction(true);
        loadingBarRef.current?.continuousStart();

        try {
            const apiCalls = [];
            if (resulA.length > 0) apiCalls.push(PostSPDSFCWorkReportNonWorkAUD(resulA));
            if (resulU.length > 0) apiCalls.push(PostSPDSFCWorkReportNonWorkAUD(resulU));

            const results = await Promise.all(apiCalls);

            const isSuccess = results.every(result => result?.success);

            if (isSuccess) {
                const mergedData = results.flatMap(result => result?.data?.logs1 || []);

                setGridData6(prevGrid => {
                    const updated = prevGrid.map(item => {
                        const found = mergedData.find(data => data.IDX_NO === item.IdxNo);
                        return found ? { ...item, ...found } : item;
                    });
                    return updateIndexNo(updated);
                });
            } else {
                const errorItems = results.flatMap(result => result?.errors || []);
                setModal2Open(true);
                setErrorData(errorItems);
                message.error(t('870000040'));
            }

        } catch (error) {
            message.error(`Đã xảy ra lỗi: ${error.message || 'Unknown error'}`);
        } finally {
            loadingBarRef.current?.complete();
            togglePageInteraction(false);
        }

    }, [gridData6, canCreate, formData, FactUnit, dataSheetSearch]);




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
    const resetTable4 = () => {
        setSelection4({
            columns: CompactSelection.empty(),
            rows: CompactSelection.empty(),
        })
    }
    const resetTable5 = () => {
        setSelection5({
            columns: CompactSelection.empty(),
            rows: CompactSelection.empty(),
        })
    }

    const resetTable6 = () => {
        setSelection6({
            columns: CompactSelection.empty(),
            rows: CompactSelection.empty(),
        })
    }
    const getSelectedRowsItem = () => {
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
    const getSelectedRowsItem2 = () => {
        const selectedRows = selection2.rows.items
        let rows = []
        selectedRows.forEach((range) => {
            const start = range[0]
            const end = range[1] - 1

            for (let i = start; i <= end; i++) {
                if (gridData2[i]) {
                    gridData2[i]['IdxNo'] = i + 1
                    rows.push(gridData2[i])
                }
            }
        })

        return rows
    }
    const getSelectedRowsItem4 = () => {
        const selectedRows = selection4.rows.items
        let rows = []
        selectedRows.forEach((range) => {
            const start = range[0]
            const end = range[1] - 1

            for (let i = start; i <= end; i++) {
                if (gridData4[i]) {
                    gridData4[i]['IdxNo'] = i + 1
                    rows.push(gridData4[i])
                }
            }
        })

        return rows
    }
    const getSelectedRowsItem5 = () => {
        const selectedRows = selection5.rows.items
        let rows = []
        selectedRows.forEach((range) => {
            const start = range[0]
            const end = range[1] - 1

            for (let i = start; i <= end; i++) {
                if (gridData5[i]) {
                    gridData5[i]['IdxNo'] = i + 1
                    rows.push(gridData5[i])
                }
            }
        })

        return rows
    }
    const getSelectedRowsItem6 = () => {
        const selectedRows = selection6.rows.items
        let rows = []
        selectedRows.forEach((range) => {
            const start = range[0]
            const end = range[1] - 1

            for (let i = start; i <= end; i++) {
                if (gridData6[i]) {
                    gridData6[i]['IdxNo'] = i + 1
                    rows.push(gridData6[i])
                }
            }
        })

        return rows
    }
    const handleDeleteDataSheet = useCallback(
        (e) => {
            togglePageInteraction(true)
            if (canDelete === false) {
                message.warning(t('870000018'))
                togglePageInteraction(false)
                if (loadingBarRef.current) {
                    loadingBarRef.current.complete();
                }
                return
            }
            if (loadingBarRef.current) {
                loadingBarRef.current.continuousStart();
            }

            const selectedRows = getSelectedRowsItem()
            const idsWithStatusD = selectedRows
                .filter(row => !row.Status || row.Status === 'U' || row.Status === 'D')
                .map((row, index) => ({
                    ...row,
                    Status: 'D',
                    WorkingTag: 'D',
                    FactUnit: FactUnit,
                    Date: formatDate(formData),
                    DeptSeq: dataSheetSearch?.[0]?.BeDeptSeq || dataSheetSearch?.[0]?.DeptSeq || 0,
                    WorkReportSeq: dataSeq?.WorkReportSeq,
                    WorkDate: dataSeq?.WorkDate,
                    ProcSeq: dataSeq?.ProcSeq,
                }));

            const rowsWithStatusA = selectedRows.filter((row) => row.Status === 'A')
            if (idsWithStatusD.length === 0 && rowsWithStatusA.length === 0) {
                togglePageInteraction(false)
                if (loadingBarRef.current) {
                    loadingBarRef.current.complete();
                }
                return
            }

            if (idsWithStatusD.length > 0) {
                PostSPDSFCWorkReportAUD(idsWithStatusD)
                    .then((response) => {
                        message.destroy()
                        if (response.success) {

                            const idsWithStatusDList = idsWithStatusD.map(
                                (row) => row.IdxNo,
                            )
                            const remainingRows = gridData.filter(
                                (row) => !idsWithStatusDList.includes(row.IdxNo),
                            )
                            const updatedEmptyData = updateIndexNo(remainingRows)
                            setGridData(updatedEmptyData)
                            setNumRows(remainingRows.length)
                            resetTable()

                        } else {
                            setModal2Open(true);
                            setErrorData(response.errors)
                            message.error(response.data.message || t('870000022'))
                        }
                    })
                    .catch((error) => {
                        message.destroy()
                        message.error(t('870000023'))
                    })
                    .finally(() => {
                        togglePageInteraction(false)
                        if (loadingBarRef.current) {
                            loadingBarRef.current.complete();
                        }
                    })
            }

            if (rowsWithStatusA.length > 0) {
                const idsWithStatusA = rowsWithStatusA.map((row) => row.Id)
                const remainingRows = gridData.filter(
                    (row) => !idsWithStatusA.includes(row.Id),
                )
                togglePageInteraction(false)
                if (loadingBarRef.current) {
                    loadingBarRef.current.complete();
                }
                const updatedRemainingRows = updateIndexNo(remainingRows);
                setGridData(updatedRemainingRows)
                setNumRows(remainingRows.length)
                resetTable()
            }
        },
        [
            canDelete,
            gridData,
            selection,
            formData, FactUnit, dataSheetSearch
        ],
    )
    const handleDeleteDataSheet2 = useCallback(
        (e) => {
            if (!canCreate || checkPageA) return true;
            togglePageInteraction(true)
            if (canDelete === false) {
                message.warning(t('870000018'))
                togglePageInteraction(false)
                if (loadingBarRef.current) {
                    loadingBarRef.current.complete();
                }
                return
            }
            if (loadingBarRef.current) {
                loadingBarRef.current.continuousStart();
            }

            const selectedRows = getSelectedRowsItem2()
            const idsWithStatusD = selectedRows
                .filter(row => !row.Status || row.Status === 'U' || row.Status === 'D')
                .map((row, index) => ({
                    ...row,
                    Status: 'D',
                    WorkingTag: 'D',
                    FactUnit: FactUnit,
                    Date: formatDate(formData),
                    DeptSeq: dataSheetSearch?.[0]?.BeDeptSeq || dataSheetSearch?.[0]?.DeptSeq || 0,
                    WorkReportSeq: dataSeq?.WorkReportSeq,
                    WorkDate: dataSeq?.WorkDate,
                    ProcSeq: dataSeq?.ProcSeq,
                }));

            const rowsWithStatusA = selectedRows.filter((row) => row.Status === 'A')
            if (idsWithStatusD.length === 0 && rowsWithStatusA.length === 0) {
                togglePageInteraction(false)
                if (loadingBarRef.current) {
                    loadingBarRef.current.complete();
                }
                return
            }

            if (idsWithStatusD.length > 0) {
                PostSPDSFCWorkReportMatAUD(idsWithStatusD)
                    .then((response) => {
                        message.destroy()
                        if (response.success) {

                            const idsWithStatusDList = idsWithStatusD.map(
                                (row) => row.IdxNo,
                            )
                            const remainingRows = gridData2.filter(
                                (row) => !idsWithStatusDList.includes(row.IdxNo),
                            )
                            const updatedEmptyData = updateIndexNo(remainingRows)
                            setGridData2(updatedEmptyData)
                            setNumRows2(remainingRows.length)
                            resetTable2()

                        } else {
                            setModal2Open(true);
                            setErrorData(response.errors)
                            message.error(response.data.message || t('870000022'))
                        }
                    })
                    .catch((error) => {
                        message.destroy()
                        message.error(t('870000023'))
                    })
                    .finally(() => {
                        togglePageInteraction(false)
                        if (loadingBarRef.current) {
                            loadingBarRef.current.complete();
                        }
                    })
            }

            if (rowsWithStatusA.length > 0) {
                const idsWithStatusA = rowsWithStatusA.map((row) => row.Id)
                const remainingRows = gridData2.filter(
                    (row) => !idsWithStatusA.includes(row.Id),
                )
                togglePageInteraction(false)
                if (loadingBarRef.current) {
                    loadingBarRef.current.complete();
                }
                const updatedRemainingRows = updateIndexNo(remainingRows);
                setGridData2(updatedRemainingRows)
                setNumRows2(remainingRows.length)
                resetTable2()
            }
        },
        [
            canDelete,
            gridData2,
            selection2,
            formData, FactUnit, dataSheetSearch
        ],
    )
    const handleDeleteDataSheet4 = useCallback(
        (e) => {
            togglePageInteraction(true)
            if (!canCreate || checkPageA) return true;
            if (canDelete === false) {
                message.warning(t('870000018'))
                togglePageInteraction(false)
                if (loadingBarRef.current) {
                    loadingBarRef.current.complete();
                }
                return
            }
            if (loadingBarRef.current) {
                loadingBarRef.current.continuousStart();
            }

            const selectedRows = getSelectedRowsItem4()
            const idsWithStatusD = selectedRows
                .filter(row => !row.Status || row.Status === 'U' || row.Status === 'D')
                .map((row, index) => ({
                    ...row,
                    Status: 'D',
                    WorkingTag: 'D',
                    FactUnit: FactUnit,
                    Date: formatDate(formData),
                    DeptSeq: dataSheetSearch?.[0]?.BeDeptSeq || dataSheetSearch?.[0]?.DeptSeq || 0,
                    WorkReportSeq: dataSeq?.WorkReportSeq,
                    WorkDate: dataSeq?.WorkDate,
                    ProcSeq: dataSeq?.ProcSeq,
                }));

            const rowsWithStatusA = selectedRows.filter((row) => row.Status === 'A')
            if (idsWithStatusD.length === 0 && rowsWithStatusA.length === 0) {
                togglePageInteraction(false)
                if (loadingBarRef.current) {
                    loadingBarRef.current.complete();
                }
                return
            }

            if (idsWithStatusD.length > 0) {
                PostSPDSFCWorkReportWorkEmpAUD(idsWithStatusD)
                    .then((response) => {
                        message.destroy()
                        if (response.success) {
                            const idsWithStatusDList = idsWithStatusD.map((row) => String(row.Serl));

                            const remainingRows = gridData4.filter((row) => {
                                return !row.Serl || !idsWithStatusDList.includes(String(row.Serl));
                            });

                            setGridData4(remainingRows)
                            setNumRows4(remainingRows.length)

                        } else {
                            setModal2Open(true);
                            setErrorData(response.errors)
                            message.error(response.data.message || t('870000022'))
                        }
                    })
                    .catch((error) => {
                        message.destroy()
                        message.error(t('870000023'))
                    })
                    .finally(() => {
                        togglePageInteraction(false)
                        if (loadingBarRef.current) {
                            loadingBarRef.current.complete();
                        }
                    })
            }

            if (rowsWithStatusA.length > 0) {
                const idsWithStatusA = rowsWithStatusA.map((row) => row.Id)
                const remainingRows = gridData4.filter(
                    (row) => !idsWithStatusA.includes(row.Id),
                )
                togglePageInteraction(false)
                if (loadingBarRef.current) {
                    loadingBarRef.current.complete();
                }
                const updatedRemainingRows = updateIndexNo(remainingRows);
                setGridData4(updatedRemainingRows)
                setNumRows4(remainingRows.length)
                resetTable4()
            }
        },
        [
            canDelete,
            gridData4,
            selection4,
            formData, FactUnit, dataSheetSearch
        ],
    )
    const handleDeleteDataSheet5Item = useCallback(
        (e) => {
            togglePageInteraction(true)
            if (!canCreate || checkPageA) return true;
            if (canDelete === false) {
                message.warning(t('870000018'))
                togglePageInteraction(false)
                if (loadingBarRef.current) {
                    loadingBarRef.current.complete();
                }
                return
            }
            if (loadingBarRef.current) {
                loadingBarRef.current.continuousStart();
            }

            const selectedRows = getSelectedRowsItem5()
            const idsWithStatusD = selectedRows
                .filter(row => !row.Status || row.Status === 'U' || row.Status === 'D')
                .map((row, index) => ({
                    ...row,
                    Status: 'D',
                    WorkingTag: 'D',
                    FactUnit: FactUnit,
                    Date: formatDate(formData),
                    EmpSeq: dataSheetSearch4[0]?.EmpSeq ?? gridData7?.EmpSeq,
                    EmpName: dataSheetSearch4[0]?.EmpName ?? gridData7?.EmpName,
                    InWHSeq: dataSheetSearch3[0]?.WHSeq ?? gridData7?.InWHSeq,
                    InWHName: dataSheetSearch3[0]?.WHName ?? gridData7?.InWHName,
                    DeptSeq: dataSheetSearch?.[0]?.BeDeptSeq || dataSheetSearch?.[0]?.DeptSeq || 0,
                    WorkReportSeq: dataSeq?.WorkReportSeq,
                    WorkDate: dataSeq?.WorkDate,
                    ProcSeq: dataSeq?.ProcSeq,
                    InOutNo: gridData7?.InOutNo,
                    InOutSeq: gridData7?.InOutSeq,
                    BizUnit: BizUnit ?? gridData7?.BizUnit,
                    BizUnitName: gridData7?.BizUnitName,
                }));

            const rowsWithStatusA = selectedRows.filter((row) => row.Status === 'A')
            if (idsWithStatusD.length === 0 && rowsWithStatusA.length === 0) {
                togglePageInteraction(false)
                if (loadingBarRef.current) {
                    loadingBarRef.current.complete();
                }
                return
            }
            if (idsWithStatusD.length > 0) {
                PostSLGInOutDailyDItem(idsWithStatusD)
                    .then((response) => {
                        message.destroy()
                        if (response.success) {

                            const idsWithStatusDList = idsWithStatusD.map(
                                (row) => row.IdxNo,
                            )
                            const remainingRows = gridData5.filter(
                                (row) => !idsWithStatusDList.includes(row.IdxNo),
                            )
                            const updatedEmptyData = updateIndexNo(remainingRows)
                            setGridData5(updatedEmptyData)
                            setNumRows5(remainingRows.length)
                            resetTable5()

                        } else {
                            setModal2Open(true);
                            setErrorData(response.errors)
                            message.error(response.data.message || t('870000022'))
                        }
                    })
                    .catch((error) => {
                        message.destroy()
                        message.error(t('870000023'))
                    })
                    .finally(() => {
                        togglePageInteraction(false)
                        if (loadingBarRef.current) {
                            loadingBarRef.current.complete();
                        }
                    })
            }

            if (rowsWithStatusA.length > 0) {
                const idsWithStatusA = rowsWithStatusA.map((row) => row.Id)
                const remainingRows = gridData4.filter(
                    (row) => !idsWithStatusA.includes(row.Id),
                )
                togglePageInteraction(false)
                if (loadingBarRef.current) {
                    loadingBarRef.current.complete();
                }
                const updatedRemainingRows = updateIndexNo(remainingRows);
                setGridData4(updatedRemainingRows)
                setNumRows4(remainingRows.length)
                resetTable4()
            }
        },
        [
            canDelete,
            gridData5,
            selection5,
            formData, FactUnit, dataSheetSearch,
            dataSheetSearch4,
            gridData7,
            dataSeq
        ],
    )
    const handleDeleteDataSheet6 = useCallback(
        (e) => {
            togglePageInteraction(true)
            if (!canCreate || checkPageA) return true;
            if (canDelete === false) {
                message.warning(t('870000018'))
                togglePageInteraction(false)
                if (loadingBarRef.current) {
                    loadingBarRef.current.complete();
                }
                return
            }
            if (loadingBarRef.current) {
                loadingBarRef.current.continuousStart();
            }

            const selectedRows = getSelectedRowsItem6()
            const idsWithStatusD = selectedRows
                .filter(row => !row.Status || row.Status === 'U' || row.Status === 'D')
                .map((row, index) => ({
                    ...row,
                    Status: 'D',
                    WorkingTag: 'D',
                    FactUnit: FactUnit,
                    Date: formatDate(formData),
                    DeptSeq: dataSheetSearch?.[0]?.BeDeptSeq || dataSheetSearch?.[0]?.DeptSeq || 0,
                    WorkReportSeq: dataSeq?.WorkReportSeq,
                    WorkDate: dataSeq?.WorkDate,
                    ProcSeq: dataSeq?.ProcSeq,
                }));

            const rowsWithStatusA = selectedRows.filter((row) => row.Status === 'A')
            if (idsWithStatusD.length === 0 && rowsWithStatusA.length === 0) {
                togglePageInteraction(false)
                if (loadingBarRef.current) {
                    loadingBarRef.current.complete();
                }
                return
            }

            if (idsWithStatusD.length > 0) {
                PostSPDSFCWorkReportNonWorkAUD(idsWithStatusD)
                    .then((response) => {
                        message.destroy()
                        if (response.success) {
                            const idsWithStatusDList = idsWithStatusD.map((row) => String(row.Serl));

                            const remainingRows = gridData6.filter((row) => {
                                return !row.Serl || !idsWithStatusDList.includes(String(row.Serl));
                            });

                            setGridData6(remainingRows)
                            setNumRows6(remainingRows.length)
                            resetTable6()
                        } else {
                            setModal2Open(true);
                            setErrorData(response.errors)
                            message.error(response.data.message || t('870000022'))
                        }
                    })
                    .catch((error) => {
                        message.destroy()
                        message.error(t('870000023'))
                    })
                    .finally(() => {
                        togglePageInteraction(false)
                        if (loadingBarRef.current) {
                            loadingBarRef.current.complete();
                        }
                    })
            }

            if (rowsWithStatusA.length > 0) {
                const idsWithStatusA = rowsWithStatusA.map((row) => row.Id)
                const remainingRows = gridData4.filter(
                    (row) => !idsWithStatusA.includes(row.Id),
                )
                togglePageInteraction(false)
                if (loadingBarRef.current) {
                    loadingBarRef.current.complete();
                }
                const updatedRemainingRows = updateIndexNo(remainingRows);
                setGridData6(updatedRemainingRows)
                setNumRows6(remainingRows.length)
                resetTable6()
            }
        },
        [
            canDelete,
            gridData6,
            selection6,
            formData, FactUnit, dataSheetSearch
        ],
    )

    const getSelectedRowsData = () => {
        const selectedRows = selection.rows.items;

        return selectedRows.flatMap(([start, end]) =>
            Array.from({ length: end - start }, (_, i) => gridData[start + i]).filter((row) => row !== undefined)
        );
    };


    useEffect(() => {
        const data = getSelectedRowsData();

        if (!data || data.length === 0) return;

        const workReportSeq = data[0]?.WorkReportSeq;
        if (workReportSeq == null || workReportSeq === '') return;

        const searchParams = {
            WorkReportSeq: data[0]?.WorkReportSeq,
            WorkCenterSeq: data[0]?.WorkCenterSeq,
            WorkDate: data[0]?.WorkDate,
            FactUnit: data[0]?.FactUnit,
            FactUnitName: data[0]?.FactUnitName,
            DeptSeq: data[0]?.DeptSeq,
            DeptName: data[0]?.DeptName,
            StdUnitProdQty: data[0]?.StdUnitProdQty,
            ProdQty: data[0]?.ProdQty,
            WorkOrderNo: data[0]?.WorkOrderNo,
            AssyItemNo: data[0]?.AssyItemNo,
            ProdPlanNo: data[0]?.ProdPlanNo,
            ProcName: data[0]?.ProcName,
            AssyItemName: data[0]?.AssyItemName,
            InOutSeq: data[0]?.SubEtcInSeq,
            WorkCenterName: data[0]?.WorkCenterName,
            ProcSeq: data[0]?.ProcSeq,
        };
        setCheckPageA(false)
        setDataSeq(data[0]);
        fetchGenericData({
            controllerKey: 'fetchData',
            postFunction: PostSPDSFCWorkReportQ2,
            setGridData: setGridDataLogs,
            setNumRows: setNumRowsLogs,
            searchParams,
            afterFetch: async (mergedData) => {
                const emptyData = generateEmptyData(100, defaultCols)
                const updatedEmptyData = updateIndexNo(emptyData)
                setGridData5(updatedEmptyData)
                setNumRows5(emptyData.length)
                setGridData7(null)

                setSearchText4('')
                setSearchText3('')
                const firstItem = mergedData[0];

                if (firstItem?.SubEtcInSeq) {
                    const searchParamsWithSubEtchSeq = {
                        InOutSeq: firstItem.SubEtcInSeq,
                    };

                    await fetchGenericData({
                        controllerKey: 'fetchSLGInOutDailyItemQ',
                        postFunction: PostSLGInOutDailyItemQ,
                        setGridData: setGridData5,
                        setNumRows: setNumRows5,
                        searchParams: searchParamsWithSubEtchSeq,
                    });

                    await fetchSLGInOutDailyQ(searchParamsWithSubEtchSeq);
                }
            },
        });

        fetchGenericData({
            controllerKey: 'fetchSPDSFCWorkReportMatQ',
            postFunction: PostSPDSFCWorkReportMatQ,
            setGridData: setGridData2,
            setNumRows: setNumRows2,
            searchParams,
        });

        fetchGenericData({
            controllerKey: 'fetchSPDSFCWorkReportWorkEmpQ',
            postFunction: PostSPDSFCWorkReportWorkEmpQ,
            setGridData: setGridData4,
            setNumRows: setNumRows4,
            searchParams,
            afterFetch: async (mergedData) => {
                const helpDataMap = new Map(helpData13.map(item => [item.Value, item.MinorName]));


            },

        });

        fetchGenericData({
            controllerKey: 'fetchSPDSFCWorkReportNonWorkQ',
            postFunction: PostSPDSFCWorkReportNonWorkQ,
            setGridData: setGridData6,
            setNumRows: setNumRows6,
            searchParams,
        });

    }, [selection.rows.items]);

    const handleSearch2 = () => {
        if (!dataSeq || Object.keys(dataSeq).length === 0) {
            return;
        }
        if (checkPageA) return true;
        if (controllers.current.PostSPDSFCWorkReportMatQCheck) {
            controllers.current.PostSPDSFCWorkReportMatQCheck.abort();
        }

        const controller = new AbortController();
        const signal = controller.signal;
        controllers.current.PostSPDSFCWorkReportMatQCheck = controller;

        togglePageInteraction(true);
        loadingBarRef.current?.continuousStart();
        increaseFetchCount();

        const searchParams = {
            WorkOrderSeq: dataSeq?.WorkOrderSeq,
            ProcSeq: dataSeq?.ProcSeq,
            WorkOrderSerl: dataSeq?.WorkOrderSerl,
            WorkReportSeq: dataSeq?.WorkReportSeq,
        };

        PostSPDSFCWorkReportMatQCheck(searchParams, signal)
            .then((response) => {
                if (response.success) {


                    const newData = (response.data || []).map(item => ({
                        ...item,
                        Status: 'A',
                    }));

                    if (response.data.length === 0) {
                        message.warning('Không có dữ liệu truy vấn vật liệu tiêu thụ!');
                        return;
                    }
                    setGridData2(prevGridData => {
                        let updatedGridData = [...prevGridData];

                        newData.forEach(newItem => {
                            const lastFilledIndex = [...updatedGridData]
                                .reverse()
                                .findIndex(row => row.MatItemSeq && row.MatItemSeq !== "");

                            const insertIndex = lastFilledIndex !== -1
                                ? updatedGridData.length - lastFilledIndex
                                : 0;

                            updatedGridData.splice(insertIndex, 0, newItem);
                        });

                        updatedGridData = updatedGridData.map((row, idx) => ({
                            ...row,
                            IdxNo: idx + 1,

                        }));

                        setNumRows2(updatedGridData.length);
                        return updatedGridData;
                    });
                } else {
                    message.warning('Không có dữ liệu truy vấn vật liệu tiêu thụ!')
                }
            })
            .catch((err) => {
                if (err.name !== 'AbortError') {
                    console.error('Search error:', err);
                }
            })
            .finally(() => {
                decreaseFetchCount();
                togglePageInteraction(false);
                loadingBarRef.current?.complete();
                controllers.current.PostSPDSFCWorkReportMatQCheck = null;
            });
    };



    const handleSearch = () => {
        if (!dataSeq || dataSeq.length === 0) {
            return;
        }

        const searchParams = {
            WorkReportSeq: dataSeq?.WorkReportSeq,
            WorkCenterSeq: dataSeq?.WorkCenterSeq,
            WorkDate: dataSeq?.WorkDate,
            FactUnit: dataSeq?.FactUnit,
            FactUnitName: dataSeq?.FactUnitName,
            DeptSeq: dataSeq?.DeptSeq,
            DeptName: dataSeq?.DeptName,
            StdUnitProdQty: dataSeq?.StdUnitProdQty,
            ProdQty: dataSeq?.ProdQty,
            ProdPlanNo: dataSeq?.ProdPlanNo,
            ProcName: dataSeq?.ProcName,
            InOutSeq: dataSeq?.SubEtcInSeq,
            WorkCenterName: dataSeq?.WorkCenterName,
            ProcSeq: dataSeq?.ProcSeq,
        };
        fetchGenericData({
            controllerKey: 'fetchData',
            postFunction: PostSPDSFCWorkReportQ2,
            setGridDataLogs,
            setNumRowsLogs,
            searchParams,
            afterFetch: async (mergedData) => {
                const firstItem = mergedData[0];
                if (firstItem?.SubEtcInSeq) {
                    const searchParamsWithSubEtchSeq = {
                        InOutSeq: firstItem.SubEtcInSeq,
                    };
                    await fetchGenericData({
                        controllerKey: 'fetchSLGInOutDailyItemQ',
                        postFunction: PostSLGInOutDailyItemQ,
                        setGridData: setGridData5,
                        setNumRows: setNumRows5,
                        searchParams: searchParamsWithSubEtchSeq,
                    });

                    await fetchSLGInOutDailyQ(searchParamsWithSubEtchSeq);
                }
            },
        });

        fetchGenericData({
            controllerKey: 'fetchSPDSFCWorkReportMatQ',
            postFunction: PostSPDSFCWorkReportMatQ,
            setGridData: setGridData2,
            setNumRows: setNumRows2,
            searchParams,
        });

        fetchGenericData({
            controllerKey: 'fetchSPDSFCWorkReportWorkEmpQ',
            postFunction: PostSPDSFCWorkReportWorkEmpQ,
            setGridData: setGridData4,
            setNumRows: setNumRows4,
            searchParams,
            afterFetch: async (mergedData) => {
                const helpDataMap = new Map(helpData13.map(item => [item.Value, item.MinorName]));


            },

        });

        fetchGenericData({
            controllerKey: 'fetchSPDSFCWorkReportNonWorkQ',
            postFunction: PostSPDSFCWorkReportNonWorkQ,
            setGridData: setGridData6,
            setNumRows: setNumRows6,
            searchParams,
        });
    }
    return (
        <>
            <Helmet>
                <title>ITM - {t('800000156')}</title>
            </Helmet>
            <TopLoadingBar color="blue" height={2} ref={loadingBarRef} />
            <div className="bg-slate-50 h-[calc(100vh-40px)] overflow-hidden">
                <div className="flex flex-col h-full">
                    <div className="col-start-1 col-end-5 row-start-1 w-full">
                        <div className="flex p-2 items-end justify-end">
                            <PdsfcWorkReportAction
                                current={current}
                                handleSave={handleSave}
                                handleDeleteDataSheet={handleDeleteDataSheet}
                                handleSearch={handleSearch}
                            />
                        </div>
                        <details
                            className="group p-1 [&_summary::-webkit-details-marker]:hidden border-t  bg-white"
                            open
                        >
                            <summary className="flex cursor-pointer items-center  justify-end  text-gray-900">

                                <span className="relative size-5 shrink-0">
                                    <ArrowIcon />
                                </span>
                            </summary>
                            <div className="flex p-2 gap-4">
                                <PdsfcWorkReportQuery
                                    helpData01={helpData01}
                                    setDataSearch={setDataSearch}
                                    setDataSheetSearch={setDataSheetSearch}
                                    setItemText={setItemText}
                                    searchText={searchText}
                                    setSearchText={setSearchText}
                                    helpData04={helpData04}
                                    setFormData={setFormData}
                                    formData={formData}
                                    setFactUnit={setFactUnit}
                                    setSearchText2={setSearchText2}
                                    searchText2={searchText2}
                                    setItemText2={setItemText2}
                                    setDataSearch2={setDataSearch2}
                                    setDataSheetSearch2={setDataSheetSearch2}
                                    helpData07={helpData07}
                                    dataSeq={dataSeq}
                                    FactUnit={FactUnit}
                                    setGridData={setGridData}
                                />

                            </div>
                        </details>
                    </div>
                    <div className="col-start-1 col-end-5 row-start-2 w-full h-full border-t overflow-hidden">
                        <Splitter className="w-full h-full" layout="vertical">
                            <SplitterPanel size={33} minSize={10}>
                                <div className="h-full overflow-auto">
                                    <TablepdsfcWorkReport
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
                                    />
                                </div>
                            </SplitterPanel>



                            <SplitterPanel size={7} minSize={10}>
                                <div className="h-full p-2 border-t border-b overflow-auto">
                                    <PdsfcWorkReportSeqQuery dataSeq={dataSeq} checkPageA={checkPageA} />

                                </div>
                            </SplitterPanel>
                            <SplitterPanel size={55} minSize={20}>
                                <div className="h-full flex flex-col">
                                    <Menu
                                        mode="horizontal"
                                        selectedKeys={[current]}
                                        onClick={(e) => {
                                            if (!checkPageA) {
                                                setCurrent(e.key);
                                            } else {
                                                message.warning(t('870000042'));
                                            }
                                        }}

                                        className="border-b"
                                        items={[
                                            {
                                                key: '1',
                                                label: (
                                                    <span className="flex items-center gap-1">
                                                        <Package size={14} />
                                                        {t('1968')}
                                                    </span>
                                                ),
                                            },
                                            {
                                                key: '2',
                                                label: (
                                                    <span className="flex items-center gap-1">
                                                        <MonitorSmartphone size={14} />
                                                        {t('1573')}
                                                    </span>
                                                ),
                                            },
                                            {
                                                key: '3',
                                                label: (
                                                    <span className="flex items-center gap-1">
                                                        <Plane size={14} />
                                                        {t('512')}
                                                    </span>
                                                ),
                                            },
                                            {
                                                key: '4',
                                                label: (
                                                    <span className="flex items-center gap-1">
                                                        <Tag size={14} />
                                                        {t('14289')}
                                                    </span>
                                                ),
                                            },
                                            {
                                                key: '5',
                                                label: (
                                                    <span className="flex items-center gap-1">
                                                        <PowerOff size={14} />
                                                        {t('51676')}
                                                    </span>
                                                ),
                                            },
                                        ]}
                                    />
                                    <div className="flex-1 overflow-auto">
                                        {current === '1' && (
                                            <>
                                                <Tablepdsf1968
                                                    setSelection={setSelection2}
                                                    showSearch={showSearch2}
                                                    setShowSearch={setShowSearch2}
                                                    selection={selection2}
                                                    canEdit={canEdit}
                                                    cols={cols2}
                                                    setCols={setCols2}
                                                    setGridData={setGridData2}
                                                    gridData={gridData2}
                                                    defaultCols={defaultCols2}
                                                    setNumRows={setNumRows2}
                                                    numRows={numRows2}
                                                    setHelpData10={setHelpData10}
                                                    helpData10={helpData10}
                                                    handleSave2={handleSave2}
                                                    handleDeleteDataSheet2={handleDeleteDataSheet2}
                                                    handleSearch2={handleSearch2}

                                                />
                                            </>
                                        )}
                                        {current === '2' && (<Tablepdsf1573
                                            setSelection={setSelection3}
                                            showSearch={showSearch3}
                                            setShowSearch={setShowSearch3}
                                            selection={selection3}
                                            canEdit={canEdit}
                                            cols={cols3}
                                            setCols={setCols3}
                                            setGridData={setGridData3}
                                            gridData={gridData3}
                                            defaultCols={defaultCols3}
                                            setNumRows={setNumRows3}
                                            numRows={numRows3}
                                        />)}
                                        {current === '3' && (<Tablepdsf512
                                            setSelection={setSelection4}
                                            showSearch={showSearch4}
                                            setShowSearch={setShowSearch4}
                                            selection={selection4}
                                            canEdit={canEdit}
                                            cols={cols4}
                                            setCols={setCols4}
                                            setGridData={setGridData4}
                                            gridData={gridData4}
                                            defaultCols={defaultCols4}
                                            setNumRows={setNumRows4}
                                            handleSave4={handleSave4}
                                            numRows={numRows4}
                                            setHelpData08={setHelpData08}
                                            helpData08={helpData08}
                                            handleDeleteDataSheet4={handleDeleteDataSheet4}
                                            helpData13={helpData13}
                                            setHelpData13={setHelpData13}

                                        />)}
                                        {current === '4' && (<Tablepdsf14289
                                            setSelection={setSelection5}
                                            showSearch={showSearch5}
                                            setShowSearch={setShowSearch5}
                                            selection={selection5}
                                            canEdit={canEdit}
                                            cols={cols5}
                                            setCols={setCols5}
                                            setGridData={setGridData5}
                                            gridData={gridData5}
                                            defaultCols={defaultCols5}
                                            setNumRows={setNumRows5}
                                            numRows={numRows5}
                                            helpData04={helpData04}
                                            gridData7={gridData7}
                                            handleSave5={handleSave5}
                                            setBizUnit={setBizUnit}
                                            BizUnit={BizUnit}


                                            searchText3={searchText3}
                                            dataWarehouse={dataWarehouse}
                                            setDataWarehouse={setDataWarehouse}
                                            setSearchText3={setSearchText3}
                                            setItemText3={setItemText3}
                                            setDataSearch3={setDataSearch3}
                                            setDataSheetSearch3={setDataSheetSearch3}
                                            controllers={controllers}

                                            helpData08={helpData08}
                                            setHelpData04={setHelpData04}
                                            setSearchText4={setSearchText4}
                                            setSearchText5={setSearchText5}
                                            setItemText4={setItemText4}
                                            setItemText5={setItemText5}
                                            setDataSearch4={setDataSearch4}
                                            setDataSearch5={setDataSearch5}
                                            setDataSheetSearch4={setDataSheetSearch4}
                                            searchText4={searchText4}
                                            setHelpData10={setHelpData10}
                                            helpData10={helpData10}

                                            helpData11={helpData11}
                                            setHelpData11={setHelpData11}
                                            handleSave5D={handleSave5D}
                                            handleDeleteDataSheet5Item={handleDeleteDataSheet5Item}
                                            dataSearch4={dataSearch4}


                                        />)}
                                        {current === '5' && (<Tablepdsf51676
                                            setSelection={setSelection6}
                                            showSearch={showSearch6}
                                            setShowSearch={setShowSearch6}
                                            selection={selection6}
                                            canEdit={canEdit}
                                            cols={cols6}
                                            setCols={setCols6}
                                            setGridData={setGridData6}
                                            gridData={gridData6}
                                            defaultCols={defaultCols6}
                                            setNumRows={setNumRows6}
                                            numRows={numRows6}
                                            handleSave6={handleSave6}
                                            handleDeleteDataSheet6={handleDeleteDataSheet6}
                                            setHelpData14={setHelpData14}
                                            helpData14={helpData14}
                                        />)}
                                    </div>
                                </div>
                            </SplitterPanel>



                        </Splitter>
                    </div>


                </div>
            </div>
            <ErrorListModal isModalVisible={modal2Open}
                setIsModalVisible={setModal2Open}
                dataError={errorData} />
        </>
    )
}