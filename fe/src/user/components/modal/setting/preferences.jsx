import { List, Typography, Select, Modal, Button } from "antd";
import { ReloadOutlined, GlobalOutlined, BgColorsOutlined, ClockCircleOutlined, SettingOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { saveLanguageData } from "../../../../IndexedDB/saveLanguageData";
import { GetLangSeq } from "../../../../features/lang/getLangSeq";
import { togglePageInteraction } from "../../../../utils/togglePageInteraction";
import { CheckUserLangRole } from "../../../../features/auth/checkUserLang";
import { useTranslation } from 'react-i18next'
export default function Preferences() {
    const { t } = useTranslation()
    const userLangs = JSON.parse(localStorage.getItem("language"));
    const [language, setLanguage] = useState(userLangs || 6);
    const [theme, setTheme] = useState("light");
    const [timeFormat, setTimeFormat] = useState("24h");
    const [loadingLang, setLoadingLang] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const navigate = useNavigate();

    const fetchLangSeq = async (language) => {
        setLoadingLang(true);
        togglePageInteraction(true);

        try {
            const [response1, response2] = await Promise.all([
                CheckUserLangRole(language),
                GetLangSeq(language),
            ]);

            if (response1.success) {
                localStorage.setItem('roles_menu', response1.data.tokenRolesUserMenu);
            }

            if (response2.success) {
                saveLanguageData({
                    typeLanguage: 6,
                    languageData: response2.data,
                });
                setIsModalVisible(true);
            } else {
                throw new Error(t('870000036'));
            }
        } catch (error) {
            localStorage.removeItem('userInfo');
            localStorage.removeItem('roles_menu');
            navigate('/u/login');
            console.error(t('870000037'), error);
        } finally {
            togglePageInteraction(false);
            setLoadingLang(false);
        }
    };


    const handleLanguageChange = (value) => {
        setLanguage(value);
        localStorage.setItem('language', value);
        fetchLangSeq(value);
    };

    // Reload lại trang
    const reloadPage = () => {
        window.location.reload();
    };

    return (
        <div>
            <Typography.Title level={4}>{t('850000104')}</Typography.Title>
            <Typography.Text type="secondary">{t('850000105')}</Typography.Text>

            <List className="mt-4" itemLayout="horizontal">
                <List.Item>
                    <List.Item.Meta
                        avatar={<GlobalOutlined className="text-lg text-gray-600" />}
                        title={<Typography.Text className="text-gray-800">{t('850000106')}</Typography.Text>}
                        description={t('850000107')}
                    />
                    <Select
                        value={language}
                        onChange={handleLanguageChange}
                        options={[
                            { value: 6, label: 'Tiếng Việt' },
                            { value: 2, label: 'English' },
                            { value: 1, label: '한국어' },
                        ]}
                        style={{ width: 120 }}
                    />
                </List.Item>

                <List.Item>
                    <List.Item.Meta
                        avatar={<BgColorsOutlined className="text-lg text-gray-600" />}
                        title={<Typography.Text className="text-gray-800">{t('850000108')}</Typography.Text>}
                        description={t('850000109')}
                    />
                    <Select
                        value={theme}
                        onChange={setTheme}
                        options={[
                            { value: "light", label: t('850000110') },
                            { value: "dark", label: t('850000111') },
                            { value: "system", label: t('850000112') },
                        ]}
                        style={{ width: 120 }}
                    />
                </List.Item>
                <List.Item>
                    <List.Item.Meta
                        avatar={<ClockCircleOutlined className="text-lg text-gray-600" />}
                        title={<Typography.Text className="text-gray-800">{t('850000113')}</Typography.Text>}
                        description={t('850000114')}
                    />
                    <Select
                        value={timeFormat}
                        onChange={setTimeFormat}
                        options={[
                            { value: "12h", label: t('850000115') },
                            { value: "24h", label: t('850000116') },
                        ]}
                        style={{ width: 120 }}
                    />
                </List.Item>
            </List>


            <Modal
                open={isModalVisible}
                footer={null}
                closable={false}
                maskClosable={false}
                centered
            >
                <div className="flex flex-col items-center">
                    <ReloadOutlined style={{ fontSize: "50px", color: "#1890ff" }} />
                    <Typography.Title level={4} style={{ marginTop: "10px" }}>
                        {t('850000117')}
                    </Typography.Title>
                    <Typography.Text>{t('850000118')}</Typography.Text>
                    <br />
                    <Button type="primary" size="large" onClick={reloadPage} style={{ marginTop: "20px" }} className="w-full">
                       {t('850000119')}
                    </Button>
                </div>
            </Modal>
        </div>
    );
}
