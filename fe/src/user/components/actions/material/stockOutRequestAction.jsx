import { useState } from 'react'

import { Card, Input, Button, DatePicker, Space, Typography } from 'antd'
import { SaveFilled, SaveOutlined } from '@ant-design/icons'
import * as XLSX from 'xlsx'

export default function StockOutRequestAction() {
  const [yyww, setYyww] = useState(null)
  const [yyyymm, setYyyymm] = useState(null)

  const btnPrint = async () => {
    try {
      const formdata = new FormData()

      const requestOptions = {
        method: 'GET',
        body: formdata,
        redirect: 'follow',
      }

      const res = await fetch(
        'http://localhost:8080/api/v1/print/test?matID=DIO0032&lotNo=RU338144G01',
      )
      if (!res.ok) throw new Error('Failed to fetch the file')
      const blob = await res.blob()

      const data = await blob.arrayBuffer()

      const reader = new FileReader()
      reader.onload = (e) => {
        // const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' })

        const sheetName = workbook.SheetNames[0]
        const sheet = workbook.Sheets[sheetName]
        let html = XLSX.utils.sheet_to_html(sheet)


        const convert = function replaceBase64WithImgTag(htmlContent) {
          const regex =
            />\s*(data:image\/(?:png|jpeg|jpg|gif);base64,([A-Za-z0-9+/=]+))/g

          return htmlContent.replace(regex, (match, base64Data) => {
            return `> <img src="${base64Data}" alt="Embedded Image" />`
          })
        }

        const convertHtml = convert(html)

        console.log(convertHtml)

        const iframe = document.createElement('iframe')
        iframe.style.display = 'none'
        document.body.appendChild(iframe)

        const iframeDoc =
          iframe.contentDocument || iframe.contentWindow.document
        iframeDoc.open()
        iframeDoc.write(convertHtml)
        iframeDoc.close()

        iframe.contentWindow.focus()
        iframe.contentWindow.print()

        setTimeout(() => document.body.removeChild(iframe), 1000)
      }
      reader.readAsArrayBuffer(blob)
    } catch (error) {
      console.error('Error downloading the file:', error)
    }
  }

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [pdfUrl, setPdfUrl] = useState(null)
  const printLabel = async () => {
    const zpl = ` ^XA

^FX Top section with logo, name and address.
^CF0,60
^FO50,50^GB100,100,100^FS
^FO75,75^FR^GB100,100,100^FS
^FO93,93^GB40,40,40^FS
^FO220,50^FDIntershipping, Inc.^FS
^CF0,30
^FO220,115^FD1000 Shipping Lane^FS
^FO220,155^FDShelbyville TN 38102^FS
^FO220,195^FDUnited States (USA)^FS
^FO50,250^GB700,3,3^FS

^FX Second section with recipient address and permit information.
^CFA,30
^FO50,300^FDJohn Doe^FS
^FO50,340^FD100 Main Street^FS
^FO50,380^FDSpringfield TN 39021^FS
^FO50,420^FDUnited States (USA)^FS
^CFA,15
^FO600,300^GB150,150,3^FS
^FO638,340^FDPermit^FS
^FO638,390^FD123456^FS
^FO50,500^GB700,3,3^FS

^FX Third section with bar code.
^BY5,2,270
^FO100,550^BC^FD12345678^FS

^FX Fourth section (the two boxes on the bottom).
^FO50,900^GB700,250,3^FS
^FO400,900^GB3,250,3^FS
^CF0,40
^FO100,960^FDCtr. X34B-1^FS
^FO100,1010^FDREF1 F00B47^FS
^FO100,1060^FDREF2 BL4H8^FS
^CF0,190
^FO470,955^FDCA^FS

^XZ `

    const options = {
      method: 'POST',
      headers: {
        Accept: 'application/pdf',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        file: zpl,
      }),
    }

    try {
      const response = await fetch(
        'https://api.labelary.com/v1/printers/8dpmm/labels/4x6/0/',
        options,
      )

      if (!response.ok) {
        throw new Error('Failed to generate label')
      }

      const blob = await response.blob()
      const pdfUrl = URL.createObjectURL(blob)
      setPdfUrl(pdfUrl)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mt-1">
      <Card className="mb-2 p-2 shadow-sm" size="small">
        <div className="flex gap-2">
          <Space direction="vertical" size={8}>
            <Typography.Text>DATE</Typography.Text>
            <DatePicker className="w-full" />
          </Space>
          <Space direction="vertical" size={8}>
            <Typography.Text>REQUSET NO</Typography.Text>
            <Input className="w-full bg-blue-50" />
          </Space>
          <Space direction="vertical" size={8}>
            <Typography.Text>WORK ORDER NO</Typography.Text>
            <Input className="w-full bg-blue-50" />
          </Space>
          <Space direction="vertical" size={8}>
            <Typography.Text className="text-red-500">ITEM NO</Typography.Text>
            <Input className="w-full bg-blue-50" />
          </Space>
          <Space direction="vertical" size={8}>
            <Typography.Text>ITEM NAME</Typography.Text>
            <Input className="w-full bg-blue-50" />
          </Space>
          <Space direction="vertical" size={8}>
            <Typography.Text>FACTORY</Typography.Text>
            <Input className="w-full bg-blue-50" />
          </Space>
        </div>

        <div className="flex gap-2 justify-end mt-2">
          {['STOCK OUT (MAT)', 'SEARCH'].map((label) => (
            <Button
              key={label}
              type={label === 'Save' ? 'primary' : 'default'}
              icon={<SaveFilled />}
              size="middle"
              className="uppercase"
            >
              {label}
            </Button>
          ))}
        </div>

        <div className="flex gap-2 justify-end mt-2">
          <Button
            key="PRINT"
            type={'PRINT' === 'Save' ? 'primary' : 'default'}
            icon={<SaveFilled />}
            size="middle"
            className="uppercase"
            onClick={btnPrint}
          >
            PRINT
          </Button>
        </div>

        <div className="flex gap-2 justify-end mt-2">
          <Button
            key="PRINT"
            type={'PRINT' === 'Save' ? 'primary' : 'default'}
            icon={<SaveFilled />}
            size="middle"
            className="uppercase"
            onClick={printLabel}
          >
            PRINT LABEL
          </Button>
        </div>
      </Card>
    </div>
  )
}
