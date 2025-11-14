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
import { filterValidRows } from '../../../../utils/filterUorA'
import { updateIndexNo } from '../../../components/sheet/js/updateIndexNo'
import dayjs from 'dayjs'
import { HandleError } from '../../default/handleError'
import { GetCodeHelpComboVer2 } from '../../../../features/codeHelp/getCodeHelpComboVer2'
import { GetCodeHelpVer2 } from '../../../../features/codeHelp/getCodeHelpVer2'
import { FSQueryTermByMonthQ } from '../../../../features/report/execFin/FSQueryTermByMonthQ'
import MonthlyProfitLossAction from '../../../components/actions/report/execFin/monthlyProfitLossAction'
import MnthlyProfitLossQuery from '../../../components/query/report/execFin/monthlyProfitLossQuery'
import MnthlyProfitLossTable from '../../../components/table/report/execFin/MnthlyProfitLossTable'
export default function MonthlyProfitLoss({ permissions, isMobile, canCreate, canEdit, canDelete, controllers,
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
            title: t('8'),
            id: 'FSItemNamePrt',
            kind: 'Text',
            readonly: false,
            width: 430,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },
        {
            title: t('1079'),
            id: 'Tot',
            kind: 'Number',
            readonly: false,
            width: 140,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },

        {
            title: t('3386'),
            id: 'Mon1',
            kind: 'Number',
            readonly: false,
            width: 140,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },
        {
            title: t('3406'),
            id: 'Mon2',
            kind: 'Text',
            readonly: false,
            width: 140,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },
        {
            title: t('3419'),
            id: 'Mon3',
            kind: 'Number',
            readonly: false,
            width: 140,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },
        {
            title: t('11530'),
            id: 'Q1',
            kind: 'Number',
            readonly: false,
            width: 140,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },

        {
            title: t('3427'),
            id: 'Mon4',
            kind: 'Number',
            readonly: false,
            width: 140,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },
        {
            title: t('3433'),
            id: 'Mon5',
            kind: 'Number',
            readonly: false,
            width: 140,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },
        {
            title: t('3447'),
            id: 'Mon6',
            kind: 'Number',
            readonly: false,
            width: 140,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },
        {
            title: t('11544'),
            id: 'Q2',
            kind: 'Number',
            readonly: false,
            width: 140,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },
        {
            title: t('13530'),
            id: 'H1',
            kind: 'Number',
            readonly: false,
            width: 140,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },

        {
            title: t('3453'),
            id: 'Mon7',
            kind: 'Number',
            readonly: false,
            width: 140,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },
        {
            title: t('3459'),
            id: 'Mon8',
            kind: 'Number',
            readonly: false,
            width: 140,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },
        {
            title: t('3465'),
            id: 'Mon9',
            kind: 'Number',
            readonly: false,
            width: 140,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },
        {
            title: t('34926'),
            id: 'Q3',
            kind: 'Number',
            readonly: false,
            width: 140,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },

        {
            title: t('3338'),
            id: 'Mon10',
            kind: 'Number',
            readonly: false,
            width: 140,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },
        {
            title: t('3347'),
            id: 'Mon11',
            kind: 'Number',
            readonly: false,
            width: 140,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },
        {
            title: t('3355'),
            id: 'Mon12',
            kind: 'Number',
            readonly: false,
            width: 140,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },
        {
            title: t('11579'),
            id: 'Q4',
            kind: 'Number',
            readonly: false,
            width: 140,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },
        {
            title: t('82'),
            id: 'H2',
            kind: 'Number',
            readonly: false,
            width: 140,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
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

    const [formData, setFormData] = useState(dayjs().year(currentYear).month(currentMonth).startOf('month'));
    const [toDate, setToDate] = useState(dayjs().year(currentYear).month(currentMonth).endOf('month'));
    const [PrevFrAccYM, setPrevFrAccYM] = useState(dayjs().subtract(1, 'year').month(0).startOf('month'));
    const [PrevToAccYM, setPrevToAccYM] = useState(dayjs().subtract(1, 'year').month(currentMonth).endOf('month'));
    const [IsDisplayZero, setIsDisplayZero] = useState(true)

    const [FormatSeq, setFormatSeq] = useState(null)
    const [displayLevels, setDisplayLevels] = useState(4)
    const [AccUnit, setAccUnit] = useState(null)
    const [searchText, setSearchText] = useState('')
    const [searchText1, setSearchText1] = useState([])
    const [itemText, setItemText] = useState([])
    const [itemText1, setItemText1] = useState([])
    const [dataSearch, setDataSearch] = useState([])
    const [dataSearch1, setDataSearch1] = useState([])
    const [dataSheetSearch, setDataSheetSearch] = useState([])
    const [UMEmpType, setUMEmpType] = useState(null)
    const formatDate = (date) => date.format('YYYYMM')
    const [modal2Open, setModal2Open] = useState(false)
    const [errorData, setErrorData] = useState(null)
    const [keyItem2, setKeyItem2] = useState('')
    const [keyItem3, setKeyItem3] = useState('')
    const [cols, setCols] = useState(() =>
        loadFromLocalStorageSheet(
            'monthly_profit_loss_a',
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
        if (!formData) {
            HandleError([
                {
                    success: false,
                    message: ` ${t('10431')}: [${t('28791')}]`,
                },
            ]);
            return;
        }
        const searchParams = Array.from({ length: displayLevels }, (_, index) => {
            const level = index + 1;

            return {
                AccUnit: AccUnit ? AccUnit : '',
                FormatSeq: FormatSeq ? FormatSeq : '',
                AccYear: formData ? formatDate(dayjs(formData)) : '',
                DisplayLevel: level ? level : '',
                IsDisplayZero: IsDisplayZero,
                DisplayLevelDetail: [
                    {
                        level: level,
                        order: level,
                    },
                ],
            };
        });

        fetchGenericData({
            controllerKey: 'FSQueryTermByMonthQ',
            postFunction: FSQueryTermByMonthQ,
            searchParams,
            defaultCols: defaultCols,
            useEmptyData: false,
            afterFetch: (data) => {
                setGridData(data);
                setNumRows(data.length);
            },
        });
    }, [formData, FormatSeq, displayLevels, AccUnit, defaultCols, IsDisplayZero]);



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
                GetCodeHelpVer2(
                    40030,
                    '',
                    '40030',
                    '11',
                    '6',
                    '',
                    '1',
                    '',
                    1,
                    '',
                    0,
                    0,
                    0,
                ),
            ]);
            setHelpData01(res1.status === 'fulfilled' ? res1.value?.data || [] : []);
            setHelpData02(res2.status === 'fulfilled' ? res2.value?.data || [] : []);
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
                <title>{t('10041168')}</title>
            </Helmet>
            <TopLoadingBar color="blue" height={2} ref={loadingBarRef} />
            <div className="bg-slate-50 h-[calc(100vh-35px)] overflow-hidden">
                <div className="flex flex-col  h-full">
                    <div className="col-start-1 col-end-5 row-start-1 w-full  ">
                        <div className="flex p-2 items-end justify-end">
                            <MonthlyProfitLossAction
                                handleSearchData={handleSearchData}
                            />
                        </div>
                        <details
                            className="group p-2 [&_summary::-webkit-details-marker]:hidden border-t border-b bg-white"
                            open
                        >
                            <summary className="flex cursor-pointer items-center justify-between gap-1.5 text-gray-900">
                                <h2 className="text-[10px] font-medium flex items-center gap-2  uppercase" >
                                    <FilterOutlined />
                                    {t('359')}
                                </h2>
                            </summary>
                            <MnthlyProfitLossQuery
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
                                PrevFrAccYM={PrevFrAccYM}
                                PrevToAccYM={PrevToAccYM}
                                setPrevFrAccYM={setPrevFrAccYM}
                                setPrevToAccYM={setPrevToAccYM}
                                setFormatSeq={setFormatSeq}
                                setDisplayLevels={setDisplayLevels}
                                setAccUnit={setAccUnit}
                                IsDisplayZero={IsDisplayZero}
                                setIsDisplayZero={setIsDisplayZero}

                            />
                        </details>
                    </div>

                    <div className="col-start-1 col-end-5 row-start-2 w-full h-full ">
                        <MnthlyProfitLossTable
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
