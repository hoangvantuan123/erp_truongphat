import {
  useEffect,
  useState,
  useMemo,
  lazy,
  Suspense,
  useCallback,
  useRef,
} from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
  Navigate,
} from 'react-router-dom'
import i18n from 'i18next'
import { openDB } from 'idb'
import { initReactI18next } from 'react-i18next'
import { Layout, message, Modal } from 'antd'
import Sidebar from '../components/sildebar/sidebar'
import Cookies from 'js-cookie'
import { checkActionPermission } from '../../permissions'
import BreadcrumbRouter from '../components/sildebar/breadcrumb'
import Spinner from '../page/default/load'
import Home from '../page/home/home'
import Login from '../auth/login'
import decodeJWT from '../../utils/decode-JWT'
import { transformDataMenu } from '../../utils/transformDataMenu'
import ErrorPage from '../page/default/errorPage'
import { CheckUser } from '../../features/auth/checkUser'
const DeliveryList = lazy(() => import('../page/material/deliveryList'))
const DefaultPage = lazy(() => import('../page/default/default'))
const WaitingIqcStockIn = lazy(
  () => import('../page/material/waitingIqcStockIn'),
)
const IQCStatus = lazy(() => import('../page/material/waitingIqcStatus'))
const MatWHStockIn = lazy(() => import('../page/material/matWHStockIn'))
const StockOutRequest = lazy(() => import('../page/material/stockOutRequest'))
const UserManagement = lazy(() => import('../page/system/userManagement'))
const RoleManagement = lazy(() => import('../page/system/roleManagement'))
const ProfileUserId = lazy(() => import('../page/system/profileUserId'))
const MenuTechnique = lazy(() => import('../page/system/menuTechnique'))
const RootMenuTechnique = lazy(() => import('../page/system/rootMenuTechnique'))
const StockOutRequestFiFo = lazy(() => import('../page/material/stockOutFiFo'))
const InvoiceView = lazy(() => import('../page/invoice/invoice'))
const IqcReqList = lazy(() => import('../page/iqc/iqcReqList'))
const IqcReqDetails = lazy(() => import('../page/iqc/iqcReqDetails'))
const IqcCheckStatus = lazy(() => import('../page/iqc/iqcCheckStatus'))
const IqcPurchaseReqList = lazy(
  () => import('../page/iqcPurchase/iqcPurchaseReqList'),
)
const IqcPurchaseReqDetails = lazy(
  () => import('../page/iqcPurchase/iqcPuchaseReqDetails'),
)
const IqcPurchaseReqDetailsList = lazy(
  () => import('../page/iqcPurchase/iqcPurchaseReqDetailsList'),
)
const IqcPurchaseCheckStatus = lazy(
  () => import('../page/iqcPurchase/iqcPurchaseCheckStatus'),
)
const IqcOutsourceReqList = lazy(
  () => import('../page/iqcOutsource/iqcOutsourceReqList'),
)
const IqcOutsourceCheckStatus = lazy(
  () => import('../page/iqcOutsource/iqcOutsourceCheckStatus'),
)
const IqcOutsourceReqDetails = lazy(
  () => import('../page/iqcOutsource/iqcOutsourceReqDetails'),
)
const IqcOutsourceReqDetailsList = lazy(
  () => import('../page/iqcOutsource/iqcOutsourceReqDetailsList'),
)

const OqcReqList = lazy(
  () => import('../page/oqc/oqcReqList'),
)

const OqcReqDetailsList = lazy(
  () => import('../page/oqc/oqcReqDetailsList'),
)

const OqcReqDetails = lazy(
  () => import('../page/oqc/oqcReqDetails'),
)

const OqcFinResultList = lazy(
  () => import('../page/oqc/oqcFinResultList'),
)

const QcFinalBadQtyResultList = lazy(
  () => import('../page/oqc/qcFinalBadQtyResultList'),
)

const IqcReqDetailsList = lazy(() => import('../page/iqc/iqcReqDetailsList'))
const QaItemQcType = lazy(() => import('../page/qaBasic/qaItemQcType'))
const QaItemQcTitle = lazy(() => import('../page/qaBasic/qaItemQcTitle'))
const QaQcTitle = lazy(() => import('../page/qaBasic/qaQcTitle'))
const QaItemClassQc = lazy(() => import('../page/qaBasic/qaItemClassQc'))
const QaCustQcTitle = lazy(() => import('../page/qaBasic/qaCustQcTitle'))


const WarehousRegistration = lazy(
  () => import('../page/basic/warehousRegistration'),
)
const WHStockList = lazy(() => import('../page/warehouse/whStockList'))
const WHBizStockList = lazy(() => import('../page/warehouse/whBizStockList'))
const WHStockDetailList = lazy(
  () => import('../page/warehouse/whStockDetailList'),
)
const WHStockDetailListLink = lazy(
  () => import('../page/warehouse/whStockDetailListLink'),
)
const WHStockAgingList = lazy(
  () => import('../page/warehouse/whStockAgingList'),
)
const WHAgingLotStockList = lazy(
  () => import('../page/warehouse/whAgingLotStockList'),
)
const LGLotMaster = lazy(() => import('../page/warehouse/lgLotMaster'))
const LGWHItem = lazy(() => import('../page/basic/lgWHItem'))
const LGEtcInReqList = lazy(() => import('../page/warehouse/lgEtcInReqList'))
const LGEtcInReqItemList = lazy(
  () => import('../page/warehouse/lgEtcInReqItemList'),
)
const LGEtcInReq = lazy(() => import('../page/warehouse/lgEtcInReq'))
const LGEtcInReqLink = lazy(() => import('../page/warehouse/lgEtcInReqLink'))
const LGEtcIn = lazy(() => import('../page/warehouse/lgEtcIn'))
const LGEtcInLink = lazy(() => import('../page/warehouse/lgEtcInLink'))
const LGEtcInItemList = lazy(() => import('../page/warehouse/lgEtcInItemList'))

const LGEtcOutReq = lazy(() => import('../page/warehouse/lgEtcOutReq'))
const LGEtcOutReqLink = lazy(() => import('../page/warehouse/lgEtcOutReqLink'))
const LGEtcOutReqList = lazy(() => import('../page/warehouse/lgEtcOutReqList'))
const LGEtcOutReqItemList = lazy(
  () => import('../page/warehouse/lgEtcOutReqItemList'),
)
const LGEtcOut = lazy(() => import('../page/warehouse/lgEtcOut'))
const LGEtcOutLink = lazy(() => import('../page/warehouse/lgEtcOutLink'))
const LGEtcOutItemList = lazy(
  () => import('../page/warehouse/lgEtcOutItemList'),
)

const LGEtcTransReq = lazy(() => import('../page/warehouse/lgEtcTransReq'))
const LGEtcTransReqLink = lazy(
  () => import('../page/warehouse/lgEtcTransReqLink'),
)
const LGEtcTransReqList = lazy(
  () => import('../page/warehouse/lgEtcTransReqList'),
)
const LGEtcTransReqItemList = lazy(
  () => import('../page/warehouse/lgEtcTransReqItemList'),
)
const LGEtcTrans = lazy(() => import('../page/warehouse/lgEtcTrans'))
const LGEtcTransLink = lazy(() => import('../page/warehouse/lgEtcTransLink'))
const LGEtcTransItemList = lazy(
  () => import('../page/warehouse/lgEtcTransItemList'),
)
const LGWHStockRealOpen = lazy(
  () => import('../page/warehouse/lgWHStockRealOpen'),
)
const LGWHStockRealOpenLink = lazy(
  () => import('../page/warehouse/lgWHStockRealOpenLink'),
)
const LGWHStockRealOpenList = lazy(
  () => import('../page/warehouse/lgWHStockRealOpenList'),
)
const LGWHStockRealOpenResult = lazy(
  () => import('../page/warehouse/lgWHStockRealOpenResult'),
)
const LGWHStockRealOpenResultList = lazy(
  () => import('../page/warehouse/lgWHStockRealOpenResultList'),
)

