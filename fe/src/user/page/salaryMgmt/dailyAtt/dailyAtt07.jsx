import { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { notification, message, Modal } from 'antd'
import { CompactSelection, GridColumnIcon } from '@glideapps/glide-data-grid'
import { loadFromLocalStorageSheet } from '../../../../localStorage/sheet/sheet'
import { onRowAppended } from '../../../components/sheet/js/onRowAppended'
import { generateEmptyData } from '../../../components/sheet/js/generateEmptyData'
import TopLoadingBar from 'react-top-loading-bar';
import { updateIndexNo } from '../../../components/sheet/js/updateIndexNo'
import { filterValidRows } from '../../../../utils/filterUorA'
import { togglePageInteraction } from '../../../../utils/togglePageInteraction'
import { HandleError } from '../../default/handleError'
import { debounce } from 'lodash'
import { GetCodeHelpVer2 } from '../../../../features/codeHelp/getCodeHelpVer2'
import dayjs from 'dayjs'
import { GetCodeHelpComboVer2 } from '../../../../features/codeHelp/getCodeHelpComboVer2'
import DailyAtt07Action from '../../../components/actions/salaryMgmt/dailyAtt/dailyAtt07Action'
import DailyAtt07Table from '../../../components/table/salaryMgmt/dailyAtt/dailyAtt07Table'
import DailyAtt07Query from '../../../components/query/salaryMgmt/dailyAtt/dailyAtt07Query'
import { SPRWkAbsEmpQ } from '../../../../features/hr/dailyAtt/SPRWkAbsEmp/SPRWkAbsEmpQ'
import { SPRWkAbsEmpAUD } from '../../../../features/hr/dailyAtt/SPRWkAbsEmp/SPRWkAbsEmpAUD'
export default function DailyAtt07Page({ permissions, isMobile, canCreate, canEdit, canDelete, controllers,
    cancelAllRequests }) {
    const userFrom = JSON.parse(localStorage.getItem('userInfo'))
    const loadingBarRef = useRef(null);
    const activeFetchCountRef = useRef(0);
    const { t } = useTranslation()
    const defaultCols = useMemo(() => [
        { title: '', id: 'Status', kind: 'Text', readonly: true, width: 50, hasMenu: true, visible: true, themeOverride: { textDark: "#225588", baseFontStyle: "600 13px" }, trailingRowOptions: { disabled: false }, icon: GridColumnIcon.HeaderLookup },
        { title: t('Họ tên'), id: 'EmpName', kind: 'Text', readonly: false, width: 130, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, themeOverride: { textHeader: '#DD1144', bgIconHeader: '#DD1144', fontFamily: '' } },
        { title: t('Mã nhân viên'), id: 'EmpID', kind: 'Text', readonly: true, width: 140, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
        { title: t('Thuộc bộ phận'), id: 'DeptName', kind: 'Text', readonly: true, width: 160, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
        { title: t('Vị trí'), id: 'UMJpName', kind: 'Text', readonly: true, width: 120, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
        { title: t('Nhóm lương'), id: 'PuName', kind: 'Text', readonly: true, width: 120, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
        { title: t('Hình thái lương'), id: 'PtName', kind: 'Text', readonly: true, width: 130, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
        { title: t('Ngày nghỉ'), id: 'AbsDate', kind: 'Text', readonly: false, width: 120, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, themeOverride: { textHeader: '#DD1144', bgIconHeader: '#DD1144', fontFamily: '' } },
        { title: t('Mục chấm công'), id: 'WkItemName', kind: 'Text', readonly: false, width: 120, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, themeOverride: { textHeader: '#DD1144', bgIconHeader: '#DD1144', fontFamily: '' } },
        { title: t('Số ngày phép năm còn lại'), id: 'RemainAnnualLeave', kind: 'Number', readonly: true, width: 120, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
        { title: t('Số ngày sử dụng phép năm'), id: 'UsedAnnualLeave', kind: 'Number', readonly: true, width: 120, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
        { title: t('Có/không áp dụng nửa ngày phép'), id: 'IsHalf', kind: 'Boolean', readonly: false, width: 90, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
        { title: t('Ghi chú'), id: 'Remark', kind: 'Text', readonly: false, width: 200, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },

    ], [t]);
    const langCode = localStorage.getItem('language') || '6';
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

    const [whName, setWHName] = useState('')
    const [helpData01, setHelpData01] = useState([])
    const [helpData02, setHelpData02] = useState([])
    const [helpData03, setHelpData03] = useState([])
    const [helpData04, setHelpData04] = useState([])
    const [helpData05, setHelpData05] = useState([])
    const [helpData06, setHelpData06] = useState([])
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [formDate, setFormDate] = useState(dayjs())
    const [toDate, setToDate] = useState(dayjs())


    const [itemText, setItemText] = useState([])
    const [itemText1, setItemText1] = useState('')
    const [itemText2, setItemText2] = useState('')

    const [itemText4, setItemText4] = useState('')
    const [dataSheetSearch2, setDataSheetSearch2] = useState([])

    const [searchText1, setSearchText1] = useState('')
    const [dataSearch1, setDataSearch1] = useState('')


    const [searchText3, setSearchText3] = useState('')
    const [dataSearch3, setDataSearch3] = useState([])
    const [itemText3, setItemText3] = useState('')
    const [PuSeq, setPuSeq] = useState('')
    const [PtSeq, setPtSeq] = useState('')


    const formatDate = (date) => date.format('YYYYMMDD')
    const [cols, setCols] = useState(() =>
        loadFromLocalStorageSheet(
            'daily_att_07_a',
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

    const handleSearchData = useCallback(async () => {
        if (!formDate) {
            HandleError([
                {
                    success: false,
                    message: 'Vui lòng chọn thời gian trước khi tìm kiếm!',
                },
            ]);
            return;
        }
        const searchParams = [
            {
                AbsDate: formDate ? formatDate(formDate) : '',
                PuSeq: PuSeq ? PuSeq : '',
                PtSeq: PtSeq ? PtSeq : '',
                DeptSeq: dataSearch ? dataSearch?.BeDeptSeq : '',
                WkItemSeq: dataSearch3 ? dataSearch3?.WkItemSeq : '',
                EmpSeq: dataSearch2 ? dataSearch2?.EmpSeq : '',

            }
        ]

        fetchGenericData({
            controllerKey: 'SPRWkAbsEmpQ',
            postFunction: SPRWkAbsEmpQ,
            searchParams,
            defaultCols: defaultCols,
            useEmptyData: true,
            afterFetch: (data) => {
                setGridData(data);
                setNumRows(data.length);
            },
        });

    }, [formDate, PtSeq, PuSeq, dataSearch3, dataSearch, dataSearch2]);


    const handleSaveData = useCallback(async () => {
        if (!canCreate) return true;

        const resulA = filterValidRows(gridData, 'A').map(item => ({
            ...item,
            WorkingTag: 'A',


        }));
        const resulU = filterValidRows(gridData, 'U').map(item => ({
            ...item,
            WorkingTag: 'U',

        }));


        const requiredFields = [
            { key: 'EmpName', label: 'Nhân viên' },
            { key: 'WkItemName', label: 'Mục chấm công' },
            { key: 'EmpID', label: 'Mã nhân viên' },
            { key: 'EmpSeq', label: 'Mã nhân viên' },
            { key: 'AbsDate', label: 'Ngày nghỉ' },
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
            if (resulA.length > 0) apiCalls.push(SPRWkAbsEmpAUD(resulA));

            if (resulU.length > 0) apiCalls.push(SPRWkAbsEmpAUD(resulU));

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
    }, [gridData, canCreate]);

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
                SPRWkAbsEmpAUD(rowsWithStatusD)
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
                GetCodeHelpVer2(10009, '%%', '', '', '', '', '1', '', 1, '', 0, 0, 0),
                GetCodeHelpVer2(20005, '%%', '', '', '', '', '1', '', 1, '', 0, 0, 0),
                GetCodeHelpVer2(10010, '%%', '', '', '', '', '1', '', 1, '', 0, 0, 0),
                GetCodeHelpVer2(20005, '%%', '', '', '', '', '1', '', 1, '', 0, 0, 0),
                GetCodeHelpComboVer2('', langCode, 20001, 1, '%', '', '', '', '', signal),
                GetCodeHelpComboVer2('', langCode, 20003, 1, '%', '', '', '', '', signal),
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
            <TopLoadingBar color="blue" height={2} ref={loadingBarRef} />
            <div className="bg-slate-50 h-[calc(100vh-35px)] overflow-hidden">
                <div className="flex flex-col h-full">
                    <div className="col-start-1 col-end-5 row-start-1 w-full rounded-lg">
                        <div className="flex items-end justify-end bg-white p-1">

                            <DailyAtt07Action
                                handleSearchData={handleSearchData}
                                handleSaveData={handleSaveData}
                                handleDeleteDataSheet={handleDeleteDataSheet}
                            />
                        </div>
                        <details
                            className="group [&_summary::-webkit-details-marker]:hidden border-t   bg-white"
                            open
                        >
                            <summary className="flex cursor-pointer items-center justify-between p-1 gap-1.5 border-b text-gray-900" onClick={(e) => e.preventDefault()}>
                                <h2 className="text-[9px] font-medium flex items-center   uppercase text-blue-500">
                                    {t('850000014')}
                                </h2>
                            </summary>
                            <DailyAtt07Query

                                formDate={formDate}
                                setFormDate={setFormDate}
                                helpData01={helpData01}
                                helpData02={helpData02}
                                helpData03={helpData03}
                                helpData04={helpData04}
                                helpData05={helpData05}
                                helpData06={helpData06}
                                setHelpData01={setHelpData01}

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

                                setPuSeq={setPuSeq}
                                PuSeq={PuSeq}
                                PtSeq={PtSeq}
                                setPtSeq={setPtSeq}
                                dataSearch2={dataSearch2}
                            />
                        </details>


                    </div>

                    <div className="col-start-1 col-end-5 row-start-2 w-full h-full border-t  overflow-auto">
                        <DailyAtt07Table
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

                            helpData02={helpData02}
                            setHelpData02={setHelpData02}


                        />
                    </div>
                </div>
            </div>

        </>
    )
}
