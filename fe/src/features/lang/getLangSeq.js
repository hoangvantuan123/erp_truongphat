import axios from 'axios'
import { HOST_API_SERVER_2 } from '../../services'
import { ERROR_MESSAGES } from '../../utils/constants'

export const GetLangSeq = async (languageSeq,signal) => {
  try {
    const url = `${HOST_API_SERVER_2}/language`

    const response = await axios.get(url, {
      params: {
        languageSeq,
      },
      headers: {
        'Content-Type': 'application/json',
      },signal
    })

    if (response.status === 200) {
      return {
        success: true,
        data: response.data,
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
      message: error.response
        ? error.response.data.message
        : ERROR_MESSAGES.ERROR,
    }
  }
}
