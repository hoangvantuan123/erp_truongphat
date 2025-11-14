import axios from 'axios';
import {
  HOST_API_SERVER_7
} from '../../services';
import {
  ERROR_MESSAGES
} from '../../utils/constants';
import {
  accessToken
} from '../../services/tokenService'

export const PostDInvoice = async (FormCode) => {
  try {
    const token = await accessToken()
    const response = await axios.delete(
      `${HOST_API_SERVER_7}/invoice/delete-invoice-form-code`, {
        data: {
          FormCode
        },
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    )

    if (response.status === 200 || response.status === 201) {
      return {
        success: true,
        data: response.data,
      };
    } else {
      return {
        success: false,
        message: response.data.message || ERROR_MESSAGES.ERROR_DATA,
      };
    }
  } catch (error) {
    return {
      success: false,
      message: error.response ?
        error.response.data.message : ERROR_MESSAGES.ERROR,
    };
  }
};