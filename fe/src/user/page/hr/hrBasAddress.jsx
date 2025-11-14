import { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet'
import { Input, Space, Table, Typography, message, Tabs, notification } from 'antd'
const { Title, Text } = Typography
import { debounce } from 'lodash'
import { FilterOutlined } from '@ant-design/icons'
import { CompactSelection, GridColumnIcon } from '@glideapps/glide-data-grid'
import useKeydownHandler from '../../components/hooks/sheet/useKeydownHandler'
import { loadFromLocalStorageSheet } from '../../../localStorage/sheet/sheet'
import { onRowAppended } from '../../components/sheet/js/onRowAppended'
import { generateEmptyData } from '../../components/sheet/js/generateEmptyData'
import TopLoadingBar from 'react-top-loading-bar';
import { togglePageInteraction } from '../../../utils/togglePageInteraction'
import { filterValidRows } from '../../../utils/filterUorA'
import { updateIndexNo } from '../../components/sheet/js/updateIndexNo'

import { GetCodeHelpVer2 } from '../../../features/codeHelp/getCodeHelpVer2'
import { GetCodeHelpCombo } from '../../../features/codeHelp/getCodeHelpCombo'
import HrBasAddressTable from '../../components/table/hr/hrBasAddressTable'
import HrBasAddressQuery from '../../components/query/hr/hrBasAddressQuery'
import HrBasAddressAction from '../../components/actions/hr/hrBasAddressAction'

import { PostUHrBasAddress } from '../../../features/hr/hrBasAddress/postUHrBasAddress'
import { PostAHrBasAddress } from '../../../features/hr/hrBasAddress/postAHrBasAddress'
import { PostDHrBasAddress } from '../../../features/hr/hrBasAddress/postDHrBasAddress'
import { PostQHrBasAddress } from '../../../features/hr/hrBasAddress/postQHrBasAddress'
import ErrorListModal from '../default/errorListModal'
import { HandleError } from '../default/handleError'
export default function HrBasAddress({ permissions, isMobile, canCreate, canEdit, canDelete, controllers,
    cancelAllRequests }) {
    const userFrom = JSON.parse(localStorage.getItem('userInfo'))
    const loadingBarRef = useRef(null);
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
            icon: GridColumnIcon.HeaderLookup
        },
        {
            title: t('4'),
            id: 'EmpName',
            kind: 'Text',
            readonly: false,
            width: 220,
            hasMenu: true,
            visible: true,
            themeOverride: {
                textHeader: '#DD1144',
                bgIconHeader: '#DD1144',
                fontFamily: '',
            },
            trailingRowOptions: { disabled: true },
        },
        {
            title: t('1452'),
            id: 'EmpID',
            kind: 'Text',
            readonly: false,
            width: 150,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },
        {
            title: t('17028'),
            id: 'EntRetTypeName',
            kind: 'Text',
            readonly: false,
            width: 200,
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
            title: t('1360'),
            id: 'SMBirthTypeName',
            kind: 'Text',
            readonly: false,
            width: 280,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },

        {
            title: t('1797'),
            id: 'ZipNo',
            kind: 'Text',
            readonly: false,
            width: 100,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },
        {
            title: t('2409'),
            id: 'Addr',
            kind: 'Text',
            readonly: false,
            width: 300,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },
        {
            title: t('2410'),
            id: 'Addr2',
            kind: 'Text',
            readonly: false,
            width: 300,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },
        {
            title: t('2406'),
            id: 'AddrEng1',
            kind: 'Text',
            readonly: false,
            width: 250,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },
        {
            title: t('2407'),
            id: 'AddrEng2',
            kind: 'Text',
            readonly: false,
            width: 250,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },

    ], []);

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
    const [clickCount, setClickCount] = useState(false)
    const [openHelp, setOpenHelp] = useState(false)
    const [isCellSelected, setIsCellSelected] = useState(false)
    const [onSelectRow, setOnSelectRow] = useState([])
    const [dataRootMenu, setDataRootMenu] = useState([])
    const [dataSubMenu, setDataSubMenu] = useState([])
    const [helpData01, setHelpData01] = useState([])
    const [helpData02, setHelpData02] = useState([])




    const [helpData03, setHelpData03] = useState([])
    const [helpData04, setHelpData04] = useState([])
    const [helpData05, setHelpData05] = useState([])
    const [helpData06, setHelpData06] = useState([])
    const [helpData07, setHelpData07] = useState([])
    const [helpData08, setHelpData08] = useState([])
    const [helpData09, setHelpData09] = useState([])

    const [searchText, setSearchText] = useState('')
    const [searchText1, setSearchText1] = useState('')
    const [itemText, setItemText] = useState([])
    const [itemText1, setItemText1] = useState([])
    const [dataSearch, setDataSearch] = useState([])
    const [dataSearch1, setDataSearch1] = useState([])
    const [dataSheetSearch, setDataSheetSearch] = useState([])
    const [dataSheetSearch1, setDataSheetSearch1] = useState([])
    const [UMRelSeq, setUMRelSeq] = useState('')
    const [modal2Open, setModal2Open] = useState(false)
    const [errorData, setErrorData] = useState(null)
    const [SMAddressType, setSMAddressType] = useState(null)
    const [QAddress, setQAddress] = useState(null)
    const [cols, setCols] = useState(() =>
        loadFromLocalStorageSheet(
            'hr_bas_address_a',
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
        const emptyData = generateEmptyData(100, defaultCols)
        const updatedData = updateIndexNo(emptyData)
        setGridData(updatedData)
        setNumRows(updatedData.length)
    }, [defaultCols])

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

    const fetchGenericData = async ({
        controllerKey,
        postFunction,
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
            if (!response.success) {
                HandleError([
                    {
                        success: false,
                        message: response.message || 'Đã xảy ra lỗi vui lòng thử lại!',
                    },
                ]);
            }
            const emptyData = updateIndexNo(generateEmptyData(100, defaultCols));

            const data = response.success ? (response.data || []) : [];
            const mergedData = updateIndexNo([...data, ...emptyData]);

            await afterFetch(mergedData);
        } catch (error) {
            const emptyData = updateIndexNo(generateEmptyData(100, defaultCols));
            await afterFetch(emptyData);
        } finally {
            decreaseFetchCount();
            controllers.current[controllerKey] = null;
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

        try {

            const [help01, help02, help03, help04] = await Promise.all([
                GetCodeHelpCombo(
                    '',
                    6,
                    19999,
                    1,
                    '%',
                    '3059',
                    '1001',
                    '3053001,3053002',
                    '',
                    signal
                ),
                GetCodeHelpVer2(10009, '', '', '', '', '', '', 1, 0, '', 0, 0, 0, signal),
                GetCodeHelpCombo(
                    '',
                    6,
                    19998,
                    1,
                    '%',
                    '3055',
                    '',
                    '',
                    '',
                    signal
                ),

                GetCodeHelpVer2(10010, '', '', '', '', '', '', 1, 0, '', 0, 0, 0, signal),
            ]);
            setHelpData01(help01.data)
            setHelpData02(help02.data)
            setHelpData03(help03.data)
            setHelpData04(help04.data)
        } catch {
            setHelpData01([])
            setHelpData02([])
            setHelpData03([])
            setHelpData04([])
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

    const handleSearchData = useCallback(async () => {


        const searchParams = {
            EmpSeq: dataSearch?.EmpSeq || '',
            DeptSeq: dataSearch1?.BeDeptSeq || dataSearch1?.DeptSeq || '',
            EntRetTypeSeq: '',
            EntRetTypeName: '',
            SMAddressType: SMAddressType,
            QAddress: QAddress,
            QBegDate: '',
            QEndDate: '',

        }
        fetchGenericData({
            controllerKey: 'PostQHrBasAddress',
            postFunction: PostQHrBasAddress,
            searchParams,
            useEmptyData: true,
            afterFetch: (data) => {
                setGridData(data);
                setNumRows(data.length);
            },
        });


    }, [dataSearch, dataSearch1, QAddress, SMAddressType])




    const getSelectedRows = () => {
        const selectedRows = selection.rows.items
        let rows = []
        selectedRows.forEach((range) => {
            const start = range[0]
            const end = range[1] - 1

            for (let i = start; i <= end; i++) {
                if (gridData[i]) {
                    rows.push(gridData[i])
                }
            }
        })

        return rows
    }

    const handleRowAppend = useCallback(
        (numRowsToAdd) => {
            if (canCreate === false) {
                message.warning('Bạn không có quyền thêm dữ liệu')
                return
            }
            onRowAppended(cols, setGridData, setNumRows, setAddedRows, numRowsToAdd)
        },
        [cols, setGridData, setNumRows, setAddedRows, numRowsToAdd]
    )




    const handleDeleteDataSheet = useCallback(
        (e) => {
            if (canDelete === false) {
                return;
            }

            const selectedRows = getSelectedRows();

            const rowsWithStatusD = selectedRows
                .filter((row) => !row.Status || row.Status === 'U' || row.Status === 'D')
                .map((row) => {
                    row.Status = 'D';
                    return {
                        IdxNo: row.IdxNo,
                        AddressSeq: row.AddressSeq,
                        EmpSeq: row.EmpSeq,
                        DispSeq: row.DispSeq,
                        SMAddressType: row.SMAddressType,
                        BegDate: row.BegDate,
                        EndDate: row.EndDate,
                        ZipNo: row.ZipNo,
                        AddrSeq: row.AddrSeq,
                        Addr: row.Addr,
                        Addr2: row.Addr2,
                        AddrEng1: row.AddrEng1,
                        AddrEng2: row.AddrEng2,

                    };
                });

            const rowsWithStatusA = selectedRows.filter((row) => row.Status === 'A');


            if (rowsWithStatusD.length > 0) {

                PostDHrBasAddress(rowsWithStatusD)
                    .then((response) => {
                        if (response.success) {
                            const deletedIds = rowsWithStatusD.map((item) => item.IdxNo);
                            const updatedData = gridData.filter((row) => !deletedIds.includes(row.IdxNo));
                            setGridData(updateIndexNo(updatedData));
                            setNumRows(updatedData.length);
                            resetTable();
                        } else {
                            setModal2Open(true);
                            setErrorData(response?.errors || []);
                        }
                    })
                    .catch((error) => {
                        message.error('Có lỗi xảy ra khi xóa!');
                    });
            }

            if (rowsWithStatusA.length > 0) {
                const idsWithStatusA = rowsWithStatusA.map((row) => row.Id);
                const remainingRows = gridData.filter((row) => !idsWithStatusA.includes(row.Id));
                setGridData(updateIndexNo(remainingRows));
                setNumRows(remainingRows.length);
                resetTable();
            }
        },
        [gridData, selection, editedRows]
    );


    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
                e.preventDefault()
                setShowSearch(true)
            }
        }
        document.addEventListener('keydown', handleKeyDown)
        return () => {
            document.removeEventListener('keydown', handleKeyDown)
        }
    }, [])

    /* HOOKS KEY */
    useKeydownHandler(isCellSelected, setOpenHelp)




    const handleSaveData = useCallback(async () => {
        if (!canCreate) return true;

        const resulA = filterValidRows(gridData, 'A').map(item => ({
            ...item,
        }));
        const resulU = filterValidRows(gridData, 'U').map(item => ({
            ...item,
        }));
        const requiredFields = [
            { key: 'EmpID', label: t('1452') },
        ];
        const validateRequiredFields = (data, fields) =>
            data.flatMap((row, i) =>
                fields
                    .filter(({ key }) => !row[key]?.toString().trim())
                    .map(({ key, label }) => ({
                        IDX_NO: i + 1,
                        field: key,
                        Name: label,
                        result: `${label} không được để trống`,
                    }))
            );
        const errors = [
            ...validateRequiredFields(resulA, requiredFields),
            ...validateRequiredFields(resulU, requiredFields),
        ];

        if (errors.length > 0) {
            setModal2Open(true);
            setErrorData(errors);
            return;
        }
        if (resulA.length === 0 && resulU.length === 0) {
            togglePageInteraction(false);
            loadingBarRef.current?.complete();
            return true;
        }

        togglePageInteraction(true);
        loadingBarRef.current?.continuousStart();

        try {
            const apiCalls = [];
            if (resulA.length > 0) apiCalls.push(PostAHrBasAddress(resulA));
            if (resulU.length > 0) apiCalls.push(PostUHrBasAddress(resulU));

            const results = await Promise.all(apiCalls);

            const isSuccess = results.every(result => result?.success);
            if (!isSuccess) {
                const errorItems = results.flatMap(result => result?.errors || []);
                setModal2Open(true);
                setErrorData(errorItems);
                return;
            }

            const [A, U] =
                resulA.length && resulU.length
                    ? results
                    : resulA.length
                        ? [results[0], []]
                        : [[], results[0]];
            const AData = A?.data?.logs1 || [];
            const UData = U?.data?.logs1 || [];

            setGridData(prev => {
                const updated = prev.map(item => {
                    const found = [...AData, ...UData].find(x => x?.IDX_NO === item?.IdxNo);
                    return found ? { ...item, Status: '', AddressSeq: found.AddressSeq } : item;
                });
                return updateIndexNo(updated);
            });

        } catch (error) {
            message.error(`Đã xảy ra lỗi: ${error.message || 'Unknown error'}`);
        } finally {
            loadingBarRef.current?.complete();
            togglePageInteraction(false);
        }
    }, [gridData, canCreate]);

    const handleRestSheet = useCallback(async () => {
        fetchData();
        setEditedRows([]);
        resetTable();
    }, [defaultCols, gridData]);




    return (
        <>
            <Helmet>
                <title>{t('10040485')}</title>
            </Helmet>
            <TopLoadingBar color="blue" height={2} ref={loadingBarRef} />
            <div className="bg-slate-50 h-[calc(100vh-35px)] overflow-hidden">
                <div className="flex flex-col  h-full">
                    <div className="col-start-1 col-end-5 row-start-1 w-full  ">
                        <div className="flex p-2 items-end justify-end">
                            <HrBasAddressAction
                                fetchData={handleSearchData}
                                handleDeleteDataSheet={handleDeleteDataSheet}
                                handleSaveData={handleSaveData}
                            />
                        </div>
                        <details
                            className="group p-2 [&_summary::-webkit-details-marker]:hidden border-t border-b bg-white"
                            open
                        >
                            <summary className="flex cursor-pointer items-center justify-between gap-1.5 text-gray-900" onClick={(e) => e.preventDefault()}>
                                <h2 className="text-[10px] font-medium flex items-center gap-2  uppercase" >
                                    <FilterOutlined />
                                    {t('359')}
                                </h2>
                            </summary>

                            <HrBasAddressQuery
                                helpData01={helpData01}
                                helpData02={helpData02}
                                helpData03={helpData03}
                                helpData04={helpData04}
                                searchText={searchText}
                                setSearchText={setSearchText}
                                setSearchText1={setSearchText1}
                                searchText1={searchText1}
                                setItemText={setItemText}
                                itemText={itemText}
                                setDataSearch={setDataSearch}
                                dataSearch={dataSearch}
                                setDataSearch1={setDataSearch1}
                                dataSearch1={dataSearch1}
                                setDataSheetSearch={setDataSheetSearch}
                                dataSheetSearch={dataSheetSearch}
                                setItemText1={setItemText1}
                                setHelpData02={setHelpData02}
                                setSMAddressType={setSMAddressType}
                                QAddress={QAddress}
                                setQAddress={setQAddress}

                                setDataSheetSearch1={setDataSheetSearch1}
                            />
                        </details>
                    </div>

                    <div className="col-start-1 col-end-5 row-start-2 w-full h-full rounded-lg ">
                        <HrBasAddressTable

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
                            dataRootMenu={dataRootMenu}
                            dataSubMenu={dataSubMenu}
                            handleRestSheet={handleRestSheet}
                            helpData02={helpData02}
                            setHelpData02={setHelpData02}

                            helpData03={helpData03}
                            setHelpData03={setHelpData03}



                        />
                    </div>
                </div>
            </div>
            <ErrorListModal isModalVisible={modal2Open}
                setIsModalVisible={setModal2Open}
                dataError={errorData} />
        </>
    )
}
