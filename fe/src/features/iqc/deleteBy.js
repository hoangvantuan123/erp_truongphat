import axios from 'axios'
import { HOST_API_SERVER_7 } from '../../services'
import {
    accessToken
} from '../../services/tokenService'

export const DeleteIqcImportBy = async (result ) => {
    try {
        const token = await accessToken()

        const response = await axios.post(
            `${HOST_API_SERVER_7}/iqc/delete-iqc-by`, {
                result
            
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            },
        )

        if ((response.status === 200 || response.status === 201) && response.data.success) {
            return {
                success: true,
                message: response.data.message || 'Batch update successful',
                data: response.data,
            }
        } else {
            return {
                success: false,
                message: response.data.message,
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