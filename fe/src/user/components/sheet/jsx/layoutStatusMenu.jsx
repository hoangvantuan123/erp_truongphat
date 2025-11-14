import { useState } from 'react';
import {
  Button,
  Dropdown,
  Menu,
  message,
  Space,
  Form,
  InputNumber,
} from 'antd'
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
import { ArrowIcon, ChevronIcon } from '../../icons';
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import { useTranslation } from 'react-i18next'
import { getNow_yyyymmdd_hhmmss } from '../../../../utils/getToday_yyyymmdd_hhmmss';
const LayoutStatusMenuSheet = ({
  showMenu,
  setShowSearch,
  setShowMenu,
  showDrawer,
  handleReset,
  data,
  handleRestSheet,
  handleRowAppend, cols
}) => {
  if (showMenu === null) return null
  if (handleRowAppend === null) return null
  if (cols === null) {
    message.warning("Chưa có cấu hình cột để hiển thị");
    return null;
  }

  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showAddRow, setShowAddRow] = useState(false);
  const [inputValue, setInputValue] = useState(0)
  const { t } = useTranslation()
  const exportCSV = () => {
    const filteredData = data.filter(row => row.Status !== 'A');
    if (filteredData.length === 0) {
      message.warning(t('Không có dữ liệu để xuất file CSV'));
      return;
    }
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const csv = XLSX.utils.sheet_to_csv(worksheet);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const now = new Date();
    const filename = `DATA_EXPORT_${getNow_yyyymmdd_hhmmss()}.csv`;
    saveAs(blob, filename);
  }
  const exportExcel = () => {
    const filteredData = data.filter(row => row.Status !== 'A');

    if (filteredData.length === 0) {
      message.warning("Không có dữ liệu để xuất file");
      return;
    }

    // Chỉ dùng cols (không cần defaultCols)
    const exportColsRaw = cols.filter(col => col.visible && col.id !== 'Status');

    // Đảm bảo không trùng title trong header
    const headerMap = {};
    const usedTitles = {};
    const moneyColIds = [];

    exportColsRaw.forEach((col) => {
      let header = col.title;

      // Nếu title bị trùng, thêm hậu tố _1, _2,...
      if (usedTitles[header]) {
        let suffix = 1;
        while (usedTitles[`${header}_${suffix}`]) {
          suffix++;
        }
        header = `${header}_${suffix}`;
      }

      usedTitles[header] = true;
      headerMap[col.id] = header;

      // Đánh dấu các cột là tiền (dựa vào id hoặc format)
      if (
        col.format === 'currency' ||
        /amount|money|price|total/i.test(col.id)
      ) {
        moneyColIds.push(col.id);
      }
    });

    // Map dữ liệu để xuất
    const formattedData = filteredData.map(row => {
      const newRow = {};
      exportColsRaw.forEach(col => {
        newRow[headerMap[col.id]] = row[col.id];
      });
      return newRow;
    });

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    // Format các ô là số tiền trong Excel (không làm tròn)
    exportColsRaw.forEach((col, colIndex) => {
      if (!moneyColIds.includes(col.id)) return;

      const colLetter = XLSX.utils.encode_col(colIndex);
      for (let rowIndex = 0; rowIndex < formattedData.length; rowIndex++) {
        const cellRef = `${colLetter}${rowIndex + 2}`; // +2 vì header ở dòng 1
        const cell = worksheet[cellRef];
        if (cell && typeof cell.v === 'number') {
          cell.t = 'n';
          cell.z = '#,##0.00';
        }
      }
    });

    const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    const filename = `DATA_EXPORT_${getNow_yyyymmdd_hhmmss()}.xlsx`;
    saveAs(blob, filename);
  };


  const exportJSON = () => {
    const filteredData = data.filter(row => row.Status !== 'A');
    if (filteredData.length === 0) {
      message.warning(t('870000038'))
      return;
    }
    const blob = new Blob([JSON.stringify(filteredData, null, 2)], {
      type: 'application/json',
    });
    const filename = `DATA_EXPORT_${getNow_yyyymmdd_hhmmss()}.json`;
    saveAs(blob, filename);
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
          <span className="text-[13px] font-medium"> {t('850000138')}</span>
        </a>
      </li>
      <li>
        <a
          onClick={handleReset}
          className="flex items-center gap-2 px-4 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
        >
          <SyncOutlined />
          <span className="text-[13px] font-medium"> {t('850000139')} </span>
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
                onClick={() => exportCSV()}
                className="flex items-center gap-2 px-4 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
              >
                <FileTextOutlined />
                <span className="text-[13px] font-medium">{t('850000142')}</span>
              </a>
            </li>
            <li>
              <a
                onClick={() => exportExcel()}
                className="flex items-center gap-2 px-4 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
              >
                <FileExcelOutlined />
                <span className="text-[13px] font-medium">{t('850000143')}</span>
              </a>
            </li>
            <li>
              <a
                onClick={() => exportJSON()}
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
              <Form layout="vertical" >
                <Form.Item
                  label={t('850000146')}
                  name="rowName"
                >
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
                    {t('850000148')}
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
          <span className="text-[13px] font-medium"> {t('850000149')} </span>
        </a>
      </li>
    </ul>
  )
}

export default LayoutStatusMenuSheet