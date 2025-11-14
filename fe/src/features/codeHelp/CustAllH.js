
import axios from 'axios';
import { ERROR_MESSAGES } from '../../utils/constants';
import { accessToken } from '../../services/tokenService';
import { HOST_API_SERVER_1 } from '../../services';

export const CustAllH = async (result, signal) => {
    try {
        const token = await accessToken();
        const response = await axios.post(
            `${HOST_API_SERVER_1}/help/CustAllH`,
            { result },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            }, signal
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
