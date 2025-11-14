import {
  HOST_API_SERVER_2
} from '../../services';
import axios from 'axios';

export const ChangePassword = async (employeeId, oldPassword, newPassword) => {
  try {
    const response = await axios.post(
      `${HOST_API_SERVER_2}/acc/p2/change-password`, {
        employeeId,
        oldPassword,
        newPassword,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    console.log('response', response);
    if ((response.status === 201 || response.status === 200) && response.data.success === true) {
      return response.data;
    }
  } catch (error) {
    return {
      success: false,
      message: error.response ? error.response.data.message : 'Có lỗi xảy ra',
    };
  }
};