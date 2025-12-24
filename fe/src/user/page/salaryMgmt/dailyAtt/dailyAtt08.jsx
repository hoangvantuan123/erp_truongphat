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
import dayjs from 'dayjs'
import { GetCodeHelpComboVer2 } from '../../../../features/codeHelp/getCodeHelpComboVer2'
import { GetCodeHelpVer2 } from '../../../../features/codeHelp/getCodeHelpVer2'
import DailyAtt08Action from '../../../components/actions/salaryMgmt/dailyAtt/dailyAtt08Action'
import DailyAtt08Table from '../../../components/table/salaryMgmt/dailyAtt/dailyAtt08Table'
import DailyAtt08Query from '../../../components/query/salaryMgmt/dailyAtt/dailyAtt08Query'
import DailyAtt08BQuery from '../../../components/query/salaryMgmt/dailyAtt/dailyAtt08BQuery'
import { SPRWkMmEmpDaysQ } from '../../../../features/hr/dailyAtt/WkMmEmpDays/SPRWkMmEmpDaysQ'
import { SPRWkMmEmpDaysObjQ } from '../../../../features/hr/dailyAtt/WkMmEmpDays/SPRWkMmEmpDaysObjQ'
import { SPRWkMmEmpDaysProc } from '../../../../features/hr/dailyAtt/WkMmEmpDays/SPRWkMmEmpDaysProc'
import { SPRWkMmEmpDaysAUD } from '../../../../features/hr/dailyAtt/WkMmEmpDays/SPRWkMmEmpDaysAUD'
import { HandleSuccess } from '../../default/handleSuccess'

import moment from 'moment'

