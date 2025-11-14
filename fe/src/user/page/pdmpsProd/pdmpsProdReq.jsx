import { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet'
import { Typography, Button, message, Modal, Collapse } from 'antd'
const { Title, Text } = Typography
import { FilterOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import { ArrowIcon } from '../../components/icons'
import dayjs from 'dayjs'
import { generateEmptyData } from '../../components/sheet/js/generateEmptyData'
import { GetCodeHelp } from '../../../features/codeHelp/getCodeHelp'
import { GetCodeHelpCombo } from '../../../features/codeHelp/getCodeHelpCombo'
import { CompactSelection, GridColumnIcon } from '@glideapps/glide-data-grid'
import { debounce } from 'lodash'
import { updateIndexNo } from '../../components/sheet/js/updateIndexNo'
import { useNavigate } from 'react-router-dom'
import TopLoadingBar from 'react-top-loading-bar';
import { filterAndSelectColumns } from '../../../utils/filterUorA'
import { onRowAppended } from '../../components/sheet/js/onRowAppended'
import { GetQPdmpsProdReqList } from '../../../features/pdmpsProd/getQPdmpsProdReqList'
import { loadFromLocalStorageSheet } from '../../../localStorage/sheet/sheet'
import PdmpsProdReqLReqAction from '../../components/actions/pdmpsProd/PdmpsProdReqLReq'
import TablePdmpsProdReq from '../../components/table/pdmpsProd/tablePdmpsProdReq'
import QueryPdmpsProdReq from '../../components/query/pdmpsProd/pdmpsProdReq'
import { togglePageInteraction } from '../../../utils/togglePageInteraction'
import { PostAProdReqAndItem } from '../../../features/pdmpsProd/postASBomSubItem'
import { validateCheckColumns } from '../../../utils/validateColumns'
import { PostDPdmpsProdReqItem } from '../../../features/pdmpsProd/postDPdmpsProdReqItem'
import { PostUSpdProdSeq } from '../../../features/pdmpsProd/postUSpdProdSeq'

export default function PdmpsProdReq({ permissions,
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
            title: 'Tên sản phẩm ',
            id: 'ItemName',
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
            title: 'ItemSeq',
            id: 'ItemSeq',
            kind: 'Text',
            readonly: false,
            width: 150,
            hasMenu: true,
            visible: false,
            icon: GridColumnIcon.HeaderString,
            trailingRowOptions: {
                disabled: true,
            },
        },
        {
            title: 'Mã sản phẩm',
            id: 'ItemNo',
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
            title: 'Quy cách',
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
            title: 'Đơn vị',
            id: 'UnitName',
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
            title: 'UnitSeq',
            id: 'UnitSeq',
            kind: 'Text',
            readonly: false,
            width: 150,
            hasMenu: true,
            visible: false,
            icon: GridColumnIcon.HeaderString,
            trailingRowOptions: {
                disabled: true,
            },
        },
        {
            title: 'Số lượng',
            id: 'Qty',
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
            title: 'Ngày yêu cầu hoàn thành',
            id: 'EndDate',
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
            title: 'Ngày giao hàng',
            id: 'DelvDate',
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
            title: 'Khách hàng',
            id: 'CustName',
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
            title: 'CustSeq',
            id: 'CustSeq',
            kind: 'Text',
            readonly: true,
            width: 150,
            hasMenu: true,
            visible: false,
            icon: GridColumnIcon.HeaderString,
            trailingRowOptions: {
                disabled: true,
            },
        },
        {
            title: 'ProdReqSeq',
            id: 'ProdReqSeq',
            kind: 'Text',
            readonly: true,
            width: 150,
            hasMenu: true,
            visible: false,
            icon: GridColumnIcon.HeaderString,
            trailingRowOptions: {
                disabled: true,
            },
        },
        {
            title: 'Bộ phận kế hoạch sản xuất',
            id: 'PlanDeptName',
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
            title: 'PlanDeptSeq',
            id: 'PlanDeptSeq',
            kind: 'Text',
            readonly: true,
            width: 150,
            hasMenu: true,
            visible: false,
            icon: GridColumnIcon.HeaderString,
            trailingRowOptions: {
                disabled: true,
            },
        },
        {
            title: 'Ghi chú',
            id: 'Remark',
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
            title: 'Ghi nhớ',
            id: 'Memo',
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
    const [loadingA, setLoadingA] = useState(false)
    const [showSearch, setShowSearch] = useState(false)
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState([])
    const [gridData, setGridData] = useState([])
    const [numRows, setNumRows] = useState(0)
    const [searchText, setSearchText] = useState('')
    const [searchText2, setSearchText2] = useState('')
    const [itemText, setItemText] = useState('')
    const [itemText2, setItemText2] = useState('')
    const [dataSearch, setDataSearch] = useState(null)
    const [dataSearch2, setDataSearch2] = useState(null)
    const [helpData01, setHelpData01] = useState([])
    const [helpData02, setHelpData02] = useState([])
    const [helpData03, setHelpData03] = useState([])
    const [helpData04, setHelpData04] = useState([])
    const [helpData05, setHelpData05] = useState([])
    const [helpData06, setHelpData06] = useState([])
    const [helpData07, setHelpData07] = useState([])
    const [helpData08, setHelpData08] = useState([])
    const [numRowsToAdd, setNumRowsToAdd] = useState(null)
    const [dataSheetSearch, setDataSheetSearch] = useState([])
    const [dataSheetSearch2, setDataSheetSearch2] = useState([])
    const [minorValue, setMinorValue] = useState('')
    const [addedRows, setAddedRows] = useState([])
    const [formData, setFormData] = useState(dayjs().startOf('month'))
    const [toDate, setToDate] = useState(dayjs())
    const [FactUnit, setFactUnit] = useState('')
    const [ProdReqNo, setProdReqNo] = useState('')
    const [ReqType, setReqType] = useState('')
    const [clickedRowData, setClickedRowData] = useState(null)
    const [ProdType, setProdType] = useState('')
    const [editedRows, setEditedRows] = useState([])
    const [checkFrom, setCheckFrom] = useState(false)
    const [subRemark, setSubRemark] = useState('')
    const [isDeleting, setIsDeleting] = useState(false)
    const [checkProdReqSeq, setCheckProdReqSeq] = useState(false)
    const [checkProdReqSeqType, setCheckProdReqSeqType] = useState(null)
    const formatDate = (date) => date.format('YYYYMMDD')
    const [cols, setCols] = useState(() =>
        loadFromLocalStorageSheet(
            'pdmps_prod_req_a',
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
    useEffect(() => {
        cancelAllRequests();
        message.destroy();
    }, [])
    useEffect(() => {
        const emptyData = generateEmptyData(50, defaultCols)
        const updatedEmptyData = updateIndexNo(emptyData)
        setGridData(updatedEmptyData)
        setNumRows(emptyData.length)
    }, [])
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
        const controller = new AbortController();
        const signal = controller.signal;

        controllers.current.fetchData = controller;
        const search = {
            FactUnit: FactUnit,
            ReqDate: formData ? formatDate(formData) : '',
            ReqDateTo: toDate ? formatDate(toDate) : '',
            ProdReqNo: ProdReqNo,
            DeptSeq: dataSearch?.BeDeptSeq || '',
            EmpSeq: dataSearch2?.EmpSeq || '',
            ReqType: ReqType,
            ProdType: ProdType,
            UMProdObject: ''

        };
        try {
            const response = await GetQPdmpsProdReqList(search, signal);

            if (response.success) {
                const fetchedData = response.data || [];
                setGridData(fetchedData);
                setNumRows(fetchedData.length);
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
            controllers.current.fetchData = null;
            setLoadingA(false);
        }
    };
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
                help04,
                help05,
                help06,
                help07,
                help08,

            ] = await Promise.all([
                GetCodeHelp(18074, '', '', '', '', '', '', 1, 250, '', 0, 0, 0, signal),
                GetCodeHelp(17001, '', '', '', '', '', '', 1, 0, '', 0, 0, 0, signal),
                GetCodeHelp(10010, '', '', '', '', '', '', 1, 0, '', 0, 0, 0, signal),
                GetCodeHelpCombo(
                    '',
                    6,
                    10012,
                    1,
                    '%',
                    '',
                    '',
                    '',
                    'A.SMAssetGrp IN (6008002,6008004)',
                    signal
                ),
                GetCodeHelp(10009, '', '', '', '', '', '', 1, 0, '', 0, 0, 0, signal),
                GetCodeHelpCombo(
                    '',
                    6,
                    60001,
                    1,
                    '%',
                    '',
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
                    '6009',
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
                    '6010',
                    '',
                    '',
                    '',
                    signal
                ),

            ])

            setHelpData01(help01?.data || [])
            setHelpData02(help02?.data || [])
            setHelpData03(help03?.data || [])
            setHelpData04(help04?.data || [])
            setHelpData05(help05?.data || [])
            setHelpData06(help06?.data || [])
            setHelpData07(help07?.data || [])
            setHelpData08(help08?.data || [])

        } catch (error) {
            setHelpData01([])
            setHelpData02([])
            setHelpData03([])
            setHelpData04([])
            setHelpData05([])
            setHelpData06([])
            setHelpData07([])
            setHelpData08([])

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
    const handleRowAppendA = useCallback(
        (numRowsToAdd) => {
            if (canCreate === false) {
                return
            }
            onRowAppended(cols, setGridData, setNumRows, setAddedRows, numRowsToAdd)
        },
        [cols, setGridData, setNumRows, setAddedRows, numRowsToAdd]
    )
    const newFrom = async () => {
        const columnsA = [
            'ItemName', 'ItemSeq', 'ItemNo', 'Spec', 'UnitName', 'Qty',
            'EndDate', 'DelvDate', 'CustName', 'CustSeq', 'ProdReqSeq',
            'PlanDeptName', 'Remark', 'Memo', 'IdxNo', 'PlanDeptSeq', 'UnitSeq'
        ];

        const resulA = filterAndSelectColumns(gridData, columnsA, 'A');
        const resulU = filterAndSelectColumns(gridData, columnsA, 'U');

        const hasDataA = resulA.length > 0;
        const hasDataU = resulU.length > 0;


        if (hasDataA || hasDataU) {
            setCheckFrom(true);
        } else {
            restFrom()
        }

    };

    const restFrom = () => {
        setCheckFrom(false);
        const emptyData = generateEmptyData(50, defaultCols)
        const updatedEmptyData = updateIndexNo(emptyData)
        setGridData(updatedEmptyData)
        setNumRows(emptyData.length)
        setSubRemark('')
        setProdReqNo('')
        setCheckProdReqSeq(false)
    }

    const handleSave = useCallback(async () => {
        if (!canCreate) return true;
        const columnsA = [
            'ItemName', 'ItemSeq', 'ItemNo', 'Spec', 'UnitName', 'Qty',
            'EndDate', 'DelvDate', 'CustName', 'CustSeq', 'ProdReqSeq',
            'PlanDeptName', 'Remark', 'Memo', 'IdxNo', 'PlanDeptSeq', 'UnitSeq'
        ];
        setCheckFrom(false);
        const requiredColumns = ['ItemName', 'Qty']
        const rootData = {
            ProdReqSeq: 0,
            ProdReqNo: '',
            FactUnit: FactUnit,
            ReqDate: formData ? formatDate(formData) : '',
            ReqDateTo: toDate ? formatDate(toDate) : '',
            DeptSeq: dataSearch?.BeDeptSeq || dataSearch?.DeptSeq || '',
            DeptName: dataSearch?.BeDeptName || dataSearch?.DeptName || '',
            EmpSeq: dataSearch2?.EmpSeq || '',
            EmpName: dataSearch2?.EmpName || '',
            ProdType: ProdType,
            ReqType: ReqType,
            Remark: subRemark
        }
        const resulA = filterAndSelectColumns(gridData, columnsA, 'A');
        if (resulA.length === 0) {
            togglePageInteraction(false);
            if (loadingBarRef.current) {
                loadingBarRef.current.complete();
            }
            message.warning(t('870000041'))
            return true;

        }
        const validationMessage = validateCheckColumns([...resulA], [...columnsA], requiredColumns);

        if (validationMessage !== true) {
            message.warning(validationMessage);
            togglePageInteraction(false)
            if (loadingBarRef.current) {
                loadingBarRef.current.complete();
            }
            return true;
        }
        if (loadingBarRef.current) {
            loadingBarRef.current.continuousStart();
        }
        togglePageInteraction(true);

        try {

            const results = await Promise.all([
                PostAProdReqAndItem(rootData, resulA)
            ]);

            const isSuccess = results.every(result => result?.success);

            const updateGridData = (newData) => {
                setGridData(prevGridData => {
                    const updatedGridData = prevGridData.map(item => {
                        const matchingData = newData.find(data => data.IDX_NO === item.IdxNo);
                        return matchingData || item;
                    });

                    return updateIndexNo(updatedGridData);
                });
            };

            if (isSuccess) {
                const newData = results.flatMap(result => result.data.saveResultItem || []);
                const newDataProdReqNo = results.flatMap(result => result.data.saveResult || []);
                setProdReqNo(newDataProdReqNo[0].ProdReqNo)
                setCheckProdReqSeqType(newDataProdReqNo[0].ProdReqSeq)
                updateGridData(newData);
                setCheckProdReqSeq(true)
                setEditedRows([]);
                setAddedRows([]);
            } else {
                message.error(t('870000040'));
            }
        } catch (error) {
            return false;
        } finally {
            if (loadingBarRef.current) {
                loadingBarRef.current.complete();
            }
            togglePageInteraction(false);
        }
    }, [gridData, canCreate, FactUnit, formData, toDate, dataSearch, dataSearch2, ProdType, ReqType, subRemark]);

    const handleUpdate = useCallback(async () => {
        if (!canCreate) return true;
        const columnsU = [
            'ItemName', 'ItemSeq', 'ItemNo', 'Spec', 'UnitName', 'Qty',
            'EndDate', 'DelvDate', 'CustName', 'CustSeq', 'ProdReqSeq',
            'PlanDeptName', 'Remark', 'Memo', 'IdxNo', 'PlanDeptSeq', 'UnitSeq'
        ];
        setCheckFrom(false);
        const requiredColumns = ['ItemName', 'Qty']
        const rootData = {
            ProdReqSeq: checkProdReqSeqType,
            ProdReqNo: ProdReqNo,
            FactUnit: FactUnit,
            ReqDate: formData ? formatDate(formData) : '',
            ReqDateTo: toDate ? formatDate(toDate) : '',
            DeptSeq: dataSearch?.BeDeptSeq || dataSearch?.DeptSeq || '',
            DeptName: dataSearch?.BeDeptName || dataSearch?.DeptName || '',
            EmpSeq: dataSearch2?.EmpSeq || '',
            EmpName: dataSearch2?.EmpName || '',
            ProdType: ProdType,
            ReqType: ReqType,
            Remark: subRemark
        }
        const resulA = filterAndSelectColumns(gridData, columnsU, 'U');

        const validationMessage = validateCheckColumns([...resulA], [...columnsU], requiredColumns);

        if (validationMessage !== true) {
            message.warning(validationMessage);
            togglePageInteraction(false)
            if (loadingBarRef.current) {
                loadingBarRef.current.complete();
            }
            return true;
        }
        if (loadingBarRef.current) {
            loadingBarRef.current.continuousStart();
        }
        togglePageInteraction(true);

        try {

            const results = await Promise.all([
                PostUSpdProdSeq(rootData, resulA)
            ]);

            const isSuccess = results.every(result => result?.success);

            const updateGridData = (newData) => {
                setGridData(prevGridData => {
                    const updatedGridData = prevGridData.map(item => {
                        const matchingData = newData.find(data => data.IDX_NO === item.IdxNo);
                        return matchingData || item;
                    });

                    return updateIndexNo(updatedGridData);
                });
            };

            if (isSuccess) {
                const newData = results.flatMap(result => result.data.saveResultItem || []);
                const newDataProdReqNo = results.flatMap(result => result.data.saveResult || []);
                setProdReqNo(newDataProdReqNo[0].ProdReqNo)
                updateGridData(newData);
                setCheckProdReqSeq(true)
                setEditedRows([]);
                setAddedRows([]);
            } else {
                message.error(t('870000040'));
            }
        } catch (error) {
            return false;
        } finally {
            if (loadingBarRef.current) {
                loadingBarRef.current.complete();
            }
            togglePageInteraction(false);
        }
    }, [gridData, canCreate, FactUnit, formData, toDate, dataSearch, dataSearch2, ProdType, ReqType, subRemark, checkProdReqSeqType, ProdReqNo]);


    const handleSaveUpdate = () => {
        if (checkProdReqSeq) {
            handleUpdate();
        } else {
            handleSave();
        }
    }
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


    const handleDeleteDataSheet = useCallback(
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
            if (isDeleting) {
                message.warning('Đang xử lý, vui lòng chờ...')
                togglePageInteraction(false)
                if (loadingBarRef.current) {
                    loadingBarRef.current.complete();
                }
                return
            }

            const selectedRows = getSelectedRowsItem()
            const idsWithStatusD = selectedRows
                .filter(
                    (row) => !row.Status || row.Status === 'U' || row.Status === 'D',
                )
                .map((row, index) => {
                    row.Status = 'D'
                    return row
                })
            const rowsWithStatusA = selectedRows.filter((row) => row.Status === 'A')
            if (idsWithStatusD.length === 0 && rowsWithStatusA.length === 0) {
                togglePageInteraction(false)
                if (loadingBarRef.current) {
                    loadingBarRef.current.complete();
                }
                return
            }
            if (idsWithStatusD.length > 0) {
                setIsDeleting(true)
                PostDPdmpsProdReqItem(idsWithStatusD)
                    .then((response) => {
                        message.destroy()
                        if (response.success) {
                            console.log('idsWithStatusD', idsWithStatusD)
                            const idsWithStatusDList = idsWithStatusD.map(
                                (row) => row.IdxNo,
                            )
                            const remainingRows = gridData.filter(
                                (row) => !idsWithStatusDList.includes(row.IdxNo),
                            )
                            const updatedEmptyData = updateIndexNo(remainingRows)
                            setGridData(updatedEmptyData)
                            setNumRows(remainingRows.length)
                            resetTable()

                        } else {
                            setDataError(response.data.errors)

                            message.error(response.data.message || t('870000022'))
                        }
                    })
                    .catch((error) => {
                        message.destroy()
                        message.error(t('870000023'))
                    })
                    .finally(() => {
                        setIsDeleting(false)
                        togglePageInteraction(false)
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
            isDeleting,
            clickedRowData,
        ],
    )

    return (
        <>
            <Helmet>
                <title>HPM - {t('850000155')}</title>
            </Helmet>
            <TopLoadingBar color="blue" height={2} ref={loadingBarRef} />
            <div className="bg-slate-50 h-[calc(100vh-42px)] overflow-hidden">
                <div className="flex flex-col h-full">
                    <div className="col-start-1 col-end-5 row-start-1 w-full">
                        <div className="flex p-2 items-end justify-end">
                            <PdmpsProdReqLReqAction
                                newFrom={newFrom}
                                handleSave={handleSaveUpdate}
                                handleDeleteDataSheet={handleDeleteDataSheet}
                            />
                        </div>
                        {/* Collapsible Section */}
                        <details
                            className="group p-2  border rounded-lg [&_summary::-webkit-details-marker]:hidden  bg-white"
                            open
                        >
                            <summary className="flex cursor-pointer items-center justify-between text-gray-900">
                                <h2 className="text-xs font-medium flex items-center gap-2 text-blue-600 uppercase">
                                    {t("850000156")}
                                </h2>
                            </summary>
                            <div className="flex p-2 gap-4">
                                <QueryPdmpsProdReq
                                    helpData01={helpData01}
                                    helpData02={helpData02}
                                    helpData03={helpData03}
                                    helpData04={helpData04}
                                    helpData05={helpData05}
                                    helpData06={helpData06}
                                    helpData07={helpData07}
                                    helpData08={helpData08}
                                    setHelpData05={setHelpData05}
                                    setItemText={setItemText}
                                    itemText={itemText}
                                    setSearchText={setSearchText}
                                    searchText={searchText}
                                    setDataSearch={setDataSearch}
                                    dataSearch={dataSearch}
                                    setDataSheetSearch={setDataSheetSearch}
                                    dataSheetSearch={dataSheetSearch}
                                    controllers={controllers}
                                    setItemText2={setItemText2}
                                    itemText2={itemText2}
                                    setSearchText2={setSearchText2}
                                    searchText2={searchText2}
                                    setDataSearch2={setDataSearch2}
                                    dataSearch2={dataSearch2}
                                    setDataSheetSearch2={setDataSheetSearch2}
                                    dataSheetSearch2={dataSheetSearch2}
                                    setMinorValue={setMinorValue}
                                    formData={formData}
                                    setFormData={setFormData}
                                    setToDate={setToDate}
                                    toDate={toDate}
                                    setSubRemark={setSubRemark}
                                    setFactUnit={setFactUnit}
                                    FactUnit={FactUnit}
                                    setProdReqNo={setProdReqNo}
                                    ProdReqNo={ProdReqNo}
                                    setReqType={setReqType}
                                    ReqType={ReqType}
                                    setProdType={setProdType}
                                    subRemark={subRemark}
                                    ProdType={ProdType}
                                />
                            </div>
                        </details>
                    </div>
                    <div className="col-start-1 col-end-5 row-start-2 w-full flex-1 min-h-0 overflow-auto relative">
                        <TablePdmpsProdReq
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
                            helpData01={helpData01}
                            setHelpData01={setHelpData01}
                            helpData02={helpData02}
                            helpData03={helpData03}
                            setNumRowsToAdd={setNumRowsToAdd}
                            numRowsToAdd={numRowsToAdd}
                            handleRowAppend={handleRowAppendA}
                            setAddedRows={setAddedRows}
                            addedRows={addedRows}
                        />
                    </div>
                </div>
            </div>





            <Modal open={checkFrom} footer={null} closable={true} maskClosable={false} onCancel={() => setCheckFrom(false)} centered>
                <div className="flex flex-col items-center justify-center">
                    <div className="p-3 rounded-lg mb-4 bg-orange-100">
                        <ExclamationCircleOutlined style={{ fontSize: '44px', color: '#faad14' }} />
                    </div>
                    <h2 className="text-2xl font-semibold mb-2 text-gray-800">{t('850000158')}</h2>
                    <p className="text-gray-600 mb-6 text-center">
                        {t('850000157')}
                    </p>
                    <div className="flex w-full gap-4">

                        <Button
                            key="discard"
                            size="large"
                            className="w-full"
                            color="default" variant="filled"
                            onClick={restFrom}
                        >
                            {t('850000159')}
                        </Button>
                        <Button
                            key="confirm"
                            size="large"
                            className="w-full"
                            onClick={handleSaveUpdate}
                            style={{ backgroundColor: '#faad14', borderColor: '#faad14', color: '#fff' }}
                        >
                            {t('850000160')}
                        </Button>
                    </div>
                </div>
            </Modal>

        </>
    )
}