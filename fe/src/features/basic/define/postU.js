import axios from 'axios'
import {
  HOST_API_SERVER_6
} from '../../../services'
import {
  ERROR_MESSAGES
} from '../../../utils/constants'
import {
  accessToken
} from '../../../services/tokenService'

export const PostUDefine = async (records) => {
  try {
    const token = await accessToken()
    if (!token) {
      return {
        success: false,
        message: 'No token found. Please log in again.'
      }
    }

    const response = await axios.post(
      `${HOST_API_SERVER_6}/basic/update-defines`,
      records, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    )

    // Kiểm tra thành công
    if (response.status === 200 || response.status === 201) {
      return {
        success: true,
        message: response.data.message || 'Operation successful',
        data: response.data
      }
    } else {
      return {
        success: false,
        message: `Unexpected status code: ${response.status}`
      }
    }
  } catch (error) {
    return {
      success: false,
      message: error.response ?
        error.response.data.message || `Error: ${error.response.status}` : 'Unable to connect to the server.',
      errorDetails: error.response ? error.response.data : error.message
    }
  }
}