import 'tui-grid/dist/tui-grid.css'
import Grid from '@toast-ui/react-grid'
import TuiGrid from 'tui-grid'
import { useNavigate } from 'react-router-dom'
import '../../../../static/css/customTabe.css'
import moment from 'moment'
import { Flex, Form, Input, Select, Splitter, Typography } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import { useState } from 'react'

function TableLabelPreview({ setData }) {
  const [image, setImage] = useState(null)
  const [loading, setLoading] = useState(false)
  const [zplCode, setZplCode] = useState('')
  const [device, setDevice] = useState('')
  const [sizeWidth, setSizeWidth] = useState('')
  const [sizeHigh, setSizeHigh] = useState('')
  const navigate = useNavigate()

  const Desc = () => (
    <Flex
      justify="center"
      align="center"
      style={{
        height: '80%',
      }}
    >
      {image ? (
        <img
          src={image}
          alt="Label Preview"
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain',
          }}
        />
      ) : (
        <Typography.Title
          type="secondary"
          level={5}
          style={{
            whiteSpace: 'nowrap',
          }}
        ></Typography.Title>
      )}
    </Flex>
  )

  const onChangeSelect = (props) => {
    setDevice(props)
  }

  const onChangeSizeWidth = (width) => {
    setSizeWidth(width.target.value)
  }

  const onChangeSizeHigh = (high) => {
    setSizeHigh(high.target.value)
  }

  const selectDevice = [
    {
      value: '6dpmm',
      label: '6dpmm',
    },
    {
      value: '8dpmm',
      label: '8dpmm',
    },
    {
      value: '12dpmm',
      label: '12dpmm',
    },
    {
      value: '24dpmm',
      label: '24dpmm',
    },
  ]

  const selectUnit = [
    {
      value: 'inchs',
      label: 'inchs',
    },
    {
      value: 'cm',
      label: 'cm',
    },
    {
      value: 'mm',
      label: 'mm',
    },
  ]

  const onChangeZplCode = async (e) => {
    setZplCode(e.target.value)

    setLoading(true)
    const formData = new FormData()
    formData.append('file', zplCode)

    const options = {
      method: 'POST',
      headers: {
        Accept: 'image/png',
      },
      body: formData,
    }

    try {
      const response = await fetch(
        `http://api.labelary.com/v1/printers/${device}/labels/${sizeWidth}x${sizeHigh}/0/`,
        options,
      )

      if (!response.ok) {
        throw new Error('Error generating preview')
      }

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)

      setImage(url)
      setData(url)
    } catch (error) {
      console.error('Error fetching ZPL preview:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full min-h-full  overflow-auto  justify-between flex  gap-10 shadow">
      <Splitter
        style={{
          minHeight: '100vh',
          boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Splitter.Panel collapsible>
          <Desc text="Preview Label" />
        </Splitter.Panel>
        <Splitter.Panel>
          <Splitter layout="vertical">
            <Splitter.Panel>
              <Form layout="vertical">
                <Form.Item style={{ minWidth: '15vh' }}>
                  <Select
                    placeholder="Device"
                    optionFilterProp="label"
                    onChange={onChangeSelect}
                    options={selectDevice}
                    rules={[{ required: true }]}
                  />
                </Form.Item>
                <Form.Item
                  label="Size"
                  name="size"
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <Input
                    placeholder="With"
                    style={{ width: '20%' }}
                    onChange={onChangeSizeWidth}
                  />
                  <Input
                    placeholder="High"
                    style={{ width: '20%' }}
                    onChange={onChangeSizeHigh}
                  />
                  <Select
                    optionFilterProp="label"
                    options={selectUnit}
                    style={{ width: '20%' }}
                  />
                </Form.Item>

                <Form.Item>
                  <TextArea
                    rows={20}
                    value={zplCode}
                    onChange={onChangeZplCode}
                  />
                  <br />
                </Form.Item>
              </Form>
            </Splitter.Panel>
          </Splitter>
        </Splitter.Panel>
      </Splitter>
    </div>
  )
}

export default TableLabelPreview
