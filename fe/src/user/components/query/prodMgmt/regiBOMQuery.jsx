import { useState, useCallback, useEffect, useRef } from 'react'
import { Button, Form, Input, Row, Col, Select } from 'antd'
import CustomRenderer, {
    getMiddleCenterBias,
    GridCellKind,
    TextCellEntry,
    useTheme,
    DataEditor,
} from '@glideapps/glide-data-grid'
import { SearchOutlined, TableOutlined, CloseOutlined } from '@ant-design/icons'
import { CompactSelection } from '@glideapps/glide-data-grid'
import useOnFill from '../../hooks/sheet/onFillHook'
import { useTranslation } from 'react-i18next'
import Dropdown18074 from '../../sheet/query/dropdown18074'

export default function RegiBOMQuery({ helpData01, setHelpData01, controllers, setDataSearch, dataSearch, dataSheetSearch, setDataSheetSearch, setItemText, itemText, searchText, setSearchText }) {
    const gridRef = useRef(null)
    const { t } = useTranslation()

    const [filteredData, setFilteredData] = useState([])
    const [hoverRow, setHoverRow] = useState(null)
    const [dropdownVisible, setDropdownVisible] = useState(false)
    const dropdownRef = useRef(null)
    const [selection, setSelection] = useState({
        columns: CompactSelection.empty(),
        rows: CompactSelection.empty(),
    })
    const [numRows, setNumRows] = useState(0)
    const defaultCols = [
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

    const [cols, setCols] = useState(defaultCols)
    const onFill = useOnFill(filteredData, cols)

    useEffect(() => {
        setFilteredData(helpData01)
        setNumRows(helpData01.length)
    }, [helpData01])

    const handleSearch = (e) => {
        const value = e.target.value
        setSearchText(value)
        if (value.trim() === '' || value === null) {
            setItemText('')
            setFilteredData(helpData01)
            setDataSearch(null)
            setDataSheetSearch([])
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
        const data = searchText.trim() === '' ? helpData01 : filteredData
        if (data[row]) {
            const selectedLanguage = data[row].ItemName
            setSearchText(selectedLanguage)
            setItemText(selectedLanguage)
            setDataSearch(data[row])
            setDataSheetSearch([data[row]])
            setDropdownVisible(false)
        }
    }

    const onItemHovered = useCallback((args) => {
        const [_, row] = args.location
        setHoverRow(args.kind !== 'cell' ? undefined : row)
    }, [])

    const filterOption = (input, option) => {
        const label = option.label.toString().toLowerCase()
        const value = option.value.toString().toLowerCase()
        return (
            label.includes(input.toLowerCase()) || value.includes(input.toLowerCase())
        )
    }

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
            const column = cols[col]
            const columnKey = column?.id || ''
            const value = person[columnKey] || ''
            const boundingBox = document.body.getBoundingClientRect()

            return {
                kind: GridCellKind.Text,
                data: value,
                displayData: String(value),
                readonly: column?.readonly || false,
                allowOverlay: true,
            }
        },
        [filteredData, cols],
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

    const handleOpenHelpSheet = () => {
        setDropdownVisible(true)
        handleSearch({ target: { value: searchText } })
    }

    return (
        <div className="flex items-center gap-2">
            <Form>
                <Row className="gap-4 flex items-center">
                    <Col>
                        <Form.Item
                            label={
                                <span className="uppercase text-[9px]">{t('1786')}</span>
                            }
                            className="mb-0"
                        >
                            <Input placeholder="" className='w-[300px]' size="middle" value={itemText} onFocus={handleOpenHelpSheet} style={{ backgroundColor: '#e8f0ff' }} />
                  
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
                                    controllers={controllers}
                                    setHelpData01={setHelpData01}
                                />
                            )}
                        </Form.Item>
                    </Col>
                    <Col>
                        <Form.Item
                            label={<span className="uppercase text-[9px]">{t('2091')}</span>}
                            className="mb-0"
                        >
                            <Input placeholder="" size="middle" readOnly value={dataSearch?.ItemNo} />
                        </Form.Item>
                    </Col>
                    <Col>
                        <Form.Item
                            label={
                                <span className="uppercase text-[9px]">
                                    {t('551')}
                                </span>
                            }
                            className="mb-0"
                        >
                            <Input placeholder="" size="middle" readOnly value={dataSearch?.Spec} />
                        </Form.Item>
                    </Col>


                </Row>
            </Form>
        </div>
    )
}