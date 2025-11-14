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

export const PostDFilesItems = async (ids) => {
  try {
    const token = await accessToken()
    const response = await axios.delete(
      `${HOST_API_SERVER_4}/delete-data-file-item-seq`,
      {
        data: { ids },
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