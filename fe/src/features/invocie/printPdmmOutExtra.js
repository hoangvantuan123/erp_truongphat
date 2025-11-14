import axios from 'axios';
import { HOST_API_SERVER_4 } from '../../services';
import { accessToken } from '../../services/tokenService';

export const PrintPdmmOutExtra = async (result) => {
    try {
        const token = await accessToken();
        const response = await axios.post(
            `${HOST_API_SERVER_4}/print/Print-Pdmm-Out-Extra`,
            {result},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        return { success: true, data: response.data };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Không thể kết nối tới server',
        };
    }
};
