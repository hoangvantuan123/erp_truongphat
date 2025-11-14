import { Modal, Layout, Menu, Typography } from "antd";
import { UserOutlined, BellOutlined, SettingOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useTranslation } from 'react-i18next'
import Profile from "./profile";
import Preferences from "./preferences";
const { Sider, Content } = Layout;
const { Title } = Typography;

export default function ModalSetting({ modalOpen, setModalOpen }) {
  const { t } = useTranslation()
  const [selectedKey, setSelectedKey] = useState("profile");
  const renderContent = () => {
    switch (selectedKey) {
      case "profile":
        return <Profile modalOpen={modalOpen} selectedKey={selectedKey} />;
      case "preferences":
        return <Preferences />;
      case "notifications":
        return <div>....</div>;
      default:
        return <div>{t("850000080")}</div>;
    }
  };

  return (
    <Modal
      centered
      open={modalOpen}
      onCancel={() => setModalOpen(false)}
      footer={false}
      width={1500}
      closable={false}
      bodyStyle={{ padding: 0 }}
      maskStyle={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      
    >
      <Layout className=" h-[700px] overflow-hidden flex bg-white p-0">
        <Sider theme="light" width={250} style={{ padding: 0, borderRight: "1px solid #ddd" }}>
          <Menu
            mode="inline"
            selectedKeys={[selectedKey]}
            onClick={(e) => setSelectedKey(e.key)}
            style={{ height: "100%", border: "none", fontSize: "12px" }}
          >
            <Menu.ItemGroup
              key="account"
              title={<span style={{ fontSize: "10px", color: "#666", fontWeight: 600 }}>{t('850000081')}</span>}
            >
              <Menu.Item key="profile" icon={<UserOutlined />} style={{ lineHeight: "20px", padding: "5px 8px", height: "35px" }}>
                {t('850000082')}
              </Menu.Item>
              <Menu.Item key="preferences" icon={<SettingOutlined />} style={{ lineHeight: "20px", padding: "5px 8px", height: "35px" }}>
                {t('850000083')}
              </Menu.Item>
            </Menu.ItemGroup>


            <Menu.ItemGroup key="workspace" title={<span style={{ fontSize: "10px", color: "#666", fontWeight: 600 }}>{t('850000084')}</span>}>
              <Menu.Item key="notifications" icon={<BellOutlined />} style={{ lineHeight: "20px", padding: "5px 8px", height: "35px" }}>{t('850000085')}</Menu.Item>
            </Menu.ItemGroup>
          </Menu>
        </Sider>

        <Content className="p-3">
          {renderContent()}
        </Content>
      </Layout>
    </Modal>
  );
}
