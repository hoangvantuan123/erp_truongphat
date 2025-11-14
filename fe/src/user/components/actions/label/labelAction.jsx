import { useState } from 'react'

import { Card, Button } from 'antd'
import { SaveFilled } from '@ant-design/icons'

export default function LabelAction(imageUrl) {
  const [img, setImg] = useState(null)

  const [loading, setLoading] = useState(false)

  const printLabel = async () => {
    const iframe = document.createElement('iframe')
    iframe.style.display = 'none'
    document.body.appendChild(iframe)

    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document
    iframeDoc.open()

    const html = `
            <html>
                <head>
                    <style>
                        body {
                            text-align: center;
                            margin: 0;
                        }
                        img {
                            max-width: 100%;
                            height: auto;
                        }
                    </style>
                </head>
                <body>
                    <img
                    src=${imageUrl.onImageGenerated}
                    alt="Label Preview"
                    style={{
                        maxWidth: '100%',
                        maxHeight: '100%',
                        objectFit: 'contain',
                    }}
                />
                </body>
            </html>
        `
    console.log(html)
    iframeDoc.write(html)
    iframeDoc.close()

    iframe.contentWindow.focus()
    iframe.contentWindow.print()

    setTimeout(() => document.body.removeChild(iframe), 1000)
  }

  const printLabelTest = async () => {
    const res = await fetch(
      'http://localhost:8080/api/v1/label/test?matID=DIO0032&lotNo=RU338144G01',
    )
    if (!res.ok) throw new Error('Failed to fetch data')

    const databody = await res.json()
    const resZplCode = databody.zplCode
    const resData = databody.data

    const zpl = resZplCode
      .replace('{BARCODE_DATA}', resData.LOT_ID)
      .replace('{CODE}', resData.ITEMCD)
      .replace('{LOT}', resData.LOTNO)
      .replace('{QTY}', resData.QTY)
      .replace('{DC}', resData.DATECODE)
      .replace('{REEL}', resData.REELNO)
      .replace('{USER_ID}', resData.USER_ID)
      .replace('{QR_DATA}', resData.LOT_ID)

    const formData = new FormData()
    formData.append('file', zpl)

    const options = {
      method: 'POST',
      headers: {
        Accept: 'image/png',
      },
      body: formData,
    }

    try {
      const response = await fetch(
        `http://api.labelary.com/v1/printers/12dpmm/labels/6x2/0/`,
        options,
      )

      if (!response.ok) {
        throw new Error('Error generating preview')
      }

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)

      setImg(url)
    } catch (error) {
      console.error('Error fetching ZPL preview:', error)
    } finally {
      setLoading(false)
    }

    const ifr = document.createElement('iframe')
    ifr.style.display = 'none'
    document.body.appendChild(ifr)

    const iframeDoc = ifr.contentDocument || ifr.contentWindow.document
    iframeDoc.open()

    const html = `
            <html>
                <head>
                    <style>
                        body {
                            text-align: center;
                            margin: 0;
                        }
                        img {
                            max-width: 100%;
                            height: auto;
                        }
                    </style>
                </head>
                <body>
                    <img
                    src=${img}
                    alt="Label Preview"
                    style={{
                        maxWidth: '100%',
                        maxHeight: '100%',
                        objectFit: 'contain',
                    }}
                />
                </body>
            </html>
        `

    iframeDoc.write(html)
    iframeDoc.close()

    ifr.onload = function () {
      ifr.contentWindow.focus()
      ifr.contentWindow.print()
    }
  }

  return (
    <div className="mt-1">
      <Card className="mb-2 p-2 shadow-sm" size="small">
        <div className="flex gap-2 justify-end mt-2">
          <Button
            type={'PRINT' === 'Save' ? 'primary' : 'default'}
            icon={<SaveFilled />}
            size="middle"
            className="uppercase"
            onClick={printLabel}
          >
            PRINT LABEL
          </Button>

          <Button
            type={'PRINT' === 'Save' ? 'primary' : 'default'}
            icon={<SaveFilled />}
            size="middle"
            className="uppercase"
            onClick={printLabelTest}
          >
            PRINT LABEL TEST
          </Button>
        </div>
      </Card>
    </div>
  )
}
