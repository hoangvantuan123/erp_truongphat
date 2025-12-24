
import { useState, useRef, useEffect, useCallback } from 'react';
import { Button, Form, Input, Row, Col, Select } from 'antd'
import CustomRenderer, {
    getMiddleCenterBias,
    GridCellKind,
    TextCellEntry,
    useTheme,
    DataEditor,
} from '@glideapps/glide-data-grid'
import { SearchOutlined, TableOutlined, LoadingOutlined, CloseOutlined, DeleteOutlined } from '@ant-design/icons'
import { CompactSelection } from '@glideapps/glide-data-grid'
import useOnFill from '../../hooks/sheet/onFillHook';
import { useTranslation } from 'react-i18next'
const DropdownDeptV2 = ({ helpData, setSearchText, searchText, setItemText, setDataSearch, setDropdownVisible, dropdownVisible }) => {
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
    useEffect(() => {
        if (dropdownVisible && dropdownRef.current) {
            const dropdown = dropdownRef.current;
            dropdown.style.position = "fixed";
            dropdown.style.top = "50%";
            dropdown.style.left = "50%";
            dropdown.style.transform = "translate(-50%, -50%)";
            dropdown.style.zIndex = "1000";
        }
    }, [dropdownVisible]);
    const defaultCols = [
        {
            title: t('5'),
            id: 'BeDeptName',
            kind: 'Text',
            readonly: true,
            width: 250,
        },
        {
            title: t('362'),
            id: 'DeptRemark',
            kind: 'Text',
            readonly: true,
            width: 200,
        },
    ];
    const [cols, setCols] = useState(defaultCols);
    const onFill = useOnFill(filteredData, cols);

    useEffect(() => {
        if (Array.isArray(helpData) && helpData.length > 0) {
            setFilteredData(helpData);
            setNumRows(helpData.length);
        }
    }, [helpData]);


    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchText(value);
        if (value.trim() === '' || value === null) {
            setItemText('');
            setFilteredData(helpData);
            setDataSearch(null);
            setNumRows(helpData.length);

        } else {
            const filtered = helpData.filter(
                (item) =>
                    item.BeDeptName.toLowerCase().includes(value.toLowerCase()) ||
                    item.DeptRemark.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredData(filtered);
            setNumRows(filtered.length);
        }
        setDropdownVisible(true);
    };

    const handleCellClick = ([col, row]) => {
        const data = searchText.trim() === '' ? helpData : filteredData;
        if (data[row]) {
            const ItemName = data[row].BeDeptName;
            setSearchText(ItemName);
            setItemText(ItemName);
            setDataSearch(data[row]);

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
                    {t('850000132')}
                </h2>
                <Button
                    type="text"
                    icon={<CloseOutlined />}
                    onClick={() => setDropdownVisible(false)}
                />
            </div>
            <div className="p-2 border-b border-t">
                <div className="w-full flex gap-2">
                    {isLoading ? (
                        <LoadingOutlined className="opacity-80 size-5 animate-spin" />
                    ) : (
                        <SearchOutlined className="opacity-80 size-5" />
                    )}

                    <input
                        value={searchText}
                        onChange={handleSearch}
                        onFocus={() => setDropdownVisible(true)}
                        autoFocus={true}
                        className="h-full w-full border-none focus:outline-none bg-inherit"
                    />

                    {searchText && (
                        <DeleteOutlined
                            className="absolute right-2 cursor-pointer opacity-50 hover:opacity-100"
                            onClick={() => {
                                setSearchText('');
                                setItemText('');
                                setFilteredData(helpData);
                                setDataSearch(null);

                            }}
                        />
                    )}
                </div>
            </div>
            <DataEditor
                ref={gridRef}
                width={980}
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

export default DropdownDeptV2;