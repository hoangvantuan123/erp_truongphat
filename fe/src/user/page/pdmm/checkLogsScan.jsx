
import { useState, useRef, useEffect, useCallback } from 'react';
import { Button, Typography, Input, Row, Col, Drawer, message } from 'antd'
import CustomRenderer, {
    getMiddleCenterBias,
    GridCellKind,
    TextCellEntry,
    useTheme,
    DataEditor,
} from '@glideapps/glide-data-grid'
import { CompactSelection, GridColumnIcon } from '@glideapps/glide-data-grid'
import { SearchOutlined, FilterOutlined, FileExcelOutlined, ReloadOutlined, DeleteOutlined } from '@ant-design/icons'
import useOnFill from '../../components/hooks/sheet/onFillHook';
import { useTranslation } from 'react-i18next'
import { togglePageInteraction } from '../../../utils/togglePageInteraction';
import { PostQCheckLogsTFIFOTemp } from '../../../features/pdmm/postQCheckLogsTFIFOTemp';
import { PostDCheckLogs } from '../../../features/pdmm/postDCheckLogs';
const { Text } = Typography;
const CheckLogsDrawer = ({ openLogs, handleCloseLogs, IdOutReqSeq }) => {
    const loadingBarRef = useRef(null)
    const { t } = useTranslation()
    const gridRef = useRef(null);
    const dropdownRef = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    const [filteredData, setFilteredData] = useState([]);
    const [hoverRow, setHoverRow] = useState(null);
    const [selection, setSelection] = useState({
        columns: CompactSelection.empty(),
        rows: CompactSelection.empty(),
    });
    const [numRows, setNumRows] = useState(0);
    const [outReqSeq, setOutReqSeq] = useState('');
    const [lotNo, setLotNo] = useState('');
    const [itemSeq, setItemSeq] = useState('');

    const resetTable = () => {
        setSelection({
            columns: CompactSelection.empty(),
            rows: CompactSelection.empty(),
        })
    }

    const handleExport = () => {
        console.log('Export to Excel');
    };


    const defaultCols = [
        {
            title: '',
            id: 'Status',
            kind: 'Text',
            readonly: true,
            width: 50,
            hasMenu: true,
            visible: true,
            trailingRowOptions: {
                disabled: true,
            },
            icon: GridColumnIcon.HeaderLookup,
        },
        {
            title: t('Seq'),
            id: 'Seq',
            kind: 'Text',
            readonly: true,
            width: 150,
            hasMenu: true,
            visible: false,
            trailingRowOptions: {
                disabled: true,
            },
            icon: GridColumnIcon.HeaderBoolean,
        },
        {
            title: t('ItemSeq'),
            id: 'ItemSeq',
            kind: 'Text',
            readonly: true,
            width: 150,
            hasMenu: true,
            visible: false,
            trailingRowOptions: {
                disabled: true,
            },
            icon: GridColumnIcon.HeaderBoolean,
        },
        {
            title: t('ItemName'),
            id: 'ItemName',
            kind: 'Text',
            readonly: true,
            width: 200,
            hasMenu: true,
            visible: false,
            trailingRowOptions: {
                disabled: true,
            },
            icon: GridColumnIcon.HeaderBoolean,
        },
        {
            title: t('ItemNo'),
            id: 'ItemNo',
            kind: 'Text',
            readonly: true,
            width: 200,
            hasMenu: true,
            visible: false,
            trailingRowOptions: {
                disabled: true,
            },
            icon: GridColumnIcon.HeaderBoolean,
        },
        {
            title: t('LotNo'),
            id: 'LotNo',
            kind: 'Text',
            readonly: true,
            width: 200,
            hasMenu: true,
            visible: false,
            trailingRowOptions: {
                disabled: true,
            },
            icon: GridColumnIcon.HeaderBoolean,
        },
        {
            title: t('Qty'),
            id: 'Qty',
            kind: 'Text',
            readonly: true,
            width: 200,
            hasMenu: true,
            visible: false,
            trailingRowOptions: {
                disabled: true,
            },
            icon: GridColumnIcon.HeaderBoolean,
        },
        {
            title: t('UserId'),
            id: 'UserId',
            kind: 'Text',
            readonly: true,
            width: 200,
            hasMenu: true,
            visible: false,
            trailingRowOptions: {
                disabled: true,
            },
            icon: GridColumnIcon.HeaderBoolean,
        },
        {
            title: t('UserName'),
            id: 'UserName',
            kind: 'Text',
            readonly: true,
            width: 200,
            hasMenu: true,
            visible: false,
            trailingRowOptions: {
                disabled: true,
            },
            icon: GridColumnIcon.HeaderBoolean,
        },
    ];
    const [gridData, setGridData] = useState([])
    const [cols, setCols] = useState(defaultCols);
    const onFill = useOnFill(filteredData, cols);

    const getData = useCallback(
        ([col, row]) => {
            const lastRowIndex = numRows - 1;
            const person = gridData[row] || {};
            const column = cols[col];
            const columnKey = column?.id || '';
            const value = person[columnKey] || '';
            if (row === lastRowIndex) {


                if (["Qty"].includes(columnKey)) {
                    const total = gridData.reduce((sum, item) => sum + (Number(item[columnKey]) || 0), 0);
                    const formattedTotal = new Intl.NumberFormat("en-US", {
                        minimumFractionDigits: 4,
                        maximumFractionDigits: 4,
                    }).format(total);

                    return {
                        kind: GridCellKind.Number,
                        data: total,
                        copyData: String(total),
                        displayData: formattedTotal,
                        readonly: true,
                        contentAlign: "right",
                        themeOverride: {
                            textDark: "#009CA6",
                            bgIconHeader: "#009CA6",
                            accentColor: "#009CA6",
                            accentLight: "#009CA620",
                            fgIconHeader: "#FFFFFF",
                            baseFontStyle: "600 13px",
                            bgCell: "#E6F6DD",
                        }
                    };
                }



                return {
                    kind: GridCellKind.Text,
                    data: "",
                    displayData: "",
                    readonly: true,
                    themeOverride: {
                        textDark: "#009CA6",
                        bgIconHeader: "#009CA6",
                        accentColor: "#009CA6",
                        accentLight: "#009CA620",
                        fgIconHeader: "#FFFFFF",
                        baseFontStyle: "600 13px",
                        bgCell: "#E6F6DD",
                    }
                };
            }

            if (

                columnKey === 'Qty'

            ) {
                return {
                    kind: GridCellKind.Number,
                    data: value,
                    displayData: new Intl.NumberFormat('en-US', {
                        minimumFractionDigits: 5,
                        maximumFractionDigits: 5,
                    }).format(value),
                    readonly: column?.readonly || false,
                    contentAlign: 'right',
                    allowOverlay: true,
                    hasMenu: column?.hasMenu || false,
                }
            }

            return {
                kind: GridCellKind.Text,
                data: value,
                displayData: String(value),
                readonly: column?.readonly || false,
                allowOverlay: true,
            };
        },
        [gridData, cols]
    );

    const onItemHovered = useCallback((args) => {
        const [_, row] = args.location;
        setHoverRow(args.kind !== 'cell' ? undefined : row);
    }, []);
    const onColumnResize = useCallback(
        (column, newSize) => {
            const index = cols.indexOf(column);
            if (index !== -1) {
                const newCol = {
                    ...column,
                    width: newSize,
                };
                const newCols = [...cols];
                newCols.splice(index, 1, newCol);
                setCols(newCols);
            }
        },
        [cols]
    );

    const handleCellClick = ([col, row]) => {

    };

    const fetchDataLogs = async () => {

        if (loadingBarRef.current) {
            loadingBarRef.current.continuousStart()
        }
        togglePageInteraction(true)
        try {
            const data = {
                OutReqSeq: IdOutReqSeq,
                LotNo: lotNo,
                ItemSeq: itemSeq
            }

            const response = await PostQCheckLogsTFIFOTemp(data)
            if (response.success) {
                const fetchedData = response.data || []
                setGridData(fetchedData)
                if (loadingBarRef.current) {
                    loadingBarRef.current.complete()
                }
                setNumRows(fetchedData.length + 1)
                setIsQuery(true)
                resetTable()
            } else {
                setGridData([])
                setNumRows(1)
            }
        } catch (error) {
            if (loadingBarRef.current) {
                loadingBarRef.current.complete()
                message.error('Có lỗi xảy ra khi tải dữ liệu.')
            }
        } finally {
            if (loadingBarRef.current) {
                loadingBarRef.current.complete()
            }
            togglePageInteraction(false)
        }
    }

    useEffect(() => {
        if (openLogs === true) {
            fetchDataLogs()
        }
    }, [openLogs])

    const getSelectedRows = () => {
        const selectedRows = selection.rows.items;
        let seqs = [];  
        selectedRows.forEach((range) => {
            const start = range[0];
            const end = range[1] - 1;

            for (let i = start; i <= end; i++) {
                if (gridData[i]) {
                    seqs.push(gridData[i].Seq); 
                }
            }
        });

        return seqs; 
    };
    const handleDelete = useCallback(() => {
        const selectedRows = getSelectedRows();
        const rowsToDelete = selectedRows.filter(row => !row.Status || row.Status === 'U' || row.Status === 'D');
        const deleteSeqs = rowsToDelete.map(row => row);

        if (deleteSeqs.length === 0) {
            message.warning(t('870000011'));
            return;
        }

        if (loadingBarRef.current) loadingBarRef.current.continuousStart();

        PostDCheckLogs(rowsToDelete)
            .then(response => {
             
                if (response.success) {
                    setGridData(prevData => {
                        const newData = prevData.filter(row =>
                            !deleteSeqs.includes(row.Seq)
                        );
                        setNumRows(newData.length + 1);
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
    }, [selection, t]); 


    return (
        <Drawer
            title="Logs Details"
            placement="bottom"
            height="90%"
            onClose={handleCloseLogs}
            open={openLogs}
            style={{ marginRight: '0px' }}
            bodyStyle={{ display: 'flex', flexDirection: 'column', padding: '0px', height: '100%' }}
        >
            <Row className="p-2 bg-slate-50 border-b" align="middle" justify="space-between">
                {/* Cột chứa các ô input */}
                <Col>
                    <Row gutter={8} align="middle">
                        <Col>
                            <Text className='text-xs'>LotNo:</Text>
                            <Input
                                placeholder="LotNo"
                                style={{ marginLeft: 4, width: 220 }}
                                value={lotNo}
                                onChange={(e) => setLotNo(e.target.value)}
                            />
                        </Col>
                        <Col>
                            <Text className='text-xs'>ItemSeq:</Text>
                            <Input
                                placeholder="ItemSeq"
                                style={{ marginLeft: 4, width: 220 }}
                                value={itemSeq}
                                onChange={(e) => setItemSeq(e.target.value)}
                            />
                        </Col>
                    </Row>
                </Col>

                <Col>
                    <Row gutter={8} justify="end">

                        <Col>
                            <Button icon={<FileExcelOutlined />} onClick={handleExport} style={{ backgroundColor: "#2196F3", color: "white" }}>Export</Button>
                        </Col>

                        <Col>
                            <Button icon={<DeleteOutlined />} onClick={handleDelete} style={{ backgroundColor: "#F44336", color: "white" }}>Delete</Button>
                        </Col>
                        <Col>
                            <Button icon={<SearchOutlined />} onClick={fetchDataLogs} style={{ backgroundColor: "#9C27B0", color: "white" }}>Search</Button>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <DataEditor
                ref={gridRef}
                rowMarkers="both"
                width="100%"
                height="100%"
                rowSelect="multi"
                onFill={onFill}
                className="cursor-pointer rounded-md"
                rows={numRows}
                columns={cols}
                gridSelection={selection}
                onGridSelectionChange={setSelection}
                getCellsForSelection={true}
                freezeTrailingRows={1}
                headerHeight={30}
                rowHeight={28}
                getCellContent={getData}
                getRowThemeOverride={(i) =>
                    i === hoverRow
                        ? {
                            bgCell: '#e8f0ff',
                            bgCellMedium: '#e8f0ff',
                        }
                        : i % 2 === 0
                            ? undefined
                            : {
                                bgCell: '#FBFBFB',
                            }
                }
                fillHandle={true}
                smoothScrollY={true}
                smoothScrollX={true}
                isDraggable={false}
                onItemHovered={onItemHovered}
                onCellClicked={handleCellClick}
                freezeColumns="0"
                onColumnResize={onColumnResize}
            />
        </Drawer>
    );
};

export default CheckLogsDrawer;
