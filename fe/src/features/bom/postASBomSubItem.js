import axios from 'axios'
import {
    ERROR_MESSAGES
} from '../../utils/constants'
import {
    HOST_API_SERVER_6
} from '../../services'
import {
    accessToken
} from '../../services/tokenService'
export const PostASBomSubItem = async (result, signal) => {
    try {
        const token = await accessToken();
        const response = await axios.post(
            `${HOST_API_SERVER_6}/bom/spd-bom-sub-item-create`, {
                result
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                signal
            }
        );

        if (response.status === 200 || response.status === 201) {
            if (response.data.success) {
                return {
                    success: true,
                    data: response.data.data,
                };
            } else {
                return {
                    success: false,
                    message: response.data.message || ERROR_MESSAGES.ERROR_DATA,
                    data: response.data.errors
                };
            }
        } else {
            return {
                success: false,
                message: ERROR_MESSAGES.ERROR_DATA,
            };
        }
    } catch (error) {
        return {
            success: false,
            message: error.response ?
                error.response.data.message : ERROR_MESSAGES.ERROR,
        };
    }
};