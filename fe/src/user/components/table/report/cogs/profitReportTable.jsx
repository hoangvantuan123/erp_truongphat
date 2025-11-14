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

function ProfitReportTable({
    setSelection,
    selection,
    setShowSearch,
    showSearch,
    setGridData,
    gridData,
    numRows,
    handleRowAppend,
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
        return loadFromLocalStorageSheet('profit_report_h', [])
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

    const uniqueColumnNames = [...new Set([


    ])];

    const highlightRegions = [

    ].map(columnName => ({
        color: '#ebf1ff',
        range: {
            x: reorderColumns(cols).indexOf(columnName),
            y: 0,
            width: 1,
            height: numRows,
        },
    }))
        .concat(
            uniqueColumnNames.map(columnName => ({
                color: '#F0F2F5',
                range: {
                    x: reorderColumns(cols).indexOf(columnName),
                    y: 0,
                    width: 1,
                    height: numRows,
                },
            }))
        );
    const [keybindings, setKeybindings] = useState({
        downFill: true,
        rightFill: true,
        selectColumn: false
    })

    /*    
    const numericColumns = [
           'UnitPrice', 'SaleQty', 'RevenueAmt', 'MatCosAmt', 'MatCosAmt1', 'TotalAmt1',
           'SalaryKrAmt', 'SalaryVNAmt', 'SeveranceAmt', 'InsurCostAmt', 'TotalAmt2',
           'OtherExpenAmt', 'MatCosAmt2', 'ExpenAmt34', 'ExpenAmt35', 'ExpenAmt36',
           'ExpenAmt37', 'ExpenAmt38', 'ExpenAmt39', 'ExpenAmt40', 'ExpenAmt41',
           'ExpenAmt42', 'ExpenAmt43', 'ExpenAmt44', 'ExpenAmt45', 'TotalAmt3',
           'TotalAmt4', 'GrossProfitSaleAmt', 'Percent', 'ExpenAmt46', 'ExpenAmt47',
           'ExpenAmt48', 'ExpenAmt5', 'ExpenAmt49', 'TotalAmt5', 'ExpenAmt50',
           'ExpenAmt51', 'ExpenAmt52', 'ExpenAmt53', 'ExpenAmt54', 'ExpenAmt62',
           'ExpenAmt17', 'ExpenAmt25', 'ExpenAmt21', 'ExpenAmt23', 'ExpenAmt24',
           'ExpenAmt55', 'ExpenAmt27', 'ExpenAmt28', 'ExpenAmt56', 'ExpenAmt30',
           'ExpenAmt33', 'ExpenAmt22', 'ExpenAmt19', 'ExpenAmt57', 'ExpenAmt58',
           'ExpenAmt59', 'ExpenAmt60', 'ExpenAmt61', 'TotalAmt6', 'TotalAmt7',
           'SaleProfitAmt', 'Percent2',
       ]; 
       
       */
       const rowGroupColorMap = useMemo(() => {
        const map = {};
        let currentColorIndex = 0;
        let lastLName = "";
    
        for (let row = 0; row < gridData.length; row++) {
            const rowData = gridData[row];
            const currentLName = rowData.ItemClassLName || '';
            const currentMName = rowData.ItemClassMName || '';
    
            // Nếu LName thay đổi, thì tăng màu
            if (currentLName !== lastLName) {
                currentColorIndex++;
                lastLName = currentLName;
            }
    
            const bgColor = currentColorIndex % 2 === 0 ? "#f0f5ff" : "#e6f7ff";
    
            map[row] = {
                bgColor,
                isFirstLName:
                    row === 0 || gridData[row - 1]?.ItemClassLName !== currentLName,
                isFirstMName:
                    row === 0 || gridData[row - 1]?.ItemClassMName !== currentMName
            };
        }
    
        return map;
    }, [gridData]);
    

    const getData = useCallback(
        ([col, row]) => {
            const person = gridData[row] || {};
            const column = cols[col];
            const columnKey = column?.id || '';
            let value = person[columnKey] || '';
            const rowGroup = rowGroupColorMap[row];
            const backgroundColor = rowGroup?.bgColor;

            if (columnKey === "ItemClassLName") {
                const isFirst = rowGroupColorMap[row]?.isFirstLName;
                return {
                    kind: GridCellKind.Text,
                    data: isFirst ? value : "",
                    displayData: isFirst ? value : "",
                    readonly: true,
                    allowOverlay: false,
                    themeOverride: {
                        bgCell: rowGroupColorMap[row]?.bgColor,
                        textDark: isFirst ? '#0050b3' : undefined,
                        fontWeight: isFirst ? 'bold' : undefined,
                    }
                };
            }
            
            if (columnKey === "ItemClassMName") {
                const isFirst = rowGroupColorMap[row]?.isFirstMName;
                return {
                    kind: GridCellKind.Text,
                    data: isFirst ? value : "",
                    displayData: isFirst ? value : "",
                    readonly: true,
                    allowOverlay: false,
                    themeOverride: {
                        // ✅ Quan trọng: Vẫn dùng màu từ LName
                        bgCell: rowGroupColorMap[row]?.bgColor,
                        textDark: isFirst ? '#0050b3' : undefined,
                        fontWeight: isFirst ? 'bold' : undefined,
                    }
                };
            }
            

            const numericColumns = [
                'UnitPrice', 'SaleQty', 'RevenueAmt', 'MatCosAmt', 'MatCosAmt1', 'TotalAmt1',
                'SalaryKrAmt', 'SalaryVNAmt', 'SeveranceAmt', 'InsurCostAmt', 'TotalAmt2',
                'OtherExpenAmt', 'MatCosAmt2', 'ExpenAmt34', 'ExpenAmt35', 'ExpenAmt36',
                'ExpenAmt37', 'ExpenAmt38', 'ExpenAmt39', 'ExpenAmt40', 'ExpenAmt41',
                'ExpenAmt42', 'ExpenAmt43', 'ExpenAmt44', 'ExpenAmt45', 'TotalAmt3',
                'TotalAmt4', 'GrossProfitSaleAmt', 'Percent', 'ExpenAmt46', 'ExpenAmt47',
                'ExpenAmt48', 'ExpenAmt5', 'ExpenAmt49', 'TotalAmt5', 'ExpenAmt50',
                'ExpenAmt51', 'ExpenAmt52', 'ExpenAmt53', 'ExpenAmt54', 'ExpenAmt62',
                'ExpenAmt17', 'ExpenAmt25', 'ExpenAmt21', 'ExpenAmt23', 'ExpenAmt24',
                'ExpenAmt55', 'ExpenAmt27', 'ExpenAmt28', 'ExpenAmt56', 'ExpenAmt30',
                'ExpenAmt33', 'ExpenAmt22', 'ExpenAmt19', 'ExpenAmt57', 'ExpenAmt58',
                'ExpenAmt59', 'ExpenAmt60', 'ExpenAmt61', 'TotalAmt6', 'TotalAmt7',
                'SaleProfitAmt', 'Percent2',
            ];
            if (numericColumns.includes(columnKey)) {
                const rawText = value?.toString?.() || '';
                const numericValue = rawText.replace(/,/g, '');
                const number = Number(numericValue);
                const formattedValue = isNaN(number)
                    ? ''
                    : number.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    });

                return {
                    kind: GridCellKind.Number,
                    data: formattedValue,
                    displayData: formattedValue,
                    copyData: formattedValue,
                    readonly: column?.readonly || false,
                    allowOverlay: true,
                    hasMenu: column?.hasMenu || false,
                    contentAlign: 'right',
                    themeOverride: {
                        bgCell: backgroundColor
                    }
                };
            }

            return {
                kind: GridCellKind.Text,
                data: value,
                displayData: String(value),
                readonly: column?.readonly || false,
                allowOverlay: true,
                hasMenu: column?.hasMenu || false,
                themeOverride: {
                    bgCell: backgroundColor
                }
            };
        },
        [gridData, cols, rowGroupColorMap]
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
            saveToLocalStorageSheet('profit_report_h', newHidden)
            return newHidden
        })
    }

    const updateVisibleColumns = (newVisibleColumns) => {
        setCols((prevCols) => {
            const newCols = [...new Set([...prevCols, ...newVisibleColumns])]
            const uniqueCols = newCols.filter(
                (col, index, self) => index === self.findIndex((c) => c.id === col.id)
            )
            saveToLocalStorageSheet('profit_report_a', uniqueCols)
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
                saveToLocalStorageSheet('profit_report_a', uniqueCols)
                return uniqueCols
            })
            setShowMenu(null)
        }
    }
    // Hàm rEST LẤY LẠI CỘT DỮ LIỆU

    const handleReset = () => {
        setCols(defaultCols.filter((col) => col.visible))
        setHiddenColumns([])
        localStorage.removeItem('profit_report_a')
        localStorage.removeItem('profit_report_h')
    }

    const onColumnMoved = useCallback((startIndex, endIndex) => {
        setCols((prevCols) => {
            const updatedCols = [...prevCols]
            const [movedColumn] = updatedCols.splice(startIndex, 1)
            updatedCols.splice(endIndex, 0, movedColumn)
            saveToLocalStorageSheet('profit_report_a', updatedCols)
            return updatedCols
        })
    }, [])

    const showDrawer = () => {
        const invisibleCols = defaultCols.filter((col) => col.visible === false).map((col) => col.id)
        const currentVisibleCols = loadFromLocalStorageSheet('profit_report_a', []).map(
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
                saveToLocalStorageSheet('profit_report_a', newCols)
                return newCols
            })
            setHiddenColumns((prevHidden) => {
                const newHidden = prevHidden.filter((id) => id !== columnId)
                saveToLocalStorageSheet('profit_report_h', newHidden)
                return newHidden
            })
        } else {
            setCols((prevCols) => {
                const newCols = prevCols.filter((col) => col.id !== columnId)
                saveToLocalStorageSheet('profit_report_a', newCols)
                return newCols
            })
            setHiddenColumns((prevHidden) => {
                const newHidden = [...prevHidden, columnId]
                saveToLocalStorageSheet('profit_report_h', newHidden)
                return newHidden
            })
        }
    }

    return (
        <div className="w-full gap-1 h-full flex items-center justify-center">
            <div className="w-full h-full flex flex-col  bg-white  overflow-hidden ">
                <h2 className="text-[10px]  text-blue-600 border-b font-medium flex items-center gap-2 p-1  uppercase">
                    {t('800000191')}
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
                    highlightRegions={highlightRegions}
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

export default ProfitReportTable
