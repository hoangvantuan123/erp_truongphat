import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { DataEditor, GridCellKind, CompactSelection } from '@glideapps/glide-data-grid';
import { useTranslation } from 'react-i18next'
import { useWindowSize } from '../../hooks/sheet/useWindowSize';
import { SearchOutlined, TableOutlined, CloseOutlined, DeleteOutlined, LoadingOutlined } from '@ant-design/icons'
import { Button, Form, Input, Row, Col, Select } from 'antd'
const TempFileHelpQuery = ({ helpData, setSearchText, searchText, setDataSearch, setDropdownVisible, dropdownVisible }) => {
    const dropdownRef = useRef(null);
    const [filteredData, setFilteredData] = useState([]);
    const [hoverRow, setHoverRow] = useState(null);
    const [cols, setCols] = useState([]);


    const { t } = useTranslation()


    const defaultCols = useMemo(() => [
        {
            title: 'File',
            id: 'OriginalName',
            kind: 'Text',
            readonly: false,
            width: 420,
            hasMenu: true,
            visible: true,
            trailingRowOptions: {
                disabled: true,
            },
        },

        {
            title: 'Size',
            id: 'Size',
            kind: 'Text',
            readonly: false,
            width: 90,
            hasMenu: true,
            visible: true,
            trailingRowOptions: {
                disabled: true,
            },
        },
    ], []);

    useEffect(() => {
        setCols(defaultCols);
    }, [defaultCols]);

    useEffect(() => {
        if (helpData?.length) {
            setFilteredData(helpData);
        }
    }, [helpData]);


    useEffect(() => {
        if (!dropdownVisible) return;

        const trimmed = String(searchText || '').trim().toLowerCase();
        const safeHelpData = Array.isArray(helpData) ? helpData : [];
        const safeCols = Array.isArray(defaultCols) ? defaultCols : [];

        if (!trimmed) {
            setFilteredData(safeHelpData);
            setDataSearch([]);
        } else {
            const filtered = safeHelpData.filter((item) =>
                safeCols.some((col) =>
                    String(item?.[col.id] || '').toLowerCase().includes(trimmed)
                )
            );
            setFilteredData(filtered);
        }
    }, [dropdownVisible, searchText, helpData, defaultCols]);





    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchText(value);

        const trimmed = value.trim().toLowerCase();
        if (!trimmed) {
            setFilteredData(helpData);
            setDataSearch([]);
        } else {
            const filtered = helpData.filter((item) =>
                defaultCols.some((col) =>
                    String(item[col.id] || '').toLowerCase().includes(trimmed)
                )
            );
            setFilteredData(filtered);
        }
    };

    const handleCellClick = ([col, row]) => {
        const data = searchText.trim() === '' ? helpData : filteredData;
        const item = data[row];
        if (item) {
            setSearchText(item.OriginalName);
            setDataSearch(item);
            setDropdownVisible(false);
        }
    };

    const getData = useCallback(([col, row]) => {
        const person = filteredData[row] || {};
        const column = cols[col];
        const value = person[column?.id] || '';
        return {
            kind: GridCellKind.Text,
            data: value,
            displayData: String(value),
            readonly: column?.readonly ?? false,
            allowOverlay: true,
        };
    }, [filteredData, cols]);

    const onColumnResize = useCallback((column, newSize) => {
        const index = cols.indexOf(column);
        if (index !== -1) {
            const updatedCols = [...cols];
            updatedCols[index] = { ...column, width: newSize };
            setCols(updatedCols);
        }
    }, [cols]);

    const onItemHovered = useCallback(({ location, kind }) => {
        setHoverRow(kind !== 'cell' ? undefined : location[1]);
    }, []);

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
                </h2>
                <Button type="text" icon={<CloseOutlined />} onClick={() => setDropdownVisible(false)} />
            </div>

            <div className="p-2 border-y">
                <div className="flex items-center gap-2 relative w-full">
                    <SearchOutlined className="opacity-80 size-5" />
                    <input
                        value={searchText}
                        onChange={handleSearch}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && filteredData.length > 0) {
                                const selected = filteredData[0];
                                setSearchText(selected.AssetCode);
                                setDataSearch(selected);
                                setDropdownVisible(false);
                            }
                            if (e.key === "Escape") {
                                setDropdownVisible(false);
                            }
                        }}
                        maxLength={500}
                        placeholder="Nhập từ khóa để tìm kiếm..."
                        className="flex-1 border-none outline-none bg-inherit"
                        autoFocus
                    />
                    {searchText && (
                        <DeleteOutlined
                            className="absolute right-2 cursor-pointer opacity-50 hover:opacity-100"
                            onClick={() => {
                                setSearchText('');
                                setFilteredData(helpData);
                                setDataSearch([]);
                            }}
                        />
                    )}
                </div>
            </div>

            <DataEditor
                width={1000}
                height={500}
                className="cursor-pointer rounded-md"
                rows={filteredData.length}
                columns={cols}
                getCellContent={getData}
                rowHeight={25}
                getRowThemeOverride={(rowIndex) =>
                    rowIndex === hoverRow
                        ? { bgCell: "#f7f7f7", bgCellMedium: "#f0f0f0" }
                        : undefined
                }
                onItemHovered={onItemHovered}
                onCellClicked={handleCellClick}
                freezeColumns={0}
                onColumnResize={onColumnResize}
                fillHandle
                smoothScrollY
                smoothScrollX
                isDraggable={false}
                rowMarkers={('checkbox-visible', 'both')}
                rowSelect="single"
            />
        </div>
    );
};

export default TempFileHelpQuery;
