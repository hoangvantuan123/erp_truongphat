import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet'
import { Typography, Layout, message, Form } from 'antd'
import { FilterOutlined } from '@ant-design/icons'

const { Title } = Typography
const { Header, Content } = Layout
import 'moment/locale/vi'
import BarcodePrintAction from '../../components/actions/barcodePrint/barcocePrintAction'
import TableBarcodePrint from '../../components/table/barcodePrint/tableBarcodePrint'
import { useCallback, useEffect, useRef, useState } from 'react'
import dayjs from 'dayjs'
import {
  CreatePrintLabel,
  CreatePrintLabelBySize,
  getLotCount,
  getMatIdByVendor,
  GetPageItem,
  getReelNo,
} from '../../../features/barcode/printBarcodeService'
import {
  createChangeBarcode,
  getPrinterDevice,
} from '../../../features/barcode/barcodeChangeService'
import ModalWaiting from '../../components/modal/material/modalWaiting'
import {
  BARCODE_ERR_MESSAGE,
  BARCODE_SUCCESS_MESSAGE,
  VENDOR_ERR_MESSAGE,
} from '../../../utils/constants'
import { ArrowIcon } from '../../components/icons'
import BarcodePrintQuery from '../../components/actions/barcodePrint/barcodePrintQuery'

