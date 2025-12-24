import axios from 'axios';
import { HOST_API_SERVER_12 } from '../../../../services';
import { ERROR_MESSAGES } from '../../../../utils/constants';
import { accessToken } from '../../../../services/tokenService';

export const SPRWkEmpDdAUD = async (result) => {
  try {
    const token = await accessToken();
    const response = await axios.post(
      `${HOST_API_SERVER_12}/hr/SPRWkEmpDdAUD`,
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
        data: JSON.parse(data.data || '[]'),
      };
    }

    let parsedMessage = data.message;
    let parsedErrors = data.errors;

    try {
      parsedMessage = JSON.parse(data.message);
    } catch (_) {}

    try {
      parsedErrors = JSON.parse(data.errors);
    } catch (_) {}

    return {
      success: false,
      message: parsedMessage,
      data: JSON.parse(data.data || '[]'),
      errors: parsedErrors,
    };

  } catch (error) {
    return {
      success: false,
      message: error?.response?.data?.message || ERROR_MESSAGES.ERROR,
      errors: [error?.message || 'Unexpected error occurred'],
    };
  }
};
