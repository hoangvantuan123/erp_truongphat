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
import TemNVLNewQuery from '../../query/mngTemNvl/TemNVLNewQuery'
import moment from 'moment'
import TemNVLNewBQuery from '../../query/mngTemNvl/temNVLNewBQuery'
import { CellsRepairCustName } from '../../sheet/cells/cellsRepairCustName'
import { CellsItemNameV5 } from '../../sheet/cells/cellsItemNameV5'
import { CellsBagType } from '../../sheet/cells/cellsBagType'
function TemNVLNewTable({
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
    canEdit,
    handleRestSheet,


    helpData01,
    setSearchText,
    searchText,
    setDataSearch,

    setAssetName,
    setAssetCode,
    AssetCode,
    AssetName,


    helpData02,
    helpData03,
    setSearchText2,
    searchText2,
    setDataSearch2,
    setHelpData02,
    setHelpData01,
    handleRowAppend,
    typeOptions,
    setHelpData03,


    setFormDate,
    formDate,
    toDate,
    setToDate,

    LotNo,
    setLotNo,
    ItemName,
    setItemName,
    ItemNo,
    setItemNo,


    setDataSearch3,
    setSearchText3,
    searchText3,
    setItemText3,
    setDataSheetSearch3,
    setBagType,
    QrCode,
    setQrCode,
    setDisplayValue2,
    displayValue2
}) {
    const gridRef = useRef(null)
    const [open, setOpen] = useState(false)
    const cellProps = useExtraCells()
    const enableAutoCodeGen = true;
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
        return loadFromLocalStorageSheet('as_03_h', [])
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
        'ItemName',
        'CustName',
        'BagTypeName'

    ];

    const grayColumns = [
        'ItemNo',
        'Spec',
        'QrCodeOld',
        'LotNoFull',
        'UnitName'

    ];
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
                ItemName: {
                    kind: 'item-name-cell-v5',
                    allowedValues: helpData01,
                    setCacheData: setHelpData01,
                },
                CustName: {
                    kind: 'cell-RepairCustName',
                    allowedValues: helpData02,
                    setCacheData: setHelpData02,
                },
                BagTypeName: {
                    kind: 'cell-bag-type',
                    allowedValues: helpData03,
                    setCacheData: setHelpData03,
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

            if (columnKey === "Qty" || columnKey === "ReelNo") {
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
            if (columnKey === "ReelNo") {
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
                        maximumFractionDigits: 2,
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
            if (
                columnKey === "StockInDate" ||
                columnKey === "ProduDate"
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
        [gridData, cols,
            helpData01, helpData02,
            helpData03
        ]
    )

    const onCellClicked = useCallback(
        (cell, event) => {
            const indexes = reorderColumns(cols)
        },
        [cols, gridData]
    )

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
                newValue.kind !== GridCellKind.Number &&
                newValue.kind !== GridCellKind.Boolean
            ) {
                return
            }

            const indexes = reorderColumns(cols)
            const [col, row] = cell
            const key = indexes[col]

            if (grayColumns.includes(key)) {
                return;
            }


            /*  if (key === "Qty") {
                 const rawText = newValue.data?.toString() || "";
                 const cleaned = rawText.replace(/[^\d]/g, "");
 
                 let dataValue = "";
 
                 if (cleaned === "") {
                     dataValue = "";
                 } else {
                     const numberValue = Number(cleaned);
 
                     if (numberValue <= 0) {
                         return;
                     }
 
                     dataValue = numberValue;
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
             } */

            if (key === "Qty") {
                const rawText = newValue.data?.toString() || "";
                // Cho phép dấu chấm (.) để nhập số thập phân
                const cleaned = rawText.replace(/[^\d.]/g, "");

                let dataValue = "";

                if (cleaned === "" || cleaned === ".") {
                    dataValue = "";
                } else {
                    const numberValue = Number(cleaned);

                    // Kiểm tra nếu không phải số hợp lệ
                    if (isNaN(numberValue) || numberValue <= 0) {
                        return;
                    }

                    // Giữ lại 2 chữ số sau dấu phẩy (nếu cần làm tròn)
                    dataValue = parseFloat(numberValue.toFixed(2));
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

            if (key === "ReelNo") {
                const rawText = newValue.data?.toString() || "";
                const cleaned = rawText.replace(/[^\d]/g, "");

                let dataValue = "";

                if (cleaned === "") {
                    dataValue = "";
                } else {
                    const numberValue = Number(cleaned);

                    if (numberValue <= 0) {
                        return;
                    }

                    dataValue = numberValue;
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


            if (key === "StockInDate") {
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
            if (key === "ProduDate") {
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
            if (key === "LotNo") {
                const rawText = newValue.data?.toString() || "";
                const cleaned = rawText.replace(/[\/\\@#\$%\^&\*\(\)\+=\[\]\{\};:'",<>?~`!]/g, "");

                setGridData((prevData) => {
                    const updatedData = [...prevData];
                    if (!updatedData[row]) updatedData[row] = {};

                    const currentStatus = updatedData[row]["Status"] || "";
                    updatedData[row][key] = cleaned;
                    updatedData[row]["Status"] = currentStatus === "A" ? "A" : "U";

                    return updatedData;
                });

                return;
            }



            if (key === 'CustName') {
                if (newValue.kind === GridCellKind.Custom) {
                    setGridData((prev) => {
                        const newData = [...prev]
                        const product = newData[row]
                        let selectedName = newValue.data[0]
                        const checkCopyData = newValue.copyData
                        if (!selectedName && Array.isArray(helpData02)) {

                            selectedName = helpData02.find(
                                (item) =>
                                    item?.CustName === checkCopyData ||
                                    item?.CustNo === checkCopyData ||
                                    item?.BizNo === checkCopyData
                            );
                        }
                        if (selectedName) {
                            product[cols[col].id] = selectedName.CustName
                            product['CustSeq'] = selectedName.CustSeq
                            product['CustNo'] = selectedName.CustNo
                        } else {
                            product[cols[col].id] = ''
                            product['CustSeq'] = ''
                            product['CustNo'] = ''
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
            if (key === 'BagTypeName') {
                if (newValue.kind === GridCellKind.Custom) {
                    setGridData((prev) => {
                        const newData = [...prev]
                        const product = newData[row]
                        let selectedName = newValue.data[0]
                        const checkCopyData = newValue.copyData
                        if (!selectedName && Array.isArray(helpData03)) {

                            selectedName = helpData03.find(
                                (item) =>
                                    item?.description === checkCopyData

                            );
                        }
                        if (selectedName) {
                            product[cols[col].id] = selectedName.description
                            product['BagType'] = selectedName.id
                        } else {
                            product[cols[col].id] = ''
                            product['BagType'] = ''
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



            if (key === 'ItemName') {
                if (newValue.kind === GridCellKind.Custom) {
                    setGridData((prev) => {
                        const newData = [...prev]
                        const product = newData[row]
                        let selectedName = newValue.data[0]
                        const checkCopyData = newValue.copyData
                        if (!selectedName && Array.isArray(helpData01)) {

                            selectedName = helpData01.find(
                                (item) =>
                                    item?.ItemName === checkCopyData ||
                                    item?.ItemNo === checkCopyData
                            );
                        }
                        if (selectedName) {
                            product[cols[col].id] = selectedName.ItemName
                            product['ItemSeq'] = selectedName.ItemSeq
                            product['ItemNo'] = selectedName.ItemNo
                            product['Spec'] = selectedName.Spec
                            product['UnitSeq'] = selectedName.UnitSeq
                            product['UnitName'] = selectedName.UnitName
                        } else {
                            product[cols[col].id] = ''
                            product['ItemSeq'] = ''
                            product['ItemNo'] = ''
                            product['Spec'] = ''
                            product['UnitName'] = ''
                            product['UnitSeq'] = ''
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
        [cols, gridData, helpData02, helpData01]
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
            saveToLocalStorageSheet('as_03_h', newHidden)
            return newHidden
        })
    }

    const updateVisibleColumns = (newVisibleColumns) => {
        setCols((prevCols) => {
            const newCols = [...new Set([...prevCols, ...newVisibleColumns])]
            const uniqueCols = newCols.filter(
                (col, index, self) => index === self.findIndex((c) => c.id === col.id)
            )
            saveToLocalStorageSheet('as_03_a', uniqueCols)
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
                saveToLocalStorageSheet('as_03_a', uniqueCols)
                return uniqueCols
            })
            setShowMenu(null)
        }
    }
    // Hàm rEST LẤY LẠI CỘT DỮ LIỆU

    const handleReset = () => {
        setCols(defaultCols.filter((col) => col.visible))
        setHiddenColumns([])
        localStorage.removeItem('as_03_a')
        localStorage.removeItem('as_03_h')
    }

    const onColumnMoved = useCallback((startIndex, endIndex) => {
        setCols((prevCols) => {
            const updatedCols = [...prevCols]
            const [movedColumn] = updatedCols.splice(startIndex, 1)
            updatedCols.splice(endIndex, 0, movedColumn)
            saveToLocalStorageSheet('as_03_a', updatedCols)
            return updatedCols
        })
    }, [])

    const showDrawer = () => {
        const invisibleCols = defaultCols.filter((col) => col.visible === false).map((col) => col.id)
        const currentVisibleCols = loadFromLocalStorageSheet('as_03_a', []).map(
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
                saveToLocalStorageSheet('as_03_a', newCols)
                return newCols
            })
            setHiddenColumns((prevHidden) => {
                const newHidden = prevHidden.filter((id) => id !== columnId)
                saveToLocalStorageSheet('as_03_h', newHidden)
                return newHidden
            })
        } else {
            setCols((prevCols) => {
                const newCols = prevCols.filter((col) => col.id !== columnId)
                saveToLocalStorageSheet('as_03_a', newCols)
                return newCols
            })
            setHiddenColumns((prevHidden) => {
                const newHidden = [...prevHidden, columnId]
                saveToLocalStorageSheet('as_03_h', newHidden)
                return newHidden
            })
        }
    }

    return (
        <div className="w-full gap-1 h-full flex items-center justify-center">
            <div className="w-full h-full flex flex-col  bg-white  overflow-hidden ">
                <div className='flex items-center px-2 p-1 justify-between text-[13px]  border-b text-black  font-medium'>
                    <span>ĐIỀU KIỆN TRUY VẤN</span>
                </div>
                <TemNVLNewQuery


                    helpData01={helpData01}
                    setSearchText={setSearchText}
                    searchText={searchText}
                    setDataSearch={setDataSearch}
                    setDataSheetSearch3={setDataSheetSearch3}

                    formDate={formDate}
                    setFormDate={setFormDate}
                    toDate={toDate}
                    setToDate={setToDate}


                    LotNo={LotNo}
                    setLotNo={setLotNo}
                    ItemName={ItemName}
                    setItemName={setItemName}
                    ItemNo={ItemNo}
                    setItemNo={setItemNo}

                    helpData02={helpData02}
                    setSearchText3={setSearchText3}
                    searchText3={searchText3}
                    setDataSearch3={setDataSearch3}
                    setItemText3={setItemText3}
                    setBagType={setBagType}
                    helpData03={helpData03}
                    QrCode={QrCode}
                    setQrCode={setQrCode}
                    displayValue2={displayValue2}
                    setDisplayValue2={setDisplayValue2}



                />
                <div className='flex items-center px-2 p-1 justify-between border-b text-[10px]  border-t   text-blue-500 font-medium'>
                    <span>DANH SÁCH NGUYÊN VẬT LIỆU</span>
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
                    onColumnResize={onColumnResize}
                    onCellEdited={onCellEdited}
                    onHeaderMenuClick={onHeaderMenuClick}
                    onColumnMoved={onColumnMoved}
                    onKeyUp={onKeyUp}

                    customRenderers={[CellsItemNameV5, CellsRepairCustName, CellsBagType]}

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

export default TemNVLNewTable