export default function BarcodePrint({ permissions, isMobile }) {
    const [formQuery] = Form.useForm();
    const [formPreview] = Form.useForm();
    const [modal2Open, setModal2Open] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [reload, setReload] = useState(0);
    const [data, setData] = useState([]);
    const { t } = useTranslation();
    const [fromDate, setFromDate] = useState(dayjs().startOf('week'))
    const [toDate, setToDate] = useState(dayjs().endOf('week'))
    const formatDate = useCallback((date) => date.format('YYYYMMDDHHmmss'), [])

  const [gridData, setGridData] = useState([])
  const [isModalVisible, setIsModalVisible] = useState(false)

  const [selectRow, setSelectRow] = useState([])
  const [clickedRowData, setClickedRowData] = useState([])
  const [isMinusClicked, setIsMinusClicked] = useState(false)
  const [lastClickedCell, setLastClickedCell] = useState(null)

  const [optionDevices, setOptionDevices] = useState([])
  const [device, setDevice] = useState('')

  const [barcode, setBarcode] = useState('')
  const [acVendor, setAcVendor] = useState()
  const [acPartNoVendor, setAcPartNo] = useState(null)
  const [acMatId, setAcMatId] = useState('')
  const [acLotTotalCnt, setAcLotTotalCnt] = useState(0)
  const [acLotNo, setAcLotNo] = useState('')
  const [acQty, setAcQty] = useState(0)
  const [acDateCode, setAcDateCode] = useState('')
  const [acReelNo, setAcReelNo] = useState('')
  const [acUserId, setAcUserId] = useState('')
  const [acIssueNo, setAcIssueNo] = useState('')
  const [acRemark, setAcRemark] = useState('')

  const partNoRef = useRef(null)
  const matIdRef = useRef(null)
  const lotNoRef = useRef(null)
  const qtyRef = useRef(null)
  const dateCodeRef = useRef(null)
  const reelNoRef = useRef(null)
  const userIdRef = useRef(null)
  const remarkRef = useRef(null)
  const lotTotalCNTRef = useRef(null)
  const barcodeRef = useRef(null)

  const [sizeLabel, setSizeLabel] = useState({
    barCodePosX: Number(180),
    barCodePosY: Number(30),
    barCodeSizeX: Number(1),
    barCodeSizeY: Number(1),
    QrPosX: Number(700),
    QrPosY: Number(60),
    QrSizeX: Number(3.5),
    QrSizeY: Number(3.5),
    paperSizeX: Number(790),
    paperSizeY: Number(160),
  })

  const [label, setLabel] = useState(null)

  const [previewLabel, setPreviewLabel] = useState(null)

  const onFinish = async (e) => {
    setData([])
    const { fromDate, toDate, vendor, matID, lotNo } = e
    setLoading(true)
    let loadingMessage
    try {
      loadingMessage = message.loading('Please  Wait...', 0)
      const itemList = await GetPageItem(
        formatDate(fromDate),
        formatDate(toDate),
        vendor?.value || 'ALL',
        matID,
        lotNo,
      )
      setData(itemList?.data.data || [])
    } catch (error) {
      setData([])
    } finally {
      if (loadingMessage) loadingMessage()
      setLoading(false)
    }
  }

  const fetchData = async () => {
    setData([])
    setLoading(true)
    let loadingMessage
    try {
      loadingMessage = message.loading('Please  Wait...', 0)
      const itemList = await GetPageItem(
        formatDate(fromDate),
        formatDate(toDate),
      )
      setData(itemList?.data.data || [])
    } catch (error) {
      setData([])
    } finally {
      if (loadingMessage) loadingMessage()
      setLoading(false)
    }
  }

  const getMultiSelectedRows = () => {
    const selectedRows = selectRow.rows.items

    let rows = []

    selectedRows.forEach((range) => {
      const start = range[0]
      const end = range[1] - 1

      for (let i = start; i <= end; i++) {
        rows.push(data[i])
      }
    })

    return rows
  }

  const onDropDownChange = (e) => {
    const getDeviceOptions = async (body) => {
      try {
        const result = await getPrinterDevice(body)
        if (result?.result) {
          const data = result.result
          const formattedOptions = data.map((item, index) => ({
            label: item.ip,
            value: `${item.ip}:${item.port}`,
            key: index.toString(),
          }))
          setOptionDevices([...formattedOptions])
        } else {
          message.error(BARCODE_ERR_MESSAGE.NO_DATA_PRINTER)
          return
        }
      } catch (err) {
        console.error('Error creating barcode change:', err)
        message.error(BARCODE_ERR_MESSAGE.NO_DATA_PRINTER)
      }
    }

    const userInfo = localStorage.getItem('userInfo')
    const parsedData = JSON.parse(userInfo)

    if (e) {
      getDeviceOptions(parsedData.UserId)
    }
  }

  const handleOnchangeDevice = (e) => {
    if (!e) {
      setDevice('')
    } else {
      setDevice(e.value)
    }
  }

  const onChangeVendor = (e) => {
    if (e != null) {
      const vendor = e.value
      setAcVendor(e.value)
      switch (vendor) {
        case 'ABLIC':
          barcodeRef.current.focus()
          break
        case 'SMK':
          barcodeRef.current.focus()
          break
        case 'INFINEON':
          lotNoRef.current.focus()
          break
        case 'MITSUMI':
          lotNoRef.current.focus()
          break
        case 'NISSHINBO':
          barcodeRef.current.focus()
          break
        default:
          break
      }

      setAcPartNo('')
      setAcMatId('')
      setAcLotTotalCnt(0)
      setAcLotNo('')
      setAcQty('')
      setAcDateCode('')
      setAcReelNo('')
      setAcUserId('')
      setAcIssueNo('')
      setAcRemark('')
      setDevice(null)

      formQuery.setFieldsValue({
        partNo: '',
        matID: '',
        lotTotalCNT: '',
        lotNo: '',
        qty: '',
        dateCode: '',
        reelNo: '',
        device: '',
        barcode: '',
        userID: '',
        remark: '',
      })
    }
  }

  const onClearVendorValue = () => {
    setAcVendor(null)
    // resetAllState();
  }

  const onKeyDownPartNo = (e) => {
    const partNo = e.target.value
    let arrPartNo = []
    let itemCd
    let qty
    if (e.key == 'Enter') {
      if (!acVendor) {
        setModal2Open(true)
        setError(BARCODE_ERR_MESSAGE.VENDOR_NOT_SELECT)
        resetAllState()
        return
      }
      if (acVendor == 'PANASONIC') {
        arrPartNo = partNo.split(' ')
        if (arrPartNo.length == 2) {
          itemCd = arrPartNo[0].slice(3)
          qty = arrPartNo[1]
        } else {
          setModal2Open(true)
          setError(VENDOR_ERR_MESSAGE.PANASONIC_NOT_FIT)
          return
        }
      }
      if (acVendor == 'ALPHA OMEGA') {
        if (partNo.length == 9 || partNo.length == 10) {
          itemCd = getValueMatId(partNo)
        } else {
          setModal2Open(true)
          setError(VENDOR_ERR_MESSAGE.ALPHA_OMEGA_NOT_FIT)
          return
        }
      }
      setAcMatId(itemCd)
      setAcQty(qty)
      matIdRef.current.focus()
    }
  }

  const getValueMatId = async (partNo) => {
    const payLoad = {
      plant: 'ITMVPSG',
      partNo: partNo,
    }

    try {
      return await getMatIdByVendor(payLoad)
    } catch (e) {
      message.error(e)
    }
  }

  const onKeyDownMatId = (e) => {
    if (e.key === 'Enter') {
      const matId = e.target.value
      setAcMatId(matId)
      formQuery.setFieldsValue({ matID: matId })
      lotTotalCNTRef.current.focus()
    }
  }

  const onKeyDownLotTotalCnt = (e) => {
    if (e.key === 'Enter') {
      const lotNoTotalCnt = e.target.value
      setAcLotTotalCnt(lotNoTotalCnt)
      formQuery.setFieldsValue({ lotTotalCNT: lotNoTotalCnt })
      lotNoRef.current.focus()
    }
  }

  const onKeyDownLotNo = useCallback(
    async (e) => {
      const setAcValue = (
        partNo,
        matId,
        lotNoSplit,
        qty,
        dateCode,
        reelNo,
        lotTotalQty,
      ) => {
        setAcPartNo(partNo)
        setAcMatId(matId.data)
        setAcLotNo(lotNoSplit)
        setAcQty(qty)
        setAcDateCode(dateCode)
        setAcReelNo(reelNo)
        setAcLotTotalCnt(lotTotalQty.LotCount)
      }

      if (e.key == 'Enter') {
        const lotNo = e.target.value
        let arrLotNo = []
        let lotNoSplit = ''
        let reelNo = ''
        let lotTotalQty = 0
        let matId = ''
        let qty = ''
        let dateCode = ''
        let partNo = ''

        if (!acVendor) {
          setModal2Open(true)
          setError(BARCODE_ERR_MESSAGE.VENDOR_NOT_SELECT)
          resetAllState()
          return
        }
        if (acVendor == 'PANASONIC') {
          arrLotNo = lotNo.split(' ')
          if (arrLotNo.length == 3) {
            lotNoSplit = arrLotNo[1]
            reelNo = getValueReelNoByLotNo(lotNoSplit)
            lotTotalQty = getLotCount(lotNoSplit)

            setAcValue(
              partNo,
              matId,
              lotNoSplit,
              qty,
              dateCode,
              reelNo,
              lotTotalQty,
            )
            formQuery.setFieldsValue({
              partNo: partNo,
              matID: matId?.data || '',
              lotTotalCNT: lotTotalQty?.LotCount || 0,
              lotNo: lotNoSplit,
              qty: qty,
              dateCode: dateCode,
              reelNo: reelNo,
            })
          } else {
            setModal2Open(true)
            setError(VENDOR_ERR_MESSAGE.PANASONIC_NOT_FIT)
            resetAllState()
            return
          }
        }
        if (acVendor == 'ALPHA OMEGA') {
          const lengthLotNo = Number(lotNo.split('.').length - 1)
          if (lengthLotNo == 1) {
            reelNo = getValueReelNoByLotNo(lotNo)
            lotTotalQty = getLotCountByLotNo(lotNo)

            setAcValue(
              partNo,
              matId,
              lotNoSplit,
              qty,
              dateCode,
              reelNo,
              lotTotalQty,
            )
            formQuery.setFieldsValue({
              partNo: partNo,
              matID: matId?.data || '',
              lotTotalCNT: lotTotalQty?.LotCount || 0,
              lotNo: lotNoSplit,
              qty: qty,
              dateCode: dateCode,
              reelNo: reelNo,
            })
          } else {
            setModal2Open(true)
            setError(VENDOR_ERR_MESSAGE.ALPHA_OMEGA_NOT_FIT)
            resetAllState()
            return
          }
        }
        if (acVendor == 'TEXAS INSTRUMENT') {
          const lengthLotNo = Number(lotNo.split('/').length - 1)
          if (lengthLotNo == 4) {
            const arrLotNo = lotNo.split('/')
            matId = arrLotNo[0]
            lotNoSplit = arrLotNo[4]
            qty = arrLotNo[2]
            dateCode = arrLotNo[3]
            reelNo = getValueReelNoByLotNo(lotNo)
            lotTotalQty = await getLotCountByLotNo(lotNo)

            setAcValue(
              partNo,
              matId,
              lotNoSplit,
              qty,
              dateCode,
              reelNo,
              lotTotalQty,
            )
            formQuery.setFieldsValue({
              partNo: partNo,
              matID: matId?.data || '',
              lotTotalCNT: lotTotalQty?.LotCount || 0,
              lotNo: lotNoSplit,
              qty: qty,
              dateCode: dateCode,
              reelNo: reelNo,
            })
          } else {
            setModal2Open(true)
            setError(VENDOR_ERR_MESSAGE.TEXAS_INSTRUMENT_NOT_FIT)
            resetAllState()
            return
          }
        }
        if (acVendor === 'INFINEON') {
          lotNoSplit = lotNo.slice(2)
          lotTotalQty = await getLotCountByLotNo(lotNoSplit)
          setAcLotNo(lotNoSplit)
          setAcLotTotalCnt(lotTotalQty.LotCount)

          formQuery.setFieldsValue({
            partNo: partNo,
            matID: matId?.data || '',
            lotTotalCNT: lotTotalQty?.LotCount || 0,
            lotNo: lotNoSplit,
            qty: qty,
            dateCode: dateCode,
            reelNo: reelNo,
          })
        }
        if (acVendor == 'NEXPERIA') {
          lotNoSplit = lotNo.replace('1T', '')
          lotTotalQty = await getLotCountByLotNo(lotNoSplit)

          setAcValue(
            partNo,
            matId,
            lotNoSplit,
            qty,
            dateCode,
            reelNo,
            lotTotalQty,
          )
          formQuery.setFieldsValue({
            partNo: partNo,
            matID: matId?.data || '',
            lotTotalCNT: lotTotalQty?.LotCount || 0,
            lotNo: lotNoSplit,
            qty: qty,
            dateCode: dateCode,
            reelNo: reelNo,
          })
        }
        if (acVendor == 'ABLIC') {
          const lengthLotNo = lotNo.split('$').length - 1
          if (lengthLotNo === 6) {
            const arrLotNo = lotNo.split('$')
            partNo = arrLotNo[1]
            matId = await getValueMatId(partNo)
            lotNoSplit = arrLotNo[3]
            dateCode = arrLotNo[5]
            qty = arrLotNo[2]
            reelNo = arrLotNo[6].trimEnd().slice(-4)
            lotTotalQty = await getLotCountByLotNo(lotNoSplit)

            setAcValue(
              partNo,
              matId,
              lotNoSplit,
              qty,
              dateCode,
              reelNo,
              lotTotalQty,
            )
            formQuery.setFieldsValue({
              partNo: partNo,
              matID: matId?.data || '',
              lotTotalCNT: lotTotalQty?.LotCount || 0,
              lotNo: lotNoSplit,
              qty: qty,
              dateCode: dateCode,
              reelNo: reelNo,
            })

            qtyRef.current.focus()
          } else {
            setModal2Open(true)
            setError(VENDOR_ERR_MESSAGE.ABLIC_NOT_FIT)
            return
          }
        }
        if (acVendor == 'SMK') {
          const lengthLotNo = Number(lotNo.split(',').length - 1)
          if (lengthLotNo == 5) {
            const arrLotNo = lotNo.split(',')
            partNo = arrLotNo[2].slice(1)
            matId = await getValueMatId(partNo)
            lotNoSplit = arrLotNo[4].slice(1)
            qty = arrLotNo[1].slice(1)
            dateCode = arrLotNo[3].slice(1)
            reelNo = arrLotNo[5].slice(2)
            lotTotalQty = await getLotCountByLotNo(lotNoSplit)

            setAcValue(
              partNo,
              matId,
              lotNoSplit,
              qty,
              dateCode,
              reelNo,
              lotTotalQty,
            )
            formQuery.setFieldsValue({
              partNo: partNo,
              matID: matId?.data || '',
              lotTotalCNT: lotTotalQty?.LotCount || 0,
              lotNo: lotNoSplit,
              qty: qty,
              dateCode: dateCode,
              reelNo: reelNo,
            })

            userIdRef.current.focus()
            return
          } else {
            setModal2Open(true)
            setError(VENDOR_ERR_MESSAGE.SMK_NOT_FIT)
            return
          }
        }
        if (acVendor == 'NISSHINBO') {
          const lengthLotNo = Number(lotNo.split(',').length - 1)
          if (lengthLotNo == 4) {
            const arrLotNo = lotNo.split(',')
            partNo = arrLotNo[0]
            matId = await getValueMatId(partNo)
            lotNoSplit = arrLotNo[4]
            qty = arrLotNo[1]
            dateCode = arrLotNo[3].substring(0, 4)
            reelNo = await getValueReelNoByLotNo(lotNoSplit)
            lotTotalQty = await getLotCountByLotNo(lotNoSplit)

            setAcValue(
              partNo,
              matId,
              lotNoSplit,
              qty,
              dateCode,
              reelNo,
              lotTotalQty,
            )
            formQuery.setFieldsValue({
              partNo: partNo,
              matID: matId?.data || '',
              lotTotalCNT: lotTotalQty?.LotCount || 0,
              lotNo: lotNoSplit,
              qty: qty,
              dateCode: dateCode,
              reelNo: reelNo,
            })
          } else {
            setModal2Open(true)
            setError(VENDOR_ERR_MESSAGE.NISSHINBO_NOT_FIT)
            resetAllState()
            return
          }
        }

        qtyRef.current.focus()
      }
    },
    [
      acVendor,
      acPartNoVendor,
      acMatId,
      acLotTotalCnt,
      acLotNo,
      acQty,
      acDateCode,
      acReelNo,
      acUserId,
      acIssueNo,
      acRemark,
      formQuery,
    ],
  )

  const getValueReelNoByLotNo = async (lotNoSplit) => {
    const payLoad = {
      plant: 'ITMVPSG',
      lotNo: lotNoSplit,
    }

    try {
      return await getReelNo(payLoad)
    } catch (e) {
      message.error(e)
    }
  }

  const getLotCountByLotNo = async (lotNo) => {
    const payLoad = {
      plant: 'ITMVPSG',
      lotNo: lotNo,
    }

    try {
      return await getLotCount(payLoad)
    } catch (e) {
      message.error(e)
    }
  }

  const onKeyDownQty = useCallback(
    async (e) => {
      const iQtyValue = e.target.value
      let qty = 0
      if (e.key == 'Enter') {
        if (!acVendor) {
          setModal2Open(true)
          setError(BARCODE_ERR_MESSAGE.VENDOR_NOT_SELECT)
          return
        }

        switch (acVendor) {
          case 'PANASONIC' || 'ALPHA OMEGA':
            if (!iQtyValue) {
              setModal2Open(true)
              setError(' Not a number. Please enter a number.')
            }
          case 'INFINEON':
            if (iQtyValue) {
              qty = iQtyValue.replace('Q', '')
              setAcQty(qty)
            }
          case 'NEXPERIA':
            if (iQtyValue) {
              qty = iQtyValue.slice(1)
            }
        }
        if (qty == 0) {
          qty = iQtyValue
        }
        dateCodeRef.current.focus()
        setAcQty(qty)
        formQuery.setFieldsValue({ qty: qty })
      }
    },
    [
      acVendor,
      acPartNoVendor,
      acMatId,
      acLotTotalCnt,
      acLotNo,
      acQty,
      acDateCode,
      acReelNo,
      acUserId,
      acIssueNo,
      acRemark,
      formQuery,
    ],
  )

  const onKeyDownDateCode = (e) => {
    if (e.key == 'Enter') {
      let dateCode = ''
      const iDateCodeValue = e.target.value

      if (!acVendor) {
        setModal2Open(true)
        setError(BARCODE_ERR_MESSAGE.VENDOR_NOT_SELECT)
        return
      }

      if (acVendor == 'INFINEON') {
        if (iDateCodeValue) {
          dateCode = iDateCodeValue.slice(2)
        }
      }
      if (acVendor == 'NEXPERIA') {
        if (iQtyValue) {
          dateCode = iDateCodeValue.replace('9D', '')
        }
      }
      if (dateCode == '') {
        dateCode = iDateCodeValue
      }
      setAcDateCode(dateCode)
      formQuery.setFieldsValue({ dateCode: dateCode })
      reelNoRef.current.focus()
    }
  }

  const onKeyDownReelNo = (e) => {
    if (e.key == 'Enter') {
      let reelNo = ''
      const iReelNoValue = e.target.value

      if (!acVendor) {
        setModal2Open(true)
        setError(BARCODE_ERR_MESSAGE.VENDOR_NOT_SELECT)
        return
      }

      if (acVendor == 'INFINEON') {
        if (iReelNoValue) {
          reelNo = iReelNoValue.replace('\u001e', '').trimEnd().slice(-5)
        }
      }
      if (acVendor == 'MITSUMI') {
        if (iReelNoValue) {
          reelNo = iReelNoValue.replace('  ', '')
        }
      }
      if (reelNo === '') {
        reelNo = iReelNoValue
      }
      setAcReelNo(reelNo)
      formQuery.setFieldsValue({ reelNo: reelNo })
      userIdRef.current.focus()
    }
  }

  const onKeyDownUserId = (e) => {
    if (e.key === 'Enter') {
      const iUserId = e.target.value
      setAcUserId(iUserId)
      formQuery.setFieldsValue({ userID: iUserId })
      remarkRef.current.focus()
    }
  }

  const onChangeUserId = (e) => {
    const iUserId = e.target.value
    setAcUserId(iUserId)
  }

  const onKeyDownRemark = (e) => {
    const iRemark = e.target.value
    if (acRemark != null) {
      setAcRemark(iRemark)
    }
  }

  const onChangeRemark = (e) => {
    const iRemark = e.target.value
    setAcRemark(iRemark)
  }

  const onKeyDownBarcode = useCallback(
    async (e) => {
      const setAcValue = (
        partNo,
        matId,
        lotNoSplit,
        qty,
        dateCode,
        reelNo,
        lotTotalQty,
      ) => {
        setAcPartNo(partNo)
        setAcMatId(matId.data)
        setAcLotNo(lotNoSplit)
        setAcQty(qty)
        setAcDateCode(dateCode)
        setAcReelNo(reelNo)
        setAcLotTotalCnt(lotTotalQty.LotCount)
      }

      if (e.key == 'Enter') {
        const lotNo = e.target.value
        let arrLotNo = []
        let lotNoSplit = ''
        let reelNo = ''
        let lotTotalQty = 0
        let matId = ''
        let qty = ''
        let dateCode = ''
        let partNo = ''

        if (!acVendor) {
          setModal2Open(true)
          setError(BARCODE_ERR_MESSAGE.VENDOR_NOT_SELECT)
          resetAllState()
          return
        }

        if (acVendor == 'ABLIC') {
          const lengthLotNo = lotNo.split('$').length - 1
          if (lengthLotNo === 6) {
            const arrLotNo = lotNo.split('$')
            partNo = arrLotNo[1]
            matId = await getValueMatId(partNo)
            lotNoSplit = arrLotNo[3]
            dateCode = arrLotNo[5]
            qty = arrLotNo[2]
            reelNo = arrLotNo[6].trimEnd().slice(-4)
            lotTotalQty = await getLotCountByLotNo(lotNoSplit)

            setAcValue(
              partNo,
              matId,
              lotNoSplit,
              qty,
              dateCode,
              reelNo,
              lotTotalQty,
            )
            formQuery.setFieldsValue({
              partNo: partNo,
              matID: matId?.data || '',
              lotTotalCNT: lotTotalQty?.LotCount || 0,
              lotNo: lotNoSplit,
              qty: qty,
              dateCode: dateCode,
              reelNo: reelNo,
            })

            qtyRef.current.focus()
          } else {
            setModal2Open(true)
            setError(VENDOR_ERR_MESSAGE.ABLIC_NOT_FIT)
            return
          }
        }
        if (acVendor == 'SMK') {
          const lengthLotNo = Number(lotNo.split(',').length - 1)
          if (lengthLotNo == 5) {
            const arrLotNo = lotNo.split(',')
            partNo = arrLotNo[2].slice(1)
            matId = await getValueMatId(partNo)
            lotNoSplit = arrLotNo[4].slice(1)
            qty = arrLotNo[1].slice(1)
            dateCode = arrLotNo[3].slice(1)
            reelNo = arrLotNo[5].slice(2)
            lotTotalQty = await getLotCountByLotNo(lotNoSplit)

            setAcValue(
              partNo,
              matId,
              lotNoSplit,
              qty,
              dateCode,
              reelNo,
              lotTotalQty,
            )
            formQuery.setFieldsValue({
              partNo: partNo,
              matID: matId?.data || '',
              lotTotalCNT: lotTotalQty?.LotCount || 0,
              lotNo: lotNoSplit,
              qty: qty,
              dateCode: dateCode,
              reelNo: reelNo,
              barcode: '',
            })

            userIdRef.current.focus()
            return
          } else {
            setModal2Open(true)
            setError(VENDOR_ERR_MESSAGE.SMK_NOT_FIT)
            return
          }
        }
        if (acVendor == 'NISSHINBO') {
          const lengthLotNo = Number(lotNo.split(',').length - 1)
          if (lengthLotNo == 4) {
            const arrLotNo = lotNo.split(',')
            partNo = arrLotNo[0]
            matId = await getValueMatId(partNo)
            lotNoSplit = arrLotNo[4]
            qty = arrLotNo[1]
            dateCode = arrLotNo[3].substring(0, 4)
            reelNo = await getValueReelNoByLotNo(lotNoSplit)
            lotTotalQty = await getLotCountByLotNo(lotNoSplit)

            setAcValue(
              partNo,
              matId,
              lotNoSplit,
              qty,
              dateCode,
              reelNo,
              lotTotalQty,
            )
            formQuery.setFieldsValue({
              partNo: partNo,
              matID: matId?.data || '',
              lotTotalCNT: lotTotalQty?.LotCount || 0,
              lotNo: lotNoSplit,
              qty: qty,
              dateCode: dateCode,
              reelNo: reelNo,
            })
          } else {
            setModal2Open(true)
            setError(VENDOR_ERR_MESSAGE.NISSHINBO_NOT_FIT)
            resetAllState()
            return
          }
        }

        userIdRef.current.focus()
        formQuery.setFieldsValue({ barcode: '' })
      }
    },
    [
      acVendor,
      acPartNoVendor,
      acMatId,
      acLotTotalCnt,
      acLotNo,
      acQty,
      acDateCode,
      acReelNo,
      acUserId,
      acIssueNo,
      acRemark,
      formQuery,
    ],
  )

  const onClickPrint = useCallback(async () => {
    const createPayload = (isMulti, rows, device, labelsize) => ({
      isMulti,
      listSelected: rows,
      device,
      labelsize,
    })

    const singleRow = {
      VENDOR: acVendor,
      PARTNO: acPartNoVendor,
      ITEMCD: acMatId,
      LOTNOCNT: acLotTotalCnt,
      LOTNO: acLotNo,
      QTY: acQty,
      REELNO: acReelNo,
      USER_ID: acUserId,
      ISSUENO: acIssueNo,
      REMARK: acRemark,
      DATECODE: acDateCode,
      LOT_ID:
        acMatId +
        '/' +
        acLotNo +
        '/' +
        acQty +
        '/' +
        acDateCode +
        '/' +
        acReelNo,
    }
    let payLoad
    const multi = getMultiSelectedRows()

    if (multi && multi.length >= 1) {
      payLoad = createPayload(true, multi, device)
    } else {
      payLoad = createPayload(false, [singleRow], device)
    }

            try {
                const result = await CreatePrintLabel(
                    payLoad
                );
                if (result.result.status) {
                    setModal2Open(true);
                    setError(BARCODE_SUCCESS_MESSAGE.PRINTER_SUCCESS);
                    resetAllState();
                    setReload((pre) => pre + 1);
                }
                else {
                    setModal2Open(true);
                    setError(result.result.message);
                }

            } catch (error) {

            }

        }, [getMultiSelectedRows]
    )

  const onClickCancel = () => {
    setIsModalVisible(false)
  }

  const onFinishPreview = (e) => {
    setIsModalVisible(true)

    const {
      barcodePosX,
      barcodePosY,
      barcodeSizeX,
      barcodeSizeY,
      qrcodePosX,
      qrcodePosY,
      qrcodeSizeX,
      qrcodeSizeY,
    } = e

    setSizeLabel({
      barCodePosX: Number(barcodePosX) || 180,
      barCodePosY: Number(barcodePosY) || 30,
      barCodeSizeX: Number(barcodeSizeX) || 1,
      barCodeSizeY: Number(barcodeSizeY) || 1,
      QrPosX: Number(qrcodePosX) || 700,
      QrPosY: Number(qrcodePosY) || 60,
      QrSizeX: Number(qrcodeSizeX) || 3.5,
      QrSizeY: Number(qrcodeSizeY) || 3.5,
      paperSizeX: sizeLabel.paperSizeX || 790,
      paperSizeY: sizeLabel.paperSizeY || 160,
    })
  }

  const resetAllState = () => {
    setAcVendor('')
    setAcPartNo('')
    setAcMatId('')
    setAcLotTotalCnt(0)
    setAcLotNo('')
    setAcQty('')
    setAcDateCode('')
    setAcReelNo('')
    setAcUserId('')
    setAcIssueNo('')
    setAcRemark('')
    setDevice('')

    formQuery.resetFields()
    formPreview.resetFields()
  }

  const onClickReset = () => {
    resetAllState()
  }

    useEffect((e) => {

        resetAllState();
        fetchData();

    }, [reload])


  const onCellClicked = (cell) => {
    const [colIndex, rowIndex] = cell

    if (colIndex !== -1 && rowIndex === undefined) {
      return
    }

    if (colIndex === -1) {
      setIsMinusClicked(true)
    } else {
      setIsMinusClicked(false)
    }

    if (
      lastClickedCell &&
      lastClickedCell[0] === colIndex &&
      lastClickedCell[1] === rowIndex
    ) {
      setLastClickedCell(null)
      setClickedRowData(null)
      return
    }

    setLastClickedCell(cell)

    if (rowIndex >= 0 && rowIndex < gridData.length) {
      const rowData = gridData[rowIndex]
      setPreviewLabel({
        DATECODE: rowData?.DATECODE,
        DATETIME: rowData?.DATETIME,
        ITEMCD: rowData?.ITEMCD,
        LOTNO: rowData?.LOTNO,
        LOT_ID: rowData?.LOT_ID,
        PLANT: rowData?.PLANT,
        QTY: rowData?.QTY,
        REELNO: rowData?.REELNO,
        TRAN_CODE: rowData?.TRAN_CODE,
        TRAN_SEQ: rowData?.TRAN_SEQ,
        TRAN_TYPE: rowData?.TRAN_TYPE,
        USER_ID: rowData?.USER_ID,
        VENDOR: rowData?.VENDOR,
      })

      setLabel(rowData)
    }
  }

  const onClickOk = useCallback(async () => {
    const createPayload = (isMulti, rows, device, labelsize) => ({
      isMulti,
      listSelected: rows,
      device,
      labelsize: labelsize,
    })

    const singleRow = {
      VENDOR: label?.VENDOR,
      PARTNO: null,
      ITEMCD: label?.ITEMCD,
      LOTNOCNT: null,
      LOTNO: label?.LOTNO,
      QTY: label?.QTY,
      REELNO: label?.REELNO,
      USER_ID: label?.USER_ID,
      ISSUENO: null,
      REMARK: null,
      DATECODE: label?.DATECODE,
      LOT_ID:
        label?.ITEMCD +
        '/' +
        label?.LOTNO +
        '/' +
        label?.QTY +
        '/' +
        label?.DATECODE +
        '/' +
        label?.REELNO,
    }
    const payLoad = createPayload(true, [singleRow], device, sizeLabel)

    try {
      const result = await CreatePrintLabelBySize(payLoad)
      if (result.result.status) {
        setModal2Open(true)
        setError(BARCODE_SUCCESS_MESSAGE.PRINTER_SUCCESS)
        resetAllState()
      } else {
        setModal2Open(true)
        setError(result.result.message)
      }
    } catch (error) {}
  }, [label, sizeLabel, device])

  return (
    <Layout className="h-screen bg-slate-50">
      <Helmet>
        <title>ITM - {t('PRINT BARCODE')}</title>
      </Helmet>

      <div className="flex flex-col h-full ">
        <Header className="bg-slate-50 px-4 h-auto flex-shrink-0">
          <Title level={5} className="mt-2 uppercase">
            {t('PRINT BARCODE')}
          </Title>

          <summary className="flex cursor-pointer items-center justify-between gap-1.5 text-gray-900">
            <h2 className="text-xs font-medium flex items-center gap-2 text-blue-600 uppercase">
              <FilterOutlined />
              {t('Điều kiện truy vấn')}
            </h2>
          </summary>

          <BarcodePrintAction
            fromDate={fromDate}
            toDate={toDate}
            onFinish={onFinish}
            onClickPrint={onClickPrint}
          />
          <details
            className="group p-2 [&_summary::-webkit-details-marker]:hidden border rounded-lg bg-white"
            open
          >
            <summary className="flex cursor-pointer items-center justify-between gap-1.5 text-gray-900">
              <h2 className="text-xs font-medium flex items-center gap-2 text-blue-600 uppercase">
                <FilterOutlined />
                {t('Thông tin chi tiết')}
              </h2>
              <span className="relative size-5 shrink-0">
                <ArrowIcon />
              </span>
            </summary>
            <BarcodePrintQuery
              formQuery={formQuery}
              onClickPrint={onClickPrint}
              isModalVisible={isModalVisible}
              onClickCancel={onClickCancel}
              onDropDownChange={onDropDownChange}
              optionDevices={optionDevices}
              handleOnchangeDevice={handleOnchangeDevice}
              onChangeVendor={onChangeVendor}
              onClearVendorValue={onClearVendorValue}
              onKeyDownPartNo={onKeyDownPartNo}
              onKeyDownMatId={onKeyDownMatId}
              onKeyDownLotTotalCnt={onKeyDownLotTotalCnt}
              onKeyDownLotNo={onKeyDownLotNo}
              onKeyDownQty={onKeyDownQty}
              onKeyDownDateCode={onKeyDownDateCode}
              onKeyDownReelNo={onKeyDownReelNo}
              onKeyDownUserId={onKeyDownUserId}
              onChangeUserId={onChangeUserId}
              onKeyDownRemark={onKeyDownRemark}
              onChangeRemark={onChangeRemark}
              onKeyDownBarcode={onKeyDownBarcode}
              partNoRef={partNoRef}
              matIdRef={matIdRef}
              lotNoRef={lotNoRef}
              qtyRef={qtyRef}
              dateCodeRef={dateCodeRef}
              reelNoRef={reelNoRef}
              userIdRef={userIdRef}
              remarkRef={remarkRef}
              lotTotalCNTRef={lotTotalCNTRef}
              barcodeRef={barcodeRef}
              formPreview={formPreview}
              onFinishPreview={onFinishPreview}
              sizeLabel={sizeLabel}
              setPreviewLabel={setPreviewLabel}
              previewLabel={previewLabel}
              label={label}
              onClickOk={onClickOk}
              onClickReset={onClickReset}
            />
          </details>
        </Header>

        <Content className="flex-grow px-4  bg-slate-50">
          <div className="h-full flex flex-col">
            <div className="flex-grow">
              <TableBarcodePrint
                data={data}
                setGridData={setGridData}
                gridData={gridData}
                loading={loading}
                setSelectRow={setSelectRow}
                onCellClicked={onCellClicked}
              />

              <ModalWaiting
                modal2Open={modal2Open}
                setModal2Open={setModal2Open}
                error={error}
              />
            </div>
          </div>
        </Content>
      </div>
    </Layout>
  )
}
