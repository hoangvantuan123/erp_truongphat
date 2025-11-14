import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Button } from 'antd';
import {
    SearchOutlined,
    TableOutlined,
    LoadingOutlined,
    CloseOutlined,
    DeleteOutlined,
} from '@ant-design/icons';
import {
    DataEditor,
    GridCellKind,
    CompactSelection,
} from '@glideapps/glide-data-grid';
import useOnFill from '../../hooks/sheet/onFillHook';
import { useTranslation } from 'react-i18next';

const DropdownProject = ({
    helpData = [],
    setSearchText,
    searchText,
    setItemText,
    setDataSearch,
    setDataSheetSearch,
    setDropdownVisible,
    dropdownVisible,
}) => {
    const { t } = useTranslation();
    const gridRef = useRef(null);
    const dropdownRef = useRef(null);

    const [isLoading, setIsLoading] = useState(false);
    const [filteredData, setFilteredData] = useState([]);
    const [hoverRow, setHoverRow] = useState(null);
    const [selection, setSelection] = useState({
        columns: CompactSelection.empty(),
        rows: CompactSelection.empty(),
    });

    const cols = useMemo(() => [
        { title: t('10266'), id: 'ItemSeq', kind: 'Text', readonly: true, width: 350 },
        { title: t('1786'), id: 'ItemName', kind: 'Text', readonly: true, width: 200 },
        { title: t('2091'), id: 'ItemNo', kind: 'Text', readonly: true, width: 200 },
        { title: t('551'), id: 'Spec', kind: 'Text', readonly: true, width: 300 },
        { title: t('1954'), id: 'AssetName', kind: 'Text', readonly: true, width: 300 },
        { title: t('602'), id: 'UnitName', kind: 'Text', readonly: true, width: 300 },
    ], [t]);

    const [columnDefs, setColumnDefs] = useState(cols);
    const onFill = useOnFill(filteredData, columnDefs);

    const numRows = useMemo(() => filteredData.length, [filteredData]);

    // Cập nhật data nếu có thay đổi từ props
    useEffect(() => {
        setFilteredData(helpData);
    }, [helpData]);

    // Căn giữa dropdown
    useEffect(() => {
        if (dropdownVisible && dropdownRef.current) {
            Object.assign(dropdownRef.current.style, {
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: '1000',
            });
        }
    }, [dropdownVisible]);

    // Click ra ngoài thì đóng
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
            setDataSheetSearch([]);
        } else {
            const lower = value.toLowerCase();
            const result = helpData.filter(
                (item) =>
                    item.ItemName?.toLowerCase().includes(lower) ||
                    item.ItemNo?.toLowerCase().includes(lower) ||
                    item.Spec?.toLowerCase().includes(lower) ||
                    item.AssetName?.toLowerCase().includes(lower) ||
                    item.UnitName?.toLowerCase().includes(lower)
            );
            setFilteredData(result);
        }

        setDropdownVisible(true);
    };

    const handleCellClick = ([, row]) => {
        const source = searchText.trim() ? filteredData : helpData;
        const data = source[row];
        if (!data) return;

        const name = data.ItemName;
        setSearchText(name);
        setItemText(name);
        setDataSearch(data);
        setDataSheetSearch([data]);
        setDropdownVisible(false);
    };

    const onItemHovered = useCallback((args) => {
        setHoverRow(args.kind === 'cell' ? args.location[1] : undefined);
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
        if (index !== -1) {
            const updated = [...columnDefs];
            updated[index] = { ...col, width: newSize };
            setColumnDefs(updated);
        }
    }, [columnDefs]);

    if (!dropdownVisible) return null;

    return (
        <div
            ref={dropdownRef}
            className="fixed z-50 bg-white border border-gray-300 rounded-lg shadow-lg"
        >
            <div className="flex items-center justify-between p-1">
                <h2 className="text-xs font-medium flex items-center gap-2 p-1 text-blue-600 uppercase">
                    <TableOutlined /> {t('353')}
                </h2>
                <Button
                    type="text"
                    icon={<CloseOutlined />}
                    onClick={() => setDropdownVisible(false)}
                />
            </div>

            <div className="p-1 border-y">
                <div className="flex items-center gap-2 relative w-full">
                    {isLoading ? (
                        <LoadingOutlined className="opacity-80 size-5 animate-spin" />
                    ) : (
                        <SearchOutlined className="opacity-80 size-5" />
                    )}

                    <input
                        value={searchText}
                        onChange={handleSearch}
                        onFocus={() => setDropdownVisible(true)}
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
                                setDataSheetSearch([]);
                            }}
                        />
                    )}
                </div>
            </div>

            <DataEditor
                ref={gridRef}
                width={1000}
                height={500}
                onFill={onFill}
                className="cursor-pointer rounded-md"
                rows={numRows}
                columns={columnDefs}
                gridSelection={selection}
                onGridSelectionChange={setSelection}
                getCellsForSelection
                rowHeight={25}
                getCellContent={getData}
                getRowThemeOverride={(i) =>
                    i === hoverRow
                        ? { bgCell: '#e8f0ff', bgCellMedium: '#e8f0ff' }
                        : i % 2
                            ? { bgCell: '#FBFBFB' }
                            : undefined
                }
                fillHandle
                smoothScrollY
                smoothScrollX
                isDraggable={false}
                onItemHovered={onItemHovered}
                onCellClicked={handleCellClick}
                freezeColumns={0}
                onColumnResize={onColumnResize}
                rowMarkers="checkbox-visible"
                rowSelect="single"
            />
        </div>
    );
};

export default DropdownProject;
