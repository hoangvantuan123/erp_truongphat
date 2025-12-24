import { useEffect, useState, useCallback, useMemo, useRef } from 'react'
import { DataEditor, GridCellKind } from '@glideapps/glide-data-grid'
import '@glideapps/glide-data-grid/dist/index.css'
import { TableOutlined } from '@ant-design/icons'
import { useLayer } from 'react-laag'
import LayoutMenuSheet from '../../../sheet/jsx/layoutMenu'
import LayoutStatusMenuSheet from '../../../sheet/jsx/layoutStatusMenu'
import { Drawer, Checkbox, message } from 'antd'
import { saveToLocalStorageSheet } from '../../../../../localStorage/sheet/sheet'
import { loadFromLocalStorageSheet } from '../../../../../localStorage/sheet/sheet'
import { reorderColumns } from '../../../sheet/js/reorderColumns'
import useOnFill from '../../../hooks/sheet/onFillHook'
import { useExtraCells } from '@glideapps/glide-data-grid-cells'
import { updateIndexNo } from '../../../sheet/js/updateIndexNo'
import moment from 'moment'
import { t } from 'i18next'

function PM02BTable({
    setSelection,
    selection,
    setShowSearch,
    showSearch,
    setGridData,
    gridData,
    numRows,
    setCols,
    cols,
    defaultCols,
}) {
    const gridRef = useRef(null)
    const [open, setOpen] = useState(false)
    const cellProps = useExtraCells()
    const onFill = useOnFill(setGridData, cols)
    const onSearchClose = useCallback(() => setShowSearch(false), [])
    const [showMenu, setShowMenu] = useState(null)
    const [isCell, setIsCell] = useState(null)
    const [hoverRow, setHoverRow] = useState(null);
    const seenClasses = useRef(new Set());
    const onItemHovered = useCallback((args) => {
        const [_, row] = args.location
        setHoverRow(args.kind !== 'cell' ? undefined : row)
    }, [])
    const [hiddenColumns, setHiddenColumns] = useState(() => {
        return loadFromLocalStorageSheet('pm02_b_h', [])
    })
    const onHeaderMenuClick = useCallback((col, bounds) => {
        if (cols[col]?.id === 'Status') {
            setShowMenu({
                col,
                bounds,
                menuType: 'statusMenu'
            })
        } else {
            setShowMenu({
                col,
                bounds,
                menuType: 'defaultMenu'
            })
        }
    }, [])


    const [keybindings, setKeybindings] = useState({
        downFill: true,
        rightFill: true,
        selectColumn: false
    })


    const totalColumns = ['Qty', 'Price' , 'Amt' , 'DomPrice', 'DomAmt', 'VATAmt', 'SumAmt'];

    const getData = useCallback(
        ([col, row]) => {
            const lastRowIndex = numRows - 1;
            const person = gridData[row] || {};
            const column = cols[col];
            const columnKey = column?.id || '';
            const value = person[columnKey] ?? '';

            if (row === lastRowIndex) {
                const cellTheme = {
                    textDark: "#009CA6",
                    bgIconHeader: "#009CA6",
                    accentColor: "#009CA6",
                    accentLight: "#009CA620",
                    fgIconHeader: "#FFFFFF",
                    baseFontStyle: "600 13px",
                    bgCell: "#E6F6DD",
                };

                if (totalColumns.includes(columnKey)) {
                    const total = gridData.reduce((sum, item) => {
                        const raw = item[columnKey]?.toString?.().replace(/,/g, '') || '0';
                        const num = parseFloat(raw);
                        return sum + (isNaN(num) ? 0 : num);
                    }, 0);
                    const getFractionDigits = (key) => ({ minimumFractionDigits: 0, maximumFractionDigits: 0 });
                    const { minimumFractionDigits, maximumFractionDigits } = getFractionDigits(columnKey);
                    const formattedTotal = total.toLocaleString('en-US', { minimumFractionDigits, maximumFractionDigits });

                    return {
                        kind: GridCellKind.Number,
                        data: total,
                        copyData: String(total),
                        displayData: formattedTotal,
                        readonly: true,
                        contentAlign: 'right',
                        themeOverride: cellTheme
                    };
                }

                return {
                    kind: GridCellKind.Text,
                    data: "",
                    displayData: "",
                    readonly: true,
                    themeOverride: cellTheme
                };
            }
            if (
                columnKey === 'DelvDueDate' ||
                columnKey === 'SupplyContDateFr' ||
                columnKey === 'SupplyContDateTo'
            ) {
                const formattedDate = value
                    ? `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}`
                    : ''
                const isValidDate =
                    formattedDate && !isNaN(new Date(formattedDate).getTime())
                return {
                    kind: GridCellKind.Text,
                    data: value,
                    displayData: isValidDate ? formattedDate : '',
                    readonly: true,
                    allowOverlay: true,
                    hasMenu: false,
                }
            }


            if (
                columnKey === "Price"||
                columnKey === "Qty"||
                columnKey === "Amt"||
                columnKey === "DomPrice"||
                columnKey === "DomAmt"||
                columnKey === "VATAmt" ||
                columnKey === "SumAmt" 


            ) {
                const rawText = value?.toString?.() || "";
                const cleaned = rawText.replace(/[^\d.-]/g, "");
                let numericValue = cleaned, formattedDisplay = cleaned;
                const num = parseFloat(cleaned);
                const isNumeric = !isNaN(num);

                if (isNumeric) {
                    numericValue = num.toString();
                    formattedDisplay = new Intl.NumberFormat("en-US", {
                        useGrouping: true,
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 6,
                    }).format(num);
                }

                return {
                    kind: GridCellKind.Text,
                    data: numericValue,
                    displayData: formattedDisplay,
                    copyData: numericValue,
                    readonly: column?.readonly ?? false,
                    allowOverlay: true,
                    hasMenu: column?.hasMenu ?? false,
                    contentAlign: "right",


                };
            }

            return {
                kind: GridCellKind.Text,
                data: value,
                displayData: String(value),
                readonly: column?.readonly ?? false,
                allowOverlay: true,
                hasMenu: column?.hasMenu ?? false,
            };
        },
        [gridData, cols, numRows]
    );







    const onKeyUp = useCallback(
        (event) => {
            const indexes = reorderColumns(cols)
        },
        [cols, gridData]
    )



    const onColumnResize = useCallback(
        (column, newSize) => {
            const index = cols.indexOf(column)
            if (index !== -1) {
                const newCol = {
                    ...column,
                    width: newSize
                }
                const newCols = [...cols]
                newCols.splice(index, 1, newCol)
                setCols(newCols)
            }
        },
        [cols]
    )

    const { renderLayer, layerProps } = useLayer({
        isOpen: showMenu !== null,
        triggerOffset: 4,
        onOutsideClick: () => setShowMenu(null),
        trigger: {
            getBounds: () => ({
                bottom: (showMenu?.bounds.y ?? 0) + (showMenu?.bounds.height ?? 0),
                height: showMenu?.bounds.height ?? 0,
                left: showMenu?.bounds.x ?? 0,
                right: (showMenu?.bounds.x ?? 0) + (showMenu?.bounds.width ?? 0),
                top: showMenu?.bounds.y ?? 0,
                width: showMenu?.bounds.width ?? 0
            })
        },
        placement: 'bottom-start',
        auto: true,
        possiblePlacements: ['bottom-start', 'bottom-end']
    })

    /* TOOLLS */
    const handleSort = (columnId, direction) => {
        setGridData((prevData) => {
            const rowsWithStatusA = prevData.filter(row => row.Status === 'A');
            const rowsWithoutStatusA = prevData.filter(row => row.Status !== 'A');

            const sortedData = rowsWithoutStatusA.sort((a, b) => {
                if (a[columnId] < b[columnId]) return direction === 'asc' ? -1 : 1;
                if (a[columnId] > b[columnId]) return direction === 'asc' ? 1 : -1;
                return 0;
            });

            const updatedData = updateIndexNo([...sortedData, ...rowsWithStatusA]);

            return updatedData;
        });

        setShowMenu(null);
    };

    const updateHiddenColumns = (newHiddenColumns) => {
        setHiddenColumns((prevHidden) => {
            const newHidden = [...new Set([...prevHidden, ...newHiddenColumns])]
            saveToLocalStorageSheet('pm02_b_h', newHidden)
            return newHidden
        })
    }

    const updateVisibleColumns = (newVisibleColumns) => {
        setCols((prevCols) => {
            const newCols = [...new Set([...prevCols, ...newVisibleColumns])]
            const uniqueCols = newCols.filter(
                (col, index, self) => index === self.findIndex((c) => c.id === col.id)
            )
            saveToLocalStorageSheet('pm02_b_a', uniqueCols)
            return uniqueCols
        })
    }

    const handleHideColumn = (colIndex) => {
        const columnId = cols[colIndex]?.id
        if (cols.length > 1) {
            updateHiddenColumns([columnId])
            setCols((prevCols) => {
                const newCols = prevCols.filter((_, idx) => idx !== colIndex)
                const uniqueCols = newCols.filter(
                    (col, index, self) => index === self.findIndex((c) => c.id === col.id)
                )
                saveToLocalStorageSheet('pm02_b_a', uniqueCols)
                return uniqueCols
            })
            setShowMenu(null)
        }
    }
    // Hàm rEST LẤY LẠI CỘT DỮ LIỆU

    const handleReset = () => {
        setCols(defaultCols.filter((col) => col.visible))
        setHiddenColumns([])
        localStorage.removeItem('pm02_b_a')
        localStorage.removeItem('pm02_b_h')
    }

    const onColumnMoved = useCallback((startIndex, endIndex) => {
        setCols((prevCols) => {
            const updatedCols = [...prevCols]
            const [movedColumn] = updatedCols.splice(startIndex, 1)
            updatedCols.splice(endIndex, 0, movedColumn)
            saveToLocalStorageSheet('pm02_b_a', updatedCols)
            return updatedCols
        })
    }, [])

    const showDrawer = () => {
        const invisibleCols = defaultCols.filter((col) => col.visible === false).map((col) => col.id)
        const currentVisibleCols = loadFromLocalStorageSheet('pm02_b_a', []).map(
            (col) => col.id
        )
        const newInvisibleCols = invisibleCols.filter((col) => !currentVisibleCols.includes(col))
        updateHiddenColumns(newInvisibleCols)
        updateVisibleColumns(
            defaultCols.filter((col) => col.visible && !hiddenColumns.includes(col.id))
        )
        setOpen(true)
    }
    const onClose = () => {
        setOpen(false)
    }

    const handleCheckboxChange = (columnId, isChecked) => {
        if (isChecked) {
            const restoredColumn = defaultCols.find((col) => col.id === columnId)
            setCols((prevCols) => {
                const newCols = [...prevCols, restoredColumn]
                saveToLocalStorageSheet('pm02_b_a', newCols)
                return newCols
            })
            setHiddenColumns((prevHidden) => {
                const newHidden = prevHidden.filter((id) => id !== columnId)
                saveToLocalStorageSheet('pm02_b_h', newHidden)
                return newHidden
            })
        } else {
            setCols((prevCols) => {
                const newCols = prevCols.filter((col) => col.id !== columnId)
                saveToLocalStorageSheet('pm02_b_a', newCols)
                return newCols
            })
            setHiddenColumns((prevHidden) => {
                const newHidden = [...prevHidden, columnId]
                saveToLocalStorageSheet('pm02_b_h', newHidden)
                return newHidden
            })
        }
    }

    return (
        <div className="w-full gap-1 h-full flex items-center justify-center">
            <div className="w-full h-full flex flex-col  bg-white  overflow-hidden ">
                <h2 className="text-[10px]  text-blue-600 border-b font-medium flex items-center gap-2 p-1  uppercase">
                    {t('NỘI DUNG CHI TIẾT HỢP ĐỒNG')}
                </h2>
                <DataEditor
                    {...cellProps}
                    ref={gridRef}
                    columns={cols}
                    getCellContent={getData}
                    onFill={onFill}
                    rows={numRows}
                    showSearch={showSearch}
                    onSearchClose={onSearchClose}
                    rowMarkers="both"
                    width="100%"
                    height="100%"
                    rowSelect="multi"
                    gridSelection={selection}
                    onGridSelectionChange={setSelection}
                    getCellsForSelection={true}
                    freezeColumns={1}
                    headerHeight={29}
                    getRowThemeOverride={(rowIndex) => {
                        if (rowIndex === hoverRow) {
                            return {
                                bgCell: "#f7f7f7",
                                bgCellMedium: "#f0f0f0"
                            };
                        }
                        return undefined;
                    }}
                    rowHeight={25}
                    smoothScrollY={false}
                    smoothScrollX={false}
                    onPaste={true}
                    freezeTrailingRows={1}
                    onColumnResize={onColumnResize}
                    onHeaderMenuClick={onHeaderMenuClick}
                    onColumnMoved={onColumnMoved}
                    onKeyUp={onKeyUp}
                />
                {showMenu !== null &&
                    renderLayer(
                        <div
                            {...layerProps}
                            className="border  w-72 rounded-lg bg-white shadow-lg cursor-pointer"
                        >
                            {showMenu.menuType === 'statusMenu' ? (
                                <LayoutStatusMenuSheet
                                    showMenu={showMenu}
                                    handleSort={handleSort}
                                    cols={cols}
                                    renderLayer={renderLayer}
                                    setShowSearch={setShowSearch}
                                    setShowMenu={setShowMenu}
                                    layerProps={layerProps}
                                    handleReset={handleReset}
                                    showDrawer={showDrawer}
                                    data={gridData}
                                />
                            ) : (
                                <LayoutMenuSheet
                                    showMenu={showMenu}
                                    handleSort={handleSort}
                                    handleHideColumn={handleHideColumn}
                                    cols={cols}
                                    renderLayer={renderLayer}
                                    setShowSearch={setShowSearch}
                                    setShowMenu={setShowMenu}
                                    layerProps={layerProps}
                                />
                            )}
                        </div>
                    )}
                <Drawer
                    title={<span className="text-xs flex items-center justify-end">CÀI ĐẶT SHEET</span>}
                    styles={{
                        wrapper: {
                            borderRadius: '16px 0 0 16px',
                            overflow: 'hidden',
                            boxShadow: '0'
                        }
                    }}
                    bodyStyle={{ padding: 15 }}
                    onClose={onClose}
                    open={open}
                >
                    {defaultCols.map(
                        (col) =>
                            col.id !== 'Status' && (
                                <div key={col.id} style={{ marginBottom: '10px' }}>
                                    <Checkbox
                                        checked={!hiddenColumns.includes(col.id)}
                                        onChange={(e) => handleCheckboxChange(col.id, e.target.checked)}
                                    >
                                        {col.title}
                                    </Checkbox>
                                </div>
                            )
                    )}
                </Drawer>
            </div>
        </div>
    )
}

export default PM02BTable
