import { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet'
import { FilterOutlined } from '@ant-design/icons'
import { ArrowIcon } from '../../components/icons'
import { Input, Typography, Row, Col, message, Form, Select, Switch, Tree } from 'antd'
import { CarryOutOutlined, CheckOutlined, FormOutlined } from '@ant-design/icons';
const { Title, Text } = Typography
import { debounce } from 'lodash'
import { CompactSelection, GridColumnIcon } from '@glideapps/glide-data-grid'
import ViewProdBOM from '../../components/view/prodMgmt/viewProdBOM'
import { Splitter, SplitterPanel } from 'primereact/splitter'
import { onRowAppended } from '../../components/sheet/js/onRowAppended'
import { loadFromLocalStorageSheet } from '../../../localStorage/sheet/sheet'
import RegiBOMQuery from '../../components/query/prodMgmt/regiBOMQuery'
import { GetCodeHelp } from '../../../features/codeHelp/getCodeHelp'
import { GetQTreeSeq } from '../../../features/bom/getQTreeSeq'
import { GetQBomItemInfo } from '../../../features/bom/getQBomItemInfo'
import { GetQBomVerMngQuery } from '../../../features/bom/getQBomVerMng'
import { GetQBomSubItem } from '../../../features/bom/getQBomSubItem'
import { generateEmptyData } from '../../components/sheet/js/generateEmptyData'
import { updateIndexNo } from '../../components/sheet/js/updateIndexNo'
import TopLoadingBar from 'react-top-loading-bar';
import { togglePageInteraction } from '../../../utils/togglePageInteraction'
import RegiBOMAcction from '../../components/actions/prodMgmt/regiBOMAcction'
import { filterAndSelectColumns } from '../../../utils/filterUorA'
import { PostASBomSubItem } from '../../../features/bom/postASBomSubItem'
import ErrorListModal from '../default/errorListModal'
import { PostDSBomSubItem } from '../../../features/bom/postDSBomSubItem'
import { PostUSBomSubItem } from '../../../features/bom/postUSBomSubItem'
const buildTree = (nodes, parentSeq = 0) => {
    return nodes
        .filter(node => node.ParentSeq === parentSeq)
        .sort((a, b) => a.Sort - b.Sort)
        .map(node => ({
            title: node.NodeName,
            key: node.Seq.toString(),
            icon: <CarryOutOutlined />,
            children: buildTree(nodes, node.Seq),
            ItemSeq: node.ItemSeqTree
        }));
};
export default function RegiBOM({
    permissions,
    isMobile,
    canCreate,
    canEdit,
    canDelete,
    controllers,
    cancelAllRequests
}) {
    const { t } = useTranslation()
    const loadingBarRef = useRef(null);
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
            title: 'SubItemSeq',
            id: 'SubItemSeq',
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
            title: t('29964'),
            id: 'Serl',
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
            title: t('327'),
            id: 'UserSeq',
            kind: 'Custom',
            readonly: false,
            width: 90,
            hasMenu: true,
            visible: true,
            icon: GridColumnIcon.HeaderNumber,
            trailingRowOptions: {
                disabled: true,
            },
        },
        {
            title: t('3285'),
            id: 'SubItemNo',
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
            title: t('3284'),
            id: 'SubItemName',
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
            title: t('809'),
            id: 'SubItemBomRev',
            kind: 'Text',
            readonly: false,
            width: 150,
            hasMenu: true,
            visible: true,
            icon: GridColumnIcon.HeaderString,
            trailingRowOptions: {
                disabled: true,
            },
        },
        {
            title: t('3280'),
            id: 'Spec',
            kind: 'Text',
            readonly: false,
            width: 150,
            hasMenu: true,
            visible: true,
            icon: GridColumnIcon.HeaderString,
            trailingRowOptions: {
                disabled: true,
            },
        },
        {
            title: t('3244'),
            id: 'UnitName',
            kind: 'Text',
            readonly: false,
            width: 100,
            hasMenu: true,
            visible: true,
            icon: GridColumnIcon.HeaderString,
            trailingRowOptions: {
                disabled: true,
            },
        },
        {
            title: t('3171'),
            id: 'NeedQtyNumerator',
            kind: 'Number',
            readonly: false,
            width: 150,
            hasMenu: true,
            visible: true,
            icon: GridColumnIcon.HeaderString,
            trailingRowOptions: {
                disabled: true,
            },
        },
        {
            title: t('3170'),
            id: 'NeedQtyDenominator',
            kind: 'Number',
            readonly: false,
            width: 150,
            hasMenu: true,
            visible: true,
            icon: GridColumnIcon.HeaderString,
            trailingRowOptions: {
                disabled: true,
            },
        },
        {
            title: t('3263'),
            id: 'HaveChild',
            kind: 'Boolean',
            readonly: true,
            width: 150,
            hasMenu: true,
            visible: true,
            icon: GridColumnIcon.HeaderBoolean,
            trailingRowOptions: {
                disabled: true,
            },
        },
        {
            title: t('1057'),
            id: 'InLossRate',
            kind: 'Number',
            readonly: false,
            width: 150,
            hasMenu: true,
            visible: true,
            icon: GridColumnIcon.HeaderString,
            trailingRowOptions: {
                disabled: true,
            },
        },
        {
            title: t('3158'),
            id: 'OutLossRate',
            kind: 'Number',
            readonly: false,
            width: 150,
            hasMenu: true,
            visible: true,
            icon: GridColumnIcon.HeaderString,
            trailingRowOptions: {
                disabled: true,
            },
        },
        {
            title: 'Ngày bắt đầu áp dụng',
            id: 'FrApplyDate',
            kind: 'Text',
            readonly: false,
            width: 150,
            hasMenu: true,
            visible: true,
            icon: GridColumnIcon.HeaderString,
            trailingRowOptions: {
                disabled: true,
            },
        },
        {
            title: t('221'),
            id: 'ToApplyDate',
            kind: 'Text',
            readonly: false,
            width: 150,
            hasMenu: true,
            visible: true,
            icon: GridColumnIcon.HeaderString,
            trailingRowOptions: {
                disabled: true,
            },
        },
        {
            title: t('373'),
            id: 'Location',
            kind: 'Text',
            readonly: false,
            width: 150,
            hasMenu: true,
            visible: true,
            icon: GridColumnIcon.HeaderString,
            trailingRowOptions: {
                disabled: true,
            },
        },
        {
            title: t('3215'),
            id: 'StkUnitName',
            kind: 'Text',
            readonly: false,
            width: 150,
            hasMenu: true,
            visible: true,
            icon: GridColumnIcon.HeaderString,
            trailingRowOptions: {
                disabled: true,
            },
        },
        {
            title: t('2119'),
            id: 'AssetName',
            kind: 'Text',
            readonly: false,
            width: 150,
            hasMenu: true,
            visible: true,
            icon: GridColumnIcon.HeaderString,
            trailingRowOptions: {
                disabled: true,
            },
        },
        {
            title: 'SMDelvType',
            id: 'SMDelvType',
            kind: 'Text',
            readonly: false,
            width: 150,
            hasMenu: true,
            visible: true,
            icon: GridColumnIcon.HeaderString,
            trailingRowOptions: {
                disabled: true,
            },
        },
    ], [t]);
    const [showLine, setShowLine] = useState(true);
    const [showLeafIcon, setShowLeafIcon] = useState(true);
    const [selection, setSelection] = useState({
        columns: CompactSelection.empty(),
        rows: CompactSelection.empty()
    })
    const [showSearch, setShowSearch] = useState(false)
    const [addedRows, setAddedRows] = useState([])
    const [addedRowsItem, setAddedRowsItem] = useState([])
    const [editedRows, setEditedRows] = useState([])
    const [numRowsToAdd, setNumRowsToAdd] = useState(null)
    const [numRows, setNumRows] = useState(0)
    const [openHelp, setOpenHelp] = useState(false)
    const [isCellSelected, setIsCellSelected] = useState(false)
    const [gridData, setGridData] = useState([])
    const [helpData01, setHelpData01] = useState([])
    const [helpData02, setHelpData02] = useState([])
    const [helpData03, setHelpData03] = useState([])
    const [loading, setLoading] = useState(false)
    const [dataTree, setDataTree] = useState([])
    const [dataSheetSearch, setDataSheetSearch] = useState([])
    const [verMng, setVerMng] = useState([])
    const [dataSub, setDataSub] = useState([])
    const [dataRootSeq, setDataRootSeq] = useState(null)
    const [dataError, setDataError] = useState([])
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [cols, setCols] = useState(() =>
        loadFromLocalStorageSheet(
            'regi_bom_a',
            defaultColsA.filter((col) => col.visible)
        )
    )
    const [searchText, setSearchText] = useState('')
    const [itemText, setItemText] = useState('')
    const [dataSearch, setDataSearch] = useState(null)
    const resetTable = () => {
        setSelection({
            columns: CompactSelection.empty(),
            rows: CompactSelection.empty()
        })
    }

    const fetchDataTreeSeq = useCallback(async (seq) => {
        setLoading(true)
        if (controllers.current.fetchDataTreeSeq) {
            controllers.current.fetchDataTreeSeq.abort();
            controllers.current.fetchDataTreeSeq = null;
            await new Promise((resolve) => setTimeout(resolve, 10));
        }
        if (loadingBarRef.current) {
            loadingBarRef.current.continuousStart();
        }
        const controller = new AbortController();
        const signal = controller.signal;

        controllers.current.fetchDataTreeSeq = controller;
        try {
            const response = await GetQTreeSeq(seq, signal)
            if (response.success) {
                const fetchedData = response.data || []
                const treeData = buildTree(fetchedData);
                setDataTree(treeData)
            } else {
                treeData([])
                message.error('Có lỗi xảy ra khi lấy dữ liệu!')
            }
        } catch (error) {
            message.error(error.message || 'Có lỗi xảy ra khi lấy dữ liệu!')
        } finally {
            setLoading(false)
            if (loadingBarRef.current) {
                loadingBarRef.current.complete();
            }
            controllers.current.fetchDataTreeSeq = null;
        }
    }, [])

    const fetchDataItemInfo = useCallback(async (seq) => {
        setLoading(true)
        if (controllers.current.fetchDataItemInfo) {
            controllers.current.fetchDataItemInfo.abort();
            controllers.current.fetchDataItemInfo = null;
            await new Promise((resolve) => setTimeout(resolve, 10));
        }

        const controller = new AbortController();
        const signal = controller.signal;

        controllers.current.fetchDataItemInfo = controller;
        try {
            const response = await GetQBomItemInfo(seq, signal)
            if (response.success) {
                const fetchedData = response.data || []
                setDataRootSeq(fetchedData[0])
                setDataSheetSearch(fetchedData)
            } else {
                setDataSheetSearch([])
            }
        } catch (error) {

        } finally {

            controllers.current.fetchDataItemInfo = null;
            setLoading(false)
        }
    }, [])
    const fetchDataBomVerMng = useCallback(async (seq) => {
        setLoading(true)
        if (controllers.current.fetchDataBomVerMng) {
            controllers.current.fetchDataBomVerMng.abort();
            controllers.current.fetchDataBomVerMng = null;
            await new Promise((resolve) => setTimeout(resolve, 10));
        }

        const controller = new AbortController();
        const signal = controller.signal;

        controllers.current.fetchDataBomVerMng = controller;
        try {
            const response = await GetQBomVerMngQuery(seq, signal)
            if (response.success) {
                const fetchedData = response.data || []

                setVerMng(fetchedData)
            } else {
                setVerMng([])
                message.error('Có lỗi xảy ra khi lấy dữ liệu!')
            }
        } catch (error) {
        } finally {
            controllers.current.fetchDataBomVerMng = null;
            setLoading(false)

        }
    }, [])
    useEffect(() => {
        cancelAllRequests();
        message.destroy();
    }, [])
    const fetchDataBomSubItem = useCallback(async (seq) => {
        setLoading(true)
        if (controllers.current.fetchDataBomSubItem) {
            controllers.current.fetchDataBomSubItem.abort();
            controllers.current.fetchDataBomSubItem = null;
            await new Promise((resolve) => setTimeout(resolve, 10));
        }
        const controller = new AbortController();
        const signal = controller.signal;

        controllers.current.fetchDataBomSubItem = controller;
        try {
            const response = await GetQBomSubItem(seq, signal)
            if (response.success) {
                const fetchedData = response.data || []
                const emptyData = generateEmptyData(50, defaultColsA)
                const combinedData = [...fetchedData, ...emptyData];
                const updatedData = updateIndexNo(combinedData);
                setNumRows(fetchedData.length + emptyData.length)
                setGridData(updatedData)
            } else {
                const emptyData = generateEmptyData(50, defaultColsA)
                const updatedEmptyData = updateIndexNo(emptyData);
                setGridData(updatedEmptyData)
                setNumRows(emptyData.length)
                message.error('Có lỗi xảy ra khi lấy dữ liệu!')
            }
        } catch (error) {
            console.log(error)
            message.error(error.message || 'Có lỗi xảy ra khi lấy dữ liệu!')
        } finally {
            controllers.current.fetchDataBomSubItem = null;
            setLoading(false)
        }
    }, [])
    useEffect(() => {
        const emptyData = generateEmptyData(50, defaultColsA)
        const updatedData = updateIndexNo(emptyData);
        setNumRows(updatedData.length)
        setGridData(updatedData)
    }, [])
    const handleSearch = () => {
        if (dataSearch !== null) {
            fetchDataTreeSeq(dataSearch)
            fetchDataItemInfo(dataSearch)
            fetchDataBomVerMng(dataSearch)
            fetchDataBomSubItem(dataSearch)
        }
    }

    const handleResetFrom = () => {
        setDataSearch(null)
        setVerMng([])
        resetTable()
        setDataRootSeq([])
        setDataSheetSearch([])
        setDataTree([])

        setItemText('')
        setSearchText('')
        const emptyData = generateEmptyData(50, defaultColsA)
        const updatedEmptyData = updateIndexNo(emptyData);
        setGridData(updatedEmptyData)
        setNumRows(emptyData.length)

    }
    useEffect(() => {
        if (dataSearch !== null) {
            fetchDataTreeSeq(dataSearch)
            fetchDataItemInfo(dataSearch)
            fetchDataBomVerMng(dataSearch)
            fetchDataBomSubItem(dataSearch)
        }
    }, [dataSearch])
    const onSelect = async (selectedKeys, info) => {
        const seq = {
            ItemSeq: info?.node?.ItemSeq
        }
        togglePageInteraction(true)
        setLoading(true)
        try {
            await Promise.all([
                fetchDataItemInfo(seq),
                fetchDataBomVerMng(seq),
                fetchDataBomSubItem(seq)
            ])
        } catch (error) {
            togglePageInteraction(false)
        } finally {
            togglePageInteraction(false)
            setLoading(false)
        }
    };

    const handleRowAppendA = useCallback(
        (numRowsToAdd) => {
            if (canCreate === false) {
                return
            }
            onRowAppended(cols, setGridData, setNumRows, setAddedRows, numRowsToAdd)
        },
        [cols, setGridData, setNumRows, setAddedRows, numRowsToAdd]
    )

    const fetchCodeHelpData = useCallback(async () => {
        if (controllers.current.fetchCodeHelpData) {
            controllers.current.fetchCodeHelpData.abort();
            controllers.current.fetchCodeHelpData = null;
            await new Promise((resolve) => setTimeout(resolve, 10));
        }
        if (loadingBarRef.current) {
            loadingBarRef.current.continuousStart();
        }
        const controller = new AbortController();
        const signal = controller.signal;

        controllers.current.fetchCodeHelpData = controller;
        setLoading(true)
        try {
            const [
                help01,
                help02,
                help03,
            ] = await Promise.all([
                GetCodeHelp(18074, '', '', '', '', '', '', 1, 250, '', 0, 0, 0, signal),
                GetCodeHelp(18084, '', '', '', '', '', '', 1, 250, '', 0, 0, 0, signal),
                GetCodeHelp(19999, '', '1011654', '', '', '', '', 1, 250, '', 0, 0, 0, signal)
            ])
            setHelpData01(help01?.data || [])
            setHelpData02(help02?.data || [])
            setHelpData03(help03?.data || [])
        } catch (error) {
            setHelpData01([])
            setHelpData02([])
            setHelpData03([])
        } finally {
            if (loadingBarRef.current) {
                loadingBarRef.current.complete();
            }
            controllers.current.fetchCodeHelpData = null;
            setLoading(false)
        }
    }, [])

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

    const handleSave = useCallback(async () => {
        if (canCreate === false) {
            return false;
        }

        const columnsU = ['Serl', 'SubItemSeq', 'UserSeq', 'SubItemNo', 'SubItemBomRevName', 'SubItemBomRev', 'Spec', 'UnitName', 'NeedQtyNumerator', 'NeedQtyDenominator', 'HaveChild', 'GoodSeq', 'InLossRate', 'OutLossRate', 'FrApplyDate', 'ToApplyDate', 'Location', 'StkUnitName', 'AssetName', 'SMDelvType', 'ItemSeq', 'SubUnitSeq', 'Remark10', 'SubItemBomRev', 'UnitSeq', 'SubItemName', 'IdxNo'];
        const columnsA = ['SubItemSeq', 'UserSeq', 'SubItemNo', 'SubItemBomRevName', 'SubItemBomRev', 'Spec', 'UnitName', 'NeedQtyNumerator', 'NeedQtyDenominator', 'HaveChild', 'GoodSeq', 'InLossRate', 'OutLossRate', 'FrApplyDate', 'ToApplyDate', 'Location', 'StkUnitName', 'AssetName', 'SMDelvType', 'ItemSeq', 'SubUnitSeq', 'Remark10', 'SubItemBomRev', 'UnitSeq', 'SubItemName', 'IdxNo'];
        const resulU = filterAndSelectColumns(gridData, columnsU, 'U');
        const resulA = filterAndSelectColumns(gridData, columnsA, 'A');
        if (resulA.length === 0 && resulU.length === 0) {
            return true;
        }
        togglePageInteraction(true)
        try {
            const promises = [];
            if (resulA.length > 0) {
                promises.push(PostASBomSubItem(resulA));
            }
            if (resulU.length > 0) {
                promises.push(PostUSBomSubItem(resulU));
            }

            const results = await Promise.all(promises);
            const isSuccess = results.every(result => result.success);
            const isError = results.every(result => result.success);

            const updateGridData = (newData) => {
                setGridData((prevGridData) => {
                    const updatedGridData = prevGridData.map(item => {
                        const matchingData = newData.find(data => data.IDX_NO === item.IdxNo);

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
                const newData = results.flatMap(result => result.data || []);
                updateGridData(newData);
                setEditedRows([]);
                setAddedRows([]);
            } else {
                setIsModalVisible(true)
                const newData = results.flatMap(result => result.data || []);
                setDataError(newData)
            }

        } catch (error) {
            return false;
        } finally {
            togglePageInteraction(false)
        }

    }, [gridData]);
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
    const handleDeleteDataSheet = useCallback(
        (e) => {
            if (canDelete === false) {
                message.warning('Bạn không có quyền xóa dữ liệu')
                if (loadingBarRef.current) {
                    loadingBarRef.current.complete();
                }
                return
            }
            /* PostDSBomSubItem */
            if (isDeleting) {
                message.warning('Đang xử lý, vui lòng chờ...')

                return
            }

            const selectedRows = getSelectedRows()

            const idsWithStatusD = selectedRows
                .filter(
                    (row) => !row.Status || row.Status === 'U' || row.Status === 'D',
                )
                .map((row) => {
                    row.Status = 'D'
                    return row
                })
            if (loadingBarRef.current) {
                loadingBarRef.current.continuousStart();
            }

            const rowsWithStatusA = selectedRows.filter((row) => row.Status === 'A')

            if (idsWithStatusD.length === 0 && rowsWithStatusA.length === 0) {
                message.warning('Vui lòng chọn các mục cần xóa!')
                if (loadingBarRef.current) {
                    loadingBarRef.current.complete();
                }
                return
            }
            if (idsWithStatusD.length > 0) {
                setIsDeleting(true)
                PostDSBomSubItem(idsWithStatusD)
                    .then((response) => {
                        console.log('response', response)
                        if (response.success) {
                            const remainingRows = gridData.filter(
                                (row) =>
                                    !idsWithStatusD.some(
                                        (deletedRow) => deletedRow?.IDX_NO || deletedRow.IdxNo === row.IdxNo || row.IDX_NO,
                                    ),
                            )
                            const updatedData = updateIndexNo(remainingRows);
                            setGridData(updatedData)
                            setNumRows(updatedData.length)
                            resetTable()
                            message.success('Xóa thành công!')
                        } else {
                            setDataError(response.data.errors)
                            setIsModalVisible(true)

                            message.error(response.data.message || 'Xóa thất bại!')
                        }
                    })
                    .catch((error) => {
                        message.error('Có lỗi xảy ra khi xóa!')
                    })
                    .finally(() => {
                        setIsDeleting(false)
                        if (loadingBarRef.current) {
                            loadingBarRef.current.complete();
                        }
                    })
            }

            if (rowsWithStatusA.length > 0) {
                const idsWithStatusA = rowsWithStatusA.map((row) => row.Id)
                const remainingRows = gridData.filter(
                    (row) => !idsWithStatusA.includes(row.Id),
                )
                const remainingEditedRows = editedRows.filter(
                    (editedRow) => !idsWithStatusA.includes(editedRow.updatedRow.Id),
                )
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
        [canDelete, gridData, selection, editedRows, isDeleting],
    )


    return (
        <>
            <Helmet>
                <title>HPM - {t('850000022')}</title>
            </Helmet>
            <TopLoadingBar color="blue" height={2} ref={loadingBarRef} />


            <div className="bg-slate-50 h-[calc(100vh-35px)] p-3 overflow-hidden">
                <div className="flex flex-col gap-2  md:grid-rows-[auto_1fr] md:gap-2 h-full">
                    <div className="col-start-1 col-end-5 row-start-1 w-full rounded-lg ">
                        <div className="flex items-center justify-between pl-4">
                            <Title level={4} className="mt-2 uppercase opacity-85 ">
                                {t('850000022')}
                            </Title>
                            <RegiBOMAcction handleSave={handleSave} handleDeleteDataSheet={handleDeleteDataSheet} handleSearch={handleSearch} handleResetFrom={handleResetFrom} />
                        </div>
                        <div className="group p-2 border-t border-b  bg-white">

                            <summary className="flex cursor-pointer items-center justify-between gap-1.5 text-gray-900">
                                <h2 className="text-xs font-medium flex items-center gap-2  uppercase">
                                    <FilterOutlined />
                                    {t('850000014')}
                                </h2>
                            </summary>
                            <div className="flex p-2 gap-4">
                                <RegiBOMQuery
                                    helpData01={helpData01}
                                    setDataSearch={setDataSearch}
                                    dataSearch={dataSearch}
                                    setDataSheetSearch={setDataSheetSearch}
                                    dataSheetSearch={dataSheetSearch}
                                    setItemText={setItemText}
                                    itemText={itemText}
                                    setSearchText={setSearchText}
                                    searchText={searchText}
                                    controllers={controllers}
                                    setHelpData01={setHelpData01}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="col-start-1 col-end-5 row-start-2 w-full h-full overflow-hidden">
                        <Splitter className="w-full h-full">
                            <SplitterPanel size={35} minSize={10}>
                                <div className='h-full w-full bg-white border-r border-t p-3 overflow-auto'>
                                    <h2 className="text-[10px] mb-4 font-medium flex items-center gap-2 uppercase">
                                        {t('850000023')}
                                    </h2>
                                    <Tree
                                        showLine={
                                            showLine
                                                ? {
                                                    showLeafIcon,
                                                }
                                                : false
                                        }
                                        /*   showIcon={true} */
                                        defaultExpandAll
                                        onSelect={onSelect}
                                        treeData={dataTree}
                                    />
                                </div>
                            </SplitterPanel>
                            <SplitterPanel size={65} minSize={20}>
                                <ViewProdBOM
                                    dataSearch={dataSearch}
                                    setSelection={setSelection}
                                    selection={selection}
                                    showSearch={showSearch}
                                    setShowSearch={setShowSearch}
                                    setAddedRows={setAddedRows}
                                    addedRows={addedRows}
                                    setEditedRows={setEditedRows}
                                    editedRows={editedRows}
                                    setNumRowsToAdd={setNumRowsToAdd}
                                    numRowsToAdd={numRowsToAdd}
                                    numRows={numRows}
                                    openHelp={openHelp}
                                    setOpenHelp={setOpenHelp}
                                    setIsCellSelected={setIsCellSelected}
                                    isCellSelected={isCellSelected}
                                    setGridData={setGridData}
                                    gridData={gridData}
                                    setNumRows={setNumRows}
                                    setCols={setCols}
                                    handleRowAppend={handleRowAppendA}
                                    cols={cols}
                                    canCreate={canCreate}
                                    defaultCols={defaultColsA}
                                    canEdit={canEdit}
                                    dataSheetSearch={dataSheetSearch}
                                    helpData01={helpData01}
                                    setDataSearch={setDataSearch}
                                    setDataSheetSearch={setDataSheetSearch}
                                    verMng={verMng}
                                    helpData02={helpData02}
                                    helpData03={helpData03}
                                    dataRootSeq={dataRootSeq}
                                    setDataRootSeq={setDataRootSeq}
                                    fetchDataBomSubItem={fetchDataBomSubItem}
                                    fetchDataBomVerMng={fetchDataBomVerMng}
                                    setHelpData02={setHelpData02}
                                    setHelpData03={setHelpData03}
                                    setHelpData01={setHelpData01}
                                />
                            </SplitterPanel>
                        </Splitter>
                    </div>
                </div>
            </div>

            <ErrorListModal
                dataError={dataError}
                setIsModalVisible={setIsModalVisible}
                isModalVisible={isModalVisible}
            />
        </>
    )
}
