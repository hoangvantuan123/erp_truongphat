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
import { SPRWkItemQ } from '../../../../features/dailyAtt/SPRWkItemQ'
import DailyAtt06Action from '../../../components/actions/salaryMgmt/dailyAtt/dailyAtt06Action'
import DailyAtt06Table from '../../../components/table/salaryMgmt/dailyAtt/dailyAtt06Table'
import DailyAtt06Query from '../../../components/query/salaryMgmt/dailyAtt/dailyAtt06Query'
import { GetCodeHelpVer2 } from '../../../../features/codeHelp/getCodeHelpVer2'


import { GetCodeHelpComboVer2 } from '../../../../features/codeHelp/getCodeHelpComboVer2'
import { WkOverTimeApproveQ } from '../../../../features/hr/dailyAtt/WkOverTimeApprove/WkOverTimeApproveQ'
import { WkOverTimeApproveAUD } from '../../../../features/hr/dailyAtt/WkOverTimeApprove/WkOverTimeApproveAUD'
import { WkOverTimeApproveConfirm } from '../../../../features/hr/dailyAtt/WkOverTimeApprove/WkOverTimeApproveConfirm'

export default function DailyAtt06Page({ permissions, isMobile, canCreate, canEdit, canDelete, controllers,
    cancelAllRequests }) {
    const userFrom = JSON.parse(localStorage.getItem('userInfo'))
    const loadingBarRef = useRef(null);
    const langCode = localStorage.getItem('language') || '6';
    const activeFetchCountRef = useRef(0);
    const { t } = useTranslation()
    const defaultCols = useMemo(() => [
        { title: '', id: 'Status', kind: 'Text', readonly: true, width: 50, hasMenu: true, visible: true, themeOverride: { textDark: "#225588", baseFontStyle: "600 13px" }, trailingRowOptions: { disabled: false }, icon: GridColumnIcon.HeaderLookup },
        { title: t('Xác nhận'), id: 'IsCheck', kind: 'Boolean', readonly: false, width: 80, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
        { title: t('Nhân viên'), id: 'EmpName', kind: 'Text', readonly: true, width: 160, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
        { title: t('Mã nhân viên'), id: 'EmpId', kind: 'Text', readonly: true, width: 140, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
        { title: t('Bộ phận'), id: 'DeptName', kind: 'Text', readonly: true, width: 100, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
        { title: t('Vị trí'), id: 'PosName', kind: 'Text', readonly: true, width: 100, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
        { title: t('Section'), id: 'UMJpName', kind: 'Text', readonly: true, width: 100, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
        { title: t('Ngày làm việc'), id: 'WkDate', kind: 'Date', readonly: true, width: 90, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
        { title: t('Shift'), id: 'ShiftName', kind: 'Text', readonly: true, width: 120, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
        { title: t('Hạng mục OT'), id: 'WkItemName', kind: 'Text', readonly: true, width: 180, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
        { title: t('WorkingTime'), id: 'WorkingTime', kind: 'Number', readonly: true, width: 90, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, contentAlign: "right", },
        { title: t('Thông tin thời gian'), id: 'ERPTimeIn', kind: 'Time', readonly: true, width: 120, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, contentAlign: "right", },
        { title: t('Time Out'), id: 'ERPTimeOut', kind: 'Time', readonly: true, width: 90, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, contentAlign: "right", },
        { title: t('Số tiếng làm thêm'), id: 'DTime', kind: 'Number', readonly: true, width: 140, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, contentAlign: "right", },
        { title: t('Thời gian làm việc (số tiếng)'), id: 'PayDTime', kind: 'Number', readonly: true, width: 180, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, contentAlign: "right", },
        { title: t('LastUserName'), id: 'LastUserName', kind: 'Text', readonly: true, width: 160, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
        { title: t('Remark'), id: 'Remark', kind: 'Text', readonly: false, width: 180, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },

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

    const [itemText, setItemText] = useState([])
    const [searchText, setSearchText] = useState('')
    const [dataSearch, setDataSearch] = useState([])

    const [searchText2, setSearchText2] = useState('')
    const [dataSearch2, setDataSearch2] = useState([])

    const [whName, setWHName] = useState('')
    const [helpData01, setHelpData01] = useState([])
    const [helpData02, setHelpData02] = useState([])
    const [helpData03, setHelpData03] = useState([])
    const [helpData04, setHelpData04] = useState([])
    const [IsCheck, setIsCheck] = useState(false)
    const [WkItemSeq, setWkItemSeq] = useState(null)
    const [UMEmpType, setUMEmpType] = useState(null)
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [formDate, setFormDate] = useState((dayjs()))
    const [toDate, setToDate] = useState(null)
    const [searchText1, setSearchText1] = useState([])
    const [itemText1, setItemText1] = useState('')
    const [itemText2, setItemText2] = useState('')
    const [dataSearch1, setDataSearch1] = useState([])
    const [dataSheetSearch2, setDataSheetSearch2] = useState([])

    const formatDate = (date) => date.format('YYYYMMDD')
    const [cols, setCols] = useState(() =>
        loadFromLocalStorageSheet(
            'daily_att_06_a',
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

        if (!dataSearch?.BeDeptSeq) {
            HandleError([
                {
                    success: false,
                    message: 'Vui lòng chọn bộ phận trước khi tìm kiếm!',
                },
            ]);
            return;
        }

        const searchParams = [
            {
                FromDate: formatDate(formDate), // luôn có
                ToDate: toDate ? formatDate(toDate) : '',
                WkItemSeq: WkItemSeq ? WkItemSeq : '',
                DeptSeq: dataSearch.BeDeptSeq, // luôn có vì đã check ở trên
                EmpSeq: dataSearch2?.EmpSeq ? dataSearch2?.EmpSeq : '',
                UMEmpType: UMEmpType ? UMEmpType : '',
                IsCheck: IsCheck ?? 0,
            },
        ];

        fetchGenericData({
            controllerKey: 'WkOverTimeApproveQ',
            postFunction: WkOverTimeApproveQ,
            searchParams,
            defaultCols: defaultCols,
            useEmptyData: false,
            afterFetch: (data) => {
                setGridData(data);
                setNumRows(data.length);
            },
        });
    }, [formDate, toDate, IsCheck, dataSearch, WkItemSeq, UMEmpType, dataSearch2]);



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
            /*  { key: 'LocationCode', label: 'Mã vị trí' }, */
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
            if (resulA.length > 0) apiCalls.push(WkOverTimeApproveAUD(resulA));

            if (resulU.length > 0) apiCalls.push(WkOverTimeApproveAUD(resulU));

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
                    return found ? { ...item, Status: '', WkItemSeq: found.WkItemSeq } : item;
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
    }, [gridData, canCreate, userFrom]);


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
                GetCodeHelpVer2(10010, '%%', '', '', '', '', '1', '', 1, '', 0, 0, 0),
                GetCodeHelpComboVer2('', langCode, 20030, 1, '%', '', '', '', '', signal),
                GetCodeHelpComboVer2('', langCode, 19999, 1, '%', '3059', '', '', '', signal),
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
                            <DailyAtt06Action
                                handleSearchData={handleSearchData}
                                handleSaveData={handleSaveData}
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
                            <DailyAtt06Query
                                setFormDate={setFormDate}
                                formDate={formDate}
                                setToDate={setToDate}
                                toDate={toDate}
                                IsCheck={IsCheck}
                                setIsCheck={setIsCheck}
                                helpData01={helpData01}
                                helpData02={helpData02}
                                helpData03={helpData03}
                                helpData04={helpData04}

                                
                                setSearchText={setSearchText}
                                searchText={searchText}
                                setDataSearch={setDataSearch}
                                setItemText={setItemText}
                                setUMEmpType={setUMEmpType}
                                UMEmpType={UMEmpType}
                                WkItemSeq={WkItemSeq}
                                setWkItemSeq={setWkItemSeq}


                                setSearchText2={setSearchText2}
                                searchText2={searchText2}
                                setDataSearch2={setDataSearch2}

                                setHelpData04={setHelpData04}

                                setSearchText1={setSearchText1}
                                setItemText1={setItemText1}
                                setDataSearch1={setDataSearch1}
                                setDataSheetSearch2={setDataSheetSearch2}
                                setItemText2={setItemText2}
                            />
                        </details>


                    </div>

                    <div className="col-start-1 col-end-5 row-start-2 w-full h-full border-t  overflow-auto">
                        <DailyAtt06Table
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
