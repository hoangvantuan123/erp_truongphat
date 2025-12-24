import { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet'
import { Input, Space, Table, Typography, message, Tabs, Layout } from 'antd'
const { Title, Text } = Typography
import { debounce } from 'lodash'
import { FilterOutlined } from '@ant-design/icons'
import { ArrowIcon } from '../../components/icons'
import { DeleteMenus } from '../../../features/system/deleteMenus'
import { filterAndSelectColumns } from '../../../utils/filterUorA'
import { PostAddMenu } from '../../../features/system/postAddMenu'
import { PostUpdateMenu } from '../../../features/system/postUpdateMenu'
import useKeydownHandler from '../../components/hooks/sheet/useKeydownHandler'
import { loadFromLocalStorageSheet } from '../../../localStorage/sheet/sheet'
import { onRowAppended } from '../../components/sheet/js/onRowAppended'
import { GetAllRootMenus } from '../../../features/system/getRootMenu'
import { GetAllMenusSubmenu } from '../../../features/system/getMenuSubmenu'
import { generateEmptyData } from '../../components/sheet/js/generateEmptyData'
import { CompactSelection, GridColumnIcon } from '@glideapps/glide-data-grid'
import TopLoadingBar from 'react-top-loading-bar';
import { togglePageInteraction } from '../../../utils/togglePageInteraction'
import LangSysActions from '../../components/actions/system/langsActions'
import TableLangSys from '../../components/table/system/tableLangs'
import { Splitter, SplitterPanel } from 'primereact/splitter'

import { GetAllDictionarySys } from '../../../features/system/getDictionary'
import TableLangSysList from '../../components/table/system/tableLangsList'
import { GetALlLangSys } from '../../../features/system/getQLangs'
import { updateIndexNo } from '../../components/sheet/js/updateIndexNo'
import TableDictSys from '../../components/table/system/tableDictSys'
import DictSysQuery from '../../components/query/system/dictSysQuery'
import { DeleteDictSys } from '../../../features/system/deleteDictSys'
import { PostADictSys } from '../../../features/system/postADictSys'
import { deleteDataSheet } from '../../../utils/deleteUtils'
import { PostUDictSys } from '../../../features/system/postUDictSys'
export default function DictSys({ permissions, isMobile, controllers, canDelete,
    cancelAllRequests }) {
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
            icon: GridColumnIcon.HeaderLookup
        },
        {
            title: t('860000005'),
            id: 'LanguageSeq',
            kind: 'Text',
            readonly: true,
            width: 120,
            hasMenu: true,
            visible: false,
            icon: GridColumnIcon.HeaderRowID,
            trailingRowOptions: {
                disabled: true,
            },
        },
        {
            title: t('860000006'),
            id: 'LanguageName',
            kind: 'Text',
            readonly: false,
            width: 220,
            hasMenu: true,
            visible: true,
            icon: GridColumnIcon.HeaderString,
            trailingRowOptions: {
                disabled: true,
            },
        },

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
            icon: GridColumnIcon.HeaderLookup
        },
        {
            title: t('860000007'),
            id: 'IdSeq',
            kind: 'Text',
            readonly: true,
            width: 120,
            hasMenu: true,
            visible: false,
            icon: GridColumnIcon.HeaderRowID,
            trailingRowOptions: {
                disabled: true,
            },
        },
        {
            title: t('860000005'),
            id: 'LanguageSeq',
            kind: 'Text',
            readonly: true,
            width: 120,
            hasMenu: true,
            visible: false,
            icon: GridColumnIcon.HeaderRowID,
            trailingRowOptions: {
                disabled: true,
            },
        },
        {
            title: t('860000006'),
            id: 'LanguageName',
            kind: 'Text',
            readonly: true,
            width: 220,
            hasMenu: true,
            visible: false,
            icon: GridColumnIcon.HeaderString,
            trailingRowOptions: {
                disabled: true,
            },
        },
        {
            title: t('860000008'),
            id: 'Word',
            kind: 'Text',
            readonly: false,
            width: 240,
            hasMenu: true,
            visible: true,
            icon: GridColumnIcon.HeaderMarkdown,
            trailingRowOptions: {
                disabled: true,
            },
        },
        {
            title: t('860000009'),
            id: 'WordSeq',
            kind: 'Text',
            readonly: false,
            width: 120,
            hasMenu: true,
            visible: true,
            icon: GridColumnIcon.HeaderCode,
            trailingRowOptions: {
                disabled: true,
            },
        }

    ], [t]);
    const loadingBarRef = useRef(null);
    const [loading, setLoading] = useState(false)
    const [menus, setMenus] = useState([])
    const [gridData, setGridData] = useState([])
    const [gridDataB, setGridDataB] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selection, setSelection] = useState({
        columns: CompactSelection.empty(),
        rows: CompactSelection.empty(),
    })
    const [selectionB, setSelectionB] = useState({
        columns: CompactSelection.empty(),
        rows: CompactSelection.empty(),
    })

    const [showSearch, setShowSearch] = useState(false)
    const [showSearchB, setShowSearchB] = useState(false)
    const [lastClickedCell, setLastClickedCell] = useState(null)
    const [addedRows, setAddedRows] = useState([])
    const [addedRowsB, setAddedRowsB] = useState([])

    const [editedRows, setEditedRows] = useState([])
    const [editedRowsB, setEditedRowsB] = useState([])
    const [numRowsToAdd, setNumRowsToAdd] = useState(null)
    const [numRowsToAddB, setNumRowsToAddB] = useState(null)
    const [numRows, setNumRows] = useState(0)
    const [numRowsB, setNumRowsB] = useState(0)
    const [clickCount, setClickCount] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isSent, setIsSent] = useState(false)
    const [openHelp, setOpenHelp] = useState(false)
    const [openHelpB, setOpenHelpB] = useState(false)
    const [completedRequests, setCompletedRequests] = useState(0);
    const [checkSearch, setCheckSearch] = useState(false)
    const [isCellSelected, setIsCellSelected] = useState(false)
    const [onSelectRow, setOnSelectRow] = useState([])
    const [onSelectRowB, setOnSelectRowB] = useState([])
    const [cols, setCols] = useState(() =>
        loadFromLocalStorageSheet(
            'S_ERP_COLS_PAGE_LANG_LIST',
            defaultCols.filter((col) => col.visible)
        )
    )
    const [colsB, setColsB] = useState(() =>
        loadFromLocalStorageSheet(
            'S_ERP_COLS_PAGE_DICT_LIST',
            defaultColsB.filter((col) => col.visible)
        )
    )
    const [dataRootMenu, setDataRootMenu] = useState([])
    const [dataSubMenu, setDataSubMenu] = useState([])
    const [dataType, setDataType] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(0)
    const [total, setTotal] = useState(0)
    const [wordSeq, setWordSeq] = useState('')
    const [wordText, setWordText] = useState('')
    useEffect(() => {
        cancelAllRequests();
        message.destroy();
    }, [])
    const resetTableB = () => {
        setSelectionB({
            columns: CompactSelection.empty(),
            rows: CompactSelection.empty()
        })
    }
    const fetchData = useCallback(async () => {
        setLoading(true)
        if (controllers.current.fetchData) {
            controllers.current.fetchData.abort();
            controllers.current.fetchData = null;
            await new Promise((resolve) => setTimeout(resolve, 10));
        }
        if (loadingBarRef.current) {
            loadingBarRef.current.continuousStart();
        }
        const controller = new AbortController();
        const signal = controller.signal;

        controllers.current.fetchData = controller;
        const filters = {
            LanguageName: ''
        }
        try {
            const response = await GetALlLangSys(filters, signal)
            if (response.success) {
                if (loadingBarRef.current) {
                    loadingBarRef.current.complete();
                }
                const fetchedData = response.data.data || []
                setGridData(fetchedData)
                setNumRows(fetchedData.length)

            } else {
                message.error(response.data.message || t('870000007'))
            }
        } catch (error) {
            setMenus([])
        } finally {
            if (loadingBarRef.current) {
                loadingBarRef.current.complete();
            }
            controllers.current.fetchData = null;
            setLoading(false)
        }
    }, [])



    const updateGridData = (page, newData) => {
        setGridDataB(prevData => {
            const mergedData = [...prevData];
            mergedData[page - 1] = newData;
            return mergedData.flat();
        });
        setNumRowsB(prev => prev + newData.length);
    };

    const resetDataGet = () => {
        const emptyData = generateEmptyData(100, defaultColsB);
        const updatedData = updateIndexNo(emptyData);

        setGridDataB(updatedData);
        setNumRowsB(updatedData.length);
        setCompletedRequests(0);
        setTotalPages(1);
        setTotal(0);
        setLoading(false);
    };


    const fetchAllDataDictSys = useCallback(async (seq, page = 1) => {
        if (loading || (completedRequests >= totalPages && page !== 1)) return;

        if (controllers.current.fetchDataDictSys) {
            controllers.current.fetchDataDictSys.abort();
        }
        if (loadingBarRef.current) {
            loadingBarRef.current.continuousStart();
        }
        const controller = new AbortController();
        controllers.current.fetchDataDictSys = controller;

        setLoading(true);
 
        try {
            const response = await GetAllDictionarySys({ LanguageSeq: seq, wordSeq, wordText }, page, controller.signal);
            if (!response.success) {
                throw new Error(response.data.message || t("870000006"));
            }

            if (page === 1) {
                resetDataGet();
            }

            setTotalPages(response.data.totalPages);
            setTotal(response.data.total);

            updateGridData(page, updateIndexNo(response.data.data) || []);
            setCompletedRequests(prev => prev + 1);
        } catch (error) {
            if (error.name !== "AbortError") {
                console.error(`Lỗi khi tải trang ${page}:`, error);
                resetDataGet();
            }
        } finally {
            if (loadingBarRef.current) {
                loadingBarRef.current.complete();
            }
            controllers.current.fetchDataDictSys = null;
            setLoading(false);
        }
    }, [loading, completedRequests, totalPages, wordSeq, wordText, checkSearch]);

    useEffect(() => {
        const data = getSelectedRowsDataA();

        if (data && data.length > 0) {
            if (data[0].IdSeq !== "") {
                setDataType(data);
                resetDataGet();
                setCheckSearch(false)

            } else {
                setCheckSearch(false)
                resetDataGet();
            }
        } else {
            setCheckSearch(false)
            resetDataGet();
        }
    }, [selection.rows.items]);

    useEffect(() => {
        fetchData();
    }, [])

    const openModal = () => {
        setIsModalOpen(true)
    }
    const closeModal = () => {
        setIsModalOpen(false)
    }


    const getSelectedRowsB = () => {
        const selectedRows = selectionB.rows.items
        let rows = []
        selectedRows.forEach((range) => {
            const start = range[0]
            const end = range[1] - 1

            for (let i = start; i <= end; i++) {
                if (gridDataB[i]) {
                    rows.push(gridDataB[i])
                }
            }
        })

        return rows
    }


    const handleRowAppend = useCallback(
        (numRowsToAdd) => {
            onRowAppended(cols, setGridData, setNumRows, setAddedRows, numRowsToAdd)
        },
        [cols, setGridData, setNumRows, setAddedRows, numRowsToAdd],
    )

    const handleRowAppendB = useCallback(
        (numRowsToAddB) => {
            onRowAppended(colsB, setGridDataB, setNumRowsB, setAddedRowsB, numRowsToAddB)
        },
        [colsB, setGridDataB, setNumRowsB, setAddedRowsB, numRowsToAddB],
    )
    const getSelectedRowsDataA = () => {
        const selectedRows = selection.rows.items;

        return selectedRows.flatMap(([start, end]) =>
            Array.from({ length: end - start }, (_, i) => gridData[start + i]).filter((row) => row !== undefined)
        );
    };

    const resetData = () => {
        setDataType([]);
        setGridDataB([]);
        setNumRowsB(0);
    };

    /*     useEffect(() => {
            if (checkSearch && dataType.length > 0) {
                fetchAllDataDictSys(dataType[0].IdSeq, 1);
            }
        }, [checkSearch]);
     */
    const resetDataGetB = async () => {
        return new Promise((resolve) => {
            const emptyData = generateEmptyData(100, defaultColsB);
            const updatedData = updateIndexNo(emptyData);
            setGridDataB(updatedData);
            setNumRowsB(updatedData.length);
            resolve();
        });
    };

    const handleSearch = async () => {
        await resetDataGetB();  

        setCheckSearch(true);
        fetchAllDataDictSys(dataType[0]?.IdSeq, 1);
    };









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
    useKeydownHandler(isCellSelected, setOpenHelp)
    const handleSaveData = async () => {
        const columnsU = ['IdSeq', 'LanguageSeq', 'Word', 'WordSeq', 'IdxNo']
        const columnsA = ['LanguageSeq', 'Word', 'WordSeq', 'IdxNo']
        if (loadingBarRef.current) {
            loadingBarRef.current.continuousStart();
        }
        togglePageInteraction(true)


        const processedGridData = gridDataB.map((row) => ({
            ...row,
            WordSeq: row.WordSeq === undefined ? 0 : row.WordSeq,
        }));
        const resulU = filterAndSelectColumns(processedGridData, columnsU, 'U')
        const resulA = filterAndSelectColumns(processedGridData, columnsA, 'A').map(item => ({
            ...item,
            LanguageSeq: dataType[0].LanguageSeq
        }));

        if (isSent) return
        setIsSent(true)

        if (resulA.length > 0 || resulU.length > 0) {

            try {
                const promises = []

                if (resulA.length > 0) {
                    promises.push(PostADictSys(resulA))
                }

                if (resulU.length > 0) {
                    promises.push(PostUDictSys(resulU))
                }

                const results = await Promise.all(promises);
                const isSuccess = results.every(result => result.success);
                const updateGridData = (newData) => {
                    setGridDataB((prevGridData) => {
                        const updatedGridData = prevGridData.map(item => {
                            const matchingData = newData.find(data => data.IdxNo === item.IdxNo);

                            if (matchingData) {
                                return matchingData;
                            }
                            return item;
                        });

                        const updatedData = updateIndexNo(updatedGridData);
                        return updatedData;
                    });
                };

                if (isSuccess) {
                    const newData = results.flatMap(result => result.data.data || []);
                    updateGridData(newData);
                    setIsLoading(false)
                    setEditedRowsB([]);
                    setAddedRowsB([]);
                    setIsSent(false)
                    if (loadingBarRef.current) {
                        loadingBarRef.current.complete();
                    }
                    togglePageInteraction(false)

                }

                return isSuccess;
            } catch (error) {
                setIsLoading(false)
                setIsSent(false)
                if (loadingBarRef.current) {
                    loadingBarRef.current.complete();
                }
                togglePageInteraction(false)
                message.error(error.message || t('870000004'))
            }
        } else {
            setIsLoading(false)
            setIsSent(false)
            if (loadingBarRef.current) {
                loadingBarRef.current.complete();
            }
            togglePageInteraction(false)
            message.warning(t('870000003'))
        }
    }
    const handleDelete = useCallback(() => {
        if (canDelete === false) {
            message.error(t('870000002'));
            return;
        }

        message.loading(t('870000008'), 0);

        const handleDelete = deleteDataSheet(
            getSelectedRowsB,
            DeleteDictSys,
            gridDataB,
            setGridDataB,
            setNumRowsB,
            resetTableB,
            editedRowsB,
            setEditedRowsB,
            "IdSeq"
        );
        Promise.all([handleDelete]).then((results) => {
            const hasError = results.some((result) => !result.success);

            if (hasError) {
                const errorMessages = results.filter((result) => !result.success).map((result) => result.message);
                message.error(errorMessages.join(', '));
            } else {
                message.success(t('870000001'));
            }
        }).finally(() => {
            message.destroy();
        });
    }, [
        canDelete,
        editedRows,
        getSelectedRowsB,
        DeleteDictSys,
        setGridDataB,
        setNumRowsB,
        resetTableB,
        setEditedRowsB,
        selectionB,
        gridDataB
    ]);
    return (
        <>
            <Helmet>
                <title>ITM - {t('850000016')}</title>
            </Helmet>
            <TopLoadingBar color="blue" height={2} ref={loadingBarRef} />
            <div className="bg-slate-50 h-[calc(100vh-42px)] overflow-hidden">
                <div className="flex flex-col h-full">
                    <div className="col-start-1 col-end-5 row-start-1 w-full">
                        <div className="flex p-2 items-end justify-end">

                            <LangSysActions handleSearch={handleSearch} fetchDataDictSys={fetchAllDataDictSys} openModal={openModal} handleDeleteDataSheet={handleDelete} data={menus} handleSaveData={handleSaveData} setNumRowsToAdd={setNumRowsToAdd} numRowsToAdd={numRowsToAdd} setClickCount={setClickCount} clickCount={clickCount} handleRowAppend={handleRowAppend}
                            />
                        </div>
                        <details
                            className="group p-2 [&_summary::-webkit-details-marker]:hidden border-t  bg-white"
                            open
                        >
                            <summary className="flex cursor-pointer items-center justify-between gap-1.5 text-gray-900">
                                <h2 className="text-xs font-medium flex items-center gap-2 text-blue-600 uppercase">
                                    <FilterOutlined />
                                    {t('850000014')}
                                </h2>
                                <span className="relative size-5 shrink-0">
                                    <ArrowIcon />
                                </span>
                            </summary>

                            <div className="flex p-2 gap-4">
                                <DictSysQuery
                                    setWordText={setWordText} wordText={wordText} setWordSeq={setWordSeq} wordSeq={wordSeq}
                                />
                            </div>
                        </details>
                    </div>


                    <div className="col-start-1 col-end-5 row-start-2 w-full flex-1 min-h-0 border-t overflow-auto relative">
                        <Splitter className="w-full h-full">
                            <SplitterPanel size={25} minSize={10}>
                                <TableLangSysList
                                    data={menus} dataRootMenu={dataRootMenu}
                                    dataSubMenu={dataSubMenu} setSelection={setSelection} selection={selection} showSearch={showSearch} setShowSearch={setShowSearch} setAddedRows={setAddedRows} addedRows={addedRows} setEditedRows={setEditedRows} editedRows={editedRows} setNumRowsToAdd={setNumRowsToAdd} clickCount={clickCount} numRowsToAdd={numRowsToAdd} numRows={numRows} onSelectRow={onSelectRow} openHelp={openHelp} setOpenHelp={setOpenHelp} setOnSelectRow={setOnSelectRow} setIsCellSelected={setIsCellSelected} isCellSelected={isCellSelected} setGridData={setGridData} gridData={gridData} setNumRows={setNumRows} setCols={setCols} handleRowAppend={handleRowAppend} cols={cols} defaultCols={defaultCols}
                                />
                            </SplitterPanel>
                            <SplitterPanel size={75} minSize={20}>
                                <TableDictSys
                                    dataType={dataType}
                                    setTotalPages={setTotalPages}
                                    totalPages={totalPages}
                                    setCurrentPage={setCurrentPage}
                                    currentPage={currentPage}
                                    total={total}
                                    checkSearch={checkSearch}


                                    fetchAllDataDictSys={fetchAllDataDictSys}
                                    setSelection={setSelectionB}
                                    selection={selectionB}
                                    showSearch={showSearchB}
                                    setShowSearch={setShowSearchB}
                                    setAddedRows={setAddedRowsB}
                                    addedRows={addedRowsB}
                                    setEditedRows={setEditedRowsB}
                                    editedRows={editedRowsB}
                                    setNumRowsToAdd={setNumRowsToAddB}
                                    numRowsToAdd={numRowsToAddB}
                                    numRows={numRowsB}
                                    onSelectRow={onSelectRowB}
                                    openHelp={openHelpB}
                                    setOpenHelp={setOpenHelpB}
                                    setOnSelectRow={setOnSelectRowB}
                                    setIsCellSelected={setIsCellSelected}
                                    isCellSelected={isCellSelected}
                                    setGridData={setGridDataB}
                                    gridData={gridDataB}
                                    setNumRows={setNumRowsB}
                                    setCols={setColsB}
                                    handleRowAppend={handleRowAppendB}
                                    cols={colsB}
                                    defaultCols={defaultColsB}


                                    loading={loading}
                                    completedRequests={completedRequests}
                                />
                            </SplitterPanel>
                        </Splitter>

                    </div>
                </div>

            </div >
        </>
    )
}