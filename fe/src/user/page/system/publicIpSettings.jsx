/* PdmmOutQueryList */

import { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet'
import { Typography, Button, message, Modal, Collapse } from 'antd'
const { Title, Text } = Typography
import { FilterOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import { CompactSelection, GridColumnIcon } from '@glideapps/glide-data-grid'
import { debounce } from 'lodash'
import { useNavigate } from 'react-router-dom'
import TopLoadingBar from 'react-top-loading-bar';
import { loadFromLocalStorageSheet } from '../../../localStorage/sheet/sheet'


import { togglePageInteraction } from '../../../utils/togglePageInteraction'
import { updateIndexNo } from '../../components/sheet/js/updateIndexNo'
import PublicIPSettingsAction from '../../components/actions/system/publicIPSettingsAction'
import TablePublicIPSettings from '../../components/table/system/tablePublicIPSettings'
import { GetPublicIPSettings } from '../../../features/system/getPublicIPSettings'
import { onRowAppended } from '../../components/sheet/js/onRowAppended'
import { PostUPublicIPSettings } from '../../../features/system/postUPublicIPSettings'
import { PostAPublicIPSettings } from '../../../features/system/postAPublicIPSettings'
import { filterAndSelectColumns } from '../../../utils/filterUorA'
import { PostDPublicIPSettings } from '../../../features/system/postDPublicIPSettings'
import { generateEmptyData } from '../../components/sheet/js/generateEmptyData'
export default function PublicIPSettings({ permissions,
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
            title: 'IP',
            id: 'IPAddress',
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
            title: 'Description',
            id: 'Description',
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

    const [numRows, setNumRows] = useState(0)
    const [numRowsToAdd, setNumRowsToAdd] = useState(null)
    const [addedRows, setAddedRows] = useState([])
    const [editedRows, setEditedRows] = useState([])
    const [isSent, setIsSent] = useState(false)
    const formatDate = (date) => date.format('YYYYMMDD')
    const [cols, setCols] = useState(() =>
        loadFromLocalStorageSheet(
            'public_ip_settings_a',
            defaultCols.filter((col) => col.visible)
        )
    )
    const [selection, setSelection] = useState({
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
            const response = await GetPublicIPSettings(search, signal);

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
    const handleSaveData = async () => {
        const columnsU = ['IdSeq', 'IPAddress', 'Description', 'IdxNo'];
        const columnsA = ['IPAddress', 'Description', 'IdxNo'];

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
            if (resulA.length > 0) promises.push(PostAPublicIPSettings(resulA));
            if (resulU.length > 0) promises.push(PostUPublicIPSettings(resulU));

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



    /* 
        const handleDelete = useCallback(() => {
            const selectedRows = getSelectedRows();
            const rowsToDelete = selectedRows.filter(row => !row.Status || row.Status === 'U' || row.Status === 'D');
    
            const deleteSeqs = rowsToDelete.map(row => row.IdSeq);
    
            if (deleteSeqs.length === 0) {
                message.warning(t('870000011'));
                return;
            }
    
            if (loadingBarRef.current) loadingBarRef.current.continuousStart();
    
            PostDPublicIPSettings(rowsToDelete)
                .then(response => {
                    if (response.success) {
                        setGridData(prevData => {
                            const newData = prevData.filter(row => !deleteSeqs.includes(row.IdSeq));
                            setNumRows(newData.length);
                            return newData;
                        });
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
                    if (loadingBarRef.current) loadingBarRef.current.complete();
                });
        }, [selection, t]); */
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
                PostDPublicIPSettings(rowsToDelete)
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

    return (
        <>
            <Helmet>
                <title>ITM - {t('Địa chỉ IP Public')}</title>
            </Helmet>
            <TopLoadingBar color="blue" height={2} ref={loadingBarRef} />
            <div className="bg-slate-50 h-[calc(100vh-42px)] overflow-hidden">
                <div className="flex flex-col h-full">
                    <div className="col-start-1 p-2 col-end-5 row-start-1 w-full">
                        <div className="flex items-end justify-end">
                            <PublicIPSettingsAction fetchData={fetchData} handleSaveData={handleSaveData} handleDelete={handleDelete} />
                        </div>
                    </div>
                    <div className="col-start-1 col-end-5 row-start-2 w-full flex-1 min-h-0 border-t overflow-auto relative">
                        <TablePublicIPSettings
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


                            handleRowAppend={handleRowAppend}
                            setNumRowsToAdd={setNumRowsToAdd}
                            numRowsToAdd={numRowsToAdd}
                            setAddedRows={setAddedRows}
                            addedRows={addedRows}

                        />
                    </div>
                </div>
            </div>


        </>
    )
}