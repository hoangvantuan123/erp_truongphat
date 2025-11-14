import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Button, Spin } from 'antd';
import { SearchOutlined, TableOutlined, CloseOutlined, DeleteOutlined } from '@ant-design/icons';
import { DataEditor, GridCellKind, CompactSelection } from '@glideapps/glide-data-grid';
import useOnFill from '../../hooks/sheet/onFillHook';
import { useTranslation } from 'react-i18next';
import { useMediaQuery } from 'react-responsive';

const DropdownEmpAuto = ({
    helpData = [],
    setSearchText,
    searchText,
    setDataSearch,
    setDropdownVisible,
    dropdownVisible,
    // Thêm props mới cho việc gọi API
    onLoadMore = null,
    hasMore = false,
    isLoading = false,
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
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    // Media queries for responsive design
    const isMobile = useMediaQuery({ maxWidth: 768 });
    const isTablet = useMediaQuery({ minWidth: 769, maxWidth: 1024 });
    const isDesktop = useMediaQuery({ minWidth: 1025 });

    const columnDefs = useMemo(() => {
        const baseColumns = [
            { title: t('Tên'), id: 'EmpName', kind: 'Text', readonly: true, width: 350 },
            { title: t('Mã nhân viên'), id: 'Empid', kind: 'Text', readonly: true, width: 200 },
        ];

        // Adjust column widths for different screen sizes
        if (isMobile) {
            return baseColumns.map(col => ({
                ...col,
                width: 250
            }));
        } else if (isTablet) {
            return baseColumns.map(col => ({
                ...col,
                width: 250
            }));
        }

        return baseColumns;
    }, [t, isMobile, isTablet]);

    const onFill = useOnFill(filteredData, columnDefs);
    const numRows = filteredData.length;

    // Reset khi helpData thay đổi
    useEffect(() => {
        setFilteredData(helpData);
        setCurrentPage(1);
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
            setCurrentPage(1);
        } else {
            const lower = value.toLowerCase();
            const filtered = helpData.filter(
                (item) =>
                    item.MinorName?.toLowerCase().includes(lower) ||
                    item.EmpName?.toLowerCase().includes(lower) ||
                    item.Empid?.toLowerCase().includes(lower)
            );

            setFilteredData(filtered);

            // Nếu không có kết quả và có hàm onLoadMore, gọi API để tải thêm dữ liệu
            if (filtered.length === 0 && onLoadMore) {
                handleLoadMore(value, 1, true);
            }
        }

        setDropdownVisible(true);
    };

    const handleCellClick = ([, row]) => {
        const data = filteredData[row];
        if (!data) return;

        setSearchText(data.EmpName || '');
        setDataSearch(data);
        setDropdownVisible(false);
    };

    // Hàm gọi API load thêm dữ liệu
    const handleLoadMore = useCallback(async (searchValue = '', page = 1, isSearch = false) => {
        if (!onLoadMore || isLoadingMore) return;

        try {
            setIsLoadingMore(true);
            await onLoadMore(searchValue, page, isSearch);
            if (!isSearch) {
                setCurrentPage(prev => prev + 1);
            }
        } catch (error) {
            console.error('Error loading more data:', error);
        } finally {
            setIsLoadingMore(false);
        }
    }, [onLoadMore, isLoadingMore]);

    // Xử lý scroll để load thêm dữ liệu
    const handleScroll = useCallback((e) => {
        const { scrollTop, scrollHeight, clientHeight } = e.target;

        // Khi scroll đến gần cuối (còn 100px) và có thể load thêm
        if (scrollHeight - scrollTop - clientHeight < 100 && hasMore && !isLoadingMore) {
            handleLoadMore(searchText, currentPage + 1, false);
        }
    }, [hasMore, isLoadingMore, searchText, currentPage, handleLoadMore]);

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

            // Nếu không có kết quả, gọi API để tải thêm dữ liệu
            if (filtered.length === 0 && onLoadMore) {
                handleLoadMore(trimmed, 1, true);
            }
        }
    }, [dropdownVisible, searchText, helpData, columnDefs, onLoadMore, handleLoadMore]);

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
            <div className="p-0 border-b">
                <div className="flex items-center gap-2 relative w-full bg-white   px-3 py-3">
                    <SearchOutlined className="opacity-80 text-gray-400" />
                    <input
                        value={searchText}
                        onChange={handleSearch}
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
                                setCurrentPage(1);
                            }}
                        />
                    )}
                </div>
            </div>

            {/* Data Grid */}
            <div
                className={`${isMobile ? 'p-0' : 'p-0'} relative`}
                onScroll={handleScroll}
            >
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

                {/* Loading indicator */}
                {(isLoading || isLoadingMore) && (
                    <div className="absolute bottom-0 left-0 right-0 flex justify-center p-2 bg-white bg-opacity-80">
                        <Spin size="small" />
                        <span className="ml-2 text-sm text-gray-600">{t('Đang tải...')}</span>
                    </div>
                )}

                {/* No data message */}
                {!isLoading && filteredData.length === 0 && (
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                        <div className="text-gray-400 text-sm">
                            {t('Không có dữ liệu')}
                        </div>
                        {hasMore && (
                            <Button
                                type="link"
                                onClick={() => handleLoadMore(searchText, 1, true)}
                                loading={isLoadingMore}
                                className="mt-2"
                            >
                                {t('Tải thêm dữ liệu')}
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DropdownEmpAuto;