import axios from 'axios'
import {
    HOST_API_SERVER_7
} from '../../services'

import {
    accessToken
} from '../../services/tokenService'

export const CreatedOutsourceListBy = async (result,signal) => {
    try {
        const token = await accessToken()
        const response = await axios.post(`${HOST_API_SERVER_7}/iqc-outsource/created-iqc-outsource-list`, {
            result
        
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            signal
        },)

        return {
            success: true,
            data: response.data
        }
    } catch (error) {
        return {
            success: false,
            message: error.response ?
                error.response.data.message || 'Có lỗi xảy ra' : 'Không thể kết nối tới server'
        }
    }
}