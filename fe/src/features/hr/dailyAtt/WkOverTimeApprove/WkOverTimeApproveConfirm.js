import axios from 'axios';
import {
    HOST_API_SERVER_12
} from '../../../../services';
import {
    ERROR_MESSAGES
} from '../../../../utils/constants';
import {
    accessToken
} from '../../../../services/tokenService';

export const WkOverTimeApproveConfirm = async (result) => {
    try {
        const token = await accessToken();
        const response = await axios.post(
            `${HOST_API_SERVER_12}/hr/WkOverTimeApproveConfirm`, {
                result
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        const {
            data
        } = response;
        const {
            success,
            message,
            errors
        } = data;

        if (success) {
            return {
                success: true,
                data: JSON.parse(data.data),
            };
        }

        return {
            success: false,
            message: message,
            data: JSON.parse(data.data || '[]'),
            errors: Array.isArray(errors) ? errors : [],
        };

    } catch (error) {
        return {
            success: false,
            message: error?.message || ERROR_MESSAGES.ERROR,
            errors: [error?.message || 'Unexpected error occurred'],
        };
    }
};