import axios from 'axios'
import {
    accessToken
} from '../../services/tokenService'
import { HOST_API_SERVER_18 } from '../../services'

export const deleteMold = async (dataMold) => {
    try {
        const token = await accessToken()

        const response = await axios.post(
            `${HOST_API_SERVER_18}/asset-equip/delete-mold`, {
                dataMold,
            
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
        console.log('error', error)
        return {
            success: false,
            message: error.response ?
                error.response.data.message || `Error: ${error.response.status}` : 'Unable to connect to the server.',
            errorDetails: error.response ? error.response.data : error.message,
        }
    }
}