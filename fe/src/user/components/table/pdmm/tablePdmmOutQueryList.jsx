import { useEffect, useState, useCallback, useMemo, useRef } from 'react'
import { DataEditor, GridCellKind } from '@glideapps/glide-data-grid'
import { TableOutlined, IssuesCloseOutlined, PauseCircleOutlined } from '@ant-design/icons'
import { useLayer } from 'react-laag'
import LayoutMenuSheet from '../../sheet/jsx/layoutMenu'
import LayoutStatusMenuSheet from '../../sheet/jsx/layoutStatusMenu'
import { Drawer, Checkbox, message, Modal, Button, Input } from 'antd'
import { saveToLocalStorageSheet } from '../../../../localStorage/sheet/sheet'
import { loadFromLocalStorageSheet } from '../../../../localStorage/sheet/sheet'
import { reorderColumns } from '../../sheet/js/reorderColumns'
import useOnFill from '../../hooks/sheet/onFillHook'
import { useTranslation } from 'react-i18next'
import { useExtraCells } from '@glideapps/glide-data-grid-cells'
import { updateEditedRows } from '../../sheet/js/updateEditedRows'
import { CellsItemNameV01 } from '../../sheet/cells/cellsItemNameV01'
import { updateIndexNo } from '../../sheet/js/updateIndexNo'
import { Cells17001 } from '../../sheet/cells/cells17001'
import { GetCodeHelp } from '../../../../features/codeHelp/getCodeHelp'
import { Cells10010 } from '../../sheet/cells/cells10010'
import { GetCodeHelpVer2 } from '../../../../features/codeHelp/getCodeHelpVer2'
import moment from 'moment'
import { CellsWorkCenter } from '../../sheet/cells/cellsWorkCenter'
import { debounce } from 'lodash'
import { PostSCOMConfirm } from '../../../../features/pdmm/postSCOMConfirm'
import { PostSPDMMOutReqCancel } from '../../../../features/pdmm/postSPDMMOutReqCancel'
function TablePdmmOutQueryList({
  setSelection,
  selection,
  setShowSearch,
  showSearch,
  setEditedRows,
  setGridData,
  gridData,
  setNumRows,
  numRows,
  setCols,
  cols,
  defaultCols,
  dataNaWare,
  handleRestSheet,
  canEdit,
  helpData01,
  helpData02,
  helpData03,
  setAddedRows,
  setHelpData01,
  helpData07,
  setHelpData07
}) {
  const { t } = useTranslation()
  const gridRef = useRef(null)
  const [open, setOpen] = useState(false)
  const cellProps = useExtraCells()
  const onFill = useOnFill(setGridData, cols)
  const onSearchClose = useCallback(() => setShowSearch(false), [])
  const [showMenu, setShowMenu] = useState(null)
  const controllers = useRef({})
  const [isLoading, setIsLoading] = useState(false)
  const [hiddenColumns, setHiddenColumns] = useState(() => {
    return loadFromLocalStorageSheet('pdmm_out_list_extra_ah', [])
  })
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hoverRow, setHoverRow] = useState(undefined)
  const [originalValue, setOriginalValue] = useState(null);

  const [selectedKey, setSelectedKey] = useState("");
  const [editingRow, setEditingRow] = useState(null);
  const [Reason, setReason] = useState('')
  const onItemHovered = useCallback((args) => {
    const [_, row] = args.location
    setHoverRow(args.kind !== 'cell' ? undefined : row)
  }, [])
  const [remark, setRemark] = useState("");
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

  const [keybindings, setKeybindings] = useState({
    downFill: true,
    rightFill: true,
    selectColumn: false,
  })
  const handleInputChange = (e) => {
    setRemark(e.target.value);
  };

  const handleConfirm = () => {
    handleModalOk(remark);
  };
  const getData = useCallback(
    ([col, row]) => {
      const lastRowIndex = numRows - 1;
      const person = gridData[row] || {}
      const column = cols[col]
      const columnKey = column?.id || ''
      let value = person[columnKey] || ''
      /* IsConfirm */
      if (row === lastRowIndex) {


        if (["Qty"].includes(columnKey)) {
          const total = gridData.reduce((sum, item) => sum + (Number(item[columnKey]) || 0), 0);
          const formattedTotal = new Intl.NumberFormat("en-US", {
            minimumFractionDigits: 4,
            maximumFractionDigits: 4,
          }).format(total);

          return {
            kind: GridCellKind.Number,
            data: total,
            copyData: String(total),
            displayData: formattedTotal,
            readonly: true,
            contentAlign: "right",
            themeOverride: {
              textDark: "#009CA6",
              bgIconHeader: "#009CA6",
              accentColor: "#009CA6",
              accentLight: "#009CA620",
              fgIconHeader: "#FFFFFF",
              baseFontStyle: "600 13px",
              bgCell: "#E6F6DD",
            }
          };
        }

        if (["ProgQty"].includes(columnKey)) {
          const total = gridData.reduce((sum, item) => sum + (Number(item[columnKey]) || 0), 0);
          const formattedTotal = new Intl.NumberFormat("en-US", {
            minimumFractionDigits: 4,
            maximumFractionDigits: 4,
          }).format(total);

          return {
            kind: GridCellKind.Number,
            data: total,
            copyData: String(total),
            displayData: formattedTotal,
            readonly: true,
            contentAlign: "right",
            themeOverride: {
              textDark: "#009CA6",
              bgIconHeader: "#009CA6",
              accentColor: "#009CA6",
              accentLight: "#009CA620",
              fgIconHeader: "#FFFFFF",
              baseFontStyle: "600 13px",
              bgCell: "#E6F6DD",
            }
          };
        }
        return {
          kind: GridCellKind.Text,
          data: "",
          displayData: "",
          readonly: true,
          themeOverride: {
            textDark: "#009CA6",
            bgIconHeader: "#009CA6",
            accentColor: "#009CA6",
            accentLight: "#009CA620",
            fgIconHeader: "#FFFFFF",
            baseFontStyle: "600 13px",
            bgCell: "#E6F6DD",
          }
        };
      }

      if (columnKey === 'ReqDate') {
        let displayValue = ''
        let dataValue = value

        if (value && typeof value === 'string' && value.trim() !== '') {
          let momentObj = null

          if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
            momentObj = moment(value, "YYYY-MM-DD", true);
          } else if (/^\d{8}$/.test(value)) {
            momentObj = moment(value, "YYYYMMDD", true);
          } else if (/^\d{4}\/\d{2}\/\d{2}$/.test(value)) {
            momentObj = moment(value, "YYYY/MM/DD", true);
          }

          if (momentObj && momentObj.isValid()) {
            displayValue = momentObj.format("YYYY-MM-DD");
            dataValue = momentObj.format("YYYYMMDD");
          } else {
            displayValue = "";
            dataValue = "";
          }
        }

        return {
          kind: GridCellKind.Text,
          data: dataValue,
          copyData: String(dataValue || ""),
          displayData: displayValue,
          readonly: column?.readonly || false,
          allowOverlay: true,
          hasMenu: column?.hasMenu || false,
        };
      }
      if (columnKey === "Qty" || columnKey === "ProgQty") {
        const formattedValue = new Intl.NumberFormat("en-US", {
          minimumFractionDigits: 4,
          maximumFractionDigits: 4,
        }).format(value);

        return {
          kind: GridCellKind.Number,
          data: value,
          copyData: formattedValue === "0.0000" ? "" : String(value),
          displayData: formattedValue === "0.0000" ? "" : formattedValue,
          readonly: column?.readonly || false,
          allowOverlay: true,
          hasMenu: column?.hasMenu || false,
          contentAlign: "right"
        };
      }
      if (columnKey === 'IsConfirm' || columnKey === 'IsStop') {
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
      return {
        kind: GridCellKind.Text,
        data: value,
        copyData: String(value || ""),
        displayData: String(value || ""),
        readonly: column?.readonly || false,
        allowOverlay: true,
        hasMenu: column?.hasMenu || false,
        isEditing: true,
      };
    },
    [gridData, cols, numRows]
  );

  const onKeyUp = useCallback(
    (event) => {
      if (event.key === 'Backspace') {
        const [col, row] = event.location

        setGridData((prev) => {
          const newData = [...prev]
          if (newData[row]) {
            const column = cols[col - 1]
          }
          return newData
        })
      }
    },
    [cols, gridData],
  )


  const onCellEdited = useCallback(
    async (cell, newValue) => {
      if (!canEdit) {
        message.warning(t('850000035'));
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

      const indexes = reorderColumns(cols);
      const [col, row] = cell;
      const key = indexes[col];

      if (editingRow !== null && editingRow !== row) {
        message.warning("Bạn chỉ có thể chỉnh sửa một hàng tại một thời điểm!");
        return;
      }

      if (!["IsConfirm", "IsStop"].includes(key)) return;

      setEditingRow(row);
      setSelectedRowData(gridData[row]);
      setOriginalValue(gridData[row][key]);
      setSelectedKey(key);
      setIsModalOpen(true);
    },
    [canEdit, cols, gridData, editingRow]
  );




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
      saveToLocalStorageSheet('pdmm_out_list_extra_ah', newHidden)
      return newHidden
    })
  }

  const updateVisibleColumns = (newVisibleColumns) => {
    setCols((prevCols) => {
      const newCols = [...new Set([...prevCols, ...newVisibleColumns])]
      const uniqueCols = newCols.filter(
        (col, index, self) => index === self.findIndex((c) => c.id === col.id),
      )
      saveToLocalStorageSheet('pdmm_out_list_extra_a', uniqueCols)
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
          (col, index, self) =>
            index === self.findIndex((c) => c.id === col.id),
        )
        saveToLocalStorageSheet('pdmm_out_list_extra_a', uniqueCols)
        return uniqueCols
      })
      setShowMenu(null)
    }
  }
  // Hàm rEST LẤY LẠI CỘT DỮ LIỆU

  const handleReset = () => {
    setCols(defaultCols.filter((col) => col.visible))
    setHiddenColumns([])
    localStorage.removeItem('pdmm_out_list_extra_a')
    localStorage.removeItem('pdmm_out_list_extra_ah')
    setShowMenu(null)
  }

  const onColumnMoved = useCallback((startIndex, endIndex) => {
    setCols((prevCols) => {
      const updatedCols = [...prevCols]
      const [movedColumn] = updatedCols.splice(startIndex, 1)
      updatedCols.splice(endIndex, 0, movedColumn)
      saveToLocalStorageSheet('pdmm_out_list_extra_a', updatedCols)
      return updatedCols
    })
  }, [])

  const showDrawer = () => {
    const invisibleCols = defaultCols
      .filter((col) => col.visible === false)
      .map((col) => col.id)
    const currentVisibleCols = loadFromLocalStorageSheet(
      'pdmm_out_list_extra_a',
      [],
    ).map((col) => col.id)
    const newInvisibleCols = invisibleCols.filter(
      (col) => !currentVisibleCols.includes(col),
    )
    updateHiddenColumns(newInvisibleCols)
    updateVisibleColumns(
      defaultCols.filter(
        (col) => col.visible && !hiddenColumns.includes(col.id),
      ),
    )
    setOpen(true)
    setShowMenu(null)
  }
  const onClose = () => {
    setOpen(false)
  }

  const handleCheckboxChange = (columnId, isChecked) => {
    if (isChecked) {
      const restoredColumn = defaultCols.find((col) => col.id === columnId)
      setCols((prevCols) => {
        const newCols = [...prevCols, restoredColumn]
        saveToLocalStorageSheet('pdmm_out_list_extra_a', newCols)
        return newCols
      })
      setHiddenColumns((prevHidden) => {
        const newHidden = prevHidden.filter((id) => id !== columnId)
        saveToLocalStorageSheet('pdmm_out_list_extra_ah', newHidden)
        return newHidden
      })
    } else {
      setCols((prevCols) => {
        const newCols = prevCols.filter((col) => col.id !== columnId)
        saveToLocalStorageSheet('pdmm_out_list_extra_a', newCols)
        return newCols
      })
      setHiddenColumns((prevHidden) => {
        const newHidden = [...prevHidden, columnId]
        saveToLocalStorageSheet('pdmm_out_list_extra_ah', newHidden)
        return newHidden
      })
    }
  }

  const CheckSCOMConfirm = (selectedRowData) => {
    const check = {
      IDX_NO: selectedRowData?.IdxNo || 0,
      DataSeq: selectedRowData?.IdxNo || 0,
      CfmSeq: selectedRowData?.OutReqSeq || 0,
      Reason: remark,
      CfmCode: selectedRowData?.IsConfirm != null
        ? (Number(selectedRowData.IsConfirm) === 1 ? 0 : 1)
        : ""
    };

    PostSCOMConfirm(check)
      .then(response => {
        const status = response?.data?.[0]?.Status;

        if (status !== 0) {
          message.error(`Lỗi: ${response?.data?.[0]?.Result}`);
          throw new Error(`Lỗi từ server, Status: ${status}`);
        }

        setGridData(prevData =>
          prevData.map(item =>
            item.IdxNo === selectedRowData.IdxNo
              ? {
                ...item,
                [selectedKey]: ["1", 1, true].includes(item[selectedKey]) ? false : true
              }
              : item
          )
        );

        setRemark('')
        message.success("Cập nhật trạng thái thành công!");
      })
      .catch(error => {
        console.error("Error:", error);
      })
      .finally(() => {
        console.log("CheckSCOMConfirm completed");
      });
  };

  const CheckSPDMMOutReqCancel = (selectedRowData) => {
    const check = {
      IsConfirm: selectedRowData?.IsConfirm != null
        ? (Number(selectedRowData.IsConfirm) === 1 ? 0 : 1)
        : "",
      IsStop: selectedRowData?.IsStop != null
        ? (Number(selectedRowData.IsStop) === 1 ? 0 : 1)
        : "",
      Qty: selectedRowData?.Qty,
      ProgStatusName: selectedRowData?.ProgStatusName,
      OutReqSeq: selectedRowData?.OutReqSeq,
      ProgStatus: selectedRowData?.ProgStatus,

    };


    PostSPDMMOutReqCancel(check)
      .then(response => {
        const status = response?.data?.[0]?.Status;

        if (status !== 0) {
          message.error(`Lỗi: ${response?.data?.[0]?.Result}`);

          throw new Error(`Lỗi từ server, Status: ${status}`);
        }
        setGridData((prevData) => {
          const updatedData = [...prevData];
          const rowIndex = updatedData.findIndex((item) => item === selectedRowData);
          if (rowIndex !== -1) {
            updatedData[rowIndex][selectedKey] = ["1", true].includes(originalValue) ? false : true;

          }

          return updatedData;
        });
        message.success("Cập nhật trạng thái thành công!");
      })
      .catch(error => {
        console.error("Error:", error);
      })
      .finally(() => {
        console.log("CheckSCOMConfirm completed");
      });
  };



  const handleModalOk = () => {
    if (selectedKey === "IsConfirm") {
      CheckSCOMConfirm(selectedRowData);
    } else if (selectedKey === "IsStop") {
      CheckSPDMMOutReqCancel(selectedRowData);
    }
    setIsModalOpen(false);
    setEditingRow(null);
  };


  const handleModalCancel = () => {
    setGridData((prevData) => {
      const updatedData = [...prevData];
      const rowIndex = updatedData.findIndex((item) => item === selectedRowData);

      if (rowIndex !== -1) {
        updatedData[rowIndex][selectedKey] = originalValue;
      }

      return updatedData;
    });

    setIsModalOpen(false);
    setEditingRow(null);
  };
  const isStop = selectedKey === "IsStop" ? originalValue === true || originalValue === "1" : false;
  const isConfirm = selectedKey === "IsConfirm" ? originalValue === true || originalValue === "1" : false;

  return (
    <div className="w-full h-full flex flex-col bg-white overflow-hidden">
      <div className="w-full h-full flex flex-col  bg-white overflow-hidden ">
        <h2 className="text-xs border-b font-medium flex items-center gap-2 p-2 text-blue-600 uppercase">
          <TableOutlined />
          DATA SHEET
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
          rowMarkers={('checkbox-visible', 'both')}
          rowSelect="single"
          width="100%"
          height={window.innerHeight}
          headerHeight={30}
          rowHeight={25}
          gridSelection={selection}
          onGridSelectionChange={setSelection}
          getCellsForSelection={true}
          trailingRowOptions={{
            hint: ' ',
            sticky: true,
            tint: true,
          }}
          freezeTrailingRows={1}
          freezeColumns={1}
          getRowThemeOverride={(rowIndex) => {
            if (rowIndex === hoverRow) {
              return {
                bgCell: '#f7f7f7',
                bgCellMedium: '#f0f0f0',
              }
            }
            return undefined
          }}
          overscrollY={0}
          overscrollX={50}
          smoothScrollX={true}
          smoothScrollY={true}

          onPaste={true}
          fillHandle={true}
          keybindings={keybindings}
          isDraggable={false}

          onColumnResize={onColumnResize}
          onHeaderMenuClick={onHeaderMenuClick}
          onColumnMoved={onColumnMoved}
          onKeyUp={onKeyUp}
          onCellEdited={onCellEdited}
          onItemHovered={onItemHovered}

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
                  data={gridData}

                  handleRestSheet={handleRestSheet}
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
        <Drawer title="CÀI ĐẶT SHEET" onClose={onClose} open={open}>
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

        <Modal
          centered
          open={isModalOpen}
          onOk={handleModalOk}
          onCancel={handleModalCancel}
          closable={false}
          width={600}
          maskClosable={false}
          footer={[
            <Button key="cancel" onClick={handleModalCancel}>
              Hủy
            </Button>,
            <Button key="ok" type="primary" onClick={handleModalOk}>
              Xác nhận
            </Button>
          ]}
        >
          <div className="items-center justify-center flex flex-col">
            {isStop ? (
              <PauseCircleOutlined style={{ fontSize: "48px", color: "#faad14" }} className="mb-2" />
            ) : isConfirm ? (
              <IssuesCloseOutlined style={{ fontSize: "48px", color: "#ff4d4f" }} className="mb-2" />
            ) : selectedKey === "IsStop" ? (
              <PauseCircleOutlined style={{ fontSize: "48px", color: "#faad14" }} className="mb-2" />
            ) : (
              <IssuesCloseOutlined style={{ fontSize: "48px", color: "#52c41a" }} className="mb-2" />
            )}


            <p className="mt-6 text-lg font-bold">
              {isStop ? "Bỏ trạng thái tạm dừng" : isConfirm ? "Bỏ xác nhận" : selectedKey === "IsStop" ? "Tạm dừng đơn hàng" : "Xác nhận đơn hàng"}
            </p>
            {selectedRowData && (
              <div className="mt-4 p-4 bg-gray-100 rounded-lg w-full text-left">
                <p><strong>Mã đề nghị:</strong> {selectedRowData?.OutReqNo || "Không có dữ liệu"}</p>
                <p><strong>Sản phẩm:</strong> {selectedRowData?.ItemName || "Không có dữ liệu"} ({selectedRowData?.ItemSpec || "Không có mô tả"})</p>
                <p><strong>Số lượng:</strong> {selectedRowData?.Qty || 0} {selectedRowData?.UnitName || ""}</p>
                <p><strong>Người yêu cầu:</strong> {selectedRowData?.EmpName || "Không có dữ liệu"}</p>
                <p><strong>Bộ phận:</strong> {selectedRowData?.DeptName || "Không có dữ liệu"}</p>
                {selectedKey === "IsStop" && (
                  <p><strong>Lý do tạm dừng:</strong> {selectedRowData?.Remark || "Không có lý do"}</p>
                )}
              </div>
            )}
            <div className="w-full mt-4">
              <label className="font-semibold">Lý do:</label>
              <Input.TextArea
                value={remark}
                onChange={handleInputChange}
                placeholder="Nhập lý do..."
                className="mt-2"
                autoSize={{ minRows: 5, maxRows: 5 }}
              />
            </div>
          </div>
        </Modal>
      </div>
    </div>
  )
}

export default TablePdmmOutQueryList
