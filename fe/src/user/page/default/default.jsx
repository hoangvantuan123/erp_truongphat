import { useState, useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet'
import { Input, Space, Table, Typography, message, Tabs, Layout } from 'antd'
const { Search } = Input
const { Title, Text } = Typography
const { TabPane } = Tabs
const { Header, Content, Footer } = Layout
import 'moment/locale/vi'
import BG from '../../../assets/RootLogo.png'

export default function Default({ permissions, isMobile }) {
  const { t } = useTranslation()

  return (
    <Layout className="h-screen  bg-slate-50">
      <Helmet>
        <title>ITMV</title>
      </Helmet>

      <div className="grid h-screen place-content-center items-center  justify-center bg-slate-50 ">
        <img src={BG} className=" w-80 opacity-55 h-auto mb-10" />
      </div>
    </Layout>
  )
}
