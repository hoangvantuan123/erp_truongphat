import { useEffect, useState, useCallback, useMemo, useRef } from 'react'
import { DataEditor, GridCellKind } from '@glideapps/glide-data-grid'
import '@glideapps/glide-data-grid/dist/index.css'
import { useLayer } from 'react-laag'
import LayoutMenuSheet from '../../sheet/jsx/layoutMenu'
import LayoutStatusMenuSheet from '../../sheet/jsx/layoutStatusMenu'
import { Drawer, Checkbox, message } from 'antd'
import { saveToLocalStorageSheet } from '../../../../localStorage/sheet/sheet'
import { loadFromLocalStorageSheet } from '../../../../localStorage/sheet/sheet'
import { reorderColumns } from '../../sheet/js/reorderColumns'
import useOnFill from '../../hooks/sheet/onFillHook'
import { useExtraCells } from '@glideapps/glide-data-grid-cells'
import { updateIndexNo } from '../../sheet/js/updateIndexNo'
import moment from 'moment'
import { CellsUMMilSrvName } from '../../sheet/cells/cellUMMilSrvName'
import { CellsUMMilRsrcName } from '../../sheet/cells/cellUMMilRsrcName'
import { CellsUMMilKindName } from '../../sheet/cells/cellUMMilKindName'
import { CellsUMMilBrnchName } from '../../sheet/cells/cellUMMilBrnchName'
import { CellsUMMilClsName } from '../../sheet/cells/cellUMMilClsName'
import { CellsUMMilSpcName } from '../../sheet/cells/cellUMMilSpcName'
import { CellsUMMilRnkName } from '../../sheet/cells/cellUMMilRnkName'
import { CellsUMMilDschrgTypeName } from '../../sheet/cells/cellUMMilDschrgTypeName'
import { CellsUMMilVetTypeName } from '../../sheet/cells/cellUMMilVetTypeName'
import { CellsUMMilExTypeName } from '../../sheet/cells/cellUMMilExTypeName'

