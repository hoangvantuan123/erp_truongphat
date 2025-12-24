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

import DailyAtt01Action from '../../../components/actions/salaryMgmt/dailyAtt/dailyAtt01Action'
import DailyAtt01Table from '../../../components/table/salaryMgmt/dailyAtt/dailyAtt01Table'
import { SPRWkItemAUD } from '../../../../features/hr/dailyAtt/SPRWkItem/SPRWkItemAUD'
import { SPRWkItemQ } from '../../../../features/hr/dailyAtt/SPRWkItem/SPRWkItemQ'
export default function DailyAtt01Page({ permissions, isMobile, canCreate, canEdit, canDelete, controllers,
    cancelAllRequests }) {
    const userFrom = JSON.parse(localStorage.getItem('userInfo'))
    const loadingBarRef = useRef(null);
    const activeFetchCountRef = useRef(0);
    const langCode = localStorage.getItem('language') || '6';
    const { t } = useTranslation()
    const defaultCols = useMemo(() => [
        { title: '', id: 'Status', kind: 'Text', readonly: true, width: 50, hasMenu: true, visible: true, themeOverride: { textDark: "#225588", baseFontStyle: "600 13px" }, trailingRowOptions: { disabled: false }, icon: GridColumnIcon.HeaderLookup },
        { title: t('Tên chấm công'), id: 'WkItemName', kind: 'Text', readonly: false, width: 200, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, themeOverride: { textHeader: '#DD1144', bgIconHeader: '#DD1144', fontFamily: '' } },
        { title: t('Tên viết tắt chấm công'), id: 'WkItemSName', kind: 'Text', readonly: false, width: 180, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
        { title: t('Số theo vị trí dấu thập phân'), id: 'DecPntCnt', kind: 'Number', readonly: false, width: 60, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, contentAlign: "right", },
        { title: t('Có lý do nghỉ ngày làm không'), id: 'IsAbsReason', kind: 'Boolean', readonly: false, width: 80, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
        { title: t('Có hoặc không nghỉ làm trong thời gian dài'), id: 'IsLongAbs', kind: 'Boolean', readonly: false, width: 80, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
        { title: t('Chủng loại chấm công nghỉ ngày làm'), id: 'AbsWkSort', kind: 'Text', readonly: false, width: 120, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
        { title: t('Có lương không'), id: 'IsPaid', kind: 'Boolean', readonly: false, width: 80, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
        { title: t('Có/không áp dụng nửa ngày phép'), id: 'IsHalf', kind: 'Boolean', readonly: false, width: 80, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
        { title: t('Khấu trừ số tiền, giá trị'), id: 'IsDeduc', kind: 'Boolean', readonly: false, width: 80, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
        { title: t('Có/không áp dụng thứ 7'), id: 'IsSat', kind: 'Boolean', readonly: false, width: 80, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
        { title: t('Có hoặc không áp dụng chủ nhật'), id: 'IsSun', kind: 'Boolean', readonly: false, width: 80, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
        { title: t('Có/không áp dụng ngày nghỉ'), id: 'IsHoli', kind: 'Boolean', readonly: false, width: 80, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
        { title: t('Có/không hạn mức'), id: 'IsLimit', kind: 'Boolean', readonly: false, width: 80, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
        { title: t('Chủng loại nhóm hạn mức'), id: 'LimitGrp', kind: 'Text', readonly: false, width: 140, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
        { title: t('Phương thức tạo lập'), id: 'AppMth', kind: 'Text', readonly: false, width: 120, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
        { title: t('Loại nhóm phương thức hình thành'), id: 'WkMthGrp', kind: 'Text', readonly: false, width: 120, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
        { title: t('Không sử dụng'), id: 'IsUse', kind: 'Boolean', readonly: false, width: 80, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
        { title: t('Thứ tự'), id: 'DispSeq', kind: 'Number', readonly: false, width: 70, hasMenu: true, visible: true, trailingRowOptions: { disabled: true }, contentAlign: "right", },
        { title: t('Có in hay không'), id: 'IsPrint', kind: 'Boolean', readonly: false, width: 80, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
        { title: t('Ghi chú'), id: 'Remark', kind: 'Text', readonly: false, width: 250, hasMenu: true, visible: true, trailingRowOptions: { disabled: true } },
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
    const formatDate = (date) => date.format('YYYYMMDD')
    const [cols, setCols] = useState(() =>
        loadFromLocalStorageSheet(
            'daily_att_01_a',
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
        const searchParams = [
            {
                SMWkItemType: 3007001,
                SMDTCType: 3068001
            }
        ]

        fetchGenericData({
            controllerKey: 'SPRWkItemQ',
            postFunction: SPRWkItemQ,
            searchParams,
            defaultCols: defaultCols,
            useEmptyData: true,
            afterFetch: (data) => {
                setGridData(data);
                setNumRows(data.length);
            },
        });

    }, []);


    const handleSaveData = useCallback(async () => {
        if (!canCreate) return true;

        const resulA = filterValidRows(gridData, 'A').map(item => ({
            ...item,
            WorkingTag: 'A',
            SMWkItemType: '3007001',
            SMDTCType: '3068001'
        }));
        const resulU = filterValidRows(gridData, 'U').map(item => ({
            ...item,
            WorkingTag: 'U',
            SMWkItemType: '3007001',
            SMDTCType: '3068001'
        }));


        const requiredFields = [
            { key: 'WkItemName', label: 'Tên chấm công' },
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
            if (resulA.length > 0) apiCalls.push(SPRWkItemAUD(resulA));

            if (resulU.length > 0) apiCalls.push(SPRWkItemAUD(resulU));

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
                    return found ? { ...item, Status: '', WkItemSeq: found.WkItemSeq, SMWkItemType: found.SMWkItemType, SMDTCType: found.SMDTCType } : item;
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
                SPRWkItemAUD(rowsWithStatusD)
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
                GetCodeHelpComboVer2('', langCode, 19998, 1, '%', '3069', '', '', '', signal),
                GetCodeHelpComboVer2('', langCode, 19998, 1, '%', '3102', '', '', '', signal),
                GetCodeHelpComboVer2('', langCode, 19998, 1, '%', '3070', '', '', '', signal),
            ]);
            setHelpData01(res1.status === 'fulfilled' ? res1.value?.data || [] : []);
            setHelpData02(res2.status === 'fulfilled' ? res2.value?.data || [] : []);
            setHelpData03(res3.status === 'fulfilled' ? res3.value?.data || [] : []);
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
                            <DailyAtt01Action
                                handleSearchData={handleSearchData}
                                handleSaveData={handleSaveData}
                                handleDeleteDataSheet={handleDeleteDataSheet}
                            />
                        </div>

                    </div>

                    <div className="col-start-1 col-end-5 row-start-2 w-full h-full border-t  overflow-auto">
                        <DailyAtt01Table
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
                            helpData02={helpData02}
                            helpData03={helpData03}
                            setHelpData01={setHelpData01}
                            setHelpData02={setHelpData02}
                            setHelpData03={setHelpData03}

                        />
                    </div>
                </div>
            </div>

        </>
    )
}
