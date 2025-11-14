import { useEffect, useState, useCallback, useMemo, useRef } from 'react'
import { DataEditor, GridCellKind } from '@glideapps/glide-data-grid'
import '@glideapps/glide-data-grid/dist/index.css'
import { TableOutlined } from '@ant-design/icons'
import { useLayer } from 'react-laag'
import LayoutMenuSheet from '../../sheet/jsx/layoutMenu'
import LayoutStatusMenuSheet from '../../sheet/jsx/layoutStatusMenu'
import { Drawer, Checkbox, message } from 'antd'
import { saveToLocalStorageSheet } from '../../../../localStorage/sheet/sheet'
import { loadFromLocalStorageSheet } from '../../../../localStorage/sheet/sheet'
import { reorderColumns } from '../../sheet/js/reorderColumns'
import { updateEditedRows } from '../../sheet/js/updateEditedRows'
import useOnFill from '../../hooks/sheet/onFillHook'
import { useExtraCells } from '@glideapps/glide-data-grid-cells'
import { updateIndexNo } from '../../sheet/js/updateIndexNo'
import { CellsEmpNameV2 } from '../../sheet/cells/cellsEmpNamev2'
import { GetCodeHelp } from '../../../../features/codeHelp/getCodeHelp'
import { togglePageInteraction } from '../../../../utils/togglePageInteraction'
import { CellsUMUnionTypeName } from '../../sheet/cells/cellUMUnionTypeName'
import { CellsUMUnionStatusName } from '../../sheet/cells/cellUMUnionStatusName'
import moment from 'moment'

