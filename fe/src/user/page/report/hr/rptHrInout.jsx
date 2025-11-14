import { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet'
import { Input, Space, Table, Typography, message, Splitter, notification } from 'antd'
const { Title, Text } = Typography
import { debounce, set } from 'lodash'
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
import { SHRInfMonthEntRetListQ } from '../../../../features/report/hr/SHRInfMonthEntRetListQ'
import RptHrInoutAction from '../../../components/actions/report/hr/rptHrInoutAction'
import RptHrInoutQuery from '../../../components/query/report/hr/rptHrInoutQuery'
import RptHrInoutTable from '../../../components/table/report/hr/rptHrInoutTable'
import RptHrInoutColChart from '../../../components/chart/report/hr/rptHrInout/rptHrInoutColChart'
import { SHRInfMonthEntRetGraphList } from '../../../../features/report/hr/SHRInfMonthEntRetGraphListQ'
import { SHRInfEmpEntRetListQ } from '../../../../features/report/hr/SHRInfEmpEntRetListQ'
import RptHrEmpJoinTable from '../../../components/table/report/hr/rptHrEmpJoin'
import RptHrEmpResignedTable from '../../../components/table/report/hr/rptHrEmpResigned'
export default function RptHrInout({ permissions, isMobile, canCreate, canEdit, canDelete, controllers,
    cancelAllRequests }) {
    const userFrom = JSON.parse(localStorage.getItem('userInfo'))
    const loadingBarRef = useRef(null);
    const activeFetchCountRef = useRef(0);
    const langCode = localStorage.getItem('language') || '6';
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
            title: t('599'),
            id: 'EntRetTypeName',
            kind: 'Text',
            readonly: false,
            width: 200,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },
        {
            title: t('3386'),
            id: 'EmpCnt01',
            kind: 'Text',
            readonly: false,
            width: 100,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },
        {
            title: t('3406'),
            id: 'EmpCnt02',
            kind: 'Text',
            readonly: false,
            width: 100,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },
        {
            title: t('3419'),
            id: 'EmpCnt03',
            kind: 'Text',
            readonly: false,
            width: 100,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },
        {
            title: t('3427'),
            id: 'EmpCnt04',
            kind: 'Text',
            readonly: false,
            width: 100,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },
        {
            title: t('3433'),
            id: 'EmpCnt05',
            kind: 'Text',
            readonly: false,
            width: 100,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },
        {
            title: t('3447'),
            id: 'EmpCnt06',
            kind: 'Text',
            readonly: false,
            width: 100,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },
        {
            title: t('3453'),
            id: 'EmpCnt07',
            kind: 'Text',
            readonly: false,
            width: 100,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },
        {
            title: t('3459'),
            id: 'EmpCnt08',
            kind: 'Text',
            readonly: false,
            width: 100,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },
        {
            title: t('3465'),
            id: 'EmpCnt09',
            kind: 'Text',
            readonly: false,
            width: 100,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },
        {
            title: t('3338'),
            id: 'EmpCnt10',
            kind: 'Text',
            readonly: false,
            width: 100,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },
        {
            title: t('3347'),
            id: 'EmpCnt11',
            kind: 'Text',
            readonly: false,
            width: 100,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },
        {
            title: t('3355'),
            id: 'EmpCnt12',
            kind: 'Text',
            readonly: false,
            width: 100,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },
        {
            title: t('1079'),
            id: 'EmpCnt00',
            kind: 'Text',
            readonly: false,
            width: 100,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
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
            themeOverride: {
                textDark: "#225588",
                baseFontStyle: "600 13px",
            },
            icon: GridColumnIcon.HeaderLookup,
        },
        {
            title: t('4'),
            id: 'EmpName',
            kind: 'Text',
            readonly: false,
            width: 200,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },
        {
            title: t('1452'),
            id: 'EmpID',
            kind: 'Text',
            readonly: false,
            width: 100,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },
        {
            title: t('215'),
            id: 'EntDate',
            kind: 'Text',
            readonly: false,
            width: 100,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },
        {
            title: t('5'),
            id: 'DeptName',
            kind: 'Text',
            readonly: false,
            width: 150,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },
        {
            title: t('373'),
            id: 'PosName',
            kind: 'Text',
            readonly: false,
            width: 150,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },
        {
            title: t('642'),
            id: 'UMJpName',
            kind: 'Text',
            readonly: false,
            width: 150,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
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
            themeOverride: {
                textDark: "#225588",
                baseFontStyle: "600 13px",
            },
            icon: GridColumnIcon.HeaderLookup,
        },
        {
            title: t('4'),
            id: 'EmpName',
            kind: 'Text',
            readonly: false,
            width: 200,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },
        {
            title: t('1452'),
            id: 'EmpID',
            kind: 'Text',
            readonly: false,
            width: 100,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },
        {
            title: t('215'),
            id: 'EntDate',
            kind: 'Text',
            readonly: false,
            width: 100,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },
        {
            title: t('1176'),
            id: 'RetireDate',
            kind: 'Text',
            readonly: false,
            width: 100,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },
        {
            title: t('5'),
            id: 'DeptName',
            kind: 'Text',
            readonly: false,
            width: 150,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },
        {
            title: t('373'),
            id: 'PosName',
            kind: 'Text',
            readonly: false,
            width: 150,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },
        {
            title: t('642'),
            id: 'UMJpName',
            kind: 'Text',
            readonly: false,
            width: 150,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },
    ], [t]);






    const [menus, setMenus] = useState([])
    const [gridData, setGridData] = useState([])
    const [gridData2, setGridData2] = useState([])
    const [gridData3, setGridData3] = useState([])
    const [selection, setSelection] = useState({
        columns: CompactSelection.empty(),
        rows: CompactSelection.empty()
    })
    const [selection2, setSelection2] = useState({
        columns: CompactSelection.empty(),
        rows: CompactSelection.empty()
    })
    const [selection3, setSelection3] = useState({
        columns: CompactSelection.empty(),
        rows: CompactSelection.empty()
    })
    const [showSearch, setShowSearch] = useState(false)
    const [showSearch2, setShowSearch2] = useState(false)
    const [showSearch3, setShowSearch3] = useState(false)
    const [addedRows, setAddedRows] = useState([])
    const [editedRows, setEditedRows] = useState([])
    const [numRowsToAdd, setNumRowsToAdd] = useState(null)
    const [numRows, setNumRows] = useState(0)
    const [numRows2, setNumRows2] = useState(0)
    const [numRows3, setNumRows3] = useState(0)
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

    const [formData, setFormData] = useState(dayjs().year(currentYear).month(currentMonth).endOf('month').subtract(1, 'month'));
    const [toDate, setToDate] = useState(dayjs().year(currentYear).month(currentMonth).endOf('month').subtract(1, 'month'));
    const [PrevFrAccYM, setPrevFrAccYM] = useState(dayjs().subtract(1, 'year').month(0).startOf('month'));
    const [PrevToAccYM, setPrevToAccYM] = useState(dayjs().subtract(1, 'year').month(currentMonth).endOf('month'));
    const [IsDisplayZero, setIsDisplayZero] = useState(true)
    const [IsInit, setIsInit] = useState(false)
    const [PrevIsInit, setPrevIsInit] = useState(false)

    const [FormatSeq, setFormatSeq] = useState(null)
    const [AssetSeq, setAssetSeq] = useState(null)
    const [AssetGroupSeq, setAssetGroupSeq] = useState(null)
    const [SMAdjustKindSeq, setSMAdjustKindSeq] = useState(null)
    const [BizUnit, setBizUnit] = useState(null)
    const [SMOutSales, setSMOutSales] = useState(null)
    const [SMSTDQueryType, setSMSTDQueryType] = useState(null)
    const [UMItemClass, setUMItemClass] = useState(null)
    const [SMQryUnitSeq, setSMQryUnitSeq] = useState(null)
    const [Ranking, setRanking] = useState(5)
    const [SMTermsKind, setSMTermsKind] = useState(null)
    const [dataChart1, setDataChart1] = useState([])
    const [dataChart2, setDataChart2] = useState([])
    const [dataChart3, setDataChart3] = useState([])
    const formatDate = (date) => date.format('YYYY')
    const [modal2Open, setModal2Open] = useState(false)
    const [errorData, setErrorData] = useState(null)
    const [keyItem2, setKeyItem2] = useState('')
    const [keyItem3, setKeyItem3] = useState('')
    const [cols, setCols] = useState(() =>
        loadFromLocalStorageSheet(
            'rpt_hr_inout_1_a',
            defaultCols.filter((col) => col.visible)
        )
    )
    const [cols2, setCols2] = useState(() =>
        loadFromLocalStorageSheet(
            'rpt_hr_inout_2_a',
            defaultCols2.filter((col) => col.visible)
        )
    )
    const [cols3, setCols3] = useState(() =>
        loadFromLocalStorageSheet(
            'rpt_hr_inout_3_a',
            defaultCols3.filter((col) => col.visible)
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

        const searchParams = [{
            YY: from,
            WorkingTag: '',
            LanguageSeq: langCode,
        }];
        const searchParams2 = [{
            YY: from,
            WorkingTag: '',
            LanguageSeq: langCode,
            EntRetType: '3031001'
        }];
        const searchParams3 = [{
            YY: from,
            WorkingTag: '',
            LanguageSeq: langCode,
            EntRetType: '3031002'
        }];

        fetchGenericData({
            controllerKey: 'SHRInfMonthEntRetListQ',
            postFunction: SHRInfMonthEntRetListQ,
            searchParams,
            defaultCols: defaultCols,
            useEmptyData: false,
            afterFetch: (data) => {
                setGridData(data || []);
                setNumRows(data?.length || 0);
            },
        });

        fetchGenericData({
            controllerKey: 'SHRInfMonthEntRetGraphList',
            postFunction: SHRInfMonthEntRetGraphList,
            searchParams,
            defaultCols: defaultCols,
            useEmptyData: false,
            afterFetch: (data) => {
                setDataChart1(data || []);
            },
        });
        fetchGenericData({
            controllerKey: 'SHRInfEmpEntRetListQ',
            postFunction: SHRInfEmpEntRetListQ,
            searchParams: searchParams2,
            defaultCols: defaultCols2,
            useEmptyData: false,
            afterFetch: (data) => {
                setGridData2(data || []);
                setNumRows2(data?.length || 0);
            },
        });
        fetchGenericData({
            controllerKey: 'SHRInfEmpEntRetListQ2',
            postFunction: SHRInfEmpEntRetListQ,
            searchParams: searchParams3,
            defaultCols: defaultCols3,
            useEmptyData: false,
            afterFetch: (data) => {
                setGridData3(data || []);
                setNumRows3(data?.length || 0);
            },
        });
    }, [
        langCode,
        formData
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

            ]);
        } finally {
            decreaseFetchCount();
            controllers.current.fetchCodeHelpData = null;
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





    return (
        <>
            <Helmet>
                <title>{t('800001003')}</title>
            </Helmet>
            <TopLoadingBar color="blue" height={2} ref={loadingBarRef} />
            <div className="bg-slate-50 h-[calc(100vh-35px)] overflow-hidden">
                <div className="flex flex-col  h-full">
                    <div className="col-start-1 col-end-5 row-start-1 w-full  ">
                        <div className="flex p-2 items-end justify-end">
                            <RptHrInoutAction
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
                            <RptHrInoutQuery
                                formData={formData}
                                setFormData={setFormData}


                            />
                        </details>
                    </div>

                    <div className="col-start-1 col-end-5 row-start-2 w-full h-full ">

                        <Splitter layout="vertical" className="h-full min-h-0 flex flex-col">
                            <Splitter.Panel defaultSize="15%" min="15%" max="15%" className="h-full min-h-0 flex flex-col">
                                <RptHrInoutTable
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
                            </Splitter.Panel>
                            <Splitter.Panel defaultSize="50%" min="20%" max="70%" className="h-full min-h-0 flex flex-col">
                                <Splitter layout="horizontal" className="h-full min-h-0 flex flex-row">
                                    <Splitter.Panel defaultSize="33%" min="20%" max="50%" className="h-full min-h-0 flex flex-col">
                                        <RptHrEmpJoinTable
                                            setSelection={setSelection2}
                                            selection={selection2}
                                            showSearch={showSearch2}
                                            setShowSearch={setShowSearch2}
                                            numRows={numRows2}
                                            setGridData={setGridData2}
                                            gridData={gridData2}
                                            setNumRows={setNumRows2}
                                            setCols={setCols2}
                                            cols={cols2}
                                            defaultCols={defaultCols2}
                                            canEdit={canEdit}
                                            canCreate={canCreate}
                                        />
                                    </Splitter.Panel>

                                    <Splitter.Panel defaultSize="33%" min="20%" max="50%" className="h-full min-h-0 flex flex-col">
                                        <RptHrEmpResignedTable
                                            setSelection={setSelection3}
                                            selection={selection3}
                                            showSearch={showSearch3}
                                            setShowSearch={setShowSearch3}
                                            numRows={numRows3}
                                            setGridData={setGridData3}
                                            gridData={gridData3}
                                            setNumRows={setNumRows3}
                                            setCols={setCols3}
                                            cols={cols3}
                                            defaultCols={defaultCols3}
                                            canEdit={canEdit}
                                            canCreate={canCreate}
                                        />
                                    </Splitter.Panel>

                                </Splitter>
                            </Splitter.Panel>

                            <Splitter.Panel defaultSize="35%" min="30%" max="80%" className="h-full min-h-0 flex flex-col">
                                <RptHrInoutColChart dataChart={dataChart1} />
                            </Splitter.Panel>

                        </Splitter>


                    </div>
                </div>
            </div>
        </>
    )
}
