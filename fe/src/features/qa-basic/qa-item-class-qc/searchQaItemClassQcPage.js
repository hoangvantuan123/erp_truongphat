import axios from 'axios'
import { HOST_API_SERVER_7 } from '../../../services'
import { accessToken } from '../../../services/tokenService'

export const SearchQaItemClassQcPage = async (result,signal) => {
    try {
        const token = accessToken()

        const response = await axios.post(
            `${HOST_API_SERVER_7}/qa-item/search-qa-item-class-qc`, {
                result
            
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                signal
            },
        )

        if (response.status === 200 || response.status === 201) {
            return {
                success: true,
                message: response.data.message || 'Batch update successful',
                data: response.data,
            }
        } else {
            return {
                success: false,
                message: `Unexpected status code: ${response.status}`,
            }
        }
    } catch (error) {
        return {
            success: false,
            message: error.response ?
                error.response.data.message || `Error: ${error.response.status}` : 'Unable to connect to the server.',
            errorDetails: error.response ? error.response.data : error.message,
        }
    }
}