const LGStockClosingReSum = lazy(
  () => import('../page/warehouse/lgStockClosingReSum'),
)
const LGStockClosingDate = lazy(
  () => import('../page/warehouse/lgStockClosingDate'),
)
const LGStockClosingMonth = lazy(
  () => import('../page/warehouse/lgStockClosingMonth'),
)
const LGStockYearTrans = lazy(
  () => import('../page/warehouse/lgStockYearTrans'),
)

const ImpPermitList = lazy(() => import('../page/purchase/impPermitList'))
const ImpPermitItemList = lazy(
  () => import('../page/purchase/impPermitItemList'),
)
const ImpDelivery = lazy(() => import('../page/purchase/impDelivery'))
const ImpDeliveryLink = lazy(() => import('../page/purchase/impDeliveryLink'))
const ImpDeliveryList = lazy(() => import('../page/purchase/impDeliveryList'))
const ImpDeliveryItemList = lazy(
  () => import('../page/purchase/impDeliveryItemList'),
)
const PurOrdApprovalReq = lazy(
  () => import('../page/purchase/purOrdApprovalReq'),
)
const PurOrdApprovalReqList = lazy(
  () => import('../page/purchase/purOrdApprovalReqList'),
)
const PurOrdApprovalReqLink = lazy(
  () => import('../page/purchase/purOrdApprovalReqLink'),
)
const PurOrdApprovalReqItemList = lazy(
  () => import('../page/purchase/purOrdApprovalReqItemList'),
)
const PurOrdPO = lazy(() => import('../page/purchase/purOrdPO'))
const PurOrdPOLink = lazy(() => import('../page/purchase/purOrdPOLink'))
const PurOrdPOList = lazy(() => import('../page/purchase/purOrdPOList'))
const PurOrdPOItemList = lazy(() => import('../page/purchase/purOrdPOItemList'))
const PurDelv = lazy(() => import('../page/purchase/purDelv'))
const PurDelvList = lazy(() => import('../page/purchase/purDelvList'))
const PurDelvItemList = lazy(() => import('../page/purchase/purDelvItemList'))
const PurDelvLink = lazy(() => import('../page/purchase/purDelvLink'))
const PurDelvIn = lazy(() => import('../page/purchase/purDelvIn'))
const PurDelvInList = lazy(() => import('../page/purchase/purDelvInList'))
const PurDelvInLink = lazy(() => import('../page/purchase/purDelvInLink'))
const PurDelvInItemList = lazy(
  () => import('../page/purchase/purDelvInItemList'),
)
const ImpOrder = lazy(() => import('../page/purchase/impOrder'))
const ImpOrderList = lazy(() => import('../page/purchase/impOrderList'))
const ImpOrderItemList = lazy(() => import('../page/purchase/impOrderItemList'))
const ImpOrderLink = lazy(() => import('../page/purchase/impOrderLink'))

const { Content } = Layout
const TransMatDetails = lazy(
  () => import('../page/transReqMat/transMatDetails'),
)
const TransReqMat = lazy(() => import('../page/transReqMat/transReqMat'))
const CreateTransReqMat = lazy(
  () => import('../page/transReqMat/createTransReqMat'),
)

const BarcodePrint = lazy(() => import('../page/barcodePrint/barcodePrint'))
const BarcodeChange = lazy(() => import('../page/barcodePrint/barcodeChange'))
const DaMaterialList = lazy(
  () => import('../page/basic/product/daMaterialList'),
)

const BucketStorage = lazy(() => import('../page/basic/storage/bucket'))
const DefineRegis = lazy(() => import('../page/basic/other/defineRegis'))
const InvoiceTemp = lazy(() => import('../page/basic/storage/invoiceTemp'))
const DaMaterialListMore = lazy(
  () => import('../page/basic/product/daMaterialListMore'),
)
const RegiBOM = lazy(() => import('../page/prodMgmt/regiBOM'))
const CustomersRegistration = lazy(
  () => import('../page/basic/customers/customersRegister'),
)
const CustomersRegistrationDetails = lazy(
  () => import('../page/basic/customers/customersRegisterDetail'),
)
const BomReportAll = lazy(() => import('../page/prodMgmt/BomReportAll'))
const PdmpsProdReqList = lazy(
  () => import('../page/pdmpsProd/pdmpsProdReqList'),
)

const Langs = lazy(() => import('../page/system/lang'))
const DictSys = lazy(() => import('../page/system/dictSys'))
const PdmpsProdReq = lazy(() => import('../page/pdmpsProd/pdmpsProdReq'))
const PdmpsProdReqItemList = lazy(
  () => import('../page/pdmpsProd/pdmpsProdReqItemList'),
)
const PdmpsProdReqPlanList = lazy(
  () => import('../page/pdmpsProd/pdmsProdPlanList'),
)
const PdmmOutExtra = lazy(() => import('../page/pdmm/pdmmOutExtra'))
const PdmmOutQueryList = lazy(() => import('../page/pdmm/pdmmOutQueryList'))

const PdmmOutQueryDetailList = lazy(() => import('../page/pdmm/pdmmOutQueryDetailList'))
const PdmmOutQueryDetailListSeq = lazy(() => import('../page/pdmm/pdmmOutQueryDetailListSeq'))
const SpdmmOutProcItemList = lazy(() => import('../page/pdmm/spdmmOutProcItemList'))
const PublicIPSettings = lazy(() => import('../page/system/publicIpSettings'))
const MailSettings = lazy(() => import('../page/system/mailSettings'))
const PdmpsProdPlan = lazy(() => import('../page/pdmpsProd/pdmsProdPlan'))
const PdsfcWorkOrderList = lazy(() => import('../page/pdsfc/pdsfcWorkOrderList'))
const PdsfcMatProgressList = lazy(() => import('../page/pdsfc/pdsfcMatProgressList'))
const PdsfcWorkReportList = lazy(() => import('../page/pdsfc/pdsfcWorkReportList'))
const PdsfcWorkReport = lazy(() => import('../page/pdsfc/pdsfcWorkReport'))

import { initSocket, getSocket } from '../../services/socket'


const Test = lazy(() => import('../page/test/index'))
const RegiTempFile = lazy(() => import('../page/temp/regiTempFile'))

/* TEM NVL */
const TemNVLNew = lazy(() => import('../page/mngTemNvl/temNVLNew'))
const HistoryTemNVLNew = lazy(() => import('../page/mngTemNvl/historyTemNVLNew'))
const TemNVLUsed = lazy(() => import('../page/mngTemNvl/temNVLUsed'))


const SLGWHInitStock = lazy(() => import('../page/invOpen/SLGWHInitStock'))
const SctokReal5Page = lazy(() => import('../page/basic/stock/stockReal5'))
const StockReal6 = lazy(() => import('../page/scan/stockReal6'))
const StockReal6Seq = lazy(() => import('../page/scan/stockReal6Seq'))



