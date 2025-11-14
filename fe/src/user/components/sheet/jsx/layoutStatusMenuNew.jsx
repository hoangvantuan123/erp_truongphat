import { useState } from 'react'
import { Button, Dropdown, Menu, message, Space, Form, InputNumber } from 'antd'
import {
  SearchOutlined,
  ExportOutlined,
  SettingOutlined,
  SyncOutlined,
  UndoOutlined,
  FileExcelOutlined,
  FileTextOutlined,
  PlusOutlined,
} from '@ant-design/icons'
import { ArrowIcon, ChevronIcon } from '../../icons'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import { useTranslation } from 'react-i18next'

const LayoutStatusMenuSheetNew = ({
  showMenu,
  setShowSearch,
  setShowMenu,
  showDrawer,
  handleReset,
  data,
  handleRestSheet,
  handleRowAppend,
  fileName,
  customHeaders,
}) => {
  const { t } = useTranslation()
  if (showMenu === null) return null
  if (handleRowAppend === null) return null
  const [showExportMenu, setShowExportMenu] = useState(false)
  const [showAddRow, setShowAddRow] = useState(false)
  const [inputValue, setInputValue] = useState(0)
  const generateFileName = (extension) => {
    const now = new Date()
    const formattedDate = now.toISOString().slice(0, 10).replace(/-/g, '') // YYYYMMDD
    const formattedTime = now.toTimeString().slice(0, 8).replace(/:/g, '') // HHMMSS
    return `${fileName}_${formattedDate}_${formattedTime}.${extension}`
  }
  const exportData = (exportType) => {
    const filteredData = data.filter((row) => row.Status !== 'A')
    if (filteredData.length === 0) {
      message.warning(t('870000038'))
      return
    }

    let blob
    let fileExtension
    let worksheet

    switch (exportType) {
      case 'csv':
        worksheet = XLSX.utils.json_to_sheet(filteredData)
        const csv = XLSX.utils.sheet_to_csv(worksheet)
        blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
        fileExtension = 'csv'
        break
      case 'xlsx':
        worksheet = XLSX.utils.json_to_sheet(filteredData)
        const workbook = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')
        const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
        blob = new Blob([buffer], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        })
        fileExtension = 'xlsx'
        break
      case 'json':
        blob = new Blob([JSON.stringify(filteredData, null, 2)], {
          type: 'application/json',
        })
        fileExtension = 'json'
        break
    }

    saveAs(blob, generateFileName(fileExtension))
  }

  const handleAddRows = () => {
    if (inputValue && !isNaN(inputValue) && inputValue > 0) {
      handleRowAppend(inputValue)
    }
    setInputValue(0)
    setShowMenu(null)
  }

  return (
    <ul className="space-y-1">
      <li>
        <a
          onClick={() => {
            setShowSearch(true)
            setShowMenu(null)
          }}
          className="flex items-center gap-2 px-4 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
        >
          <SearchOutlined />
          <span className="text-[13px] font-medium"> {t('850000138')} </span>
        </a>
      </li>
      <li>
        <a
          onClick={handleReset}
          className="flex items-center gap-2 px-4 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
        >
          <SyncOutlined />
          <span className="text-[13px] font-medium"> {t('850000139')}</span>
        </a>
      </li>
      {handleRestSheet && (
        <li>
          <a
            onClick={() => {
              handleRestSheet(true)
              setShowMenu(null)
            }}
            className="flex items-center gap-2 px-4 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
          >
            <UndoOutlined />
            <span className="text-[13px] font-medium"> {t('850000140')} </span>
          </a>
        </li>
      )}
      <li>
        <a
          onClick={() => setShowExportMenu(!showExportMenu)}
          className="flex items-center justify-between gap-2 px-4 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
        >
          <div className="flex items-center gap-2">
            <ExportOutlined />
            <span className="text-[13px] font-medium">{t('850000141')}</span>
          </div>
          {showExportMenu ? <ArrowIcon /> : <ChevronIcon />}
        </a>

        {showExportMenu && (
          <ul className="ml-6 mt-1 space-y-1">
            <li>
              <a
                //onClick={() => exportCSV()}
                onClick={() => exportData('csv')}
                className="flex items-center gap-2 px-4 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
              >
                <FileTextOutlined />
                <span className="text-[13px] font-medium">{t('850000142')}</span>
              </a>
            </li>
            <li>
              <a
                //onClick={() => exportExcel()}
                onClick={() => exportData('xlsx')}
                className="flex items-center gap-2 px-4 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
              >
                <FileExcelOutlined />
                <span className="text-[13px] font-medium">{t('850000143')}</span>
              </a>
            </li>
            <li>
              <a
                //onClick={() => exportJSON()}
                onClick={() => exportData('json')}
                className="flex items-center gap-2 px-4 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
              >
                <FileTextOutlined />
                <span className="text-[13px] font-medium">{t('850000144')}</span>
              </a>
            </li>
          </ul>
        )}
      </li>

      {handleRowAppend && (
        <li>
          <a
            onClick={() => setShowAddRow(!showAddRow)}
            className="flex items-center gap-2 px-4 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
          >
            <PlusOutlined />
            <span className="text-[13px] font-medium"> {t('850000145')} </span>
          </a>

          {showAddRow && (
            <div className="absolute z-50 ml-[290px]  mt-[-35px] space-y-1 bg-white border h-auto w-[300px] p-4   rounded-lg shadow-lg cursor-pointer">
              <Form layout="vertical">
                <Form.Item label={t('850000146')} name="rowName">
                  <InputNumber
                    min={0}
                    max={2000}
                    value={inputValue}
                    onChange={(value) => setInputValue(value)}
                    style={{
                      width: '100%',
                      borderRadius: '5px',
                    }}
                  />
                </Form.Item>
                <Space style={{ width: '100%' }} justify="end">
                  <Button onClick={() => setShowAddRow(false)}>{t('850000147')}</Button>
                  <Button
                    type="primary"
                    onClick={handleAddRows}
                    style={{
                      backgroundColor: '#4F46E5',
                      borderColor: '#4F46E5',
                    }}
                  >
                    {t('850000150')}
                  </Button>
                </Space>
              </Form>
            </div>
          )}
        </li>
      )}
      <li>
        <a
          onClick={showDrawer}
          className="flex items-center gap-2 px-4 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
        >
          <SettingOutlined />
          <span className="text-[13px] font-medium"> Cài đặt cột Sheet </span>
        </a>
      </li>
    </ul>
  )
}

export default LayoutStatusMenuSheetNew