function Emp5Table({
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
    handleRestSheet,
    canEdit,


    helpData36,
    helpData37,
    helpData38,
    helpData39,
    helpData40,
    helpData41,
    helpData42,
    helpData43,
    helpData44,
    helpData45,

    setHelpData36,
    setHelpData37,
    setHelpData38,
    setHelpData39,
    setHelpData40,
    setHelpData41,
    setHelpData42,
    setHelpData43,
    setHelpData44,
    setHelpData45


}) {
    const gridRef = useRef(null)
    const [open, setOpen] = useState(false)
    const cellProps = useExtraCells()
    const onFill = useOnFill(setGridData, cols)
    const onSearchClose = useCallback(() => setShowSearch(false), [])
    const [showMenu, setShowMenu] = useState(null)
    const [hoverRow, setHoverRow] = useState(null);
    const onItemHovered = useCallback((args) => {
        const [_, row] = args.location
        setHoverRow(args.kind !== 'cell' ? undefined : row)
    }, [])
    const [hiddenColumns, setHiddenColumns] = useState(() => {
        return loadFromLocalStorageSheet('emp_05_h', [])
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

    const uniqueColumnNames = [...new Set([
    ])];

    const highlightRegions = [
        'UMMilSrvName',
        'UMMilRsrcName',
        'UMMilKindName',
        'UMMilBrnchName',
        'UMMilClsName',
        'UMMilSpcName',
        'UMMilRnkName',
        'UMMilDschrgTypeName',
        'UMMilVetTypeName',
        'UMMilExTypeName'
    ].map(columnName => ({
        color: '#E6F4FF',
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
    const getData = useCallback(
        ([col, row]) => {
            const person = gridData[row] || {}
            const column = cols[col]
            const columnKey = column?.id || ''
            const value = person[columnKey] || ''

            const cellConfig = {
                UMMilSrvName: {
                    kind: 'cell-UMMilSrvName',
                    allowedValues: helpData45,
                    setCacheData: setHelpData45,
                },
                UMMilRsrcName: {
                    kind: 'cell-UMMilRsrcName',
                    allowedValues: helpData44,
                    setCacheData: setHelpData44,
                },
                UMMilKindName: {
                    kind: 'cell-UMMilKindName',
                    allowedValues: helpData36,
                    setCacheData: setHelpData36,
                },
                UMMilBrnchName: {
                    kind: 'cell-UMMilBrnchName',
                    allowedValues: helpData37,
                    setCacheData: setHelpData37,
                },
                UMMilClsName: {
                    kind: 'cell-UMMilClsName',
                    allowedValues: helpData38,
                    setCacheData: setHelpData38,
                },
                UMMilSpcName: {
                    kind: 'cell-UMMilSpcName',
                    allowedValues: helpData39,
                    setCacheData: setHelpData39,
                },
                UMMilRnkName: {
                    kind: 'cell-UMMilRnkName',
                    allowedValues: helpData40,
                    setCacheData: setHelpData40,
                },
                UMMilDschrgTypeName: {
                    kind: 'cell-UMMilDschrgTypeName',
                    allowedValues: helpData41,
                    setCacheData: setHelpData41,
                },
                UMMilVetTypeName: {
                    kind: 'cell-UMMilVetTypeName',
                    allowedValues: helpData42,
                    setCacheData: setHelpData42,
                },
                UMMilExTypeName: {
                    kind: 'cell-UMMilExTypeName',
                    allowedValues: helpData43,
                    setCacheData: setHelpData43,
                },
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
            if (columnKey === 'MilExEndDate' || columnKey === "MilEnrolDate" || columnKey === "MilTransDate") {
                let displayValue = ''
                let dataValue = value

                const parseFlexibleDate = (val) => {
                    if (!val || typeof val !== 'string') return null;

                    const cleaned = val.replace(/[^\d]/g, '');

                    if (cleaned.length === 8) {
                        return moment(cleaned, 'YYYYMMDD', true);
                    }

                    if (cleaned.length === 6) {
                        return moment(cleaned + '01', 'YYYYMMDD', true);
                    }

                    if (cleaned.length === 4) {
                        const year = new Date().getFullYear();
                        return moment(`${year}${cleaned}`, 'YYYYMMDD', true);
                    }

                    if (cleaned.length === 2) {
                        const now = new Date();
                        const year = now.getFullYear();
                        const month = (now.getMonth() + 1).toString().padStart(2, '0');
                        return moment(`${year}${month}${cleaned}`, 'YYYYMMDD', true);
                    }

                    return null;
                };

                const parsed = parseFlexibleDate(value);

                if (parsed && parsed.isValid()) {
                    displayValue = parsed.format("YYYY-MM-DD");
                    dataValue = parsed.format("YYYYMMDD");
                } else {
                    displayValue = '';
                    dataValue = '';
                }

                return {
                    kind: GridCellKind.Text,
                    data: dataValue,
                    copyData: String(dataValue || ""),
                    displayData: displayValue,
                    readonly: column?.readonly || false,
                    allowOverlay: true,
                    hasMenu: column?.hasMenu || false,
                };
            }
            return {
                kind: GridCellKind.Text,
                data: value,
                copyData: String(value || ""),
                displayData: String(value || ""),
                readonly: column?.readonly || false,
                allowOverlay: true,
                hasMenu: column?.hasMenu || false,
                isEditing: true,
            }
        },
        [gridData, cols,
            helpData36,
            helpData37,
            helpData38,
            helpData39,
            helpData40,
            helpData41,
            helpData42,
            helpData43,
            helpData44,
            helpData45,
        ]
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
            saveToLocalStorageSheet('emp_05_h', newHidden)
            return newHidden
        })
    }

    const updateVisibleColumns = (newVisibleColumns) => {
        setCols((prevCols) => {
            const newCols = [...new Set([...prevCols, ...newVisibleColumns])]
            const uniqueCols = newCols.filter(
                (col, index, self) => index === self.findIndex((c) => c.id === col.id)
            )
            saveToLocalStorageSheet('emp_05_a', uniqueCols)
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
                saveToLocalStorageSheet('emp_05_a', uniqueCols)
                return uniqueCols
            })
            setShowMenu(null)
        }
    }


    const handleReset = () => {
        setCols(defaultCols.filter((col) => col.visible))
        setHiddenColumns([])
        localStorage.removeItem('emp_05_a')
        localStorage.removeItem('emp_05_h')
    }

    const onColumnMoved = useCallback((startIndex, endIndex) => {
        setCols((prevCols) => {
            const updatedCols = [...prevCols]
            const [movedColumn] = updatedCols.splice(startIndex, 1)
            updatedCols.splice(endIndex, 0, movedColumn)
            saveToLocalStorageSheet('emp_05_a', updatedCols)
            return updatedCols
        })
    }, [])

    const showDrawer = () => {
        const invisibleCols = defaultCols.filter((col) => col.visible === false).map((col) => col.id)
        const currentVisibleCols = loadFromLocalStorageSheet('emp_05_a', []).map(
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
                saveToLocalStorageSheet('emp_05_a', newCols)
                return newCols
            })
            setHiddenColumns((prevHidden) => {
                const newHidden = prevHidden.filter((id) => id !== columnId)
                saveToLocalStorageSheet('emp_05_h', newHidden)
                return newHidden
            })
        } else {
            setCols((prevCols) => {
                const newCols = prevCols.filter((col) => col.id !== columnId)
                saveToLocalStorageSheet('emp_05_a', newCols)
                return newCols
            })
            setHiddenColumns((prevHidden) => {
                const newHidden = [...prevHidden, columnId]
                saveToLocalStorageSheet('emp_05_h', newHidden)
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

            if (key === 'UMMilSrvName') {
                if (newValue.kind === GridCellKind.Custom) {
                    setGridData((prev) => {
                        const newData = [...prev]
                        const product = newData[row]
                        let selectedName = newValue.data[0]
                        const checkCopyData = newValue.copyData
                        if (!selectedName) {
                            selectedName = helpData45.find(
                                (item) => item.MinorName === checkCopyData,
                            )
                        }
                        if (selectedName) {
                            product[cols[col].id] = selectedName.MinorName
                            product['UMMilSrvSeq'] = selectedName.Value

                        } else {
                            product[cols[col].id] = ''
                            product['UMMilSrvSeq'] = ''

                        }

                        product.isEdited = true
                        product['IdxNo'] = row + 1
                        const currentStatus = product['Status'] || 'U'
                        product['Status'] = currentStatus === 'A' ? 'A' : 'U'


                        return newData
                    })
                    return
                }
            }

            if (key === 'UMMilRsrcName') {
                if (newValue.kind === GridCellKind.Custom) {
                    setGridData((prev) => {
                        const newData = [...prev]
                        const product = newData[row]
                        let selectedName = newValue.data[0]
                        const checkCopyData = newValue.copyData
                        if (!selectedName) {
                            selectedName = helpData44.find(
                                (item) => item.MinorName === checkCopyData,
                            )
                        }
                        if (selectedName) {
                            product[cols[col].id] = selectedName.MinorName
                            product['UMMilRsrcSeq'] = selectedName.Value

                        } else {
                            product[cols[col].id] = ''
                            product['UMMilRsrcSeq'] = ''

                        }

                        product.isEdited = true
                        product['IdxNo'] = row + 1
                        const currentStatus = product['Status'] || 'U'
                        product['Status'] = currentStatus === 'A' ? 'A' : 'U'


                        return newData
                    })
                    return
                }
            }
            if (key === 'UMMilKindName') {
                if (newValue.kind === GridCellKind.Custom) {
                    setGridData((prev) => {
                        const newData = [...prev]
                        const product = newData[row]
                        let selectedName = newValue.data[0]
                        const checkCopyData = newValue.copyData
                        if (!selectedName) {
                            selectedName = helpData36.find(
                                (item) => item.MinorName === checkCopyData,
                            )
                        }
                        if (selectedName) {
                            product[cols[col].id] = selectedName.MinorName
                            product['UMMilKindSeq'] = selectedName.Value

                        } else {
                            product[cols[col].id] = ''
                            product['UMMilKindSeq'] = ''

                        }

                        product.isEdited = true
                        product['IdxNo'] = row + 1
                        const currentStatus = product['Status'] || 'U'
                        product['Status'] = currentStatus === 'A' ? 'A' : 'U'


                        return newData
                    })
                    return
                }
            }
            if (key === 'UMMilBrnchName') {
                if (newValue.kind === GridCellKind.Custom) {
                    setGridData((prev) => {
                        const newData = [...prev]
                        const product = newData[row]
                        let selectedName = newValue.data[0]
                        const checkCopyData = newValue.copyData
                        if (!selectedName) {
                            selectedName = helpData37.find(
                                (item) => item.MinorName === checkCopyData,
                            )
                        }
                        if (selectedName) {
                            product[cols[col].id] = selectedName.MinorName
                            product['UMMilBrnchSeq'] = selectedName.Value

                        } else {
                            product[cols[col].id] = ''
                            product['UMMilBrnchSeq'] = ''

                        }

                        product.isEdited = true
                        product['IdxNo'] = row + 1
                        const currentStatus = product['Status'] || 'U'
                        product['Status'] = currentStatus === 'A' ? 'A' : 'U'


                        return newData
                    })
                    return
                }
            }
            if (key === 'UMMilClsName') {
                if (newValue.kind === GridCellKind.Custom) {
                    setGridData((prev) => {
                        const newData = [...prev]
                        const product = newData[row]
                        let selectedName = newValue.data[0]
                        const checkCopyData = newValue.copyData
                        if (!selectedName) {
                            selectedName = helpData38.find(
                                (item) => item.MinorName === checkCopyData,
                            )
                        }
                        if (selectedName) {
                            product[cols[col].id] = selectedName.MinorName
                            product['UMMilClsSeq'] = selectedName.Value

                        } else {
                            product[cols[col].id] = ''
                            product['UMMilClsSeq'] = ''

                        }

                        product.isEdited = true
                        product['IdxNo'] = row + 1
                        const currentStatus = product['Status'] || 'U'
                        product['Status'] = currentStatus === 'A' ? 'A' : 'U'


                        return newData
                    })
                    return
                }
            }
            if (key === 'UMMilSpcName') {
                if (newValue.kind === GridCellKind.Custom) {
                    setGridData((prev) => {
                        const newData = [...prev]
                        const product = newData[row]
                        let selectedName = newValue.data[0]
                        const checkCopyData = newValue.copyData
                        if (!selectedName) {
                            selectedName = helpData39.find(
                                (item) => item.MinorName === checkCopyData,
                            )
                        }
                        if (selectedName) {
                            product[cols[col].id] = selectedName.MinorName
                            product['UMMilSpcSeq'] = selectedName.Value

                        } else {
                            product[cols[col].id] = ''
                            product['UMMilSpcSeq'] = ''

                        }

                        product.isEdited = true
                        product['IdxNo'] = row + 1
                        const currentStatus = product['Status'] || 'U'
                        product['Status'] = currentStatus === 'A' ? 'A' : 'U'


                        return newData
                    })
                    return
                }
            }
            if (key === 'UMMilRnkName') {
                if (newValue.kind === GridCellKind.Custom) {
                    setGridData((prev) => {
                        const newData = [...prev]
                        const product = newData[row]
                        let selectedName = newValue.data[0]
                        const checkCopyData = newValue.copyData
                        if (!selectedName) {
                            selectedName = helpData40.find(
                                (item) => item.MinorName === checkCopyData,
                            )
                        }
                        if (selectedName) {
                            product[cols[col].id] = selectedName.MinorName
                            product['UMMilRnkSeq'] = selectedName.Value

                        } else {
                            product[cols[col].id] = ''
                            product['UMMilRnkSeq'] = ''

                        }

                        product.isEdited = true
                        product['IdxNo'] = row + 1
                        const currentStatus = product['Status'] || 'U'
                        product['Status'] = currentStatus === 'A' ? 'A' : 'U'


                        return newData
                    })
                    return
                }
            }
            if (key === 'UMMilDschrgTypeName') {
                if (newValue.kind === GridCellKind.Custom) {
                    setGridData((prev) => {
                        const newData = [...prev]
                        const product = newData[row]
                        let selectedName = newValue.data[0]
                        const checkCopyData = newValue.copyData
                        if (!selectedName) {
                            selectedName = helpData41.find(
                                (item) => item.MinorName === checkCopyData,
                            )
                        }
                        if (selectedName) {
                            product[cols[col].id] = selectedName.MinorName
                            product['UMMilDschrgTypeSeq'] = selectedName.Value

                        } else {
                            product[cols[col].id] = ''
                            product['UMMilDschrgTypeSeq'] = ''

                        }

                        product.isEdited = true
                        product['IdxNo'] = row + 1
                        const currentStatus = product['Status'] || 'U'
                        product['Status'] = currentStatus === 'A' ? 'A' : 'U'


                        return newData
                    })
                    return
                }
            }
            if (key === 'UMMilVetTypeName') {
                if (newValue.kind === GridCellKind.Custom) {
                    setGridData((prev) => {
                        const newData = [...prev]
                        const product = newData[row]
                        let selectedName = newValue.data[0]
                        const checkCopyData = newValue.copyData
                        if (!selectedName) {
                            selectedName = helpData42.find(
                                (item) => item.MinorName === checkCopyData,
                            )
                        }
                        if (selectedName) {
                            product[cols[col].id] = selectedName.MinorName
                            product['UMMilVetTypeSeq'] = selectedName.Value

                        } else {
                            product[cols[col].id] = ''
                            product['UMMilVetTypeSeq'] = ''

                        }

                        product.isEdited = true
                        product['IdxNo'] = row + 1
                        const currentStatus = product['Status'] || 'U'
                        product['Status'] = currentStatus === 'A' ? 'A' : 'U'


                        return newData
                    })
                    return
                }
            }
            if (key === 'UMMilExTypeName') {
                if (newValue.kind === GridCellKind.Custom) {
                    setGridData((prev) => {
                        const newData = [...prev]
                        const product = newData[row]
                        let selectedName = newValue.data[0]
                        const checkCopyData = newValue.copyData
                        if (!selectedName) {
                            selectedName = helpData43.find(
                                (item) => item.MinorName === checkCopyData,
                            )
                        }
                        if (selectedName) {
                            product[cols[col].id] = selectedName.MinorName
                            product['UMMilExTypeSeq'] = selectedName.Value

                        } else {
                            product[cols[col].id] = ''
                            product['UMMilExTypeSeq'] = ''

                        }

                        product.isEdited = true
                        product['IdxNo'] = row + 1
                        const currentStatus = product['Status'] || 'U'
                        product['Status'] = currentStatus === 'A' ? 'A' : 'U'


                        return newData
                    })
                    return
                }
            }
            setGridData((prevData) => {
                const updatedData = [...prevData]
                if (!updatedData[row]) updatedData[row] = {}

                const currentStatus = updatedData[row]['Status'] || ''
                updatedData[row][key] = newValue.data
                updatedData[row]['Status'] = currentStatus === 'A' ? 'A' : 'U'



                return updatedData
            })
        },
        [cols, gridData,
            helpData36,
            helpData37,
            helpData38,
            helpData39,
            helpData40,
            helpData41,
            helpData42,
            helpData43,
            helpData44,
            helpData45,
        ]
    )
    return (
        <div className="w-full gap-1 h-full flex items-center justify-center">
            <div className="w-full h-full flex flex-col  bg-white  overflow-hidden ">
                <h2 className="text-[10px]  text-blue-600 border-b font-medium flex items-center gap-2 p-2  uppercase">
                    Đăng ký nghĩa vụ đi lính
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
                    onRowAppended={() => handleRowAppend(1)}
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
                    onCellEdited={onCellEdited}
                    highlightRegions={highlightRegions}
                    customRenderers={[
                        CellsUMMilSrvName,
                        CellsUMMilRsrcName,
                        CellsUMMilKindName,
                        CellsUMMilBrnchName,
                        CellsUMMilClsName,
                        CellsUMMilSpcName
                        , CellsUMMilRnkName,
                        CellsUMMilDschrgTypeName,
                        CellsUMMilVetTypeName,
                        CellsUMMilExTypeName

                    ]}
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
                                    handleRowAppend={handleRowAppend}
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

export default Emp5Table
