import CustomRenderer, {
  getMiddleCenterBias,
  GridCellKind,
  TextCellEntry,
  useTheme,
  DataEditor,
} from '@glideapps/glide-data-grid'
import { Button } from 'antd'
import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { SearchOutlined, TableOutlined, CloseOutlined } from '@ant-design/icons'
import { GetCodeHelpVer2 } from '../../../../features/codeHelp/getCodeHelpVer2'
const Editor = (p) => {
  const { value: cell, onFinishedEditing } = p
  let { value: valueIn } = cell.data

  const [allowedValues, setAllowedValues] = useState(cell.data.allowedValues ?? [])

  const theme = useTheme()
  const [searchText, setSearchText] = useState(valueIn)
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)
  const [hoverRow, setHoverRow] = useState(undefined)

  const onItemHovered = useCallback((args) => {
    const [_, row] = args.location
    setHoverRow(args.kind !== 'cell' ? undefined : row)
  }, [])

  const filteredData = useMemo(() => {
    if (!searchText) return allowedValues
    const normalizeText = (text) => text?.toString().toLowerCase().trim()
    const search = normalizeText(searchText)
    const propertiesToSearch = ['EmpID', 'EmpName']
    return allowedValues.filter(item =>
      propertiesToSearch.some(attr =>
        normalizeText(item[attr]).includes(search)
      )
    )
  }, [searchText, allowedValues])

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

  const fetchCodeHelpDataUserSearch = useCallback(async () => {
   
    try {
      const [
        dataUser, 
      ] = await Promise.all([
        GetCodeHelpVer2(10009, searchText, '', '', '', '', '1', '', 50, 'TypeSeq = 3031001', 0, 0, 0),
      ])
      setAllowedValues(dataUser.data?.filter(item => item.TypeSeq === 3031001) || [])     
    } catch (error) {
    }
  }, [searchText])

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

  const onKeyDownEnter = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      e.stopPropagation()
  
      fetchCodeHelpDataUserSearch()
      setIsOpen(true)
    }
    if (e.key === 'Enter' && filteredData.length > 0) {
      handleRowClick(filteredData[0])
    }
    if (e.key === 'Escape') {
      e.preventDefault()
      e.stopPropagation()
      setIsOpen(false)
    }
  }

  return (
    <div className="w-full ">
      <div className="flex items-center justify-between p-1">
        <h2 className="text-xs  font-medium flex items-center gap-2 p-2 text-blue-600 uppercase">
          <TableOutlined />
          Nhân viên
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
            onKeyDown={onKeyDownEnter}
          />
        </div>
      </div>

      <DataEditor
        width="100%"
        height={500}
        className="cursor-pointer "
        rows={filteredData.length}
        columns={[
          { title: 'Mã nhân viên', width: 150 },
          { title: 'Tên nhân viên', width: 240 },
          { title: 'Bộ phận', width: 240 },
          { title: 'Bộ phận làm việc', width: 240 },
          { title: 'Vị trí', width: 240 },
        ]}
        getCellContent={([col, row]) => {
          let cellData
          if (col === 0) {
            cellData = filteredData[row].EmpID
          } else if (col === 1) {
            cellData = filteredData[row].EmpName || ''
          } else if (col === 2) {
            cellData = filteredData[row].DeptName || ''
          }
          else if (col === 3) {
            cellData = filteredData[row].WkDeptName || ''
          }
          else if (col === 4) {
            cellData = filteredData[row].PosName || ''
          }
          else if (col === 5) {
            cellData = filteredData[row].UMJpName || ''
          }
          else if (col === 6) {
            cellData = filteredData[row].UMPgName || ''
          }
          else if (col === 7) {
            cellData = filteredData[row].UMJdName || ''
          } else if (col === 8) {
            cellData = filteredData[row].EmpSeq || ''
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

export const CellsEmpName = {
  kind: GridCellKind.Custom,
  isMatch: (c) => c.data.kind === 'emp-name-cell',
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
      ['EmpName', 'EmpID'].some(
        (attr) => normalizeText(item[attr]) === pastedValue,
      ),
    )
    return matchedValues
  },
}
