
import axios from 'axios';
import { ERROR_MESSAGES } from '../../../utils/constants';
import { HOST_API_SERVER_2 } from '../../../services';
import { accessToken } from '../../../services/tokenService';

export const RoleGroupU = async (result) => {
  try {
    const token = await accessToken();
    const response = await axios.post(
      `${HOST_API_SERVER_2}/role/RoleGroupU`,
      { result },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const { data } = response;
    const { success, message, errors } = data;

    if (success) {
      return {
        success: true,
        data: JSON.parse(data.data),
      };
    }

    return {
      success: false,
      message: message || ERROR_MESSAGES.ERROR,
      errors: Array.isArray(errors) ? errors : [errors || 'Unknown error'],
    };

  } catch (error) {
    return {
      success: false,
      message: error?.response?.data?.message || ERROR_MESSAGES.ERROR,
      errors: [error?.message || 'Unexpected error occurred'],
    };
  }
};
