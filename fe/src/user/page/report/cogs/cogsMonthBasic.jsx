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
import { GetCodeHelpVer3 } from '../../../../features/codeHelp/getCodeHelpVer3'
import { GetCodeHelpComboVer2 } from '../../../../features/codeHelp/getCodeHelpComboVer2'
import { GetCodeHelpVer2 } from '../../../../features/codeHelp/getCodeHelpVer2'
import CogsMonthBasicAction from '../../../components/actions/report/cogs/cogsMonthBasicAction'
import CogsMonthBasicQuery from '../../../components/query/report/cogs/cogsMonthBasicQuery'
import CogsMonthBasicTable from '../../../components/table/report/cogs/cogsMonthBasicTable'
import { VTNSESMZProdCostMonListQ } from '../../../../features/report/cogs/VTNSESMZProdCostMonListQ'
export default function CogsMonthBasic({ permissions, isMobile, canCreate, canEdit, canDelete, controllers,
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
            title: t('18845'),
            id: 'AssetName',
            kind: 'Text',
            readonly: false,
            width: 250,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },

        {
            title: t('3122'),
            id: 'UMItemClassLName',
            kind: 'Text',
            readonly: false,
            width: 110,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },

        },
        {
            title: t('3262'),
            id: 'UMItemClassMName',
            kind: 'Text',
            readonly: false,
            width: 110,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },

        },
        {
            title: t('15151'),
            id: 'UMItemClassSName',
            kind: 'Text',
            readonly: false,
            width: 110,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },

        },
        {
            title: t('10555'),
            id: 'ItemName',
            kind: 'Text',
            readonly: false,
            width: 250,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },

        },
        {
            title: t('2091'),
            id: 'ItemNo',
            kind: 'Text',
            readonly: false,
            width: 170,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },

        },
        {
            title: t('293'),
            id: 'TotalAmt',
            kind: 'Text',
            readonly: false,
            width: 110,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },

        },

        /* 3386 */
        { title: t('1628'), id: 'Mo1Qty', kind: 'Text', readonly: false, width: 110, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, group: t('3386') },
        { title: t('2359'), id: 'Mo1Price', kind: 'Text', readonly: false, width: 110, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, group: t('3386') },
        { title: t('290'), id: 'Mo1Amt', kind: 'Text', readonly: false, width: 110, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, group: t('3386') },

        /* 3406 */
        { title: t('1628'), id: 'Mo2Qty', kind: 'Text', readonly: false, width: 110, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, group: t('3406') },
        { title: t('2359'), id: 'Mo2Price', kind: 'Text', readonly: false, width: 110, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, group: t('3406') },
        { title: t('290'), id: 'Mo2Amt', kind: 'Text', readonly: false, width: 110, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, group: t('3406') },

        /* 3419 */
        { title: t('1628'), id: 'Mo3Qty', kind: 'Text', readonly: false, width: 110, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, group: t('3419') },
        { title: t('2359'), id: 'Mo3Price', kind: 'Text', readonly: false, width: 110, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, group: t('3419') },
        { title: t('290'), id: 'Mo3Amt', kind: 'Text', readonly: false, width: 110, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, group: t('3419') },

        /* 3427 */
        { title: t('1628'), id: 'Mo4Qty', kind: 'Text', readonly: false, width: 110, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, group: t('3427') },
        { title: t('2359'), id: 'Mo4Price', kind: 'Text', readonly: false, width: 110, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, group: t('3427') },
        { title: t('290'), id: 'Mo4Amt', kind: 'Text', readonly: false, width: 110, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, group: t('3427') },

        /* 3433 */
        { title: t('1628'), id: 'Mo5Qty', kind: 'Text', readonly: false, width: 110, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, group: t('3433') },
        { title: t('2359'), id: 'Mo5Price', kind: 'Text', readonly: false, width: 110, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, group: t('3433') },
        { title: t('290'), id: 'Mo5Amt', kind: 'Text', readonly: false, width: 110, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, group: t('3433') },

        /* 3447 */
        { title: t('1628'), id: 'Mo6Qty', kind: 'Text', readonly: false, width: 110, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, group: t('3447') },
        { title: t('2359'), id: 'Mo6Price', kind: 'Text', readonly: false, width: 110, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, group: t('3447') },
        { title: t('290'), id: 'Mo6Amt', kind: 'Text', readonly: false, width: 110, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, group: t('3447') },

        /* 3453 */
        { title: t('1628'), id: 'Mo7Qty', kind: 'Text', readonly: false, width: 110, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, group: t('3453') },
        { title: t('2359'), id: 'Mo7Price', kind: 'Text', readonly: false, width: 110, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, group: t('3453') },
        { title: t('290'), id: 'Mo7Amt', kind: 'Text', readonly: false, width: 110, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, group: t('3453') },

        /* 3459 */
        { title: t('1628'), id: 'Mo8Qty', kind: 'Text', readonly: false, width: 110, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, group: t('3459') },
        { title: t('2359'), id: 'Mo8Price', kind: 'Text', readonly: false, width: 110, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, group: t('3459') },
        { title: t('290'), id: 'Mo8Amt', kind: 'Text', readonly: false, width: 110, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, group: t('3459') },

        /* 3465 */
        { title: t('1628'), id: 'Mo9Qty', kind: 'Text', readonly: false, width: 110, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, group: t('3465') },
        { title: t('2359'), id: 'Mo9Price', kind: 'Text', readonly: false, width: 110, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, group: t('3465') },
        { title: t('290'), id: 'Mo9Amt', kind: 'Text', readonly: false, width: 110, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, group: t('3465') },

        /* 3338 */
        { title: t('1628'), id: 'Mo10Qty', kind: 'Text', readonly: false, width: 110, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, group: t('3338') },
        { title: t('2359'), id: 'Mo10Price', kind: 'Text', readonly: false, width: 110, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, group: t('3338') },
        { title: t('290'), id: 'Mo10Amt', kind: 'Text', readonly: false, width: 110, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, group: t('3338') },

        /* 3347 */
        { title: t('1628'), id: 'Mo11Qty', kind: 'Text', readonly: false, width: 110, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, group: t('3347') },
        { title: t('2359'), id: 'Mo11Price', kind: 'Text', readonly: false, width: 110, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, group: t('3347') },
        { title: t('290'), id: 'Mo11Amt', kind: 'Text', readonly: false, width: 110, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, group: t('3347') },

        /* 3355 */
        { title: t('1628'), id: 'Mo12Qty', kind: 'Text', readonly: false, width: 110, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, group: t('3355') },
        { title: t('2359'), id: 'Mo12Price', kind: 'Text', readonly: false, width: 110, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, group: t('3355') },
        { title: t('290'), id: 'Mo12Amt', kind: 'Text', readonly: false, width: 110, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, group: t('3355') }

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
    const [AccUnit, setAccUnit] = useState('')
    const [AssetSeq, setAssetSeq] = useState('')
    const [ItemClassKind, setItemClassKind] = useState('')
    const [CostYY, setCostYY] = useState(dayjs().format('YYYY'));

    const [searchText, setSearchText] = useState('')
    const [searchText1, setSearchText1] = useState('')
    const [searchText2, setSearchText2] = useState('')
    const [searchText3, setSearchText3] = useState('')
    const [searchText4, setSearchText4] = useState('')
    const [itemText, setItemText] = useState([])
    const [itemText1, setItemText1] = useState([])
    const [itemText2, setItemText2] = useState([])
    const [itemText3, setItemText3] = useState([])
    const [itemText4, setItemText4] = useState([])
    const [dataSearch, setDataSearch] = useState([])
    const [dataSearch1, setDataSearch1] = useState([])
    const [dataSearch2, setDataSearch2] = useState([])
    const [dataSearch3, setDataSearch3] = useState([])
    const [dataSearch4, setDataSearch4] = useState([])
    const [dataSheetSearch, setDataSheetSearch] = useState([])
    const [ItemNo, setItemNo] = useState('')
    const [UMEmpType, setUMEmpType] = useState(null)
    const formatDate = (date) => date.format('YYYYMM')
    const [modal2Open, setModal2Open] = useState(false)
    const [errorData, setErrorData] = useState(null)
    const [keyItem2, setKeyItem2] = useState('')
    const [keyItem3, setKeyItem3] = useState('')
    const [cols, setCols] = useState(() =>
        loadFromLocalStorageSheet(
            'cogs_month_basic_a',
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
        let ItemClassSeq = '';

        if (ItemClassKind === '2003') {
            ItemClassSeq = dataSearch2?.Value || '';
        } else if (ItemClassKind === '2002') {
            ItemClassSeq = dataSearch3?.Value || '';
        } else if (ItemClassKind === '2001') {
            ItemClassSeq = dataSearch4?.Value || '';
        } else {
            ItemClassSeq = '';
        }

        const searchParams = [{
            RptUnit: '',
            SMCostMng: '5512001',
            CostMngAmdSeq: '',
            CostUnit: AccUnit || '',
            CostYY: CostYY || dayjs().format('YYYY'),
            AssetSeq: AssetSeq || '',
            QueryKind: '5548001',
            ItemSeq: dataSheetSearch?.[0]?.ItemSeq || '',
            ItemName: dataSheetSearch?.[0]?.ItemName || '',
            ItemNo: ItemNo || '',
            ItemClassKind: ItemClassKind || '',
            ItemClassSeq: ItemClassSeq,
            PlanYear: '',
        }];

        fetchGenericData({
            controllerKey: 'VTNSESMZProdCostMonListQ',
            postFunction: VTNSESMZProdCostMonListQ,
            searchParams,
            defaultCols: defaultCols,
            useEmptyData: false,
            afterFetch: (data) => {
                setGridData(data || []);
                setNumRows(data?.length + 1 || 0);
            },
        });
    }, [
        CostYY,
        AccUnit,
        AssetSeq,
        ItemNo,
        ItemClassKind,
        dataSearch2,
        dataSearch3,
        dataSearch4,
        dataSheetSearch,
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
                GetCodeHelpComboVer2('', langCode, 10012, 1, '%', '', '', '', '(A.SMAssetGrp IN (6008002, 6008004 ))', signal),
                GetCodeHelpVer3(langCode, 18061, '', '', '', '', '', '', 1, 0, '', 0, 0, 0, signal),
                GetCodeHelpComboVer2('', langCode, 19998, 1, '%', '8065', '1001', '1', '', signal),
                GetCodeHelpVer3(langCode, 19999, '', '2003', '', '', '', '', 1, 0, '', 0, 0, 0, signal),
                GetCodeHelpVer3(langCode, 19999, '', '2002', '', '', '', '', 1, 0, '', 0, 0, 0, signal),
                GetCodeHelpVer3(langCode, 19999, '', '2001', '', '', '', '', 1, 0, '', 0, 0, 0, signal),
            ]);
            setHelpData01(res1.status === 'fulfilled' ? res1.value?.data || [] : []);
            setHelpData02(res2.status === 'fulfilled' ? res2.value?.data || [] : []);
            setHelpData03(res3.status === 'fulfilled' ? res3.value?.data || [] : []);
            setHelpData04(res4.status === 'fulfilled' ? res4.value?.data || [] : []);
            setHelpData05(res5.status === 'fulfilled' ? res5.value?.data || [] : []);
            setHelpData06(res6.status === 'fulfilled' ? res6.value?.data || [] : []);
            setHelpData07(res7.status === 'fulfilled' ? res7.value?.data || [] : []);
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
                <title>{t('800001011')}</title>
            </Helmet>
            <TopLoadingBar color="blue" height={2} ref={loadingBarRef} />
            <div className="bg-slate-50 h-[calc(100vh-35px)] overflow-hidden">
                <div className="flex flex-col  h-full">
                    <div className="col-start-1 col-end-5 row-start-1 w-full  ">
                        <div className="flex p-2 items-end justify-end">
                            <CogsMonthBasicAction
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
                            <CogsMonthBasicQuery
                                AccUnit={AccUnit}
                                setAccUnit={setAccUnit}
                                helpData01={helpData01}
                                helpData02={helpData02}
                                setAssetSeq={setAssetSeq}
                                AssetSeq={AssetSeq}
                                CostYY={CostYY}
                                setCostYY={setCostYY}
                                helpData03={helpData03}
                                setDataSearch={setDataSearch}
                                setDataSheetSearch={setDataSheetSearch}

                                setSearchText={setSearchText}
                                searchText={searchText}
                                setItemText={setItemText}
                                setItemNo={setItemNo}
                                ItemNo={ItemNo}
                                dataSheetSearch={dataSheetSearch}

                                helpData04={helpData04}
                                ItemClassKind={ItemClassKind}
                                setItemClassKind={setItemClassKind}

                                helpData05={helpData05}
                                setDataSearch2={setDataSearch2}
                                setSearchText2={setSearchText2}
                                searchText2={searchText2}
                                setItemText2={setItemText2}


                                helpData06={helpData06}
                                setDataSearch3={setDataSearch3}
                                setSearchText3={setSearchText3}
                                searchText3={searchText3}
                                setItemText3={setItemText3}

                                helpData07={helpData07}
                                setDataSearch4={setDataSearch4}
                                setSearchText4={setSearchText4}
                                searchText4={searchText4}
                                setItemText4={setItemText4}
                            />
                        </details>
                    </div>

                    <div className="col-start-1 col-end-5 row-start-2 w-full h-full ">
                        <CogsMonthBasicTable
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
