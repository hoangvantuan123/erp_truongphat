import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet'
import { Typography, Layout } from 'antd'
const { Title } = Typography
const { Header, Content } = Layout
import 'moment/locale/vi'

import LabelAction from '../../components/actions/label/labelAction'
import TableLabelPreview from '../../components/table/label/tableLabel'

export default function LabelPrint({ permissions, isMobile }) {
  const { t } = useTranslation()

  const [image, setImage] = useState(null)

  const handleImageGenerated = function setLabel(generatedImage) {
    setImage(generatedImage)
  }

  return (
    <Layout className="h-screen bg-slate-50">
      <Helmet>
        <title>ITM - {t('Label Printer')}</title>
      </Helmet>

      <div className="flex flex-col h-full ">
        <Header className="bg-slate-50 px-4 h-auto flex-shrink-0">
          <Title level={5} className="mt-2 uppercase">
            {t('LABEL PRINT')}
          </Title>
          <LabelAction onImageGenerated={image} />
        </Header>

        <Content className="flex-grow px-4  bg-slate-50">
          <div className="h-full flex flex-col">
            <div className="flex-grow">
              <TableLabelPreview setData={handleImageGenerated} />
            </div>
          </div>
        </Content>
      </div>
    </Layout>
  )
}
