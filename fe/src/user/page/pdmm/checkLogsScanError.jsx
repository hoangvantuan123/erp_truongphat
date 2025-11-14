
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
import useOnFill from '../../components/hooks/sheet/onFillHook';
import { useTranslation } from 'react-i18next'
const { Text } = Typography;
const CheckScanErrorLogsDrawer = ({ openLogs, handleCloseLogs, dataLogsError }) => {
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
    const [gridData, setGridData] = useState(dataLogsError);


    const defaultCols = [
        {
            title: '',
            id: 'Status',
            kind: 'Text',
            readonly: true,
            width: 150,
            hasMenu: true,
            visible: true,
            trailingRowOptions: {
                disabled: true,
            },
            icon: GridColumnIcon.HeaderLookup,
        },
        {
            title: t('QrCode'),
            id: 'QrCode',
            kind: 'Text',
            readonly: true,
            width: 600,
            hasMenu: true,
            visible: false,
            trailingRowOptions: {
                disabled: true,
            },
            icon: GridColumnIcon.HeaderBoolean,
        },
        {
            title: t('Logs'),
            id: 'Logs',
            kind: 'Text',
            readonly: true,
            width: 750,
            hasMenu: true,
            visible: false,
            trailingRowOptions: {
                disabled: true,
            },
            icon: GridColumnIcon.HeaderBoolean,
        }
    ];
    const [cols, setCols] = useState(defaultCols);
    const onFill = useOnFill(filteredData, cols);


    const getData = useCallback(
        ([col, row]) => {

            const person = gridData[row] || {};
            const column = cols[col];
            const columnKey = column?.id || '';
            const value = person[columnKey] || '';


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




    useEffect(() => {
        if (Array.isArray(dataLogsError)) {
            setGridData(dataLogsError);
            setNumRows(dataLogsError.length);
        } else {
            setGridData([]);
            setNumRows(0);
        }
    }, [dataLogsError, openLogs]);




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
                headerHeight={30}
                rowHeight={28}
                getCellContent={getData}

                fillHandle={true}
                smoothScrollY={true}
                smoothScrollX={true}
                isDraggable={false}
                onItemHovered={onItemHovered}
                freezeColumns="0"
                onColumnResize={onColumnResize}
            />
        </Drawer>
    );
};

export default CheckScanErrorLogsDrawer;
