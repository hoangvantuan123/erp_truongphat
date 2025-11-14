import CustomRenderer, {
  getMiddleCenterBias,
  GridCellKind,
  TextCellEntry,
  useTheme,
  DataEditor,
} from '@glideapps/glide-data-grid'
import { useState, useEffect, useRef, useCallback } from 'react'
import { SearchOutlined, TableOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'

import { GetCodeHelp } from '../../../../features/codeHelp/getCodeHelp';

const Editor = (p) => {
  const { t } = useTranslation();
  const { value: cell, onFinishedEditing } = p;
  const { allowedValues = [], value: valueIn } = cell.data;
  const [searchText, setSearchText] = useState(valueIn);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [hoverRow, setHoverRow] = useState(undefined);
  const [filteredData, setFilteredData] = useState([]);

  const onItemHovered = useCallback((args) => {
    const [_, row] = args.location;
    setHoverRow(args.kind !== 'cell' ? undefined : row);
  }, []);


  const normalizeText = (text) =>
    typeof text === 'string' || typeof text === 'number'
      ? text.toString().toLowerCase().trim()
      : '';

  const debounce = (func, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  };

  const filterData = debounce(() => {
    if (Array.isArray(allowedValues)) {
      const filtered = allowedValues.filter((item) => {
        if (!searchText) return true;

        const search = normalizeText(searchText);
        const propertiesToSearch = [
          'EmpName', 'EmpSeq'
        ];

        return propertiesToSearch.some((attr) => {
          const value = item[attr];
          return value && normalizeText(value).includes(search);
        });
      });

      if (filtered.length > 0) {
        setFilteredData(filtered);
      } else {
        callGetCodeHelp(searchText);
      }
    }
  }, 300);

  const callGetCodeHelp = async (key) => {
    try {
      const result = await GetCodeHelp(10009, key, '', '', '', '', '', 1, 0, '', 0, 0, 0);
      if (result && result.data) {
        setFilteredData(result.data);
      }
    } catch (error) {
      setFilteredData([]);
    }
  };

  const handleRowClick = async (record) => {
    onFinishedEditing({
      ...cell,
      data: [record],
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

  useEffect(() => {
    filterData();
  }, [searchText, allowedValues]);

  if (cell.readonly) {
    return (
      <div className="p-2">
        <TextCellEntry highlight={true} autoFocus={false} disabled={true} />
      </div>
    );
  }

  const [cols, setCols] = useState([
    { title: t('EmpName'), width: 250 },
    { title: t('EmpSeq'), width: 250 },
    { title: t('EmpID'), width: 250 },
    { title: t('DeptName'), width: 250 },
    { title: t('DeptSeq'), width: 250 },
    { title: t('WkDeptName'), width: 250 },
    { title: t('WkDeptSeq'), width: 250 },
  ]);

  const onColumnResize = useCallback(
    (column, newSize) => {
      const index = cols.findIndex((col) => col.title === column.title);
      if (index !== -1) {
        const newCol = {
          ...column,
          width: newSize,
        };
        const newCols = [...cols];
        newCols.splice(index, 1, newCol);
        setCols(newCols);
      }
    },
    [cols],
  );

  return (
    <div ref={dropdownRef} className="">
      <h2 className="text-xs font-medium flex items-center gap-2 p-2 text-blue-600 uppercase">
        <TableOutlined />
        DANH SÁCH NGƯỜI DÙNG
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
          />
        </div>
      </div>
      <DataEditor
        width="100%"
        height={500}
        className="cursor-pointer"
        rows={filteredData.length}
        columns={cols}
        getCellContent={([col, row]) => {
          const rowData = filteredData[row];
          if (!rowData) {
            return {
              kind: GridCellKind.Text,
              allowOverlay: false,
              data: '',
              displayData: '',
            };
          }

          let cellData;
          switch (col) {
            case 0:
              cellData = rowData.EmpName
              break;
            case 1:
              cellData = rowData.EmpSeq
              break;
            case 2:
              cellData = rowData.EmpID
              break;
            case 3:
              cellData = rowData.DeptName
              break;
            case 4:
              cellData = rowData.DeptSeq
              break;
            case 5:
              cellData = rowData.WkDeptName
              break;
            default:
              cellData = rowData.WkDeptSeq
              break;
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
          };
        }}

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
        getCellsForSelection={true}
        onItemHovered={onItemHovered}
        onColumnResize={onColumnResize}
        onCellClicked={handleCellClick}
        rowMarkers={('checkbox-visible', 'both')}
        rowSelect="single"
      />
    </div>
  );
};

export const Cells10009 = {
  kind: GridCellKind.Custom,
  isMatch: (c) => c.data.kind === 'cell-10009',
  draw: (args, cell) => {
    const { ctx, theme, rect } = args;
    const { value } = cell.data;
    if (value) {
      ctx.fillStyle = theme.textDark;
      ctx.fillText(
        value,
        rect.x + theme.cellHorizontalPadding,
        rect.y + rect.height / 2 + getMiddleCenterBias(ctx, theme),
      );
    }
    return true;
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
      typeof text === 'string' || typeof text === 'number'
        ? text.toString().trim().toLowerCase().normalize('NFC')
        : '';

    const pastedValue = normalizeText(v);

    if (!Array.isArray(d.allowedValues)) {
      console.error("allowedValues is not an array or is undefined:", d.allowedValues);
      return [];
    }

    const matchedValues = d.allowedValues.filter((item) =>
      ['EmpName', 'EmpSeq', 'EmpID', 'DeptName', 'DeptSeq', 'WkDeptName', 'WkDeptSeq', 'PosName', 'PosSeq', 'UMJpName', 'UMJpSeq', 'UMPgName'].some((attr) => {
        const value = item[attr];
        return value && normalizeText(value) === pastedValue;
      }),
    );

    if (matchedValues.length > 0) {
      return matchedValues;
    } else {
      const matchedValuesFromApi = await callGetCodeHelp(pastedValue, d);
      console.log('matchedValuesFromApi',)
      return matchedValuesFromApi;
    }
  },
};

const callGetCodeHelp = async (key, d) => {
  try {
    const normalizeText = (text) =>
      typeof text === 'string' || typeof text === 'number'
        ? text.toString().trim().toLowerCase().normalize('NFC')
        : '';

    const result = await GetCodeHelp(10009, key, '', '', '', '', '', 1, 0, '', 0, 0, 0);
    if (result && result.data) {
      return result.data.filter((item) =>
        ['EmpName', 'EmpID'].some((attr) => {
          const value = item[attr];
          return value && normalizeText(value) === key;
        })
      );
    }
    return [];
  } catch (error) {
    return [];
  }
};