const HrEmps = lazy(() => import('../page/hr/hrEmp'))
const HrBasFamily = lazy(() => import('../page/hr/hrBasFamily'))
const HrBasAddress = lazy(() => import('../page/hr/hrBasAddress'))
const HrEmpsOne = lazy(() => import('../page/hr/hrEmpOne'))
const HrBasCareer = lazy(() => import('../page/hr/hrBasCareer'))
const HrBasAcademy = lazy(() => import('../page/hr/hrBasAcademy'))
const HrBasTravelRec = lazy(() => import('../page/hr/hrBasTravelRec'))
const HrBasOrgPos = lazy(() => import('../page/hr/hrBasOrgPos'))
const HrBasLangSkill = lazy(() => import('../page/hr/hrBasLangSkill'))
const HrBasUnion = lazy(() => import('../page/hr/hrBasUnion'))
const HrBasPrzPnl = lazy(() => import('../page/hr/hrBasPrzPnl'))
const HrOrgJob = lazy(() => import('../page/hr/hrOrgJob'))
const HrEmplnSeq = lazy(() => import('../page/hr/hrEmplnSeq'))


const getLanguageData = async (typeLanguage) => {
  try {
    const db = await openDB('languageDatabase', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('languages')) {
          const store = db.createObjectStore('languages', {
            keyPath: 'typeLanguage',
          })
          store.put({
            typeLanguage: 6,
            languageData: [
              {
                IdSeq: 1,
                Word: 'Từ điển mẫu',
                WordSeq: 'Từ điển',
              },
            ],
          })
        }
      },
    })

    const data = await db.get('languages', typeLanguage)
    return data ? data.languageData : null
  } catch (error) {
    return null
  }
}

const LanguageProvider = ({ children, keyLanguage }) => {
  const [isReady, setIsReady] = useState(false)
  const [languageUser, setLanguageUser] = useState(
    Number(localStorage.getItem('language_user')) || 6,
  )
  const navigate = useNavigate()

  useEffect(() => {
    const initializeI18n = async () => {
      try {
        const languageData = await getLanguageData(6)
        if (!languageData) {
          const defaultLanguageData = [
            {
              IdSeq: 1,
              Word: 'Từ điển mẫu',
              WordSeq: 'Từ điển',
            },
          ]
          i18n.use(initReactI18next).init({
            resources: {
              root: {
                translation: defaultLanguageData.reduce((acc, item) => {
                  acc[item.WordSeq] = item.Word
                  return acc
                }, {}),
              },
            },
            lng: 'root',
            fallbackLng: 'root',
            interpolation: {
              escapeValue: false,
            },
          })

          setIsReady(true)
          return
        }

        const translations = languageData.reduce((acc, item) => {
          acc[item.WordSeq] = item.Word
          return acc
        }, {})

        i18n.use(initReactI18next).init({
          resources: {
            root: {
              translation: translations,
            },
          },
          lng: languageUser.toString(),
          fallbackLng: 'root',
          interpolation: {
            escapeValue: false,
          },
        })

        setIsReady(true)
      } catch (error) {
        console.error('Error initializing i18n:', error)
        setIsReady(true)
      }
    }

    initializeI18n()
  }, [languageUser])

  if (!isReady) return null

  return children
}

