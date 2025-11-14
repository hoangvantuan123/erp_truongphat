import {
    getMiddleCenterBias,
    GridCellKind,
    TextCellEntry,
    useTheme,
    DataEditor,
} from '@glideapps/glide-data-grid'
import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { SearchOutlined, TableOutlined, LoadingOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { debounce } from 'lodash'
import { GetCodeHelp } from '../../../../features/codeHelp/getCodeHelp'
import { GetCodeHelpVer2 } from '../../../../features/codeHelp/getCodeHelpVer2'
export const Editor = (p) => {
    const { t } = useTranslation()
    const { value: cell, onFinishedEditing } = p
    const { allowedValues = [], setCacheData = [], value: valueIn } = cell.data
    const [searchText, setSearchText] = useState(valueIn)
    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false);
    const dropdownRef = useRef(null)
    const [hoverRow, setHoverRow] = useState(undefined)

    const defaultCols = useMemo(() => [
        {
            title: 'Số lệnh sản xuất',
            id: 'WorkOrderNo',
            kind: 'Text',
            readonly: true,
            width: 200,
            hasMenu: true,
            visible: true,
        },
        {
            title: 'Mã chỉ thị làm việc',
            id: 'WorkOrderSeq',
            kind: 'Text',
            readonly: true,
            width: 200,
            hasMenu: true,
            visible: true,
        },
        {
            title: 'Số kế hoạch sản xuất',
            id: 'ProdPlanNo',
            kind: 'Text',
            readonly: true,
            width: 200,
            hasMenu: true,
            visible: true,
        },
        {
            title: 'Tên thành phẩm',
            id: 'GoodItemName',
            kind: 'Text',
            readonly: true,
            width: 200,
            hasMenu: true,
            visible: true,
        },
        {
            title: 'Mã thành phẩm',
            id: 'GoodItemNo',
            kind: 'Text',
            readonly: true,
            width: 200,
            hasMenu: true,
            visible: true,
        },
        {
            title: 'Quy cách thành phẩm',
            id: 'GoodItemSpec',
            kind: 'Text',
            readonly: true,
            width: 200,
            hasMenu: true,
            visible: true,
        },
        {
            title: 'Tên SP công đoạn',
            id: 'AssyItemName',
            kind: 'Text',
            readonly: true,
            width: 200,
            hasMenu: true,
            visible: true,
        },
        {
            title: 'Mã SP công đoạn',
            id: 'AssyItemNo',
            kind: 'Text',
            readonly: true,
            width: 200,
            hasMenu: true,
            visible: true,
        },
        {
            title: 'Quy cách sản phẩm công đoạn',
            id: 'AssyItemSpec',
            kind: 'Text',
            readonly: true,
            width: 200,
            hasMenu: true,
            visible: true,
        },
        {
            title: 'Công đoạn',
            id: 'ProcName',
            kind: 'Text',
            readonly: true,
            width: 200,
            hasMenu: true,
            visible: true,
        },
        {
            title: 'Đơn vị',
            id: 'ProdUnitName',
            kind: 'Text',
            readonly: true,
            width: 200,
            hasMenu: true,
            visible: true,
        },
        {
            title: 'Work center',
            id: 'WorkCenterName',
            kind: 'Text',
            readonly: true,
            width: 200,
            hasMenu: true,
            visible: true,
        },
        {
            title: 'Số lượng chỉ thị',
            id: 'OrderQty',
            kind: 'Text',
            readonly: true,
            width: 200,
            hasMenu: true,
            visible: true,
        },
        {
            title: 'Chênh lệch trình tự',
            id: 'ProcRevName',
            kind: 'Text',
            readonly: true,
            width: 200,
            hasMenu: true,
            visible: true,
        },
        {
            title: 'Phiên bản BOM',
            id: 'ItemBomRevName',
            kind: 'Text',
            readonly: true,
            width: 200,
            hasMenu: true,
            visible: true,
        },

    ], []);
    const controllers = useRef({});
    const [cols, setCols] = useState(defaultCols)
    const onItemHovered = useCallback((args) => {
        const [_, row] = args.location
        setHoverRow(args.kind !== 'cell' ? undefined : row)
    }, [])

    const [extraData, setExtraData] = useState([]);


    const debounceCallGetCodeHelp = useMemo(() =>
        debounce(async (key) => {
            if (!key.trim()) return;

            // Kiểm tra và hủy bỏ API đang chạy
            if (controllers.current.debounceCallGetCodeHelp) {
                controllers.current.debounceCallGetCodeHelp.abort();
                controllers.current.debounceCallGetCodeHelp = null;
                await new Promise((resolve) => setTimeout(resolve, 50)); // Đảm bảo debounce không quá nhanh
            }

            setIsLoading(true); // Bắt đầu loading
            const controller = new AbortController(); // Tạo controller mới để hủy request
            controllers.current.debounceCallGetCodeHelp = controller; // Gán controller cho global object

            try {
                const result = await GetCodeHelpVer2(
                    18086, key, "", "1015", "", "", "1", 1, 50, "IsComplete = ''0''", 2, 1, 1, controller.signal, 28155
                );
                setExtraData(result.data || []); // Lưu dữ liệu trả về từ API
            } catch (error) {
                if (error.name !== "AbortError") {
                    setExtraData([]); // Xử lý khi API bị lỗi
                }
            } finally {
                setIsLoading(false); // Dừng loading
                controllers.current.debounceCallGetCodeHelp = null; // Đặt lại controller
            }
        }, 300), [] // Tăng thời gian debounce lên 300ms
    );

    const filteredData = useMemo(() => {
        if (!searchText) return allowedValues;

        const normalizeText = (text) =>
            typeof text === "string" || typeof text === "number"
                ? text.toString().toLowerCase().trim()
                : "";

        const search = normalizeText(searchText);
        const propertiesToSearch = ["WorkOrderNo", "ProdPlanNo"];

        return allowedValues.filter((item) =>
            propertiesToSearch.some((attr) => {
                const value = item[attr];
                return value && normalizeText(value).includes(search);
            })
        );
    }, [searchText, allowedValues]);

    const finalFilteredData = useMemo(() => {
        const existingItemSeqs = new Set(filteredData.map((item) => item.WorkOrderSeq));
        const newData = extraData.filter((item) => !existingItemSeqs.has(item.WorkOrderSeq));
        setCacheData((prev) => {
            const existingItemSeqs = new Set(prev.map((item) => item.WorkOrderSeq));
            const newData = extraData.filter((item) => !existingItemSeqs.has(item.WorkOrderSeq));
            return [...prev, ...newData];
        });
        return [...filteredData, ...newData];
    }, [filteredData, extraData]);

    const handleOnChange = useCallback(
        (val) => {
            const value = val.target.value;
            setSearchText(value);
            setIsOpen(true);

            if (value) {
                debounceCallGetCodeHelp(value); // Gọi API với giá trị tìm kiếm
            }
        },
        [debounceCallGetCodeHelp] // Thêm dependency để callback luôn có latest version của debounce
    );


    const handleRowClick = (record) => {
        onFinishedEditing({
            ...cell,
            data: [record],
        })
    }


    const handleCellClick = (cell) => {
        const rowIndex = cell[1]
        if (rowIndex >= 0 && rowIndex < finalFilteredData.length) {
            handleRowClick(finalFilteredData[rowIndex])
        }
    }

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    if (cell.readonly) {
        return (
            <div className="p-2">
                <TextCellEntry highlight={true} autoFocus={false} disabled={true} />
            </div>
        )
    }

    const onColumnResize = useCallback(
        (column, newSize) => {
            const index = cols.findIndex((col) => col.title === column.title)
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
    const getData = useCallback(
        ([col, row]) => {
            const person = finalFilteredData[row] || {};
            const column = cols[col];
            const columnKey = column?.id || '';
            const value = person[columnKey] || '';

            return {
                kind: GridCellKind.Text,
                data: value,
                displayData: String(value),
                readonly: column?.readonly || false,
                allowOverlay: true,
            };
        },
        [finalFilteredData, cols]
    );
    return (
        <div ref={dropdownRef} className="">
            <h2 className="text-xs font-medium flex items-center gap-2 p-2 text-blue-600 uppercase">
                <TableOutlined />
                Số lệnh sản xuất
            </h2>
            <div className="p-2 border-b border-t">
                <div className="w-full flex gap-2">
                    <button
                        onClick={() => {
                            if (!isLoading) {
                                debounceCallGetCodeHelp(searchText);
                            }
                        }}
                        className="opacity-80 size-5 cursor-pointer"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <LoadingOutlined className="animate-spin" />
                        ) : (
                            <SearchOutlined />
                        )}
                    </button>
                    <input
                        highlight={true}
                        autoFocus={true}
                        className="h-full w-full border-none focus:outline-none hover:border-none bg-inherit"
                        value={searchText}
                        placeholder="Nhập từ khóa để tìm kiếm..."
                        onChange={handleOnChange}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && filteredData.length > 0) {
                                handleRowClick(filteredData[0])
                            }
                            if (e.key === 'Escape') {
                                setIsOpen(false)
                            }
                        }}
                    />
                </div>
            </div>
            <DataEditor
                width="100%"
                height={500}
                className="cursor-pointer"
                rows={finalFilteredData.length}
                columns={cols}
                getCellContent={getData}
                getRowThemeOverride={(i) =>
                    i === hoverRow
                        ? {
                            bgCell: '#e8f0ff',
                            bgCellMedium: '#e8f0ff',
                        }
                        : i % 2 === 0
                            ? undefined
                            : {
                                bgCell: '#FBFBFB',
                            }
                }
                freezeColumns="0"
                headerHeight={30}
                rowHeight={27}
                getCellsForSelection={true}
                onItemHovered={onItemHovered}
                onColumnResize={onColumnResize}
                onCellClicked={handleCellClick}
                rowMarkers={('checkbox-visible', 'both')}
                rowSelect="single"
            />
        </div>
    )
}


