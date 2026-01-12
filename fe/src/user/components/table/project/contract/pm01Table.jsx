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
import { CellsPJTNo } from '../../../sheet/cells/cellsPJTNo'
import { CellsResrcName } from '../../../sheet/cells/cellsResrcName'
import moment from 'moment'
import { t } from 'i18next'

function PM01Table({
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
    helpData06,
    setHelpData06,
    canEdit,
    setHelpData07,
    helpData07,
    handleRowAppend

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
        return loadFromLocalStorageSheet('pm01_h', [])
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
    const blueColumns = [
        'PJTName',
        'ResrcName'

    ];

    const grayColumns = [
        'PJTNo',
        'ItemNo',
        'SumAmt',
        'DomPrice',
        'DomVATAmt',
        'DomSumAmt'
    ];

    const totalColumns = ['Qty', 'Price', 'Amt', 'DomPrice', 'DomAmt', 'VATAmt', 'SumAmt'];

    const getData = useCallback(
        ([col, row]) => {
            const lastRowIndex = numRows - 1;
            const person = gridData[row] || {};
            const column = cols[col];
            const columnKey = column?.id || '';
            const value = person[columnKey] ?? '';

            let themeOverride = undefined;
            if (blueColumns.includes(columnKey)) {
                themeOverride = { bgCell: "#ebf1ff" };
            } else if (grayColumns.includes(columnKey)) {
                themeOverride = { bgCell: "#F0F2F5" };
            }


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

            const isPJTNoTrue = person.ISStd === false || person.ISStd === 0 || person?.ISStd === '';
            const cellConfig = {
                PJTName: {
                    kind: 'item-PJT-Name',
                    allowedValues: helpData06,
                    setCacheData: setHelpData06,
                },

                ...(isPJTNoTrue
                    ? {}
                    : {
                        ResrcName: {
                            kind: 'item-Resrc-Name',
                            allowedValues: helpData07,
                            setCacheData: setHelpData07,
                        }
                    }),
            };

            // Nếu column thuộc cellConfig thì trả custom cell
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
                };
            }
            if (
                columnKey === "DelvDueDate"
            ) {
                const rawText = value?.toString?.() || "";
                const cleaned = rawText.replace(/[^\d]/g, "");

                let dataValue = "";
                let displayValue = "";

                if (cleaned.length === 8) {
                    // YYYYMMDD đúng chuẩn
                    dataValue = cleaned;
                    displayValue = moment(cleaned, "YYYYMMDD").format("YYYY-MM-DD");
                } else if (cleaned.length === 6) {
                    // YYYYMM -> thêm ngày 01
                    dataValue = cleaned + "01";
                    displayValue = moment(dataValue, "YYYYMMDD").format("YYYY-MM-DD");
                } else if (cleaned.length === 4) {
                    // MMDD -> thêm năm hiện tại
                    const year = new Date().getFullYear();
                    dataValue = `${year}${cleaned}`;
                    displayValue = moment(dataValue, "YYYYMMDD").format("YYYY-MM-DD");
                } else if (cleaned.length === 2) {
                    // DD -> thêm năm/tháng hiện tại
                    const now = new Date();
                    const year = now.getFullYear();
                    const month = (now.getMonth() + 1).toString().padStart(2, "0");
                    dataValue = `${year}${month}${cleaned}`;
                    displayValue = moment(dataValue, "YYYYMMDD").format("YYYY-MM-DD");
                } else {
                    // Không hợp lệ hoặc rỗng
                    dataValue = "";
                    displayValue = rawText;
                }

                const isValid = moment(dataValue, "YYYYMMDD", true).isValid();

                return {
                    kind: GridCellKind.Text,
                    data: isValid ? dataValue : "",
                    displayData: isValid ? displayValue : rawText,
                    copyData: isValid ? dataValue : "",
                    readonly: column?.readonly || false,
                    allowOverlay: true,
                    hasMenu: column?.hasMenu || false,
                    contentAlign: "right",
                    themeOverride,
                };
            }

            if (columnKey === 'ISStd') {
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


            if (columnKey === "Qty" ||
                columnKey === "Price" ||
                columnKey === "Amt" ||
                columnKey === "VATAmt" ||
                columnKey === "SumAmt" ||
                columnKey === "DomPrice" ||
                columnKey === "DomAmt" ||
                columnKey === "DomVATAmt"

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
                    themeOverride,

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
            };
        },
        [gridData, cols, numRows, helpData06, helpData07]
    );








    const onKeyUp = useCallback(
        (event) => {
            const indexes = reorderColumns(cols)
        },
        [cols, gridData]
    )


    const onCellEdited = useCallback(
        async (cell, newValue) => {
            if (!canEdit) {
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
            if (key === "DelvDueDate") {
                const rawText = newValue.data?.toString() || "";
                const cleaned = rawText.replace(/[^\d]/g, "");

                let dataValue = "";

                if (cleaned.length === 8) {
                    dataValue = cleaned;
                } else if (cleaned.length === 6) {
                    dataValue = cleaned + "01";
                } else if (cleaned.length === 4) {
                    const year = new Date().getFullYear();
                    dataValue = `${year}${cleaned}`;
                } else if (cleaned.length === 2) {
                    const now = new Date();
                    const year = now.getFullYear();
                    const month = (now.getMonth() + 1).toString().padStart(2, "0");
                    dataValue = `${year}${month}${cleaned}`;
                } else {
                    dataValue = "";
                }

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
            if (key === 'PJTName') {
                if (newValue.kind === GridCellKind.Custom) {
                    setGridData(prev => {
                        const newData = [...prev];

                        if (!newData[row]) newData[row] = {};

                        const product = newData[row];
                        let selectedName = newValue.data[0]


                        const checkCopyData = newValue.copyData


                        if (!selectedName && Array.isArray(helpData06)) {
                            selectedName = helpData06.find(
                                (item) =>
                                    item?.PJTName === checkCopyData ||
                                    item?.PJTNo === checkCopyData
                            );
                        }

                        if (selectedName) {
                            product[key] = selectedName.PJTName;
                            product["PJTNo"] = selectedName.PJTNo;
                            product["PJTSeq"] = selectedName.PJTSeq;
                        } else {
                            product[key] = "";
                            product["PJTNo"] = "";
                            product["PJTSeq"] = "";
                        }

                        product.isEdited = true;
                        product["IdxNo"] = row + 1;

                        const cs = product["Status"] || "U";
                        product["Status"] = cs === "A" ? "A" : "U";

                        return newData;
                    });
                    return;
                }
            }
            if (key === "ResrcName") {
                const person = gridData[row];
                const isPJTNoTrue = person?.ISStd === false || person?.ISStd === 0 || person?.ISStd === '';

                // Case 1: ISStd = TRUE → text input
                if (isPJTNoTrue) {
                    setGridData(prev => {
                        const newData = [...prev];

                        if (!newData[row]) newData[row] = {};   // FIX 💥

                        newData[row][key] = newValue.data;
                        newData[row].isEdited = true;

                        const cs = newData[row].Status || "U";
                        newData[row].Status = cs === "A" ? "A" : "U";

                        return newData;
                    });
                    return;
                }

                // Case 2: ISStd = FALSE → custom selector
                if (newValue.kind === GridCellKind.Custom) {
                    setGridData(prev => {
                        const newData = [...prev];

                        if (!newData[row]) newData[row] = {};   // FIX 💥

                        const product = newData[row];
                        let selectedName = newValue.data[0]

                        const checkCopyData = newValue.copyData


                        if (!selectedName && Array.isArray(helpData07)) {
                            selectedName = helpData07.find(
                                (item) =>
                                    item?.ItemName === checkCopyData ||
                                    item?.ItemCode === checkCopyData
                            );
                        }

                        if (selectedName) {
                            product[key] = selectedName.ItemName;
                            product["ItemSeq"] = selectedName.ItemSeq;
                            product["ResrcSeq"] = selectedName.ItemSeq;
                            product["ItemNo"] = selectedName.ItemNo;
                        } else {
                            product[key] = "";
                            product["ItemSeq"] = "";
                            product["ResrcSeq"] = "";
                            product["ItemNo"] = "";
                        }

                        product.isEdited = true;
                        product["IdxNo"] = row + 1;

                        const cs = product["Status"] || "U";
                        product["Status"] = cs === "A" ? "A" : "U";

                        return newData;
                    });
                    return;
                }
            }



            if (key === "Qty") {
                setGridData((prev) => {
                    const newData = [...prev];
                    if (!newData[row]) newData[row] = {};

                    newData[row][key] = Number(newValue.data) || 0;

                    const qty = Number(newData[row]["Qty"]) || 0;
                    const price = Number(newData[row]["Price"]) || 0;
                    const domAmt = Number(newData[row]["DomAmt"]) || 0;

                    const amt = parseFloat((qty * domAmt * price).toFixed(2));
                    newData[row]["Amt"] = amt;

                    newData[row]["SumAmt"] = parseFloat(((Number(newData[row]["Amt"]) || 0) + (Number(newData[row]["VATAmt"]) || 0)).toFixed(2));

                    newData[row].isEdited = true;
                    newData[row].IdxNo = row + 1;

                    const currentStatus = newData[row]["Status"] || "U";
                    newData[row]["Status"] = currentStatus === "A" ? "A" : "U";

                    return newData;
                });

                return;
            }
            if (key === "DomAmt") {
                setGridData((prev) => {
                    const newData = [...prev];
                    if (!newData[row]) newData[row] = {};

                    newData[row][key] = Number(newValue.data) || 0;

                    const qty = Number(newData[row]["Qty"]) || 0;
                    const price = Number(newData[row]["Price"]) || 0;
                    const domAmt = Number(newData[row]["DomAmt"]) || 0;

                    const amt = parseFloat((qty * domAmt * price).toFixed(2));
                    newData[row]["Amt"] = amt;

                    newData[row]["SumAmt"] = parseFloat(((Number(newData[row]["Amt"]) || 0) + (Number(newData[row]["VATAmt"]) || 0)).toFixed(2));

                    newData[row].isEdited = true;
                    newData[row].IdxNo = row + 1;

                    const currentStatus = newData[row]["Status"] || "U";
                    newData[row]["Status"] = currentStatus === "A" ? "A" : "U";

                    return newData;
                });

                return;
            }
            if (key === "Price") {
                setGridData((prev) => {
                    const newData = [...prev];
                    if (!newData[row]) newData[row] = {};

                    newData[row][key] = Number(newValue.data) || 0;

                    const qty = Number(newData[row]["Qty"]) || 0;
                    const price = Number(newData[row]["Price"]) || 0;
                    const domAmt = Number(newData[row]["DomAmt"]) || 0;
                    const amt = parseFloat((qty * domAmt * price).toFixed(2));
                    newData[row]["Amt"] = amt;
                    newData[row]["SumAmt"] = parseFloat(((Number(newData[row]["Amt"]) || 0) + (Number(newData[row]["VATAmt"]) || 0)).toFixed(2));



                    newData[row].isEdited = true;
                    newData[row].IdxNo = row + 1;

                    const currentStatus = newData[row]["Status"] || "U";
                    newData[row]["Status"] = currentStatus === "A" ? "A" : "U";

                    return newData;
                });

                return;
            }
            if (key === "Amt") {
                setGridData((prev) => {
                    const newData = [...prev];
                    if (!newData[row]) newData[row] = {};

                    newData[row][key] = Number(newValue.data) || 0;

                    const Amt = Number(newData[row]["Amt"]) || 0;
                    const VATAmt = Number(newData[row]["VATAmt"]) || 0;

                    const SumAmt = parseFloat((Amt + VATAmt).toFixed(2));
                    newData[row]["SumAmt"] = SumAmt;


                    newData[row].isEdited = true;
                    newData[row].IdxNo = row + 1;

                    const currentStatus = newData[row]["Status"] || "U";
                    newData[row]["Status"] = currentStatus === "A" ? "A" : "U";

                    return newData;
                });

                return;
            }
            if (key === "VATAmt") {
                setGridData((prev) => {
                    const newData = [...prev];
                    if (!newData[row]) newData[row] = {};

                    newData[row][key] = Number(newValue.data) || 0;

                    const Amt = Number(newData[row]["Amt"]) || 0;
                    const VATAmt = Number(newData[row]["VATAmt"]) || 0;

                    const SumAmt = parseFloat((Amt + VATAmt).toFixed(2));
                    newData[row]["SumAmt"] = SumAmt;


                    newData[row].isEdited = true;
                    newData[row].IdxNo = row + 1;

                    const currentStatus = newData[row]["Status"] || "U";
                    newData[row]["Status"] = currentStatus === "A" ? "A" : "U";

                    return newData;
                });

                return;
            }

            // === XỬ LÝ CÁC CELL KHÁC ===
            setGridData((prevData) => {
                const updated = [...prevData];
                if (!updated[row]) updated[row] = {};

                const cs = updated[row]["Status"] || "";
                updated[row][key] = newValue.data;
                updated[row]["Status"] = cs === "A" ? "A" : "U";

                return updated;
            });
        },
        [cols, gridData, helpData06, helpData07]
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
            saveToLocalStorageSheet('pm01_h', newHidden)
            return newHidden
        })
    }

    const updateVisibleColumns = (newVisibleColumns) => {
        setCols((prevCols) => {
            const newCols = [...new Set([...prevCols, ...newVisibleColumns])]
            const uniqueCols = newCols.filter(
                (col, index, self) => index === self.findIndex((c) => c.id === col.id)
            )
            saveToLocalStorageSheet('pm01_a', uniqueCols)
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
                saveToLocalStorageSheet('pm01_a', uniqueCols)
                return uniqueCols
            })
            setShowMenu(null)
        }
    }
    // Hàm rEST LẤY LẠI CỘT DỮ LIỆU

    const handleReset = () => {
        setCols(defaultCols.filter((col) => col.visible))
        setHiddenColumns([])
        localStorage.removeItem('pm01_a')
        localStorage.removeItem('pm01_h')
    }

    const onColumnMoved = useCallback((startIndex, endIndex) => {
        setCols((prevCols) => {
            const updatedCols = [...prevCols]
            const [movedColumn] = updatedCols.splice(startIndex, 1)
            updatedCols.splice(endIndex, 0, movedColumn)
            saveToLocalStorageSheet('pm01_a', updatedCols)
            return updatedCols
        })
    }, [])

    const showDrawer = () => {
        const invisibleCols = defaultCols.filter((col) => col.visible === false).map((col) => col.id)
        const currentVisibleCols = loadFromLocalStorageSheet('pm01_a', []).map(
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
                saveToLocalStorageSheet('pm01_a', newCols)
                return newCols
            })
            setHiddenColumns((prevHidden) => {
                const newHidden = prevHidden.filter((id) => id !== columnId)
                saveToLocalStorageSheet('pm01_h', newHidden)
                return newHidden
            })
        } else {
            setCols((prevCols) => {
                const newCols = prevCols.filter((col) => col.id !== columnId)
                saveToLocalStorageSheet('pm01_a', newCols)
                return newCols
            })
            setHiddenColumns((prevHidden) => {
                const newHidden = [...prevHidden, columnId]
                saveToLocalStorageSheet('pm01_h', newHidden)
                return newHidden
            })
        }
    }

    return (
        <div className="w-full gap-1 h-full flex items-center justify-center">
            <div className="w-full h-full flex flex-col  bg-white  overflow-hidden ">
                <h2 className="text-[10px]  text-blue-600 border-b font-medium flex items-center gap-2 p-1  uppercase">
                    {t('DANH SÁCH NGUỒN CUNG ỨNG')}
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
                    rowHeight={25}
                    smoothScrollY={false}
                    smoothScrollX={false}
                    onPaste={true}
                    fillHandle={true}
                    freezeTrailingRows={1}
                    onColumnResize={onColumnResize}
                    onHeaderMenuClick={onHeaderMenuClick}
                    onColumnMoved={onColumnMoved}
                    onKeyUp={onKeyUp}
                    customRenderers={[CellsPJTNo, CellsResrcName]}
                    onCellEdited={onCellEdited}
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
                                    handleRowAppend={handleRowAppend}
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

export default PM01Table