const UserRouter = () => {
  const controllers = useRef({})

  const navigate = useNavigate()
  const location = useLocation()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [menuTransForm, setMenuTransForm] = useState([])
  const [rootMenuItems, setRootMenuItems] = useState([])
  const [errorMenu, setErrorMenu] = useState(false)
  const [userPermissions, setUserPermissions] = useState([])
  const [isMobile, setIsMobile] = useState(false)
  const rolesMenu = localStorage.getItem('roles_menu')
  const [keyLanguage, setKeyLanguage] = useState(null)
  const [collapsed, setCollapsed] = useState(() => {
    const savedState = localStorage.getItem('COLLAPSED_STATE')
    return savedState ? JSON.parse(savedState) : false
  })
  const [message, setMessage] = useState('');
  const [log, setLog] = useState([]);
  const [notifi1, setNotifi1] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isLoggingOut = useRef(false)
  const processRolesMenu = useCallback(async () => {
    if (!rolesMenu) return
    try {
      const data = decodeJWT(rolesMenu)
      const settingItems = data?.data[0]?.menu || []
      const rootMenuItems = data?.data[1]?.rootMenu || []
      setUserPermissions(settingItems)
      setRootMenuItems(rootMenuItems)
      const transformedMenu = transformDataMenu(settingItems, rootMenuItems)
      setMenuTransForm(transformedMenu)
    } catch (error) {
      setErrorMenu(true)
    }
  }, [rolesMenu])
  useEffect(() => {
    processRolesMenu()
  }, [processRolesMenu])
  const logoutAndRedirect = () => {
    if (isLoggingOut.current) return
    isLoggingOut.current = true
    Cookies.remove('a_a')
    localStorage.removeItem('userInfo')
    localStorage.removeItem('rolesMenu')
    navigate('/u/login')
  }

  const showAuthFailModal = () => {
    const isLoginPage = location.pathname.startsWith('/u/login');
    if (isLoginPage || isLoggingOut.current || isModalOpen) return;
    setIsModalOpen(true);

    Modal.confirm({
      title: 'Không thể xác thực',
      content: 'Phiên đăng nhập không thể xác thực. Bạn muốn thử lại hay đăng xuất?',
      okText: 'Thử lại',
      cancelText: 'Đăng xuất',
      closable: false,
      maskClosable: false,
      centered: true,

      onCancel: () => {
        logoutAndRedirect();
        setIsModalOpen(false);
      },
      onOk: () => {
        handleCheckUser();
        setIsModalOpen(false);
      },
    });
  };

  const handleCheckUser = () => {
    CheckUser()
      .then((response) => {
        if (response?.status === false) {
          showAuthFailModal()
        }
      })
      .catch(() => {
        showAuthFailModal()
      })
  }


  useEffect(() => {
    const isLoginPage = location.pathname.startsWith('/u/login');
    const token = Cookies.get('a_a');

    if (isLoginPage || isLoggingOut.current || !token) return;

    handleCheckUser();
  }, [processRolesMenu, location.pathname]);




  useEffect(() => {
    let socketRef = null;

    const setupSocket = async () => {
      const socket = await initSocket();
      if (!socket) {

        return;
      }

      socketRef = socket;

      socket.on('force_disconnect_notice', (msg) => {
        socket.disconnect();
        Cookies.remove('a_a')
        localStorage.removeItem('userInfo')
        localStorage.removeItem('rolesMenu')
        navigate('/u/login')
      });

      socket.on('receive_message', (msg) => {
        setLog((prev) => [...prev, `📥 ${msg}`]);
      });

      socket.on('connect', () => {
        setLog((prev) => [...prev, '✅ Connected to server']);
      });

      socket.on('disconnect', () => {
        setLog((prev) => [...prev, '❌ Disconnected']);
      });

      socket.on('error', (err) => {
        setLog((prev) => [...prev, `⚠️ Error: ${err}`]);
      });

      const handleBeforeUnload = () => {
        if (socket.connected) socket.disconnect();
      };

      window.addEventListener('beforeunload', handleBeforeUnload);

      return () => {
        socket.off('force_disconnect_notice');
        socket.off('receive_message');
        socket.off('connect');
        socket.off('disconnect');
        socket.off('error');

        if (socket.connected) socket.disconnect();
        window.removeEventListener('beforeunload', handleBeforeUnload);
      };
    };

    const cleanupPromise = setupSocket();

    return () => {
      cleanupPromise?.then((cleanup) => {
        if (typeof cleanup === 'function') {
          cleanup();
        }
      });
    };
  }, [processRolesMenu]);



  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 820)
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const skippedRoutes = ['/u/login', '/u/test']

  const checkLoginStatus = () => {
    const token = Cookies.get('a_a')
    const userInfo = localStorage.getItem('userInfo')
    const rolesMenu = localStorage.getItem('roles_menu')

    if (token && userInfo && rolesMenu) {
      setIsLoggedIn(true)
    } else {
      Cookies.remove('a_a')
      localStorage.removeItem('userInfo')
      localStorage.removeItem('rolesMenu')
      navigate('/u/login')
    }
  }

  useEffect(() => {
    if (
      !skippedRoutes.includes(location.pathname) &&
      !location.pathname.startsWith('/test/') &&
      !location.pathname.startsWith('/downloads/')
    ) {
      checkLoginStatus()
    }
  }, [location.pathname])

  if (errorMenu) return <ErrorPage />
  const routes = [
    {
      path: '/wms/u/warehouse/material/delivery-list',
      permission: 'material-1-1',
      element: DeliveryList,
      fallback: DefaultPage,
    },
    {
      path: '/wms/u/warehouse/material/waiting-iqc-stock-in/:id',
      permission: 'material-1-1',
      element: WaitingIqcStockIn,
      fallback: DefaultPage,
    },
    {
      path: '/wms/u/warehouse/material/waiting-iqc-status',
      permission: 'material-1-3',
      element: IQCStatus,
      fallback: DefaultPage,
    },
    {
      path: '/wms/u/warehouse/material/material-wh-stock-in/:id',
      permission: 'material-1-3',
      element: MatWHStockIn,
      fallback: DefaultPage,
    },
    {
      path: '/wms/u/warehouse/material/stock-out-request',
      permission: 'material-1-4',
      element: StockOutRequest,
      fallback: DefaultPage,
    },
    {
      path: '/wms/u/system_settings/users/user-management',
      permission: 'user_management-1-1',
      element: UserManagement,
      fallback: DefaultPage,
    },
    {
      path: '/wms/u/warehouse/material/stock-out-request/:id',
      permission: 'material-1-4',
      element: StockOutRequestFiFo,
      fallback: DefaultPage,
    },
    {
      path: '/wms/u/system_settings/users/user-management/profile/:id/:name',
      permission: 'user_management-1-2',
      element: ProfileUserId,
      fallback: DefaultPage,
    },
    {
      path: '/wms/u/system_settings/users/role-management',
      permission: 'user_management-1-2',
      element: RoleManagement,
      fallback: DefaultPage,
    },
    {
      path: '/wms/u/system_settings/technique/menu-items',
      permission: 'technique-1-2',
      element: MenuTechnique,
      fallback: DefaultPage,
    },
    {
      path: '/wms/u/system_settings/technique/root-menu',
      permission: 'technique-1-1',
      element: RootMenuTechnique,
      fallback: DefaultPage,
    },
    {
      path: '/wms/u/warehouse/warehousing/barcode-print',
      permission: 'warehousing-1-1',
      element: BarcodePrint,
      fallback: DefaultPage,
    },
    {
      path: '/wms/u/warehouse/warehousing/barcode-change',
      permission: 'warehousing-1-2',
      element: BarcodeChange,
      fallback: DefaultPage,
    },
    {
      path: '/wms/u/warehouse/basic/warehouse_registration',
      permission: 'warehous_registration',
      element: WarehousRegistration,
      fallback: DefaultPage,
    },

    {
      path: '/wms/u/warehouse/import-export-mat/trans-req',
      permission: 'import-export-mat-1',
      element: TransReqMat,
      fallback: DefaultPage,
    },
    {
      path: '/wms/u/warehouse/import-export-mat/create-trans-req',
      permission: 'import-export-mat-2',
      element: CreateTransReqMat,
      fallback: DefaultPage,
    },
    {
      path: '/wms/u/warehouse/import-export-mat/create-trans-req/:id',
      permission: 'import-export-mat-1',
      element: CreateTransReqMat,
      fallback: DefaultPage,
    },
    {
      path: '/wms/u/warehouse/import-export-mat/trans-mat-details',
      permission: 'inventory-1-2',
      element: TransMatDetails,
      fallback: DefaultPage,
    },
    {
      path: '/wms/u/warehouse/inventory/lg-wh-stock-list',
      permission: 'inventory-1-1',
      element: WHStockList,
      fallback: DefaultPage,
    },
    {
      path: '/wms/u/warehouse/inventory/lg-biz-stock-list',
      permission: 'inventory-1-5',
      element: WHBizStockList,
      fallback: DefaultPage,
    },
    {
      path: '/wms/u/warehouse/inventory/lg-wh-stock-detail-list/:id',
      permission: 'inventory-1-1',
      element: WHStockDetailList,
      fallback: DefaultPage,
    },
    {
      path: '/wms/u/warehouse/inventory/lg-wh-stock-detail-list',
      permission: 'inventory-1-2',
      element: WHStockDetailListLink,
      fallback: DefaultPage,
    },
    {
      path: '/wms/u/warehouse/inventory/lg-stock-aging-list',
      permission: 'inventory-1-3',
      element: WHStockAgingList,
      fallback: DefaultPage,
    },
    {
      path: '/wms/u/warehouse/inventory/lg-aging-lot-stock-list',
      permission: 'inventory-1-4',
      element: WHAgingLotStockList,
      fallback: DefaultPage,
    },
    {
      path: '/wms/u/warehouse/basic/lg-lot-master',
      permission: 'basic-1-3',
      element: LGLotMaster,
      fallback: DefaultPage,
    },
    {
      path: '/wms/u/warehouse/basic/lg-wh-item',
      permission: 'lg-wh-item',
      element: LGWHItem,
      fallback: DefaultPage,
    },
    {
      path: '/wms/u/warehouse/etc-in/lg-etc-in-req',
      permission: 'etc-in-1-1',
      element: LGEtcInReq,
      fallback: DefaultPage,
    },
    {
      path: '/wms/u/warehouse/etc-in/lg-etc-in-req/:id',
      permission: 'etc-in-1-1',
      element: LGEtcInReqLink,
      fallback: DefaultPage,
    },
    {
      path: '/wms/u/warehouse/etc-in/lg-etc-in-req-list',
      permission: 'etc-in-1-2',
      element: LGEtcInReqList,
      fallback: DefaultPage,
    },
    {
      path: '/wms/u/warehouse/etc-in/lg-etc-in-req-detail-list',
      permission: 'etc-in-1-3',
      element: LGEtcInReqItemList,
      fallback: DefaultPage,
    },
    {
      path: '/wms/u/warehouse/etc-in/lg-etc-in/:id',
      permission: 'etc-in-1-6',
      element: LGEtcIn,
      fallback: DefaultPage,
    },
    {
      path: '/wms/u/warehouse/etc-in/lg-etc-in-link/:id',
      permission: 'etc-in-1-6',
      element: LGEtcInLink,
      fallback: DefaultPage,
    },
    {
      path: '/wms/u/warehouse/etc-in/lg-etc-in-detail-list',
      permission: 'etc-in-1-6',
      element: LGEtcInItemList,
      fallback: DefaultPage,
    },
    {
      path: '/wms/u/warehouse/etc-out/lg-etc-out-req',
      permission: 'etc-out-1-1',
      element: LGEtcOutReq,
      fallback: DefaultPage,
    },
    {
      path: '/wms/u/warehouse/etc-out/lg-etc-out-req/:id',
      permission: 'etc-out-1-1',
      element: LGEtcOutReqLink,
      fallback: DefaultPage,
    },
    {
      path: '/wms/u/warehouse/etc-out/lg-etc-out-req-list',
      permission: 'etc-out-1-2',
      element: LGEtcOutReqList,
      fallback: DefaultPage,
    },
    {
      path: '/wms/u/warehouse/etc-out/lg-etc-out-req-detail-list',
      permission: 'etc-out-1-3',
      element: LGEtcOutReqItemList,
      fallback: DefaultPage,
    },
    {
      path: '/wms/u/warehouse/etc-out/lg-etc-out/:id',
      permission: 'etc-out-1-3',
      element: LGEtcOut,
      fallback: DefaultPage,
    },
    {
      path: '/wms/u/warehouse/etc-out/lg-etc-out-link/:id',
      permission: 'etc-out-1-4',
      element: LGEtcOutLink,
      fallback: DefaultPage,
    },
    {
      path: '/wms/u/warehouse/etc-out/lg-etc-out-detail-list',
      permission: 'etc-out-1-4',
      element: LGEtcOutItemList,
      fallback: DefaultPage,
    },
    {
      path: '/wms/u/warehouse/etc-trans/lg-etc-trans-req',
      permission: 'etc-trans-1-1',
      element: LGEtcTransReq,
      fallback: DefaultPage,
    },
    {
      path: '/wms/u/warehouse/etc-trans/lg-etc-trans-req/:id',
      permission: 'etc-trans-1-1',
      element: LGEtcTransReqLink,
      fallback: DefaultPage,
    },
    {
      path: '/wms/u/warehouse/etc-trans/lg-etc-trans-req-list',
      permission: 'etc-trans-1-2',
      element: LGEtcTransReqList,
      fallback: DefaultPage,
    },
    {
      path: '/wms/u/warehouse/etc-trans/lg-etc-trans-req-detail-list',
      permission: 'etc-trans-1-3',
      element: LGEtcTransReqItemList,
      fallback: DefaultPage,
    },
    {
      path: '/wms/u/warehouse/etc-trans/lg-etc-trans/:id',
      permission: 'etc-trans-1-3',
      element: LGEtcTrans,
      fallback: DefaultPage,
    },
    {
      path: '/wms/u/warehouse/etc-trans/lg-etc-trans-link/:id',
      permission: 'etc-trans-1-4',
      element: LGEtcTransLink,
      fallback: DefaultPage,
    },
    {
      path: '/wms/u/warehouse/etc-trans/lg-etc-trans-detail-list',
      permission: 'etc-trans-1-4',
      element: LGEtcTransItemList,
      fallback: DefaultPage,
    },

    {
      path: '/wms/u/warehouse/stock-real/stock-real-open',
      permission: 'stock-real-1-2',
      element: LGWHStockRealOpen,
      fallback: DefaultPage,
    },
    {
      path: '/wms/u/warehouse/stock-real/stock-real-open/:id',
      permission: 'stock-real-1-2',
      element: LGWHStockRealOpenLink,
      fallback: DefaultPage,
    },
    {
      path: '/wms/u/warehouse/stock-real/stock-real-open-list',
      permission: 'stock-real-1-3',
      element: LGWHStockRealOpenList,
      fallback: DefaultPage,
    },
    {
      path: '/wms/u/warehouse/stock-real/stock-real-open-result/:id',
      permission: 'stock-real-1-3',
      element: LGWHStockRealOpenResult,
      fallback: DefaultPage,
    },
    {
      path: '/wms/u/warehouse/stock-real/stock-real-open-result-list',
      permission: 'stock-real-1-4',
      element: LGWHStockRealOpenResultList,
      fallback: DefaultPage,
    },

    {
      path: '/wms/u/warehouse/stock-closing/stock-re-sum',
      permission: 'stock-closing-1-1',
      element: LGStockClosingReSum,
      fallback: DefaultPage,
    },

    {
      path: '/wms/u/warehouse/stock-closing/stock-close-date',
      permission: 'stock-closing-1-2',
      element: LGStockClosingDate,
      fallback: DefaultPage,
    },
    {
      path: '/wms/u/warehouse/stock-closing/stock-close-month',
      permission: 'stock-closing-1-3',
      element: LGStockClosingMonth,
      fallback: DefaultPage,
    },
    {
      path: '/wms/u/warehouse/stock-closing/stock-year-trans',
      permission: 'stock-closing-1-4',
      element: LGStockYearTrans,
      fallback: DefaultPage,
    },
    {
      path: '/pur/u/import/imp-permit-add-item-list',
      permission: 'import-1-2',
      element: ImpPermitItemList,
      fallback: DefaultPage,
    },

    {
      path: '/pur/u/import/imp-permit-add-list',
      permission: 'import-1-1',
      element: ImpPermitList,
      fallback: DefaultPage,
    },
    {
      path: '/pur/u/import/imp-delivery/:id',
      permission: 'import-1-3',
      element: ImpDelivery,
      fallback: DefaultPage,
    },
    {
      path: '/pur/u/import/imp-delivery-link/:id',
      permission: 'import-1-3',
      element: ImpDeliveryLink,
      fallback: DefaultPage,
    },
    {
      path: '/pur/u/import/imp-delv-list',
      permission: 'import-1-3',
      element: ImpDeliveryList,
      fallback: DefaultPage,
    },
    {
      path: '/pur/u/import/imp-delv-item-list',
      permission: 'import-1-4',
      element: ImpDeliveryItemList,
      fallback: DefaultPage,
    },
    {
      path: '/pur/u/pur-order/ord-approval-req',
      permission: 'order-1-1',
      element: PurOrdApprovalReq,
      fallback: DefaultPage,
    },
    {
      path: '/pur/u/pur-order/ord-approval-req-list',
      permission: 'order-1-2',
      element: PurOrdApprovalReqList,
      fallback: DefaultPage,
    },
    {
      path: '/pur/u/pur-order/ord-approval-req/:id',
      permission: 'order-1-1',
      element: PurOrdApprovalReqLink,
      fallback: DefaultPage,
    },
    {
      path: '/pur/u/pur-order/ord-approval-req-item-list',
      permission: 'order-1-3',
      element: PurOrdApprovalReqItemList,
      fallback: DefaultPage,
    },
    {
      path: '/pur/u/purchase/ord-po/:id',
      permission: 'purchase-1-1',
      element: PurOrdPO,
      fallback: DefaultPage,
    },
    {
      path: '/pur/u/purchase/ord-po-link/:id',
      permission: 'purchase-1-2',
      element: PurOrdPOLink,
      fallback: DefaultPage,
    },
    {
      path: '/pur/u/purchase/ord-po-list',
      permission: 'purchase-1-1',
      element: PurOrdPOList,
      fallback: DefaultPage,
    },
    {
      path: '/pur/u/purchase/ord-po-item-list',
      permission: 'purchase-1-2',
      element: PurOrdPOItemList,
      fallback: DefaultPage,
    },
    {
      path: '/pur/u/purchase/pu-delv/:id',
      permission: 'purchase-1-3',
      element: PurDelv,
      fallback: DefaultPage,
    },
    {
      path: '/pur/u/purchase/pu-delv-link/:id',
      permission: 'purchase-1-3',
      element: PurDelvLink,
      fallback: DefaultPage,
    },
    {
      path: '/pur/u/purchase/pu-delv-list',
      permission: 'purchase-1-3',
      element: PurDelvList,
      fallback: DefaultPage,
    },
    {
      path: '/pur/u/purchase/pu-delv-item-list',
      permission: 'purchase-1-4',
      element: PurDelvItemList,
      fallback: DefaultPage,
    },
    {
      path: '/pur/u/purchase/pu-delv-in/:id',
      permission: 'purchase-1-5',
      element: PurDelvIn,
      fallback: DefaultPage,
    },
    {
      path: '/pur/u/purchase/pu-delv-in-list',
      permission: 'purchase-1-6',
      element: PurDelvInList,
      fallback: DefaultPage,
    },
    {
      path: '/pur/u/purchase/pu-delv-in-link/:id',
      permission: 'purchase-1-5',
      element: PurDelvInLink,
      fallback: DefaultPage,
    },
    {
      path: '/pur/u/purchase/pu-delv-in-item-list',
      permission: 'purchase-1-6',
      element: PurDelvInItemList,
      fallback: DefaultPage,
    },
    {
      path: '/pur/u/import/imp-order/:id',
      permission: 'import-1-5',
      element: ImpOrder,
      fallback: DefaultPage,
    },
    {
      path: '/pur/u/import/imp-order-link/:id',
      permission: 'import-1-5',
      element: ImpOrderLink,
      fallback: DefaultPage,
    },
    {
      path: '/pur/u/import/imp-order-list',
      permission: 'import-1-5',
      element: ImpOrderList,
      fallback: DefaultPage,
    },
    {
      path: '/pur/u/import/imp-order-item-list',
      permission: 'import-1-5',
      element: ImpOrderItemList,
      fallback: DefaultPage,
    },

    {
      path: '/wms/u/warehouse/basic/da-material-list',
      permission: 'da-material-list',
      element: DaMaterialList,
      fallback: DefaultPage,
    },
    {
      path: '/wms/u/basic/storage/buckets-basic-regis',
      permission: 'buckets-basic-regis',
      element: BucketStorage,
      fallback: DefaultPage,
    },
    {
      path: '/wms/u/basic/other/define-regis',
      permission: 'define_regis',
      element: DefineRegis,
      fallback: DefaultPage,
    },
    {
      path: '/wms/u/basic/storage/invoice-template-regis',
      permission: 'invoice_template_regis',
      element: InvoiceTemp,
      fallback: DefaultPage,
    },
    {
      path: '/wms/u/warehouse/basic/da-material-list-more',
      permission: 'da-material-list-more',
      element: DaMaterialListMore,
    },
    {
      path: '/wms/u/prod_mgmt/basic/regi-bom',
      permission: 'da-material-list-more',
      element: RegiBOM,
      fallback: DefaultPage,
    },
    {
      path: '/wms/u/invoice/:id',
      element: InvoiceView,
      fallback: InvoiceView,
    },
    {
      path: '/wms/u/basic/customers/register',
      permission: 'customers',
      element: CustomersRegistration,
      fallback: DefaultPage,
    },
    {
      path: '/wms/u/basic/customers/register-details/:id',
      permission: 'customers-1-1',
      element: CustomersRegistrationDetails,
      fallback: DefaultPage,
    },
    {
      path: '/wms/u/prod_mgmt/basic/query-all-bom',
      permission: 'query_all_bom',
      element: BomReportAll,
      fallback: DefaultPage,
    },
    {
      path: '/wms/u/prod_mgmt/pdmps/pdmps_prod_req_list',
      permission: 'pdmps_prod_req_list',
      element: PdmpsProdReqList,
      fallback: DefaultPage,
    },
    {
      path: '/qc/u/iqc-page',
      permission: 'iqc-1-1',
      element: IqcReqList,
      fallback: DefaultPage,
    },

    {
      path: '/qc/u/iqc-update-check/:id',
      permission: 'iqc-1-1',
      element: IqcReqDetails,
      fallback: DefaultPage,
    },
    {
      path: '/qc/u/iqc-check-status',
      permission: 'iqc-1-4',
      element: IqcCheckStatus,
      fallback: DefaultPage,
    },
    {
      path: '/wms/u/prod_mgmt/basic/query-all-bom',
      permission: 'query_all_bom',
      element: BomReportAll,
      fallback: DefaultPage,
    },
    {
      path: '/wms/u/prod_mgmt/pdmps/pdmps_prod_req_list',
      permission: 'pdmps_prod_req_list',
      element: PdmpsProdReqList,
      fallback: DefaultPage,
    },
    {
      path: '/qc/u/iqc-page',
      permission: 'iqc-1-1',
      element: IqcReqList,
      fallback: DefaultPage,
    },

    {
      path: '/wms/u/system-settings/language-list',
      permission: 'language_list',
      element: Langs,
      fallback: DefaultPage,
    },
    {
      path: '/wms/u/system-settings/language-item',
      permission: 'language_item',
      element: DictSys,
      fallback: DefaultPage,
    },
    {
      path: '/wms/u/prod_mgmt/pdmps/pdmps_prod_req',
      permission: 'pdmps_prod_req',
      element: PdmpsProdReq,
      fallback: DefaultPage,
    },
    {
      path: '/qc/u/iqc-update-check-list',
      permission: 'iqc-1-1',
      element: IqcReqDetailsList,
      fallback: DefaultPage,
    },

    {
      path: '/qc/u/iqc-purchase',
      permission: 'iqc-accept',
      element: IqcPurchaseReqList,
      fallback: DefaultPage,
    },
    {
      path: '/qc/u/iqc-purchase-accept/:id',
      permission: 'iqc-accept',
      element: IqcPurchaseReqDetails,
      fallback: DefaultPage,
    },
    {
      path: '/qc/u/iqc-purchase-accept-list',
      permission: 'iqc-accept',
      element: IqcPurchaseReqDetailsList,
      fallback: DefaultPage,
    },
    {
      path: '/qc/u/iqc-purchase-status',
      permission: 'iqc-accept',
      element: IqcPurchaseCheckStatus,
      fallback: DefaultPage,
    },
    {
      path: '/qc/u/iqc-outsource',
      permission: 'iqc-accept-4',
      element: IqcOutsourceReqList,
      fallback: DefaultPage,
    },
    {
      path: '/qc/u/iqc-outsource/:id',
      permission: 'iqc-accept-4',
      element: IqcOutsourceReqDetails,
      fallback: DefaultPage,
    },
    {
      path: '/qc/u/iqc-outsource-list',
      permission: 'iqc-accept-4',
      element: IqcOutsourceReqDetailsList,
      fallback: DefaultPage,
    },
    {
      path: '/qc/u/iqc-status-outsourcing',
      permission: 'iqc-accept-4',
      element: IqcOutsourceCheckStatus,
      fallback: DefaultPage,
    },
    {
      path: '/qc/u/qc-finish-req',
      permission: 'qc-final-1',
      element: OqcReqList,
      fallback: DefaultPage,
    },
    {
      path: '/qc/u/qc-finish-detail/:id',
      permission: 'qc-final-1',
      element: OqcReqDetails,
      fallback: DefaultPage,
    },
    {
      path: '/qc/u/qc-finish-detail-list',
      permission: 'qc-final-1',
      element: OqcReqDetailsList,
      fallback: DefaultPage,
    },
    {
      path: '/qc/u/qc-finish-list',
      permission: 'qc-final-2',
      element: OqcFinResultList,
      fallback: DefaultPage,
    },
    {
      path: '/qc/u/qc-finish-num-error',
      permission: 'qc-final-2',
      element: QcFinalBadQtyResultList,
      fallback: DefaultPage,
    },
    {
      path: '/qc/u/qa-basic/qa-item-qc-type',
      permission: 'qa-basic-1',
      element: QaItemQcType,
      fallback: DefaultPage,
    },
    {
      path: '/qc/u/qa-basic/qa-item-qc-title',
      permission: 'qa-basic-2',
      element: QaItemQcTitle,
      fallback: DefaultPage,
    },
    {
      path: '/qc/u/qa-basic/qa-qc-title',
      permission: 'qa-basic-3',
      element: QaQcTitle,
      fallback: DefaultPage,
    },
    {
      path: '/qc/u/qa-basic/qa-item-class-qc',
      permission: 'qa-basic-4',
      element: QaItemClassQc,
      fallback: DefaultPage,
    },
    {
      path: '/qc/u/qa-basic/qa-cust-qc-title',
      permission: 'qa-basic-5',
      element: QaCustQcTitle,
      fallback: DefaultPage,
    },
    {
      path: '/wms/u/prod_mgmt/pdmps/pdmps_prod_req_item_list',
      permission: 'pdmps_prod_req_item_list',
      element: PdmpsProdReqItemList,
      fallback: DefaultPage,
    },
    {
      path: '/wms/u/prod_mgmt/pdmps/pdms_prod_plan_list',
      permission: 'pdms_prod_plan_list',
      element: PdmpsProdReqPlanList,
      fallback: DefaultPage,
    },
    {
      path: '/wms/u/prod_mgmt/pdmm/pdmm_out_extra',
      permission: 'pdmm_out_extra',
      element: PdmmOutExtra,
      fallback: DefaultPage,
    },
    {
      path: '/wms/u/prod_mgmt/pdmm/pdmm_out_query_list',
      permission: 'pdmm_out_query_list',
      element: PdmmOutQueryList,
      fallback: DefaultPage,
    },
    {
      path: '/wms/u/prod_mgmt/pdmm/pdmm_out_query_detail_list',
      permission: 'pdmm_out_query_detail_list',
      element: PdmmOutQueryDetailList,
      fallback: DefaultPage,
    },
    {
      path: '/wms/u/prod_mgmt/pdmm/pdmm_out_query_detail_list/:seq',
      permission: 'pdmm_out_query_detail_list',
      element: PdmmOutQueryDetailListSeq,
      fallback: DefaultPage,
    },
    {
      path: '/wms/u/prod_mgmt/pdmm/pdmm_out_extra/:seq',
      permission: 'pdmm_out_query_list',
      element: PdmmOutExtra,
      fallback: DefaultPage,
    },
    {
      path: '/wms/u/prod_mgmt/pdmm/pdmm_out_query_detail_item_list',
      permission: 'pdmm_out_query_detail_item_list',
      element: SpdmmOutProcItemList,
      fallback: DefaultPage
    },
    {
      path: '/wms/u/system_settings/system_configuration/public_ip_settings',
      permission: 'public_ip_settings',
      element: PublicIPSettings,
      fallback: DefaultPage
    },
    {
      path: '/wms/u/system_settings/system_configuration/mail_settings',
      permission: 'mail_settings',
      element: MailSettings,
      fallback: DefaultPage
    },
    {
      path: '/wms/u/prod_mgmt/pdmps/pdms_prod_plan',
      permission: 'pdms_prod_plan',
      element: PdmpsProdPlan,
      fallback: DefaultPage
    },
    {
      path: '/wms/u/prod_mgmt/pdmps/pdms_prod_plan/:seq',
      permission: 'pdms_prod_plan',
      element: PdmpsProdPlan,
      fallback: DefaultPage
    },
    {
      path: '/u/prod_mgmt/pdsfc_work_order_list',
      permission: 'pdsfc_work_order_list',
      element: PdsfcWorkOrderList,
      fallback: DefaultPage
    },
    {
      path: '/u/prod_mgmt/pdsfc_mat_progress_list',
      permission: 'pdsfc_mat_progress_list',
      element: PdsfcMatProgressList,
      fallback: DefaultPage
    },
    {
      path: '/u/prod_mgmt/pdsfc_work_report_list',
      permission: 'pdsfc_work_report_list',
      element: PdsfcWorkReportList,
      fallback: DefaultPage
    },
    {
      path: '/u/prod_mgmt/pdsfc_work_report',
      permission: 'pdsfc_work_report',
      element: PdsfcWorkReport,
      fallback: DefaultPage
    },
    {
      path: '/u/prod_mgmt/pdsfc_work_report/:seq',
      permission: 'pdsfc_work_report',
      element: PdsfcWorkReport,
      fallback: DefaultPage
    },



    /* NVL */
    {
      path: '/u/warehouse/mng_tem_nvl/tem_nvl_new',
      permission: 'tem_nvl_new',
      element: TemNVLNew,
      fallback: DefaultPage
    },
    {
      path: '/u/warehouse/mng_tem_nvl/tem_nvl_used',
      permission: 'tem_nvl_used',
      element: TemNVLUsed,
      fallback: DefaultPage
    },
    {
      path: '/u/warehouse/mng_tem_nvl/history_tem_nvl_new',
      permission: 'history_tem_nvl_new',
      element: HistoryTemNVLNew,
      fallback: DefaultPage
    },
    {
      path: '/erp/u/template-management/register-template',
      element: RegiTempFile,
      permission: 'register_template',
      fallback: DefaultPage
    },
    {
      path: '/wms/u/warehouse/inventory-opening/inv-open-01',
      element: SLGWHInitStock,
      permission: 'inv_open_01',
      fallback: DefaultPage
    },

    {
      path: '/u/hr_mgmt/hr_empln',
      permission: 'hr_empln',
      element: HrEmps,
      fallback: DefaultPage
    },
    {
      path: '/u/hr_mgmt/hr_emp_one',
      permission: 'hr_emp_one',
      element: HrEmpsOne,
      fallback: DefaultPage
    },
    {
      path: '/u/hr_mgmt/hr_bas_family',
      permission: 'hr_bas_family',
      element: HrBasFamily,
      fallback: DefaultPage
    },
    {
      path: '/u/hr_mgmt/hr_bas_academy',
      permission: 'hr_bas_academy',
      element: HrBasAcademy,
      fallback: DefaultPage
    },
    {
      path: '/u/hr_mgmt/hr_bas_address',
      permission: 'hr_bas_address',
      element: HrBasAddress,
      fallback: DefaultPage
    },
    {
      path: '/u/hr_mgmt/hr_bas_career',
      permission: 'hr_bas_career',
      element: HrBasCareer,
      fallback: DefaultPage
    },
    {
      path: '/u/hr_mgmt/hr_bas_lang_skill',
      permission: 'hr_bas_lang_skill',
      element: HrBasLangSkill,
      fallback: DefaultPage
    },
    {
      path: '/u/hr_mgmt/hr_bas_prz_pnl',
      permission: 'hr_bas_prz_pnl',
      element: HrBasPrzPnl,
      fallback: DefaultPage
    },
    {
      path: '/u/hr_mgmt/hr_bas_travel_rec',
      permission: 'hr_bas_travel_rec',
      element: HrBasTravelRec,
      fallback: DefaultPage
    },
    {
      path: '/u/hr_mgmt/hr_bas_org_pos',
      permission: 'hr_bas_org_pos',
      element: HrBasOrgPos,
      fallback: DefaultPage
    },
    {
      path: '/u/hr_mgmt/hr_org_job',
      permission: 'hr_org_job',
      element: HrOrgJob,
      fallback: DefaultPage
    },
    {
      path: '/u/hr_mgmt/hr_bas_union',
      permission: 'hr_bas_union',
      element: HrBasUnion,
      fallback: DefaultPage
    },
    {
      path: '/u/hr_mgmt/hr_empln_seqs',
      permission: 'hr_empln_seqs',
      element: HrEmplnSeq,
      fallback: DefaultPage
    },
    {
      path: '/',
      element: Home,
      fallback: Home,
    },
    {
      path: '/u/home',
      element: Home,
      fallback: Home,
    },
  ]

  const cancelAllRequests = () => {
    Object.values(controllers.current).forEach((controller) => {
      if (controller && controller.abort) {
        controller.abort()
      }
    })
    controllers.current = {}
  }
  const routesNoSiidebar = [
    {
      path: '/wms/u/warehouse/basic/stock-real-1-5',
      element: SctokReal5Page,
      permission: 'stock-real-1-5',
      fallback: DefaultPage
    },

    {
      path: '/wms/u/warehouse/stock-real/stock-real-1-6',
      element: StockReal6,
      permission: 'stock-real-1-6',
      fallback: DefaultPage
    },
    {
      path: '/wms/u/warehouse/stock-real/stock-real-1-6/:seq',
      element: StockReal6Seq,
      permission: 'stock-real-1-6',
      fallback: DefaultPage
    },



  ]
  return (
    <Routes>
      <Route
        path="/u/login"
        element={
          <Login
            processRolesMenu={processRolesMenu}
            setKeyLanguage={setKeyLanguage}
          />
        }
      />
      <Route
        path="/u/test"
        element={
          <Test

          />
        }
      />

      <Route
        path="*"
        element={
          <Suspense fallback={<Spinner />}>
            <LanguageProvider keyLanguage={keyLanguage}>
              <Layout className="h-[calc(100vh-30px)]">
                <Sidebar
                  permissions={userPermissions}
                  rootMenu={rootMenuItems}
                  menuTransForm={menuTransForm}
                  collapsed={collapsed}
                  setCollapsed={setCollapsed}
                />
                <Layout>
                  <Content className="bg-slate-50">
                    <Suspense fallback={<Spinner />}>
                      <BreadcrumbRouter
                        rootMenu={rootMenuItems}
                        menuTransForm={menuTransForm}
                      />
                      <Routes>
                        {routes.map(
                          ({
                            path,
                            element: Element,
                            permission,
                            public: isPublic,
                            fallback: Fallback,
                          }) => {
                            const canCreate = checkActionPermission(
                              userPermissions,
                              permission,
                              'Create',
                            )
                            const canEdit = checkActionPermission(
                              userPermissions,
                              permission,
                              'Edit',
                            )
                            const canDelete = checkActionPermission(
                              userPermissions,
                              permission,
                              'Delete',
                            )
                            const canView = checkActionPermission(
                              userPermissions,
                              permission,
                              'View',
                            )
                            return (
                              <Route
                                key={path}
                                path={path}
                                element={
                                  isPublic ? (
                                    <Element
                                      permissions={userPermissions}
                                      isMobile={isMobile}
                                      canCreate={canCreate}
                                      canEdit={canEdit}
                                      canDelete={canDelete}
                                      cancelAllRequests={cancelAllRequests}
                                      controllers={controllers}
                                      collapsed={collapsed}
                                      setCollapsed={setCollapsed}
                                    />
                                  ) : canView ? (
                                    <Element
                                      permissions={userPermissions}
                                      isMobile={isMobile}
                                      canCreate={canCreate}
                                      canEdit={canEdit}
                                      canDelete={canDelete}
                                      cancelAllRequests={cancelAllRequests}
                                      controllers={controllers}
                                      collapsed={collapsed}
                                      setCollapsed={setCollapsed}
                                    />
                                  ) : Fallback ? (
                                    <Fallback
                                      permissions={userPermissions}
                                      isMobile={isMobile}
                                      canCreate={canCreate}
                                      canEdit={canEdit}
                                      canDelete={canDelete}
                                      cancelAllRequests={cancelAllRequests}
                                      controllers={controllers}
                                      collapsed={collapsed}
                                      setCollapsed={setCollapsed}
                                    />
                                  ) : (
                                    <ErrorPage />
                                  )
                                }
                              />
                            )
                          },
                        )}
                      </Routes>
                    </Suspense>
                  </Content>
                </Layout>
              </Layout>
            </LanguageProvider>
          </Suspense>
        }
      />



      <Route
        path="/app/*"
        element={

          <Suspense fallback={<Spinner />}>
            <LanguageProvider keyLanguage={keyLanguage}>
              <Layout >

                <Layout className='border-t'>
                  <Content className="bg-slate-50">
                    <Suspense fallback={<Spinner />}>
                      <Routes>
                        {routesNoSiidebar.map(
                          ({
                            path,
                            element: Element,
                            permission,
                            public: isPublic,
                            fallback: Fallback
                          }) => {
                            const canCreate = checkActionPermission(
                              userPermissions,
                              permission,
                              'Create'
                            )
                            const canEdit = checkActionPermission(
                              userPermissions,
                              permission,
                              'Edit'
                            )
                            const canDelete = checkActionPermission(
                              userPermissions,
                              permission,
                              'Delete'
                            )
                            const canView = checkActionPermission(
                              userPermissions,
                              permission,
                              'View'
                            )
                            return (
                              <Route
                                key={path}
                                path={path}
                                element={
                                  isPublic ? (
                                    <Element
                                      permissions={userPermissions}
                                      isMobile={isMobile}
                                      canCreate={canCreate}
                                      canEdit={canEdit}
                                      canDelete={canDelete}
                                      cancelAllRequests={cancelAllRequests}
                                      controllers={controllers}
                                      menuTransForm={menuTransForm}
                                    />
                                  ) : canView ? (
                                    <Element
                                      permissions={userPermissions}
                                      isMobile={isMobile}
                                      canCreate={canCreate}
                                      canEdit={canEdit}
                                      canDelete={canDelete}
                                      cancelAllRequests={cancelAllRequests}
                                      controllers={controllers}
                                    />
                                  ) : Fallback ? (
                                    <Fallback
                                      permissions={userPermissions}
                                      isMobile={isMobile}
                                      canCreate={canCreate}
                                      canEdit={canEdit}
                                      canDelete={canDelete}
                                      cancelAllRequests={cancelAllRequests}
                                      controllers={controllers}
                                    />
                                  ) : (
                                    <ErrorPage />
                                  )
                                }
                              />
                            )
                          }
                        )}
                      </Routes>
                    </Suspense>
                  </Content>
                </Layout>
              </Layout>
            </LanguageProvider>
          </Suspense>
        }
      />
    </Routes>
  )
}
const App = () => (
  <Router>
    <UserRouter />
  </Router>
)

export default App
