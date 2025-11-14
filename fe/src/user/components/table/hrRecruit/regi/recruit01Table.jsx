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
import { CellsUMEmpType } from '../../../sheet/cells/cellsUmEmpType'
import { Cells30001 } from '../../../sheet/cells/cells30001'
import { Cells30002 } from '../../../sheet/cells/cells30002'
import { Cells30003 } from '../../../sheet/cells/cells30003'
import { Cells30004 } from '../../../sheet/cells/cells30004'
import { Cells30005 } from '../../../sheet/cells/cells30005'
import { Cells30006 } from '../../../sheet/cells/cells30006'
import { Cells30007 } from '../../../sheet/cells/cells30007'
import { Cells30014 } from '../../../sheet/cells/cells30014'
import { CellsEmpSp } from '../../../sheet/cells/cellsEmpsSp'
import moment from 'moment'

function Recruit01Table({
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
    helpData02,
    helpData03,
    helpData04,
    helpData05,
    helpData06,
    helpData07,
    helpData08,
    helpData10
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
        return loadFromLocalStorageSheet('recruitment01_h', [])
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
        'EmpName',
        'CheckAge'

    ])];

    const highlightRegions = [
        'RecruitmentName',
        'PartName',
        'Team',
        'Department',
        'JopPositionName',
        'Degree',
        'SMSexName',
        'Interviewer',
        'CategoryTypeName'
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
    const getData = useCallback(
        ([col, row]) => {
            const person = gridData[row] || {}
            const column = cols[col]
            const columnKey = column?.id || ''
            const value = person[columnKey] || ''
            const cellConfig = {
                Degree: {
                    kind: 'cell-30001',
                    allowedValues: helpData01,
                },
                SMSexName: {
                    kind: 'cell-30002',
                    allowedValues: helpData02,
                },
                RecruitmentName: {
                    kind: 'cell-30003',
                    allowedValues: helpData03,
                },
                Department: {
                    kind: 'cell-30004',
                    allowedValues: helpData04,
                },
                Team: {
                    kind: 'cell-30005',
                    allowedValues: helpData05,
                },
                PartName: {
                    kind: 'cell-30006',
                    allowedValues: helpData06,
                },
                JopPositionName: {
                    kind: 'cell-30007',
                    allowedValues: helpData07,
                },
                Interviewer: {
                    kind: 'cell-emp-sp',
                    allowedValues: helpData08,
                },
                CategoryTypeName: {
                    kind: 'cell-30014',
                    allowedValues: helpData10,
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
                        value: value,
                    },
                    displayData: String(value),
                    readonly: column?.readonly || false,
                    hasMenu: column?.hasMenu || false,
                }
            }
            if (
                columnKey === "EntDate" ||
                columnKey === "BirthDate" ||
                columnKey === "IssueDate" ||
                columnKey === "InterviewDate"
            ) {
                const rawText = value?.toString?.() || "";
                const cleaned = rawText.replace(/[^\d]/g, "");

                let dataValue = "";
                let displayValue = "";

                if (cleaned.length === 8) {
                    // YYYYMMDD
                    dataValue = cleaned;
                    displayValue = moment(cleaned, "YYYYMMDD").format("YYYY-MM-DD");
                } else if (cleaned.length === 6) {
                    // YYYYMM
                    dataValue = cleaned + "01";
                    displayValue = moment(dataValue, "YYYYMMDD").format("YYYY-MM-DD");
                } else if (cleaned.length === 4) {
                    // MMDD → gán năm hiện tại
                    const year = new Date().getFullYear();
                    dataValue = `${year}${cleaned}`;
                    displayValue = moment(dataValue, "YYYYMMDD").format("YYYY-MM-DD");
                } else if (cleaned.length === 2) {
                    // DD → gán tháng/năm hiện tại
                    const now = new Date();
                    const year = now.getFullYear();
                    const month = (now.getMonth() + 1).toString().padStart(2, "0");
                    dataValue = `${year}${month}${cleaned}`;
                    displayValue = moment(dataValue, "YYYYMMDD").format("YYYY-MM-DD");
                }

                const isValid = moment(dataValue, "YYYYMMDD", true).isValid();

                return {
                    kind: GridCellKind.Text,
                    data: isValid ? dataValue : "",
                    displayData: isValid ? displayValue : rawText, // fallback raw
                    copyData: isValid ? dataValue : "",
                    readonly: column?.readonly || false,
                    allowOverlay: true,
                    hasMenu: column?.hasMenu || false,
                    contentAlign: "right",
                };
            }



            if (columnKey === "ResidID" || columnKey === "PhoneNumber") {
                const rawText = value?.toString?.() || "";

                const numericValue = rawText.replace(/\D/g, "");

                return {
                    kind: GridCellKind.Text,
                    data: numericValue,
                    displayData: numericValue,
                    copyData: numericValue,
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
                hasMenu: column?.hasMenu || false
            }
        },
        [gridData, cols, helpData01, helpData02, helpData03, helpData04, helpData05, helpData06, helpData07, helpData08, helpData10]
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

    const calculateAgeDetail = (birthDateStr) => {
        if (!birthDateStr || birthDateStr.length !== 8) return '';
        const now = new Date();
        const yyyy = parseInt(birthDateStr.slice(0, 4), 10);
        const mm = parseInt(birthDateStr.slice(4, 6), 10) - 1;
        const dd = parseInt(birthDateStr.slice(6, 8), 10);

        const birthDate = new Date(yyyy, mm, dd);
        if (isNaN(birthDate.getTime())) return '';

        let years = now.getFullYear() - birthDate.getFullYear();
        let months = now.getMonth() - birthDate.getMonth();
        let days = now.getDate() - birthDate.getDate();

        if (days < 0) {
            months--;
            days += new Date(now.getFullYear(), now.getMonth(), 0).getDate();
        }

        if (months < 0) {
            years--;
            months += 12;
        }

        return `${years}y${months}m${days}d`;
    };

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
            if (
                key === 'BirthDate' || key === 'EntDate' || key === 'IssueDate' || key === 'InterviewDate'
            ) {
                if (newValue.kind === GridCellKind.Text) {
                    const parseFlexibleDate = (val) => {
                        if (!val || typeof val !== 'string') return '';

                        const cleaned = val.replace(/[^\d]/g, '');

                        if (cleaned.length === 8) return cleaned;
                        if (cleaned.length === 6) return cleaned + '01';
                        if (cleaned.length === 4) {
                            const year = new Date().getFullYear();
                            return `${year}${cleaned}`;
                        }
                        if (cleaned.length === 2) {
                            const now = new Date();
                            const year = now.getFullYear();
                            const month = (now.getMonth() + 1).toString().padStart(2, '0');
                            return `${year}${month}${cleaned}`;
                        }

                        return '';
                    };

                    const parsed = parseFlexibleDate(newValue.data || newValue.copyData);

                    setGridData((prev) => {
                        const newData = [...prev];
                        const product = newData[row];

                        product[key] = parsed;

                        // Nếu là BirthDate thì cũng tính lại CheckAge
                        if (key === 'BirthDate') {
                            product['CheckAge'] = calculateAgeDetail(parsed);
                        }

                        product.isEdited = true;
                        product['IdxNo'] = row + 1;
                        const currentStatus = product['Status'] || 'U';
                        product['Status'] = currentStatus === 'A' ? 'A' : 'U';

                        return newData;
                    });

                    return;
                }
            }

            /*       if (key === 'BirthDate') {
                      if (newValue.kind === GridCellKind.Text) {
                          setGridData((prev) => {
                              const newData = [...prev];
                              const product = newData[row];
      
                              const rawDate = newValue.data || newValue.copyData;
      
                              product[key] = rawDate;
                              product['CheckAge'] = calculateAgeDetail(rawDate);
      
                              product.isEdited = true;
                              product['IdxNo'] = row + 1;
                              const currentStatus = product['Status'] || 'U';
                              product['Status'] = currentStatus === 'A' ? 'A' : 'U';
      
                              return newData;
                          });
                          return;
                      }
                  }
       */
            if (key === 'EmpFamilyName' || key === 'EmpFirstName') {
                if (newValue.kind === GridCellKind.Text) {
                    setGridData((prev) => {
                        const newData = [...prev];
                        const product = newData[row];

                        product[key] = newValue.data;

                        const family = key === 'EmpFamilyName' ? newValue.data : product['EmpFamilyName'] || '';
                        const first = key === 'EmpFirstName' ? newValue.data : product['EmpFirstName'] || '';
                        product['EmpName'] = `${family} ${first}`.trim();

                        product.isEdited = true;
                        product['IdxNo'] = row + 1;
                        const currentStatus = product['Status'] || 'U';
                        product['Status'] = currentStatus === 'A' ? 'A' : 'U';

                        return newData;
                    });
                    return;
                }
            }
            if (
                key === 'PerAddrStreet' ||
                key === 'PerAddrWard' ||
                key === 'PerAddrDistrict' ||
                key === 'PerAddrProvince'
            ) {
                if (newValue.kind === GridCellKind.Text) {
                    setGridData((prev) => {
                        const newData = [...prev];
                        const product = newData[row];

                        product[key] = newValue.data;

                        const street = key === 'PerAddrStreet' ? newValue.data : product['PerAddrStreet'] || '';
                        const ward = key === 'PerAddrWard' ? newValue.data : product['PerAddrWard'] || '';
                        const district = key === 'PerAddrDistrict' ? newValue.data : product['PerAddrDistrict'] || '';
                        const province = key === 'PerAddrProvince' ? newValue.data : product['PerAddrProvince'] || '';

                        // Ghép địa chỉ quê quán đầy đủ
                        const parts = [street, ward, district, province].filter(Boolean);
                        product['Addr'] = parts.join(', ');

                        product.isEdited = true;
                        product['IdxNo'] = row + 1;
                        const currentStatus = product['Status'] || 'U';
                        product['Status'] = currentStatus === 'A' ? 'A' : 'U';

                        return newData;
                    });
                    return;
                }
            }
            if (
                key === 'CurAddrStreet' ||
                key === 'CurAddrWard' ||
                key === 'CurAddrDistrict' ||
                key === 'CurAddrProvince'
            ) {
                if (newValue.kind === GridCellKind.Text) {
                    setGridData((prev) => {
                        const newData = [...prev];
                        const product = newData[row];

                        product[key] = newValue.data;

                        const street = key === 'CurAddrStreet' ? newValue.data : product['CurAddrStreet'] || '';
                        const ward = key === 'CurAddrWard' ? newValue.data : product['CurAddrWard'] || '';
                        const district = key === 'CurAddrDistrict' ? newValue.data : product['CurAddrDistrict'] || '';
                        const province = key === 'CurAddrProvince' ? newValue.data : product['CurAddrProvince'] || '';

                        const parts = [street, ward, district, province].filter(Boolean);
                        product['Addr2'] = parts.join(', ');

                        product.isEdited = true;
                        product['IdxNo'] = row + 1;
                        const currentStatus = product['Status'] || 'U';
                        product['Status'] = currentStatus === 'A' ? 'A' : 'U';

                        return newData;
                    });
                    return;
                }
            }


            if (key === 'Degree') {
                if (newValue.kind === GridCellKind.Custom) {
                    setGridData((prev) => {
                        const newData = [...prev]
                        const product = newData[row]
                        let selectedName = newValue.data[0]
                        const checkCopyData = newValue.copyData
                        if (!selectedName && Array.isArray(helpData01)) {
                            selectedName = helpData01.find(
                                (item) => item?.DefineItemName === checkCopyData,
                            )
                        }
                        if (selectedName) {
                            product[cols[col].id] = selectedName.DefineItemName
                            product['DegreeSeq'] = selectedName.IdSeq
                        } else {
                            product[cols[col].id] = ''
                            product['DegreeSeq'] = ''
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
            if (key === 'SMSexName') {
                if (newValue.kind === GridCellKind.Custom) {
                    setGridData((prev) => {
                        const newData = [...prev]
                        const product = newData[row]
                        let selectedName = newValue.data[0]
                        const checkCopyData = newValue.copyData
                        if (!selectedName && Array.isArray(helpData02)) {
                            selectedName = helpData02.find(
                                (item) => item?.DefineItemName === checkCopyData,
                            )
                        }
                        if (selectedName) {
                            product[cols[col].id] = selectedName.DefineItemName
                            product['SMSexSeq'] = selectedName.IdSeq
                        } else {
                            product[cols[col].id] = ''
                            product['SMSexSeq'] = ''
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
            if (key === 'RecruitmentName') {
                if (newValue.kind === GridCellKind.Custom) {
                    setGridData((prev) => {
                        const newData = [...prev]
                        const product = newData[row]
                        let selectedName = newValue.data[0]
                        const checkCopyData = newValue.copyData
                        if (!selectedName && Array.isArray(helpData03)) {
                            selectedName = helpData03.find(
                                (item) => item?.DefineItemName === checkCopyData,
                            )
                        }
                        if (selectedName) {
                            product[cols[col].id] = selectedName.DefineItemName
                            product['RecruitmentSeq'] = selectedName.IdSeq
                        } else {
                            product[cols[col].id] = ''
                            product['RecruitmentSeq'] = ''
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
            if (key === 'Department') {
                if (newValue.kind === GridCellKind.Custom) {
                    setGridData((prev) => {
                        const newData = [...prev]
                        const product = newData[row]
                        let selectedName = newValue.data[0]
                        const checkCopyData = newValue.copyData
                        if (!selectedName && Array.isArray(helpData04)) {
                            selectedName = helpData04.find(
                                (item) => item?.DefineItemName === checkCopyData,
                            )
                        }
                        if (selectedName) {
                            product[cols[col].id] = selectedName.DefineItemName
                            product['DepartmentSeq'] = selectedName.IdSeq
                        } else {
                            product[cols[col].id] = ''
                            product['DepartmentSeq'] = ''
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
            if (key === 'Team') {
                if (newValue.kind === GridCellKind.Custom) {
                    setGridData((prev) => {
                        const newData = [...prev]
                        const product = newData[row]
                        let selectedName = newValue.data[0]
                        const checkCopyData = newValue.copyData
                        if (!selectedName && Array.isArray(helpData05)) {
                            selectedName = helpData05.find(
                                (item) => item?.DefineItemName === checkCopyData,
                            )
                        }
                        if (selectedName) {
                            product[cols[col].id] = selectedName.DefineItemName
                            product['TeamSeq'] = selectedName.IdSeq
                        } else {
                            product[cols[col].id] = ''
                            product['TeamSeq'] = ''
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
            if (key === 'PartName') {
                if (newValue.kind === GridCellKind.Custom) {
                    setGridData((prev) => {
                        const newData = [...prev]
                        const product = newData[row]
                        let selectedName = newValue.data[0]
                        const checkCopyData = newValue.copyData
                        if (!selectedName && Array.isArray(helpData06)) {
                            selectedName = helpData06.find(
                                (item) => item?.DefineItemName === checkCopyData,
                            )
                        }
                        if (selectedName) {
                            product[cols[col].id] = selectedName.DefineItemName
                            product['PartNameSeq'] = selectedName.IdSeq
                        } else {
                            product[cols[col].id] = ''
                            product['PartNameSeq'] = ''
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
            if (key === 'JopPositionName') {
                if (newValue.kind === GridCellKind.Custom) {
                    setGridData((prev) => {
                        const newData = [...prev]
                        const product = newData[row]
                        let selectedName = newValue.data[0]
                        const checkCopyData = newValue.copyData
                        if (!selectedName && Array.isArray(helpData07)) {
                            selectedName = helpData07.find(
                                (item) => item?.DefineItemName === checkCopyData,
                            )
                        }
                        if (selectedName) {
                            product[cols[col].id] = selectedName.DefineItemName
                            product['JopPositionSeq'] = selectedName.IdSeq
                        } else {
                            product[cols[col].id] = ''
                            product['JopPositionSeq'] = ''
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
            if (key === 'Interviewer') {
                if (newValue.kind === GridCellKind.Custom) {
                    setGridData((prev) => {
                        const newData = [...prev]
                        const product = newData[row]
                        let selectedName = newValue.data[0]
                        const checkCopyData = newValue.copyData
                        if (!selectedName && Array.isArray(helpData08)) {
                            selectedName = helpData08.find(
                                (item) => item?.EmpName === checkCopyData,
                            )
                        }
                        if (selectedName) {
                            product[cols[col].id] = selectedName.EmpName
                            product['InterviewerSeq'] = selectedName.EmpSeq
                        } else {
                            product[cols[col].id] = ''
                            product['InterviewerSeq'] = ''
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
            if (key === 'CategoryTypeName') {
                if (newValue.kind === GridCellKind.Custom) {
                    setGridData((prev) => {
                        const newData = [...prev]
                        const product = newData[row]
                        let selectedName = newValue.data[0]
                        const checkCopyData = newValue.copyData
                        if (!selectedName && Array.isArray(helpData10)) {
                            selectedName = helpData10.find(
                                (item) => item?.DefineItemName === checkCopyData,
                            )
                        }
                        if (selectedName) {
                            product[cols[col].id] = selectedName.DefineItemName
                            product['CategoryType'] = selectedName.IdSeq
                        } else {
                            product[cols[col].id] = ''
                            product['CategoryType'] = ''
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
            if (
                key === 'UMEmpType' || key === 'EmpSeq' || key === 'EmpName' || key === "CheckAge"
            ) {
                return;
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
        [cols, gridData, helpData01, helpData02, canEdit, helpData03, helpData04, helpData05,
            helpData06, helpData07,
            helpData10,
            helpData08
        ]
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
            saveToLocalStorageSheet('recruitment01_h', newHidden)
            return newHidden
        })
    }

    const updateVisibleColumns = (newVisibleColumns) => {
        setCols((prevCols) => {
            const newCols = [...new Set([...prevCols, ...newVisibleColumns])]
            const uniqueCols = newCols.filter(
                (col, index, self) => index === self.findIndex((c) => c.id === col.id)
            )
            saveToLocalStorageSheet('recruitment01_a', uniqueCols)
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
                saveToLocalStorageSheet('recruitment01_a', uniqueCols)
                return uniqueCols
            })
            setShowMenu(null)
        }
    }
    // Hàm rEST LẤY LẠI CỘT DỮ LIỆU

    const handleReset = () => {
        setCols(defaultCols.filter((col) => col.visible))
        setHiddenColumns([])
        localStorage.removeItem('recruitment01_a')
        localStorage.removeItem('recruitment01_h')
    }

    const onColumnMoved = useCallback((startIndex, endIndex) => {
        setCols((prevCols) => {
            const updatedCols = [...prevCols]
            const [movedColumn] = updatedCols.splice(startIndex, 1)
            updatedCols.splice(endIndex, 0, movedColumn)
            saveToLocalStorageSheet('recruitment01_a', updatedCols)
            return updatedCols
        })
    }, [])

    const showDrawer = () => {
        const invisibleCols = defaultCols.filter((col) => col.visible === false).map((col) => col.id)
        const currentVisibleCols = loadFromLocalStorageSheet('recruitment01_a', []).map(
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
                saveToLocalStorageSheet('recruitment01_a', newCols)
                return newCols
            })
            setHiddenColumns((prevHidden) => {
                const newHidden = prevHidden.filter((id) => id !== columnId)
                saveToLocalStorageSheet('recruitment01_h', newHidden)
                return newHidden
            })
        } else {
            setCols((prevCols) => {
                const newCols = prevCols.filter((col) => col.id !== columnId)
                saveToLocalStorageSheet('recruitment01_a', newCols)
                return newCols
            })
            setHiddenColumns((prevHidden) => {
                const newHidden = [...prevHidden, columnId]
                saveToLocalStorageSheet('recruitment01_h', newHidden)
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
                    customRenderers={[
                        Cells30001, Cells30002, Cells30003, Cells30004,
                        Cells30005, Cells30006, Cells30007,
                        CellsEmpSp,
                        Cells30014
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

export default Recruit01Table
