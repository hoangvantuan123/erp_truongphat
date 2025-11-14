import axios from 'axios';
import {
  HOST_API_SERVER_8
} from '../../services';
import {
  accessToken
} from '../../services/tokenService';

export const getQInvoiceSeq = async (formCode,signal) => {
  try {
    const token = await accessToken()
    const response = await axios.get(`${HOST_API_SERVER_8}/invoice/invoice-form-code`, {
      params: {
        formCode
      },
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },signal
    })

    return {
      success: true,
      data: response.data
    }
  } catch (error) {
    return {
      success: false,
      message: error.response ?
        error.response.data.message || 'Có lỗi xảy ra' : 'Không thể kết nối tới server'
    }
  }
}