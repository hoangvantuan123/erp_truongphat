
import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Button, Form, Input, Row, Col, Select } from 'antd'
import CustomRenderer, {
    getMiddleCenterBias,
    GridCellKind,
    TextCellEntry,
    useTheme,
    DataEditor,
} from '@glideapps/glide-data-grid'
import { GetCodeHelp } from '../../../../features/codeHelp/getCodeHelp';
import { SearchOutlined, TableOutlined, CloseOutlined, DeleteOutlined, LoadingOutlined } from '@ant-design/icons'
import { CompactSelection } from '@glideapps/glide-data-grid'
import useOnFill from '../../hooks/sheet/onFillHook';
import Draggable from 'react-draggable';
import { useTranslation } from 'react-i18next';
import { GetWcQuery } from '../../../../features/wc/wcQ';
import { GetCodeHelpVer2 } from '../../../../features/codeHelp/getCodeHelpVer2';
const DropdownWC = ({ helpData, setHelpData05, setSearchText, searchText, setItemText, setDataSearch, setDataSheetSearch, setDropdownVisible, dropdownVisible }) => {

    const { t } = useTranslation()
    const gridRef = useRef(null);
    const dropdownRef = useRef(null);
    const [filteredData, setFilteredData] = useState([]);
    const [hoverRow, setHoverRow] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const controllers = useRef({});
    const searchRef = useRef({ lastSearch: "", lastResult: [], history: [] });

    const [selection, setSelection] = useState({
        columns: CompactSelection.empty(),
        rows: CompactSelection.empty(),
    });
    const [numRows, setNumRows] = useState(0);
    useEffect(() => {
        setFilteredData(helpData)
        setNumRows(helpData.length)
    }, [dropdownVisible]);

    const defaultCols = useMemo(() => [
        {
            title: 'Work Center',
            id: 'WorkCenterName',
            kind: 'Text',
            readonly: true,
            width: 250,
            hasMenu: true,
            visible: true,
        },
        {
            title: t('744'),
            id: 'DeptName',
            kind: 'Text',
            readonly: true,
            width: 200,
            hasMenu: true,
            visible: true,
        },
        {
            title: t('Kho giao nhận'),
            id: 'MatOutWhName',
            kind: 'Text',
            readonly: true,
            width: 200,
            hasMenu: true,
            visible: true,
        },
        {
            title: t('6451'),
            id: 'FieldWhName',
            kind: 'Text',
            readonly: true,
            width: 200,
            hasMenu: true,
            visible: true,
        },
        {
            title: t('10622'),
            id: 'ProdInWhName',
            kind: 'Text',
            readonly: true,
            width: 200,
            hasMenu: true,
            visible: true,
        },

    ], []);
    const [cols, setCols] = useState(defaultCols);
    const onFill = useOnFill(filteredData, cols);


    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchText(value);
        if (value.trim() === '' || value === null) {
            setItemText('');
            setFilteredData(helpData);
            setNumRows(helpData.length);
            setDataSearch(null);
            setDataSheetSearch([]);
        } else {
            const filtered = helpData.filter(
                (item) =>
                    item.WorkCenterName.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredData(filtered);
            setNumRows(filtered.length);
        }
        setDropdownVisible(true);
    };



    const handleCellClick = ([col, row]) => {
        const data = searchText.trim() === '' ? helpData : filteredData;
        if (data[row]) {
            const ItemName = data[row].WorkCenterName;
            setSearchText(ItemName);
            setItemText(ItemName);
            setDataSearch(data[row]);
            setDataSheetSearch([data[row]]);
            setDropdownVisible(false);
        }
    };

    const onItemHovered = useCallback((args) => {
        const [_, row] = args.location;
        setHoverRow(args.kind !== 'cell' ? undefined : row);
    }, []);

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setDropdownVisible(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const getData = useCallback(
        ([col, row]) => {
            const person = filteredData[row] || {};
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
        [filteredData, cols]
    );

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

    if (!dropdownVisible) return null;

    return (
        <div
            ref={dropdownRef}
            className="fixed  z-50 w-auto bg-white border border-gray-300 rounded-lg 
                    top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        >
            <div className="flex items-center justify-between p-1">
                <h2 className="text-xs font-medium flex items-center gap-2 p-2 text-blue-600 uppercase">
                    <TableOutlined />
                    {t('Work Center')}
                </h2>
                <Button
                    type="text"
                    icon={<CloseOutlined />}
                    onClick={() => setDropdownVisible(false)}
                />
            </div>
            <div className="p-2 border-b border-t">
                <div className="w-full flex gap-2">
                    <button

                        className="opacity-80 size-5 cursor-pointer"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <LoadingOutlined className="animate-spin" />
                        ) : (
                            <SearchOutlined />
                        )}
                    </button>
                    <input
                        value={searchText}
                        onChange={handleSearch}
                        onFocus={() => setDropdownVisible(true)}
                        className="h-full w-full border-none focus:outline-none bg-inherit"
                    />

                    {searchText && (
                        <DeleteOutlined
                            className="absolute right-2 cursor-pointer opacity-50 hover:opacity-100"
                            onClick={() => {
                                setSearchText('');
                                setItemText('');
                                setFilteredData(helpData);
                                setNumRows(helpData.length)
                                setDataSearch(null);
                                setDataSheetSearch([]);
                            }}
                        />
                    )}
                </div>
            </div>
            <DataEditor
                ref={gridRef}
                width={1200}
                height={500}
                onFill={onFill}
                className="cursor-pointer rounded-md"
                rows={numRows}
                columns={cols}
                gridSelection={selection}
                onGridSelectionChange={setSelection}
                getCellsForSelection={true}
                rowHeight={27}
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
                rowMarkers={('checkbox-visible', 'both')}
                rowSelect="single"
            />
        </div>

    );
};

export default DropdownWC;