import { Select, Tag } from "antd";
import { getMiddleCenterBias, GridCellKind, useTheme } from "@glideapps/glide-data-grid";
import { CUSTOMER_KINDS } from "../../../../utils/sysConstants";
import { useCallback, useEffect, useRef, useState } from "react";



const Editor = (p) => {
  const { value: cell, onFinishedEditing } = p;
  const { allowedValues = [], value: valueIn } = cell.data;
  const theme = useTheme();
  const [searchText, setSearchText] = useState([valueIn]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [hoverRow, setHoverRow] = useState(undefined);



  const onItemHovered = useCallback((args) => {
    const [_, row] = args.location;
    setHoverRow(args.kind !== "cell" ? undefined : row);
  }, []);

  const filteredData = allowedValues.filter((item) => {
    if (!searchText) return true
    const normalizeText = (text) =>
      text ? text.toString().toLowerCase().trim() : ''
    const search = normalizeText(searchText)
    const propertiesToSearch = ['UMCustKindName', 'UMCustKind']
    return propertiesToSearch.some((attr) =>
      normalizeText(item[attr]).includes(search),
    )
  })

  const handleRowClick = (record) => {
    onFinishedEditing({
      ...cell,
      data: [record],
    })
  }


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
    <Select
        mode="multiple"
        style={{ width: "100%" }}
        value={searchText}
        onChange={handleOnChange}
        optionLabelProp="label"
        tagRender={(props) => {
          const { label, value, closable, onClose } = props;
          const option = CUSTOMER_KINDS.find((opt) => opt.UMCustKindName === value);
          return (
            <Tag color={option?.color || "default"} closable={closable} onClose={onClose}>
              {label}
            </Tag>
          );
        }}
      >
        {CUSTOMER_KINDS.map((opt) => (
          <Select.Option key={opt.UMCustKind} value={opt.UMCustKind} label={opt.UMCustKindName}>
            {opt.UMCustKindName}
          </Select.Option>
        ))}
      </Select>
  );
};

export const CellsUMCustKindNameSelect = {
  kind: GridCellKind.Custom,
  allowOverlay: true,
  isMatch: (c) => c.data.kind === "cust-kind-cell",
  draw: (args, cell) => {
    const { ctx, theme, rect } = args;
    const { value } = cell.data;

    const values = Array.isArray(value) 
    ? value 
    : value.includes(",") 
      ? value.split(",").map(v => v.trim()) 
      : [value.trim()];
    
    if (value.length > 0) {
      let x = rect.x + theme.cellHorizontalPadding;
      const y = rect.y + rect.height / 2 - 5;
      
      values.forEach((val) => {
        const option = CUSTOMER_KINDS.find((opt) => opt.UMCustKindName === val);
        if (!option) return;

        const textWidth = ctx.measureText(option.UMCustKindName).width + 16;
        const height = 18;
        const radius = 6;

        ctx.fillStyle = '#fafafa';
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + textWidth - radius, y);
        ctx.quadraticCurveTo(x + textWidth, y, x + textWidth, y + radius);
        ctx.lineTo(x + textWidth, y + height - radius);
        ctx.quadraticCurveTo(x + textWidth, y + height, x + textWidth - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
        ctx.fill();
        
        ctx.strokeStyle = "#d9d9d9";
        ctx.lineWidth = 1;
        ctx.stroke();
        
        ctx.fillStyle = "black";
        ctx.fillText(option.UMCustKindName, x + 8, y + 12);
        
        x += textWidth + 8;
      });
    }
    return true;
  },
  measure: (ctx, cell) => {
    const { values } = cell.data;
    return values.length > 0 ? ctx.measureText(values.join(", ")).width + 16 : 16;
  },
  provideEditor: () => ({
    editor: Editor,
    deletedValue: (v) => ({
      ...v,
      copyData: "",
      data: { ...v.data, values: [] }
    }),
    disablePadding: true,
  }),
  onPaste: (v, d) => {
    const normalizeText = (text) => text?.toString().trim().toLowerCase().normalize("NFC");
    const pastedValues = v.split(",").map(normalizeText);
    return d.options.filter((item) => pastedValues.includes(normalizeText(item.value)));
  }
};
