import { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet'
import { Input, Space, Form, Row, Col, Typography, message, Splitter, notification } from 'antd'
const { Title, Text } = Typography
import { debounce } from 'lodash'
import { FilterOutlined } from '@ant-design/icons'
import { CompactSelection, GridColumnIcon } from '@glideapps/glide-data-grid'
import useKeydownHandler from '../../../components/hooks/sheet/useKeydownHandler'
import { loadFromLocalStorageSheet } from '../../../../localStorage/sheet/sheet'
import { onRowAppended } from '../../../components/sheet/js/onRowAppended'
import { generateEmptyData } from '../../../components/sheet/js/generateEmptyData'
import TopLoadingBar from 'react-top-loading-bar';
import { togglePageInteraction } from '../../../../utils/togglePageInteraction'
import { filterValidRows } from '../../../../utils/filterUorA'
import { updateIndexNo } from '../../../components/sheet/js/updateIndexNo'
import dayjs from 'dayjs'

import ErrorListModal from '../../default/errorListModal'
import { HandleError } from '../../default/handleError'
import Recruit06A1Table from '../../../components/table/hrRecruit/regi/recruit06A1Table'
import Recruit06A2Table from '../../../components/table/hrRecruit/regi/recruit06A2Table'
import Recruit06Action from '../../../components/actions/hrRecruit/regi/recruit06Action'
import Recruit06Query from '../../../components/query/hrRecruit/regi/recruit06Query'


import { HrCareerItemRecruitA } from '../../../../features/hr/HrCareerItemRecruit/HrCareerItemRecruitA'
import { HrCareerItemRecruitU } from '../../../../features/hr/HrCareerItemRecruit/HrCareerItemRecruitU'
import { HrCareerItemRecruitD } from '../../../../features/hr/HrCareerItemRecruit/HrCareerItemRecruitD'
import { HrCareerItemRecruitQ } from '../../../../features/hr/HrCareerItemRecruit/HrCareerItemRecruitQ'
import { HrCareerRecruitA } from '../../../../features/hr/HrCareerRecruit/HrCareerRecruitA'
import { HrCareerRecruitU } from '../../../../features/hr/HrCareerRecruit/HrCareerRecruitU'
import { HrCareerRecruitD } from '../../../../features/hr/HrCareerRecruit/HrCareerRecruitD'
import { HrCareerRecruitQ } from '../../../../features/hr/HrCareerRecruit/HrCareerRecruitQ'
import { EmpSPInterviewH } from '../../../../features/codeHelp/EmpSPInterviewH'
export default function HrRecruitment06({ permissions, isMobile, canCreate, canEdit, canDelete, controllers,
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
            title: t('Mã nhân viên'),
            id: 'EmpID',
            kind: 'Text',
            readonly: false,
            width: 130,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
            group: 'Thông tin chung',
            themeOverride: {
                textHeader: '#DD1144',
                bgIconHeader: '#DD1144',
                fontFamily: '',
            },
        },

        {
            title: t('1584'),
            id: 'EmpName',
            kind: 'Text',
            readonly: false,
            width: 220,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
            group: 'Thông tin chung',
        },

        {
            title: t('Giới tính'),
            id: 'SMSexName',
            kind: 'Text',
            readonly: false,
            width: 160,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
            group: 'Thông tin chung',
        },
        {
            title: t('CMND/CCCD'),
            id: 'ResidID',
            kind: 'Text',
            readonly: false,
            width: 160,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
            group: 'Thông tin chung',
            themeOverride: {
                textHeader: '#DD1144',
                bgIconHeader: '#DD1144',
                fontFamily: '',
            },
        },
        {
            title: t('Ngày tuyển dụng'),
            id: 'InterviewDate',
            kind: 'Text',
            readonly: false,
            width: 130,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
            group: 'Thông tin chung',
        },
        {
            title: t('Tên công ty'),
            id: 'CompanyName',
            kind: 'Text',
            readonly: false,
            width: 200,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
            group: 'Kinh nghiệm'
        },
        {
            title: t('Chức vụ'),
            id: 'Position',
            kind: 'Text',
            readonly: false,
            width: 150,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true }, group: 'Kinh nghiệm'
        },
        {
            title: t('Quy mô LĐ'),
            id: 'LaborScale',
            kind: 'Text',
            readonly: false,
            width: 130,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true }, group: 'Kinh nghiệm'
        },
        {
            title: t('Năm vào công ty'),
            id: 'JoinDate',
            kind: 'Text',
            readonly: false,
            width: 130,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true }, group: 'Kinh nghiệm'
        },
        {
            title: t('Năm thôi việc'),
            id: 'ResignDate',
            kind: 'Text',
            readonly: false,
            width: 130,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true }, group: 'Kinh nghiệm'
        },
        {
            title: t('Công việc phụ trách'),
            id: 'JobDescription',
            kind: 'Text',
            readonly: false,
            width: 200,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true }, group: 'Kinh nghiệm'
        },
        {
            title: t('Mức lương'),
            id: 'Salary',
            kind: 'Text',
            readonly: false,
            width: 130,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true }, group: 'Kinh nghiệm'
        },
        {
            title: t('Lý do xin nghỉ'),
            id: 'ReasonForLeaving',
            kind: 'Text',
            readonly: false,
            width: 200,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true }, group: 'Kinh nghiệm'
        }
    ], [t]);
    const defaultColsB = useMemo(() => [
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
            title: t('Tên dự án'),
            id: 'ProjectName',
            kind: 'Text',
            readonly: false,
            width: 200,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
            group: 'Thông tin dự án'
        },
        {
            title: t('Ngày bắt đầu'),
            id: 'StartDate',
            kind: 'Text',
            readonly: false,
            width: 130,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true }, group: 'Thông tin dự án'
        },
        {
            title: t('Ngày kết thúc'),
            id: 'EndDate',
            kind: 'Text',
            readonly: false,
            width: 130,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true }, group: 'Thông tin dự án'
        },
        {
            title: t('Công việc phụ trách'),
            id: 'JobDescription',
            kind: 'Text',
            readonly: false,
            width: 200,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true }, group: 'Thông tin dự án'
        },
        {
            title: t('Số năm'),
            id: 'ProjectYears',
            kind: 'Text',
            readonly: false,
            width: 100,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true }, group: 'Thông tin dự án'
        },
        {
            title: t('Khái quát dự án'),
            id: 'ProjectSummary',
            kind: 'Text',
            readonly: false,
            width: 250,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true }, group: 'Thông tin dự án'
        }
    ], [t]);


    const [gridData, setGridData] = useState([])
    const [gridDataB, setGridDataB] = useState([])
    const [selection, setSelection] = useState({
        columns: CompactSelection.empty(),
        rows: CompactSelection.empty()
    })
    const [selectionB, setSelectionB] = useState({
        columns: CompactSelection.empty(),
        rows: CompactSelection.empty()
    })
    const [showSearch, setShowSearch] = useState(false)
    const [showSearchB, setShowSearchB] = useState(false)
    const [addedRows, setAddedRows] = useState([])
    const [addedRowsB, setAddedRowsB] = useState([])
    const [dataSeq, setDataSeq] = useState([])
    const [editedRowsB, setEditedRowsB] = useState([])
    const [numRowsToAdd, setNumRowsToAdd] = useState(null)
    const [numRowsToAddB, setNumRowsToAddB] = useState(null)
    const [numRows, setNumRows] = useState(0)
    const [numRowsB, setNumRowsB] = useState(0)
    const [openHelp, setOpenHelp] = useState(false)
    const [isCellSelected, setIsCellSelected] = useState(false)
    const [dataRootMenu, setDataRootMenu] = useState([])
    const [dataSubMenu, setDataSubMenu] = useState([])
    const [helpData01, setHelpData01] = useState([])
    const [helpData02, setHelpData02] = useState([])
    const [formData, setFormData] = useState(dayjs().startOf('month'))
    const [toDate, setToDate] = useState(dayjs())
    const [keyItem2, setKeyItem2] = useState('')
    const [keyItem3, setKeyItem3] = useState('')
    const [searchText, setSearchText] = useState('')
    const [searchText1, setSearchText1] = useState([])
    const [itemText, setItemText] = useState([])
    const [itemText1, setItemText1] = useState([])
    const [dataSearch, setDataSearch] = useState([])
    const [dataSearch1, setDataSearch1] = useState([])
    const [dataSheetSearch, setDataSheetSearch] = useState([])
    const [UMEmpType, setUMEmpType] = useState(null)
    const formatDate = (date) => date.format('YYYYMMDD')
    const [modal2Open, setModal2Open] = useState(false)
    const [errorData, setErrorData] = useState(null)
    const [cols, setCols] = useState(() =>
        loadFromLocalStorageSheet(
            'recruitment06_a1_a',
            defaultCols.filter((col) => col.visible)
        )
    )
    const [colsB, setColsB] = useState(() =>
        loadFromLocalStorageSheet(
            'recruitment06_a2_a',
            defaultColsB.filter((col) => col.visible)
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
                EmpSPInterviewH({ KeyItem1: 'A', signal }),
            ]);
            setHelpData01(res1.status === 'fulfilled' ? res1.value?.data || [] : []);
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
            KeyItem1: formData ? formatDate(formData) : '',
            KeyItem2: toDate ? formatDate(toDate) : '',
            KeyItem3: keyItem3 ? keyItem3 : '',
            KeyItem4: keyItem2 ? keyItem2 : '',
        }
        fetchGenericData({
            controllerKey: 'HrCareerRecruitQ',
            postFunction: HrCareerRecruitQ,
            searchParams,
            defaultCols: defaultCols,
            useEmptyData: true,
            afterFetch: (data) => {
                setGridData(data);
                setNumRows(data.length);
            },
        });


    }, [formData, toDate, keyItem3, keyItem2])





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

    const handleRowAppendB = useCallback(
        (numRowsToAddB) => {
            if (canCreate === false) {
                message.warning('Bạn không có quyền thêm dữ liệu')
                return
            }
            if (dataSeq?.IdSeq == null || dataSeq?.IdSeq === '') {
                message.warning('Bạn cần chọn một hàng dữ liệu trước khi thêm dữ liệu vào bảng phụ.')
                return;
            }
            onRowAppended(colsB, setGridDataB, setNumRowsB, setAddedRowsB, numRowsToAddB)
        },
        [colsB, setGridDataB, setNumRowsB, setAddedRowsB, numRowsToAddB, dataSeq]
    )





    const handleDeleteDataSheet = useCallback(
        (e) => {
            if (canDelete === false) {
                return;
            }

            const selectedRows = getSelectedRows();

            const rowsWithStatusD = selectedRows
                .filter((row) => !row.Status || row.Status === 'U' || row.Status === 'D' || row.Status === "E")
                .map((row) => {
                    row.Status = 'D';
                    return { IdSeq: row.IdSeq };
                });

            const rowsWithStatusA = selectedRows.filter((row) => row.Status === 'A');


            if (rowsWithStatusD.length > 0) {

                HrCareerRecruitD(rowsWithStatusD)
                    .then((response) => {
                        if (response.success) {
                            const deletedIds = rowsWithStatusD.map((item) => item.IdSeq);
                            const updatedData = gridData.filter((row) => !deletedIds.includes(row.IdSeq));
                            setGridData(updateIndexNo(updatedData));
                            setNumRows(updatedData.length);
                            resetTable();
                        } else {
                            HandleError([
                                {
                                    success: false,
                                    message: t(response?.message) || 'Đã xảy ra lỗi khi xóa!',
                                },
                            ]);
                            setGridData(prev => {
                                const updated = prev.map(item => {
                                    const isSelected = rowsWithStatusD.some(row => row.IdxNo === item.IdxNo);
                                    return isSelected ? { ...item, Status: 'E' } : item;
                                });
                                return updated;
                            });
                        }
                    })
                    .catch((error) => {
                        HandleError([
                            {
                                success: false,
                                message: t(error?.message) || 'Đã xảy ra lỗi khi xóa!',
                            },
                        ]);
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
        [gridData, selection]
    );


    const handleSaveData = useCallback(async () => {
        if (!canCreate) return true;

        const resulA = filterValidRows(gridData, 'A').map(item => ({
            ...item,
        }));
        const resulU = filterValidRows(gridData, 'U').map(item => ({
            ...item,
        }));
        const requiredFields = [
            { key: 'EmpSeq', label: t('Nhân viên') },
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
            if (resulA.length > 0) apiCalls.push(HrCareerRecruitA(resulA));
            if (resulU.length > 0) apiCalls.push(HrCareerRecruitU(resulU));

            const results = await Promise.all(apiCalls);

            const isSuccess = results.every(result => result?.success);


            if (!isSuccess) {
                HandleError(results)
                return;
            }

            const [addA, addU] =
                resulA.length && resulU.length
                    ? results
                    : resulA.length
                        ? [results[0], []]
                        : [[], results[0]];

            const addAData = addA?.data || [];
            const addUData = addU?.data || [];



            setGridData(prev => {
                const updated = prev.map(item => {
                    const found = [...addAData, ...addUData].find(x => x?.IdxNo === item?.IdxNo);
                    return found ? { ...item, Status: '', IdSeq: found.IdSeq } : item;
                });
                return updateIndexNo(updated);
            });

        } catch (error) {
            HandleError([
                {
                    success: false,
                    message: t(error?.message) || 'Đã xảy ra lỗi khi xóa!',
                },
            ]);
        } finally {
            loadingBarRef.current?.complete();
            togglePageInteraction(false);
        }
    }, [gridData, canCreate]);
    const getSelectedRowsData = () => {
        const selectedRows = selection.rows.items;

        return selectedRows.flatMap(([start, end]) =>
            Array.from({ length: end - start }, (_, i) => gridData[start + i]).filter((row) => row !== undefined)
        );
    };

    useEffect(() => {
        const data = getSelectedRowsData();

        if (!data || data.length === 0) return;

        const CareerSeq = data[0]?.IdSeq;
        if (CareerSeq == null || CareerSeq === '') return;

        setDataSeq(data[0]);
        const searchParams = {
            KeyItem5: 'A',
            KeyItem6: CareerSeq,
        }
        fetchGenericData({
            controllerKey: 'HrCareerItemRecruitQ',
            postFunction: HrCareerItemRecruitQ,
            searchParams,
            defaultCols: defaultColsB,
            useEmptyData: true,
            afterFetch: (data) => {
                setGridDataB(data);
                setNumRowsB(data.length);
            },
        });



    }, [selection.rows.items]);

    const resetTableB = () => {
        setSelectionB({
            columns: CompactSelection.empty(),
            rows: CompactSelection.empty()
        })
    }
    const getSelectedRows2 = () => {
        return selectionB.rows.items.flatMap(([start, end]) =>
            gridDataB.slice(start, end).filter(Boolean)
        );
    };

    const handleDeleteDataSheet2 = useCallback(
        (e) => {
            if (canDelete === false) {
                return;
            }

            const selectedRows = getSelectedRows2();

            const rowsWithStatusD = selectedRows
                .filter(row => !row.Status || row.Status === 'U' || row.Status === 'D' || row.Status === 'E')
                .map(row => ({
                    ...row,
                    Status: 'D'
                }));

            const rowsWithStatusA = selectedRows.filter((row) => row.Status === 'A');


            if (rowsWithStatusD.length > 0) {

                HrCareerItemRecruitD(rowsWithStatusD)
                    .then((response) => {
                        if (response.success) {
                            const deletedIds = rowsWithStatusD.map((item) => item.IdxNo);
                            const updatedData = gridDataB.filter((row) => !deletedIds.includes(row.IdxNo));
                            setGridDataB(updateIndexNo(updatedData));
                            setNumRowsB(updatedData.length);
                            resetTableB();
                        } else {
                            HandleError([
                                {
                                    success: false,
                                    message: t(response?.message) || 'Đã xảy ra lỗi khi xóa!',
                                },
                            ]);
                            setModal2Open(true);
                            setErrorData(response?.errors || []);
                        }
                    })
                    .catch((error) => {
                        HandleError([
                            {
                                success: false,
                                message: t(error?.message) || 'Đã xảy ra lỗi khi xóa!',
                            },
                        ]);
                    });
            }

            if (rowsWithStatusA.length > 0) {
                const idsWithStatusA = rowsWithStatusA.map((row) => row.Id);
                const remainingRows = gridDataB.filter((row) => !idsWithStatusA.includes(row.Id));
                setGridDataB(updateIndexNo(remainingRows));
                setNumRowsB(remainingRows.length);
                resetTableB();
            }
        },
        [gridDataB, selectionB, editedRowsB]
    );

    const handleSaveData2 = useCallback(async () => {
        if (!canCreate) return true;

        const resulA = filterValidRows(gridDataB, 'A').map(item => ({
            ...item,
            CareerRecruitSeq: dataSeq?.IdSeq || item.CareerRecruitSeq,
            EmpSeq: dataSeq?.EmpSeq || item.EmpSeq,
        }));
        const resulU = filterValidRows(gridDataB, 'U').map(item => ({
            ...item,
            EmpSeq: dataSeq?.EmpSeq || item.EmpSeq,
        }));
        const requiredFields = [
            { key: 'EmpSeq', label: t('Nhân viên') },
            { key: 'CareerRecruitSeq', label: t('Khóa liên kết nhân viên') },
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
            if (resulA.length > 0) apiCalls.push(HrCareerItemRecruitA(resulA));
            if (resulU.length > 0) apiCalls.push(HrCareerItemRecruitU(resulU));

            const results = await Promise.all(apiCalls);

            const isSuccess = results.every(result => result?.success);


            if (!isSuccess) {
                HandleError(results)
                return;
            }

            const [addA, addU] =
                resulA.length && resulU.length
                    ? results
                    : resulA.length
                        ? [results[0], []]
                        : [[], results[0]];

            const addAData = addA?.data || [];
            const addUData = addU?.data || [];



            setGridDataB(prev => {
                const updated = prev.map(item => {
                    const found = [...addAData, ...addUData].find(x => x?.IdxNo === item?.IdxNo);
                    return found ? { ...item, Status: '', IdSeq: found.IdSeq } : item;
                });
                return updateIndexNo(updated);
            });

        } catch (error) {
            HandleError([
                {
                    success: false,
                    message: t(error?.message) || 'Đã xảy ra lỗi khi xóa!',
                },
            ]);
        } finally {
            loadingBarRef.current?.complete();
            togglePageInteraction(false);
        }
    }, [gridDataB, canCreate, dataSeq]);

    const handleSearchData2 = useCallback(async () => {
        if (!dataSeq?.IdSeq) return;

        const searchParams = {
            KeyItem5: 'A',
            KeyItem6: dataSeq.IdSeq,
        };

        fetchGenericData({
            controllerKey: 'HrCareerItemRecruitQ',
            postFunction: HrCareerItemRecruitQ,
            searchParams,
            defaultCols: defaultColsB,
            useEmptyData: true,
            afterFetch: (data) => {
                setGridDataB(data);
                setNumRowsB(data.length);
            },
        });
    }, [dataSeq]);

    return (
        <>
            <Helmet>
                <title>{t('Đăng ký thông tin ngoại ngữ')}</title>
            </Helmet>
            <TopLoadingBar color="blue" height={2} ref={loadingBarRef} />
            <div className="bg-slate-50 h-[calc(100vh-35px)] overflow-hidden">
                <div className="flex flex-col  h-full">
                    <div className="col-start-1 col-end-5 row-start-1 w-full  ">
                        <div className="flex p-2 items-end justify-end">
                            <Recruit06Action
                                handleSearchData={handleSearchData}
                                handleDeleteDataSheet={handleDeleteDataSheet}
                                handleSaveData={handleSaveData}
                                handleDeleteDataSheet2={handleDeleteDataSheet2}
                                handleSaveData2={handleSaveData2}
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
                            <Recruit06Query
                                formData={formData}
                                setFormData={setFormData}
                                toDate={toDate}
                                setToDate={setToDate}
                                setKeyItem3={setKeyItem3}
                                setKeyItem2={setKeyItem2}
                                keyItem2={keyItem2}
                                keyItem3={keyItem3}

                            />
                        </details>
                    </div>

                    <div className="col-start-1 col-end-5 row-start-2 w-full h-full rounded-lg ">
                        <Splitter layout="vertical" >
                            <Splitter.Panel size={45}>
                                <Recruit06A1Table
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
                                    setHelpData01={setHelpData01}
                                    helpData01={helpData01}
                                />
                            </Splitter.Panel>
                            <Splitter.Panel size={6} >
                                <div className="h-full p-2 border-t border-b overflow-auto">
                                    <Form >
                                        <Row className="gap-4 flex items-center ">

                                            <Col>
                                                <Form.Item
                                                    label={<span className="uppercase text-[10px]">{t('Nhân viên')}</span>}
                                                    style={{ marginBottom: 0 }}
                                                    labelCol={{ style: { marginBottom: 2, padding: 0 } }}
                                                    wrapperCol={{ style: { padding: 0 } }}
                                                >
                                                    <Space>
                                                        <Input
                                                            placeholder=""
                                                            className="w-[250px]"
                                                            size="middle"
                                                            readOnly
                                                            value={dataSeq?.EmpName}
                                                            style={{ backgroundColor: '#e8f0ff' }}
                                                        />

                                                    </Space>
                                                </Form.Item>
                                            </Col>


                                            <Col>
                                                <Form.Item
                                                    label={<span className="uppercase text-[10px]">{t('Mã nhân viên')}</span>}
                                                    style={{ marginBottom: 0 }}
                                                    labelCol={{ style: { marginBottom: 2, padding: 0 } }}
                                                    wrapperCol={{ style: { padding: 0 } }}
                                                >
                                                    <Space>
                                                        <Input
                                                            placeholder=""
                                                            className="w-[250px]"
                                                            size="middle"
                                                            readOnly
                                                            value={dataSeq?.EmpID}
                                                            style={{ backgroundColor: '#e8f0ff' }}
                                                        />

                                                    </Space>
                                                </Form.Item>
                                            </Col>

                                            <Col>
                                                <Form.Item
                                                    label={<span className="uppercase text-[10px]">{t('Công ty làm việc ')}</span>}
                                                    style={{ marginBottom: 0 }}
                                                    labelCol={{ style: { marginBottom: 2, padding: 0 } }}
                                                    wrapperCol={{ style: { padding: 0 } }}
                                                >
                                                    <Space>
                                                        <Input
                                                            placeholder=""
                                                            className="w-[250px]"
                                                            size="middle"
                                                            readOnly
                                                            value={dataSeq?.CompanyName}
                                                            style={{ backgroundColor: '#e8f0ff' }}
                                                        />

                                                    </Space>
                                                </Form.Item>
                                            </Col>




                                        </Row>
                                    </Form>
                                </div>
                            </Splitter.Panel>
                            <Splitter.Panel size={45}>
                                <Recruit06A2Table
                                    setSelection={setSelectionB}
                                    selection={selectionB}
                                    showSearch={showSearchB}
                                    setShowSearch={setShowSearchB}
                                    numRows={numRowsB}
                                    setGridData={setGridDataB}
                                    gridData={gridDataB}
                                    setNumRows={setNumRowsB}
                                    setCols={setColsB}
                                    handleRowAppend={handleRowAppendB}
                                    cols={colsB}
                                    defaultCols={defaultColsB}
                                    canEdit={canEdit}
                                    canCreate={canCreate}
                                    handleDeleteDataSheet2={handleDeleteDataSheet2}
                                    handleSaveData2={handleSaveData2}
                                    handleSearchData2={handleSearchData2}
                                />
                            </Splitter.Panel>
                        </Splitter>

                    </div>
                </div>
            </div>
            <ErrorListModal isModalVisible={modal2Open}
                setIsModalVisible={setModal2Open}
                dataError={errorData} />
        </>
    )
}
