import axios from 'axios';
import { HOST_API_SERVER_4 } from '../../services';
import { accessToken } from '../../services/tokenService';

export const PostDocs = async (formData, id) => {
  try {
    const token = await accessToken();

    const response = await axios.post(
      `${HOST_API_SERVER_4}/uploads/user/documents-asset/${id}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          // KHÔNG set 'Content-Type', axios sẽ tự set đúng boundary
        },
      }
    );

    const { data } = response;
    const { success, message, errors } = data;

    if (success) {
      return {
        success: true,
        data: data.data,
      };
    }

    return {
      success: false,
      message: message || 'Có lỗi xảy ra.',
    };
  } catch (error) {
    return {
      success: false,
      message: error?.response?.data?.message || 'Có lỗi xảy ra.',
      errors: [error?.message || 'Unexpected error occurred'],
    };
  }
};
