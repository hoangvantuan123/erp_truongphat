import { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet'
import { Input, Space, Table, Typography, message, Splitter, notification } from 'antd'
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
import { GetCodeHelpComboVer2 } from '../../../../features/codeHelp/getCodeHelpComboVer2'
import { GetCodeHelpVer2 } from '../../../../features/codeHelp/getCodeHelpVer2'
import { SSLEISItemAnalysisQ } from '../../../../features/report/sales/SSLEISItemAnalysisQ'
import RptSalesCatTable from '../../../components/table/report/sales/rptSalesCatTable'
import SalesValuePieChart from '../../../components/chart/report/sales/rptSalesCat/salesValuePieChart'
import RptSalesCatQuery from '../../../components/query/report/sales/rptSalesCatQuery'
import RptSalesCatAction from '../../../components/actions/report/sales/rptSalesCatAction'
import ProfitAmountPieChart from '../../../components/chart/report/sales/rptSalesCat/profitAmountPieChart'
import ReturnAmountPieChart from '../../../components/chart/report/sales/rptSalesCat/returnAmountPieChart'
export default function RptSalesCat({ permissions, isMobile, canCreate, canEdit, canDelete, controllers,
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
            title: t('2'),
            id: 'BizUnitName',
            kind: 'Text',
            readonly: false,
            width: 100,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },
        {
            title: t('715'),
            id: 'UMItemClassName',
            kind: 'Text',
            readonly: false,
            width: 150,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },
        {
            title: t('1786'),
            id: 'ItemName',
            kind: 'Text',
            readonly: false,
            width: 150,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },
        {
            title: t('2091'),
            id: 'ItemNo',
            kind: 'Text',
            readonly: false,
            width: 150,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },
        {
            title: t('5258'),
            id: 'YearSalesAmt',
            kind: 'Text',
            readonly: false,
            width: 150,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
            group: t('12689')
        },
        {
            title: t('16478'),
            id: 'YearBenefitAmt',
            kind: 'Text',
            readonly: false,
            width: 150,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
            group: t('12689')
        },
        {
            title: t('16483'),
            id: 'YearBenefitRate',
            kind: 'Text',
            readonly: false,
            width: 150,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
            group: t('12689')
        },
        {
            title: t('5258'),
            id: 'ThisSalesAmt',
            kind: 'Text',
            readonly: false,
            width: 150,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
            group: t('312')
        },
        {
            title: t('16478'),
            id: 'ThisBenefitAmt',
            kind: 'Text',
            readonly: false,
            width: 150,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
            group: t('312')
        },
        {
            title: t('16483'),
            id: 'ThisBenefitRate',
            kind: 'Text',
            readonly: false,
            width: 150,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
            group: t('312')
        },
        {
            title: t('12692'),
            id: 'YearRtnAmt',
            kind: 'Text',
            readonly: false,
            width: 150,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
            group: t('13570')
        },
        {
            title: t('12866'),
            id: 'ThisRtnAmt',
            kind: 'Text',
            readonly: false,
            width: 150,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
            group: t('13570')
        },
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
    const formatDate = (date) => date.format('YYYYMM')
    const [modal2Open, setModal2Open] = useState(false)
    const [errorData, setErrorData] = useState(null)
    const [keyItem2, setKeyItem2] = useState('')
    const [keyItem3, setKeyItem3] = useState('')
    const [cols, setCols] = useState(() =>
        loadFromLocalStorageSheet(
            'supplement_issue_a',
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

        const searchParams = [{
            FromYM: from,
            ToYM: to,
            SMYearActPlan: 8043001,
            SMYearActPlanName: '',
            BizUnit: BizUnit ? BizUnit : '',
            BizUnitName: '',
            SMOutSales: SMOutSales ? SMOutSales : '',
            SMOutSalesName: '',
            SMSTDQueryType: SMSTDQueryType ? SMSTDQueryType : '',
            SMSTDQueryTypeName: '',
            UMItemClass: UMItemClass ? UMItemClass : '',
            UMItemClassName: '',
            SMQryUnitSeq: SMQryUnitSeq ? SMQryUnitSeq : '',
            SMRateAmt: 1079003,
            SMRateAmtName: '',
            SMTermsKind: SMTermsKind ? SMTermsKind : '',
            SMTermsKindName: '',
            Ranking: Ranking ? Ranking : '',
            WorkingTag: '',

        }];
        const searchParams2 = [{
            FromYM: from,
            ToYM: to,
            SMYearActPlan: 8043001,
            SMYearActPlanName: '',
            BizUnit: BizUnit ? BizUnit : '',
            BizUnitName: '',
            SMOutSales: SMOutSales ? SMOutSales : '',
            SMOutSalesName: '',
            SMSTDQueryType: SMSTDQueryType ? SMSTDQueryType : '',
            SMSTDQueryTypeName: '',
            UMItemClass: UMItemClass ? UMItemClass : '',
            UMItemClassName: '',
            SMQryUnitSeq: SMQryUnitSeq ? SMQryUnitSeq : '',
            SMRateAmt: 1079003,
            SMRateAmtName: '',
            SMTermsKind: SMTermsKind ? SMTermsKind : '',
            SMTermsKindName: '',
            Ranking: Ranking ? Ranking : '',
            WorkingTag: 'C',

        }];
        const searchParams3 = [{
            FromYM: from,
            ToYM: to,
            SMYearActPlan: 8043001,
            SMYearActPlanName: '',
            BizUnit: BizUnit ? BizUnit : '',
            BizUnitName: '',
            SMOutSales: SMOutSales ? SMOutSales : '',
            SMOutSalesName: '',
            SMSTDQueryType: SMSTDQueryType ? SMSTDQueryType : '',
            SMSTDQueryTypeName: '',
            UMItemClass: UMItemClass ? UMItemClass : '',
            UMItemClassName: '',
            SMQryUnitSeq: SMQryUnitSeq ? SMQryUnitSeq : '',
            SMRateAmt: 1079004,
            SMRateAmtName: '',
            SMTermsKind: SMTermsKind ? SMTermsKind : '',
            SMTermsKindName: '',
            Ranking: Ranking ? Ranking : '',
            WorkingTag: 'C',

        }];
        const searchParams4 = [{
            FromYM: from,
            ToYM: to,
            SMYearActPlan: 8043001,
            SMYearActPlanName: '',
            BizUnit: BizUnit ? BizUnit : '',
            BizUnitName: '',
            SMOutSales: SMOutSales ? SMOutSales : '',
            SMOutSalesName: '',
            SMSTDQueryType: SMSTDQueryType ? SMSTDQueryType : '',
            SMSTDQueryTypeName: '',
            UMItemClass: UMItemClass ? UMItemClass : '',
            UMItemClassName: '',
            SMQryUnitSeq: SMQryUnitSeq ? SMQryUnitSeq : '',
            SMRateAmt: 1079007,
            SMRateAmtName: '',
            SMTermsKind: SMTermsKind ? SMTermsKind : '',
            SMTermsKindName: '',
            Ranking: Ranking ? Ranking : '',
            WorkingTag: 'C',

        }];

        fetchGenericData({
            controllerKey: 'SSLEISItemAnalysisQ',
            postFunction: SSLEISItemAnalysisQ,
            searchParams,
            defaultCols: defaultCols,
            useEmptyData: false,
            afterFetch: (data) => {
                setGridData(data || []);
                setNumRows(data?.length + 1 || 0);
            },
        });
        fetchGenericData({
            controllerKey: 'SSLEISItemAnalysisQChart1',
            postFunction: SSLEISItemAnalysisQ,
            searchParams: searchParams2,
            defaultCols: defaultCols,
            useEmptyData: true,
            afterFetch: (data) => {
                setDataChart1(data || []);
            },
        });
        fetchGenericData({
            controllerKey: 'SSLEISItemAnalysisQChart2',
            postFunction: SSLEISItemAnalysisQ,
            searchParams: searchParams3,
            defaultCols: defaultCols,
            useEmptyData: true,
            afterFetch: (data) => {
                setDataChart2(data || []);
            },
        });
        fetchGenericData({
            controllerKey: 'SSLEISItemAnalysisQChart3',
            postFunction: SSLEISItemAnalysisQ,
            searchParams: searchParams4,
            defaultCols: defaultCols,
            useEmptyData: true,
            afterFetch: (data) => {
                setDataChart3(data || []);
            },
        });
    }, [
        formData,
        toDate,
        BizUnit,
        defaultCols,
        SMOutSales,
        SMSTDQueryType,
        UMItemClass,
        SMQryUnitSeq,
        SMTermsKind,
        Ranking


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
                GetCodeHelpComboVer2('', langCode, 10003, 1, '%', '', '', '', '', signal),
                GetCodeHelpComboVer2('', langCode, 19998, 1, '%', '8049', '', '', '', signal),
                GetCodeHelpComboVer2('', langCode, 19998, 1, '%', '1078', '1007', '1', '', signal),
                GetCodeHelpComboVer2('', langCode, 18087, 1, '%', '1', '', '', '', signal),
                GetCodeHelpComboVer2('', langCode, 19998, 1, '%', '1060', '', '', '', signal),
                GetCodeHelpComboVer2('', langCode, 19998, 1, '%', '1077', '', '', '', signal),
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
                <title>{t('800001002')}</title>
            </Helmet>
            <TopLoadingBar color="blue" height={2} ref={loadingBarRef} />
            <div className="bg-slate-50 h-[calc(100vh-35px)] overflow-hidden">
                <div className="flex flex-col  h-full">
                    <div className="col-start-1 col-end-5 row-start-1 w-full  ">
                        <div className="flex p-2 items-end justify-end">
                            <RptSalesCatAction
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
                            <RptSalesCatQuery
                                formData={formData}
                                setFormData={setFormData}
                                toDate={toDate}
                                setToDate={setToDate}
                                helpData01={helpData01}
                                helpData02={helpData02}
                                helpData03={helpData03}
                                helpData04={helpData04}
                                helpData05={helpData05}
                                helpData06={helpData06}
                                setBizUnit={setBizUnit}
                                setSMOutSales={setSMOutSales}
                                setSMSTDQueryType={setSMSTDQueryType}
                                setUMItemClass={setUMItemClass}
                                setSMQryUnitSeq={setSMQryUnitSeq}
                                setSMTermsKind={setSMTermsKind}
                                setRanking={setRanking}
                                SMOutSales={SMOutSales}
                                SMSTDQueryType={SMSTDQueryType}
                                UMItemClass={UMItemClass}
                                SMQryUnitSeq={SMQryUnitSeq}
                                SMTermsKind={SMTermsKind}
                                Ranking={Ranking}


                            />
                        </details>
                    </div>

                    <div className="col-start-1 col-end-5 row-start-2 w-full h-full ">

                        <Splitter layout="vertical" className="h-full min-h-0 flex flex-col">
                            <Splitter.Panel defaultSize="55%" min="20%" max="70%" className="h-full min-h-0 flex flex-col">
                                <RptSalesCatTable
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

                            <Splitter.Panel defaultSize="45%" min="30%" max="80%" className="h-full min-h-0 flex flex-col">
                                <Splitter layout="horizontal" className="h-full min-h-0 flex flex-row">
                                    <Splitter.Panel defaultSize="33%" min="20%" max="50%" className="h-full min-h-0 flex flex-col">
                                        <SalesValuePieChart dataChart={dataChart1} SMTermsKind={SMTermsKind} />
                                    </Splitter.Panel>

                                    <Splitter.Panel defaultSize="33%" min="20%" max="50%" className="h-full min-h-0 flex flex-col">
                                        <ProfitAmountPieChart dataChart={dataChart2} SMTermsKind={SMTermsKind} />
                                    </Splitter.Panel>

                                    <Splitter.Panel defaultSize="34%" min="20%" max="50%" className="h-full min-h-0 flex flex-col">
                                        <ReturnAmountPieChart dataChart={dataChart3} SMTermsKind={SMTermsKind} />
                                    </Splitter.Panel>
                                </Splitter>
                            </Splitter.Panel>

                        </Splitter>


                    </div>
                </div>
            </div>
        </>
    )
}
