import { useEffect, useState, useCallback, useMemo, useRef } from 'react'
import { DataEditor, GridCellKind } from '@glideapps/glide-data-grid'
import '@glideapps/glide-data-grid/dist/index.css'
import { useLayer } from 'react-laag'
import { Upload } from 'antd'
import LayoutMenuSheet from '../../sheet/jsx/layoutMenu'
import LayoutStatusMenuSheet from '../../sheet/jsx/layoutStatusMenu'
import { Drawer, Checkbox, message } from 'antd'
import { saveToLocalStorageSheet } from '../../../../localStorage/sheet/sheet'
import { loadFromLocalStorageSheet } from '../../../../localStorage/sheet/sheet'
import { reorderColumns } from '../../sheet/js/reorderColumns'
import useOnFill from '../../hooks/sheet/onFillHook'
import { useExtraCells } from '@glideapps/glide-data-grid-cells'
import { updateIndexNo } from '../../sheet/js/updateIndexNo'
import { HOST_API_SERVER_14 } from '../../../../services';
import { PostDocuments } from '../../../../features/upload/postDocuments'
import {
    UploadCloud,
    Trash2,
    FolderOpen,
    Download
} from 'lucide-react';

import moment from 'moment'
import { useTranslation } from 'react-i18next'
function Emp15Table({
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
    handleRestSheet, canEdit,
    dataSheetSearch,
    setNumRows
}) {
    const { t } = useTranslation()
    const gridRef = useRef(null)
    const [open, setOpen] = useState(false)
    const cellProps = useExtraCells()
    const onFill = useOnFill(setGridData, cols)
    const onSearchClose = useCallback(() => setShowSearch(false), [])
    const [showMenu, setShowMenu] = useState(null)
    const [hoverRow, setHoverRow] = useState(null);
    const [loading, setLoading] = useState(false);
    const onItemHovered = useCallback((args) => {
        const [_, row] = args.location
        setHoverRow(args.kind !== 'cell' ? undefined : row)
    }, [])
    const [hiddenColumns, setHiddenColumns] = useState(() => {
        return loadFromLocalStorageSheet('emp_15_h', [])
    })
    const [file, setFile] = useState(null);



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

    const columnNames = []
    const highlightRegions = columnNames.map(columnName => ({
        color: '#F0F2F5',
        range: {
            x: reorderColumns(cols).indexOf(columnName),
            y: 0,
            width: 1,
            height: numRows,
        },
    }));
    const [keybindings, setKeybindings] = useState({
        downFill: true,
        rightFill: true,
        selectColumn: false
    })
    const getData = useCallback(
        ([col, row]) => {
            const person = gridData[row] || {}
            const column = cols[col]
            const columnKey = column?.id || ''
            const value = person[columnKey] || ''

            const cellConfig = {


            }



            if (cellConfig[columnKey]) {
                return {
                    kind: GridCellKind.Custom,
                    allowOverlay: true,
                    copyData: String(value),
                    data: {
                        kind: cellConfig[columnKey].kind,
                        allowedValues: cellConfig[columnKey].allowedValues,
                        setCacheData: cellConfig[columnKey].setCacheData,
                        value: value,
                    },
                    displayData: String(value),
                    readonly: column?.readonly || false,
                    hasMenu: column?.hasMenu || false,
                }
            }


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
            return {
                kind: GridCellKind.Text,
                data: value,
                displayData: String(value),
                readonly: column?.readonly || false,
                allowOverlay: true,
                hasMenu: column?.hasMenu || false
            }
        },
        [gridData, cols]
    )

    const onCellClicked = useCallback(
        (cell, event) => {
            const indexes = reorderColumns(cols)
        },
        [cols, gridData]
    )

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
            saveToLocalStorageSheet('emp_15_h', newHidden)
            return newHidden
        })
    }

    const updateVisibleColumns = (newVisibleColumns) => {
        setCols((prevCols) => {
            const newCols = [...new Set([...prevCols, ...newVisibleColumns])]
            const uniqueCols = newCols.filter(
                (col, index, self) => index === self.findIndex((c) => c.id === col.id)
            )
            saveToLocalStorageSheet('emp_15_a', uniqueCols)
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
                saveToLocalStorageSheet('emp_15_a', uniqueCols)
                return uniqueCols
            })
            setShowMenu(null)
        }
    }


    const handleReset = () => {
        setCols(defaultCols.filter((col) => col.visible))
        setHiddenColumns([])
        localStorage.removeItem('emp_15_a')
        localStorage.removeItem('emp_15_h')
    }

    const onColumnMoved = useCallback((startIndex, endIndex) => {
        setCols((prevCols) => {
            const updatedCols = [...prevCols]
            const [movedColumn] = updatedCols.splice(startIndex, 1)
            updatedCols.splice(endIndex, 0, movedColumn)
            saveToLocalStorageSheet('emp_15_a', updatedCols)
            return updatedCols
        })
    }, [])

    const showDrawer = () => {
        const invisibleCols = defaultCols.filter((col) => col.visible === false).map((col) => col.id)
        const currentVisibleCols = loadFromLocalStorageSheet('emp_15_a', []).map(
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
                saveToLocalStorageSheet('emp_15_a', newCols)
                return newCols
            })
            setHiddenColumns((prevHidden) => {
                const newHidden = prevHidden.filter((id) => id !== columnId)
                saveToLocalStorageSheet('emp_15_h', newHidden)
                return newHidden
            })
        } else {
            setCols((prevCols) => {
                const newCols = prevCols.filter((col) => col.id !== columnId)
                saveToLocalStorageSheet('emp_15_a', newCols)
                return newCols
            })
            setHiddenColumns((prevHidden) => {
                const newHidden = [...prevHidden, columnId]
                saveToLocalStorageSheet('emp_15_h', newHidden)
                return newHidden
            })
        }
    }
    const onCellEdited = useCallback(

        async (cell, newValue) => {
            if (canEdit === false) {

                return
            }

            if (
                newValue.kind !== GridCellKind.Text &&
                newValue.kind !== GridCellKind.Custom &&
                newValue.kind !== GridCellKind.Number
            ) {

                return
            }
            const indexes = reorderColumns(cols)
            const [col, row] = cell
            const key = indexes[col]



            setGridData((prevData) => {
                const updatedData = [...prevData]
                if (!updatedData[row]) updatedData[row] = {}

                const currentStatus = updatedData[row]['Status'] || ''
                updatedData[row][key] = newValue.data
                updatedData[row]['Status'] = currentStatus === 'A' ? 'A' : 'U'



                return updatedData
            })
        },
        [cols, gridData]
    )

    const handleFileChange = async (file) => {
        if (dataSheetSearch.length === 0) {
            return message.error('Vui lòng chọn nhân viên trước khi tải ảnh lên!');
        }
        const formData = new FormData();
        formData.append('file', file);
        formData.append('Type', 'FILE');

        setLoading(true);
        const result = await PostDocuments(formData, dataSheetSearch[0]?.EmpSeq);
        setLoading(false);

        if (result.success) {
            message.success('Tải ảnh thành công!');
            if (Array.isArray(result.data)) {
                setGridData(prev => [...prev, ...result.data]);
                setNumRows(prev => prev + result.data.length);
            }
        } else {
            message.error(result.message || 'Tải ảnh thất bại!');
        }

        return false;
    };
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
                console.error('Lỗi tải file:', err);
                message.error(`Tải file ${filename} thất bại!`);
            });
    };

    const handelOpenDownload = () => {
        const selectedFiles = getSelectedRows(selection, gridData);
        if (dataSheetSearch.length === 0) {
            return message.error('Vui lòng chọn nhân viên trước khi tải ảnh lên!');
        }
        if (!selectedFiles || selectedFiles.length === 0) {
            return message.warning('Vui lòng chọn ít nhất một file để tải xuống');
        }

        selectedFiles.forEach(file => {
            if (!file.Path) return;

            const relativePath = file.Path.replace('/ERP_CLOUD/user_files/', '');

            const fileUrl = `${HOST_API_SERVER_14}/${relativePath}`;

            downloadFileFromUrl(fileUrl, file.Originalname || file.Name);
        });
    };
    const handleOpenFiles = () => {
        const selectedFiles = getSelectedRows(selection, gridData);
        if (dataSheetSearch.length === 0) {
            return message.error('Vui lòng chọn nhân viên trước khi tải ảnh lên!');
        }
        if (!selectedFiles || selectedFiles.length === 0) {
            return message.warning('Vui lòng chọn ít nhất một file để mở');
        }

        selectedFiles.forEach(file => {
            if (!file.Path) return;

            const relativePath = file.Path.replace('/ERP_CLOUD/user_files/', '');
            const fileUrl = `${HOST_API_SERVER_14}/${relativePath}`;

            window.open(fileUrl, '_blank', 'noopener,noreferrer');
        });
    };

    return (
        <div className="w-full gap-1 h-full flex items-center justify-center">
            <div className="w-full h-full flex flex-col  bg-white  overflow-hidden ">
                <h2 className="text-[10px]  text-blue-600 border-b font-medium flex items-center gap-2 p-2  uppercase">
                    QUẢN LÝ TỆP TIN CÁ NHÂN
                </h2>
                <div className="flex items-center gap-3 p-1 border-b">

                    <Upload showUploadList={false} beforeUpload={handleFileChange}>
                        <button className="flex items-center gap-1 px-2 py-2 text-emerald-600 text-xs hover:bg-emerald-50 rounded">
                            <UploadCloud size={14} />
                            {t('Tải lên')}
                        </button>
                    </Upload>
                    <button onClick={handleOpenFiles} className="flex items-center gap-1 px-2 py-2 text-indigo-600 text-xs hover:bg-indigo-50 rounded">
                        <FolderOpen size={14} />
                        {t('Mở')}
                    </button>

                    <button onClick={handelOpenDownload} className="flex items-center gap-1 px-2 py-2 text-blue-600 text-xs hover:bg-blue-50 rounded">
                        <Download size={14} />
                        {t('Tải xuống')}
                    </button>
                </div>

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
                    trailingRowOptions={{
                        hint: ' ',
                        sticky: true,
                        tint: true
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
                    onItemHovered={onItemHovered}
                    overscrollY={0}
                    overscrollX={0}
                    freezeTrailingRows={0}
                    rowHeight={25}
                    smoothScrollY={true}
                    smoothScrollX={true}
                    onPaste={true}
                    fillHandle={true}
                    keybindings={keybindings}
                    onCellClicked={onCellClicked}
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

                                    handleRestSheet={handleRestSheet}
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

export default Emp15Table
