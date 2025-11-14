import { useEffect, useState, useCallback, useMemo, useRef } from 'react'
import { DataEditor, GridCellKind } from '@glideapps/glide-data-grid'
import { TableOutlined } from '@ant-design/icons'
import { useLayer } from 'react-laag'
import LayoutMenuSheet from '../../../sheet/jsx/layoutMenu'
import LayoutStatusMenuSheet from '../../../sheet/jsx/layoutStatusMenu'
import { Drawer, Checkbox, message } from 'antd'
import { saveToLocalStorageSheet } from '../../../../../localStorage/sheet/sheet'
import { loadFromLocalStorageSheet } from '../../../../../localStorage/sheet/sheet'
import { reorderColumns } from '../../../sheet/js/reorderColumns'
import useOnFill from '../../../hooks/sheet/onFillHook'
import {
    useExtraCells,
} from "@glideapps/glide-data-grid-cells";

import { Search, Save, Scissors, Upload, FolderOpen, FolderSync } from 'lucide-react'
import { updateIndexNo } from '../../../sheet/js/updateIndexNo'
import RecManage02Query from '../../../query/hrRecruit/recMana/RecManage02Query'
function TableRecManage02({
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
    dataNaWare,
    handleRestSheet,
    canEdit,
    handleSearchData,
    formData,
    setFormData,
    toDate,
    setToDate,
    setKeyItem3,
    setKeyItem2,
    keyItem3,
    keyItem2,
    handleSyncDataSheet
}) {
    const gridRef = useRef(null)
    const [open, setOpen] = useState(false)
    const cellProps = useExtraCells();
    const onFill = useOnFill(setGridData, cols);
    const onSearchClose = useCallback(() => setShowSearch(false), [])
    const [showMenu, setShowMenu] = useState(null)


    const [hiddenColumns, setHiddenColumns] = useState(() => {
        return loadFromLocalStorageSheet('rec_manage_02_h', [])
    })
    const [hoverRow, setHoverRow] = useState(undefined)


    const onItemHovered = useCallback((args) => {
        const [_, row] = args.location
        setHoverRow(args.kind !== 'cell' ? undefined : row)
    }, [])

    const onHeaderMenuClick = useCallback((col, bounds) => {
        if (cols[col]?.id === 'Status') {
            setShowMenu({
                col,
                bounds,
                menuType: 'statusMenu',
            })
        } else {
            setShowMenu({
                col,
                bounds,
                menuType: 'defaultMenu',
            })
        }
    }, [])


    const [keybindings, setKeybindings] = useState({
        downFill: true,
        rightFill: true,
        selectColumn: false,
    })

    const getData = useCallback(
        ([col, row]) => {
            const person = gridData[row] || {}
            const column = cols[col]
            const columnKey = column?.id || ''
            const value = person[columnKey] || ''
            if (columnKey === 'DefineKey') {
                return {
                    kind: GridCellKind.Number,
                    data: value,
                    displayData: String(value),
                    readonly: column?.readonly || false,
                    allowOverlay: true,
                    hasMenu: column?.hasMenu || false,
                    visible: true
                }
            }


            return {
                kind: GridCellKind.Text,
                data: value,
                copyData: String(value),
                displayData: String(value),
                readonly: column?.readonly || false,
                allowOverlay: true,
                hasMenu: column?.hasMenu || false,
                isEditing: true,
            }
        },
        [gridData, cols, dataNaWare],
    )

    const onKeyUp = useCallback(
        (event) => {
            if (event.key === 'Backspace') {
                const [col, row] = event.location

                setGridData((prev) => {
                    const newData = [...prev]
                    if (newData[row]) {
                        const column = cols[col - 1]
                    }
                    return newData
                })
            }
        },
        [cols, gridData],
    )

    const onColumnResize = useCallback(
        (column, newSize) => {
            const index = cols.indexOf(column)
            if (index !== -1) {
                const newCol = {
                    ...column,
                    width: newSize,
                }
                const newCols = [...cols]
                newCols.splice(index, 1, newCol)
                setCols(newCols)
            }
        },
        [cols],
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
                width: showMenu?.bounds.width ?? 0,
            }),
        },
        placement: 'bottom-start',
        auto: true,
        possiblePlacements: ['bottom-start', 'bottom-end'],
    })

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
            saveToLocalStorageSheet('rec_manage_02_h', newHidden)
            return newHidden
        })
    }

    const updateVisibleColumns = (newVisibleColumns) => {
        setCols((prevCols) => {
            const newCols = [...new Set([...prevCols, ...newVisibleColumns])]
            const uniqueCols = newCols.filter(
                (col, index, self) => index === self.findIndex((c) => c.id === col.id),
            )
            saveToLocalStorageSheet('rec_manage_02_a', uniqueCols)
            return uniqueCols
        })
    }

    // Hàm ẩn cột
    const handleHideColumn = (colIndex) => {
        const columnId = cols[colIndex]?.id
        if (cols.length > 1) {
            updateHiddenColumns([columnId])
            setCols((prevCols) => {
                const newCols = prevCols.filter((_, idx) => idx !== colIndex)
                const uniqueCols = newCols.filter(
                    (col, index, self) =>
                        index === self.findIndex((c) => c.id === col.id),
                )
                saveToLocalStorageSheet('rec_manage_02_a', uniqueCols)
                return uniqueCols
            })
            setShowMenu(null)
        }
    }
    // Hàm rEST LẤY LẠI CỘT DỮ LIỆU

    const handleReset = () => {
        setCols(defaultCols.filter((col) => col.visible))
        setHiddenColumns([])
        localStorage.removeItem('rec_manage_02_a')
        localStorage.removeItem('rec_manage_02_h')
        setShowMenu(null)
    }

    const onColumnMoved = useCallback((startIndex, endIndex) => {
        setCols((prevCols) => {
            const updatedCols = [...prevCols]
            const [movedColumn] = updatedCols.splice(startIndex, 1)
            updatedCols.splice(endIndex, 0, movedColumn)
            saveToLocalStorageSheet('rec_manage_02_a', updatedCols)
            return updatedCols
        })
    }, [])

    const showDrawer = () => {
        const invisibleCols = defaultCols
            .filter((col) => col.visible === false)
            .map((col) => col.id)
        const currentVisibleCols = loadFromLocalStorageSheet(
            'rec_manage_02_a',
            [],
        ).map((col) => col.id)
        const newInvisibleCols = invisibleCols.filter(
            (col) => !currentVisibleCols.includes(col),
        )
        updateHiddenColumns(newInvisibleCols)
        updateVisibleColumns(
            defaultCols.filter(
                (col) => col.visible && !hiddenColumns.includes(col.id),
            ),
        )
        setOpen(true)
        setShowMenu(null)
    }
    const onClose = () => {
        setOpen(false)
    }

    const handleCheckboxChange = (columnId, isChecked) => {
        if (isChecked) {
            const restoredColumn = defaultCols.find((col) => col.id === columnId)
            setCols((prevCols) => {
                const newCols = [...prevCols, restoredColumn]
                saveToLocalStorageSheet('rec_manage_02_a', newCols)
                return newCols
            })
            setHiddenColumns((prevHidden) => {
                const newHidden = prevHidden.filter((id) => id !== columnId)
                saveToLocalStorageSheet('rec_manage_02_h', newHidden)
                return newHidden
            })
        } else {
            setCols((prevCols) => {
                const newCols = prevCols.filter((col) => col.id !== columnId)
                saveToLocalStorageSheet('rec_manage_02_a', newCols)
                return newCols
            })
            setHiddenColumns((prevHidden) => {
                const newHidden = [...prevHidden, columnId]
                saveToLocalStorageSheet('rec_manage_02_h', newHidden)
                return newHidden
            })
        }
    }

    return (
        <div className="w-full  h-full flex items-center justify-center  border-r">
            <div className="w-full h-full flex flex-col  bg-white  overflow-hidden ">
                <div className="flex items-center gap-3 p-1 border-b">
                    <button onClick={handleSearchData} className="flex items-center uppercase gap-1 px-2 py-1 text-xs hover:bg-gray-100 rounded">
                        <Search size={14} />
                        Search
                    </button>
                    <button onClick={handleSyncDataSheet} className="flex items-center uppercase  gap-1 px-2 py-1 text-xs hover:bg-gray-100 rounded">
                        <FolderSync size={14} />
                        ĐỒNG BỘ DỮ LIỆU
                    </button>

                </div>
                <RecManage02Query formData={formData}
                    setFormData={setFormData}
                    toDate={toDate}
                    setToDate={setToDate}

                    setKeyItem3={setKeyItem3}
                    setKeyItem2={setKeyItem2}
                    keyItem2={keyItem2}
                    keyItem3={keyItem3}
                />
                <h2 className="text-[10px] border-b border-t font-medium flex items-center gap-2 p-1  uppercase">
                    DANH SÁCH ỨNG VIÊN TUYỂN DỤNG
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
                    width="100%"
                    height="100%"
                    rowMarkers={('checkbox-visible', 'both')}
                    freezeTrailingRows={0}
                    rowHeight={25}
                    gridSelection={selection}
                    onGridSelectionChange={setSelection}
                    getCellsForSelection={true}
                    trailingRowOptions={{
                        hint: ' ',
                        sticky: true,
                        tint: true,
                    }}
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
                    overscrollY={0}
                    overscrollX={50}
                    smoothScrollX={true}
                    smoothScrollY={true}
                    onPaste={true}
                    fillHandle={true}
                    keybindings={keybindings}
                    isDraggable={false}
                    onColumnResize={onColumnResize}
                    onHeaderMenuClick={onHeaderMenuClick}
                    onColumnMoved={onColumnMoved}
                    onKeyUp={onKeyUp}
                    onItemHovered={onItemHovered}
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
                                    data={gridData}
                                    handleRowAppend={handleRowAppend}
                                    handleRestSheet={handleRestSheet}
                                    handleSort={handleSort}
                                    cols={cols}
                                    renderLayer={renderLayer}
                                    setShowSearch={setShowSearch}
                                    setShowMenu={setShowMenu}
                                    layerProps={layerProps}
                                    handleReset={handleReset}
                                    showDrawer={showDrawer}
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
                        </div>,
                    )}
                <Drawer title="CÀI ĐẶT SHEET" onClose={onClose} open={open}>
                    {defaultCols.map(
                        (col) =>
                            col.id !== 'Status' && (
                                <div key={col.id} style={{ marginBottom: '10px' }}>
                                    <Checkbox
                                        checked={!hiddenColumns.includes(col.id)}
                                        onChange={(e) =>
                                            handleCheckboxChange(col.id, e.target.checked)
                                        }
                                    >
                                        {col.title}
                                    </Checkbox>
                                </div>
                            ),
                    )}
                </Drawer>
            </div>
        </div>
    )
}

export default TableRecManage02