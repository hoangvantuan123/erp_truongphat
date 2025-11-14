import { useEffect, useState, useCallback, useMemo, useRef } from 'react'
import { DataEditor, GridCellKind } from '@glideapps/glide-data-grid'
import { TableOutlined } from '@ant-design/icons'
import { useLayer } from 'react-laag'
import LayoutMenuSheet from '../../sheet/jsx/layoutMenu'
import LayoutStatusMenuSheet from '../../sheet/jsx/layoutStatusMenu'
import { Drawer, Checkbox, message } from 'antd'
import { saveToLocalStorageSheet } from '../../../../localStorage/sheet/sheet'
import { loadFromLocalStorageSheet } from '../../../../localStorage/sheet/sheet'
import { reorderColumns } from '../../sheet/js/reorderColumns'

import { updateEditedRows } from '../../sheet/js/updateEditedRows'
import useOnFill from '../../hooks/sheet/onFillHook'
import { useExtraCells } from '@glideapps/glide-data-grid-cells'
import { updateIndexNo } from '../../sheet/js/updateIndexNo'
import { CellsHelpUsers } from '../../sheet/cells/help/cellHelpUsers'
import { getHelpUsers } from '../../../../features/help/getHelpUsers'


function TabRoleListUser({
  setSelection,
  selection,
  setShowSearch,
  showSearch,
  setGridData,
  gridData,
  numRows,
  handleRowAppend,
  setCols,
  cols,
  defaultCols,
  canEdit,
  handleRestSheet,
  dataType,
  setDataHelp03,
  dataHelp03
}) {
  const gridRef = useRef(null)
  const [open, setOpen] = useState(false)
  const cellProps = useExtraCells()
  const onFill = useOnFill(setGridData, cols)
  const onSearchClose = useCallback(() => setShowSearch(false), [])
  const [showMenu, setShowMenu] = useState(null)
  const [isCell, setIsCell] = useState(null)
  const [hiddenColumns, setHiddenColumns] = useState(() => {
    return loadFromLocalStorageSheet('role_group_users_ah', [])
  })
  const [typeSearch, setTypeSearch] = useState('')
  const [keySearchText, setKeySearchText] = useState('')
  const lastFetchedData = useRef(new Map());
  const fetchingKeys = useRef(new Set());
  const controllers = useRef({});
  const [isLoading, setIsLoading] = useState(false);
  const [hoverRow, setHoverRow] = useState(null);
  const onItemHovered = useCallback((args) => {
    const [_, row] = args.location
    setHoverRow(args.kind !== 'cell' ? undefined : row)
  }, [])
  const onHeaderMenuClick = useCallback(
    (col, bounds) => {
      if (cols[col]?.id === 'Status') {
        setShowMenu({
          col,
          bounds,
          menuType: 'statusMenu'
        })
      } else {
        setShowMenu({
          col,
          bounds,
          menuType: 'defaultMenu'
        })
      }
    },
    [cols]
  )
  const [dataSearch, setDataSearch] = useState([])
  const columnNames = ['UserId']
  const highlightRegions = columnNames.map(columnName => ({
    color: '#F0F4FC',
    range: {
      x: reorderColumns(cols).indexOf(columnName),
      y: 0,
      width: 1,
      height: numRows,
    },
  }));
  const [keybindings, setKeybindings] = useState({
    downFill: true,
    rightFill: true,
    selectColumn: false
  })

  const getData = useCallback(
    ([col, row]) => {
      const person = gridData[row] || {}
      const column = cols[col]
      const columnKey = column?.id || ''
      const value = person[columnKey] || ''



      const cellConfig = {
        UserId: {
          kind: "cell-users",
          allowedValues: dataHelp03,
          setCacheData: setDataHelp03
        },
      };
      if (cellConfig[columnKey]) {
        let copyData = value ? String(value) : "";

        return {
          kind: GridCellKind.Custom,
          allowOverlay: true,
          copyData,
          data: {
            kind: cellConfig[columnKey].kind,
            allowedValues: cellConfig[columnKey].allowedValues,
            setCacheData: cellConfig[columnKey].setCacheData,
            value: value || "",
          },
          displayData: String(value || ""),
          readonly: column?.readonly || false,
          hasMenu: column?.hasMenu || false,
        };
      }

      return {
        kind: GridCellKind.Text,
        data: value,
        copyData: String(value || ""),
        displayData: String(value || ""),
        readonly: column?.readonly || false,
        allowOverlay: true,
        hasMenu: column?.hasMenu || false,
        isEditing: true,
      }
    },
    [gridData, cols, dataHelp03]
  )

  const onCellClicked = useCallback(
    (cell, event) => {
      const indexes = reorderColumns(cols)
      const [col, row] = event.location
    },
    [cols, gridData]
  )

  const onKeyUp = useCallback(
    (event) => {
      const indexes = reorderColumns(cols)
      const [col, row] = event.location
    },
    [cols, gridData]
  )

  const callGetCodeHelpNow = async (key) => {
    if (!key || key === "N/A") return null;

    if (lastFetchedData.current.has(key)) {
      return lastFetchedData.current.get(key);
    }

    while (fetchingKeys.current.has(key)) {
      await new Promise((resolve) => setTimeout(resolve, 50));
    }

    if (lastFetchedData.current.has(key)) {
      return lastFetchedData.current.get(key);
    }

    fetchingKeys.current.add(key);

    setIsLoading(true);
    const controller = new AbortController();
    controllers.current.callGetCodeHelpNow = controller;

    try {
      const result = await getHelpUsers(1, 1000, key, controller.signal);

      const data = result.data.data || [];
      setDataHelp03((prev) => {
        const existingItemSeqs = new Set(prev.map((item) => item.Id));
        const newData = data.filter((item) => !existingItemSeqs.has(item.Id));
        return [...prev, ...newData];
      });
      lastFetchedData.current.set(key, data);
      return data;
    } catch (error) {
      return [];
    } finally {
      setIsLoading(false);
      fetchingKeys.current.delete(key);
      controllers.current.callGetCodeHelpNow = null;
    }
  };
  const onCellEdited = useCallback(
    async (cell, newValue) => {
      if (canEdit === false) {
        message.warning('Bạn không có quyền chỉnh sửa dữ liệu')
        return
      }
      if (dataType.length === 0 || !dataType[0]?.Id) {
        return;
      }

      if (
        newValue.kind !== GridCellKind.Text &&
        newValue.kind !== GridCellKind.Custom &&
        newValue.kind !== GridCellKind.Boolean &&
        newValue.kind !== GridCellKind.Number
      ) {
        return;
      }
      const indexes = reorderColumns(cols)
      const [col, row] = cell
      const key = indexes[col]


      if (key === "UserId" && newValue.kind === GridCellKind.Custom) {
        let selectedName;
        console.log('selectedName', selectedName)
        if (newValue.data instanceof Promise) {
          selectedName = await newValue.data;
          selectedName = selectedName[0];

        } else {
          selectedName = newValue?.data[0];
        }
        const checkCopyData = newValue.copyData;

        if (!selectedName) {
          selectedName = await callGetCodeHelpNow(checkCopyData);
          selectedName = selectedName ? selectedName[0] : null;
        }

        setGridData((prev) => {
          const newData = [...prev];
          const product = newData[row];

          if (selectedName) {
            const isDuplicate = newData.some((item, index) => item.UserId === selectedName.UserId && index !== row);
            if (isDuplicate) return prev;

            product[cols[col].id] = selectedName.UserId;
            product["Type"] = 'user';
            product["UserName"] = selectedName.UserName;
            product["GroupId"] = dataType[0].Id;
          } else {
            product[cols[col].id] = "";
            product["Type"] = "";
            product["UserName"] = "";
            product["GroupId"] = "";
          }

          product["IdxNo"] = row + 1;
          product["Status"] = product["Status"] === "A" ? "A" : "U";
          return newData;
        });

        return;
      }

      if (key === 'Id' || key === 'UserName' || key === 'GroupId' || key === 'Type') {
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
    [cols, gridData, dataHelp03, dataType]
  )

  const onColumnResize = useCallback(
    (column, newSize) => {
      const index = cols.indexOf(column)
      if (index !== -1) {
        const newCol = {
          ...column,
          width: newSize
        }
        const newCols = [...cols]
        newCols.splice(index, 1, newCol)
        setCols(newCols)
      }
    },
    [cols]
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
        width: showMenu?.bounds.width ?? 0
      })
    },
    placement: 'bottom-start',
    auto: true,
    possiblePlacements: ['bottom-start', 'bottom-end']
  })

  /* TOOLLS */
  const handleSort = (columnId, direction) => {
    setGridData((prevData) => {
      const rowsWithStatusA = prevData.filter(row => row.Status === 'A');
      const rowsWithoutStatusA = prevData.filter(row => row.Status !== 'A');

      const sortedData = rowsWithoutStatusA.sort((a, b) => {
        if (a[columnId] < b[columnId]) return direction === 'asc' ? -1 : 1;
        if (a[columnId] > b[columnId]) return direction === 'asc' ? 1 : -1;
        return 0;
      });

      const updatedData = updateIndexNo([...sortedData, ...rowsWithStatusA]);

      return updatedData;
    });

    setShowMenu(null);
  };

  const updateHiddenColumns = (newHiddenColumns) => {
    setHiddenColumns((prevHidden) => {
      const newHidden = [...new Set([...prevHidden, ...newHiddenColumns])]
      saveToLocalStorageSheet('role_group_users_ah', newHidden)
      return newHidden
    })
  }

  const updateVisibleColumns = (newVisibleColumns) => {
    setCols((prevCols) => {
      const newCols = [...new Set([...prevCols, ...newVisibleColumns])]
      const uniqueCols = newCols.filter(
        (col, index, self) => index === self.findIndex((c) => c.id === col.id)
      )
      saveToLocalStorageSheet('role_group_users_a', uniqueCols)
      return uniqueCols
    })
  }
  // Hàm ẩn cột
  const handleHideColumn = (colIndex) => {
    const columnId = cols[colIndex]?.id
    if (cols.length > 1) {
      updateHiddenColumns([columnId])
      setCols((prevCols) => {
        const newCols = prevCols.filter((_, idx) => idx !== colIndex)
        const uniqueCols = newCols.filter(
          (col, index, self) => index === self.findIndex((c) => c.id === col.id)
        )
        saveToLocalStorageSheet('role_group_users_a', uniqueCols)
        return uniqueCols
      })
      setShowMenu(null)
    }
  }
  // Hàm rEST LẤY LẠI CỘT DỮ LIỆU

  const handleReset = () => {
    setCols(defaultCols.filter((col) => col.visible))
    setHiddenColumns([])
    localStorage.removeItem('role_group_users_a')
    localStorage.removeItem('role_group_users_ah')
  }

  const onColumnMoved = useCallback((startIndex, endIndex) => {
    setCols((prevCols) => {
      const updatedCols = [...prevCols]
      const [movedColumn] = updatedCols.splice(startIndex, 1)
      updatedCols.splice(endIndex, 0, movedColumn)
      saveToLocalStorageSheet('role_group_users_a', updatedCols)
      return updatedCols
    })
  }, [])

  const showDrawer = () => {
    const invisibleCols = defaultCols.filter((col) => col.visible === false).map((col) => col.id)
    const currentVisibleCols = loadFromLocalStorageSheet('role_group_users_a', []).map(
      (col) => col.id
    )
    const newInvisibleCols = invisibleCols.filter((col) => !currentVisibleCols.includes(col))
    updateHiddenColumns(newInvisibleCols)
    updateVisibleColumns(
      defaultCols.filter((col) => col.visible && !hiddenColumns.includes(col.id))
    )
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
        saveToLocalStorageSheet('role_group_users_a', newCols)
        return newCols
      })
      setHiddenColumns((prevHidden) => {
        const newHidden = prevHidden.filter((id) => id !== columnId)
        saveToLocalStorageSheet('role_group_users_ah', newHidden)
        return newHidden
      })
    } else {
      setCols((prevCols) => {
        const newCols = prevCols.filter((col) => col.id !== columnId)
        saveToLocalStorageSheet('role_group_users_a', newCols)
        return newCols
      })
      setHiddenColumns((prevHidden) => {
        const newHidden = [...prevHidden, columnId]
        saveToLocalStorageSheet('role_group_users_ah', newHidden)
        return newHidden
      })
    }
  }

  return (
    <div className="w-full gap-1 border-r h-full flex items-center justify-center">
      <div className="w-full h-full flex flex-col  bg-white  overflow-hidden ">
        <h2 className="text-[10px] border-b font-medium flex items-center gap-2 p-2  uppercase">
          <TableOutlined />
          QUYỀN TRUY CẬP MENU
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
            tint: true
          }}
          freezeColumns="0"
          headerHeight={29}
          getRowThemeOverride={(rowIndex) => {
            if (rowIndex === hoverRow) {
              return {
                bgCell: "#f7f7f7",
                bgCellMedium: "#f0f0f0"
              };
            }
            return undefined;
          }}
          onItemHovered={onItemHovered}
          overscrollY={0}
          overscrollX={0}
          smoothScrollY={true}
          smoothScrollX={true}
          freezeTrailingRows={0}
          rowHeight={25}
          onPaste={true}
          fillHandle={true}
          keybindings={keybindings}
          isDraggable={false}
          onRowAppended={() => handleRowAppend(1)}
          onCellEdited={onCellEdited}
          onCellClicked={onCellClicked}
          highlightRegions={highlightRegions}
          onColumnResize={onColumnResize}
          onHeaderMenuClick={onHeaderMenuClick}
          onColumnMoved={onColumnMoved}
          onKeyUp={onKeyUp}
          customRenderers={[CellsHelpUsers]}
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
                  handleRestSheet={handleRestSheet}
                  handleRowAppend={handleRowAppend}
                  data={gridData}
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
            </div>
          )}
        <Drawer
          title={<span className="text-xs flex items-center justify-end">CÀI ĐẶT SHEET</span>}
          styles={{
            wrapper: {
              borderRadius: '16px 0 0 16px',
              overflow: 'hidden',
              boxShadow: '0'
            }
          }}
          bodyStyle={{ padding: 15 }}
          onClose={onClose}
          open={open}
        >
          {defaultCols.map(
            (col) =>
              col.id !== 'Status' && (
                <div key={col.id} style={{ marginBottom: '10px' }}>
                  <Checkbox
                    checked={!hiddenColumns.includes(col.id)}
                    onChange={(e) => handleCheckboxChange(col.id, e.target.checked)}
                  >
                    {col.title}
                  </Checkbox>
                </div>
              )
          )}
        </Drawer>
      </div>
    </div>
  )
}

export default TabRoleListUser
