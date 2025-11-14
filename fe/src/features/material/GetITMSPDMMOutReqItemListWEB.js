import axios from 'axios'
import {
  HOST_API_SERVER_1
} from '../../services'
import {
  ERROR_MESSAGES
} from '../../utils/constants'
import {
  accessToken
} from '../../services/tokenService'

export const GetITMSPDMMOutReqItemListWEB = async (outReqSeq, signal) => {
  try {
    const url = `${HOST_API_SERVER_1}/mssql/stock-out/itm-spd-mm-out-req-item-list`
    const token = accessToken()
    const response = await axios.get(url, {
      params: {
        outReqSeq,
      },
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      signal
    })

    if (response.status === 200) {
      return {
        success: true,
        data: response.data.data,
      }
    } else {
      return {
        success: false,
        message: ERROR_MESSAGES.ERROR,
      }
    }
  } catch (error) {
    return {
      success: false,
      message: error.response ?
        error.response.data.message : ERROR_MESSAGES.ERROR,
    }
  }
}