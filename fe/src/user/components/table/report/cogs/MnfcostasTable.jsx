import { useEffect, useState, useCallback, useMemo, useRef } from 'react'
import { DataEditor, GridCellKind } from '@glideapps/glide-data-grid'
import '@glideapps/glide-data-grid/dist/index.css'
import { TableOutlined } from '@ant-design/icons'
import { useLayer } from 'react-laag'
import LayoutMenuSheet from '../../../sheet/jsx/layoutMenu'
import LayoutStatusMenuSheet from '../../../sheet/jsx/layoutStatusMenu'
import { Drawer, Checkbox, message } from 'antd'
import { saveToLocalStorageSheet } from '../../../../../localStorage/sheet/sheet'
import { loadFromLocalStorageSheet } from '../../../../../localStorage/sheet/sheet'
import { reorderColumns } from '../../../sheet/js/reorderColumns'
import useOnFill from '../../../hooks/sheet/onFillHook'
import { useExtraCells } from '@glideapps/glide-data-grid-cells'
import { updateIndexNo } from '../../../sheet/js/updateIndexNo'
import moment from 'moment'
import { t } from 'i18next'

function MnfcostasTable({
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
}) {
    const gridRef = useRef(null)
    const [open, setOpen] = useState(false)
    const cellProps = useExtraCells()
    const onFill = useOnFill(setGridData, cols)
    const onSearchClose = useCallback(() => setShowSearch(false), [])
    const [showMenu, setShowMenu] = useState(null)
    const [isCell, setIsCell] = useState(null)
    const [hoverRow, setHoverRow] = useState(null);
    const seenClasses = useRef(new Set());
    const onItemHovered = useCallback((args) => {
        const [_, row] = args.location
        setHoverRow(args.kind !== 'cell' ? undefined : row)
    }, [])
    const [hiddenColumns, setHiddenColumns] = useState(() => {
        return loadFromLocalStorageSheet('mnfcostas_report_h', [])
    })
    const onHeaderMenuClick = useCallback((col, bounds) => {
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
    }, [])

    const uniqueColumnNames = [...new Set([
    ])];

    const highlightRegions = [

    ].map(columnName => ({
        color: '#ebf1ff',
        range: {
            x: reorderColumns(cols).indexOf(columnName),
            y: 0,
            width: 1,
            height: numRows,
        },
    }))
        .concat(
            uniqueColumnNames.map(columnName => ({
                color: '#F0F2F5',
                range: {
                    x: reorderColumns(cols).indexOf(columnName),
                    y: 0,
                    width: 1,
                    height: numRows,
                },
            }))
        );
    const [keybindings, setKeybindings] = useState({
        downFill: true,
        rightFill: true,
        selectColumn: false
    })


 


    const getData = useCallback(
        ([col, row]) => {
            const person = gridData[row] || {};
            const column = cols[col];
            const columnKey = column?.id || '';
            let value = person[columnKey] || '';
            const level = person["Level"];

            let themeOverride;
            switch (level) {
                case 1:
                    themeOverride = {
                        bgCell: '#f0f5ff',
                        textDark: '#003a8c',
                        fontWeight: 'bold',
                    };
                    break;
                case 2:
                    themeOverride = {
                        textDark: '#0050b3',
                        fontWeight: 'bold',
                    };
                    break;
                case 3:
                    themeOverride = {
                        bgCell: '#fafafa',
                        textDark: '#262626',
                    };
                    break;
                case 4:
                    themeOverride = {
                        bgCell: '#ffffff',
                        textDark: '#595959',
                        fontStyle: 'italic',
                    };
                    break;
                default:
                    themeOverride = undefined;
            }



            const numericColumns = [
                'POCPreAmt',
                'PMPPreAmt',
                'SENSORPreAmt',
                'SEMIPreAmt',
                'PCMPreAmt',
                'SAMSUNGPreAmt',
                'LGPreAmt',
                'ECPreAmt',
                'MTPackPreAmt',
                'SumPackPreAmt',
                'PACKPreAmt',
                'IPJTPreAmt',
                'XPJTPreAmt',
                'PPJITPreAmt',
                'RemoconPreAmt',
                'PSGPreAmt',
                'SUMPreAmt',
                'POCCurrAmt',
                'PMPCurrAmt',
                'SENSORCurrAmt',
                'SEMICurrAmt',
                'PCMCurrAmt',
                'SAMSUNGCurrAmt',
                'LGCurrAmt',
                'ECCurrAmt',
                'MTPackCurrAmt',
                'SumPackCurrAmt',
                'PACKCurrAmt',
                'IPJTCurrAmt',
                'XPJTCurrAmt',
                'PPJITCurrAmt',
                'RemoconCurrAmt',
                'PSGCurrAmt',
                'SUMCurrAmt',
                'POCSumResult',
                'PMPSumResult',
                'SENSORSumResult',
                'SEMISumResult',
                'PCMSumResult',
                'SAMSUNGSumResult',
                'LGSumResult',
                'ECSumResult',
                'MTPackSumResult',
                'SumPackSumResult',
                'PACKSumResult',
                'IPJTSumResult',
                'XPJTSumResult',
                'PPJTSumResult',
                'RemoconSumResult',
                'PSGSumResult',
                'SUMSumResult',
                'PreAmt_IPJT',
                'CurrAmt_IPJT',
                'SumResult_IPJT',
                'PreAmt_XPJT',
                'CurrAmt_XPJT',
                'SumResult_XPJT',
                'PreAmt_PPJT',
                'CurrAmt_PPJT',
                'SumResult_PPJT',
                'PreAmt_PSGTotal',
                'CurrAmt_PSGTotal',
                'SumResult_PSGTotal',
                'PreAmt_NewODM',
                'Curr_NewODM',
                'Sum_NewODM',
                'PreAmt_CARTRIDGE',
                'Curr_CARTRIDGE',
                'Sum_CARTRIDGE',
                'PreAmt_DEVICE',
                'CurrAmt_DEVICE',
                'SumResult_DEVICE',
                'PreAmt_INNER',
                'Curr_INNER',
                'Sum_INNER'
            ];

            if (numericColumns.includes(columnKey)) {
                const rawText = value?.toString?.() || '';
                const numericValue = rawText.replace(/,/g, '');
                const number = Number(numericValue);
                const formattedValue = isNaN(number)
                    ? ''
                    : number.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    });

                return {
                    kind: GridCellKind.Number,
                    data: formattedValue,
                    displayData: formattedValue,
                    copyData: formattedValue,
                    readonly: column?.readonly || false,
                    allowOverlay: true,
                    hasMenu: column?.hasMenu || false,
                    contentAlign: 'right',
                    themeOverride
                };
            }

            return {
                kind: GridCellKind.Text,
                data: value,
                displayData: String(value),
                readonly: column?.readonly || false,
                allowOverlay: true,
                hasMenu: column?.hasMenu || false,
                themeOverride
            };
        },
        [gridData, cols]
    );





    const onKeyUp = useCallback(
        (event) => {
            const indexes = reorderColumns(cols)
        },
        [cols, gridData]
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
            saveToLocalStorageSheet('mnfcostas_report_h', newHidden)
            return newHidden
        })
    }

    const updateVisibleColumns = (newVisibleColumns) => {
        setCols((prevCols) => {
            const newCols = [...new Set([...prevCols, ...newVisibleColumns])]
            const uniqueCols = newCols.filter(
                (col, index, self) => index === self.findIndex((c) => c.id === col.id)
            )
            saveToLocalStorageSheet('mnfcostas_report_a', uniqueCols)
            return uniqueCols
        })
    }

    const handleHideColumn = (colIndex) => {
        const columnId = cols[colIndex]?.id
        if (cols.length > 1) {
            updateHiddenColumns([columnId])
            setCols((prevCols) => {
                const newCols = prevCols.filter((_, idx) => idx !== colIndex)
                const uniqueCols = newCols.filter(
                    (col, index, self) => index === self.findIndex((c) => c.id === col.id)
                )
                saveToLocalStorageSheet('mnfcostas_report_a', uniqueCols)
                return uniqueCols
            })
            setShowMenu(null)
        }
    }
    // Hàm rEST LẤY LẠI CỘT DỮ LIỆU

    const handleReset = () => {
        setCols(defaultCols.filter((col) => col.visible))
        setHiddenColumns([])
        localStorage.removeItem('mnfcostas_report_a')
        localStorage.removeItem('mnfcostas_report_h')
    }

    const onColumnMoved = useCallback((startIndex, endIndex) => {
        setCols((prevCols) => {
            const updatedCols = [...prevCols]
            const [movedColumn] = updatedCols.splice(startIndex, 1)
            updatedCols.splice(endIndex, 0, movedColumn)
            saveToLocalStorageSheet('mnfcostas_report_a', updatedCols)
            return updatedCols
        })
    }, [])

    const showDrawer = () => {
        const invisibleCols = defaultCols.filter((col) => col.visible === false).map((col) => col.id)
        const currentVisibleCols = loadFromLocalStorageSheet('mnfcostas_report_a', []).map(
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
                saveToLocalStorageSheet('mnfcostas_report_a', newCols)
                return newCols
            })
            setHiddenColumns((prevHidden) => {
                const newHidden = prevHidden.filter((id) => id !== columnId)
                saveToLocalStorageSheet('mnfcostas_report_h', newHidden)
                return newHidden
            })
        } else {
            setCols((prevCols) => {
                const newCols = prevCols.filter((col) => col.id !== columnId)
                saveToLocalStorageSheet('mnfcostas_report_a', newCols)
                return newCols
            })
            setHiddenColumns((prevHidden) => {
                const newHidden = [...prevHidden, columnId]
                saveToLocalStorageSheet('mnfcostas_report_h', newHidden)
                return newHidden
            })
        }
    }

    return (
        <div className="w-full gap-1 h-full flex items-center justify-center">
            <div className="w-full h-full flex flex-col  bg-white  overflow-hidden ">
                <h2 className="text-[10px]  text-blue-600 border-b font-medium flex items-center gap-2 p-1  uppercase">
                    {t('800000191')}
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
                    freezeColumns={2}
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
                    rowHeight={25}
                    smoothScrollY={false}
                    smoothScrollX={false}
                    onPaste={true}
                    highlightRegions={highlightRegions}
                    onColumnResize={onColumnResize}
                    onHeaderMenuClick={onHeaderMenuClick}
                    onColumnMoved={onColumnMoved}
                    onKeyUp={onKeyUp}
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

export default MnfcostasTable