const parseBoolean = (value) => {
    const normalized = String(value).trim().toLowerCase();
    return normalized === '1' || normalized === 'true';
};
function HrBasUnionTable({
    data,
    setSelection,
    selection,
    setShowSearch,
    showSearch,
    setEditedRows,
    setGridData,
    gridData,
    numRows,
    handleRowAppend,
    setCols,
    cols,
    defaultCols,
    canEdit,
    canCreate,
    dataRootMenu,
    dataSubMenu,
    handleRestSheet,
    helpData02,
    setHelpData02,
    helpData04,
    helpData05,
    setHelpData04,
    setHelpData05,
    helpData06,
    setHelpData06,
}) {
    const gridRef = useRef(null)
    const [open, setOpen] = useState(false)
    const cellProps = useExtraCells()
    const onFill = useOnFill(setGridData, cols)
    const onSearchClose = useCallback(() => setShowSearch(false), [])
    const [showMenu, setShowMenu] = useState(null)
    const [isCell, setIsCell] = useState(null)
    const [hoverRow, setHoverRow] = useState(null);
    const onItemHovered = useCallback((args) => {
        const [_, row] = args.location
        setHoverRow(args.kind !== 'cell' ? undefined : row)
    }, [])
    const [hiddenColumns, setHiddenColumns] = useState(() => {
        return loadFromLocalStorageSheet('hr_org_union_h', [])
    })

    const controllers = useRef({})
    const lastFetchedData = useRef(new Map())
    const fetchingKeys = useRef(new Set())
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
        'EmpID',
        'DeptName',
    ])];

    const highlightRegions = [
        'EmpName',
        'UMUnionTypeName',
        'UMUnionStatusName'

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
                EmpName: {
                    kind: 'cells-emp-name-v2',
                    allowedValues: helpData02,
                    setCacheData: setHelpData02,
                },
                UMUnionTypeName: {
                    kind: 'cell-UMUnionTypeName',
                    allowedValues: helpData04,
                    setCacheData: setHelpData04,
                },
                UMUnionStatusName: {
                    kind: 'cell-UMUnionStatusName',
                    allowedValues: helpData05,
                    setCacheData: setHelpData05,
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

            if (
                columnKey === 'IsAllowPay'

            ) {
                const booleanValue = parseBoolean(value);
                return {
                    kind: GridCellKind.Boolean,
                    data: booleanValue,
                    allowOverlay: true,
                    hasMenu: column?.hasMenu || false,
                };
            }
            if (columnKey === 'BegDate' || columnKey === "EndDate") {
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
        [gridData, cols, helpData02, helpData04, helpData05, helpData06]
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

    const callGetCodeHelpNow2 = async (key) => {
        if (!key || key === 'N/A') return null
        key = key.replace(/\s+/g, '');
        if (lastFetchedData.current.has(key)) {
            return lastFetchedData.current.get(key)
        }

        while (fetchingKeys.current.has(key)) {
            await new Promise((resolve) => setTimeout(resolve, 50))
        }

        if (lastFetchedData.current.has(key)) {
            return lastFetchedData.current.get(key)
        }
        fetchingKeys.current.add(key)

        setIsLoading(true)
        const controller = new AbortController()
        controllers.current.callGetCodeHelpNow2 = controller

        try {
            const result = await GetCodeHelp(10009, key, '', '', '', '', '', 1, 0, '', 0, 0, 0, controller.signal);

            const data = result.data || []
            setHelpData02((prev) => {
                const existingItemSeqs = new Set(prev.map((item) => item.EmpSeq))
                const newData = data.filter(
                    (item) => !existingItemSeqs.has(item.EmpSeq),
                )
                return [...prev, ...newData]
            })
            lastFetchedData.current.set(key, data)
            return data
        } catch (error) {
            return []
        } finally {
            togglePageInteraction(false)
            setIsLoading(false)
            fetchingKeys.current.delete(key)
            controllers.current.callGetCodeHelpNow2 = null
        }
    }
    const onCellEdited = useCallback(
        async (cell, newValue) => {
            if (canEdit === false) {
                message.warning('Bạn không có quyền chỉnh sửa dữ liệu')
                return
            }
            if (
                newValue.kind !== GridCellKind.Text &&
                newValue.kind !== GridCellKind.Custom &&
                newValue.kind !== GridCellKind.Number &&
                newValue.kind !== GridCellKind.Boolean
            ) {
                return
            }
            const indexes = reorderColumns(cols)
            const [col, row] = cell
            const key = indexes[col]

            if (key === 'EmpName' && newValue.kind === GridCellKind.Custom) {
                let selectedName

                if (newValue.data instanceof Promise) {
                    selectedName = await newValue.data
                    selectedName = selectedName[0]
                } else {
                    selectedName = newValue?.data[0]
                }
                const checkCopyData = newValue?.copyData

                if (!selectedName) {
                    selectedName = await callGetCodeHelpNow2(checkCopyData)
                    selectedName = selectedName ? selectedName[0] : null
                }

                setGridData((prev) => {
                    const newData = [...prev]
                    const product = newData[row] || {}

                    if (selectedName) {
                        product[cols[col].id] = selectedName?.EmpName || ''
                        product['DeptName'] = selectedName.DeptName
                        product['DeptSeq'] = selectedName.DeptSeq
                        product['EmpSeq'] = selectedName.EmpSeq
                        product['EmpID'] = selectedName.EmpID
                        product['PosName'] = selectedName.PosName

                    } else {
                        product[cols[col].id] = ''
                        product['DeptName'] = ''
                        product['DeptSeq'] = ''
                        product['EmpSeq'] = ''
                        product['EmpID'] = ''
                        product['PosName'] = ''

                    }

                    product['IdxNo'] = row + 1
                    const currentStatus = product['Status'] || 'U'
                    product['Status'] = currentStatus === 'A' ? 'A' : 'U'



                    return newData
                })
                return
            }
            if (key === 'UMUnionTypeName') {
                if (newValue.kind === GridCellKind.Custom) {
                    setGridData((prev) => {
                        const newData = [...prev]
                        const product = newData[row]
                        let selectedName = newValue.data[0]
                        const checkCopyData = newValue.copyData
                        if (!selectedName) {
                            selectedName = helpData04.find(
                                (item) => item.MinorName === checkCopyData,
                            )
                        }
                        if (selectedName) {
                            product[cols[col].id] = selectedName.MinorName
                            product['UMUnionType'] = selectedName.Value

                        } else {
                            product[cols[col].id] = ''
                            product['UMUnionType'] = ''

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
            if (key === 'UMUnionStatusName') {
                if (newValue.kind === GridCellKind.Custom) {
                    setGridData((prev) => {
                        const newData = [...prev]
                        const product = newData[row]
                        let selectedName = newValue.data[0]
                        const checkCopyData = newValue.copyData
                        if (!selectedName) {
                            selectedName = helpData05.find(
                                (item) => item.MinorName === checkCopyData,
                            )
                        }
                        if (selectedName) {
                            product[cols[col].id] = selectedName.MinorName
                            product['UMUnionStatus'] = selectedName.Value

                        } else {
                            product[cols[col].id] = ''
                            product['UMUnionStatus'] = ''

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

            if (key === 'FamilySeq' || key === 'EmpID' || key === "EntRetTypeName"
                || key === "DeptName" || key === "PosName" || key === "UMUnionType" || key === "CellsUMUnionStatus"

            ) {
                return
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
        [cols, gridData, helpData05, helpData04, helpData06]
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
            saveToLocalStorageSheet('hr_org_union_h', newHidden)
            return newHidden
        })
    }

    const updateVisibleColumns = (newVisibleColumns) => {
        setCols((prevCols) => {
            const newCols = [...new Set([...prevCols, ...newVisibleColumns])]
            const uniqueCols = newCols.filter(
                (col, index, self) => index === self.findIndex((c) => c.id === col.id)
            )
            saveToLocalStorageSheet('hr_org_union_a', uniqueCols)
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
                saveToLocalStorageSheet('hr_org_union_a', uniqueCols)
                return uniqueCols
            })
            setShowMenu(null)
        }
    }
    // Hàm rEST LẤY LẠI CỘT DỮ LIỆU

    const handleReset = () => {
        setCols(defaultCols.filter((col) => col.visible))
        setHiddenColumns([])
        localStorage.removeItem('hr_org_union_a')
        localStorage.removeItem('hr_org_union_h')
    }

    const onColumnMoved = useCallback((startIndex, endIndex) => {
        setCols((prevCols) => {
            const updatedCols = [...prevCols]
            const [movedColumn] = updatedCols.splice(startIndex, 1)
            updatedCols.splice(endIndex, 0, movedColumn)
            saveToLocalStorageSheet('hr_org_union_a', updatedCols)
            return updatedCols
        })
    }, [])

    const showDrawer = () => {
        const invisibleCols = defaultCols.filter((col) => col.visible === false).map((col) => col.id)
        const currentVisibleCols = loadFromLocalStorageSheet('hr_org_union_a', []).map(
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
                saveToLocalStorageSheet('hr_org_union_a', newCols)
                return newCols
            })
            setHiddenColumns((prevHidden) => {
                const newHidden = prevHidden.filter((id) => id !== columnId)
                saveToLocalStorageSheet('hr_org_union_h', newHidden)
                return newHidden
            })
        } else {
            setCols((prevCols) => {
                const newCols = prevCols.filter((col) => col.id !== columnId)
                saveToLocalStorageSheet('hr_org_union_a', newCols)
                return newCols
            })
            setHiddenColumns((prevHidden) => {
                const newHidden = [...prevHidden, columnId]
                saveToLocalStorageSheet('hr_org_union_h', newHidden)
                return newHidden
            })
        }
    }

    return (
        <div className="w-full gap-1 h-full flex items-center justify-center">
            <div className="w-full h-full flex flex-col  bg-white  overflow-hidden ">
                <h2 className="text-[10px]  text-blue-600 border-b font-medium flex items-center gap-2 p-2  uppercase">
                    DATA SHEET
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
                    onRowAppended={() => handleRowAppend(1)}
                    onCellEdited={onCellEdited}
                    onCellClicked={onCellClicked}
                    highlightRegions={highlightRegions}
                    onColumnResize={onColumnResize}
                    onHeaderMenuClick={onHeaderMenuClick}
                    onColumnMoved={onColumnMoved}
                    onKeyUp={onKeyUp}
                    customRenderers={[CellsEmpNameV2,
                        CellsUMUnionTypeName,
                        CellsUMUnionStatusName

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

export default HrBasUnionTable
