/* PdmmOutQueryList */

import { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet'
import { Typography, Button, message, Modal, Collapse } from 'antd'
import { CompactSelection, GridColumnIcon } from '@glideapps/glide-data-grid'
import { useNavigate } from 'react-router-dom'
import TopLoadingBar from 'react-top-loading-bar';
import { loadFromLocalStorageSheet } from '../../../localStorage/sheet/sheet'

import { togglePageInteraction } from '../../../utils/togglePageInteraction'
import { updateIndexNo } from '../../components/sheet/js/updateIndexNo'
import { Splitter, SplitterPanel } from 'primereact/splitter'
import TableMail from '../../components/table/system/tableMail'
import TableMailSeq from '../../components/table/system/tableMailSeq'
import { onRowAppended } from '../../components/sheet/js/onRowAppended'
import MailAction from '../../components/actions/system/mailAction'
import { PostQEmail } from '../../../features/system/email/postQEmail'
import { PostAEmail } from '../../../features/system/email/postAEmail'
import { PostUEmail } from '../../../features/system/email/postUEmail'
import { filterAndSelectColumns } from '../../../utils/filterUorA'
import { generateEmptyData } from '../../components/sheet/js/generateEmptyData'
import { PostDEmail } from '../../../features/system/email/postDEmail'
export default function MailSettings({ permissions,
    isMobile,
    canCreate,
    canEdit,
    canDelete,
    controllers,
    cancelAllRequests
}) {
    /* ADD */
    const { t } = useTranslation()
    const gridRef = useRef(null)
    const navigate = useNavigate()
    const loadingBarRef = useRef(null);
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
            title: 'IdSeq',
            id: 'IdSeq',
            kind: 'Boolean',
            readonly: true,
            width: 150,
            hasMenu: true,
            visible: false,
            icon: GridColumnIcon.HeaderBoolean,
            trailingRowOptions: {
                disabled: true,
            },
        },

        {
            title: 'Host',
            id: 'Host',
            kind: 'Text',
            readonly: false,
            width: 250,
            hasMenu: true,
            visible: true,
            icon: GridColumnIcon.HeaderString,
            trailingRowOptions: {
                disabled: true,
            },
        },
        {
            title: 'Port',
            id: 'Port',
            kind: 'Text',
            readonly: false,
            width: 350,
            hasMenu: true,
            visible: true,
            icon: GridColumnIcon.HeaderString,
            trailingRowOptions: {
                disabled: true,
            },
        },
        {
            title: 'UserName',
            id: 'UserName',
            kind: 'Text',
            readonly: false,
            width: 350,
            hasMenu: true,
            visible: true,
            icon: GridColumnIcon.HeaderString,
            trailingRowOptions: {
                disabled: true,
            },
        },
        {
            title: 'Password',
            id: 'Password',
            kind: 'Text',
            readonly: false,
            width: 350,
            hasMenu: true,
            visible: true,
            icon: GridColumnIcon.HeaderString,
            trailingRowOptions: {
                disabled: true,
            },
        },

        {
            title: 'Mã Mail',
            id: 'CodeMail',
            kind: 'Text',
            readonly: false,
            width: 350,
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
            title: 'IdSeq',
            id: 'IdSeq',
            kind: 'Boolean',
            readonly: true,
            width: 150,
            hasMenu: true,
            visible: false,
            icon: GridColumnIcon.HeaderBoolean,
            trailingRowOptions: {
                disabled: true,
            },
        },


        {
            title: 'Ngôn ngữ',
            id: 'Ngôn ngữ',
            kind: 'Text',
            readonly: false,
            width: 250,
            hasMenu: true,
            visible: true,
            icon: GridColumnIcon.HeaderString,
            trailingRowOptions: {
                disabled: true,
            },
        },
        {
            title: 'Subject',
            id: 'Subject',
            kind: 'Text',
            readonly: false,
            width: 350,
            hasMenu: true,
            visible: true,
            icon: GridColumnIcon.HeaderString,
            trailingRowOptions: {
                disabled: true,
            },
        },
        {
            title: 'PlainText',
            id: 'PlainText',
            kind: 'Text',
            readonly: false,
            width: 350,
            hasMenu: true,
            visible: true,
            icon: GridColumnIcon.HeaderString,
            trailingRowOptions: {
                disabled: true,
            },
        },
        {
            title: 'From',
            id: 'From',
            kind: 'Text',
            readonly: false,
            width: 350,
            hasMenu: true,
            visible: true,
            icon: GridColumnIcon.HeaderString,
            trailingRowOptions: {
                disabled: true,
            },
        },
        {
            title: 'HtmlContent',
            id: 'HtmlContent',
            kind: 'Text',
            readonly: false,
            width: 350,
            hasMenu: true,
            visible: true,
            icon: GridColumnIcon.HeaderString,
            trailingRowOptions: {
                disabled: true,
            },
        },




    ], [t]);
    const [loadingA, setLoadingA] = useState(false)
    const [showSearch, setShowSearch] = useState(false)
    const [data, setData] = useState([])
    const [gridData, setGridData] = useState([])
    const [gridData2, setGridData2] = useState([])

    const [numRows, setNumRows] = useState(0)
    const [numRows2, setNumRows2] = useState(0)
    const [numRowsToAdd, setNumRowsToAdd] = useState(null)
    const [numRowsToAdd2, setNumRowsToAdd2] = useState(null)
    const [addedRows, setAddedRows] = useState([])
    const [addedRows2, setAddedRows2] = useState([])
    const [editedRows, setEditedRows] = useState([])

    const formatDate = (date) => date.format('YYYYMMDD')
    const [cols, setCols] = useState(() =>
        loadFromLocalStorageSheet(
            'mail_settings_a',
            defaultCols.filter((col) => col.visible)
        )
    )
    const [cols2, setCols2] = useState(() =>
        loadFromLocalStorageSheet(
            'mail_seq_settings_a',
            defaultColsB.filter((col) => col.visible)
        )
    )
    const [selection, setSelection] = useState({
        columns: CompactSelection.empty(),
        rows: CompactSelection.empty()
    })
    const [selection2, setSelection2] = useState({
        columns: CompactSelection.empty(),
        rows: CompactSelection.empty()
    })
    const resetTable = () => {
        setSelection({
            columns: CompactSelection.empty(),
            rows: CompactSelection.empty(),
        })
    }

    const fetchData = async () => {

        setLoadingA(true);
        if (controllers.current.fetchData) {
            controllers.current.fetchData.abort();
            controllers.current.fetchData = null;
            await new Promise((resolve) => setTimeout(resolve, 10));
        }
        if (loadingBarRef.current) {
            loadingBarRef.current.continuousStart();
        }
        togglePageInteraction(true)
        const controller = new AbortController();
        const signal = controller.signal;

        controllers.current.fetchData = controller;
        const search = {

        };
        try {
            const response = await PostQEmail(search, signal);

            if (response.success) {
                const fetchedData = updateIndexNo(response.data) || [];
                const emptyData = generateEmptyData(100, defaultCols)
                const updatedData = updateIndexNo([...fetchedData, ...emptyData])
                setGridData(updatedData);
                setNumRows(updatedData.length);
            } else {
                setGridData([])
                setNumRows(0)
                setData([]);
            }
        } catch (error) {
            setData([]);
        } finally {
            if (loadingBarRef.current) {
                loadingBarRef.current.complete();
            }
            togglePageInteraction(false)
            controllers.current.fetchData = null;
            setLoadingA(false);
        }
    };
    useEffect(() => {
        cancelAllRequests();
        message.destroy();
        fetchData()
    }, [])




    const handleRowAppend = useCallback(
        (numRowsToAdd) => {
            onRowAppended(cols, setGridData, setNumRows, setAddedRows, numRowsToAdd)
        },
        [cols, setGridData, setNumRows, setAddedRows, numRowsToAdd],
    )
    const handleRowAppend2 = useCallback(
        (numRowsToAdd2) => {
            onRowAppended(cols2, setGridData2, setNumRows2, setAddedRows2, numRowsToAdd2)
        },
        [cols2, setGridData2, setNumRows2, setAddedRows2, numRowsToAdd2],
    )


    const handleSaveData = async () => {
        const columnsU = ['IdSeq', 'Host', 'Port', 'UserName', 'Password', 'CodeMail', 'IdxNo'];
        const columnsA = ['Host', 'Port', 'UserName', 'Password', 'CodeMail', 'IdxNo'];

        if (loadingBarRef.current) {
            loadingBarRef.current.continuousStart();
        }
        togglePageInteraction(true);

        try {
            const resulU = filterAndSelectColumns(gridData, columnsU, 'U');
            const resulA = filterAndSelectColumns(gridData, columnsA, 'A');

            if (resulA.length === 0 && resulU.length === 0) {
                message.warning(t('870000003'));
                return;
            }

            const promises = [];
            if (resulA.length > 0) promises.push(PostAEmail(resulA));
            if (resulU.length > 0) promises.push(PostUEmail(resulU));

            const results = await Promise.all(promises);
            const isSuccess = results.every(result => result?.success === true);

            if (isSuccess) {
                const mergedData = results.flatMap(result => result?.data || []);

                setGridData(prev => {
                    const updated = prev.map(item => {
                        const match = mergedData.find(d => d.IdxNo === item.IdxNo);
                        return match ? match : item;
                    });
                    return updateIndexNo(updated);
                });
                togglePageInteraction(false)
                message.success(t('Thêm thành công'));
            } else {
                message.error(t('870000004'));
            }

            return isSuccess;
        } catch (error) {
            message.error(error?.message || t('870000004'));
        } finally {
            if (loadingBarRef.current) loadingBarRef.current.complete();
            togglePageInteraction(false);
        }
    };
    const getSelectedRows = () => {
        const selectedRows = selection.rows.items;
        let seqs = [];
        selectedRows.forEach((range) => {
            const start = range[0];
            const end = range[1] - 1;

            for (let i = start; i <= end; i++) {
                if (gridData[i]) {
                    seqs.push({ IdSeq: gridData[i].IdSeq });
                }
            }
        });

        return seqs;
    };

    const getSelectedRowsItem = () => {
        const selectedRows = selection.rows.items
        let rows = []
        selectedRows.forEach((range) => {
            const start = range[0]
            const end = range[1] - 1

            for (let i = start; i <= end; i++) {
                if (gridData[i]) {
                    gridData[i]['IdxNo'] = i + 1
                    rows.push(gridData[i])
                }
            }
        })

        return rows
    }

    const handleDelete = useCallback(
        (e) => {
            togglePageInteraction(true)
            if (canDelete === false) {
                message.warning(t('870000018'))
                togglePageInteraction(false)
                if (loadingBarRef.current) {
                    loadingBarRef.current.complete();
                }
                return
            }
            if (loadingBarRef.current) {
                loadingBarRef.current.continuousStart();
            }


            const selectedRows = getSelectedRowsItem()
            const rowsToDelete = selectedRows.filter(row => !row.Status || row.Status === 'U' || row.Status === 'D');

            const deleteSeqs = rowsToDelete.map(row => row.IdSeq);

            const rowsWithStatusA = selectedRows.filter((row) => row.Status === 'A')


            if (rowsToDelete.length > 0) {
                PostDEmail(rowsToDelete)
                    .then(response => {
                        if (response.success) {
                            setGridData(prevData => {
                                const newData = prevData.filter(row => !deleteSeqs.includes(row.IdSeq));
                                setNumRows(newData.length);
                                return newData;
                            });
                            togglePageInteraction(false)
                            if (loadingBarRef.current) {
                                loadingBarRef.current.complete();
                            }
                            resetTable();
                            message.success('Xóa thành công!');
                        } else {

                            message.error(response.data.message || t('870000012'));
                        }
                    })
                    .catch(() => {
                        message.error(t('870000013'));
                    })
                    .finally(() => {
                        togglePageInteraction(false)
                        if (loadingBarRef.current) loadingBarRef.current.complete();
                    });
            }

            if (rowsWithStatusA.length > 0) {
                const idsWithStatusA = rowsWithStatusA.map((row) => row.Id)
                const remainingRows = gridData.filter(
                    (row) => !idsWithStatusA.includes(row.Id),
                )
                const remainingEditedRows = editedRows.filter(
                    (editedRow) => !idsWithStatusA.includes(editedRow.updatedRow?.Id),
                )
                togglePageInteraction(false)
                if (loadingBarRef.current) {
                    loadingBarRef.current.complete();
                }
                const updatedDataEditedRows = updateIndexNo(remainingEditedRows);
                const updatedRemainingRows = updateIndexNo(remainingRows);
                setEditedRows(updatedDataEditedRows)
                setGridData(updatedRemainingRows)
                setNumRows(remainingRows.length)
                resetTable()
            }
        },
        [
            canDelete,
            gridData,
            selection,
            editedRows,

        ],
    )

    const getSelectedRowsData = () => {
        const selectedRows = selection.rows.items;

        return selectedRows.flatMap(([start, end]) =>
            Array.from({ length: end - start }, (_, i) => gridData[start + i]).filter((row) => row !== undefined)
        );
    };


    useEffect(() => {
        const data = getSelectedRowsData();
        if (data && data.length > 0) {

            console.log('getSelectedRowsData', data)

        } else {

        }
    }, [selection.rows.items]);

    return (
        <>
            <Helmet>
                <title>ITM - {t('Cấu hình Mail')}</title>
            </Helmet>
            <TopLoadingBar color="blue" height={2} ref={loadingBarRef} />
            <div className="bg-slate-50 h-[calc(100vh-40px)] overflow-hidden">
                <div className="flex flex-col h-full">
                    <div className="p-2 w-full">
                        <div className="flex items-end justify-end">
                            <MailAction fetchData={fetchData} handleSaveData={handleSaveData} handleDelete={handleDelete} />
                        </div>
                    </div>

                    <div className="flex-1 w-full border-t overflow-hidden relative">
                        <TableMail
                            setSelection={setSelection}
                            showSearch={showSearch}
                            setShowSearch={setShowSearch}
                            selection={selection}
                            canEdit={canEdit}
                            cols={cols}
                            setCols={setCols}
                            setGridData={setGridData}
                            gridData={gridData}
                            defaultCols={defaultCols}
                            setNumRows={setNumRows}
                            numRows={numRows}
                            setEditedRows={setEditedRows}
                            editedRows={editedRows}
                            setNumRowsToAdd={setNumRowsToAdd}
                            numRowsToAdd={numRowsToAdd}
                            setAddedRows={setAddedRows}
                            addedRows={addedRows}
                            handleRowAppend={handleRowAppend}
                        />
                        {/*   <Splitter layout="vertical" className="h-full">
                            <SplitterPanel size={30} minSize={10} className="overflow-auto border-b">
                                <TableMail
                                    setSelection={setSelection}
                                    showSearch={showSearch}
                                    setShowSearch={setShowSearch}
                                    selection={selection}
                                    canEdit={canEdit}
                                    cols={cols}
                                    setCols={setCols}
                                    setGridData={setGridData}
                                    gridData={gridData}
                                    defaultCols={defaultCols}
                                    setNumRows={setNumRows}
                                    numRows={numRows}
                                    setEditedRows={setEditedRows}
                                    editedRows={editedRows}
                                    setNumRowsToAdd={setNumRowsToAdd}
                                    numRowsToAdd={numRowsToAdd}
                                    setAddedRows={setAddedRows}
                                    addedRows={addedRows}
                                    handleRowAppend={handleRowAppend}
                                />
                            </SplitterPanel>

                            <SplitterPanel size={70} minSize={20} className="overflow-auto">
                                <TableMailSeq
                                    setSelection={setSelection2}
                                    showSearch={showSearch}
                                    setShowSearch={setShowSearch}
                                    selection={selection2}
                                    canEdit={canEdit}
                                    cols={cols2}
                                    setCols={setCols2}
                                    setGridData={setGridData2}
                                    gridData={gridData2}
                                    defaultCols={defaultColsB}
                                    setNumRows={setNumRows2}
                                    numRows={numRows2}
                                    setNumRowsToAdd={setNumRowsToAdd2}
                                    numRowsToAdd={numRowsToAdd2}
                                    setAddedRows={setAddedRows2}
                                    addedRows={addedRows2}
                                    handleRowAppend={handleRowAppend2}
                                />
                            </SplitterPanel>
                        </Splitter> */}
                    </div>
                </div>
            </div>



        </>
    )
}