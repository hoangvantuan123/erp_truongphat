import axios from 'axios';
import { ERROR_MESSAGES } from '../../../utils/constants';
import { accessToken } from '../../../services/tokenService';
import { HOST_API_SERVER_15 } from '../../../services';

export const TempFileP = async (files, result) => {
    try {
        const token = await accessToken();

        const formData = new FormData();
        files.forEach((file) => {
            formData.append('files', file);
        });

        // ✅ Gửi thêm metadata `result`
        formData.append('result', JSON.stringify(result));

        const response = await axios.post(
            `${HOST_API_SERVER_15}/upload/TempFileP`,
            formData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        const { data } = response;

        if (data.success) {
            return {
                success: true,
                data: JSON.parse(data.data),
            };
        }

        return {
            success: false,
            message: data.message || ERROR_MESSAGES.ERROR,
            errors: Array.isArray(data.errors) ? data.errors : [data.errors || 'Unknown error'],
        };

    } catch (error) {
        return {
            success: false,
            message: error?.response?.data?.message || ERROR_MESSAGES.ERROR,
            errors: [error?.message || 'Unexpected error occurred'],
        };
    }
};

