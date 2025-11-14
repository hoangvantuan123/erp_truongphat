import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Button } from 'antd';
import { SearchOutlined, TableOutlined, CloseOutlined, DeleteOutlined } from '@ant-design/icons';
import { DataEditor, GridCellKind, CompactSelection } from '@glideapps/glide-data-grid';
import useOnFill from '../../hooks/sheet/onFillHook';
import { useTranslation } from 'react-i18next';
import { useMediaQuery } from 'react-responsive';

const DropdownWHAuto = ({
    helpData = [],
    setSearchText,
    searchText,
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

    // Media queries for responsive design
    const isMobile = useMediaQuery({ maxWidth: 768 });
    const isTablet = useMediaQuery({ minWidth: 769, maxWidth: 1024 });
    const isDesktop = useMediaQuery({ minWidth: 1025 });

    const columnDefs = useMemo(() => {
        const baseColumns = [
            { title: t('Kho'), id: 'WHName', kind: 'Text', readonly: true, width: 300 },
            { title: t('Mã Kho'), id: 'WHSeq', kind: 'Text', readonly: true, width: 200 },
        ];

        // Adjust column widths for different screen sizes
        if (isMobile) {
            return baseColumns.map(col => ({
                ...col,
                width: col.id === 'WHName' ? 200 : 120
            }));
        } else if (isTablet) {
            return baseColumns.map(col => ({
                ...col,
                width: col.id === 'WHName' ? 250 : 150
            }));
        }

        return baseColumns;
    }, [t, isMobile, isTablet]);

    const onFill = useOnFill(filteredData, columnDefs);
    const numRows = filteredData.length;

    useEffect(() => {
        setFilteredData(helpData);
    }, [helpData]);

    useEffect(() => {
        if (dropdownVisible && dropdownRef.current) {
            const dropdownStyle = dropdownRef.current.style;

            if (isMobile) {
                // Mobile: full screen modal
                Object.assign(dropdownStyle, {
                    position: 'fixed',
                    top: '0',
                    left: '0',
                    right: '0',
                    bottom: '0',
                    transform: 'none',
                    width: '100vw',
                    height: '100vh',
                    zIndex: 1000,
                    borderRadius: '0',
                });
            } else {
                // Desktop/Tablet: centered modal
                Object.assign(dropdownStyle, {
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: isTablet ? '90vw' : '70vw',
                    maxWidth: '800px',
                    maxHeight: '80vh',
                    zIndex: 1000,
                });
            }
        }
    }, [dropdownVisible, isMobile, isTablet]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownVisible(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [setDropdownVisible]);

    // Handle escape key to close dropdown
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && dropdownVisible) {
                setDropdownVisible(false);
            }
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [dropdownVisible, setDropdownVisible]);

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchText(value);

        if (!value.trim()) {
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

        setSearchText(data.WHName || '');
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

    // Filter data when dropdown becomes visible
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

    if (!dropdownVisible) return null;

    return (
        <div
            ref={dropdownRef}
            className={`fixed z-50 bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden ${isMobile ? 'mobile-dropdown' : 'desktop-dropdown'
                }`}
        >
            {/* Header */}
            <div className="flex items-center justify-between p-3 bg-gray-50 border-b">
                <h2 className="text-sm font-semibold flex items-center gap-2 text-blue-600 uppercase">
                    <TableOutlined /> {t('DANH SÁCH')}
                </h2>
                <Button
                    type="text"
                    icon={<CloseOutlined />}
                    onClick={() => setDropdownVisible(false)}
                    className="flex-shrink-0"
                    size={isMobile ? "middle" : "small"}
                />
            </div>

            {/* Search Input */}
            <div className="p-3 border-b">
                <div className="flex items-center gap-2 relative w-full bg-white border border-gray-300 rounded-lg px-3 py-2">
                    <SearchOutlined className="opacity-80 text-gray-400" />
                    <input
                        value={searchText}
                        onChange={handleSearch}
                        autoFocus
                        placeholder={t('Tìm kiếm...')}
                        className="w-full border-none focus:outline-none bg-transparent text-sm"
                    />
                    {searchText && (
                        <DeleteOutlined
                            className="cursor-pointer opacity-50 hover:opacity-100 text-gray-400"
                            onClick={() => {
                                setSearchText('');
                                setFilteredData(helpData);
                                setDataSearch(null);
                            }}
                        />
                    )}
                </div>
            </div>

            {/* Data Grid */}
            <div className={`${isMobile ? 'p-0' : 'p-0'}`}>
                <DataEditor
                    ref={gridRef}
                    width="100%"
                    height={isMobile ? 'calc(100vh - 160px)' : 400}
                    className="cursor-pointer"
                    rows={numRows}
                    columns={columnDefs}
                    gridSelection={selection}
                    onGridSelectionChange={setSelection}
                    rowHeight={50}
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
                    rowMarkers={isMobile ? 'number' : 'checkbox-visible'}
                    rowSelect="single"
                    verticalBorder={!isMobile}
                    headerHeight={isMobile ? 40 : 35}
                />
            </div>


        </div>
    );
};

export default DropdownWHAuto;