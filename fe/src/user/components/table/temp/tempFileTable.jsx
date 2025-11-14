import { useEffect, useState, useCallback, useMemo, useRef } from 'react'
import { DataEditor, GridCellKind } from '@glideapps/glide-data-grid'
import { TableOutlined } from '@ant-design/icons'
import { useLayer } from 'react-laag'
import LayoutMenuSheet from '../../sheet/jsx/layoutMenu'
import LayoutStatusMenuSheet from '../../sheet/jsx/layoutStatusMenu'
import { Drawer, Checkbox, message } from 'antd'
import { saveToLocalStorageSheet } from '../../../../localStorage/sheet/sheet'
import { loadFromLocalStorageSheet } from '../../../../localStorage/sheet/sheet'
import { reorderColumns } from '../../sheet/js/reorderColumns'
import useOnFill from '../../hooks/sheet/onFillHook'
import {
    useExtraCells,
} from "@glideapps/glide-data-grid-cells";
import { Search, Save, Scissors, Upload, FolderOpen, Download } from 'lucide-react'
import { updateIndexNo } from '../../sheet/js/updateIndexNo'
import { HOST_API_SERVER_13 } from '../../../../services'
import { HandleError } from '../../../page/default/handleError'
function TempFileTable({
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
    dataType,

    handleSaveDataItem,
    handleUpload,
    triggerFileInput,
    fileInputRef,
    handSearch,
    handleDeleteDataSheetItem
}) {
    const gridRef = useRef(null)
    const [open, setOpen] = useState(false)
    const cellProps = useExtraCells();
    const onFill = useOnFill(setGridData, cols);
    const onSearchClose = useCallback(() => setShowSearch(false), [])
    const [showMenu, setShowMenu] = useState(null)


    const [hiddenColumns, setHiddenColumns] = useState(() => {
        return loadFromLocalStorageSheet('temp_file_a_h', [])
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

    const highlightRegions = [
        {
            color: '#e8f0ff',
            range: {
                x: reorderColumns(cols).indexOf('ItemName'),
                y: 0,
                width: 1,
                height: numRows,
            },
        },
    ]
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

            if (columnKey === 'Size') {
                const bytes = value
                let formattedValue = ''
                let displayValue = ''

                if (bytes < 1024) {
                    formattedValue = new Intl.NumberFormat('en-US', {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                    }).format(bytes)
                    displayValue = formattedValue + ' B'
                } else if (bytes < 1048576) {
                    const kb = (bytes / 1024).toFixed(2)
                    formattedValue = new Intl.NumberFormat('en-US', {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 2,
                    }).format(kb)
                    displayValue = formattedValue + ' KB'
                } else {
                    const mb = (bytes / 1048576).toFixed(2)
                    formattedValue = new Intl.NumberFormat('en-US', {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 2,
                    }).format(mb)
                    displayValue = formattedValue + ' MB'
                }

                return {
                    kind: GridCellKind.Number,
                    data: value,
                    copyData: formattedValue === '0' ? '' : String(value),
                    displayData: formattedValue === '0' ? '' : displayValue,
                    readonly: column?.readonly || false,
                    allowOverlay: true,
                    hasMenu: column?.hasMenu || false,
                }
            }
            if (
                columnKey === 'IsActive'

            ) {
                const booleanValue =
                    value === 1 || value === '1'
                        ? true
                        : value === 0 || value === '0'
                            ? false
                            : Boolean(value);
                return {
                    kind: GridCellKind.Boolean,
                    data: booleanValue,
                    allowOverlay: true,
                    hasMenu: column?.hasMenu || false,
                };
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

    const [lastClickedCell, setLastClickedCell] = useState(null)

    const onCellEdited = useCallback(
        async (cell, newValue) => {

            if (dataType[0].IdSeq === "") {
                return;
            }
            if (canEdit === false) {
                message.warning('Bạn không có quyền chỉnh sửa dữ liệu')
                return
            }
            if (
                newValue.kind !== GridCellKind.Text &&
                newValue.kind !== GridCellKind.Custom &&
                newValue.kind !== GridCellKind.Boolean &&
                newValue.kind !== GridCellKind.Number
            ) {
                return
            }

            const indexes = reorderColumns(cols)
            const [col, row] = cell
            const key = indexes[col]

            if (
                key === 'IdSeq'

            ) {
                return
            }

            setGridData((prevData) => {
                const updatedData = [...prevData]
                if (!updatedData[row]) updatedData[row] = {}

                const currentStatus = updatedData[row]['Status'] || ''

                updatedData[row][key] = newValue.data
                updatedData[row]['Status'] = currentStatus === 'A' ? 'A' : 'U'
                updatedData[row]['IdxNo'] = row + 1
                if (key === 'DefineItemName' || key === 'IsActive') {
                    const value = newValue.data;
                    if (value !== '') {
                        updatedData[row]['DefineSeq'] = dataType[0]?.IdSeq || '';
                    } else {
                        updatedData[row]['DefineSeq'] = '';
                    }
                }



                return updatedData
            })
        },
        [canEdit, cols, gridData, dataType],
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
            saveToLocalStorageSheet('temp_file_a_h', newHidden)
            return newHidden
        })
    }

    const updateVisibleColumns = (newVisibleColumns) => {
        setCols((prevCols) => {
            const newCols = [...new Set([...prevCols, ...newVisibleColumns])]
            const uniqueCols = newCols.filter(
                (col, index, self) => index === self.findIndex((c) => c.id === col.id),
            )
            saveToLocalStorageSheet('temp_file_a', uniqueCols)
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
                saveToLocalStorageSheet('temp_file_a', uniqueCols)
                return uniqueCols
            })
            setShowMenu(null)
        }
    }
    // Hàm rEST LẤY LẠI CỘT DỮ LIỆU

    const handleReset = () => {
        setCols(defaultCols.filter((col) => col.visible))
        setHiddenColumns([])
        localStorage.removeItem('temp_file_a')
        localStorage.removeItem('temp_file_a_h')
        setShowMenu(null)
    }

    const onColumnMoved = useCallback((startIndex, endIndex) => {
        setCols((prevCols) => {
            const updatedCols = [...prevCols]
            const [movedColumn] = updatedCols.splice(startIndex, 1)
            updatedCols.splice(endIndex, 0, movedColumn)
            saveToLocalStorageSheet('temp_file_a', updatedCols)
            return updatedCols
        })
    }, [])

    const showDrawer = () => {
        const invisibleCols = defaultCols
            .filter((col) => col.visible === false)
            .map((col) => col.id)
        const currentVisibleCols = loadFromLocalStorageSheet(
            'temp_file_a',
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
                saveToLocalStorageSheet('temp_file_a', newCols)
                return newCols
            })
            setHiddenColumns((prevHidden) => {
                const newHidden = prevHidden.filter((id) => id !== columnId)
                saveToLocalStorageSheet('temp_file_a_h', newHidden)
                return newHidden
            })
        } else {
            setCols((prevCols) => {
                const newCols = prevCols.filter((col) => col.id !== columnId)
                saveToLocalStorageSheet('temp_file_a', newCols)
                return newCols
            })
            setHiddenColumns((prevHidden) => {
                const newHidden = [...prevHidden, columnId]
                saveToLocalStorageSheet('temp_file_a_h', newHidden)
                return newHidden
            })
        }
    }
    const getSelectedRows = (selection, gridData) => {
        return selection?.rows?.items?.flatMap(([start, end]) =>
            Array.from({ length: end - start }, (_, i) => gridData[start + i]).filter(Boolean)
        ) || [];
    };
    const downloadFileFromUrl = (url, filename) => {
        fetch(url)
            .then(response => {
                if (!response.ok) throw new Error('Không tải được file');
                return response.blob();
            })
            .then(blob => {
                const urlBlob = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = urlBlob;
                a.download = filename || 'file';
                document.body.appendChild(a);
                a.click();
                a.remove();
                window.URL.revokeObjectURL(urlBlob);
            })
            .catch(err => {
                HandleError([
                    {
                        success: false,
                        message: `Tải file ${filename} thất bại!`,
                    },
                ]);
            });
    };

    const handelOpenDownload = () => {
        const selectedFiles = getSelectedRows(selection, gridData);

        if (!selectedFiles || selectedFiles.length === 0) {
            return;
        }

        selectedFiles.forEach(file => {
            if (!file.Path) return;

            const relativePath = file.Path.replace('D:/storage_erp/', '');

            const fileUrl = `${HOST_API_SERVER_13}/secure-file/${relativePath}`;

            downloadFileFromUrl(fileUrl, file.OriginalName);
        });
    };

 /*    const handleOpenFiles = () => {
        const selectedFiles = getSelectedRows(selection, gridData);


        if (!selectedFiles || selectedFiles.length === 0) {
            return;
        }

        selectedFiles.forEach(file => {
            if (!file.Path) return;

            const relativePath = file.Path.replace('D:/storage_erp/', '');

            const fileUrl = `${HOST_API_SERVER_13}/${relativePath}`;

            const isElectron = !!window?.electron?.openPDFWindow;

            isElectron
                ? window.electron.openPDFWindow(fileUrl)
                : window.open(pdfUrl, '_blank');
        });
    };
 */
    return (
        <div className="w-full  h-full flex items-center justify-center  border-l">
            <div className="w-full h-full flex flex-col  bg-white  overflow-hidden ">
                <div className="flex items-center gap-3 p-1 border-b">
                    <button onClick={handSearch} className="flex items-center uppercase gap-1 px-2 py-1 text-xs hover:bg-gray-100 rounded">
                        <Search size={14} />
                        Search
                    </button>
                    <button onClick={handleSaveDataItem} className="flex items-center uppercase  gap-1 px-2 py-1 text-xs hover:bg-gray-100 rounded">
                        <Save size={14} />
                        Save
                    </button>
                    <button onClick={handleDeleteDataSheetItem} className="flex items-center uppercase gap-1 px-2 py-1 text-xs hover:bg-gray-100 rounded">
                        <Scissors size={14} />
                        Xóa
                    </button>
                    <button onClick={triggerFileInput} className="flex items-center uppercase  gap-1 px-2 py-1 text-xs hover:bg-gray-100 rounded">
                        <Upload size={14} />
                        Upload File
                    </button>
                    <button onClick={handelOpenDownload} className="flex items-center uppercase  gap-1 px-2 py-1 text-xs hover:bg-gray-100 rounded">
                        <Download size={14} />
                        Tải File
                    </button>
                    {/* <button onClick={handleOpenFiles} className="flex items-center uppercase  gap-1 px-2 py-1 text-xs hover:bg-gray-100 rounded">
                        <FolderOpen size={14} />
                        OPEN FILE
                    </button> */}
                </div>
                <h2 className="text-[10px] border-b  font-medium flex items-center gap-2 p-1  uppercase">
                    DANH SÁCH FILE
                </h2>
                <input
                    type="file"
                    multiple
                    style={{ display: 'none' }}
                    ref={fileInputRef}
                    onChange={handleUpload}
                />
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
                    className=" rounded-r-lg"
                    height="100%"
                    rowSelect="multi"

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
                    freezeTrailingRows={0}
                    rowHeight={25}
                    onPaste={true}
                    fillHandle={true}
                    keybindings={keybindings}
                    isDraggable={false}
                    onCellEdited={onCellEdited}
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

export default TempFileTable