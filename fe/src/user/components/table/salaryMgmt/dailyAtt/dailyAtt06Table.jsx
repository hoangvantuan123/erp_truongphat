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
import { HandleError } from '../../../../page/default/handleError'
import moment from 'moment'
import { WkOverTimeApproveConfirm } from '../../../../../features/hr/dailyAtt/WkOverTimeApprove/WkOverTimeApproveConfirm'
function DailyAtt06Table({
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
        return loadFromLocalStorageSheet('daily_att_06_h', [])
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
        'IsCheck',
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


            if (booleanColumns.includes(columnKey)) {
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


            if (columnKey === "WkDate") {
                const rawText = value?.toString?.() || "";
                const cleaned = rawText.replace(/[^\d]/g, "");

                let dataValue = "";

                if (cleaned.length === 8) {
                    dataValue = cleaned; // YYYYMMDD
                } else if (cleaned.length === 6) {
                    dataValue = cleaned + "01"; // YYYYMM → + ngày 01
                } else if (cleaned.length === 4) {
                    const year = new Date().getFullYear();
                    dataValue = `${year}${cleaned}`; // MMDD
                } else if (cleaned.length === 2) {
                    const now = new Date();
                    const year = now.getFullYear();
                    const month = (now.getMonth() + 1).toString().padStart(2, "0");
                    dataValue = `${year}${month}${cleaned}`; // DD
                }

                // Format chỉ để hiển thị view
                const isValid = dataValue && moment(dataValue, "YYYYMMDD", true).isValid();
                const displayValue = isValid
                    ? moment(dataValue, "YYYYMMDD").format("YYYY-MM-DD")
                    : "";

                return {
                    kind: GridCellKind.Text,
                    data: isValid ? dataValue : "",
                    displayData: displayValue,   // luôn hiện "2026-05-04"
                    copyData: isValid ? dataValue : "",
                    readonly: column?.readonly || false,
                    allowOverlay: true,
                    hasMenu: column?.hasMenu || false,

                    contentAlign: "right",
                };
            }


            if (columnKey === "ERPTimeIn" || columnKey === "ERPTimeOut" ||
                columnKey === "DTime" || columnKey === "PayDTime"
            ) {
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

            if (key === "IsCheck") {
                const checked = newValue.data === true || newValue.data === 1;

                setGridData((prevData) => {
                    const updatedData = [...prevData];
                    if (!updatedData[row]) updatedData[row] = {};

                    const currentStatus = updatedData[row]["Status"] || "";
                    updatedData[row][key] = checked ? 1 : 0;
                    updatedData[row]["Status"] = currentStatus === "A" ? "A" : "U";

                    const idxNo = updatedData[row]?.["IDX_NO"] || updatedData[row]?.["IdxNo"];
                    const cfmSeq = updatedData[row]?.["Seq"];

                    if (idxNo && cfmSeq) {
                        WkOverTimeApproveConfirm([
                            {
                                IdxNo: idxNo,
                                CfmCode: checked ? 1 : 0,
                                CfmSeq: cfmSeq,
                                WorkingTag: "U",
                            },
                        ])
                            .then((res) => {
                                setGridData((innerData) => {
                                    const copy = [...innerData];
                                    if (!copy[row]) copy[row] = {};

                                    if (res.success) {
                                        copy[row]["Status"] = "U";
                                    } else {
                                        copy[row]["Status"] = "E";

                                        HandleError([
                                            {
                                                success: false,
                                                message: res.message || 'Đã xảy ra lỗi vui lòng thử lại!',
                                            },
                                        ]);
                                    }

                                    return copy;
                                });
                            })
                            .catch((err) => {
                                setGridData((innerData) => {
                                    const copy = [...innerData];
                                    if (!copy[row]) copy[row] = {};
                                    copy[row]["Status"] = "E";
                                    return copy;
                                });


                                HandleError([
                                    {
                                        success: false,
                                        message: 'Đã xảy ra lỗi vui lòng thử lại!',
                                    },
                                ]);
                            });
                    } else {
                        message.error(`Không tìm thấy IDX_NO hoặc Seq ở hàng ${row + 1}`);
                    }

                    return updatedData;
                });

                return;
            }



            // 👉 Default xử lý cho các cột khác
            setGridData((prevData) => {
                const updatedData = [...prevData];
                if (!updatedData[row]) updatedData[row] = {};

                const currentStatus = updatedData[row]["Status"] || "";
                updatedData[row][key] = newValue.data;
                updatedData[row]["Status"] = currentStatus === "A" ? "A" : "U";

                return updatedData;
            });
        },
        [cols, gridData]
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
            saveToLocalStorageSheet('daily_att_06_h', newHidden)
            return newHidden
        })
    }

    const updateVisibleColumns = (newVisibleColumns) => {
        setCols((prevCols) => {
            const newCols = [...new Set([...prevCols, ...newVisibleColumns])]
            const uniqueCols = newCols.filter(
                (col, index, self) => index === self.findIndex((c) => c.id === col.id)
            )
            saveToLocalStorageSheet('daily_att_06_a', uniqueCols)
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
                saveToLocalStorageSheet('daily_att_06_a', uniqueCols)
                return uniqueCols
            })
            setShowMenu(null)
        }
    }
    // Hàm rEST LẤY LẠI CỘT DỮ LIỆU

    const handleReset = () => {
        setCols(defaultCols.filter((col) => col.visible))
        setHiddenColumns([])
        localStorage.removeItem('daily_att_06_a')
        localStorage.removeItem('daily_att_06_h')
    }

    const onColumnMoved = useCallback((startIndex, endIndex) => {
        setCols((prevCols) => {
            const updatedCols = [...prevCols]
            const [movedColumn] = updatedCols.splice(startIndex, 1)
            updatedCols.splice(endIndex, 0, movedColumn)
            saveToLocalStorageSheet('daily_att_06_a', updatedCols)
            return updatedCols
        })
    }, [])

    const showDrawer = () => {
        const invisibleCols = defaultCols.filter((col) => col.visible === false).map((col) => col.id)
        const currentVisibleCols = loadFromLocalStorageSheet('daily_att_06_a', []).map(
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
                saveToLocalStorageSheet('daily_att_06_a', newCols)
                return newCols
            })
            setHiddenColumns((prevHidden) => {
                const newHidden = prevHidden.filter((id) => id !== columnId)
                saveToLocalStorageSheet('daily_att_06_h', newHidden)
                return newHidden
            })
        } else {
            setCols((prevCols) => {
                const newCols = prevCols.filter((col) => col.id !== columnId)
                saveToLocalStorageSheet('daily_att_06_a', newCols)
                return newCols
            })
            setHiddenColumns((prevHidden) => {
                const newHidden = [...prevHidden, columnId]
                saveToLocalStorageSheet('daily_att_06_h', newHidden)
                return newHidden
            })
        }
    }

    return (
        <div className="w-full gap-1 h-full flex items-center justify-center">
            <div className="w-full h-full flex flex-col  bg-white  overflow-hidden ">
                <div className='flex items-center px-2 p-1 justify-between border-b text-[10px] text-black  font-medium uppercase'>
                    <span>DANH SÁCH XÁC NHẬN ĐĂNG KÝ OT (GIỜ)</span>
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
                    onCellEdited={onCellEdited}
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

export default DailyAtt06Table
