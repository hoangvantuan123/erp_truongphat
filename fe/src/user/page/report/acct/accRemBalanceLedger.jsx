import { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet'
import { Input, Space, Table, Typography, message, Splitter, notification } from 'antd'
const { Title, Text } = Typography
import { debounce } from 'lodash'
import {
    useNavigate, useParams, createBrowserRouter,
    RouterProvider,
} from 'react-router-dom'
import { FilterOutlined } from '@ant-design/icons'
import { CompactSelection, GridColumnIcon } from '@glideapps/glide-data-grid'
import { loadFromLocalStorageSheet } from '../../../../localStorage/sheet/sheet'
import { onRowAppended } from '../../../components/sheet/js/onRowAppended'
import { generateEmptyData } from '../../../components/sheet/js/generateEmptyData'
import TopLoadingBar from 'react-top-loading-bar';
import { togglePageInteraction } from '../../../../utils/togglePageInteraction'
import { updateIndexNo } from '../../../components/sheet/js/updateIndexNo'
import dayjs from 'dayjs'
import CryptoJS from 'crypto-js'
import { HandleError } from '../../default/handleError'
import { GetCodeHelpComboVer2 } from '../../../../features/codeHelp/getCodeHelpComboVer2'
import { GetCodeHelpVer3 } from '../../../../features/codeHelp/getCodeHelpVer3'
import { SACLedgerQueryAccRemBalanceQ } from '../../../../features/report/acct/SACLedgerQueryAccRemBalanceQ'
import AccRemBalanceLedgerAction from '../../../components/actions/report/acct/accRemBalanceLedgerAction'
import AccRemBalanceLedgerQuery from '../../../components/query/report/acct/accRemBalanceLedgerQuery'
import AccRemBalanceLedgerTable from '../../../components/table/report/acct/accRemBalanceLedgerTable'
export default function AccRemBalanceLedger({ permissions, isMobile, canCreate, canEdit, canDelete, controllers,
    cancelAllRequests }) {
    const userFrom = JSON.parse(localStorage.getItem('userInfo'))
    const loadingBarRef = useRef(null);
    const activeFetchCountRef = useRef(0);
    const langCode = localStorage.getItem('language') || '6';
    const secretKey = 'KEY_PATH_ITMV'
    const { seq } = useParams()
    const { t } = useTranslation()
    const defaultCols = useMemo(() => [
        { title: '', id: 'Status', kind: 'Text', readonly: true, width: 50, hasMenu: true, visible: true, themeOverride: { textDark: "#225588", baseFontStyle: "600 13px" }, icon: GridColumnIcon.HeaderLookup },
        { title: t('291'), id: 'RemValue', kind: 'Text', readonly: false, width: 500, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
        { title: t('12179'), id: 'RemRefValue', kind: 'Text', readonly: false, width: 500, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
        { title: t('16472'), id: 'ForwardDrAmt', kind: 'Text', readonly: false, width: 200, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
        { title: t('37'), id: 'DrAmt', kind: 'Text', readonly: false, width: 100, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
        { title: t('45'), id: 'CrAmt', kind: 'Text', readonly: false, width: 100, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
        { title: t('1987'), id: 'RemainAmt', kind: 'Text', readonly: false, width: 100, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
    ], [t]);



    const [menus, setMenus] = useState([])
    const [gridData, setGridData] = useState([])
    const [selection, setSelection] = useState({
        columns: CompactSelection.empty(),
        rows: CompactSelection.empty()
    })
    const [showSearch, setShowSearch] = useState(false)
    const [showSearchB, setShowSearchB] = useState(false)
    const [addedRows, setAddedRows] = useState([])
    const [numRowsToAdd, setNumRowsToAdd] = useState(null)
    const [numRows, setNumRows] = useState(0)
    const [numRowsB, setNumRowsB] = useState(0)
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
    const [searchText5, setSearchText5] = useState('')

    const [itemText, setItemText] = useState([])
    const [itemText1, setItemText1] = useState([])
    const [itemText2, setItemText2] = useState([])
    const [itemText3, setItemText3] = useState([])
    const [itemText4, setItemText4] = useState([])
    const [itemText5, setItemText5] = useState([])
    const [dataSearch, setDataSearch] = useState([])
    const [dataSearch1, setDataSearch1] = useState([])
    const [dataSearch2, setDataSearch2] = useState([])
    const [dataSearch3, setDataSearch3] = useState([])
    const [dataSearch4, setDataSearch4] = useState([])
    const [dataSearch5, setDataSearch5] = useState([])
    const [cols, setCols] = useState(() =>
        loadFromLocalStorageSheet(
            'acct_detailed_balance_list_a_a',
            defaultCols.filter((col) => col.visible)
        )
    )
    const resetTable = () => {
        setSelection({
            columns: CompactSelection.empty(),
            rows: CompactSelection.empty()
        })
    }
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
            AccUnit: AccUnit ? AccUnit : '',
            AccDate: from,
            AccDateTo: to,
            CurrSeq: dataSearch?.CurrSeq ? dataSearch?.CurrSeq : '',
            AccSeq: dataSearch3?.AccSeq ? dataSearch3?.AccSeq : '',
            UMCostType: UMCostType ? UMCostType : '',
            SlipUnit: dataSearch4?.Value ? dataSearch4?.Value : '',
            RemSeq: dataSearch5?.RemSeq ? dataSearch5?.RemSeq : '',
            RemValSeq: '',
            FSDomainSeq: '',
            SMAccStd: 1,
            WorkingTag: '',
            LanguageSeq: langCode,

        }];

        fetchGenericData({
            controllerKey: 'SACLedgerQueryAccRemBalanceQ',
            postFunction: SACLedgerQueryAccRemBalanceQ,
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
        UMCostType,
        dataSearch5

    ]);
    useEffect(() => {
        if (!seq) return;

        const decrypted = decryptData(seq);
        if (!decrypted?.AccSeq) return;

        const {
            AccUnit = '',
            AccDate = '',
            AccDateTo = '',
            AccSeq = '',
            AccName = '',
            AccNo = '',
            UMCostType = '',
            RemSeq = '',
            RemName = '',
            Value: SlipUnit = '',
        } = decrypted;
        setAccUnit(AccUnit)
        setFormData(dayjs(AccDate, 'YYYYMMDD'));
        setToDate(dayjs(AccDateTo, 'YYYYMMDD'));
        setDataSearch3(decrypted)
        setSearchText3(AccName)
        setSearchText5(RemName)
        setDataSearch5(decrypted)
        const searchParams = [{
            AccUnit,
            AccDate,
            AccDateTo,
            CurrSeq: '',
            AccSeq,
            UMCostType,
            SlipUnit,
            RemSeq,
            RemValSeq: '',
            FSDomainSeq: '',
            SMAccStd: 1,
            WorkingTag: '',
            LanguageSeq: langCode,
        }];

        fetchGenericData({
            controllerKey: 'SACLedgerQueryAccRemBalanceQ',
            postFunction: SACLedgerQueryAccRemBalanceQ,
            searchParams,
            defaultCols,
            useEmptyData: false,
            afterFetch: (data) => {
                setGridData(data || []);
                setNumRows(data?.length + 1 || 0);
            },
        });


    }, [seq, langCode]);


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
                GetCodeHelpComboVer2('', langCode, 10005, 1, '%', '', '', '', '', signal),
                GetCodeHelpVer3(langCode, 40002, '', '', '', '', '', '', 1, 0, '', 0, 0, 0, signal),
                GetCodeHelpComboVer2('', langCode, 19999, 1, '%', '4001', '', '', '', signal),
                GetCodeHelpVer3(langCode, 40001, '', '', '', '', '', '', 1, 0, '', 0, 0, 0, signal),
                GetCodeHelpComboVer2('', langCode, 40003, 1, '%', '', 'enCodeHelp', '', '', signal),
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
                <title>{t('10041896')}</title>
            </Helmet>
            <TopLoadingBar color="blue" height={2} ref={loadingBarRef} />
            <div className="bg-slate-50 h-[calc(100vh-35px)] overflow-hidden">
                <div className="flex flex-col  h-full">
                    <div className="col-start-1 col-end-5 row-start-1 w-full  ">
                        <div className="flex p-2 items-end justify-end">
                            <AccRemBalanceLedgerAction
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
                            <AccRemBalanceLedgerQuery
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

                                helpData06={helpData06}
                                setSearchText5={setSearchText5}
                                setItemText5={setItemText5}
                                setDataSearch5={setDataSearch5}
                                searchText5={searchText5}
                                dataSearch5={dataSearch5}
                            />
                        </details>
                    </div>

                    <div className="col-start-1 col-end-5 row-start-2 w-full h-full ">
                        <AccRemBalanceLedgerTable
                            setSelection={setSelection}
                            selection={selection}
                            showSearch={showSearch}
                            setShowSearch={setShowSearch}
                            numRows={numRows}
                            setGridData={setGridData}
                            gridData={gridData}
                            setNumRows={setNumRows}
                            setCols={setCols}
                            cols={cols}
                            defaultCols={defaultCols}
                            canEdit={canEdit}
                            canCreate={canCreate}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}
