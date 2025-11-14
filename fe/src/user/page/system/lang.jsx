import { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet'
import { Input, Space, Table, Typography, message, Tabs, Layout } from 'antd'
const { Title, Text } = Typography
import { debounce } from 'lodash'
import MenuManagementActions from '../../components/actions/system/menuManagementActions'
import TableMenuManagement from '../../components/table/system/tableMenuManagement'
import DrawerAddMenu from '../../components/drawer/system/addMenu'
import { GetAllMenus } from '../../../features/system/getMenus'
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
import { GetALlLangSys } from '../../../features/system/getQLangs'
import { PostUpdateLangSys } from '../../../features/system/putLangSys'
import { PostAddLangsys } from '../../../features/system/postAddLangSys'
import { DeleteLangSys } from '../../../features/system/deleteLangSys'
import { updateIndexNo } from '../../components/sheet/js/updateIndexNo'
export default function Langs({ permissions, isMobile, controllers,
    cancelAllRequests, canDelete }) {
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
            title: t("860000004"),
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
            title: t("860000001"),
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
        {
            title: t("860000002"),
            id: 'Remark',
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
            title: t("860000003"),
            id: 'LanguageCode',
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
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selection, setSelection] = useState({
        columns: CompactSelection.empty(),
        rows: CompactSelection.empty(),
    })

    const [showSearch, setShowSearch] = useState(false)
    const [lastClickedCell, setLastClickedCell] = useState(null)
    const [addedRows, setAddedRows] = useState([])

    const [editedRows, setEditedRows] = useState([])
    const [numRowsToAdd, setNumRowsToAdd] = useState(null)
    const [numRows, setNumRows] = useState(0)
    const [clickCount, setClickCount] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isSent, setIsSent] = useState(false)
    const [openHelp, setOpenHelp] = useState(false)

    const [isCellSelected, setIsCellSelected] = useState(false)
    const [onSelectRow, setOnSelectRow] = useState([])
    const [cols, setCols] = useState(() =>
        loadFromLocalStorageSheet(
            'S_ERP_COLS_PAGE_LANG',
            defaultCols.filter((col) => col.visible)
        )
    )
    const [keyMenuRoot, setKeyMenuRoot] = useState('')
    const [keyMenuSubRoot, setKeyMenuSubRoot] = useState('')
    const [keyMenuItem, setKeyMenuItem] = useState('')
    const [dataRootMenu, setDataRootMenu] = useState([])
    const [dataSubMenu, setDataSubMenu] = useState([])

    useEffect(() => {
        cancelAllRequests();
        message.destroy();
    }, [])

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
                const emptyData = generateEmptyData(50, defaultCols)
                const combinedData = [...fetchedData, ...emptyData];
                const updatedData = updateIndexNo(combinedData);
                setGridData(updatedData)
                setNumRows(updatedData.length)
                resetTable()

            } else {
                message.error(response.data.message || 'Có lỗi xảy ra khi lấy dữ liệu!')
            }
        } catch (error) {
            setMenus([])
        } finally {
            controllers.current.fetchData = null;
            setLoading(false)
        }
    }, [])


    useEffect(() => {
        fetchData()
    }, [])

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
            onRowAppended(cols, setGridData, setNumRows, setAddedRows, numRowsToAdd)
        },
        [cols, setGridData, setNumRows, setAddedRows, numRowsToAdd],
    )

    const resetTable = () => {
        setSelection({
            columns: CompactSelection.empty(),
            rows: CompactSelection.empty()
        })
    }
    const handleDeleteDataSheet = useCallback(
        (e) => {
            if (canDelete === false) {
                message.warning('Bạn không có quyền xóa dữ liệu')
                return
            }

            const selectedRows = getSelectedRows()

            const idsWithStatusD = selectedRows
                .filter((row) => !row.Status || row.Status === 'U' || row.Status === 'D')
                .map((row) => {
                    row.Status = 'D'
                    return row.LanguageSeq
                })

            const rowsWithStatusA = selectedRows.filter((row) => row.Status === 'A')

            if (idsWithStatusD.length > 0) {
                DeleteLangSys(idsWithStatusD)
                    .then((response) => {
                        if (response.success) {
                            const remainingRows = gridData.filter(
                                (row) => !idsWithStatusD.includes(row.LanguageSeq)
                            )
                            setGridData(remainingRows)
                            setNumRows(remainingRows.length)
                            resetTable()
                        } else {
                            message.error(response.data.message || 'Xóa thất bại!')
                        }
                    })
                    .catch((error) => {
                        console.log('error', error)
                        message.error('Có lỗi xảy ra khi xóa!')
                    })
            }

            if (rowsWithStatusA.length > 0) {
                const idsWithStatusA = rowsWithStatusA.map((row) => row.Id)
                const remainingRows = gridData.filter((row) => !idsWithStatusA.includes(row.Id))
                const remainingEditedRows = editedRows.filter(
                    (editedRow) => !idsWithStatusA.includes(editedRow.updatedRow.Id)
                );
                setEditedRows(remainingEditedRows);
                setGridData(remainingRows)
                setNumRows(remainingRows.length)
                resetTable()
            }
        },
        [gridData, selection, editedRows]
    )





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


    const handleSaveData = async () => {
        const columnsU = ['IdSeq', 'LanguageSeq', 'LanguageName', 'Remark', 'LanguageCode', 'IdxNo']
        const columnsA = ['LanguageName', 'Remark', 'LanguageCode', 'IdxNo']
        if (loadingBarRef.current) {
            loadingBarRef.current.continuousStart();
        }
        togglePageInteraction(true)
        const resulU = filterAndSelectColumns(gridData, columnsU, 'U')
        const resulA = filterAndSelectColumns(gridData, columnsA, 'A')

        if (isSent) return
        setIsSent(true)

        if (resulA.length > 0 || resulU.length > 0) {

            try {
                const promises = []

                if (resulA.length > 0) {
                    promises.push(PostAddLangsys(resulA))
                }

                if (resulU.length > 0) {
                    promises.push(PostUpdateLangSys(resulU))
                }


                const results = await Promise.all(promises)

                const updateGridData = (newData) => {
                    setGridData((prevGridData) => {
                        const updatedGridData = prevGridData.map(item => {
                            const matchingData = newData.find(data => data.IdxNo === item.IdxNo);

                            if (matchingData) {
                                return {
                                    ...matchingData,
                                };
                            }
                            return item;
                        });

                        const updatedData = updateIndexNo(updatedGridData);
                        return updatedData;
                    })
                }


                results.forEach((result, index) => {
                    if (result.success) {
                        const newData = result.data.data
                        updateGridData(newData)
                        setIsLoading(false)
                        setIsSent(false)
                        setEditedRows([])
                        setAddedRows([])
                        togglePageInteraction(false)
                        if (loadingBarRef.current) {
                            loadingBarRef.current.complete();
                        }
                    } else {
                        setIsLoading(false)
                        setIsSent(false)
                        if (loadingBarRef.current) {
                            loadingBarRef.current.complete();
                        }
                        togglePageInteraction(false)
                    }
                })
            } catch (error) {
                setIsLoading(false)
                setIsSent(false)
                if (loadingBarRef.current) {
                    loadingBarRef.current.complete();
                }
                togglePageInteraction(false)
                message.error(error.message || 'Có lỗi xảy ra khi lưu dữ liệu')
            }
        } else {
            setIsLoading(false)
            setIsSent(false)
            if (loadingBarRef.current) {
                loadingBarRef.current.complete();
            }
            togglePageInteraction(false)
            message.warning('Không có dữ liệu để lưu!')
        }
    }

    return (
        <>
            <Helmet>
                <title>HPM - {t('850000013')}</title>
            </Helmet>
            <TopLoadingBar color="blue" height={2} ref={loadingBarRef} />
            <div className="bg-slate-50 h-[calc(100vh-42px)] overflow-hidden">
                <div className="flex flex-col h-full">
                    <div className="col-start-1 p-2 col-end-5 row-start-1 w-full">
                        <div className="flex items-end justify-end">

                            <LangSysActions fetchData={fetchData} handleDeleteDataSheet={handleDeleteDataSheet} handleSaveData={handleSaveData}
                            />
                        </div>
                    </div>

                    <div className="col-start-1 col-end-5 row-start-2  border-t w-full h-full rounded-lg  overflow-auto">
                        <TableLangSys
                            data={menus} dataRootMenu={dataRootMenu}
                            dataSubMenu={dataSubMenu} setSelection={setSelection} selection={selection} showSearch={showSearch} setShowSearch={setShowSearch} setAddedRows={setAddedRows} addedRows={addedRows} setEditedRows={setEditedRows} editedRows={editedRows} setNumRowsToAdd={setNumRowsToAdd} clickCount={clickCount} numRowsToAdd={numRowsToAdd} numRows={numRows} onSelectRow={onSelectRow} openHelp={openHelp} setOpenHelp={setOpenHelp} setOnSelectRow={setOnSelectRow} setIsCellSelected={setIsCellSelected} isCellSelected={isCellSelected} setGridData={setGridData} gridData={gridData} setNumRows={setNumRows} setCols={setCols} handleRowAppend={handleRowAppend} cols={cols} defaultCols={defaultCols}
                        />
                    </div>
                </div>

            </div>
        </>
    )
}
