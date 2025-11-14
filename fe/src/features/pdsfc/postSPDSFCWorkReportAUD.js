import axios from 'axios';
import { ERROR_MESSAGES } from '../../utils/constants';
import { HOST_API_SERVER_6 } from '../../services';
import { accessToken } from '../../services/tokenService';

export const PostSPDSFCWorkReportAUD = async (result) => {
    const token = await accessToken();

    return axios.post(
        `${HOST_API_SERVER_6}/pdsfc/SPDSFCWorkReportAUD`,
        { result },
        {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        }
    ).then((response) => {
        console.log('response', response);

        const data = response?.data || {};
        const isSuccess = data?.success;

        if (isSuccess) {
            return {
                success: true,
                data: JSON.parse(data.data || '{}')
            };
        } else {
            return {
                success: false,
                message: data.message || ERROR_MESSAGES.ERROR,
                errors: Array.isArray(data.errors)
                    ? data.errors
                    : [data.errors || 'Unknown error'],
            };
        }
    });
};
