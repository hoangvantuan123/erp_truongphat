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
import { GetCodeHelpVer3 } from '../../../../features/codeHelp/getCodeHelpVer3'
import AcctBalanceAction from '../../../components/actions/report/acct/acctBalanceAction'
import AcctBalanceQuery from '../../../components/query/report/acct/AcctBalanceQuery'
import AcctBalanceTable from '../../../components/table/report/acct/acctBalanceTable'
import { SACLedgerQueryAccBalanceQ } from '../../../../features/report/acct/SACLedgerQueryAccBalanceQ'
import CryptoJS from 'crypto-js'
import { encodeBase64Url } from '../../../../utils/decode-JWT'
export default function AcctBalance({ permissions, isMobile, canCreate, canEdit, canDelete, controllers,
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
            title: t('2174'),
            id: 'AccNo',
            kind: 'Text',
            readonly: false,
            width: 100,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },
        {
            title: t('8'),
            id: 'AccName',
            kind: 'Text',
            readonly: false,
            width: 550,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },
        {
            title: t('16472'),
            id: 'ForwardDrAmt',
            kind: 'Text',
            readonly: false,
            width: 160,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },
        {
            title: t('37'),
            id: 'DrAmt',
            kind: 'Text',
            readonly: false,
            width: 160,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },
        {
            title: t('45'),
            id: 'CrAmt',
            kind: 'Text',
            readonly: false,
            width: 160,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },
        {
            title: t('1987'),
            id: 'RemainAmt',
            kind: 'Text',
            readonly: false,
            width: 160,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },
        {
            title: t('11949'),
            id: 'AccNameOrg',
            kind: 'Text',
            readonly: false,
            width: 200,
            hasMenu: true,
            visible: false,
            trailingRowOptions: { disabled: true },
        },
        {
            title: t('2882'),
            id: 'RemName',
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

    const [formData, setFormData] = useState(dayjs().startOf('month'));
    const [toDate, setToDate] = useState(dayjs());


    const [AccUnit, setAccUnit] = useState('')
    const [UMCostType, setUMCostType] = useState('')
    const formatDate = (date) => date.format('YYYYMMDD')
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
    const [cols, setCols] = useState(() =>
        loadFromLocalStorageSheet(
            'acct_balance_a',
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
            AccDate: from,
            AccDateTo: to,

            FSDomainSeq: '',
            AccUnit: AccUnit ? AccUnit : '',
            SlipUnit: dataSearch?.Value ? dataSearch?.Value : '',
            AccSeqFr: dataSearch3?.AccSeq ? dataSearch3?.AccSeq : '',
            AccSeqTo: dataSearch4?.AccSeq ? dataSearch4?.AccSeq : '',
            UMCostType: UMCostType ? UMCostType : '',
            LinkCreateID: '',
            SMAccStd: 1,
            WorkingTag: '',
            LanguageSeq: langCode,

        }];

        fetchGenericData({
            controllerKey: 'SACLedgerQueryAccBalanceQ',
            postFunction: SACLedgerQueryAccBalanceQ,
            searchParams,
            defaultCols: defaultCols,
            useEmptyData: false,
            afterFetch: (data) => {
                setGridData(data || []);
                setNumRows(data?.length + 1 || 0);
            },
        });
    }, [
        formData,
        toDate,
        langCode,
        AccUnit,
        dataSearch,

        dataSearch3,
        dataSearch4,
        UMCostType

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
                GetCodeHelpVer3(langCode, 40001, '', '', '', '', '', '', 1, 0, '', 0, 0, 0, signal),
                GetCodeHelpVer3(langCode, 40095, '', '20250725', '', '', '', '', 1, 0, '', 0, 0, 0, signal),
                GetCodeHelpVer3(langCode, 40002, '', '', '', '', '', '', 1, 0, '', 0, 0, 0, signal),
                GetCodeHelpComboVer2('', langCode, 19999, 1, '%', '4001', '', '', '', signal),


            ]);
            setHelpData01(res1.status === 'fulfilled' ? res1.value?.data || [] : []);
            setHelpData02(res2.status === 'fulfilled' ? res2.value?.data || [] : []);
            setHelpData03(res3.status === 'fulfilled' ? res3.value?.data || [] : []);
            setHelpData04(res4.status === 'fulfilled' ? res4.value?.data || [] : []);
            setHelpData05(res5.status === 'fulfilled' ? res5.value?.data || [] : []);
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



    const getSelectedRowsData = () => {
        const selectedRows = selection.rows.items

        return selectedRows.flatMap(([start, end]) =>
            Array.from({ length: end - start }, (_, i) => gridData[start + i]).filter(
                (row) => row !== undefined,
            ),
        )
    }

    const AcctDetailedBalanceListNextPage = useCallback(() => {
        const selected = getSelectedRowsData();
        if (!selected?.length) return;
        const from = formData ? formatDate(formData) : '';
        const to = toDate ? formatDate(toDate) : '';

        const filteredData = {
            AccSeq: selected[0].AccSeq,
            AccName: selected[0].AccName,
            AccNo: selected[0].AccNo,
            AccUnit: AccUnit ? AccUnit : '',
            AccDate: from,
            AccDateTo: to,
            SlipUnit: dataSearch?.Value ? dataSearch?.Value : '',
            UMCostType: UMCostType ? UMCostType : '',
        };

        const encryptedData = CryptoJS.AES.encrypt(
            JSON.stringify(filteredData),
            'KEY_PATH_ITMV'
        ).toString();

        const encryptedToken = encodeBase64Url(encryptedData);
        const route = `/u/executive_report/acct_report/acct_detailed_balance_list/${encryptedToken}`;

        window.open(route, '_blank');

        localStorage.setItem('COLLAPSED_STATE', JSON.stringify(true));
    }, [gridData, userFrom, selection, AccUnit, formData, toDate, dataSearch, UMCostType]);
    const AccRemBalanceLedgerNextPage = useCallback(() => {
        const selected = getSelectedRowsData();
        if (!selected?.length) return;
        const from = formData ? formatDate(formData) : '';
        const to = toDate ? formatDate(toDate) : '';
        console.log('selected', selected)
        const filteredData = {
            AccSeq: selected[0].AccSeq,
            AccName: selected[0].AccName,
            AccNo: selected[0].AccNo,
            RemSeq: selected[0].RemSeq,
            RemName: selected[0].RemName,
            AccUnit: AccUnit ? AccUnit : '',
            AccDate: from,
            AccDateTo: to,
            SlipUnit: dataSearch?.Value ? dataSearch?.Value : '',
            UMCostType: UMCostType ? UMCostType : '',
        };

        const encryptedData = CryptoJS.AES.encrypt(
            JSON.stringify(filteredData),
            'KEY_PATH_ITMV'
        ).toString();

        const encryptedToken = encodeBase64Url(encryptedData);
        const route = `/u/executive_report/acct_report/acct_rem_balance_ledger/${encryptedToken}`;

        window.open(route, '_blank');

        localStorage.setItem('COLLAPSED_STATE', JSON.stringify(true));
    }, [gridData, userFrom, selection, AccUnit, formData, toDate, dataSearch, UMCostType]);

    return (
        <>
            <Helmet>
                <title>{t('800001010')}</title>
            </Helmet>
            <TopLoadingBar color="blue" height={2} ref={loadingBarRef} />
            <div className="bg-slate-50 h-[calc(100vh-35px)] overflow-hidden">
                <div className="flex flex-col  h-full">
                    <div className="col-start-1 col-end-5 row-start-1 w-full  ">
                        <div className="flex p-2 items-end justify-end">
                            <AcctBalanceAction
                                handleSearchData={handleSearchData}
                                AcctDetailedBalanceListNextPage={AcctDetailedBalanceListNextPage}
                                AccRemBalanceLedgerNextPage={AccRemBalanceLedgerNextPage}
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
                            <AcctBalanceQuery
                                formData={formData}
                                setFormData={setFormData}
                                toDate={toDate}
                                setToDate={setToDate}
                                AccUnit={AccUnit}
                                setAccUnit={setAccUnit}
                                helpData01={helpData01}

                                helpData02={helpData02}
                                setSearchText={setSearchText}
                                searchText={searchText}
                                setDataSearch={setDataSearch}
                                setItemText={setItemText}
                                dataSearch={dataSearch}


                                helpData03={helpData03}
                                setDataSearch2={setDataSearch2}
                                setSearchText2={setSearchText2}
                                searchText2={searchText2}
                                setItemText2={setItemText2}
                                dataSearch2={dataSearch2}

                                helpData04={helpData04}
                                setDataSearch3={setDataSearch3}
                                setSearchText3={setSearchText3}
                                searchText3={searchText3}
                                setItemText3={setItemText3}
                                dataSearch3={dataSearch3}


                                setDataSearch4={setDataSearch4}
                                setSearchText4={setSearchText4}
                                searchText4={searchText4}
                                setItemText4={setItemText4}
                                dataSearch4={dataSearch4}


                                helpData05={helpData05}
                                UMCostType={UMCostType}
                                setUMCostType={setUMCostType}
                            />
                        </details>
                    </div>

                    <div className="col-start-1 col-end-5 row-start-2 w-full h-full ">

                        <Splitter layout="vertical" className="h-full min-h-0 flex flex-col">
                            <Splitter.Panel defaultSize="55%" min="20%" max="70%" className="h-full min-h-0 flex flex-col">
                                <AcctBalanceTable
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

                        </Splitter>


                    </div>
                </div>
            </div>
        </>
    )
}
