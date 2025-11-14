import { Menu, Upload } from 'antd'
import { useState } from 'react'
const menuStyle = { borderInlineEnd: 'none' }
import TableUploadFileIqc from '../../table/iqc/tableUploadFileIqc'
import { useTranslation } from 'react-i18next'
import { updateIndexNo } from '../../sheet/js/updateIndexNo'
import { allowedTypes } from '../../../../utils/allowedTypes'
const TabViewIqcOptions = ({
  canCreate,
  canEdit,
  dataSub,
  setSelectionC,
  selectionC,
  setAddedRowsC,
  addedRowsC,
  numRowsC,
  setGridDataC,
  gridDataC,
  setNumRowsC,
  setColsC,
  colsC,
  defaultColsC,
  setFileList,
  fileList,

}) => {
  const [current, setCurrent] = useState('0')
  const { t } = useTranslation()

  const handleMenuClick = (e) => {
    setCurrent(e.key)
  }

  const uploadProps = {
    fileList,
    onChange: (info) => {
      const { file, fileList } = info
      const customizedFileList = fileList.map((file, index) => ({
        OriginalName: file.response?.filename || file.name,
        Size: file.size,
        Status: 'A',
      }))

      setGridDataC((prevData) => {
        const filteredOldData = prevData.filter((item) => item.Status !== 'A')

        const mergedData = [...filteredOldData, ...customizedFileList]
        const updatedData = updateIndexNo(mergedData)

        setNumRowsC(updatedData.length)
        return updatedData
      })

      setFileList(fileList)
    },
    beforeUpload: (file) => {
      const isAllowedType = allowedTypes.includes(file.type)
      const isSizeValid = file.size / 1024 / 1024 < 20
      if (!isAllowedType) {
        message.error(
          'Chỉ được phép tải hình ảnh, tệp Excel, Word, PDF và PowerPoint!',
        )
        return Upload.LIST_IGNORE
      }

      if (!isSizeValid) {
        message.error('Tệp tin phải nhỏ hơn 20MB!')
        return Upload.LIST_IGNORE
      }

      return false
    },
    showUploadList: false,
  }

  const items = [
    {
      key: '0',
      label: t('800000118'),
      children: (
        <TableUploadFileIqc
          uploadProps={uploadProps}
          setSelection={setSelectionC}
          selection={selectionC}
          setAddedRows={setAddedRowsC}
          addedRows={addedRowsC}
          numRows={numRowsC}
          setGridData={setGridDataC}
          gridData={gridDataC}
          setNumRows={setNumRowsC}
          setCols={setColsC}
          cols={colsC}
          defaultCols={defaultColsC}
          canEdit={canEdit}
          dataSub={dataSub}
        />
      ),
    },
  ]

  return (
    <div className="w-full gap-1 h-full flex items-center justify-center pb-[30px]">
      <div className="w-full h-full flex flex-col border bg-white rounded-lg overflow-x-hidden overflow-hidden">
        <div className="h-full w-full flex border-t">
          <Menu
            onClick={handleMenuClick}
            selectedKeys={[current]}
            mode="vertical"
            style={menuStyle}
          >
            {items.map((item) => (
              <Menu.Item key={item.key} icon={item.icon}>
                <span className="text-xs">{item.label}</span>
              </Menu.Item>
            ))}
          </Menu>

          <div className="flex-1 border-l overflow-hidden">
            {items.find((item) => item.key === current)?.children}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TabViewIqcOptions
