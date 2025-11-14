import CustomRenderer, {
  getMiddleCenterBias,
  GridCellKind,
  TextCellEntry,
  useTheme,
  DataEditor
} from "@glideapps/glide-data-grid";
import { useState, useEffect, useRef } from 'react';

const Editor = (p) => {
  const { value: cell, onFinishedEditing } = p;
  const { allowedValues = [], value: valueIn } = cell.data;
  const theme = useTheme();
  const [searchText, setSearchText] = useState(valueIn);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const filteredData = allowedValues.filter(item => {
    if (!searchText) return true;
    const search = searchText.toLowerCase().trim();
    return (
      item.BizUnitName.toLowerCase().includes(search) ||
      (item.BizUnitName && item.BizUnitName.toLowerCase().includes(search))
    );
  });

  const handleRowClick = (record) => {
    onFinishedEditing({
      ...cell,
      data: {
        ...cell.data,
        value: record.BizUnitName
      }
    });
  };

  const handleOnChange = (val) => {
    setSearchText(val.target.value);
    setIsOpen(true);
  };

  // Add onCellClick handler for DataEditor
  const handleCellClick = (cell) => {
    const rowIndex = cell[1];
    if (rowIndex >= 0 && rowIndex < filteredData.length) {
      handleRowClick(filteredData[rowIndex]);
    }
  };

  // Click outside to close dropdown
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
      <div className="p-2">
        <TextCellEntry
          highlight={true}
          autoFocus={true}
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
      <DataEditor
        width={400}
        height={200}
        className="cursor-pointer border-t"
        rows={filteredData.length}
        columns={[
          { title: "BizUnit", width: 100 },
          { title: "BizUnitName", width: 240 }
        ]}
        getCellContent={([col, row]) => {
          const cellData = col === 0
            ? filteredData[row].BizUnit
            : filteredData[row].BizUnitName || "";

          return {
            kind: GridCellKind.Text,
            allowOverlay: false,
            data: String(cellData),
            displayData: String(cellData),
            themeOverride: {
              textDark: col === 0 ? "#111827" : "#6B7280",
              baseFontStyle: col === 0 ? "13px" : "12px",
            }
          };
        }}
        onCellClicked={handleCellClick}
          rowMarkers={('checkbox-visible', 'both')}
                rowSelect="single"
      />
    </div>
  );
};

export const AsyncDropdownCellRendererUI = {
  kind: GridCellKind.Custom,
  isMatch: (c) => c.data.kind === "async-dropdown-cell",
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
    disablePadding: true,
    deletedValue: (v) => ({
      ...v,
      copyData: "",
      data: { ...v.data, value: "" }
    })
  }),
  onPaste: (v, d) => {
    const pastedValue = String(v).trim().toLowerCase();
    const matchedValue = d.allowedValues.find(item =>
      item.BizUnitName.toLowerCase().trim() === pastedValue
    );
    return { ...d, value: matchedValue ? matchedValue.BizUnitName : '' };
  }
};