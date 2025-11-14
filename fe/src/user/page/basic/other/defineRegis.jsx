import { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet'
import { useParams, useNavigate } from 'react-router-dom'
import { Input, Typography, Row, Col, message, Form } from 'antd'
const { Title, Text } = Typography
import { FilterOutlined } from '@ant-design/icons'
import { ArrowIcon } from '../../../components/icons'
import { CompactSelection, GridColumnIcon } from '@glideapps/glide-data-grid'
import { filterAndSelectColumns } from '../../../../utils/filterUorA'
import useKeydownHandler from '../../../components/hooks/sheet/useKeydownHandler'
import { loadFromLocalStorageSheet } from '../../../../localStorage/sheet/sheet'
import { onRowAppended } from '../../../components/sheet/js/onRowAppended'
import { generateEmptyData } from '../../../components/sheet/js/generateEmptyData'
import { Splitter, SplitterPanel } from 'primereact/splitter'
import { updateIndexNo } from '../../../components/sheet/js/updateIndexNo'
import TableDefine from '../../../components/table/basic/define/tableDefine'
import TableDefineItem from '../../../components/table/basic/define/tableDefineItem'
import { getQDefine } from '../../../../features/basic/define/getQ'
import DefineQuery from '../../../components/query/basic/define/defineQuery'
import { PostADefine } from '../../../../features/basic/define/postA'
import { PostUDefine } from '../../../../features/basic/define/postU'
import DefineAction from '../../../components/actions/basic/define/defineAction'
import { getQDefineSeqItems } from '../../../../features/basic/defineItem/getQSeq'
import { PostADefineItem } from '../../../../features/basic/defineItem/postA'
import { PostDDefineItem } from '../../../../features/basic/defineItem/postD'
import { PostUDefineItem } from '../../../../features/basic/defineItem/postU'
import { PostDDefine } from '../../../../features/basic/define/postD'
import { deleteDataSheet } from '../../../../utils/deleteUtils'
import TopLoadingBar from 'react-top-loading-bar';
export default function DefineRegis({
    permissions,
    isMobile,
    canCreate,
    canEdit,
    canDelete, controllers,
    cancelAllRequests
}) {
    const loadingBarRef = useRef(null);
    const navigate = useNavigate()

    const { t } = useTranslation()

    const defaultColsA = useMemo(() => [
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
            title: 'IdSeq',
            id: 'IdSeq',
            kind: 'Number',
            readonly: true,
            width: 100,
            hasMenu: true,
            visible: false,
            icon: GridColumnIcon.HeaderRowID,
            trailingRowOptions: {
                disabled: true,
            },
        },
        {
            title: 'Định nghĩa',
            id: 'DefineName',
            kind: 'Custom',
            readonly: false,
            width: 300,
            hasMenu: true,
            visible: true,
            icon: GridColumnIcon.HeaderArray,
            trailingRowOptions: {
                disabled: true,
            },
        },
        {
            title: 'Mô tả',
            id: 'Description',
            kind: 'Text',
            readonly: true,
            width: 100,
            hasMenu: true,
            visible: false,
            icon: GridColumnIcon.HeaderString,
            trailingRowOptions: {
                disabled: true,
            },
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
            icon: GridColumnIcon.HeaderLookup,
            trailingRowOptions: {
                disabled: false,
            },
        },
        {
            title: 'DefineSeq',
            id: 'DefineSeq',
            kind: 'Text',
            readonly: false,
            width: 220,
            hasMenu: true,
            visible: false,
            icon: GridColumnIcon.HeaderRowID,
            trailingRowOptions: {
                disabled: true,
            },
        },
        {
            title: 'Thuộc tính',
            id: 'DefineItemName',
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
            title: 'Trạng thái',
            id: 'IsActive',
            kind: 'Boolean',
            readonly: false,
            width: 200,
            hasMenu: true,
            visible: true,
            icon: GridColumnIcon.HeaderBoolean,
            trailingRowOptions: {
                disabled: true,
            },
        }
    ], [t]);
    const [loading, setLoading] = useState(false)

    const [path, setPath] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selection, setSelection] = useState({
        columns: CompactSelection.empty(),
        rows: CompactSelection.empty()
    })
    const [selectionItem, setSelectionItem] = useState({
        columns: CompactSelection.empty(),
        rows: CompactSelection.empty()
    })
    const [showSearch, setShowSearch] = useState(false)
    const [lastClickedCell, setLastClickedCell] = useState(null)
    const [addedRows, setAddedRows] = useState([])
    const [addedRowsItem, setAddedRowsItem] = useState([])

    const [editedRows, setEditedRows] = useState([])
    const [editedRowsItem, setEditedRowsItem] = useState([])
    const [clickedRowData, setClickedRowData] = useState(null)
    const [isMinusClicked, setIsMinusClicked] = useState(false)
    const [numRowsToAdd, setNumRowsToAdd] = useState(null)
    const [numRowsToAddItem, setNumRowsToAddItem] = useState(null)
    const [numRows, setNumRows] = useState(0)
    const [numRowsItem, setNumRowsItem] = useState(0)
    const [clickCount, setClickCount] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isSent, setIsSent] = useState(false)
    const [openHelp, setOpenHelp] = useState(false)
    const [isCellSelected, setIsCellSelected] = useState(false)
    const [isCellSelectedItem, setIsCellSelectedItem] = useState(false)
    const [onSelectRow, setOnSelectRow] = useState([])
    const [onSelectRowItem, setOnSelectRowItem] = useState([])
    const [groups, setGroups] = useState([])
    const [gridDataItem, setGridDataItem] = useState([])
    const [groupsData, setGroupsData] = useState([])
    const [dataType, setDataType] = useState([])
    const [cols, setCols] = useState(() =>
        loadFromLocalStorageSheet(
            'define_a',
            defaultColsA.filter((col) => col.visible)
        )
    )

    const [colsItem, setColsItem] = useState(() =>
        loadFromLocalStorageSheet(
            'define_item_a',
            defaultColsB.filter((col) => col.visible)
        )
    )
    useEffect(() => {
        cancelAllRequests();
        message.destroy();
      }, [])
    const resetTable = () => {
        setSelection({
            columns: CompactSelection.empty(),
            rows: CompactSelection.empty()
        })
    }
    const resetTableItem = () => {
        setSelectionItem({
            columns: CompactSelection.empty(),
            rows: CompactSelection.empty()
        })
    }

    const getSelectedRowsA = () => {
        const selectedRows = selection.rows.items
        let rows = []
        selectedRows.forEach((range) => {
            const start = range[0]
            const end = range[1] - 1

            for (let i = start; i <= end; i++) {
                if (groupsData[i]) {
                    rows.push(groupsData[i])
                }
            }
        })

        return rows
    }

    const getSelectedRowsB = () => {
        const selectedRows = selectionItem.rows.items
        let rows = []
        selectedRows.forEach((range) => {
            const start = range[0]
            const end = range[1] - 1

            for (let i = start; i <= end; i++) {
                if (gridDataItem[i]) {
                    rows.push(gridDataItem[i])
                }
            }
        })

        return rows
    }



    const handleRowAppendA = useCallback(
        (numRowsToAdd) => {
            if (canCreate === false) {
                return
            }
            onRowAppended(cols, setGroupsData, setNumRows, setAddedRows, numRowsToAdd)
        },
        [cols, setGroupsData, setNumRows, setAddedRows, numRowsToAdd]
    )
    const handleRowAppendB = useCallback(
        (numRowsToAddItem) => {
            if (canCreate === false) {

                return
            }
            onRowAppended(colsItem, setGridDataItem, setNumRowsItem, setAddedRowsItem, numRowsToAddItem)
        },
        [colsItem, setGridDataItem, setNumRowsItem, setAddedRowsItem, numRowsToAddItem]
    )
    const fetchData = useCallback(async () => {
        setLoading(true)
        try {

            const response = await getQDefine()

            if (response.success) {
                const fetchedData = response.data.data || []
                const emptyData = generateEmptyData(50, defaultColsA)
                const combinedData = [...fetchedData, ...emptyData];
                const updatedData = updateIndexNo(combinedData);
                setGroupsData(updatedData)
                setNumRows(fetchedData.length + emptyData.length)
                resetTable()
            } else {
                message.error(response.data.message || 'Có lỗi xảy ra khi lấy dữ liệu!')
            }
        } catch (error) {
            const emptyData = generateEmptyData(50, defaultColsA)
            const updatedEmptyData = updateIndexNo(emptyData);
            setGroupsData(updatedEmptyData)
            setNumRows(emptyData.length)
        } finally {
            setLoading(false)
        }
    }, [])
    const fetchDataSeq = useCallback(async (defineSeq) => {
        setLoading(true)
        try {

            const response = await getQDefineSeqItems(defineSeq)

            if (response.success) {
                const fetchedData = response.data.data || []
                const emptyData = generateEmptyData(50, defaultColsA)
                const combinedData = [...fetchedData, ...emptyData];
                const updatedData = updateIndexNo(combinedData);
                setGridDataItem(updatedData)
                setNumRowsItem(fetchedData.length + emptyData.length)
                resetTableItem()
            } else {
                message.error(response.data.message || 'Có lỗi xảy ra khi lấy dữ liệu!')
            }
        } catch (error) {
            const emptyData = generateEmptyData(50, defaultColsA)
            const updatedEmptyData = updateIndexNo(emptyData);
            setGridDataItem(updatedEmptyData)
            setNumRowsItem(emptyData.length)
        } finally {
            setLoading(false)
        }
    }, [])
    useEffect(() => {
        fetchData()
    }, [])

    const getSelectedRowsDataA = () => {
        const selectedRows = selection.rows.items;

        return selectedRows.flatMap(([start, end]) =>
            Array.from({ length: end - start }, (_, i) => groupsData[start + i]).filter((row) => row !== undefined)
        );
    };
    useEffect(() => {
        const data = getSelectedRowsDataA();
        if (data && data.length > 0) {
            if (data[0].IdSeq !== "") {
                setDataType(data)
                fetchDataSeq(data[0]?.IdSeq)

            } else {
                setDataType([])
            }

        } else {
            setDataType([])
        }
    }, [selection.rows.items, groupsData]);


    const handleSaveA = useCallback(async () => {
        if (canCreate === false) {
            return false;
        }

        const columnsU = ['IdSeq', 'DefineName', 'Description', 'IdxNo'];
        const columnsA = ['DefineName', 'Description', 'IdxNo'];
        const resulU = filterAndSelectColumns(groupsData, columnsU, 'U');
        const resulA = filterAndSelectColumns(groupsData, columnsA, 'A');

        if (resulA.length === 0 && resulU.length === 0) {
            return true;
        }

        setIsSent(true);

        try {
            const promises = [];
            if (resulA.length > 0) {
                promises.push(PostADefine(resulA));
            }
            if (resulU.length > 0) {
                promises.push(PostUDefine(resulU));
            }

            const results = await Promise.all(promises);
            const isSuccess = results.every(result => result.success);
            const updateGridData = (newData) => {
                setGroupsData((prevGridData) => {
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
                setEditedRows([]);
                setAddedRows([]);
            }

            return isSuccess;
        } catch (error) {
            return false;
        } finally {
            setIsLoading(false);
            setIsSent(false);
        }
    }, [groupsData]);
    const handleSaveB = useCallback(async () => {
        if (canCreate === false) {
            showErrorNotifiAorU(['Bạn không có quyền thêm dữ liệu']);
            return false;
        }

        const columnsU = ['IdSeq', 'DefineItemName', 'DefineSeq', 'IsActive', 'IdxNo'];
        const columnsA = ['DefineItemName', 'DefineSeq', 'IsActive', 'IdxNo'];
        const resulU = filterAndSelectColumns(gridDataItem, columnsU, 'U');
        const resulA = filterAndSelectColumns(gridDataItem, columnsA, 'A');

        if (resulA.length === 0 && resulU.length === 0) {
            return true;
        }

        try {
            const promises = [];
            if (resulA.length > 0) {
                promises.push(PostADefineItem(resulA));
            }
            if (resulU.length > 0) {
                promises.push(PostUDefineItem(resulU));
            }

            const results = await Promise.all(promises);
            const isSuccess = results.every(result => result.success);
            const updateGridData = (newData) => {
                setGridDataItem((prevGridData) => {
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
                setEditedRowsItem([]);
                setAddedRowsItem([]);
                resetTableItem();
            }

            return isSuccess;
        } catch (error) {
            return false;
        }
    }, [gridDataItem]);

    const handleSaveAll = async () => {

        setIsLoading(true);

        try {
            const [saveA, saveB] = await Promise.all([
                handleSaveA(),
                handleSaveB(),
            ]);


            if (saveA && saveB) {
                console.log('saving')
            }
        } catch (error) {
            console.log('error saving')
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = useCallback(() => {
        if (canDelete === false) {
            message.warning('Bạn không có quyền xóa dữ liệu')
            return;
        }

        const selectedRowsA = getSelectedRowsA();
        const selectedRowsB = getSelectedRowsB();

        const deletePromises = [];

        if (selectedRowsA.length > 0) {
            const handleDeleteA = deleteDataSheet(
                getSelectedRowsA,
                PostDDefine,
                groupsData,
                setGroupsData,
                setNumRows,
                resetTable,
                editedRows,
                setEditedRows,
                "IdSeq"
            ).then(result => ({
                table: 'A',
                ...result,
            }));
            deletePromises.push(handleDeleteA);
        }

        if (selectedRowsB.length > 0) {
            const handleDeleteB = deleteDataSheet(
                getSelectedRowsB,
                PostDDefineItem,
                gridDataItem,
                setGridDataItem,
                setNumRowsItem,
                resetTableItem,
                editedRowsItem,
                setEditedRowsItem,
                "IdSeq"
            ).then(result => ({
                table: 'B',
                ...result,
            }));
            deletePromises.push(handleDeleteB);
        }

        if (deletePromises.length === 0) {
            message.warning('Không có dữ liệu nào được chọn để xóa!')
            return;
        }

        Promise.all(deletePromises).then((results) => {
            const hasError = results.some((result) => !result.success);

            if (hasError) {
                const errorMessages = results
                    .filter((result) => !result.success)
                    .map((result) => `${result.table}: ${result.message}`);
                message.error(errorMessages)
            } else {
                message.success('Xóa dữ liệu thành công!')
            }
        });
    }, [
        canDelete,
        groupsData,
        gridDataItem,
        editedRows,
        editedRowsItem,
        getSelectedRowsA,
        getSelectedRowsB,
        PostDDefine,
        PostDDefineItem,
        setGroupsData,
        setGridDataItem,
        setNumRows,
        setNumRowsItem,
        resetTable,
        resetTableItem,
        setEditedRows,
        setEditedRowsItem,
        selection,
        selectionItem
    ]);
    return (
        <>
            <Helmet>
                <title>{t('Định nghĩa bảng')}</title>
            </Helmet>

            <div className="bg-slate-50 p-3 h-screen overflow-hidden">
                <div className="flex flex-col gap-4 md:grid md:grid-cols-4 md:grid-rows-[auto_1fr] md:gap-4 h-full">
                    <div className="col-start-1 col-end-5 row-start-1 w-full rounded-lg ">
                        <div className="flex items-center justify-between">
                            <Title level={4} className="mt-2 uppercase opacity-85 ">
                                {t('Định nghĩa bảng')}
                            </Title>
                            <DefineAction handleSaveData={handleSaveAll} handleDelete={handleDelete} fetchData={fetchData} />
                        </div>
                        <details
                            className="group p-2 [&_summary::-webkit-details-marker]:hidden border rounded-lg bg-white"
                            open
                        >
                            <summary className="flex cursor-pointer items-center justify-between gap-1.5 text-gray-900">
                                <h2 className="text-xs font-medium flex items-center gap-2  uppercase">
                                    <FilterOutlined />
                                    Điều kiện truy vấn
                                </h2>
                                <span className="relative size-5 shrink-0">
                                    <ArrowIcon />
                                </span>
                            </summary>
                            <div className="flex p-2 gap-4">
                                <DefineQuery
                                    dataType={dataType}
                                />
                            </div>
                        </details>
                    </div>

                    <div className="col-start-1 col-end-5 row-start-2 w-full h-full rounded-lg  overflow-auto">
                        <Splitter className="w-full h-full">
                            <SplitterPanel size={35} minSize={10}>
                                <TableDefine

                                    setSelection={setSelection}
                                    selection={selection}
                                    showSearch={showSearch}
                                    setShowSearch={setShowSearch}
                                    setAddedRows={setAddedRows}
                                    addedRows={addedRows}
                                    setEditedRows={setEditedRows}
                                    editedRows={editedRows}
                                    setNumRowsToAdd={setNumRowsToAdd}
                                    clickCount={clickCount}
                                    numRowsToAdd={numRowsToAdd}
                                    numRows={numRows}
                                    onSelectRow={onSelectRow}
                                    openHelp={openHelp}
                                    setOpenHelp={setOpenHelp}
                                    setOnSelectRow={setOnSelectRow}
                                    setIsCellSelected={setIsCellSelected}
                                    isCellSelected={isCellSelected}
                                    setGridData={setGroupsData}
                                    gridData={groupsData}
                                    groups={groups}
                                    setNumRows={setNumRows}
                                    setCols={setCols}
                                    handleRowAppend={handleRowAppendA}
                                    cols={cols}
                                    canCreate={canCreate}
                                    defaultCols={defaultColsA}
                                    canEdit={canEdit}
                                />
                            </SplitterPanel>
                            <SplitterPanel size={65} minSize={20}>
                                <TableDefineItem
                                    setSelection={setSelectionItem}
                                    selection={selectionItem}
                                    showSearch={showSearch}
                                    setShowSearch={setShowSearch}
                                    setAddedRows={setAddedRowsItem}
                                    addedRows={addedRowsItem}
                                    setEditedRows={setEditedRowsItem}
                                    editedRows={editedRowsItem}
                                    setNumRowsToAdd={setNumRowsToAdd}
                                    clickCount={clickCount}
                                    numRowsToAdd={numRowsToAdd}
                                    numRows={numRowsItem}
                                    onSelectRow={onSelectRowItem}
                                    openHelp={openHelp}
                                    setOpenHelp={setOpenHelp}
                                    setOnSelectRow={setOnSelectRowItem}
                                    setIsCellSelected={setIsCellSelectedItem}
                                    isCellSelected={isCellSelectedItem}
                                    setGridData={setGridDataItem}
                                    gridData={gridDataItem}
                                    groups={groups}
                                    setNumRows={setNumRowsItem}
                                    setCols={setColsItem}
                                    handleRowAppend={handleRowAppendB}
                                    cols={colsItem}
                                    canCreate={canCreate}
                                    defaultCols={defaultColsB}
                                    canEdit={canEdit}
                                    dataType={dataType}
                                />
                            </SplitterPanel>
                        </Splitter>
                    </div>
                </div>
            </div>
        </>
    )
}
