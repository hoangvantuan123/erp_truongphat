import { useEffect, useState, useCallback, useMemo, useRef } from 'react'
import { DataEditor, GridCellKind } from '@glideapps/glide-data-grid'
import '@glideapps/glide-data-grid/dist/index.css'
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
import { CellSMHolidayType } from '../../../sheet/cells/CellSMHolidayType'
import { CellsEmpNameV2 } from '../../../sheet/cells/cellsEmpNamev2'
import { GetCodeHelp } from '../../../../../features/codeHelp/getCodeHelp'
import { togglePageInteraction } from '../../../../../utils/togglePageInteraction'

import moment from 'moment'
function DailyAtt05Table({
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
    canEdit,
    helpData01,
    setHelpData01,
}) {
    const gridRef = useRef(null)

    const controllers = useRef({})
    const lastFetchedData = useRef(new Map())
    const fetchingKeys = useRef(new Set())

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
        return loadFromLocalStorageSheet('daily_att_05_h', [])
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


    const booleanColumns = [
        'IsCommon',
    ];


    const blueColumns = [
        'EmpName',
    ];

    const grayColumns = [
        'EmpID',
        'DeptName',
        'PuName',
        'PtName',
        'UMJpName'


    ];
    const TimeColums = [
        '11',
        '29',
        '30',
        '31',
        '32',
        '33',
        '34',
        '35',
        '36',
        '38',
        '39',
        '40',
        '41',
        '42',
        '43',
        '49',
        '50',
        '74',
        '80',
        '82'
    ];

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

            let themeOverride = undefined;
            if (blueColumns.includes(columnKey)) {
                themeOverride = { bgCell: "#ebf1ff" };
            } else if (grayColumns.includes(columnKey)) {
                themeOverride = { bgCell: "#F0F2F5" };
            }


            const cellConfig = {
                EmpName: {
                    kind: 'cells-emp-name-v2',
                    allowedValues: helpData01,
                    setCacheData: setHelpData01,
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
                    themeOverride,
                }
            }
            if (TimeColums.includes(columnKey)) {
                const rawText = value?.toString?.() || "";
                const cleaned = rawText.replace(/[^\d]/g, "");

                let dataValue = "";
                let displayValue = "";

                // Nếu dữ liệu dạng HHmm
                if (cleaned.length === 4) {
                    const hours = cleaned.substring(0, 2);
                    const minutes = cleaned.substring(2, 4);

                    const isValid =
                        parseInt(hours, 10) >= 0 &&
                        parseInt(hours, 10) <= 23 &&
                        parseInt(minutes, 10) >= 0 &&
                        parseInt(minutes, 10) <= 59;

                    if (isValid) {
                        dataValue = cleaned; // giữ nguyên "0800"
                        displayValue = `${hours}:${minutes}`; // hiển thị "08:00"
                    }
                }

                return {
                    kind: GridCellKind.Text,
                    data: dataValue,
                    displayData: displayValue,
                    copyData: dataValue,
                    readonly: column?.readonly || false,
                    allowOverlay: true,
                    hasMenu: column?.hasMenu || false,
                    contentAlign: "right",
                };
            }


            return {
                kind: GridCellKind.Text,
                data: value,

                displayData: String(value),
                readonly: column?.readonly || false,
                allowOverlay: true,
                hasMenu: column?.hasMenu || false,
                contentAlign: column?.contentAlign || 'left',
                themeOverride,


            }
        },
        [gridData, cols, helpData01]
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

        const controller = new AbortController()
        controllers.current.callGetCodeHelpNow2 = controller

        try {
            const result = await GetCodeHelp(10009, key, '', '', '', '', '', 1, 0, '', 0, 0, 0, controller.signal);

            const data = result.data || []
            setHelpData01((prev) => {
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
            fetchingKeys.current.delete(key)
            controllers.current.callGetCodeHelpNow2 = null
        }
    }
    const onCellEdited = useCallback(
        async (cell, newValue) => {
            if (canEdit === false) {
                message.warning("Bạn không có quyền chỉnh sửa dữ liệu");
                return;
            }

            if (
                newValue.kind !== GridCellKind.Text &&
                newValue.kind !== GridCellKind.Custom &&
                newValue.kind !== GridCellKind.Number &&
                newValue.kind !== GridCellKind.Boolean
            ) {
                return;
            }

            const indexes = reorderColumns(cols);
            const [col, row] = cell;
            const key = indexes[col];

            if (grayColumns.includes(key)) {
                return;
            }

            // Xử lý riêng các cột thời gian (HHmm)
            if (TimeColums.includes(key)) {
                const rawText = newValue.data?.toString() || "";
                const cleaned = rawText.replace(/[^\d]/g, ""); // giữ số

                let dataValue = "";

                if (cleaned.length >= 1 && cleaned.length <= 4) {
                    // Lấy giờ và phút
                    let hours = "";
                    let minutes = "";

                    if (cleaned.length <= 2) {
                        // Nhập 1-2 chữ số → coi là giờ, phút = "00"
                        hours = cleaned.padStart(2, "0");
                        minutes = "00";
                    } else {
                        // Nhập 3-4 chữ số → 2 chữ số cuối là phút
                        hours = cleaned.slice(0, cleaned.length - 2).padStart(2, "0");
                        minutes = cleaned.slice(-2);
                    }

                    // Kiểm tra giờ/phút hợp lệ
                    const isValid =
                        parseInt(hours, 10) >= 0 &&
                        parseInt(hours, 10) <= 23 &&
                        parseInt(minutes, 10) >= 0 &&
                        parseInt(minutes, 10) <= 59;

                    if (isValid) {
                        dataValue = `${hours}${minutes}`;
                    }
                }
                // Nếu người dùng nhập dạng 8:00 hoặc 8.00 hoặc 08:00
                else if (/^\d{1,2}[:.]\d{2}$/.test(rawText)) {
                    const [h, m] = rawText.split(/[:.]/);
                    const hours = h.padStart(2, "0");
                    const minutes = m.padStart(2, "0");

                    const isValid =
                        parseInt(hours, 10) >= 0 &&
                        parseInt(hours, 10) <= 23 &&
                        parseInt(minutes, 10) >= 0 &&
                        parseInt(minutes, 10) <= 59;

                    if (isValid) {
                        dataValue = `${hours}${minutes}`;
                    }
                }

                // Cập nhật gridData
                setGridData((prevData) => {
                    const updatedData = [...prevData];
                    if (!updatedData[row]) updatedData[row] = {};

                    const currentStatus = updatedData[row]["Status"] || "";
                    updatedData[row][key] = dataValue;
                    updatedData[row]["Status"] = currentStatus === "A" ? "A" : "U";

                    return updatedData;
                });

                return;
            }

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
                        product['EmpSeq'] = selectedName.EmpSeq
                        product['EmpID'] = selectedName.EmpID
                        product['DeptName'] = selectedName.DeptName
                        product['DeptSeq'] = selectedName.DeptSeq
                        product['UMJpName'] = selectedName.UMJpName
                        product['UMJdSeq'] = selectedName.UMJdSeq
                        product['PtName'] = selectedName.PtName
                        product['PtSeq'] = selectedName.PtSeq

                    } else {
                        product[cols[col].id] = ''
                        product['EmpSeq'] = ''
                        product['EmpID'] = ''
                        product['DeptName'] = ''
                        product['DeptSeq'] = ''
                        product['PosName'] = ''
                        product['UMJpName'] = ''
                        product['UMJdSeq'] = ''
                        product['PtName'] = ''
                        product['PtSeq'] = ''

                    }

                    product['IdxNo'] = row + 1
                    const currentStatus = product['Status'] || 'U'
                    product['Status'] = currentStatus === 'A' ? 'A' : 'U'



                    return newData
                })
                return
            }


            // Default fallback cho các cột khác
            setGridData((prevData) => {
                const updatedData = [...prevData];
                if (!updatedData[row]) updatedData[row] = {};

                const currentStatus = updatedData[row]["Status"] || "";
                updatedData[row][key] = newValue.data;
                updatedData[row]["Status"] = currentStatus === "A" ? "A" : "U";

                return updatedData;
            });
        },
        [cols, gridData, helpData01]
    );


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
            saveToLocalStorageSheet('daily_att_05_h', newHidden)
            return newHidden
        })
    }

    const updateVisibleColumns = (newVisibleColumns) => {
        setCols((prevCols) => {
            const newCols = [...new Set([...prevCols, ...newVisibleColumns])]
            const uniqueCols = newCols.filter(
                (col, index, self) => index === self.findIndex((c) => c.id === col.id)
            )
            saveToLocalStorageSheet('daily_att_05_a', uniqueCols)
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
                saveToLocalStorageSheet('daily_att_05_a', uniqueCols)
                return uniqueCols
            })
            setShowMenu(null)
        }
    }
    // Hàm rEST LẤY LẠI CỘT DỮ LIỆU

    const handleReset = () => {
        setCols(defaultCols.filter((col) => col.visible))
        setHiddenColumns([])
        localStorage.removeItem('daily_att_05_a')
        localStorage.removeItem('daily_att_05_h')
    }

    const onColumnMoved = useCallback((startIndex, endIndex) => {
        setCols((prevCols) => {
            const updatedCols = [...prevCols]
            const [movedColumn] = updatedCols.splice(startIndex, 1)
            updatedCols.splice(endIndex, 0, movedColumn)
            saveToLocalStorageSheet('daily_att_05_a', updatedCols)
            return updatedCols
        })
    }, [])

    const showDrawer = () => {
        const invisibleCols = defaultCols.filter((col) => col.visible === false).map((col) => col.id)
        const currentVisibleCols = loadFromLocalStorageSheet('daily_att_05_a', []).map(
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
                saveToLocalStorageSheet('daily_att_05_a', newCols)
                return newCols
            })
            setHiddenColumns((prevHidden) => {
                const newHidden = prevHidden.filter((id) => id !== columnId)
                saveToLocalStorageSheet('daily_att_05_h', newHidden)
                return newHidden
            })
        } else {
            setCols((prevCols) => {
                const newCols = prevCols.filter((col) => col.id !== columnId)
                saveToLocalStorageSheet('daily_att_05_a', newCols)
                return newCols
            })
            setHiddenColumns((prevHidden) => {
                const newHidden = [...prevHidden, columnId]
                saveToLocalStorageSheet('daily_att_05_h', newHidden)
                return newHidden
            })
        }
    }

    return (
        <div className="w-full gap-1 h-full flex items-center justify-center">
            <div className="w-full h-full flex flex-col  bg-white  overflow-hidden ">
                <div className='flex items-center px-2 p-1 justify-between border-b text-[10px] text-black  font-medium uppercase'>
                    <span>Đăng ký chi tiết chấm công đầu hàng ngày</span>
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
                    onRowAppended={() => handleRowAppend(1)}
                    onCellEdited={onCellEdited}
                    onCellClicked={onCellClicked}
                    onColumnResize={onColumnResize}
                    onHeaderMenuClick={onHeaderMenuClick}
                    onColumnMoved={onColumnMoved}
                    onKeyUp={onKeyUp}
                    customRenderers={[CellsEmpNameV2]}

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

export default DailyAtt05Table
