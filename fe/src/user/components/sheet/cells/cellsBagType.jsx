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
      title: 'Type Key',
      id: 'type',
      kind: 'Text',
      readonly: true,
      width: 200,
      hasMenu: true,
      visible: true,
    },
    {
      title: 'Loại',
      id: 'description',
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




  const filteredData = useMemo(() => {
    if (!searchText) return allowedValues;

    const normalizeText = (text) =>
      typeof text === "string" || typeof text === "number"
        ? text.toString().toLowerCase().trim()
        : "";

    const search = normalizeText(searchText);
    const propertiesToSearch = ["type", "description"];

    return allowedValues.filter((item) =>
      propertiesToSearch.some((attr) => {
        const value = item[attr];
        return value && normalizeText(value).includes(search);
      })
    );
  }, [searchText, allowedValues]);

  const finalFilteredData = useMemo(() => {
    const existingItemSeqs = new Set(filteredData.map((item) => item.id));
    const newData = extraData.filter((item) => !existingItemSeqs.has(item.id));
    setCacheData((prev) => {
      const existingItemSeqs = new Set(prev.map((item) => item.id));
      const newData = extraData.filter((item) => !existingItemSeqs.has(item.id));
      return [...prev, ...newData];
    });
    return [...filteredData, ...newData];
  }, [filteredData, extraData]);


  const handleOnChange = useCallback(
    (val) => {
      const value = val.target.value;
      setSearchText(value);
      setIsOpen(true);

      if (!value) {
        onFinishedEditing({
          ...cell,
          data: [{}],
        });
      }
    },
    [onFinishedEditing, cell] // giữ những dependency cần thiết
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
        {t('Loại bao in')}
      </h2>
      <div className="p-2 border-b border-t">
        <div className="w-full flex gap-2">
          <button

            className="opacity-80 size-5 cursor-pointer"

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
        headerHeight={30}
        rowHeight={25}
        freezeColumns="0"
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


export const CellsBagType = {
  kind: GridCellKind.Custom,
  isMatch: (c) => c.data.kind === 'cell-bag-type',
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
      zIndex: 99999,
      boxShadow:
        '0 0 0 1px #d1d9e0b3,  rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px',
    },
    disablePadding: true,
  }),
  onPaste: (v, d) => {
    const normalizeText = (text) =>
      typeof text === 'string' || typeof text === 'number'
        ? text.toString().trim().toLowerCase().normalize('NFC')
        : ''

    const pastedValue = normalizeText(v)

    if (!Array.isArray(d.allowedValues)) {

      return []
    }

    const matchedValues = d.allowedValues.filter((item) =>
      ["type", "description"].some((attr) => {
        const value = item[attr]
        return value && normalizeText(value) === pastedValue
      }),
    )

    return matchedValues
  },


}

