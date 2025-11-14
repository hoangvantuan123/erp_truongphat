import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Button } from 'antd';
import { SearchOutlined, TableOutlined, CloseOutlined, DeleteOutlined } from '@ant-design/icons';
import { DataEditor, GridCellKind, CompactSelection } from '@glideapps/glide-data-grid';
import useOnFill from '../../hooks/sheet/onFillHook';
import { useTranslation } from 'react-i18next';

const Dropdown2005 = ({
    helpData = [],
    setSearchText,
    searchText,
    setItemText,
    setDataSearch,
    setDropdownVisible,
    dropdownVisible,
}) => {
    const { t } = useTranslation();
    const gridRef = useRef(null);
    const dropdownRef = useRef(null);
    const [filteredData, setFilteredData] = useState(helpData);
    const [hoverRow, setHoverRow] = useState(null);
    const [selection, setSelection] = useState({
        columns: CompactSelection.empty(),
        rows: CompactSelection.empty(),
    });

    const columnDefs = useMemo(() => [
        { title: t('Thuộc tính'), id: 'Value', kind: 'Text', readonly: true, width: 300 },
        { title: t('Mã'), id: 'UMItemClass', kind: 'Text', readonly: true, width: 200 },
    ], [t]);

    const onFill = useOnFill(filteredData, columnDefs);
    const numRows = filteredData.length;

    useEffect(() => {
        setFilteredData(helpData);
    }, [helpData]);

    useEffect(() => {
        if (dropdownVisible && dropdownRef.current) {
            Object.assign(dropdownRef.current.style, {
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 1000,
            });
        }
    }, [dropdownVisible]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownVisible(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [setDropdownVisible]);

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchText(value);

        if (!value.trim()) {
            setItemText('');
            setFilteredData(helpData);
            setDataSearch(null);
        } else {
            const lower = value.toLowerCase();
            setFilteredData(
                helpData.filter(
                    (item) =>
                        item.MinorName?.toLowerCase().includes(lower)
                )
            );
        }

        setDropdownVisible(true);
    };

    const handleCellClick = ([, row]) => {
        const data = filteredData[row];
        if (!data) return;

        setSearchText(data.Value || '');
        setItemText(data.Value || '');
        setDataSearch(data);
        setDropdownVisible(false);
    };

    const onItemHovered = useCallback((args) => {
        setHoverRow(args.kind === 'cell' ? args.location[1] : null);
    }, []);

    const getData = useCallback(([col, row]) => {
        const item = filteredData[row];
        const colDef = columnDefs[col];
        const value = item?.[colDef.id] ?? '';

        return {
            kind: GridCellKind.Text,
            data: value,
            displayData: String(value),
            readonly: colDef.readonly,
            allowOverlay: true,
        };
    }, [filteredData, columnDefs]);

    const onColumnResize = useCallback((col, newSize) => {
        const index = columnDefs.indexOf(col);
        if (index === -1) return;
        const updated = [...columnDefs];
        updated[index] = { ...col, width: newSize };
    }, [columnDefs]);

    if (!dropdownVisible) return null;
    useEffect(() => {
        if (!dropdownVisible) return;

        const trimmed = String(searchText || '').trim().toLowerCase();
        const safeHelpData = Array.isArray(helpData) ? helpData : [];
        const safeCols = Array.isArray(columnDefs) ? columnDefs : [];

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
    }, [dropdownVisible, searchText, helpData, columnDefs]);
    return (
        <div
            ref={dropdownRef}
            className="fixed z-50 bg-white border border-gray-300 rounded-lg shadow-lg"
        >
            <div className="flex items-center justify-between p-1">
                <h2 className="text-xs font-medium flex items-center gap-2 p-2 text-blue-600 uppercase">
                    <TableOutlined /> {t('DANH SÁCH')}
                </h2>
                <Button type="text" icon={<CloseOutlined />} onClick={() => setDropdownVisible(false)} />
            </div>

            <div className="p-2 border-y">
                <div className="flex items-center gap-2 relative w-full">
                    <SearchOutlined className="opacity-80 size-5" />
                    <input
                        value={searchText}
                        onChange={handleSearch}
                        autoFocus
                        className="w-full border-none focus:outline-none bg-transparent"
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
                width={1000}
                height={500}
                className="cursor-pointer rounded-md"
                rows={numRows}
                columns={columnDefs}
                gridSelection={selection}
                onGridSelectionChange={setSelection}
                rowHeight={25}
                getCellContent={getData}
                getRowThemeOverride={(i) =>
                    i === hoverRow
                        ? { bgCell: '#e8f0ff', bgCellMedium: '#e8f0ff' }
                        : i % 2
                            ? { bgCell: '#FBFBFB' }
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

export default Dropdown2005;
