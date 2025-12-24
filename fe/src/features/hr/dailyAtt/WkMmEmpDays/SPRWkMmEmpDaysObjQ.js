import axios from 'axios';
import { HOST_API_SERVER_12 } from '../../../../services';
import { ERROR_MESSAGES } from '../../../../utils/constants';
import { accessToken } from '../../../../services/tokenService';

export const SPRWkMmEmpDaysObjQ = async (result) => {
    try {
        const token = await accessToken();
        const response = await axios.post(
            `${HOST_API_SERVER_12}/hr/SPRWkMmEmpDaysObjQ`,
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

        return {
            success: false,
            message: message,
            data: JSON.parse(data.data || '[]'),
            errors: Array.isArray(errors) ? errors : [], // dùng trực tiếp object/array từ server
        };

    } catch (error) {
        return {
            success: false,
            message: error?.message || ERROR_MESSAGES.ERROR,
            errors: [error?.message || 'Unexpected error occurred'],
        };
    }
};
