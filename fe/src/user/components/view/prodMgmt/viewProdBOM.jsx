import { Splitter, SplitterPanel } from 'primereact/splitter'
import { Menu, Form, Input, Row, Col, Select, Button } from 'antd';
import { Tabs } from 'antd';
import { useState, useCallback, useEffect, useRef } from 'react'
import TableRegiBOM from '../../table/prodMgmt/tableRegiBOM';
import CustomRenderer, {
    getMiddleCenterBias,
    GridCellKind,
    TextCellEntry,
    useTheme,
    DataEditor,
} from '@glideapps/glide-data-grid'
import { useTranslation } from 'react-i18next'
import { SearchOutlined, TableOutlined, CloseOutlined } from '@ant-design/icons'
import { CompactSelection } from '@glideapps/glide-data-grid'
import useOnFill from '../../hooks/sheet/onFillHook';
import Dropdown18074 from '../../sheet/query/dropdown18074';
import TableBomReportAll from '../../table/prodMgmt/tableBomReportAll';
const ViewProdBOM = ({
    setSelection,
    selection,
    setShowSearch,
    showSearch,
    setEditedRows,
    setGridData,
    gridData,
    setNumRows,
    numRows,
    handleRowAppend,
    setCols,
    cols,
    defaultCols,
    dataNaWare,
    handleRestSheet,
    canEdit,
    dataSearch,
    dataSheetSearch,
    verMng,
    setDataSheetSearch, helpData01, helpData02,
    helpData03, dataRootSeq,
    setDataRootSeq,
    fetchDataBomSubItem,
    fetchDataBomVerMng,
    setHelpData02,
    setHelpData03,
    setHelpData01,
    setDataSearch

}) => {
    const { t } = useTranslation()
    const gridRef = useRef(null)
    const [searchText, setSearchText] = useState('')
    const [itemText, setItemText] = useState('')
    const [filteredData, setFilteredData] = useState([])
    const [hoverRow, setHoverRow] = useState(null)
    const [dropdownVisible, setDropdownVisible] = useState(false)
    const dropdownRef = useRef(null)
    const [selectionB, setSelectionB] = useState({
        columns: CompactSelection.empty(),
        rows: CompactSelection.empty(),
    })
    const [numRowsB, setNumRowsB] = useState(0)
    const defaultColsB = [
        {
            title: t('1786'),
            id: 'ItemName',
            kind: 'Text',
            readonly: true,
            width: 200,
        },
        {
            title: t('2091'),
            id: 'ItemSeq',
            kind: 'Text',
            readonly: true,
            width: 200,
        },
        {
            title: t('24719'),
            id: 'ItemNo',
            kind: 'Text',
            readonly: true,
            width: 100,
        },
        {
            title: t('551'),
            id: 'Spec',
            kind: 'Text',
            readonly: true,
            width: 100,
        },
        {
            title: t('3122'),
            id: 'ItemClassLName',
            kind: 'Text',
            readonly: true,
            width: 100,
        },
        {
            title: t('3262'),
            id: 'ItemClassMName',
            kind: 'Text',
            readonly: true,
            width: 100,
        },
        {
            title: t('15151'),
            id: 'ItemClassName',
            kind: 'Text',
            readonly: true,
            width: 100,
        },
        {
            title: t('602'),
            id: 'STDUnitName',
            kind: 'Text',
            readonly: true,
            width: 100,
        },
        {
            title: t('2085'),
            id: 'BOMUnitName',
            kind: 'Text',
            readonly: true,
            width: 100,
        },
    ]

    const [colsB, setColsB] = useState(defaultColsB)
    const onFill = useOnFill(filteredData, colsB)
    const [dataError, setDataError] = useState([])
    useEffect(() => {
        setFilteredData(helpData01)
        setNumRowsB(helpData01.length)
    }, [helpData01])

    const handleSearch = (e) => {
        const value = e.target.value
        setSearchText(value)
        if (value.trim() === '' || value === null) {
            setItemText('')
            setFilteredData(helpData01)
            setDataSheetSearch([])
            setDataRootSeq(null)
        } else {
            const filtered = helpData01.filter(
                (item) =>
                    item.ItemName.toLowerCase().includes(value.toLowerCase()) ||
                    item.Spec.toLowerCase().includes(value.toLowerCase()) ||
                    item.ItemNo.toLowerCase().includes(value.toLowerCase())
            )
            setFilteredData(filtered)
        }
        setDropdownVisible(true)
    }

    const handleCellClick = ([col, row]) => {
        const data = searchText && searchText.trim() === '' ? helpData01 : filteredData;

        if (data[row]) {
            const seq = {
                ItemSeq: data[row]?.ItemSeq
            };
            const selectedLanguage = data[row].ItemName;
            setSearchText(selectedLanguage);
            setItemText(selectedLanguage);
            setDataSheetSearch([data[row]]);
            setDataRootSeq(data[row]);
            setDropdownVisible(false);
            fetchDataBomSubItem(seq);
            fetchDataBomVerMng(seq);
        }
    };

    const onItemHovered = useCallback((args) => {
        const [_, row] = args.location
        setHoverRow(args.kind !== 'cell' ? undefined : row)
    }, [])


    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setDropdownVisible(false)
        }
    }

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    const getData = useCallback(
        ([col, row]) => {
            const person = filteredData[row] || {}
            const column = colsB[col]
            const columnKey = column?.id || ''
            const value = person[columnKey] || ''

            return {
                kind: GridCellKind.Text,
                data: value,
                displayData: String(value),
                readonly: column?.readonly || false,
                allowOverlay: true,
            }
        },
        [filteredData, colsB],
    )

    const onColumnResize = useCallback(
        (column, newSize) => {
            const index = colsB.indexOf(column)
            if (index !== -1) {
                const newCol = {
                    ...column,
                    width: newSize,
                }
                const newCols = [...colsB]
                newCols.splice(index, 1, newCol)
                setColsB(newCols)
            }
        },
        [colsB],
    )

    const handleOpenHelpSheet = () => {
        setDropdownVisible(true)
        handleSearch({ target: { value: dataSheetSearch[0]?.ItemName } })
    }

    return (
        <div className='h-full w-full'>
            <div className='min-h-[28] w-full bg-white border p-2'>
                <h2 className="text-[10px] font-medium flex items-center gap-2 uppercase">
                    {t('850000030')}
                </h2>
                <Form className='flex  items-center gap-3' >
                    {/* Row 1 */}
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label={<span className="uppercase text-[9px]">{t('850000031')}</span>}
                                style={{ marginBottom: 0 }}
                                labelCol={{ style: { marginBottom: 2, padding: 0 } }}
                                wrapperCol={{ style: { padding: 0 } }}
                            >
                                {/* <Input size="small" value={dataSheetSearch[0]?.ItemName} /> */}
                                <Input size="small" value={dataSheetSearch[0]?.ItemName} onFocus={handleOpenHelpSheet} style={{ backgroundColor: '#e8f0ff' }} />

                                {dropdownVisible && (
                                    <Dropdown18074
                                        helpData={helpData01}
                                        setSearchText={setSearchText}
                                        setItemText={setItemText}
                                        setDataSearch={setDataSearch}
                                        setDataSheetSearch={setDataSheetSearch}
                                        setDropdownVisible={setDropdownVisible}
                                        dropdownVisible={dropdownVisible}
                                        searchText={searchText}
                                        setHelpData01={setHelpData01}
                                    />
                                )}
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label={<span className="uppercase text-[9px]">{t('850000033')}</span>}
                                style={{ marginBottom: 0 }}
                                labelCol={{ style: { marginBottom: 2, padding: 0 } }}
                                wrapperCol={{ style: { padding: 0 } }}
                            >
                                <Input size="small" readOnly value={dataSheetSearch[0]?.ItemNo} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label={<span className="uppercase text-[9px]">{t('850000034')}</span>}
                                style={{ marginBottom: 0 }}
                                labelCol={{ style: { marginBottom: 2, padding: 0 } }}
                                wrapperCol={{ style: { padding: 0 } }}
                            >
                                <Input size="small" readOnly value={dataSheetSearch[0]?.Spec} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label={<span className="uppercase text-[9px]">{t('3279')}</span>}
                                style={{ marginBottom: 0 }}
                                labelCol={{ style: { marginBottom: 2, padding: 0 } }}
                                wrapperCol={{ style: { padding: 0 } }}
                            >
                                <Input size="small" value={"00"} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label={<span className="uppercase text-[9px]">{t('809')}</span>}
                                style={{ marginBottom: 0 }}
                                labelCol={{ style: { marginBottom: 2, padding: 0 } }}
                                wrapperCol={{ style: { padding: 0 } }}
                            >
                                <Input size="small" value={"00"} />
                            </Form.Item>
                        </Col>
                    </Row>

                    {/* Row 2 */}
                    <Row gutter={16} >
                        <Col span={12}>
                            <Form.Item
                                label={<span className="uppercase text-[9px]">{t('2119')}</span>}
                                style={{ marginBottom: 0 }}
                                labelCol={{ style: { marginBottom: 2, padding: 0 } }}
                                wrapperCol={{ style: { padding: 0 } }}
                            >
                                <Input size="small" value={dataSheetSearch[0]?.AssetName} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label={<span className="uppercase text-[9px]">{t('602')}</span>}
                                style={{ marginBottom: 0 }}
                                labelCol={{ style: { marginBottom: 2, padding: 0 } }}
                                wrapperCol={{ style: { padding: 0 } }}
                            >
                                <Input size="small" value={dataSheetSearch[0]?.UnitName} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label={<span className="uppercase text-[9px]">{t('178')}</span>}
                                style={{ marginBottom: 0 }}
                                labelCol={{ style: { marginBottom: 2, padding: 0 } }}
                                wrapperCol={{ style: { padding: 0 } }}
                            >
                                <Input size="small" readOnly value={verMng[0]?.RegDate} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label={<span className="uppercase text-[9px]">{t('5309')}</span>}
                                style={{ marginBottom: 0 }}
                                labelCol={{ style: { marginBottom: 2, padding: 0 } }}
                                wrapperCol={{ style: { padding: 0 } }}
                            >
                                <Input size="small" readOnly value={verMng[0]?.RegEmpName} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label={<span className="uppercase text-[9px]">{t('1235')}</span>}
                                style={{ marginBottom: 0 }}
                                labelCol={{ style: { marginBottom: 2, padding: 0 } }}
                                wrapperCol={{ style: { padding: 0 } }}
                            >
                                <Input size="small" readOnly value={verMng[0]?.LastEmpName} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label={<span className="uppercase text-[9px]">{t('9437')}</span>}
                                style={{ marginBottom: 0 }}
                                labelCol={{ style: { marginBottom: 2, padding: 0 } }}
                                wrapperCol={{ style: { padding: 0 } }}
                            >
                                <Input size="small" readOnly value={verMng[0]?.LastUptDate} />
                            </Form.Item>
                        </Col>

                    </Row>
                </Form>

            </div>
            <Splitter className="w-full h-full">
                <div className='h-full w-full bg-white border-r border-l overflow-auto'>
                    <TableRegiBOM
                        setSelection={setSelection}
                        selection={selection}
                        setShowSearch={setShowSearch}
                        showSearch={showSearch}
                        setEditedRows={setEditedRows}
                        setGridData={setGridData}
                        gridData={gridData}
                        setNumRows={setNumRows}
                        numRows={numRows}
                        handleRowAppend={handleRowAppend}
                        setCols={setCols}
                        cols={cols}
                        defaultCols={defaultCols}
                        canEdit={canEdit}
                        handleRestSheet={handleRestSheet}
                        helpData02={helpData02}
                        helpData03={helpData03}
                        dataRootSeq={dataRootSeq}
                        dataSheetSearch={dataSheetSearch}
                        setHelpData02={setHelpData02}
                        setHelpData03={setHelpData03}
                    />
                </div>
            </Splitter>


        </div>
    );
};

export default ViewProdBOM;
