import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Button, Form, Input, notification, message, Select } from 'antd'
import { LoginAuth } from '../../features/auth/login'
import { LoginEmailOTP } from '../../features/auth/loginEmailOtp'
import decodeJWT from '../../utils/decode-JWT'
import Cookies from 'js-cookie'
import { ChangePassword } from '../../features/auth/changePassword'
import Logo from '../../assets/ItmLogo.png'
import { GetLangSeq } from '../../features/lang/getLangSeq'
import { saveLanguageData } from '../../IndexedDB/saveLanguageData'
import { initSocket } from '../../services/socket'
import {
  LockOutlined,
  UserOutlined,
  LoadingOutlined,
  GlobalOutlined,
} from '@ant-design/icons'
export default function Login({
  fetchPermissions,
  processRolesMenu,
  setKeyLanguage,
}) {
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const location = useLocation()
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [loadingLang, setLoadingLang] = useState(false)
  const [changingPassword, setChangingPassword] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const [oldPassword, setOldPassword] = useState('')
  const [employeeId, setEmployeeId] = useState('')
  const [status, setStatus] = useState(false)
  const [statusOTP, setStatusOTP] = useState(false)
  const [otp, setOtp] = useState('')
  const [currentView, setCurrentView] = useState('login')
  const [username, setUsername] = useState(null)
  const [isLangSaved, setIsLangSaved] = useState(false)
  const [isCheck, setIsCheck] = useState(true)
  const [tempToken, setTempToken] = useState(null)
  const [loginOtp, setLoginOtp] = useState(null)
  const [timestamp, setTimestamp] = useState(null)
  const [timeLeft, setTimeLeft] = useState(300);
  const [emailOTP, setEmailOTP] = useState(null)
  const [apiEnv, setApiEnv] = useState(() => {
    return localStorage.getItem('api_env') || 'production'
  })

  const [language, setLanguage] = useState(() => {
    return parseInt(localStorage.getItem('language'), 10) || 6
  })

  const fetchLangSeq = async () => {
    setLoadingLang(true)
    try {
      const response = await GetLangSeq(language)
      if (response.success) {
        saveLanguageData({
          typeLanguage: 6,
          languageData: response.data,
        })
      }
    } catch (error) {
      console.error('Error fetching language sequence:', error)
    } finally {
      setLoadingLang(false)
    }
  }

  const openNotification = (message, description) => {
    notification.open({
      message: `${message}`,
      description,
      placement: 'bottomRight',
      duration: 0,
      key: 'loginNotification',
      closeIcon: null,
    })
  }

  const closeNotification = () => {
    notification.destroy()
  }
  const now = new Date();
  const pad = (n) => n.toString().padStart(2, '0');
  const compactTimestamp =
    now.getFullYear().toString() +
    pad(now.getMonth() + 1) +
    pad(now.getDate()) +
    pad(now.getHours()) +
    pad(now.getMinutes()) +
    pad(now.getSeconds());
  const onFinish = async (values) => {
    if (!isCheck) {
      return
    }
    setIsCheck(false)
    const { login, password } = values
    setLoginOtp({ login, password });
    setEmployeeId(login)

    try {
      setLoading(true)
      setError(null)
      openNotification(
        'Đang đăng nhập.',
        'Quá trình đăng nhập và chuẩn bị môi trường làm việc đang diễn ra. Vui lòng chờ trong giây lát.',
      )
      const timestamp = compactTimestamp;
      setTimestamp(timestamp)
      const [langSeqResult, loginResult] = await Promise.all([
        fetchLangSeq(),
        LoginAuth({ login, password, language, timestamp: timestamp, }),
      ])

      const response = loginResult

      if (response.success) {
        localStorage.setItem('userInfo', JSON.stringify(response.data.user))
        localStorage.setItem('roles_menu', response.data.tokenRolesUserMenu)
        localStorage.setItem(
          'language_user',
          JSON.stringify(response.data.typeLanguage),
        )
        setKeyLanguage(response.data.typeLanguage)
        Cookies.set('a_a', response.data.token)
        processRolesMenu()
        closeNotification()
        navigate('/u/home')
      } else {
        switch (response.error.code) {
          case 'ACCOUNT_NOT_ACTIVATED':
            setStatus(true)
            break
          case 'OTP_STEP_REQUIRED':
            setTimeLeft(300)
            setEmailOTP(response.error.emailCode || '')
            setTempToken(response.error.tempToken)
            setStatusOTP(true)
            break
          case 'USER_NOT_FOUND':
          case 'INVALID_CREDENTIALS':
            setError(response.error.message)
            break
          case 'FORBIDDEN_NETWORK':
            setError(response.error.message)
            break
          case 'NULL_EMAIL':
            setError(response.error.message)
            break
          case 'ACCOUNT_LOCKED':
            setError(response.error.message)
            break
          default:
            setError('Đã xảy ra lỗi không mong muốn. Vui lòng thử lại sau.')
        }
      }
    } catch (error) {
      setError(error.message)
    } finally {
      setIsCheck(true)
      setLoading(false)
      closeNotification()
    }
  }
  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword || !confirmNewPassword) {
      setError('Vui lòng điền vào tất cả các trường bắt buộc!')
      return
    }

    if (newPassword !== confirmNewPassword) {
      setError('Mật khẩu mới không khớp!')
      return
    }

    if (newPassword === oldPassword) {
      setError(
        'Mật khẩu mới không được giống với mật khẩu cũ. Vui lòng chọn mật khẩu khác!',
      )
      return
    }

    try {
      const response = await ChangePassword(
        employeeId,
        oldPassword,
        newPassword,
      )
      if (response.success) {
        message.success(response.message || 'Đã đổi mật khẩu thành công!')
        setStatus(false)
        setNewPassword('')
        setConfirmNewPassword('')
        setOldPassword('')
        setCurrentView('login')
        form.resetFields()
        setError(null)
      } else {
        setError(response.message)
      }
    } catch (error) {
      setError('Đã xảy ra lỗi khi thay đổi mật khẩu. Vui lòng thử lại sau.')
    }
  }
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search)
    const token = queryParams.get('token')
    const user = queryParams.get('user')
    const decoded = decodeJWT(token)
    if (token && decoded) {
      localStorage.setItem('token', token)
      localStorage.setItem('userInfo', JSON.stringify(decoded))
      window.location.href = '/u/home'
    }
  }, [location])
  const handleLanguageChange = (value) => {
    setLanguage(value)
    localStorage.setItem('language', value)
  }
  const handleChangeApiEnv = (value) => {
    setApiEnv(value)
    localStorage.setItem('api_env', value)
  }
  const sharedProps = {
    length: 6,
    size: 'large',
    inputType: 'number',
    onChange: (value) => setOtp(value),
  };

  const handleOtp = async () => {
    try {
      const response = await LoginEmailOTP({
        ...loginOtp,
        otp,
        tempToken,
        timestamp,
      });
      if (response.success) {



        localStorage.setItem('userInfo', JSON.stringify(response.data.user))
        localStorage.setItem('roles_menu', response.data.tokenRolesUserMenu)
        localStorage.setItem(
          'language_user',
          JSON.stringify(response.data.typeLanguage),
        )
        setKeyLanguage(response.data.typeLanguage)
        Cookies.set('a_a', response.data.token)
        processRolesMenu()
        closeNotification()
        navigate('/u/home')
      } else {
        switch (response.error.code) {
          case 'ACCOUNT_NOT_ACTIVATED':
            setStatus(true)
            break
          case 'USER_NOT_FOUND':
          case 'INVALID_CREDENTIALS':
            setError(response.error.message)
            break
          case 'INVALID_TEMP_TOKEN':
            /* Mã xác thực OTP không hợp lệ */
            setError(response.error.message)
            break
          case 'INVALID_OTP':
            /* Mã xác thực OTP không hợp lệ */
            setError(response.error.message)
            break
          case 'ACCOUNT_LOCKED':
            setError(response.error.message)
            break
          default:
            setError('An unexpected error occurred. Please try again later.')
        }
      }
    } catch (err) {
      message.error(err.message);
    }
  };

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };
  return (
    <>
      <Helmet>
        <title>Login</title>
      </Helmet>
      <div className="min-h-screen flex flex-col lg:flex-row items-center justify-center overflow-hidden">




        <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-5 pt-36">
          <div className="flex flex-col items-center top-20 absolute">
            <img src={Logo} alt="erp.itmv.vn" className="w-60 h-auto mb-4" />
          </div>

          {statusOTP ? (

            <>
              <div className="mx-auto max-w-lg text-center  mb-5 mt-3">
                <h1 className="text-2xl font-bold sm:text-3xl">OTP Verification</h1>

                <p className="mt-4 text-gray-500 text-xs">
                  Please check your email:<span className="font-semibold  text-gray-700 ml-1">{emailOTP}</span> to receive the OTP.

                </p>

                <p className="mt-2 text-red-500 text-sm">
                  OTP will expire in: {formatTime(timeLeft)}
                </p>


              </div>
              <Form
                layout="vertical"
                className="w-full sm:w-2/3 md:w-1/2  flex flex-col items-center"
              >
                <Form.Item
                  name="otp"
                  rules={[{ required: true, message: 'Please enter the OTP!' }]}
                >
                  <Input.OTP formatter={str => str.toUpperCase()} {...sharedProps} />
                </Form.Item>

                {error && (
                  <div className="flex items-center justify-center mb-5 gap-2  rounded bg-red-100 p-1 text-red-600">
                    <span className="text-xs font-medium">{error}</span>
                  </div>
                )}

                <Form.Item className='w-full'>
                  <button
                    type="submit"
                    onClick={handleOtp}
                    className="w-full rounded-lg h-full bg-gray-700 text-white mt-4 p-2 text-base hover:bg-gray-800"
                  >
                    Verify OTP
                  </button>
                </Form.Item>

                <div className="flex justify-center w-full">
                  <button
                    type="button"
                    className="text-xs text-blue-600"
                    onClick={() => {
                      setStatusOTP(false)
                      setError(null)
                      setOtp('')
                      form.resetFields()
                      setTimestamp(null)
                      setLoginOtp(null)
                      setTempToken(null)
                    }}
                  >
                    Back to Login
                  </button>
                </div>
              </Form>
            </>
          ) : status ? (
            // UI Change Password, hiển thị khi status === true
            <>
              <div className="mx-auto max-w-lg text-center mb-5 mt-3">
                <h1 className="text-2xl font-bold sm:text-3xl">
                  Change Password
                </h1>
                <p className="mt-4 text-gray-500 text-xs">
                  Please enter your new password and confirm it.
                </p>
              </div>
              <Form
                form={form}
                layout="vertical"
                className="w-full sm:w-2/3 md:w-1/2 "
              >
                <Form.Item
                  label="Old Password"
                  name="oldPassword"
                  rules={[{ required: true, message: 'Please enter your old password!' }]}
                >
                  <Input.Password
                    value={oldPassword}
                    onInput={(e) => {
                      const inputValue = e.target.value.replace(/\s+/g, '')
                      setOldPassword(inputValue)
                      e.target.value = inputValue
                    }}
                    placeholder="Old Password"
                  />
                </Form.Item>

                <Form.Item
                  label="New Password"
                  name="newPassword"
                  rules={[{ required: true, message: 'Please enter your new password!' }]}
                >
                  <Input.Password
                    value={newPassword}
                    onInput={(e) => {
                      const inputValue = e.target.value.replace(/\s+/g, '')
                      setNewPassword(inputValue)
                      e.target.value = inputValue
                    }}
                    placeholder="New Password"
                  />
                </Form.Item>

                <Form.Item
                  label="Confirm New Password"
                  name="confirmNewPassword"
                  rules={[{ required: true, message: 'Please confirm your password!' }]}
                >
                  <Input.Password
                    value={confirmNewPassword}
                    onInput={(e) => {
                      const inputValue = e.target.value.replace(/\s+/g, '')
                      setConfirmNewPassword(inputValue)
                      e.target.value = inputValue
                    }}
                    placeholder="Confirm Password"
                  />
                </Form.Item>

                {error && (
                  <div className="flex items-center justify-center mb-5 gap-2 self-end rounded bg-red-100 p-1 text-red-600">
                    <span className="text-xs font-medium">{error}</span>
                  </div>
                )}

                <Form.Item>
                  <button
                    type="button"
                    className="w-full rounded-lg h-full bg-gray-700 text-white mt-4 p-2 text-base hover:bg-gray-700 first-line:relative hover:text-white"
                    onClick={handleChangePassword}
                  >
                    Change Password
                  </button>
                </Form.Item>

                <div className="flex justify-center">
                  <button
                    type="button"
                    className="text-xs text-blue-600"
                    onClick={() => {
                      setStatus(false)
                      setOldPassword('')
                      setNewPassword('')
                      setConfirmNewPassword('')
                      setError(null)
                      form.resetFields()
                    }}
                  >
                    Back to Login
                  </button>
                </div>
              </Form>
            </>
          ) : currentView === 'resetPassword' ? (
            // UI Reset Password khi currentView === 'resetPassword'
            <>
              <div className="mx-auto max-w-lg text-center mb-5 mt-3">
                <h1 className="text-2xl font-bold sm:text-3xl">
                  Reset Password
                </h1>
                <p className="mt-4 text-gray-500 text-xs">
                  Please enter your 6-digit ID number and your account username
                  to reset your password.
                </p>
              </div>
              <Form
                layout="vertical"
                className="w-full sm:w-2/3 md:w-1/2 "
              >
                <Form.Item
                  label="Login"
                  name="username"
                  rules={[{ required: true, message: 'Please enter your username!' }]}
                >
                  <Input
                    className="w-full p-2 text-sm hover:bg-transparent hover:border-gray-300 focus:!shadow-none"
                    prefix={<UserOutlined className="site-form-item-icon" />}
                    placeholder="Account Username"
                    onKeyDown={(e) => {
                      if (e.key === ' ') {
                        e.preventDefault();
                      }
                    }}
                    onInput={(e) => {
                      const inputValue = e.target.value.replace(/\s+/g, '');
                      setUsername(inputValue);
                      e.target.value = inputValue;
                    }}
                  />
                </Form.Item>
                <Form.Item
                  label="ID Number"
                  rules={[
                    { required: true, message: 'Please enter your ID Number!' },
                    { len: 6, message: 'The ID number must be exactly 6 digits!' }
                  ]}
                >
                  <Input
                    type="text"
                    maxLength={6}
                    placeholder="Enter the last 6 digits of ID Number"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    onInput={(e) => {
                      const inputValue = e.target.value.replace(/[^0-9]/g, '');
                      setEmployeeId(inputValue);
                      e.target.value = inputValue;
                    }}
                    onKeyDown={(e) => {
                      if (e.key !== 'Backspace' && e.key !== 'Delete' && isNaN(e.key)) {
                        e.preventDefault();
                      }
                    }}
                  />
                </Form.Item>
                {error && (
                  <div className="flex items-center justify-center mb-5 gap-2 self-end rounded bg-red-100 p-1 text-red-600">
                    <span className="text-xs font-medium">{error}</span>
                  </div>
                )}
                <Form.Item>
                  <button
                    type="button"
                    className="w-full rounded-lg h-full bg-gray-700 text-white mt-4 p-2 text-base hover:bg-gray-800"
                  >
                    Submit
                  </button>
                </Form.Item>
                <div className="flex justify-center">
                  <button
                    type="button"
                    className="text-xs text-blue-600"
                    onClick={() => {
                      setCurrentView('login');
                      setError(null);
                    }}
                  >
                    Back to Login
                  </button>
                </div>
              </Form>
            </>
          ) : currentView === 'login' ? (
            // UI Login khi currentView === 'login' và không có trạng thái nào khác được bật
            <>
              <div className="mx-auto w-full flex flex-col items-center justify-center text-center mb-5 mt-3">
                <h1 className="text-2xl font-bold sm:text-3xl">Welcome Back!</h1>
                <p className="mt-4 text-gray-500 text-xs w-96">
                Đây là hệ thống MES và ERP tích hợp, được thiết kế nhằm nâng cao hiệu quả sản xuất và tối ưu hóa các hoạt động vận hành nội bộ.
                </p>
              </div>
              <Form
                form={form}
                onFinish={onFinish}
                className="w-full sm:w-2/3 md:w-1/2 "
              >
                <Form.Item
                  name="login"
                  rules={[{ required: true, message: 'Please enter your Employee ID!' }]}
                >
                  <Input
                    className="w-full p-2 text-sm hover:bg-transparent hover:border-gray-300 focus:!shadow-none"
                    prefix={<UserOutlined className="site-form-item-icon" />}
                    placeholder="Employee ID"
                    onInput={(e) => {
                      const inputValue = e.target.value.replace(/\s+/g, '');
                      setEmployeeId(inputValue);
                      e.target.value = inputValue;
                    }}
                  />
                </Form.Item>
                <Form.Item
                  name="password"
                  rules={[{ required: true, message: 'Please enter your Password!' }]}
                >
                  <Input.Password
                    className="w-full p-2 text-sm hover:bg-transparent hover:border-gray-300 focus:!shadow-none"
                    prefix={<LockOutlined className="site-form-item-icon" />}
                    placeholder="Password"
                    onInput={(e) => {
                      const inputValue = e.target.value.replace(/\s+/g, '');
                      setOldPassword(inputValue);
                      e.target.value = inputValue;
                    }}
                  />
                </Form.Item>
                <Form.Item initialValue="Tiếng việt">
                  <Select
                    value={language}
                    onChange={handleLanguageChange}
                    style={{ width: '100%' }}
                    defaultValue={language}
                    className="h-10 text-sm hover:bg-transparent hover:border-gray-300 focus:!shadow-none"
                    prefix={<GlobalOutlined className="site-form-item-icon" />}
                    options={[
                      { value: 6, label: 'Tiếng Việt' },
                      { value: 2, label: 'English' },
                      { value: 1, label: '한국어' },
                    ]}
                  />
                </Form.Item>
                {error && (
                  <div className="flex items-center justify-center mb-5 gap-2 self-end rounded bg-red-100 p-1 text-red-600">
                    <span className="text-xs font-medium">{error}</span>
                  </div>
                )}
                <Form.Item>
                  <button
                    type="submit"
                    className="w-full rounded-lg h-full bg-gray-700 text-white mt-4 p-2 text-base hover:bg-gray-700 first-line:relative hover:text-white"
                    disabled={loading}
                  >
                    {loading ? <LoadingOutlined /> : 'Log in'}
                  </button>
                </Form.Item>
              </Form>
            </>
          ) : null}
        </div>

      </div>
    </>
  )
}
