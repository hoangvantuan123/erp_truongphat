import { useState } from 'react'
import {
  Button,
  Dropdown,
  Menu,
  message,
  Input,
  Space,
  Form,
  InputNumber,
} from 'antd'
import {
  SaveOutlined,
  DeleteOutlined,
  FileDoneOutlined,
  SearchOutlined,
  FileExcelOutlined,
  FileTextOutlined,
  DownOutlined,
  ExportOutlined,
  SettingOutlined,
  TableOutlined,
} from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

export default function WHStockListActions({
  data,
  nextPage,
  debouncedFetchSLGWHStockListDynamicQueryWEB,
}) {
  const { t } = useTranslation()
  const [visible, setVisible] = useState(false)
  const [inputValue, setInputValue] = useState(1)

  //   // Hàm xuất CSV
  //   const exportCSV = () => {
  //     const filteredData = data.filter(row => row.Status !== 'A');
  //     if (filteredData.length === 0) {
  //         message.warning("Không có dữ liệu để xuất file")
  //         return;
  //     }
  //     const worksheet = XLSX.utils.json_to_sheet(filteredData);
  //     const csv = XLSX.utils.sheet_to_csv(worksheet);
  //     const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  //     saveAs(blob, 'data.csv');
  // }

  // // Hàm xuất Excel
  // const exportExcel = () => {
  //     const filteredData = data.filter(row => row.Status !== 'A');
  //     if (filteredData.length === 0) {
  //         message.warning("Không có dữ liệu để xuất file")
  //         return;
  //     }
  //     const worksheet = XLSX.utils.json_to_sheet(filteredData);
  //     const workbook = XLSX.utils.book_new();
  //     XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  //     const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  //     const blob = new Blob([buffer], {
  //         type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  //     });
  //     saveAs(blob, 'data.xlsx');
  // }

  // // Hàm xuất JSON
  // const exportJSON = () => {
  //     const filteredData = data.filter(row => row.Status !== 'A');
  //     if (filteredData.length === 0) {
  //         message.warning("Không có dữ liệu để xuất file")
  //         return;
  //     }
  //     const blob = new Blob([JSON.stringify(filteredData, null, 2)], {
  //         type: 'application/json',
  //     });
  //     saveAs(blob, 'data.json');
  // }

  //   // Xử lý click menu
  //   const handleMenuClick = (e) => {
  //     switch (e.key) {
  //       case 'csv':
  //         exportCSV()
  //         break
  //       case 'excel':
  //         exportExcel()
  //         break
  //       case 'json':
  //         exportJSON()
  //         break
  //       case 'delete':
  //         handleDeleteDataSheet()
  //         break
  //       default:
  //         message.info(`Chức năng này đang phát triển`)
  //     }
  //   }

  //   const menu = (
  //     <Menu onClick={handleMenuClick} className=" w-40">
  //       <Menu.SubMenu key="export" title="Export" icon={<ExportOutlined />}>
  //         <Menu.Item key="csv" icon={<FileTextOutlined />}>
  //           CSV Export
  //         </Menu.Item>
  //         <Menu.Item key="excel" icon={<FileExcelOutlined />}>
  //           Excel Export
  //         </Menu.Item>
  //         <Menu.Item key="json" icon={<FileTextOutlined />}>
  //           JSON Export
  //         </Menu.Item>
  //       </Menu.SubMenu>
  //     </Menu>
  //   )
  return (
    <div className="flex items-center gap-2">
      {/* <Dropdown overlay={menu}>
        <Button>
          <SettingOutlined /> Sheet Actions
        </Button>
      </Dropdown> */}
      <Button
        key="Reset"
        type="default"
        icon={<FileDoneOutlined />}
        size="middle"
        className="uppercase"
        color="default"
        variant="filled"
        onClick={nextPage}
        style={{ backgroundColor: '#f0f0f0', borderColor: '#d9d9d9' }}
      >
        Chi tiết tồn kho
      </Button>
      <Button
        key="Save"
        type="primary"
        icon={<SearchOutlined />}
        size="middle"
        onClick={debouncedFetchSLGWHStockListDynamicQueryWEB}
        className="uppercase"
      >
        {t('1357')}
      </Button>
    </div>
  )
}
