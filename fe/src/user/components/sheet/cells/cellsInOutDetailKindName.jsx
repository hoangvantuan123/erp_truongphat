import CustomRenderer, {
    getMiddleCenterBias,
    GridCellKind,
    TextCellEntry,
    useTheme,
    DataEditor
} from "@glideapps/glide-data-grid";
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { SearchOutlined, TableOutlined } from '@ant-design/icons';
import { useTranslation } from "react-i18next";
const Editor = (p) => {
    const { value: cell, onFinishedEditing } = p;
    const { allowedValues = [], value: valueIn } = cell.data;
    const theme = useTheme();
    const [searchText, setSearchText] = useState(valueIn);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const [hoverRow, setHoverRow] = useState(undefined);
    const { t } = useTranslation();

    const columns = useMemo(
        () => [
            {
                title: 'Thuộc tính',
                id: 'MinorName',
                kind: 'Text',
                readonly: false,
                width: 280,
                hasMenu: true,
            },
            {
                title: 'Mã thuộc tính',
                id: 'Value',
                kind: 'Text',
                readonly: false,
                width: 120,
                hasMenu: true,
            },
        ]
    );

    const getData = useCallback(
        ([col, row]) => {
            let kind = GridCellKind.Text;
            const person = allowedValues[row] || {};
            const column = columns[col];
            const columnKey = column?.id || '';
            const value = person[columnKey] || '';

            return {
                kind: kind,
                data: kind === GridCellKind.Boolean ? Boolean(value) : value,
                displayData: kind === GridCellKind.Boolean ? undefined : String(value),
                readonly: column?.readonly || false,
                allowOverlay: true,
                hasMenu: column?.hasMenu || false,
            };
        },
        [allowedValues, columns],
    );


    const onItemHovered = useCallback((args) => {
        const [_, row] = args.location;
        setHoverRow(args.kind !== "cell" ? undefined : row);
    }, []);

    const filteredData = allowedValues.filter(item => {
        if (!searchText) return true;
        const search = searchText.toLowerCase().trim();
        return (
            item.MinorName.toLowerCase().includes(search) ||
            (item.MinorName && item.MinorName.toLowerCase().includes(search))
        );
    });

    const handleRowClick = (record) => {
        onFinishedEditing({
            ...cell,
            data: record
        });
    };

    const handleOnChange = (val) => {
        setSearchText(val.target.value);
        setIsOpen(true);
    };

    const handleCellClick = (cell) => {
        const rowIndex = cell[1];
        if (rowIndex >= 0 && rowIndex < filteredData.length) {
            handleRowClick(filteredData[rowIndex]);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (cell.readonly) {
        return (
            <div className="p-2">
                <TextCellEntry
                    highlight={true}
                    autoFocus={false}
                    disabled={true}
                    value={valueIn ?? ""}
                    onChange={() => undefined}
                />
            </div>
        );
    }

    return (
        <div ref={dropdownRef} className="">
            <h2 className="text-xs  font-medium flex items-center gap-2 p-2 text-blue-600 uppercase">
                <TableOutlined />
                PHÂN LOẠI KHO KHÁC
            </h2>
            <div className="p-2  border-b border-t ">
                <div className="w-full flex gap-2">

                    <SearchOutlined className="opacity-80 size-5" />
                    <input
                        highlight={true}
                        autoFocus={true}
                        className="h-full w-full border-none focus:outline-none hover:border-none  bg-inherit"
                        value={searchText}
                        onChange={handleOnChange}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && filteredData.length > 0) {
                                handleRowClick(filteredData[0]);
                            }
                            if (e.key === 'Escape') {
                                setIsOpen(false);
                            }
                        }}
                    />
                </div>

            </div>

            <DataEditor
                width="100%"
                height={500}
                className="cursor-pointer "
                rows={filteredData.length}
                columns={columns}

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
                getCellsForSelection={true}
                onItemHovered={onItemHovered}
                onCellClicked={handleCellClick}
                rowMarkers={('checkbox-visible', 'both')}
                rowSelect="single"
            />
        </div>
    );
};
export const CellInOutDetailKindName = {
    kind: GridCellKind.Custom,
    isMatch: (c) => c.data.kind === "cell-in-out-detail-kind-name",
    draw: (args, cell) => {
        const { ctx, theme, rect } = args;
        const { value } = cell.data;
        if (value) {
            ctx.fillStyle = theme.textDark;
            ctx.fillText(
                value,
                rect.x + theme.cellHorizontalPadding,
                rect.y + rect.height / 2 + getMiddleCenterBias(ctx, theme)
            );
        }
        return true;
    },
    measure: (ctx, cell) => {
        const { value } = cell.data;
        return value ? ctx.measureText(value).width + 16 : 16;
    },
    provideEditor: () => ({
        editor: Editor,
        deletedValue: (v) => ({
            ...v,
            copyData: "",
            data: { ...v.data, value: "" }
        }),
        styleOverride: {
            position: "fixed",
            left: "25%",
            top: "25vh",
            width: "50%",
            borderRadius: "9px",
            maxWidth: "unset",
            maxHeight: "unset",
            overflow: "auto",
            boxShadow:
                '0 0 0 1px #d1d9e0b3,  rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px',
        },
        disablePadding: true,
    }),
    onPaste: (v, d) => {
        const pastedValue = String(v).trim().toLowerCase();
        const matchedValue = d.allowedValues.find(item =>
            item.MinorName.toLowerCase().trim() === pastedValue || String(item.MinorName).toLowerCase().trim() === pastedValue
        );
        return {
            ...d,
            value: matchedValue ? matchedValue.MinorName : '',
            MinorName: matchedValue ? matchedValue.MinorName : '',
        };
    }
};