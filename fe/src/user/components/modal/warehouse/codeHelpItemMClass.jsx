import { useState, useEffect } from 'react'
import { Modal, Button, Select, Input } from 'antd'
import { SearchOutlined, FilterOutlined } from '@ant-design/icons'
import { ArrowIcon } from '../../icons'
import TableCodeHelpItemMClass from '../../table/codeHelp/codeHelpItemMClass'
const { Search } = Input
import { CompactSelection } from '@glideapps/glide-data-grid'
import { useTranslation } from 'react-i18next'

export default function CodeHelpItemMClass({
  setConditionSeq,
  data,
  modalVisible,
  setModalVisible,
  fetchCodehelpData2,
  handleSearch,
  setSubConditionSql,
  setItemMClassName,
  setItemMClassSeq,
  itemMClassName,
  selection,
  setSelection,
  resetTable,
}) {
  const [isMinusClicked, setIsMinusClicked] = useState(false)
  const [lastClickedCell, setLastClickedCell] = useState(null)
  const [clickedRowData, setClickedRowData] = useState(null)
  const { t } = useTranslation()
  const [keyPath, setKeyPath] = useState(null)
  const handleConditionSeq = (e) => {
    setConditionSeq(e)
  }
  const handleSubConditionSql = (e) => {
    setSubConditionSql(e)
  }
  const onCellClicked = (cell, event) => {
    let rowIndex
    if (cell[0] !== -1) {
      console.log('onCellClicked')
      return
    }

    if (cell[0] === -1) {
      rowIndex = cell[1]
      setIsMinusClicked(true)
    } else {
      rowIndex = cell[0]
      setIsMinusClicked(false)
    }

    if (
      lastClickedCell &&
      lastClickedCell[0] === cell[0] &&
      lastClickedCell[1] === cell[1]
    ) {
      setItemMClassName('')
      setItemMClassSeq('0')
      setLastClickedCell(null)
      setClickedRowData(null)
      return
    }

    if (rowIndex >= 0 && rowIndex < data.length) {
      const rowData = data[rowIndex]
      setItemMClassName(rowData?.ItemClassMName)
      setItemMClassSeq(rowData?.UMItemClass)
      setClickedRowData(rowData)
      setLastClickedCell(cell)
    }
  }

  const handleClose = () => {
    setModalVisible(false)
    setItemMClassName('')
    setItemMClassSeq('0')
    resetTable()
  }
  const search = (e) => {
    setItemMClassName(e.target.value)
    setItemMClassSeq('')
    resetTable()
  }
  return (
    <div>
      <Modal
        open={modalVisible}
        width="80%"
        maskClosable={false}
        footer={null}
        closable={false}
        style={{
          top: 50,
        }}
      >
        <div
          style={{ display: 'flex', flexDirection: 'column', height: '75vh' }}
          className="gap-4"
        >
          <details
            className="group p-2 [&_summary::-webkit-details-marker]:hidden border rounded-lg bg-white"
            open
          >
            <summary className="flex cursor-pointer items-center justify-between gap-1.5 text-gray-900">
              <h2 className="text-xs font-medium flex items-center gap-2 text-blue-600">
                <FilterOutlined />
               {t('359')}
              </h2>
              <span className="relative size-5 shrink-0">
                <ArrowIcon />
              </span>
            </summary>
            <div className="flex p-2 gap-4">
              <div className="flex flex-col">
                <Select
                  id="typeSelect"
                  defaultValue={t('ItemMClassName')}
                  style={{ width: 120 }}
                  size="middle"
                  onChange={handleConditionSeq}
                  options={[
                    { value: 1, label: t('ItemMClassName') },
                    { value: 0, label: t('Code') },
                  ]}
                />
              </div>
              <div className="flex flex-col w-full">
                <Search
                  allowClear
                  size="middle"
                  placeholder={t('1357')}
                  value={itemMClassName}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSearch()
                    }
                  }}
                  onChange={search}
                  className=" w-full"
                />
              </div>
              <div className="flex flex-col">
                <Button
                  type="primary"
                  icon={<SearchOutlined />}
                  size="middle"
                  onClick={fetchCodehelpData2}
                >
                  {t('1357')}
                </Button>
              </div>
            </div>
          </details>

          <TableCodeHelpItemMClass
            data={data}
            onCellClicked={onCellClicked}
            setSelection={setSelection}
            selection={selection}
          />
        </div>
        <div className="flex justify-end gap-4 ">
          <Button onClick={handleClose}>{t('20645')}</Button>
          <Button type="primary" onClick={() => setModalVisible(false)}>
            {t('14969')}
          </Button>
        </div>
      </Modal>
    </div>
  )
}
