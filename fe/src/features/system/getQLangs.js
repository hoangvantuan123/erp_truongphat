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

export const GetALlLangSys = async (filters = {}, signal) => {
    try {
        const token = await accessToken()
        const response = await axios.get(`${HOST_API_SERVER_2}/dict/lang-sys`, {
            params: filters,
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            signal
        })

        return {
            success: true,
            data: response.data
        }
    } catch (error) {
        return {
            success: false,
            message: error.response ?
                error.response.data.message || 'Có lỗi xảy ra' :
                'Không thể kết nối tới server'
        }
    }
}