export default function DailyAtt08Page({ permissions, isMobile, canCreate, canEdit, canDelete, controllers,
    cancelAllRequests }) {
    const langCode = localStorage.getItem('language') || '6';
    const userFrom = JSON.parse(localStorage.getItem('userInfo'))
    const loadingBarRef = useRef(null);
    const activeFetchCountRef = useRef(0);
    const { t } = useTranslation()
    const defaultCols = useMemo(() => [
        { title: '', id: 'Status', kind: 'Text', readonly: true, width: 50, hasMenu: true, visible: true, themeOverride: { textDark: "#225588", baseFontStyle: "600 13px" }, trailingRowOptions: { disabled: true }, icon: GridColumnIcon.HeaderLookup },
        { title: t('Nhân viên'), id: 'EmpName', kind: 'Text', readonly: false, width: 130, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
        { title: t('Mã nhân viên'), id: 'EmpID', kind: 'Text', readonly: false, width: 130, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
        { title: t('Bộ phận'), id: 'DeptName', kind: 'Text', readonly: false, width: 130, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
        { title: t('Chức vị'), id: 'UMJpName', kind: 'Text', readonly: false, width: 130, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
        { title: t('Nhóm lương'), id: 'PuName', kind: 'Text', readonly: false, width: 130, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
        { title: t('Hình thái lương'), id: 'PtName', kind: 'Text', readonly: false, width: 130, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
        { title: t('Ngày vào'), id: 'EntDate', kind: 'Text', readonly: false, width: 130, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
        { title: t('Ngày nghỉ việc'), id: 'RetireDate', kind: 'Text', readonly: false, width: 130, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
        { title: t('Ngày bắt đầu tính nghỉ phép tháng'), id: 'EmpDate', kind: 'Text', readonly: false, width: 130, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, },
        { title: t('Tháng thanh toán'), id: 'PayYM', kind: 'Text', readonly: false, width: 130, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, themeOverride: { textHeader: '#DD1144', bgIconHeader: '#DD1144', fontFamily: '' } },
        { title: t('Ngày bắt đầu tiêu chuẩn phát sinh'), id: 'OccurFrDate', kind: 'Text', readonly: false, width: 130, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, },
        { title: t('Ngày kết thúc tiêu chuẩn phát sinh'), id: 'OccurToDate', kind: 'Text', readonly: false, width: 130, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, },
        { title: t('Phát sinh nghỉ phép tháng'), id: 'OccurDays', kind: 'Text', readonly: false, width: 130, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, },
        { title: t('Ngày bắt đầu sử dụng'), id: 'UseFrDate', kind: 'Text', readonly: false, width: 130, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, themeOverride: { textHeader: '#DD1144', bgIconHeader: '#DD1144', fontFamily: '' } },
        { title: t('Ngày kết thúc sử dụng'), id: 'UseToDate', kind: 'Text', readonly: false, width: 130, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, themeOverride: { textHeader: '#DD1144', bgIconHeader: '#DD1144', fontFamily: '' } },
        { title: t('Lương thưởng thanh toán'), id: 'PbName', kind: 'Text', readonly: false, width: 130, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, },
        { title: t('Năm tháng lương cơ bản'), id: 'GnerAmtYyMm', kind: 'Text', readonly: false, width: 130, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, themeOverride: { textHeader: '#DD1144', bgIconHeader: '#DD1144', fontFamily: '' } },

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

    const [whName, setWHName] = useState('')
    const [helpData01, setHelpData01] = useState([])
    const [helpData02, setHelpData02] = useState([])
    const [helpData03, setHelpData03] = useState([])
    const [helpData04, setHelpData04] = useState([])
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [formDate, setFormDate] = useState(dayjs())
    const [YyMm, setYyMm] = useState(dayjs())
    const [toDate, setToDate] = useState(dayjs())


    const [searchText1, setSearchText1] = useState('')
    const [dataSearch1, setDataSearch1] = useState('')
    const [itemText, setItemText] = useState([])
    const [itemText1, setItemText1] = useState('')
    const [itemText2, setItemText2] = useState('')
    const [dataSheetSearch2, setDataSheetSearch2] = useState([])
    const formatDate = (date) => date.format('YYYYMMDD')
    const [cols, setCols] = useState(() =>
        loadFromLocalStorageSheet(
            'daily_att_08_a',
            defaultCols.filter((col) => col.visible)
        )
    )

    const [PuSeq, setPuSeq] = useState('')
    const [PuSeq2, setPuSeq2] = useState('')
    const [PtSeq, setPtSeq] = useState('')
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
                    message: 'Vui lòng chọn  năm tháng tiêu chuẩn!',
                },
            ]);
            return;
        }
        const searchParams =
            [
                {
                    YM: formatDate(formDate),
                    PuSeq: PuSeq ? PuSeq : '',
                    PtSeq: PtSeq ? PtSeq : '',
                    DeptSeq: dataSearch ? dataSearch?.BeDeptSeq : '',
                    EmpSeq: dataSearch2 ? dataSearch2?.EmpSeq : '',


                }
            ]

        fetchGenericData({
            controllerKey: 'SPRWkMmEmpDaysQ',
            postFunction: SPRWkMmEmpDaysQ,
            searchParams,
            defaultCols: defaultCols,
            useEmptyData: false,
            afterFetch: (data) => {
                setGridData(data);
                setNumRows(data.length);
            },
        });

    }, [formDate, PtSeq, PuSeq, dataSearch, dataSearch2]);

    const handleSPRWkMmEmpDays = useCallback(async () => {
        if (!YyMm) {
            HandleError([
                {
                    success: false,
                    message: 'Vui lòng chọn thời gian trước khi tìm kiếm!',
                },
            ]);
            return;
        }

        // Hiển thị modal xác nhận trước khi xử lý
        Modal.confirm({
            title: 'Xác nhận',
            content: 'Bạn có chắc chắn muốn xử lý phép phát sinh cho tháng này không?',
            okText: 'Có',
            cancelText: 'Hủy',
            onOk: () => {
                const searchParams = [
                    {
                        IdxNo: 1,
                        YyMm: formatDate(YyMm),
                        PuSeq: PuSeq2 || '',
                    },
                ];

                fetchGenericData({
                    controllerKey: 'SPRWkMmEmpDaysProc',
                    postFunction: SPRWkMmEmpDaysProc,
                    searchParams,
                    defaultCols: defaultCols,
                    useEmptyData: false,
                    afterFetch: (data) => {
                        HandleSuccess([
                            {
                                success: true,
                                message: 'Xử lý phép phát sinh phép tháng thành công.',
                            },
                        ]);
                        handleSearchData();
                    },
                });
            },
            onCancel: () => {
                // Không làm gì nếu hủy
            },
        });
    }, [formDate, PtSeq, PuSeq, YyMm, PuSeq2]);
    const handleSearchData2 = useCallback(async () => {
        if (!formDate) {
            HandleError([
                {
                    success: false,
                    message: 'Vui lòng chọn thời gian trước khi tìm kiếm!',
                },
            ]);
            return;
        }
        const searchParams =
            [
                {
                    YM: formatDate(formDate),
                    PuSeq: PuSeq ? PuSeq : '',
                    PtSeq: PtSeq ? PtSeq : '',
                    DeptSeq: dataSearch ? dataSearch?.BeDeptSeq : '',
                    EmpSeq: dataSearch2 ? dataSearch2?.EmpSeq : '',


                }
            ]

        fetchGenericData({
            controllerKey: 'SPRWkMmEmpDaysObjQ',
            postFunction: SPRWkMmEmpDaysObjQ,
            searchParams,
            defaultCols: defaultCols,
            useEmptyData: false,
            afterFetch: (data) => {
                setGridData(data);
                setNumRows(data.length);
            },
        });

    }, [formDate, PtSeq, PuSeq, dataSearch, dataSearch2]);


    const handleSaveData = useCallback(async () => {
        if (!canCreate) return true;
        if (!formDate) {
            HandleError([
                {
                    success: false,
                    message: 'Vui lòng chọn  năm tháng tiêu chuẩn!',
                },
            ]);
            return;
        }
        const resulA = filterValidRows(gridData, 'A').map(item => ({
            ...item,
            CreatedBy: userFrom?.UserSeq,
            UpdatedBy: userFrom?.UserSeq,
        }));
        const resulU = filterValidRows(gridData, 'U').map(item => ({
            ...item,
            UpdatedBy: userFrom?.UserSeq,
            WorkingTag: 'U',
            YM: formatDate(formDate),
        }));


        const requiredFields = [
            { key: 'PayYM', label: 'Tháng thanh toán' },
            { key: 'UseFrDate', label: 'Ngày bắt đầu sử dụng' },
            { key: 'UseToDate', label: 'Ngày kết thúc sử dụng' },
            { key: 'GnerAmtYyMm', label: 'Năm tháng lương cơ bản' },
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
            if (resulA.length > 0) apiCalls.push(SPRWkMmEmpDaysAUD(resulA));

            if (resulU.length > 0) apiCalls.push(SPRWkMmEmpDaysAUD(resulU));

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
                    return found ? { ...item, Status: '', IdSeq: found.IdSeq } : item;
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
    }, [gridData, canCreate, userFrom, formDate]);


    const handleDeleteDataSheet = useCallback(
        (e) => {
            if (canDelete === false) return;

            togglePageInteraction(true);
            loadingBarRef.current?.continuousStart();

            const selectedRows = getSelectedRows();

            const rowsWithStatusD = selectedRows
                .filter((row) => !row.Status || row.Status === 'U' || row.Status === 'D' || row.Status === 'E')
                .map((row) => {
                    row.Status = 'D';
                    return { IdSeq: row.IdSeq, IdxNo: row.IdxNo };
                });

            const rowsWithStatusA = selectedRows.filter((row) => row.Status === 'A');

            const finish = () => {
                loadingBarRef.current?.complete();
                togglePageInteraction(false);
            };

            if (rowsWithStatusD.length > 0) {
                LocationD(rowsWithStatusD)
                    .then((response) => {
                        if (response.success) {
                            const deletedIds = rowsWithStatusD.map((item) => item.IdSeq);
                            const updatedData = gridData.filter((row) => !deletedIds.includes(row.IdSeq));
                            setGridData(updateIndexNo(updatedData));
                            setNumRows(updatedData.length);
                            resetTable();
                        } else {
                            setGridData(prev => {
                                const updated = prev.map(item => {
                                    const isSelected = rowsWithStatusD.some(row => row.IdSeq === item.IdSeq);
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
                GetCodeHelpComboVer2('', langCode, 20001, 1, '%', '', '', '', '', signal),
                GetCodeHelpComboVer2('', langCode, 20003, 1, '%', '', '', '', '', signal),

                GetCodeHelpVer2(10010, '%%', '', '', '', '', '1', '', 1, '', 0, 0, 0),
                GetCodeHelpVer2(10009, '%%', '', '', '', '', '1', '', 1, '', 0, 0, 0),
            ]);
            setHelpData01(res1.status === 'fulfilled' ? res1.value?.data || [] : []);
            setHelpData02(res2.status === 'fulfilled' ? res2.value?.data || [] : []);

            setHelpData03(res3.status === 'fulfilled' ? res3.value?.data || [] : []);
            setHelpData04(res4.status === 'fulfilled' ? res4.value?.data || [] : []);
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
                            <DailyAtt08Action
                                handleSearchData={handleSearchData}
                                handleSearchData2={handleSearchData2}
                                handleSaveData={handleSaveData}
                                handleDeleteDataSheet={handleDeleteDataSheet}
                                handleSPRWkMmEmpDays={handleSPRWkMmEmpDays}
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
                            <DailyAtt08Query formDate={formDate}
                                setFormDate={setFormDate}

                                helpData01={helpData01}
                                setHelpData01={setHelpData01}

                                helpData02={helpData02}
                                helpData03={helpData03}
                                helpData04={helpData04}
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


                            />
                        </details>
                        <details
                            className="group [&_summary::-webkit-details-marker]:hidden border-t   bg-white"
                            open
                        >
                            <summary className="flex cursor-pointer items-center justify-between p-1 gap-1.5 border-b text-gray-900" onClick={(e) => e.preventDefault()}>
                                <h2 className="text-[9px] font-medium flex items-center   uppercase text-blue-500">
                                    {t('XỬ LÝ PHÁT SINH NGHỈ PHÉP THÁNG')}
                                </h2>
                            </summary>
                            <DailyAtt08BQuery
                                helpData01={helpData01}
                                YyMm={YyMm}
                                setYyMm={setYyMm}
                                PuSeq={PuSeq2}
                                setPuSeq={setPuSeq2}
                            />
                        </details>
                    </div>

                    <div className="col-start-1 col-end-5 row-start-2 w-full h-full border-t  overflow-auto">
                        <DailyAtt08Table
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


                        />
                    </div>
                </div>
            </div>

        </>
    )
}
