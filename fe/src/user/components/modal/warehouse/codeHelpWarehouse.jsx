import { useState, useEffect } from 'react'
import { Modal, Button, Select, Input } from 'antd'
import { SearchOutlined, FilterOutlined } from '@ant-design/icons'
import { ArrowIcon } from '../../icons'
import TableCodeHelpWarehouse from '../../table/codeHelp/codeHelpWarehouse'
const { Search } = Input
import { useTranslation } from 'react-i18next'

export default function CodeHelpWarehouse({
  setConditionSeq,
  data,
  modalVisible,
  setModalVisible,
  fetchCodehelpData1,
  handleSearch,
  setSubConditionSql,
  setWHName,
  setWHSeq,
  whName,
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
      setWHName('')
      setWHSeq('0')
      setLastClickedCell(null)
      setClickedRowData(null)
      return
    }

    if (rowIndex >= 0 && rowIndex < data.length) {
      const rowData = data[rowIndex]
      setWHName(rowData?.WHName)
      setWHSeq(rowData?.WHSeq)
      setClickedRowData(rowData)
      setLastClickedCell(cell)
    }
  }

  const handleClose = () => {
    setModalVisible(false)
    setWHName('')
    setWHSeq('0')
    resetTable()
  }
  const search = (e) => {
    setWHName(e.target.value)
    setWHSeq('')
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
                  defaultValue={t('783')}
                  style={{ width: 120 }}
                  size="middle"
                  onChange={handleConditionSeq}
                  options={[
                    { value: 1, label: t('783') },
                    { value: 0, label: t('21742') },
                  ]}
                />
              </div>
              <div className="flex flex-col">
                <Select
                  id="typeSelect"
                  //defaultValue="8002001"
                  style={{ width: 300 }}
                  size="middle"
                  options={[
                    {
                      value: 8002001,
                      label: t('20307'),
                    },
                    {
                      value: 8002002,
                      label: t('10622'),
                    },
                  ]}
                  onChange={handleSubConditionSql}
                />
              </div>
              <div className="flex flex-col w-full">
                <Search
                  allowClear
                  size="middle"
                  placeholder={t('1357')}
                  value={whName}
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
                  onClick={fetchCodehelpData1}
                >
                  {t('1357')}
                </Button>
              </div>
            </div>
          </details>

          <TableCodeHelpWarehouse
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
