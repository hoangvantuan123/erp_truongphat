import { Form, Input, Row, Col } from 'antd'
import { useTranslation } from 'react-i18next'
import CodeHelpCust from '../../table/codeHelp/codeHelpCust'
import { CompactSelection } from '@glideapps/glide-data-grid'
import { useEffect, useRef, useState } from 'react'
import CodeHelpUMOrdType from '../../table/codeHelp/codeHelpUMOrdType'
import CodeHelpSMOrdApp from '../../table/codeHelp/codeHelpSMOrdApp'

export default function HrAdmOrdQuery({
  UMOrdTypeData,
  SMOrdAppData,

  UMOrdTypeName,
  setUMOrdTypeName,
  UMOrdTypeSeq,
  setUMOrdTypeSeq,
  OrdName,
  setOrdName,

  SMOrdAppName,
  setSMOrdAppName,
  SMOrdAppSeq,
  setSMOrdAppSeq,
}) {
  const { t } = useTranslation()
  const dropdownRef = useRef(null)

  const [selectionUMOrdType, setSelectionUMOrdType] = useState({
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty(),
  })
  const [UMOrdTypeSearchSh, setUMOrdTypeSearchSh] = useState('')
  const [modalVisibleUMOrdType, setModalVisibleUMOrdType] = useState(false)

  const [selectionSMOrdApp, setSelectionSMOrdApp] = useState({
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty(),
  })
  const [SMOrdAppSearchSh, setSMOrdAppSearchSh] = useState('')
  const [modalVisibleSMOrdApp, setModalVisibleSMOrdApp] = useState(false)


    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setModalVisibleSMOrdApp(false)
        setModalVisibleUMOrdType(false)
      }
    }
    useEffect(() => {
      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }, [])
  return (
    <div className="flex items-center gap-2">
      <Form layout="vertical">
        <Row className="gap-4 flex items-center ">
          <Col>
            <Form.Item
              label={<span className="uppercase text-[9px]">{t('992')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Input
                placeholder=""
                className="w-[310px]"
                size="middle"
                value={UMOrdTypeName}
                onFocus={() => setModalVisibleUMOrdType(true)}
                style={{ backgroundColor: '#e8f0ff' }}
              />
              {modalVisibleUMOrdType && (
                <CodeHelpUMOrdType
                  data={UMOrdTypeData}
                  nameCodeHelp={t('992')}
                  modalVisible={modalVisibleUMOrdType}
                  setModalVisible={setModalVisibleUMOrdType}
                  UMOrdTypeSearchSh={UMOrdTypeSearchSh}
                  setUMOrdTypeSearchSh={setUMOrdTypeSearchSh}
                  selectionUMOrdType={selectionUMOrdType}
                  setSelectionUMOrdType={setSelectionUMOrdType}
                  UMOrdTypeName={UMOrdTypeName}
                  setUMOrdTypeName={setUMOrdTypeName}
                  UMOrdTypeSeq={UMOrdTypeSeq}
                  setUMOrdTypeSeq={setUMOrdTypeSeq}
                  dropdownRef={dropdownRef}
                />
              )}
            </Form.Item>
          </Col>

          <Col>
            <Form.Item
              label={<span className="uppercase text-[9px]">{t('1438')}</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Input
                placeholder=""
                className="w-[310px]"
                size="middle"
                value={SMOrdAppName}
                onFocus={() => setModalVisibleSMOrdApp(true)}
                style={{ backgroundColor: '#e8f0ff' }}
              />
              {modalVisibleSMOrdApp && (
                <CodeHelpSMOrdApp
                  data={SMOrdAppData}
                  nameCodeHelp={t('1438')}
                  modalVisible={modalVisibleSMOrdApp}
                  setModalVisible={setModalVisibleSMOrdApp}
                  SMOrdAppSearchSh={SMOrdAppSearchSh}
                  setSMOrdAppSearchSh={setSMOrdAppSearchSh}
                  selectionSMOrdApp={selectionSMOrdApp}
                  setSelectionSMOrdApp={setSelectionSMOrdApp}
                  SMOrdAppName={SMOrdAppName}
                  setSMOrdAppName={setSMOrdAppName}
                  SMOrdAppSeq={SMOrdAppSeq}
                  setSMOrdAppSeq={setSMOrdAppSeq}
                  dropdownRef={dropdownRef}
                />
              )}
            </Form.Item>
          </Col>

          <Col>
            <Form.Item
              label={
                <span className="uppercase text-[10px]">{t('13623')}</span>
              }
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Input
                placeholder=""
                className="w-[150px]"
                size="middle"
                value={OrdName}
                onChange={(e) => {
                  setOrdName(e.target.value)
                }}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  )
}
