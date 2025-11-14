import { useEffect, useState, useCallback, useMemo, useRef } from 'react'
import { DataEditor, GridCellKind } from '@glideapps/glide-data-grid'
import { TableOutlined } from '@ant-design/icons'
import { useLayer } from 'react-laag'
import LayoutMenuSheet from '../../sheet/jsx/layoutMenu'
import LayoutStatusMenuSheet from '../../sheet/jsx/layoutStatusMenu'
import { Drawer, Checkbox } from 'antd'
import { saveToLocalStorageSheet } from '../../../../localStorage/sheet/sheet'
import { loadFromLocalStorageSheet } from '../../../../localStorage/sheet/sheet'
import { reorderColumns } from '../../sheet/js/reorderColumns'
import { updateEditedRows } from '../../sheet/js/updateEditedRows'
import useOnFill from '../../hooks/sheet/onFillHook'
import { useExtraCells } from '@glideapps/glide-data-grid-cells'
import { AsyncDropdownCellRenderer } from '../../sheet/cells/AsyncDropdownCellRenderer'
import { useTranslation } from 'react-i18next'
import { CellsUserAcc } from '../../sheet/cells/cellsUsersAcc'
function TableUserManagement({
  setSelection,
  selection,
  setShowSearch,
  showSearch,
  setEditedRows,
  onSelectRow,
  setOnSelectRow,
  setIsCellSelected,
  setOpenHelp,
  openHelp,
  setGridData,
  gridData,
  numRows,
  handleRowAppend,
  setCols,
  cols,
  defaultCols,
  helpData01,
  setHelpData01
}) {
  const { t } = useTranslation()
  const gridRef = useRef(null)
  const [open, setOpen] = useState(false)
  const cellProps = useExtraCells()
  const onFill = useOnFill(setGridData, cols)
  const onSearchClose = useCallback(() => setShowSearch(false), [])
  const [showMenu, setShowMenu] = useState(null)
  const [hiddenColumns, setHiddenColumns] = useState(
    loadFromLocalStorageSheet('H_ERP_COLS_PAGE_USERS_MANAGE', []),
  )
  const [hoverRow, setHoverRow] = useState(undefined)

  const onItemHovered = useCallback((args) => {
    const [_, row] = args.location
    setHoverRow(args.kind !== 'cell' ? undefined : row)
  }, [])

  const onHeaderMenuClick = useCallback((col, bounds) => {
    if (cols[col]?.id === 'Status') {
      setShowMenu({
        col,
        bounds,
        menuType: 'statusMenu',
      })
    } else {
      setShowMenu({
        col,
        bounds,
        menuType: 'defaultMenu',
      })
    }
  }, [])
  const [dataSearch, setDataSearch] = useState([])

  const [keybindings, setKeybindings] = useState({
    downFill: true,
    rightFill: true,
    selectColumn: false,
  })
  const getDuplicateUserIdHighlights = () => {
    const userIdCount = new Map();

    gridData.forEach((row, idx) => {
      const id = String(row.UserId || '').trim().toLowerCase();
      if (!id) return;
      userIdCount.set(id, (userIdCount.get(id) || 0) + 1);
    });

    const duplicates = [...userIdCount.entries()].filter(([_, count]) => count > 1).map(([id]) => id);

    const userIdColIndex = reorderColumns(cols).findIndex(col => col === 'UserId');

    const highlights = gridData.map((row, idx) => {
      const id = String(row.UserId || '').trim().toLowerCase();
      if (duplicates.includes(id)) {
        return {
          color: '#ffe0e0',
          range: {
            x: userIdColIndex,
            y: idx,
            width: 1,
            height: 1,
          },
        };
      }
      return null;
    }).filter(Boolean);

    return highlights;
  };
  const highlightRegions = [
    ...getDuplicateUserIdHighlights()
  ];

  const getData = useCallback(
    ([col, row]) => {

      const person = gridData[row] || {}
      const column = cols[col]
      const columnKey = column?.id || ''
      const value = person[columnKey] || ''
      const cellConfig = {
        UserId: {
          kind: 'help-cell-users-acc',
          allowedValues: helpData01,
          setCacheData: setHelpData01,
        },

      }
      if (cellConfig[columnKey]) {
        let copyData = value ? String(value) : ''

        return {
          kind: GridCellKind.Custom,
          allowOverlay: true,
          copyData,
          data: {
            kind: cellConfig[columnKey].kind,
            allowedValues: cellConfig[columnKey].allowedValues,
            setCacheData: cellConfig[columnKey].setCacheData,
            value: value || '',
          },
          displayData: String(value || ''),
          readonly: column?.readonly || false,
          hasMenu: column?.hasMenu || false,
        }
      }
      if (columnKey === 'ForceOtpLogin' || columnKey === 'AccountScope') {
        const booleanValue =
          value === 1 || value === '1'
            ? true
            : value === 0 || value === '0'
              ? false
              : Boolean(value)
        return {
          kind: GridCellKind.Boolean,
          data: booleanValue,
          allowOverlay: true,
          hasMenu: column?.hasMenu || false,
        }
      }
      if (columnKey === 'UserId') {
        const trimmedValue = String(value).replace(/\s/g, '');

        return {
          kind: GridCellKind.Text,
          data: trimmedValue,
          copyData: trimmedValue,
          displayData: trimmedValue,
          readonly: column?.readonly || false,
          allowOverlay: true,
          hasMenu: column?.hasMenu || false,
          isEditing: true,
        };
      }

      return {
        kind: GridCellKind.Text,
        data: value,
        copyData: String(value),
        displayData: String(value),
        readonly: column?.readonly || false,
        allowOverlay: true,
        hasMenu: column?.hasMenu || false,
        isEditing: true,
      }
    },
    [gridData, cols, helpData01],
  )

  const onKeyUp = useCallback(
    (event) => {
      const indexes = reorderColumns(cols)
      const [col, row] = event.location
      const menuRootNameIndex = indexes.indexOf('MenuRootName') + 1
      const menuSubRootNameIndex = indexes.indexOf('MenuSubRootName') + 1
    },
    [cols, gridData],
  )

  const onCellEdited = useCallback(
    async (cell, newValue) => {
      if (
        newValue.kind !== GridCellKind.Text &&
        newValue.kind !== GridCellKind.Custom &&
        newValue.kind !== GridCellKind.Boolean &&
        newValue.kind !== GridCellKind.Number
      ) {
        return
      }
      const indexes = reorderColumns(cols)
      const [col, row] = cell
      const key = indexes[col]

      if (key === 'UserId') {
        if (newValue.kind === GridCellKind.Custom) {
          setGridData((prev) => {
            const newData = [...prev];
            const product = newData[row];

            let selectedName = Array.isArray(newValue.data) && newValue.data.length > 0
              ? newValue.data[0]
              : null;

            // Nếu không có selectedName, dùng fallback là copyData
            if (!selectedName && newValue.copyData) {
              selectedName = helpData01.find(
                (item) => item.EmpID === newValue.copyData
              );
            }

            if (selectedName) {
              product[cols[col].id] = selectedName.EmpID ?? '';
              product["UserName"] = selectedName.UserName ?? '';
              product["PwdMailAdder"] = selectedName.Email ?? '';
              product["EmpSeq"] = selectedName.EmpSeq ?? '';
              product["UserSeq"] = selectedName.UserSeq ?? '';
            } else {
              product[cols[col].id] = '';
              product["UserName"] = '';
              product["PwdMailAdder"] = '';
              product["EmpSeq"] = '';
              product["UserSeq"] = '';
            }

            product['IdxNo'] = row + 1;

            const currentStatus = product['Status'] || 'U';
            product['Status'] = currentStatus === 'A' ? 'A' : 'U';

            setEditedRows((prevEditedRows) =>
              updateEditedRows(prevEditedRows, row, newData, currentStatus)
            );

            return newData;
          });
          return;
        }
      }

      if (key === 'ForceOtpLogin' || key === 'UserSeq' || key === 'EmpSeq') {
        return;
      }
      setGridData((prevData) => {
        const updatedData = [...prevData]
        if (!updatedData[row]) updatedData[row] = {}

        const currentStatus = updatedData[row]['Status'] || ''
        updatedData[row][key] = newValue.data
        updatedData[row]['Status'] = currentStatus === 'A' ? 'A' : 'U'


        return updatedData
      })
    },
    [cols, gridData, helpData01],
  )

  const onColumnResize = useCallback(
    (column, newSize) => {
      const index = cols.indexOf(column)
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

  const { renderLayer, layerProps } = useLayer({
    isOpen: showMenu !== null,
    triggerOffset: 4,
    onOutsideClick: () => setShowMenu(null),
    trigger: {
      getBounds: () => ({
        bottom: (showMenu?.bounds.y ?? 0) + (showMenu?.bounds.height ?? 0),
        height: showMenu?.bounds.height ?? 0,
        left: showMenu?.bounds.x ?? 0,
        right: (showMenu?.bounds.x ?? 0) + (showMenu?.bounds.width ?? 0),
        top: showMenu?.bounds.y ?? 0,
        width: showMenu?.bounds.width ?? 0,
      }),
    },
    placement: 'bottom-start',
    auto: true,
    possiblePlacements: ['bottom-start', 'bottom-end'],
  })

  /* TOOLLS */
  const handleSort = (columnId, direction) => {
    setGridData((prevData) => {
      const sortedData = [...prevData].sort((a, b) => {
        if (a[columnId] < b[columnId]) return direction === 'asc' ? -1 : 1
        if (a[columnId] > b[columnId]) return direction === 'asc' ? 1 : -1
        return 0
      })
      return sortedData
    })
    setShowMenu(null)
  }

  // Hàm ẩn cột
  const handleHideColumn = (colIndex) => {
    const columnId = cols[colIndex]?.id
    if (cols.length > 1) {
      setHiddenColumns((prevHidden) => {
        const newHidden = [...prevHidden, columnId]
        saveToLocalStorageSheet('H_ERP_COLS_PAGE_USERS_MANAGE', newHidden)
        return newHidden
      })
      setCols((prevCols) => {
        const newCols = prevCols.filter((_, idx) => idx !== colIndex)
        saveToLocalStorageSheet('S_ERP_COLS_PAGE_USERS_MANAGE', newCols)
        return newCols
      })
      setShowMenu(null)
    }
  }
  // Hàm rEST LẤY LẠI CỘT DỮ LIỆU

  const handleReset = () => {
    setCols(defaultCols)
    setHiddenColumns([])
    localStorage.removeItem('S_ERP_COLS_PAGE_USERS_MANAGE')
    localStorage.removeItem('H_ERP_COLS_PAGE_USERS_MANAGE')
  }

  const onColumnMoved = useCallback((startIndex, endIndex) => {
    setCols((prevCols) => {
      const updatedCols = [...prevCols]
      const [movedColumn] = updatedCols.splice(startIndex, 1)
      updatedCols.splice(endIndex, 0, movedColumn)
      saveToLocalStorageSheet('S_ERP_COLS_PAGE_USERS_MANAGE', updatedCols)
      return updatedCols
    })
  }, [])

  const showDrawer = () => {
    setOpen(true)
  }
  const onClose = () => {
    setOpen(false)
  }

  const handleCheckboxChange = (columnId, isChecked) => {
    if (isChecked) {
      const restoredColumn = defaultCols.find((col) => col.id === columnId)
      setCols((prevCols) => {
        const newCols = [...prevCols, restoredColumn]
        saveToLocalStorageSheet('S_ERP_COLS_PAGE_USERS_MANAGE', newCols)
        return newCols
      })
      setHiddenColumns((prevHidden) => {
        const newHidden = prevHidden.filter((id) => id !== columnId)
        saveToLocalStorageSheet('H_ERP_COLS_PAGE_USERS_MANAGE', newHidden)
        return newHidden
      })
    } else {
      setCols((prevCols) => {
        const newCols = prevCols.filter((col) => col.id !== columnId)
        saveToLocalStorageSheet('S_ERP_COLS_PAGE_USERS_MANAGE', newCols)
        return newCols
      })
      setHiddenColumns((prevHidden) => {
        const newHidden = [...prevHidden, columnId]
        saveToLocalStorageSheet('H_ERP_COLS_PAGE_USERS_MANAGE', newHidden)
        return newHidden
      })
    }
  }

  return (
    <div className="w-full gap-1 h-full flex items-center justify-center ">
      <div className="w-full h-full flex flex-col  bg-white overflow-hidden ">
        <h2 className="text-xs border-b font-medium flex items-center gap-2 p-2 text-blue-600 uppercase">
          <TableOutlined />
          {t('850000018')}
        </h2>
        <DataEditor
          {...cellProps}
          ref={gridRef}
          columns={cols}
          getCellContent={getData}
          onFill={onFill}
          rows={numRows}
          showSearch={showSearch}
          onSearchClose={onSearchClose}
          rowMarkers="both"
          width="100%"
          height="100%"
          rowSelect="multi"
          gridSelection={selection}
          onGridSelectionChange={setSelection}
          getCellsForSelection={true}
          trailingRowOptions={{
            hint: ' ',
            sticky: true,
            tint: true,
          }}
          freezeColumns="0"
          rowHeight={27}
          getRowThemeOverride={(rowIndex) => {

            if (rowIndex === hoverRow) {
              return {
                bgCell: "#f7f7f7",
                bgCellMedium: "#f0f0f0"
              };
            }
            return undefined;
          }}
          onPaste={true}
          fillHandle={true}
          keybindings={keybindings}
          isDraggable={false}
          onRowAppended={() => handleRowAppend(1)}
          smoothScrollY={true}
          smoothScrollX={true}
          onCellEdited={onCellEdited}
          highlightRegions={highlightRegions}
          onColumnResize={onColumnResize}
          onHeaderMenuClick={onHeaderMenuClick}
          onColumnMoved={onColumnMoved}
          onKeyUp={onKeyUp}
          customRenderers={[CellsUserAcc]}
        />
        {showMenu !== null &&
          renderLayer(
            <div
              {...layerProps}
              className="border  w-72 rounded-lg bg-white shadow-lg cursor-pointer"
            >
              {showMenu.menuType === 'statusMenu' ? (
                <LayoutStatusMenuSheet
                  showMenu={showMenu}
                  handleSort={handleSort}
                  cols={cols}
                  renderLayer={renderLayer}
                  setShowSearch={setShowSearch}
                  setShowMenu={setShowMenu}
                  layerProps={layerProps}
                  handleReset={handleReset}
                  showDrawer={showDrawer}
                />
              ) : (
                <LayoutMenuSheet
                  showMenu={showMenu}
                  handleSort={handleSort}
                  handleHideColumn={handleHideColumn}
                  cols={cols}
                  renderLayer={renderLayer}
                  setShowSearch={setShowSearch}
                  setShowMenu={setShowMenu}
                  layerProps={layerProps}
                />
              )}
            </div>,
          )}
        <Drawer title={t('850000017')} onClose={onClose} open={open}>
          {defaultCols.map(
            (col) =>
              col.id !== 'Status' && (
                <div key={col.id} style={{ marginBottom: '10px' }}>
                  <Checkbox
                    checked={!hiddenColumns.includes(col.id)}
                    onChange={(e) =>
                      handleCheckboxChange(col.id, e.target.checked)
                    }
                  >
                    {col.title}
                  </Checkbox>
                </div>
              ),
          )}
        </Drawer>

      </div>
    </div>
  )
}

export default TableUserManagement