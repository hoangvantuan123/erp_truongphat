import CustomRenderer, {
  getMiddleCenterBias,
  GridCellKind,
  TextCellEntry,
  useTheme,
  DataEditor,
} from '@glideapps/glide-data-grid'
import { Button } from 'antd'
import { useState, useEffect, useRef, useCallback } from 'react'
import { SearchOutlined, TableOutlined, CloseOutlined } from '@ant-design/icons'
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
    const propertiesToSearch = ['BadTypeName','BadSeq']
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
    if (valueIn !== '' && searchText === '') {
      onFinishedEditing({
        ...cell,
        data: [{}],
      })
  }
}, [valueIn, searchText])

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
          Loại hình lỗi
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
              if (e.key === 'Enter') {
                if (filteredData.length > 0 && searchText !== '') {
                  handleRowClick(filteredData[0])
                } else {
                  onFinishedEditing({
                    ...cell,
                    data: [{}],
                  })
                }
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
          { title: 'Mã loại hình lỗi', width: 100 },
          { title: 'Tên loại hình lỗi', width: 240 },

        ]}
        getCellContent={([col, row]) => {
          let cellData
          if (col === 0) {
            cellData = filteredData[row].BadSeq || filteredData[row].Value
          } else if (col === 1) {
            cellData = filteredData[row].BadTypeName || filteredData[row].MinorName
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

export const CellsBadReason = {
  kind: GridCellKind.Custom,
  isMatch: (c) => c.data.kind === 'bad-reason-cell',
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
        '0 0 0 1px #d1d9e0b3,  rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px',
    },
    disablePadding: true,
  }),
  onPaste: (v, d) => {
    const normalizeText = (text) =>
      text?.toString().trim().toLowerCase().normalize('NFC')
    const pastedValue = normalizeText(v)
    const matchedValues = d.allowedValues.filter((item) =>
      ['BadTypeName', 'BadSeq'].some(
        (attr) => normalizeText(item[attr]) === pastedValue,
      ),
    )
    return matchedValues
  },
}
