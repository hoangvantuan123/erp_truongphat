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
import { FinQueryCmpQ } from '../../../../features/report/execFin/FinQueryCmpQ'
import FinQueryCmAction from '../../../components/actions/report/execFin/finQueryCmAction'
import FinQueryCmQuery from '../../../components/query/report/execFin/FinQueryCmQuery'
import FinQueryCmTable from '../../../components/table/report/execFin/FinQueryCmTable'
import { GetCodeHelpComboVer2 } from '../../../../features/codeHelp/getCodeHelpComboVer2'
import { GetCodeHelpCombo } from '../../../../features/codeHelp/getCodeHelpCombo'
import { GetCodeHelpVer2 } from '../../../../features/codeHelp/getCodeHelpVer2'
export default function FinQueryCm({ permissions, isMobile, canCreate, canEdit, canDelete, controllers,
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

        // ===== Group: Chỉ tiêu kỳ =====
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
            title: t('12822'),
            id: 'ThisTermAmt',
            kind: 'Text',
            readonly: false,
            width: 230,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },

        },
        {
            title: t('12814'),
            id: 'ThisTermItemAmt',
            kind: 'Text',
            readonly: false,
            width: 230,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },

        },
        {
            title: t('28200'),
            id: 'PrevTermItemAmt',
            kind: 'Text',
            readonly: false,
            width: 220,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },

        },
        {
            title: t('17119'),
            id: 'PrevTermAmt',
            kind: 'Text',
            readonly: false,
            width: 230,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },

        },

        // ===== Group: Loại chỉ tiêu =====
        {
            title: t('11944'),
            id: 'FSItemName',
            kind: 'Text',
            readonly: false,
            width: 330,
            hasMenu: true,
            visible: false,
            trailingRowOptions: { disabled: true },

        },
        {
            title: t('2003'),
            id: 'FSItemTypeName',
            kind: 'Text',
            readonly: false,
            width: 230,
            hasMenu: true,
            visible: false,
            trailingRowOptions: { disabled: true },

        },
        {
            title: t('28751'),
            id: 'SMFormulaCalcKindName',
            kind: 'Text',
            readonly: false,
            width: 230,
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

    const [formData, setFormData] = useState(dayjs().year(currentYear).month(0).startOf('month'));
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
            'er_biz_a',
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
        const searchParams = Array.from({ length: displayLevels }, (_, index) => {
            const level = index + 1;

            return {
                AccUnit: AccUnit ? AccUnit : '',
                FormatSeq: FormatSeq ? FormatSeq : '',
                FrAccYM: formData ? formatDate(dayjs(formData)) : '',
                ToAccYM: toDate ? formatDate(dayjs(toDate)) : '',
                PrevFrAccYM: PrevFrAccYM ? formatDate(dayjs(PrevFrAccYM)) : '',
                PrevToAccYM: PrevToAccYM ? formatDate(dayjs(PrevToAccYM)) : '',
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
            controllerKey: 'FinQueryCmpQ',
            postFunction: FinQueryCmpQ,
            searchParams,
            defaultCols: defaultCols,
            useEmptyData: false,
            afterFetch: (data) => {
                setGridData(data);
                setNumRows(data.length);
            },
        });
    }, [formData, toDate, PrevFrAccYM, PrevToAccYM, FormatSeq, displayLevels, AccUnit, defaultCols, IsDisplayZero]);



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
                <title>{t('800000188')}</title>
            </Helmet>
            <TopLoadingBar color="blue" height={2} ref={loadingBarRef} />
            <div className="bg-slate-50 h-[calc(100vh-35px)] overflow-hidden">
                <div className="flex flex-col  h-full">
                    <div className="col-start-1 col-end-5 row-start-1 w-full  ">
                        <div className="flex p-2 items-end justify-end">
                            <FinQueryCmAction
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
                            <FinQueryCmQuery
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
                        <FinQueryCmTable
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
