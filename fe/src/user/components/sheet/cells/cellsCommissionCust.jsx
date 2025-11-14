import CustomRenderer, {
    getMiddleCenterBias,
    GridCellKind,
    TextCellEntry,
    useTheme,
    DataEditor
} from "@glideapps/glide-data-grid";
import {
    Button,

} from 'antd';
import { useState, useEffect, useRef, useCallback } from 'react';
import { SearchOutlined, TableOutlined, CloseOutlined } from '@ant-design/icons';
const Editor = (p) => {
  const { value: cell, onFinishedEditing } = p
  const { allowedValues = [], value: valueIn } = cell.data
  const theme = useTheme()
  const [searchText, setSearchText] = useState(valueIn)
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)
  const [hoverRow, setHoverRow] = useState(undefined)

  const onItemHovered = useCallback((args) => {
    const [_, row] = args.location
    setHoverRow(args.kind !== 'cell' ? undefined : row)
  }, [])

  const filteredData = allowedValues.filter((item) => {
    if (!searchText) return true
    const normalizeText = (text) =>
      text ? text.toString().toLowerCase().trim() : ''
    const search = normalizeText(searchText)
    const propertiesToSearch = ['CustName', 'CustSeq' , 'CustNo' , 'BizNo' , 'Address']
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
    setSearchText(val.target.value)
    setIsOpen(true)
  }

  const handleCellClick = (cell) => {
    const rowIndex = cell[1]
    if (rowIndex >= 0 && rowIndex < filteredData.length) {
      handleRowClick(filteredData[rowIndex])
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
        <TextCellEntry
          highlight={true}
          autoFocus={false}
          disabled={true}
          value={valueIn ?? ''}
          onChange={() => undefined}
        />
      </div>
    )
  }

  return (
    <div className="w-full ">
      <div className="flex items-center justify-between p-1">
        <h2 className="text-xs  font-medium flex items-center gap-2 p-2 text-blue-600 uppercase">
          <TableOutlined />
          Khách hàng
        </h2>
      </div>

      <div className="p-2 border-b border-t  ">
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
        className="cursor-pointer "
        rows={filteredData.length}
        columns={[
          { title: 'CustSeq', width: 80 },
          { title: 'CustName', width: 240 },
          { title: 'CustNo', width: 120 },
          { title: 'BizNo', width: 120 },
          { title: 'Address', width: 240 },
        ]}
        getCellContent={([col, row]) => {
          let cellData
          if (col === 0) {
            cellData = filteredData[row].CustSeq
          } else if (col === 1) {
            cellData = filteredData[row].CustName || ''
          } else if (col === 2) {
            cellData = filteredData[row].CustNo || ''
          } else if (col === 3) {
            cellData = filteredData[row].BizNo || ''
          } else {
            cellData = filteredData[row].Address || ''
          }

          return {
            kind: GridCellKind.Text,
            allowOverlay: false,
            data: String(cellData),
            displayData: String(cellData),
            themeOverride: {
              textDark: col === 0 ? '#111827' : '#6B7280',
              baseFontStyle: col === 0 ? '13px' : '12px',
            },
          }
        }}
        getCellsForSelection={true}
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
        onItemHovered={onItemHovered}
        onCellClicked={handleCellClick}
        rowMarkers={('checkbox-visible', 'both')}
        rowSelect="single"
      />
    </div>
  )
}

export const CellsCommissionCustName = {
  kind: GridCellKind.Custom,
  isMatch: (c) => c.data.kind === 'commission-cust-name-cell',
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
  measure: (ctx, cell) => {
    const { value } = cell.data
    return value ? ctx.measureText(value).width + 16 : 16
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
        '0 0 0 1px #d1d9e0b3, 0px 0px 1px rgba(62, 65, 86, 0.4), 0px 6px 12px rgba(62, 65, 86, 0.15)',
    },
    disablePadding: true,
  }),
  onPaste: (v, d) => {
    const normalizeText = (text) =>
      text?.toString().trim().toLowerCase().normalize('NFC');
    const pastedValue = normalizeText(v);
    const matchedValues = d.allowedValues.filter((item) =>
      ['CustName', 'CustSeq' , 'CustNo' , 'BizNo' , 'Address'].some(
        (attr) => normalizeText(item[attr]) === pastedValue,
      ),
    );
    return matchedValues;
  }
}
