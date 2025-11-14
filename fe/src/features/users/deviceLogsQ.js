import axios from 'axios'
import {
    HOST_API_SERVER_2
} from '../../services'
import {
    ERROR_MESSAGES
} from '../../utils/constants'
import {
    accessToken
} from '../../services/tokenService'

export const PostDeviceLogsQ = async (result, signal) => {
    try {
        const token = await accessToken();
        const response = await axios.post(
            `${HOST_API_SERVER_2}/acc/deviceLogsQ`, {
                result
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                signal
            }
        );
        if (response.data.success) {
            return {
                success: true,
                data: JSON.parse(response.data.data)
            };
        } else {
            return {
                success: false,
                message: response.data.errors,
                errors: JSON.parse(response.data.errors),
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