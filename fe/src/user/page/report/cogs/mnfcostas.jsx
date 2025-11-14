import { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet'
import { Input, Space, Table, Typography, message, Tabs, notification } from 'antd'
const { Title, Text } = Typography
import { debounce } from 'lodash'
import { FilterOutlined } from '@ant-design/icons'
import { CompactSelection, GridColumnIcon } from '@glideapps/glide-data-grid'
import { loadFromLocalStorageSheet } from '../../../../localStorage/sheet/sheet'
import { onRowAppended } from '../../../components/sheet/js/onRowAppended'
import { generateEmptyData } from '../../../components/sheet/js/generateEmptyData'
import TopLoadingBar from 'react-top-loading-bar';
import { togglePageInteraction } from '../../../../utils/togglePageInteraction'
import { updateIndexNo } from '../../../components/sheet/js/updateIndexNo'
import dayjs from 'dayjs'
import { HandleError } from '../../default/handleError'
import { SESMCFMnfcostasQ } from '../../../../features/report/cogs/SESMCFMnfcostasQ'
import { GetCodeHelpComboVer2 } from '../../../../features/codeHelp/getCodeHelpComboVer2'
import { GetCodeHelpVer2 } from '../../../../features/codeHelp/getCodeHelpVer2'
import MnfcostasAction from '../../../components/actions/report/cogs/mnfcostasAction'
import MnfcostasQuery from '../../../components/query/report/cogs/mnfcostasQuery'
import MnfcostasTable from '../../../components/table/report/cogs/MnfcostasTable'
export default function MnfcostasReport({ permissions, isMobile, canCreate, canEdit, canDelete, controllers,
    cancelAllRequests }) {
    const userFrom = JSON.parse(localStorage.getItem('userInfo'))
    const loadingBarRef = useRef(null);
    const langCode = localStorage.getItem('language') || '6';
    const activeFetchCountRef = useRef(0);
    const { t } = useTranslation()
    const defaultCols = useMemo(() => [
        {
            title: '',
            id: 'Status',
            kind: 'Text',
            readonly: true,
            width: 50,
            hasMenu: true,
            visible: true,
            themeOverride: {
                textDark: "#225588",
                baseFontStyle: "600 13px",
            },
            icon: GridColumnIcon.HeaderLookup,
        },
        {
            title: t('Hạng mục phân tích giá trị RC'),
            id: 'BgtName',
            kind: 'Text',
            readonly: false,
            width: 450,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },

        {
            title: t('POC'),
            id: 'POCPreAmt',
            kind: 'Text',
            readonly: false,
            width: 110,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
            group: "이전 -  Kỳ trước"
        },
        {
            title: t('PMP'),
            id: 'PMPPreAmt',
            kind: 'Text',
            readonly: false,
            width: 110,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
            group: "이전 -  Kỳ trước"
        },
        {
            title: t('SENSOR'),
            id: 'SENSORPreAmt',
            kind: 'Text',
            readonly: false,
            width: 110,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
            group: "이전 -  Kỳ trước"
        },
        {
            title: t('합계 - SEMI'),
            id: 'SEMIPreAmt',
            kind: 'Text',
            readonly: false,
            width: 110,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
            group: "이전 -  Kỳ trước"
        },
        {
            title: t('PCM'),
            id: 'PCMPreAmt',
            kind: 'Text',
            readonly: false,
            width: 110,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
            group: "이전 -  Kỳ trước"
        },
        {
            title: t('SAMSUNGPACK'),
            id: 'SAMSUNGPreAmt',
            kind: 'Text',
            readonly: false,
            width: 110,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
            group: "이전 -  Kỳ trước"
        },
        {
            title: t('LGPACK'),
            id: 'LGPreAmt',
            kind: 'Text',
            readonly: false,
            width: 110,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
            group: "이전 -  Kỳ trước"
        },
        {
            title: t('전자담배_PACK'),
            id: 'ECPreAmt',
            kind: 'Text',
            readonly: false,
            width: 110,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
            group: "이전 -  Kỳ trước"
        },
        {
            title: t('MULTIPACK'),
            id: 'MTPackPreAmt',
            kind: 'Text',
            readonly: false,
            width: 110,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
            group: "이전 -  Kỳ trước"
        },
        {
            title: t('소계 - PACK'),
            id: 'SumPackPreAmt',
            kind: 'Text',
            readonly: false,
            width: 110,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
            group: "이전 -  Kỳ trước"
        },
        {
            title: t('DEVICE'),
            id: 'PreAmt_DEVICE',
            kind: 'Text',
            readonly: false,
            width: 110,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
            group: "이전 -  Kỳ trước"
        },
        {
            title: t('CARTRIDGE'),
            id: 'PreAmt_CARTRIDGE',
            kind: 'Text',
            readonly: false,
            width: 110,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
            group: "이전 -  Kỳ trước"
        },
        {
            title: t('INNER'),
            id: 'PreAmt_INNER',
            kind: 'Text',
            readonly: false,
            width: 110,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
            group: "이전 -  Kỳ trước"
        },
        {
            title: t('소계 - ODM'),
            id: 'PreAmt_NewODM',
            kind: 'Text',
            readonly: false,
            width: 110,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
            group: "이전 -  Kỳ trước"
        },

        {
            title: t('합계 - PACK'),
            id: 'PACKPreAmt',
            kind: 'Text',
            readonly: false,
            width: 110,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
            group: "이전 -  Kỳ trước"
        },
        {
            title: t('I-PJT (F3)'),
            id: 'IPJTPreAmt',
            kind: 'Text',
            readonly: false,
            width: 110,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
            group: "이전 -  Kỳ trước"
        },
        {
            title: t('X-PJT (F3)'),
            id: 'XPJTPreAmt',
            kind: 'Text',
            readonly: false,
            width: 110,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
            group: "이전 -  Kỳ trước"
        },
        {
            title: t('P-PJT (F3)'),
            id: 'PPJITPreAmt',
            kind: 'Text',
            readonly: false,
            width: 110,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
            group: "이전 -  Kỳ trước"
        },
        {
            title: t('REMOCON (F3)'),
            id: 'RemoconPreAmt',
            kind: 'Text',
            readonly: false,
            width: 110,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
            group: "이전 -  Kỳ trước"
        },
        {
            title: t('합계 - PSG (F3)'),
            id: 'PSGPreAmt',
            kind: 'Text',
            readonly: false,
            width: 110,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
            group: "이전 -  Kỳ trước"
        },
        {
            title: t('I-PJT (F5)'),
            id: 'PreAmt_IPJT',
            kind: 'Text',
            readonly: false,
            width: 110,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
            group: "이전 -  Kỳ trước"
        },
        {
            title: t('X-PJT (F5)'),
            id: 'PreAmt_XPJT',
            kind: 'Text',
            readonly: false,
            width: 110,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
            group: "이전 -  Kỳ trước"
        },
        {
            title: t('P-PJT (F5)'),
            id: 'PreAmt_PPJT',
            kind: 'Text',
            readonly: false,
            width: 110,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
            group: "이전 -  Kỳ trước"
        },
        {
            title: t('합계 - PSG (F5)'),
            id: 'PreAmt_PSGTotal',
            kind: 'Text',
            readonly: false,
            width: 110,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
            group: "이전 -  Kỳ trước"
        },
        {
            title: t('합계 - Tổng'),
            id: 'SUMPreAmt',
            kind: 'Text',
            readonly: false,
            width: 110,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
            group: "이전 -  Kỳ trước"
        },

        /* Kỳ này */
        { title: t('POC'), id: 'POCCurrAmt', kind: 'Text', readonly: false, width: 110, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, group: t('이 기간 - Kỳ này') },/*  */
        { title: t('PMP'), id: 'PMPCurrAmt', kind: 'Text', readonly: false, width: 110, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, group: t('이 기간 - Kỳ này') },/*  */
        { title: t('SENSOR'), id: 'SENSORCurrAmt', kind: 'Text', readonly: false, width: 110, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, group: t('이 기간 - Kỳ này') },/*  */
        { title: t('합계 - SEMI'), id: 'SEMICurrAmt', kind: 'Text', readonly: false, width: 110, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, group: t('이 기간 - Kỳ này') },/*  */
        { title: t('PCM'), id: 'PCMCurrAmt', kind: 'Text', readonly: false, width: 110, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, group: t('이 기간 - Kỳ này') },/*  */
        { title: t('SAMSUNGPACK'), id: 'SAMSUNGCurrAmt', kind: 'Text', readonly: false, width: 110, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, group: t('이 기간 - Kỳ này') },/*  */
        { title: t('LGPACK'), id: 'LGCurrAmt', kind: 'Text', readonly: false, width: 110, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, group: t('이 기간 - Kỳ này') },/*  */
        { title: t('ECCurrAmt'), id: 'ECCurrAmt', kind: 'Text', readonly: false, width: 110, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, group: t('이 기간 - Kỳ này') },/*  */
        { title: t('MULTIPACK'), id: 'MTPackCurrAmt', kind: 'Text', readonly: false, width: 110, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, group: t('이 기간 - Kỳ này') },/*  */
        { title: t('소계 - PACK'), id: 'SumPackCurrAmt', kind: 'Text', readonly: false, width: 110, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, group: t('이 기간 - Kỳ này') },/*  */

        { title: t('DEVICE'), id: 'CurrAmt_DEVICE', kind: 'Text', readonly: false, width: 110, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, group: t('이 기간 - Kỳ này') },/*  */
        { title: t('CARTRIDGE'), id: 'Curr_CARTRIDGE', kind: 'Text', readonly: false, width: 110, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, group: t('이 기간 - Kỳ này') },/*  */
        { title: t('INNER'), id: 'Curr_INNER', kind: 'Text', readonly: false, width: 110, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, group: t('이 기간 - Kỳ này') },/*  */
        { title: t('소계 - ODM'), id: 'Curr_NewODM', kind: 'Text', readonly: false, width: 110, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, group: t('이 기간 - Kỳ này') },/*  */


        { title: t('합계 - PACK'), id: 'PACKCurrAmt', kind: 'Text', readonly: false, width: 110, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, group: t('이 기간 - Kỳ này') },/*  */
        { title: t('I-PJT (F3)'), id: 'IPJTCurrAmt', kind: 'Text', readonly: false, width: 110, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, group: t('이 기간 - Kỳ này') },/*  */
        { title: t('X-PJT (F3)'), id: 'XPJTCurrAmt', kind: 'Text', readonly: false, width: 110, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, group: t('이 기간 - Kỳ này') },/*  */
        { title: t('P-PJT (F3)'), id: 'PPJITCurrAmt', kind: 'Text', readonly: false, width: 110, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, group: t('이 기간 - Kỳ này') },/*  */
        { title: t('REMOCON (F3)'), id: 'RemoconCurrAmt', kind: 'Text', readonly: false, width: 110, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, group: t('이 기간 - Kỳ này') },/*  */
        { title: t('합계 - PSG (F3)'), id: 'PSGCurrAmt', kind: 'Text', readonly: false, width: 110, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, group: t('이 기간 - Kỳ này') },/*  */

        { title: t('I-PJT (F5)'), id: 'CurrAmt_IPJT', kind: 'Text', readonly: false, width: 110, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, group: t('이 기간 - Kỳ này') },/*  */
        { title: t('X-PJT (F5)'), id: 'CurrAmt_XPJT', kind: 'Text', readonly: false, width: 110, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, group: t('이 기간 - Kỳ này') },/*  */
        { title: t('P-PJT (F5)'), id: 'CurrAmt_PPJT', kind: 'Text', readonly: false, width: 110, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, group: t('이 기간 - Kỳ này') },/*  */
        { title: t('합계 - PSG (F5)'), id: 'CurrAmt_PSGTotal', kind: 'Text', readonly: false, width: 110, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, group: t('이 기간 - Kỳ này') },/*  */


        { title: t('합계 - Tổng'), id: 'SUMCurrAmt', kind: 'Text', readonly: false, width: 110, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, group: t('이 기간 - Kỳ này') },/*  */

        /* 연간의 총누적실적 - Kết quả lũy kế năm nay */

        { title: t('POC'), id: 'POCSumResult', kind: 'Text', readonly: false, width: 110, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, group: t('연간의 총누적실적 - Kết quả lũy kế năm nay') },/*  */
        { title: t('PMP'), id: 'PMPSumResult', kind: 'Text', readonly: false, width: 110, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, group: t('연간의 총누적실적 - Kết quả lũy kế năm nay') },/*  */
        { title: t('SENSOR'), id: 'SENSORSumResult', kind: 'Text', readonly: false, width: 110, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, group: t('연간의 총누적실적 - Kết quả lũy kế năm nay') },/*  */
        { title: t('합계 - SEMI'), id: 'SEMISumResult', kind: 'Text', readonly: false, width: 110, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, group: t('연간의 총누적실적 - Kết quả lũy kế năm nay') },/*  */
        { title: t('PCM'), id: 'PCMSumResult', kind: 'Text', readonly: false, width: 110, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, group: t('연간의 총누적실적 - Kết quả lũy kế năm nay') },/*  */
        { title: t('SAMSUNGPACK'), id: 'SAMSUNGSumResult', kind: 'Text', readonly: false, width: 110, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, group: t('연간의 총누적실적 - Kết quả lũy kế năm nay') },/*  */
        { title: t('LGPACK'), id: 'LGSumResult', kind: 'Text', readonly: false, width: 110, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, group: t('연간의 총누적실적 - Kết quả lũy kế năm nay') },/*  */

        { title: t('전자담배_PACK'), id: 'ECSumResult', kind: 'Text', readonly: false, width: 110, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, group: t('연간의 총누적실적 - Kết quả lũy kế năm nay') },/*  */

        { title: t('MULTIPACK'), id: 'MTPackSumResult', kind: 'Text', readonly: false, width: 110, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, group: t('연간의 총누적실적 - Kết quả lũy kế năm nay') },/*  */
        { title: t('소계 - PACK'), id: 'SumPackSumResult', kind: 'Text', readonly: false, width: 110, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, group: t('연간의 총누적실적 - Kết quả lũy kế năm nay') },/*  */

        { title: t('DEVICE'), id: 'SumResult_DEVICE', kind: 'Text', readonly: false, width: 110, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, group: t('연간의 총누적실적 - Kết quả lũy kế năm nay') },/*  */
        { title: t('CARTRIDGE'), id: 'Sum_CARTRIDGE', kind: 'Text', readonly: false, width: 110, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, group: t('연간의 총누적실적 - Kết quả lũy kế năm nay') },/*  */
        { title: t('INNER'), id: 'Sum_INNER', kind: 'Text', readonly: false, width: 110, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, group: t('연간의 총누적실적 - Kết quả lũy kế năm nay') },/*  */
        { title: t('소계 - ODM'), id: 'Sum_NewODM', kind: 'Text', readonly: false, width: 110, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, group: t('연간의 총누적실적 - Kết quả lũy kế năm nay') },/*  */

        { title: t('합계 - PACK'), id: 'PACKSumResult', kind: 'Text', readonly: false, width: 110, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, group: t('연간의 총누적실적 - Kết quả lũy kế năm nay') },/*  */
        { title: t('I-PJT (F3)'), id: 'IPJTSumResult', kind: 'Text', readonly: false, width: 110, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, group: t('연간의 총누적실적 - Kết quả lũy kế năm nay') },/*  */
        { title: t('X-PJT (F3)'), id: 'XPJTSumResult', kind: 'Text', readonly: false, width: 110, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, group: t('연간의 총누적실적 - Kết quả lũy kế năm nay') },/*  */
        { title: t('P-PJT (F3)'), id: 'PPJTSumResult', kind: 'Text', readonly: false, width: 110, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, group: t('연간의 총누적실적 - Kết quả lũy kế năm nay') },/*  */
        { title: t('REMOCON (F3)'), id: 'RemoconSumResult', kind: 'Text', readonly: false, width: 110, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, group: t('연간의 총누적실적 - Kết quả lũy kế năm nay') },/*  */
        { title: t('합계 - PSG (F3)'), id: 'PSGSumResult', kind: 'Text', readonly: false, width: 110, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, group: t('연간의 총누적실적 - Kết quả lũy kế năm nay') },/*  */
        { title: t('I-PJT (F5)'), id: 'SumResult_IPJT', kind: 'Text', readonly: false, width: 110, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, group: t('연간의 총누적실적 - Kết quả lũy kế năm nay') },/*  */
        { title: t('X-PJT (F5)'), id: 'SumResult_XPJT', kind: 'Text', readonly: false, width: 110, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, group: t('연간의 총누적실적 - Kết quả lũy kế năm nay') },/*  */
        { title: t('P-PJT (F5)'), id: 'SumResult_PPJT', kind: 'Text', readonly: false, width: 110, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, group: t('연간의 총누적실적 - Kết quả lũy kế năm nay') },/*  */
        { title: t('합계 - PSG (F5)'), id: 'SumResult_PSGTotal', kind: 'Text', readonly: false, width: 110, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, group: t('연간의 총누적실적 - Kết quả lũy kế năm nay') },/*  */
        { title: t('합계 - Tổng'), id: 'SUMSumResult', kind: 'Text', readonly: false, width: 110, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, group: t('연간의 총누적실적 - Kết quả lũy kế năm nay') },/*  */
    ], [t]);





    const [menus, setMenus] = useState([])
    const [gridData, setGridData] = useState([])
    const [selection, setSelection] = useState({
        columns: CompactSelection.empty(),
        rows: CompactSelection.empty()
    })
    const [showSearch, setShowSearch] = useState(false)
    const [addedRows, setAddedRows] = useState([])
    const [editedRows, setEditedRows] = useState([])
    const [numRowsToAdd, setNumRowsToAdd] = useState(null)
    const [numRows, setNumRows] = useState(0)
    const [openHelp, setOpenHelp] = useState(false)
    const [isCellSelected, setIsCellSelected] = useState(false)
    const [helpData01, setHelpData01] = useState([])
    const [helpData02, setHelpData02] = useState([])
    const [helpData03, setHelpData03] = useState([])
    const [helpData04, setHelpData04] = useState([])
    const [helpData05, setHelpData05] = useState([])
    const [helpData06, setHelpData06] = useState([])
    const [helpData07, setHelpData07] = useState([])
    const [helpData08, setHelpData08] = useState([])
    const [helpData09, setHelpData09] = useState([])
    const [helpData10, setHelpData10] = useState([])
    const currentMonth = dayjs().month();
    const currentYear = dayjs().year();

    const [formData, setFormData] = useState(
        dayjs().year(currentYear).month(currentMonth).endOf('month').subtract(1, 'month')
    );

    const [toDate, setToDate] = useState(
        dayjs().year(currentYear).month(currentMonth).endOf('month').subtract(1, 'month')
    );

    const [IsDisplayZero, setIsDisplayZero] = useState(true)
    const [IsInit, setIsInit] = useState(false)
    const [PrevIsInit, setPrevIsInit] = useState(false)

    const [FormatSeq, setFormatSeq] = useState(null)
    const [SMQryUnitSeq, setSMQryUnitSeq] = useState(null)
    const [UMCustClass, setUMCustClass] = useState(null)
    const [displayLevels, setDisplayLevels] = useState(4)
    const [AccUnit, setAccUnit] = useState(null)
    const [searchText, setSearchText] = useState('')
    const [searchText1, setSearchText1] = useState('')
    const [searchText2, setSearchText2] = useState('')
    const [itemText, setItemText] = useState([])
    const [itemText1, setItemText1] = useState([])
    const [itemText2, setItemText2] = useState([])
    const [dataSearch, setDataSearch] = useState([])
    const [dataSearch1, setDataSearch1] = useState([])
    const [dataSearch2, setDataSearch2] = useState([])
    const [dataSheetSearch, setDataSheetSearch] = useState([])
    const [dataSheetSearch1, setDataSheetSearch1] = useState([])
    const [dataSheetSearch2, setDataSheetSearch2] = useState([])
    const [UMEmpType, setUMEmpType] = useState(null)
    const formatDate = (date) => date.format('YYYYMM')
    const [modal2Open, setModal2Open] = useState(false)
    const [errorData, setErrorData] = useState(null)
    const [keyItem2, setKeyItem2] = useState('')
    const [keyItem3, setKeyItem3] = useState('')
    const [cols, setCols] = useState(() =>
        loadFromLocalStorageSheet(
            'mnfcostas_report_a',
            defaultCols.filter((col) => col.visible)
        )
    )
    const resetTable = () => {
        setSelection({
            columns: CompactSelection.empty(),
            rows: CompactSelection.empty()
        })
    }
    useEffect(() => {
        cancelAllRequests()
        notification.destroy();
        message.destroy();
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







    const handleRowAppend = useCallback(
        (numRowsToAdd) => {
            if (canCreate === false) {
                return
            }
            onRowAppended(cols, setGridData, setNumRows, setAddedRows, numRowsToAdd)
        },
        [cols, setGridData, setNumRows, setAddedRows, numRowsToAdd]
    )
    const fetchGenericData = async ({
        controllerKey,
        postFunction,
        searchParams,
        useEmptyData = true,
        defaultCols,
        afterFetch = () => { },
    }) => {
        increaseFetchCount();

        if (controllers.current[controllerKey]) {
            controllers.current[controllerKey].abort();
            await new Promise((resolve) => setTimeout(resolve, 10));
            return fetchGenericData({
                controllerKey,
                postFunction,
                searchParams,
                afterFetch,
                defaultCols,
                useEmptyData,
            });
        }

        const controller = new AbortController();
        controllers.current[controllerKey] = controller;
        const { signal } = controller;

        togglePageInteraction(true);
        loadingBarRef.current?.continuousStart();

        try {
            const response = await postFunction(searchParams, signal);
            if (!response.success) {
                HandleError([
                    {
                        success: false,
                        message: response.message || 'Đã xảy ra lỗi vui lòng thử lại!',
                    },
                ]);
            }
            const data = response.success ? (response.data || []) : [];

            let mergedData = updateIndexNo(data);

            if (useEmptyData) {
                const emptyData = updateIndexNo(generateEmptyData(100, defaultCols));
                mergedData = updateIndexNo([...data, ...emptyData]);
            }

            await afterFetch(mergedData);
        } catch (error) {
            HandleError([{
                success: false,
                message: t(error?.message) || 'Đã xảy ra lỗi khi tải dữ liệu!'
            }]);
            let emptyData = [];

            if (useEmptyData) {
                emptyData = updateIndexNo(generateEmptyData(100, defaultCols));
            }

            await afterFetch(emptyData);
        } finally {
            decreaseFetchCount();
            controllers.current[controllerKey] = null;
        }
    };
    const handleSearchData = useCallback(async () => {
        const from = formData ? formatDate(formData) : '';
        const to = toDate ? formatDate(toDate) : '';

        const itemSeq = dataSheetSearch1?.[0]?.ItemSeq || '';
        const custSeq = dataSheetSearch?.[0]?.CustSeq || '';
        const DeptSeq = dataSheetSearch2?.[0]?.BeDeptSeq || '';

        const searchParams = [{
            SMCostMng: 5512001,
            SMCostDiv: 5507002,
            ProfCostUnit: AccUnit || '',
            CostYMFr: from,
            CostYMTo: to,
            PJTSeq: itemSeq,
            UMCustClass: UMCustClass || '',
            SMQryUnitSeq: SMQryUnitSeq || '',
            CustSeq: custSeq,
            DeptSeq: DeptSeq,
            ProfitDivSeq: 53
        }];

        fetchGenericData({
            controllerKey: 'SESMCFMnfcostasQ',
            postFunction: SESMCFMnfcostasQ,
            searchParams,
            defaultCols: defaultCols,
            useEmptyData: false,
            afterFetch: (data) => {
                setGridData(data || []);
                setNumRows(data?.length || 0);
            },
        });
    }, [
        formData,
        toDate,
        AccUnit,
        defaultCols,
        UMCustClass,
        SMQryUnitSeq,
        dataSheetSearch,
        dataSheetSearch1,
        dataSheetSearch2
    ]);


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


        try {
            const [res1, res2, res3, res4, res5, res6, res7, res8, res9, res10, res11] = await Promise.allSettled([
                GetCodeHelpComboVer2('', langCode, 10002, 1, '%', '', '', '', '', signal),
                GetCodeHelpComboVer2('', langCode, 19999, 1, '%', '1004', '', '', '', signal),
                GetCodeHelpComboVer2('', langCode, 19998, 1, '%', '1060', '', '', '', signal),
                GetCodeHelpVer2(17001, '', '', '', '', '', '', 1, 0, '', 0, 0, 0, signal),
                GetCodeHelpVer2(18080, '', '', '', '', '', '', 1, 0, '', 0, 0, 0, signal),
                GetCodeHelpVer2(10010, '', '', '', '', '', '', 1, 0, '', 0, 0, 0, signal),

            ]);
            setHelpData01(res1.status === 'fulfilled' ? res1.value?.data || [] : []);
            setHelpData02(res2.status === 'fulfilled' ? res2.value?.data || [] : []);
            setHelpData03(res3.status === 'fulfilled' ? res3.value?.data || [] : []);
            setHelpData04(res4.status === 'fulfilled' ? res4.value?.data || [] : []);
            setHelpData05(res5.status === 'fulfilled' ? res5.value?.data || [] : []);
            setHelpData06(res6.status === 'fulfilled' ? res6.value?.data || [] : []);
        } finally {
            decreaseFetchCount();
            controllers.current.fetchCodeHelpData = null;
        }
    }, [langCode]);

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





    return (
        <>
            <Helmet>
                <title>{t('800000191')}</title>
            </Helmet>
            <TopLoadingBar color="blue" height={2} ref={loadingBarRef} />
            <div className="bg-slate-50 h-[calc(100vh-35px)] overflow-hidden">
                <div className="flex flex-col  h-full">
                    <div className="col-start-1 col-end-5 row-start-1 w-full  ">
                        <div className="flex p-2 items-end justify-end">
                            <MnfcostasAction
                                handleSearchData={handleSearchData}
                            />
                        </div>
                        <details
                            className="group p-2 [&_summary::-webkit-details-marker]:hidden border-t border-b bg-white"
                            open
                        >
                            <summary className="flex cursor-pointer items-center justify-between gap-1.5 text-gray-900" >
                                <h2 className="text-[10px] font-medium flex items-center gap-2  uppercase" >
                                    <FilterOutlined />
                                    {t('359')}
                                </h2>
                            </summary>
                            <MnfcostasQuery
                                formData={formData}
                                setFormData={setFormData}
                                toDate={toDate}
                                setToDate={setToDate}
                                setKeyItem3={setKeyItem3}
                                setKeyItem2={setKeyItem2}
                                keyItem2={keyItem2}
                                keyItem3={keyItem3}
                                helpData01={helpData01}
                                helpData02={helpData02}
                                setFormatSeq={setFormatSeq}
                                helpData03={helpData03}
                                setSMQryUnitSeq={setSMQryUnitSeq}
                                setUMCustClass={setUMCustClass}


                                setDataSearch={setDataSearch}
                                setDataSheetSearch={setDataSheetSearch}
                                setSearchText={setSearchText}
                                searchText={searchText}
                                setItemText={setItemText}
                                helpData04={helpData04}


                                setDataSearch1={setDataSearch1}
                                setItemText1={setItemText1}
                                setSearchText1={setSearchText1}
                                helpData05={helpData05}
                                setDataSheetSearch1={setDataSheetSearch1}
                                searchText1={searchText1}

                                setDataSearch2={setDataSearch2}
                                setItemText2={setItemText2}
                                setSearchText2={setSearchText2}
                                helpData06={helpData06}
                                setDataSheetSearch2={setDataSheetSearch2}
                                searchText2={searchText2}


                                setAccUnit={setAccUnit}





                            />
                        </details>
                    </div>

                    <div className="col-start-1 col-end-5 row-start-2 w-full h-full ">
                        <MnfcostasTable
                            setSelection={setSelection}
                            selection={selection}
                            showSearch={showSearch}
                            setShowSearch={setShowSearch}
                            numRows={numRows}
                            setGridData={setGridData}
                            gridData={gridData}
                            setNumRows={setNumRows}
                            setCols={setCols}
                            handleRowAppend={handleRowAppend}
                            cols={cols}
                            defaultCols={defaultCols}
                            canEdit={canEdit}
                            canCreate={canCreate}
                            setHelpData01={setHelpData01}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}
