import axios from 'axios';
import {
    HOST_API_SERVER_2
} from '../../services';
import {
    accessToken
} from '../../services/tokenService';

export const CheckUserLangRole = async (language) => {
    try {
        const token = await accessToken();

        const response = await axios.post(
            `${HOST_API_SERVER_2}/acc/check-roles-user-raw`, {}, 
            {
                params: {
                    language
                },
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        return response.data;
    } catch (error) {
        return {
            success: false,
            message: error.response ? error.response.data.message : 'Có lỗi xảy ra',
        };
    }
};