import { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { notification, message, Modal } from 'antd'
import { CompactSelection, GridColumnIcon } from '@glideapps/glide-data-grid'
import { loadFromLocalStorageSheet } from '../../../localStorage/sheet/sheet'
import { onRowAppended } from '../../components/sheet/js/onRowAppended'
import { generateEmptyData } from '../../components/sheet/js/generateEmptyData'
import TopLoadingBar from 'react-top-loading-bar';
import { updateIndexNo } from '../../components/sheet/js/updateIndexNo'
import { filterValidRows } from '../../../utils/filterUorA'
import { togglePageInteraction } from '../../../utils/togglePageInteraction'
import { HandleError } from '../default/handleError'
import { debounce } from 'lodash'
import dayjs from 'dayjs'
import { GetCodeHelpComboVer2 } from '../../../features/codeHelp/getCodeHelpComboVer2'
import { GetCodeHelpVer2 } from '../../../features/codeHelp/getCodeHelpVer2'
import { SDAItemListQ } from '../../../features/basic/daMaterialList/SDAItemListQ'
import { SDAItemListAUD } from '../../../features/basic/daMaterialList/SDAItemListAUD'
import SLGWHInitStockAction from '../../components/actions/invOpen/SLGWHInitStockAction'
import SLGWHInitStockQuery from '../../components/query/invOpen/SLGWHInitStockQuery'
import SLGWHInitStockTable from '../../components/table/invOpen/SLGWHInitStockTable'
import { SLGWHInitStockQ } from '../../../features/warehouse/invOpen/SLGWHInitStockQ'
import { SLGWHInitStockAUD } from '../../../features/warehouse/invOpen/SLGWHInitStockAUD'
import SLGWHInitStockBQuery from '../../components/query/invOpen/SLGWHInitStockBQuery'
export default function SLGWHInitStock({ permissions, isMobile, canCreate, canEdit, canDelete, controllers,
    cancelAllRequests }) {
    const langCode = localStorage.getItem('language') || '6';
    const userFrom = JSON.parse(localStorage.getItem('userInfo'))
    const loadingBarRef = useRef(null);
    const activeFetchCountRef = useRef(0);
    const { t } = useTranslation()
    const defaultCols = useMemo(() => [
        { title: '', id: 'Status', kind: 'Text', readonly: true, width: 50, hasMenu: true, visible: true, themeOverride: { textDark: "#225588", baseFontStyle: "600 13px" }, trailingRowOptions: { disabled: false }, icon: GridColumnIcon.HeaderLookup },
        { title: t('1786'), id: 'ItemName', kind: 'Text', readonly: false, width: 130, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, themeOverride: { textHeader: '#DD1144', bgIconHeader: '#DD1144', fontFamily: '' } },
        { title: t('2091'), id: 'ItemNo', kind: 'Text', readonly: false, width: 130, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, },
        { title: t('551'), id: 'Spec', kind: 'Text', readonly: false, width: 130, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, },
        { title: t('Đơn vị'), id: 'UnitName', kind: 'Text', readonly: false, width: 80, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, },
        { title: t('Số lượng tồn kho cơ sở'), id: 'PrevQty', kind: 'Text', readonly: false, width: 150, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, themeOverride: { textHeader: '#DD1144', bgIconHeader: '#DD1144', fontFamily: '' } },
        { title: t('Phân loại danh mục hàng'), id: 'AssetName', kind: 'Text', readonly: false, width: 150, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, },
        { title: t('Đơn vị tiêu chuẩn'), id: 'STDUnitName', kind: 'Text', readonly: false, width: 130, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, },
        { title: t('Số lượng tồn kho tiêu chuẩn'), id: 'STDPrevQty', kind: 'Text', readonly: false, width: 130, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, },

    ], [t]);
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
    const [keyItem1, setKeyItem1] = useState('')
    const [keyItem2, setKeyItem2] = useState('')
    const [keyItem3, setKeyItem3] = useState('')
    const [keyItem4, setKeyItem4] = useState('')
    const [keyItem5, setKeyItem5] = useState('')


    const [searchText, setSearchText] = useState('')
    const [dataSearch, setDataSearch] = useState([])

    const [searchText2, setSearchText2] = useState('')
    const [dataSearch2, setDataSearch2] = useState([])


    const [itemText3, setItemText3] = useState(null)
    const [searchText3, setSearchText3] = useState('')
    const [dataSearch3, setDataSearch3] = useState([])



    const [itemText4, setItemText4] = useState(null)
    const [searchText4, setSearchText4] = useState('')
    const [dataSearch4, setDataSearch4] = useState([])


    const [itemText5, setItemText5] = useState(null)
    const [searchText5, setSearchText5] = useState('')
    const [dataSearch5, setDataSearch5] = useState([])

    const [whName, setWHName] = useState('')
    const [helpData01, setHelpData01] = useState([])
    const [helpData02, setHelpData02] = useState([])
    const [helpData03, setHelpData03] = useState([])
    const [helpData04, setHelpData04] = useState([])
    const [helpData05, setHelpData05] = useState([])
    const [helpData06, setHelpData06] = useState([])
    const [helpData07, setHelpData07] = useState([])
    const [helpData08, setHelpData08] = useState([])
    const [helpData09, setHelpData09] = useState([])
    const [BizUnit, setBizUnit] = useState(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [formDate, setFormDate] = useState(dayjs().startOf('month'));
    const [toDate, setToDate] = useState(dayjs())


    const [searchText1, setSearchText1] = useState('')
    const [dataSearch1, setDataSearch1] = useState('')
    const [itemName, setItemName] = useState('')
    const [itemNo, setItemNo] = useState('')
    const [spec, setSpec] = useState('')
    const [itemText, setItemText] = useState('')
    const [itemText1, setItemText1] = useState('')
    const [itemText2, setItemText2] = useState('')
    const [AssetSeq, setAssetSeq] = useState(null)
    const [dataSheetSearch2, setDataSheetSearch2] = useState([])
    const formatDate = (date) => date.format('YYYYDD')
    const [cols, setCols] = useState(() =>
        loadFromLocalStorageSheet(
            'inv_open_01_a',
            defaultCols.filter((col) => col.visible)
        )
    )

    const [PuSeq, setPuSeq] = useState('')
    const [PtSeq, setPtSeq] = useState('')
    const resetTable = () => {
        setSelection({
            columns: CompactSelection.empty(),
            rows: CompactSelection.empty()
        })
    }
    useEffect(() => {
        const emptyData = generateEmptyData(100, defaultCols)
        const updatedData = updateIndexNo(emptyData)
        setGridData(updatedData)
        setNumRows(updatedData.length)
    }, [defaultCols])

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
            let emptyData = [];

            if (useEmptyData) {
                emptyData = updateIndexNo(generateEmptyData(100, defaultCols));
            }

            await afterFetch(emptyData);
        } finally {
            decreaseFetchCount();
            controllers.current[controllerKey] = null;
            togglePageInteraction(false);
            loadingBarRef.current?.complete();
        }
    };

    const handleSearchData = useCallback(async (isNew = 0) => {
        if (!formDate) {
            HandleError([{ success: false, message: 'Vui lòng chọn thời gian!' }]);
            return;
        }

        if (!dataSearch4) {
            HandleError([{ success: false, message: 'Vui lòng chọn kho!' }]);
            return;
        }

        if (!BizUnit) {
            HandleError([{ success: false, message: 'Vui lòng chọn bộ phận kinh doanh!' }]);
            return;
        }

        const searchParams = [
            {
                StkYM: formDate ? formatDate(formDate) : '',
                WHSeq: dataSearch4?.WHSeq || '',
                BizUnit: BizUnit || 0,
                ItemName: itemName || '',
                ItemNo: itemNo || '',
                Spec: spec || '',
                IsNew: isNew,  
                AssetSeq: AssetSeq || '',
                UMItemClassS: dataSearch5?.UMItemClass || '',
            },
        ];

        fetchGenericData({
            controllerKey: 'SLGWHInitStockQ',
            postFunction: SLGWHInitStockQ,
            searchParams,
            defaultCols,
            useEmptyData: true,
            afterFetch: (data) => {
                setGridData(data);
                setNumRows(data.length);
            },
        });
    }, [formDate, dataSearch4, BizUnit, itemName, itemNo, spec, dataSearch5, AssetSeq]);

    // Hàm gọi mặc định (IsNew = 0)
    const handleSearchDefault = () => handleSearchData(0);

    // Hàm gọi khi bấm nút đặc biệt (IsNew = 1)
    const handleSearchNew = () => handleSearchData(1);



    const handleSaveData = useCallback(async () => {
        if (!canCreate) return true;

        const resulA = filterValidRows(gridData, 'A').map(item => ({
            ...item,
            WorkingTag: 'A',
            StkYM: formDate ? formatDate(formDate) : '',
            WHSeq: dataSearch4?.WHSeq || '',
            BizUnit: BizUnit || 0

        }));
        const resulU = filterValidRows(gridData, 'U').map(item => ({
            ...item,
            WorkingTag: 'U',
            StkYM: formDate ? formatDate(formDate) : '',
            WHSeq: dataSearch4?.WHSeq || '',
            BizUnit: BizUnit || 0
        }));


        const requiredFields = [
            { key: 'ItemName', label: t('1786') },
            { key: 'PrevQty', label: t('Số lượng tồn kho cơ sở') },
            { key: 'WHSeq', label: t('Kho quản lý') },
            { key: 'BizUnit', label: t('Bộ phận kinh doanh') },
        ];
        const validateRequiredFields = (data, fields) =>
            data.flatMap((row, i) =>
                fields
                    .filter(({ key }) => !row[key]?.toString().trim())
                    .map(({ key, label }) => ({
                        row: i + 1,
                        field: key,
                        message: `Cột ${label} không được để trống (hàng ${i + 1})`,
                    }))
            );
        const errors = [
            ...validateRequiredFields(resulA, requiredFields),
            ...validateRequiredFields(resulU, requiredFields),
        ];

        if (errors.length > 0) {
            HandleError([
                {
                    success: false,
                    message: [
                        errors[0].message,
                        ...(errors.length > 1 ? [`...và còn ${errors.length - 1} lỗi khác.`] : []),
                    ],
                },
            ]);
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
            if (resulA.length > 0) apiCalls.push(SLGWHInitStockAUD(resulA));

            if (resulU.length > 0) apiCalls.push(SLGWHInitStockAUD(resulU));

            const results = await Promise.all(apiCalls);

            const isSuccess = results.every(result => result?.success);

            if (!isSuccess) {
                HandleError(results);
                return;
            }
            const [addMenuRaw, uMenuRaw] =
                resulA.length && resulU.length
                    ? results
                    : resulA.length
                        ? [results[0], []]
                        : [[], results[0]];

            const addMenuData = addMenuRaw?.data || [];
            const uMenuData = uMenuRaw?.data || [];

            setGridData(prev => {
                const updated = prev.map(item => {
                    const found = [...addMenuData, ...uMenuData].find(x => x?.IDX_NO === item?.IdxNo);
                    return found ? {
                        ...item, Status: '',
                        IsHalf: found.IsHalf,
                        UsedAnnualLeave: found.UsedAnnualLeave,
                        RemainAnnualLeave: found.RemainAnnualLeave,
                        PuName: found.PuName
                    } : item;
                });
                return updateIndexNo(updated);
            });

        } catch (error) {
            HandleError([
                {
                    success: false,
                    message: error.message || 'Đã xảy ra lỗi khi xóa!',
                },
            ]);
        } finally {
            loadingBarRef.current?.complete();
            togglePageInteraction(false);
        }
    }, [gridData, canCreate, formDate, dataSearch4, BizUnit]);

    const handleDeleteDataSheet = useCallback(
        (e) => {
            if (canDelete === false) return;

            togglePageInteraction(true);
            loadingBarRef.current?.continuousStart();

            const selectedRows = getSelectedRows();

            const rowsWithStatusD = selectedRows
                .filter((row) => !row.Status || row.Status === 'U' || row.Status === 'D' || row.Status === 'E')
                .map((row) => ({
                    ...row,
                    Status: 'D',
                    WorkingTag: 'D'
                }));


            const rowsWithStatusA = selectedRows.filter((row) => row.Status === 'A');

            const finish = () => {
                loadingBarRef.current?.complete();
                togglePageInteraction(false);
            };

            if (rowsWithStatusD.length > 0) {
                SDAItemListAUD(rowsWithStatusD)
                    .then((response) => {
                        if (response.success) {
                            const deletedIds = rowsWithStatusD.map((item) => item.IdxNo);
                            const updatedData = gridData.filter((row) => !deletedIds.includes(row.IdxNo));
                            setGridData(updateIndexNo(updatedData));
                            setNumRows(updatedData.length);
                            resetTable();
                        } else {
                            setGridData(prev => {
                                const updated = prev.map(item => {
                                    const isSelected = rowsWithStatusD.some(row => row.IdxNo === item.IdxNo);
                                    return isSelected ? { ...item, Status: 'E' } : item;
                                });
                                return updated;
                            });
                            HandleError([
                                {
                                    success: false,
                                    message: response.message || 'Đã xảy ra lỗi khi xóa!',
                                },
                            ]);
                        }
                    })
                    .catch((error) => {
                        HandleError([
                            {
                                success: false,
                                message: error.message || 'Đã xảy ra lỗi khi xóa!',
                            },
                        ]);
                    })
                    .finally(() => {
                        finish();
                    });
            } else {

                if (rowsWithStatusA.length > 0) {
                    const idsWithStatusA = rowsWithStatusA.map((row) => row.Id);
                    const remainingRows = gridData.filter((row) => !idsWithStatusA.includes(row.Id));
                    setGridData(updateIndexNo(remainingRows));
                    setNumRows(remainingRows.length);
                    resetTable();
                }
                finish();
            }
        },
        [gridData, selection, editedRows]
    );
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
                GetCodeHelpVer2(18002, '%%', '', '', '', '', '1', '', 1, '', 0, 0, 0, signal),
                GetCodeHelpVer2(10009, '%%', '', '', '', '', '1', '', 1, '', 0, 0, 0, signal),
                GetCodeHelpComboVer2('', langCode, 10012, 1, '%', '', '', '', '', signal),
                GetCodeHelpVer2(10007, '%%', '', '', '', '', '1', '', 1, '', 0, 0, 0, signal),
                GetCodeHelpComboVer2('', langCode, 10003, 1, '%', '', '', '', '', signal),


                GetCodeHelpComboVer2('', langCode, 10014, 1, '%', '2004', '', '', '', signal),
                GetCodeHelpComboVer2('', langCode, 18097, 1, '%', '2006', '', '', '', signal),
                GetCodeHelpComboVer2('', langCode, 18098, 1, '%', '2005', '', '', '', signal),

                GetCodeHelpVer2(10006, '%%', '', '', '', '', '1', '', 1, '', 0, 0, 0, signal),

            ]);

            setHelpData01(res1.status === 'fulfilled' ? res1.value?.data || [] : []);
            setHelpData02(res2.status === 'fulfilled' ? res2.value?.data || [] : []);
            setHelpData03(res3.status === 'fulfilled' ? res3.value?.data || [] : []);
            setHelpData04(res4.status === 'fulfilled' ? res4.value?.data || [] : []);
            setHelpData05(res5.status === 'fulfilled' ? res5.value?.data || [] : []);
            setHelpData06(res6.status === 'fulfilled' ? res6.value?.data || [] : []);
            setHelpData07(res7.status === 'fulfilled' ? res7.value?.data || [] : []);
            setHelpData08(res8.status === 'fulfilled' ? res8.value?.data || [] : []);
            setHelpData09(res9.status === 'fulfilled' ? res9.value?.data || [] : []);

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
            <TopLoadingBar color="blue" height={2} ref={loadingBarRef} />
            <div className="bg-slate-50 h-[calc(100vh-35px)] overflow-hidden">
                <div className="flex flex-col h-full">
                    <div className="col-start-1 col-end-5 row-start-1 w-full rounded-lg">
                        <div className="flex items-end justify-end bg-white p-1">
                            <SLGWHInitStockAction handleSearchData={handleSearchDefault}
                                handleSaveData={handleSaveData}
                                handleSearchNew={handleSearchNew}
                                handleDeleteDataSheet={handleDeleteDataSheet}
                            />
                        </div>
                        <details
                            className="group [&_summary::-webkit-details-marker]:hidden border-t   bg-white"
                            open
                        >
                            <summary className="flex cursor-pointer items-center justify-between p-1 gap-1.5 border-b text-gray-900" onClick={(e) => e.preventDefault()}>
                                <h2 className="text-[9px] font-medium flex items-center   uppercase text-blue-500">
                                    {t('Điều kiện truy vấn hạng mục mới')}
                                </h2>
                            </summary>


                            <SLGWHInitStockQuery

                                formDate={formDate}
                                setFormDate={setFormDate}
                                toDate={toDate}
                                setToDate={setToDate}

                                helpData01={helpData01}
                                setHelpData01={setHelpData01}

                                helpData02={helpData02}
                                helpData03={helpData03}
                                helpData04={helpData04}
                                helpData05={helpData05}
                                helpData06={helpData06}
                                helpData07={helpData07}
                                helpData08={helpData08}
                                dataSearch2={dataSearch2}


                                setPuSeq={setPuSeq}
                                PuSeq={PuSeq}
                                PtSeq={PtSeq}
                                setPtSeq={setPtSeq}



                                setSearchText={setSearchText}
                                searchText={searchText}
                                setDataSearch={setDataSearch}
                                setItemText={setItemText}


                                setSearchText1={setSearchText1}
                                setItemText1={setItemText1}
                                setDataSearch1={setDataSearch1}
                                setItemText2={setItemText2}
                                setSearchText2={setSearchText2}
                                searchText2={searchText2}
                                setDataSearch2={setDataSearch2}
                                setDataSheetSearch2={setDataSheetSearch2}



                                setSearchText3={setSearchText3}
                                searchText3={searchText3}
                                setDataSearch3={setDataSearch3}
                                setItemText3={setItemText3}



                                setSearchText4={setSearchText4}
                                searchText4={searchText4}
                                setDataSearch4={setDataSearch4}
                                setItemText4={setItemText4}


                                setSearchText5={setSearchText5}
                                searchText5={searchText5}
                                setDataSearch5={setDataSearch5}
                                setItemText5={setItemText5}


                                itemName={itemName}
                                setItemName={setItemName}
                                itemNo={itemNo}
                                setItemNo={setItemNo}
                                spec={spec}
                                setSpec={setSpec}
                                AssetSeq={AssetSeq}
                                setAssetSeq={setAssetSeq}
                            />
                        </details>
                        <details
                            className="group [&_summary::-webkit-details-marker]:hidden border-t   bg-white"
                            open
                        >
                            <summary className="flex cursor-pointer items-center justify-between p-1 gap-1.5 border-b text-gray-900" onClick={(e) => e.preventDefault()}>
                                <h2 className="text-[9px] font-medium flex items-center   uppercase text-blue-500">
                                    {t('850000014')}
                                </h2>
                            </summary>

                            <SLGWHInitStockBQuery

                                formDate={formDate}
                                setFormDate={setFormDate}
                                toDate={toDate}
                                setToDate={setToDate}

                                helpData01={helpData01}
                                setHelpData01={setHelpData01}

                                helpData02={helpData02}
                                helpData03={helpData03}
                                helpData04={helpData04}
                                helpData05={helpData05}
                                helpData06={helpData06}
                                helpData07={helpData07}
                                helpData08={helpData08}
                                dataSearch2={dataSearch2}


                                setPuSeq={setPuSeq}
                                PuSeq={PuSeq}
                                PtSeq={PtSeq}
                                setPtSeq={setPtSeq}



                                setSearchText={setSearchText}
                                searchText={searchText}
                                setDataSearch={setDataSearch}
                                setItemText={setItemText}


                                setSearchText1={setSearchText1}
                                setItemText1={setItemText1}
                                setDataSearch1={setDataSearch1}
                                setItemText2={setItemText2}
                                setSearchText2={setSearchText2}
                                searchText2={searchText2}
                                setDataSearch2={setDataSearch2}
                                setDataSheetSearch2={setDataSheetSearch2}



                                setSearchText3={setSearchText3}
                                searchText3={searchText3}
                                setDataSearch3={setDataSearch3}
                                setItemText3={setItemText3}



                                setSearchText4={setSearchText4}
                                searchText4={searchText4}
                                setDataSearch4={setDataSearch4}
                                setItemText4={setItemText4}


                                setSearchText5={setSearchText5}
                                searchText5={searchText5}
                                setDataSearch5={setDataSearch5}
                                setItemText5={setItemText5}


                                itemName={itemName}
                                setItemName={setItemName}
                                itemNo={itemNo}
                                setItemNo={setItemNo}
                                spec={spec}
                                setSpec={setSpec}
                                AssetSeq={AssetSeq}
                                setAssetSeq={setAssetSeq}
                                helpData09={helpData09}

                                setHelpData09={setHelpData09}
                                setBizUnit={setBizUnit}

                            />
                        </details>

                    </div>

                    <div className="col-start-1 col-end-5 row-start-2 w-full h-full border-t  overflow-auto">
                        <SLGWHInitStockTable
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
                            canCreate={canCreate}
                            defaultCols={defaultCols}
                            canEdit={canEdit}


                            helpData01={helpData01}
                            setHelpData01={setHelpData01}



                        />
                    </div>
                </div>
            </div>

        </>
    )
}
