import axios from 'axios'
import {
    HOST_API_SERVER_1
} from '../../../services'
import {
    accessToken
} from '../../../services/tokenService'

export const PostMasterDelete = async (dataMaster, dataSheetAUD ) => {
    try {
        const token = await accessToken()

        const response = await axios.post(
            `${HOST_API_SERVER_1}/mssql/warehouse/slg-in-out-master-delete-out`, {
                dataMaster, dataSheetAUD
            
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
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