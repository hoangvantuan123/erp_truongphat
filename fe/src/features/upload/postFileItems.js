import axios from 'axios';
import {
  HOST_API_SERVER_4
} from '../../services';
import {
  ERROR_MESSAGES
} from '../../utils/constants';
import {
  accessToken
} from '../../services/tokenService'

/**
 * Hàm tải tệp lên server
 * @param {FormData} formData - Dữ liệu tệp cần tải
 * @returns {Promise<{ success: boolean, data?: any, message?: string }>}
 */
export const uploadFilesItems = async (formData) => {
  try {
    const token = await accessToken()
    const response = await axios.post(
      `${HOST_API_SERVER_4}/file/file-items-seq`,
      formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      },
    );

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