export const CellsWorkOrderNo = {
    kind: GridCellKind.Custom,
    isMatch: (c) => c.data.kind === 'cells-work-order-no',
    draw: (args, cell) => {
        const { ctx, theme, rect } = args
        const { value } = cell.data
        if (value) {
            ctx.fillStyle = theme.textDark
            ctx.fillText(
                value,
                rect.x + theme.cellHorizontalPadding,
                rect.y + rect.height / 2 + getMiddleCenterBias(ctx, theme),
            )
        }
        return true
    },
    provideEditor: () => ({
        editor: Editor,
        deletedValue: (v) => ({
            ...v,
            copyData: '',
            data: { ...v.data, value: '' },
        }),
        styleOverride: {
            position: 'fixed',
            left: '25%',
            top: '25vh',
            width: '50%',
            borderRadius: '9px',
            maxWidth: 'unset',
            maxHeight: 'unset',
            overflow: 'auto',
            boxShadow:
                '0 0 0 1px #d1d9e0b3,  rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px',
        },
        disablePadding: true,
    }),
    onPaste: async (v, d) => {
        const normalizeText = (text) =>
            typeof text === "string" || typeof text === "number"
                ? text.toString().trim().toLowerCase().normalize("NFC")
                : "";

        const pastedValue = normalizeText(v);
        if (!Array.isArray(d.allowedValues)) {
            return [];
        }

        const matchedValues = d.allowedValues.filter((item) =>
            ["WorkOrderNo", "ProdPlanNo"].some((attr) => {
                const value = item[attr];
                return value && normalizeText(value) === pastedValue;
            })
        );

        if (matchedValues.length > 0) {
            return matchedValues;
        }

        const matchedValuesFromApi = await callGetCodeHelp(pastedValue, d);

        if (typeof d.setCacheData === "function") {
            d.setCacheData((prev) => {
                const existingItemSeqs = new Set(prev.map((item) => item.WorkOrderSeq));
                const newData = matchedValuesFromApi.filter((item) => !existingItemSeqs.has(item.WorkOrderSeq));
                return [...prev, ...newData];
            });
        }

        return matchedValuesFromApi;
    }


}


const lastFetchedData = new Map();
const fetchingKeys = new Set();

export const callGetCodeHelp = async (key, d) => {
    if (!key || key === "N/A") return [];

    if (lastFetchedData.has(key)) {
        return lastFetchedData.get(key);
    }
    while (fetchingKeys.has(key)) {
        await new Promise((resolve) => setTimeout(resolve, 50));
    }

    if (lastFetchedData.has(key)) {
        return lastFetchedData.get(key);
    }

    fetchingKeys.add(key);

    try {
        const controller = new AbortController();
        const result = await GetCodeHelpVer2(
            18086, key, "", "1015", "", "", "1", 1, 50, "", 2, 1, 1, controller.signal, 28155
        );

        const data = result.data || [];

        lastFetchedData.set(key, data);

        if (typeof d.setCacheData === "function") {
            d.setCacheData((prev) => {
                const existingItemSeqs = new Set(prev.map((item) => item.WorkOrderSeq));
                const newData = data.filter((item) => !existingItemSeqs.has(item.WorkOrderSeq));
                return [...prev, ...newData];
            });
        }

        return data;
    } catch (error) {
        return [];
    } finally {
        fetchingKeys.delete(key);
    }
};
