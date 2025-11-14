import axios from 'axios'
import {
  ERROR_MESSAGES
} from '../../utils/constants'
import {
  accessToken
} from '../../services/tokenService'
import {
  HOST_API_SERVER_6
} from '../../services'
export const getHelpDefineItem = async (groupSeq,signal) => {
  try {
    const token = await accessToken()
    const response = await axios.get(`${HOST_API_SERVER_6}/basic/help-query-define-item`, {
      params: {
        groupSeq
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
        error.response.data.message || 'Có lỗi xảy ra' :
        'Không thể kết nối tới server'
    }
  }
}