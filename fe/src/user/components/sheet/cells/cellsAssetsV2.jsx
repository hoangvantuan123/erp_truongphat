import CustomRenderer, {
  getMiddleCenterBias,
  GridCellKind,
  TextCellEntry,
  useTheme,
  DataEditor,
} from '@glideapps/glide-data-grid'
import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { SearchOutlined, TableOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { debounce } from 'lodash';
import { GetCodeHelpVer2 } from '../../../../features/codeHelp/getCodeHelpVer2';

const Editor = (p) => {
  const { t } = useTranslation();
  const { value: cell, onFinishedEditing } = p || {};
  const controllers = useRef({})
  const [isLoading, setIsLoading] = useState(false)
  const [extraData, setExtraData] = useState([])

  // Kiểm tra cell & data để tránh lỗi
  const { allowedValues = [], value: valueIn } = (cell && cell.data) || {};

  const [searchText, setSearchText] = useState(valueIn || '');
  const [isOpen, setIsOpen] = useState(true); // ✅ Mặc định hiển thị danh sách
  const dropdownRef = useRef(null);
  const [hoverRow, setHoverRow] = useState(undefined);

  // Định nghĩa cột
  const defaultCols = useMemo(
    () => [
      { title: 'Mã thiết bị', id: 'AsstSeq', kind: 'Text', readonly: true, width: 200 },
      { title: 'Tên thiết bị', id: 'AsstName', kind: 'Text', readonly: true, width: 200 },
      { title: 'Số thiết bị', id: 'AsstNo', kind: 'Text', readonly: true, width: 200 },
      { title: 'Quy cách thiết bị', id: 'Spec', kind: 'Text', readonly: true, width: 200 },
      { title: 'Hạng mục', id: 'AccName', kind: 'Text', readonly: true, width: 200 },
      { title: 'Phương pháp khấu hao', id: 'SMDepreMethodName', kind: 'Text', readonly: true, width: 200 },

    ],
    []
  );

  const [cols, setCols] = useState(defaultCols);

  // Hover event cho bảng
  const onItemHovered = useCallback((args) => {
    if (!args || !args.location) return;
    const [_, row] = args.location;
    setHoverRow(args.kind !== 'cell' ? undefined : row);
  }, []);

  // Lọc dữ liệu theo searchText
  const filteredData = (allowedValues || []).filter((item) => {
    if (!searchText) return true;

    const normalizeText = (text) =>
      typeof text === 'string' || typeof text === 'number'
        ? text.toString().toLowerCase().trim()
        : '';

    const search = normalizeText(searchText);
    const propertiesToSearch = ['AsstNo', 'AsstName', 'AccName', 'GainAccName'];

    return propertiesToSearch.some((attr) => {
      const value = item[attr];
      return value && normalizeText(value).includes(search);
    });
  });

    const debounceCallGetCodeHelp = useMemo(
      () =>
        debounce(async (key) => {
          if (!key.trim()) return
  
          // Hủy request trước đó nếu có
          if (controllers.current.debounceCallGetCodeHelp) {
            controllers.current.debounceCallGetCodeHelp.abort()
            controllers.current.debounceCallGetCodeHelp = null
            await new Promise((resolve) => setTimeout(resolve, 50))
          }
  
          setIsLoading(true)
          const controller = new AbortController()
          controllers.current.debounceCallGetCodeHelp = controller
  
          try {
            const result = await GetCodeHelpVer2(
              40007,
              key,
              '',
              '',
              '',
              '',
              '',
              1,
              0,
              '',
              0,
              0,
              0,
              controller.signal,
            )
            setExtraData(result.data || [])
          } catch (error) {
            if (error.name !== 'AbortError') {
              setExtraData([])
            }
          } finally {
            setIsLoading(false)
            controllers.current.debounceCallGetCodeHelp = null
          }
        }, 300),
      [],
    )

  // Chọn 1 item
  const handleRowClick = (record) => {
    if (!record || !onFinishedEditing || !cell) return;
    onFinishedEditing({
      ...cell,
      data: [record], // Nếu chỉ cần object thì đổi thành record
    });
    setIsOpen(false);
  };

  // Xử lý khi nhập vào input search
  const handleOnChange = useCallback(
    (e) => {
      if (!e || !e.target) return
      const val = e.target.value
      setSearchText(val)
      
      if (val) {
        debounceCallGetCodeHelp(val)
      }
      if(!val) {
        onFinishedEditing({
          ...cell,
          data: [{}],
        })
      
      }
      setIsOpen(true) // ✅ Luôn mở dropdown dù text rỗng
    },
    [debounceCallGetCodeHelp],
  )

  // Xử lý click vào cell trong bảng
  const handleCellClick = (cellPos) => {
    if (!Array.isArray(cellPos)) return;
    const rowIndex = cellPos[1];
    if (rowIndex >= 0 && rowIndex < filteredData.length) {
      handleRowClick(filteredData[rowIndex]);
    }
  };

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Nếu cell là readonly → render TextCellEntry
  if (cell?.readonly) {
    return (
      <div className="p-2">
        <TextCellEntry highlight={true} autoFocus={false} disabled={true} />
      </div>
    );
  }

  // Xử lý resize cột
  const onColumnResize = useCallback(
    (column, newSize) => {
      if (!column || typeof newSize !== 'number') return;
      const index = cols.findIndex((col) => col.title === column.title);
      if (index !== -1) {
        const newCol = { ...column, width: newSize };
        const newCols = [...cols];
        newCols.splice(index, 1, newCol);
        setCols(newCols);
      }
    },
    [cols]
  );

  // Lấy dữ liệu cell cho DataEditor
  const getData = useCallback(
    ([colIndex, rowIndex]) => {
      const person = filteredData[rowIndex] || {};
      const column = cols[colIndex];

      if (!column) {
        return {
          kind: GridCellKind.Text,
          data: '',
          displayData: '',
          readonly: true,
          allowOverlay: false,
        };
      }

      const columnKey = column.id || '';
      const value = person[columnKey] || '';

      return {
        kind: GridCellKind.Text,
        data: value,
        displayData: String(value),
        readonly: column.readonly || false,
        allowOverlay: true,
      };
    },
    [filteredData, cols]
  );

  return (
    <div ref={dropdownRef}>
      <h2 className="text-xs font-medium flex items-center gap-2 p-2 text-blue-600 uppercase">
        <TableOutlined />
        {t('Danh sách thiết bị')}
      </h2>
      <div className="p-2 border-b border-t">
        <div className="w-full flex gap-2">
          <SearchOutlined className="opacity-80 size-5" />
          <input
            highlight={true}
            autoFocus={true}
            className="h-full w-full border-none focus:outline-none hover:border-none bg-inherit"
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
            placeholder={t('Tìm kiếm thiết bị')}
          />
        </div>
      </div>
      {isOpen && filteredData.length > 0 && (
        <DataEditor
          width="100%"
          height={500}
          className="cursor-pointer"
          rows={filteredData.length}
          columns={cols}
          getCellContent={getData}
          getRowThemeOverride={(i) =>
            i === hoverRow
              ? { bgCell: '#e8f0ff', bgCellMedium: '#e8f0ff' }
              : i % 2 === 0
                ? undefined
                : { bgCell: '#FBFBFB' }
          }
          freezeColumns="0"
          getCellsForSelection={true}
          onItemHovered={onItemHovered}
          onColumnResize={onColumnResize}
          onCellClicked={handleCellClick}
          rowMarkers={('checkbox-visible', 'both')}
          rowSelect="single"
        />
      )}
    </div>
  );
};


export const CellsAssetsV2 = {
  kind: GridCellKind.Custom,
  isMatch: (c) => c.data.kind === 'cell-AssetsV2',
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
      zIndex: 999999,
      boxShadow:
        '0 0 0 1px #d1d9e0b3,  rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px',
    },
    disablePadding: true,
  }),

  onPaste: (v, d) => {
    const normalizeText = (text) =>
      typeof text === 'string' || typeof text === 'number'
        ? text
            .toString()
            .trim()
            .toLowerCase()
            .normalize('NFC')
            .replace(/\s+/g, ' ')
        : ''

    const pastedValue = normalizeText(v)

    if (!Array.isArray(d.allowedValues)) {
      console.error(
        'allowedValues is not an array or is undefined:',
        d.allowedValues,
      )
      return []
    }

    const matchedValues = d.allowedValues.filter((item) =>
      ['AsstNo', 'AsstName', 'AccName', 'GainAccName',].some((attr) => {
        const value = item[attr]
        return value && normalizeText(value) === pastedValue
      }),
    )
    if (matchedValues.length > 0) {
          return matchedValues
        } else {
          const tempRow = [{ AsstName: pastedValue.toUpperCase(), AsstSeq: 0 }]
    
          callGetCodeHelp(pastedValue, d).then((res) => {
            if (res?.length > 0) {
              if (typeof d.setCacheData === 'function') {
                d.setCacheData((prev) => {
                  const existingItemSeqs = new Set(prev.map((item) => item.AsstSeq))
                  const newData = res.filter(
                    (item) => !existingItemSeqs.has(item.AsstSeq),
                  )
                  return [...prev, ...newData]
                })
              }
    
              if (typeof d.onFinishedEditing === 'function') {
    
                d.onFinishedEditing({
                  ...d,
                  data: res,
                })
              }
            } 
          })
          return tempRow
    
        }

  },
}

const lastFetchedData = new Map()
const fetchingKeys = new Set()

export const callGetCodeHelp = async (key, d) => {
  if (!key || key === 'N/A') return []

  if (lastFetchedData.has(key)) {
    return lastFetchedData.get(key)
  }
  while (fetchingKeys.has(key)) {
    await new Promise((resolve) => setTimeout(resolve, 50))
  }

  if (lastFetchedData.has(key)) {
    return lastFetchedData.get(key)
  }

  fetchingKeys.add(key)

  try {
    const controller = new AbortController()
    const result = await GetCodeHelpVer2(
      40007,
      key,
      '',
      '',
      '',
      '',
      '',
      1,
      0,
      '',
      0,
      0,
      0,
      controller.signal,
    )

    const data = result.data || []

    lastFetchedData.set(key, data)

    if (typeof d.setCacheData === 'function') {
      d.setCacheData((prev) => {
        const existingItemSeqs = new Set(prev.map((item) => item.EmpSeq))
        const newData = data.filter(
          (item) => !existingItemSeqs.has(item.EmpSeq),
        )
        return [...prev, ...newData]
      })
    }

    return data
  } catch (error) {
    return []
  } finally {
    fetchingKeys.delete(key)
  }
}