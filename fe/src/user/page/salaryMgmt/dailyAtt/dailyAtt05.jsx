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
import { FilterOutlined } from '@ant-design/icons'
import { HandleSuccess } from '../../default/handleSuccess'
import { ArrowIcon } from '../../../components/icons'

import { GetCodeHelpComboVer2 } from '../../../../features/codeHelp/getCodeHelpComboVer2'
import { GetCodeHelpVer2 } from '../../../../features/codeHelp/getCodeHelpVer2'
import DailyAtt04Action from '../../../components/actions/salaryMgmt/dailyAtt/dailyAtt04Action'
import DailyAtt04Table from '../../../components/table/salaryMgmt/dailyAtt/dailyAtt04Table'
import DailyAtt04Query from '../../../components/query/salaryMgmt/dailyAtt/dailyAtt04Query'
import { SPRWkEmpDdAUD } from '../../../../features/hr/dailyAtt/SPRWkEmpDd/SPRWkEmpDdAUD'
import { SPRWkEmpDdQ } from '../../../../features/hr/dailyAtt/SPRWkEmpDd/SPRWkEmpDdQ'
import DailyAtt05Action from '../../../components/actions/salaryMgmt/dailyAtt/dailyAtt05Action'
import DailyAtt05Query from '../../../components/query/salaryMgmt/dailyAtt/dailyAtt05Query'
import { EmpSPH } from '../../../../features/codeHelp/EmpSPH'
import DailyAtt05Table from '../../../components/table/salaryMgmt/dailyAtt/dailyAtt05Table'
export default function DailyAtt05Page({ permissions, isMobile, canCreate, canEdit, canDelete, controllers,
    cancelAllRequests }) {
    const userFrom = JSON.parse(localStorage.getItem('userInfo'))
    const loadingBarRef = useRef(null);
    const activeFetchCountRef = useRef(0);
    const { t } = useTranslation()
    const langCode = localStorage.getItem('language') || '6';
    const defaultCols = useMemo(() => [
        { title: '', id: 'Status', kind: 'Text', readonly: true, width: 50, hasMenu: true, visible: true, themeOverride: { textDark: "#225588", baseFontStyle: "600 13px" }, trailingRowOptions: { disabled: false }, icon: GridColumnIcon.HeaderLookup },
        { title: t('Nhân viên'), id: 'EmpName', kind: 'Text', readonly: false, width: 180, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, themeOverride: { textHeader: '#DD1144', bgIconHeader: '#DD1144', fontFamily: '' } },
        { title: t('Mã nhân viên'), id: 'EmpID', kind: 'Text', readonly: false, width: 180, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, },
        { title: t('Thuộc bộ phận'), id: 'DeptName', kind: 'Text', readonly: false, width: 160, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, },
        { title: t('Nhóm lương'), id: 'PuName', kind: 'Boolean', readonly: false, width: 140, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
        { title: t('Hình thái lương'), id: 'PtName', kind: 'Text', readonly: false, width: 140, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
        { title: t('Vị trí'), id: 'UMJpName', kind: 'Text', readonly: false, width: 140, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },


        { title: t('Ngày công làm việc thực tế'), id: '11', kind: 'Text', readonly: false, width: 160, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
        { title: t('Giờ vào thực tế'), id: '29', kind: 'Text', readonly: false, width: 140, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
        { title: t('Thời gian làm việc quy định'), id: '30', kind: 'Text', readonly: false, width: 180, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
        { title: t('Chủ nhật ca ngày 200%'), id: '31', kind: 'Text', readonly: false, width: 160, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
        { title: t('Giờ về (ERP)'), id: '32', kind: 'Text', readonly: false, width: 140, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
        { title: t('Về sớm'), id: '33', kind: 'Text', readonly: false, width: 100, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
        { title: t('Đi muộn'), id: '34', kind: 'Text', readonly: false, width: 100, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
        { title: t('Làm ca đêm ngày lễ, tết 390%'), id: '35', kind: 'Text', readonly: false, width: 200, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
        { title: t('Giờ vào (ERP)'), id: '36', kind: 'Text', readonly: false, width: 140, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
        { title: t('Làm ngày lễ tết 300%'), id: '38', kind: 'Text', readonly: false, width: 160, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
        { title: t('Chủ nhật ca đêm 270%'), id: '39', kind: 'Text', readonly: false, width: 160, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
        { title: t('Làm ca đêm (30%)'), id: '40', kind: 'Text', readonly: false, width: 140, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
        { title: t('Thêm giờ ca đêm 200%'), id: '41', kind: 'Text', readonly: false, width: 160, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
        { title: t('Thêm giờ ca ngày 150%'), id: '42', kind: 'Text', readonly: false, width: 160, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
        { title: t('Giờ về thực tế'), id: '43', kind: 'Text', readonly: false, width: 140, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
        { title: t('Về sớm ca đêm'), id: '49', kind: 'Text', readonly: false, width: 140, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
        { title: t('Đi muộn ca đêm'), id: '50', kind: 'Text', readonly: false, width: 140, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
        { title: t('Thêm giờ ca đêm 210%'), id: '74', kind: 'Text', readonly: false, width: 160, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
        { title: t('Số giờ làm việc hành chính'), id: '80', kind: 'Text', readonly: false, width: 180, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
        { title: t('Nghỉ 45 phút ca đêm (130%)'), id: '82', kind: 'Text', readonly: false, width: 180, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } }
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
    const [formData, setFormData] = useState(null)
    const [toDate, setToDate] = useState(dayjs())
    const [fromDate, setFromDate] = useState(dayjs)
    const [SMHolidayType, setSMHolidayType] = useState('')
    const [HolidayName, setHolidayName] = useState('')
    const formatDate = (date) => date.format('YYYYMMDD')
    const [IsCommon, setIsCommon] = useState(false)
    const [cols, setCols] = useState(() =>
        loadFromLocalStorageSheet(
            'daily_att_05_a',
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
        if (!fromDate) {
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
                WkDate: fromDate ? formatDate(fromDate) : '',
                PtSeq: '',
                PuSeq: '',
                DeptSeq: '',
                EmpSeq: '',
            }
        ]

        fetchGenericData({
            controllerKey: 'SPRWkEmpDdQ',
            postFunction: SPRWkEmpDdQ,
            searchParams,
            defaultCols: defaultCols,
            useEmptyData: true,
            afterFetch: (data) => {
                setGridData(data);
                setNumRows(data.length);
            },
        });

    }, [fromDate,]);



    const handleSaveData = useCallback(async () => {
        if (!canCreate) return true;
        const TimeColumns = [11, 29, 30, 31, 32, 33, 34, 35, 36, 38, 39, 40, 41, 42, 43, 49, 50, 74, 80, 82];
        const resulA = filterValidRows(gridData, 'A').map(item => ({
            ...item,
            WorkingTag: 'A',
            ROW_IDX: item.IdxNo,
            WkDate: fromDate ? formatDate(fromDate) : '',


        }));
        const resulU = filterValidRows(gridData, 'U').map(item => ({
            ...item,
            WorkingTag: 'U',
            ROW_IDX: item.IdxNo,
            WkDate: fromDate ? formatDate(fromDate) : '',

        }));


        const requiredFields = [
            { key: 'EmpSeq', label: 'Nhân viên' },
            { key: 'WkDate', label: 'Ngày yêu cầu' },
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
        const flattenToWKItem = (rows) =>
            rows.flatMap(row =>
                TimeColumns.map(seq => ({
                    WkDate: row.WkDate,
                    DTCnt: String(row[seq] || 0).padStart(4, '0'),
                    WkItemSeq: seq,
                    Id: row.Id,
                    Status: row.Status,
                    EmpName: row.EmpName,
                    EmpID: row.EmpID,
                    DeptName: row.DeptName,
                    PuName: row.PuName,
                    PtName: row.PtName,
                    UMJpName: row.UMJpName,
                    IdxNo: row.IdxNo,
                    EmpSeq: row.EmpSeq,
                    DeptSeq: row.DeptSeq,
                    UMJdSeq: row.UMJdSeq,
                    WorkingTag: row.WorkingTag,
                    ROW_IDX: row.ROW_IDX,
                }))
            );

        const resulA_WK = flattenToWKItem(resulA);
        const resulU_WK = flattenToWKItem(resulU);
        togglePageInteraction(true);
        loadingBarRef.current?.continuousStart();
        // Chuyển resulA/U thành mảng phẳng dạng WKItem


        try {
            const apiCalls = [];
            if (resulA.length > 0) apiCalls.push(SPRWkEmpDdAUD(resulA_WK));

            if (resulU.length > 0) apiCalls.push(SPRWkEmpDdAUD(resulU_WK));

            const results = await Promise.all(apiCalls);

            const isSuccess = results.every(result => result?.success);

            if (!isSuccess) {
                console.log("results", results)
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
                    const found = [...addMenuData, ...uMenuData].find(x => x?.ROW_IDX === item?.IdxNo);
                    return found ? { ...item, Status: '', WkDate: found.WkDate } : item;
                });
                return updateIndexNo(updated);
            });
            HandleSuccess([
                {
                    success: true,
                    message: 'Thành công',
                },
            ]);
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
            const TimeColumns = [11, 29, 30, 31, 32, 33, 34, 35, 36, 38, 39, 40, 41, 42, 43, 49, 50, 74, 80, 82];
            const rowsWithStatusD = selectedRows
                .filter((row) => !row.Status || row.Status === 'U' || row.Status === 'D' || row.Status === 'E')
                .map((row) => ({
                    ...row,
                    Status: 'D',
                    WorkingTag: 'D',
                    ROW_IDX: row.IdxNo,
                    WkDate: fromDate ? formatDate(fromDate) : '',
                }));

            const flattenToWKItem = (rows) =>
                rows.flatMap(row =>
                    TimeColumns.map(seq => ({
                        WkDate: row.WkDate,
                        DTCnt: String(row[seq] || 0).padStart(4, '0'),
                        WkItemSeq: seq,
                        Id: row.Id,
                        Status: row.Status,
                        EmpName: row.EmpName,
                        EmpID: row.EmpID,
                        DeptName: row.DeptName,
                        PuName: row.PuName,
                        PtName: row.PtName,
                        UMJpName: row.UMJpName,
                        IdxNo: row.IdxNo,
                        EmpSeq: row.EmpSeq,
                        DeptSeq: row.DeptSeq,
                        UMJdSeq: row.UMJdSeq,
                        WorkingTag: row.WorkingTag,
                        ROW_IDX: row.ROW_IDX,
                    }))
                );
            const rowsWithStatusA = selectedRows.filter((row) => row.Status === 'A');
            const resulD_WK = flattenToWKItem(rowsWithStatusD);
            const finish = () => {
                loadingBarRef.current?.complete();
                togglePageInteraction(false);
            };

            if (resulD_WK.length > 0) {
                SPRWkEmpDdAUD(resulD_WK)
                    .then((response) => {
                        if (response.success) {
                            const deletedIds = resulD_WK.map((item) => item.IdxNo);
                            const updatedData = gridData.filter((row) => !deletedIds.includes(row.IdxNo));
                            setGridData(updateIndexNo(updatedData));
                            setNumRows(updatedData.length);
                            resetTable();
                        } else {
                            setGridData(prev => {
                                const updated = prev.map(item => {
                                    const isSelected = resulD_WK.some(row => row.ROW_IDX === item.IdxNo);
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
                        loadingBarRef.current?.complete();
                        togglePageInteraction(false);
                        HandleError([
                            {
                                success: false,
                                message: error.message || 'Đã xảy ra lỗi khi xóa!',
                            },
                        ]);
                    })
                    .finally(() => {
                        loadingBarRef.current?.complete();
                        togglePageInteraction(false);
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
        [gridData, selection, editedRows, fromDate]
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
            ]);
            setHelpData01(res1.status === 'fulfilled' ? res1.value?.data || [] : []);
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
                            <DailyAtt05Action
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
                            <DailyAtt05Query

                                helpData01={helpData01}
                                setSMHolidayType={setSMHolidayType}
                                fromDate={fromDate}
                                setFromDate={setFromDate}
                                HolidayName={HolidayName}
                                setHolidayName={setHolidayName}
                                IsCommon={IsCommon}
                                setIsCommon={setIsCommon}
                            />
                        </details>


                    </div>

                    <div className="col-start-1 col-end-5 row-start-2 w-full h-full border-t  overflow-auto">
                        <DailyAtt05Table
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
