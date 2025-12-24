import axios from 'axios'
import { HOST_API_SERVER_12 } from '../../../services'
import { accessToken } from '../../../services/tokenService'

export const searchEduRstEnd = async (result, signal) => {
    try {
        const token = accessToken()

        const response = await axios.post(
            `${HOST_API_SERVER_12}/hr/edu-rst-end-search`, {
            result

        }, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            
        },
        )

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
            errors: JSON.parse(data.errors),
        };
    } catch (error) {
        return {
            success: false,
            message: error.response ?
                error.response.data.message || `Error: ${error.response.status}` : 'Unable to connect to the server.',
            errorDetails: error.response ? error.response.data : error.message,
        }
    }
}