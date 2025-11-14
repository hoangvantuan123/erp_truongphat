import { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet'
import { Input, Space, Table, Typography, message, Tabs, notification } from 'antd'
const { Title, Text } = Typography
import { debounce } from 'lodash'
import { Splitter, SplitterPanel } from 'primereact/splitter'
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
import HrBasCareerTable from '../../components/table/hr/hrBasCareerTable'
import HrBasCareerProjectTable from '../../components/table/hr/hrBasCareerTableProject'


import { PostHrBasCareerA } from '../../../features/hr/hrBasCareer/postHrBasCareerA'
import { PostHrBasCareerU } from '../../../features/hr/hrBasCareer/postHrBasCareerU'
import { PostHrBasCareerD } from '../../../features/hr/hrBasCareer/postHrBasCareerD'
import { PostHrBasCareerQ } from '../../../features/hr/hrBasCareer/postHrBasCareerQ'
import { PostHrBasPjtCareerA } from '../../../features/hr/hrBasPjtCareer/postHrBasPjtCareerA'
import { PostHrBasPjtCareerU } from '../../../features/hr/hrBasPjtCareer/postHrBasPjtCareerU'
import { PostHrBasPjtCareerD } from '../../../features/hr/hrBasPjtCareer/postHrBasPjtCareerD'
import { PostHrBasPjtCareerQ } from '../../../features/hr/hrBasPjtCareer/postHrBasPjtCareerQ'
import HrBasCareerAction from '../../components/actions/hr/hrBasCareerAction'
import HrBasCareerQuery from '../../components/query/hr/hrBasCareerQuery'
import ErrorListModal from '../default/errorListModal'
import { HandleError } from '../default/handleError'
import HrBasCareerSeqQuery from '../../components/query/hr/hrBasCareerSeqQuery'
export default function HrBasCareer({ permissions, isMobile, canCreate, canEdit, canDelete, controllers,
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
            icon: GridColumnIcon.HeaderLookup,
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
            width: 220,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },
        {
            title: t('17028'),
            id: 'EntRetTypeName',
            kind: 'Text',
            readonly: false,
            width: 220,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },
        {
            title: t('5'),
            id: 'DeptName',
            kind: 'Text',
            readonly: false,
            width: 220,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },
        {
            title: t('373'),
            id: 'PosName',
            kind: 'Text',
            readonly: false,
            width: 220,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },
        {
            title: t('554'),
            id: 'CoDeptName',
            kind: 'Text',
            readonly: false,
            width: 220,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },
        {
            title: t('642'),
            id: 'JpName',
            kind: 'Text',
            readonly: false,
            width: 220,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },
        {
            title: t('2286'),
            id: 'CoNm',
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
            title: t('191'),
            id: 'EntDate',
            kind: 'Text',
            readonly: false,
            width: 220,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },
        {
            title: t('232'),
            id: 'RetDate',
            kind: 'Text',
            readonly: false,
            width: 220,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },
        {
            title: t('4774'),
            id: 'UMChrgWkName',
            kind: 'Text',
            readonly: false,
            width: 220,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },
        {
            title: t('22155'),
            id: 'ChrgWk',
            kind: 'Text',
            readonly: false,
            width: 220,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },
        {
            title: t('4314'),
            id: 'Area',
            kind: 'Text',
            readonly: false,
            width: 220,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },
        {
            title: t('1337'),
            id: 'BusType',
            kind: 'Text',
            readonly: false,
            width: 220,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },
        {
            title: t('18501'),
            id: 'UMRetReasonName',
            kind: 'Text',
            readonly: false,
            width: 220,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },
        {
            title: t('22258'),
            id: 'AppCarTerm',
            kind: 'Text',
            readonly: false,
            width: 220,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },
        {
            title: t('4282'),
            id: 'IsGrp',
            kind: 'Text',
            readonly: false,
            width: 220,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },
        {
            title: t('362'),
            id: 'Rem',
            kind: 'Text',
            readonly: false,
            width: 220,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },
    ], []);
    const defaultCols2 = useMemo(() => [
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
            title: t('10390'),
            id: 'UMPjtTypeName',
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
            title: t('353'),
            id: 'PjtName',
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
            title: t('191'),
            id: 'EntDate',
            kind: 'Text',
            readonly: false,
            width: 220,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },
        {
            title: t('232'),
            id: 'RetDate',
            kind: 'Text',
            readonly: false,
            width: 220,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },
        {
            title: t('4775'),
            id: 'PerRole',
            kind: 'Text',
            readonly: false,
            width: 220,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },
        {
            title: t('10378'),
            id: 'PjtRemark',
            kind: 'Text',
            readonly: false,
            width: 220,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },
        {
            title: t('4774'),
            id: 'ChrgWk',
            kind: 'Text',
            readonly: false,
            width: 220,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },
        {
            title: t('22155'),
            id: 'UMChrgWkName',
            kind: 'Text',
            readonly: false,
            width: 220,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },
        {
            title: t('5562'),
            id: 'OrdPlace',
            kind: 'Text',
            readonly: false,
            width: 220,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },
        {
            title: t('7168'),
            id: 'JobName',
            kind: 'Text',
            readonly: false,
            width: 220,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },
        {
            title: t('7929'),
            id: 'AppTermMm',
            kind: 'Text', // Có thể dùng 'Number' nếu hỗ trợ
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
            title: t('8491'),
            id: 'AppRate',
            kind: 'Text', // Có thể dùng 'Number' nếu hỗ trợ
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
            title: t('362'),
            id: 'Rem',
            kind: 'Text',
            readonly: false,
            width: 220,
            hasMenu: true,
            visible: true,
            trailingRowOptions: { disabled: true },
        },
    ], []);

    const [dataSeq, setDataSeq] = useState([])
    const [gridData, setGridData] = useState([])
    const [gridData2, setGridData2] = useState([])
    const [selection, setSelection] = useState({
        columns: CompactSelection.empty(),
        rows: CompactSelection.empty()
    })
    const [selection2, setSelection2] = useState({
        columns: CompactSelection.empty(),
        rows: CompactSelection.empty()
    })
    const [showSearch, setShowSearch] = useState(false)
    const [showSearch2, setShowSearch2] = useState(false)
    const [addedRows, setAddedRows] = useState([])
    const [addedRows2, setAddedRows2] = useState([])
    const [editedRows, setEditedRows] = useState([])
    const [numRowsToAdd, setNumRowsToAdd] = useState(null)
    const [numRowsToAdd2, setNumRowsToAdd2] = useState(null)
    const [numRows, setNumRows] = useState(0)
    const [numRows2, setNumRows2] = useState(0)
    const [openHelp, setOpenHelp] = useState(false)
    const [isCellSelected, setIsCellSelected] = useState(false)

    const [onSelectRow, setOnSelectRow] = useState([])

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
    const [modal2Open, setModal2Open] = useState(false)
    const [errorData, setErrorData] = useState(null)
    const [CoNm, setCoNm] = useState('')


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
    const [cols, setCols] = useState(() =>
        loadFromLocalStorageSheet(
            'hr_bas_career_a',
            defaultCols.filter((col) => col.visible)
        )
    )
    const [cols2, setCols2] = useState(() =>
        loadFromLocalStorageSheet(
            'hr_bas_pjt_career_a',
            defaultCols2.filter((col) => col.visible)
        )
    )
    const resetTable = () => {
        setSelection({
            columns: CompactSelection.empty(),
            rows: CompactSelection.empty()
        })
    }
    const resetTable2 = () => {
        setSelection2({
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
        const emptyData2 = generateEmptyData(100, defaultCols2)
        const updatedData2 = updateIndexNo(emptyData2)
        setGridData(updatedData)
        setNumRows(updatedData.length)
        setGridData2(updatedData2)
        setNumRows2(updatedData2.length)
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

            const [help01, help02, help03, help04, help05, help06, help07, help08, help09] = await Promise.all([
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
                    19999,
                    1,
                    '%',
                    '3306',
                    '',
                    '',
                    '',
                    signal
                ),
                GetCodeHelpCombo(
                    '',
                    6,
                    19999,
                    1,
                    '%',
                    '3102',
                    '',
                    '',
                    '',
                    signal
                ),
                GetCodeHelpCombo(
                    '',
                    6,
                    19999,
                    1,
                    '%',
                    '3306',
                    '',
                    '',
                    '',
                    signal
                ),
                GetCodeHelpCombo(
                    '',
                    6,
                    19998,
                    1,
                    '%',
                    '3031',
                    '',
                    '',
                    '',
                    signal
                ),
                GetCodeHelpCombo(
                    '',
                    6,
                    19999,
                    1,
                    '%',
                    '3068',
                    '',
                    '',
                    '',
                    signal
                ),
                GetCodeHelpVer2(10010, '', '', '', '', '', '', 1, 0, '', 0, 0, 0, signal),
                GetCodeHelpVer2(30006, '', '', '', '', '', '', 1, 0, '', 0, 0, 0, signal),

            ]);
            setHelpData01(help01.data)
            setHelpData02(help02.data)
            setHelpData03(help03.data)
            setHelpData04(help04.data)
            setHelpData05(help05.data)
            setHelpData06(help06.data)
            setHelpData07(help07.data)
            setHelpData08(help08.data)
            setHelpData09(help09.data)


        } catch {
            setHelpData01([])
            setHelpData02([])
            setHelpData03([])
            setHelpData04([])
            setHelpData05([])
            setHelpData06([])
            setHelpData07([])
            setHelpData08([])
            setHelpData09([])
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
            DeptSeq: dataSearch1?.DeptSeq || '',
            EntRetTypeSeq: '',
            QBegDate: '',
            QEndDate: '',
            CoNm: CoNm,
        }
        fetchGenericData({
            controllerKey: 'PostHrBasCareerQ',
            postFunction: PostHrBasCareerQ,
            searchParams,
            useEmptyData: true,
            afterFetch: (data) => {
                setGridData(data);
                setNumRows(data.length);
            },
        });


    }, [dataSearch, dataSearch1, CoNm])





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
    const getSelectedRows2 = () => {
        const selectedRows = selection2.rows.items
        let rows = []
        selectedRows.forEach((range) => {
            const start = range[0]
            const end = range[1] - 1

            for (let i = start; i <= end; i++) {
                if (gridData2[i]) {
                    rows.push(gridData2[i])
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


    const handleRowAppend2 = useCallback(
        (numRowsToAdd2) => {
            if (canCreate === false) {
                message.warning('Bạn không có quyền thêm dữ liệu')
                return
            }
            onRowAppended(cols2, setGridData2, setNumRows2, setAddedRows2, numRowsToAdd2)
        },
        [cols2, setGridData2, setNumRows2, setAddedRows2, numRowsToAdd2]
    )




    const handleDeleteDataSheet = useCallback(
        (e) => {
            if (canDelete === false) {
                return;
            }

            const selectedRows = getSelectedRows();

            const rowsWithStatusD = selectedRows
                .filter(row => !row.Status || row.Status === 'U' || row.Status === 'D' || row.Status === 'E')
                .map(row => ({
                    ...row,
                    Status: 'D'
                }));

            const rowsWithStatusA = selectedRows.filter((row) => row.Status === 'A');


            if (rowsWithStatusD.length > 0) {

                PostHrBasCareerD(rowsWithStatusD)
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

                PostHrBasPjtCareerD(rowsWithStatusD)
                    .then((response) => {
                        if (response.success) {
                            const deletedIds = rowsWithStatusD.map((item) => item.IdxNo);
                            const updatedData = gridData2.filter((row) => !deletedIds.includes(row.IdxNo));
                            setGridData2(updateIndexNo(updatedData));
                            setNumRows2(updatedData.length);
                            resetTable2();
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
                const remainingRows = gridData2.filter((row) => !idsWithStatusA.includes(row.Id));
                setGridData2(updateIndexNo(remainingRows));
                setNumRows2(remainingRows.length);
                resetTable2();
            }
        },
        [gridData2, selection2, editedRows]
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
            { key: 'EmpID', label: 'Nhân viên' },
            { key: 'CoNm', label: 'Tên công ty làm việc' },

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
            if (resulA.length > 0) apiCalls.push(PostHrBasCareerA(resulA));
            if (resulU.length > 0) apiCalls.push(PostHrBasCareerU(resulU));

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
                    return found ? { ...item, Status: '', CareerSeq: found.CareerSeq } : item;
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
    const handleSaveData2 = useCallback(async () => {
        if (!canCreate) return true;


        const resulA = filterValidRows(gridData2, 'A').map(item => ({
            ...item,
            EmpSeq: dataSeq?.EmpSeq,
            EmpID: dataSeq?.EmpID,
            CareerSeq: dataSeq?.CareerSeq
        }));
        const resulU = filterValidRows(gridData2, 'U').map(item => ({
            ...item,
            EmpSeq: dataSeq?.EmpSeq,
            EmpID: dataSeq?.EmpID,
            CareerSeq: dataSeq?.CareerSeq
        }));

        const requiredFields = [
            { key: 'EmpID', label: 'Nhân viên' },
            { key: 'AppTermMm', label: 'Số tháng được xác nhận' },
            { key: 'AppRate', label: 'Tỉ lệ áp dụng' },

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
            if (resulA.length > 0) apiCalls.push(PostHrBasPjtCareerA(resulA));
            if (resulU.length > 0) apiCalls.push(PostHrBasPjtCareerU(resulU));

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

            setGridData2(prev => {
                const updated = prev.map(item => {
                    const found = [...AData, ...UData].find(x => x?.IDX_NO === item?.IdxNo);
                    return found ? { ...item, Status: '', PjtCareerSeq: found.PjtCareerSeq } : item;
                });
                return updateIndexNo(updated);
            });

        } catch (error) {
            message.error(`Đã xảy ra lỗi: ${error.message || 'Unknown error'}`);
        } finally {
            loadingBarRef.current?.complete();
            togglePageInteraction(false);
        }
    }, [gridData2, canCreate, dataSeq]);
    const getSelectedRowsData = () => {
        const selectedRows = selection.rows.items;

        return selectedRows.flatMap(([start, end]) =>
            Array.from({ length: end - start }, (_, i) => gridData[start + i]).filter((row) => row !== undefined)
        );
    };


    useEffect(() => {
        const data = getSelectedRowsData();

        if (!data || data.length === 0) return;

        const CareerSeq = data[0]?.CareerSeq;
        if (CareerSeq == null || CareerSeq === '') return;

        setDataSeq(data[0]);
        const searchParams = {
            PjtCareerSeq: data[0]?.PjtCareerSeq || 0,
            EmpSeq: data[0]?.EmpSeq,
            CareerSeq: data[0]?.CareerSeq,
        }
        fetchGenericData({
            controllerKey: 'PostHrBasPjtCareerQ',
            postFunction: PostHrBasPjtCareerQ,
            searchParams,
            useEmptyData: true,
            afterFetch: (data) => {
                setGridData2(data);
                setNumRows2(data.length);
            },
        });



    }, [selection.rows.items]);

    const handleSearchData2 = useCallback(async () => {
        const searchParams = {
            PjtCareerSeq: dataSeq?.PjtCareerSeq || 0,
            EmpSeq: dataSeq?.EmpSeq,
            CareerSeq: dataSeq?.CareerSeq,
        }
        fetchGenericData({
            controllerKey: 'PostHrBasPjtCareerQ',
            postFunction: PostHrBasPjtCareerQ,
            searchParams,
            useEmptyData: true,
            afterFetch: (data) => {
                setGridData2(data);
                setNumRows2(data.length);
            },
        });


    }, [dataSearch, dataSeq])
    return (
        <>
            <Helmet>
                <title>{t('Đăng ký kinh nghiệm bên ngoài')}</title>
            </Helmet>
            <TopLoadingBar color="blue" height={2} ref={loadingBarRef} />
            <div className="bg-slate-50 h-[calc(100vh-35px)] overflow-hidden">
                <div className="flex flex-col  h-full">
                    <div className="col-start-1 col-end-5 row-start-1 w-full  ">
                        <div className="flex p-2 items-end justify-end">
                            <HrBasCareerAction
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
                                    Điều kiện truy vấn
                                </h2>
                            </summary>
                            <HrBasCareerQuery
                                helpData01={helpData01}
                                helpData02={helpData02}
                                helpData08={helpData08}
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
                                setDataSheetSearch1={setDataSheetSearch1}
                                dataSheetSearch={dataSheetSearch}
                                setItemText1={setItemText1}
                                setHelpData02={setHelpData02}
                                CoNm={CoNm}
                                setCoNm={setCoNm}
                            />
                        </details>
                    </div>

                    <div className="col-start-1 col-end-5 row-start-2 w-full h-full rounded-lg ">


                        <Splitter className="w-full h-full" layout="vertical">
                            <SplitterPanel size={55} minSize={10}>
                                <div className="h-full overflow-auto">
                                    <HrBasCareerTable
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
                                        helpData02={helpData02}
                                        setHelpData02={setHelpData02}

                                        helpData03={helpData03}
                                        setHelpData03={setHelpData03}

                                        helpData04={helpData04}
                                        setHelpData04={setHelpData04}
                                    />

                                </div>
                            </SplitterPanel>



                            <SplitterPanel size={7} minSize={10}>
                                <div className="h-full p-2 border-t border-b overflow-auto">
                                    <HrBasCareerSeqQuery dataSeq={dataSeq} />
                                </div>
                            </SplitterPanel>
                            <SplitterPanel size={33} minSize={20}>
                                <HrBasCareerProjectTable
                                    setSelection={setSelection2}
                                    selection={selection2}

                                    numRows={numRows2}
                                    setGridData={setGridData2}
                                    gridData={gridData2}
                                    setNumRows={setNumRows2}
                                    setCols={setCols2}
                                    numRowsToAdd={numRowsToAdd2}
                                    handleRowAppend={handleRowAppend2}
                                    cols={cols2}
                                    defaultCols={defaultCols2}
                                    canEdit={canEdit}
                                    canCreate={canCreate}

                                    showSearch={showSearch2}
                                    setShowSearch={setShowSearch2}
                                    helpData03={helpData03}
                                    setHelpData03={setHelpData03}
                                    helpData07={helpData07}
                                    setHelpData07={setHelpData07}

                                    handleDeleteDataSheet2={handleDeleteDataSheet2}
                                    helpData09={helpData09}
                                    setHelpData09={setHelpData09}
                                    handleSaveData2={handleSaveData2}
                                    handleSearchData2={handleSearchData2}

                                />

                            </SplitterPanel>



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
