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
import { useTranslation } from 'react-i18next'
import useOnFill from '../../hooks/sheet/onFillHook'
export default function LgWhItemQuery({
  dataUnit,
  setSearchBizUnit,
  setSearchFactUnit,
  setSearchProCataLog,
  productCatalog,
  searchSpec,
  setSearchSpec,
  searchItemNo,
  setSearchItemNo,
  searchItemName,
  setSearchItemName,
  searchWHName,
  setSearchWHName
}) {
  const { t } = useTranslation()
  const handleChangeBizUnit = (value) => {
    setSearchBizUnit(value)
  }

  const handleChangeFactUnit = (value) => {
    setSearchFactUnit(value)
  }

  const handleChangeProCatalog = (value) => {
    setSearchProCataLog(value)
  }



  const filterOption = (input, option) => {
    const label = option.label.toString().toLowerCase()
    const value = option.value.toString().toLowerCase()
    return (
      label.includes(input.toLowerCase()) || value.includes(input.toLowerCase())
    )
  }



  return (
    <div className="flex items-center gap-2">
      <Form layout="vertical">
        <Row className="gap-4 flex items-center">
          <Col>
            <Form.Item
              label={
                <span className="uppercase text-[9px]">{t('2')}</span>
              }
              className="mb-0"
            >
              <Select
                id="bizUnitSelect"
                defaultValue="All"
                size="middle"
                showSearch
                style={{ width: 190 }}
                onChange={handleChangeBizUnit}
                filterOption={filterOption}
                options={[
                  { label: 'All', value: '0' },
                  ...(dataUnit?.map((item) => ({
                    label: item?.BizUnitName,
                    value: item?.BizUnit,
                  })) || []),
                ]}
              />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              label={<span className="uppercase text-[9px]">{t('3')}</span>}
              className="mb-0"
            >
              <Select
                id="factUnitSelect"
                defaultValue="All"
                size="middle"
                showSearch
                style={{ width: 190 }}
                onChange={handleChangeFactUnit}
                filterOption={filterOption}
                options={[
                  { label: 'All', value: '0' },
                  ...(dataUnit?.map((item) => ({
                    label: item?.FactUnitName,
                    value: item?.FactUnit,
                  })) || []),
                ]}
              />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              label={
                <span className="uppercase text-[9px]">
                  {t('2119')}
                </span>
              }
              className="mb-0"
            >
              <Select
                id="naWareSelect"
                defaultValue="All"
                size="middle"
                showSearch
                style={{ width: 270 }}
                onChange={handleChangeProCatalog}
                filterOption={filterOption}
                options={[
                  { label: 'All', value: '0' },
                  ...(productCatalog.map((item) => ({
                    label: item?.MinorName,
                    value: item?.Value,
                  })) || []),
                ]}
              />
            </Form.Item>
          </Col>

          <Col>
            <Form.Item
              label={<span className="uppercase text-[9px]">{t('773')}</span>}
              className="mb-0"
            >
              <Input placeholder="" size="middle" value={searchWHName} onChange={(e) => setSearchWHName(e.target.value)} />
            </Form.Item>
          </Col>
          {/*     <Col>
            <Form.Item
              label={<span className="uppercase text-[9px]">Tên sản phẩm</span>}
              className="mb-0"
            >
              <Input placeholder="" size="middle" value={searchItemName} onChange={(e) => setSearchItemName(e.target.value)} />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              label={<span className="uppercase text-[9px]">Mã sản phẩm</span>}
              className="mb-0"
            >
              <Input placeholder="" size="middle" value={searchItemNo} onChange={(e) => setSearchItemNo(e.target.value)} />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              label={<span className="uppercase text-[9px]">Quy cách</span>}
              className="mb-0"
            >
              <Input placeholder="" size="middle" value={searchSpec} onChange={(e) => setSearchSpec(e.target.value)} />
            </Form.Item>
          </Col> */}
        </Row>
      </Form>
    </div>
  )
}
