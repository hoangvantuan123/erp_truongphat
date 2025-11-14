import axios from 'axios'
import {
    HOST_API_SERVER_4
} from '../../../services'
import {
    ERROR_MESSAGES
} from '../../../utils/constants'
import {
    accessToken
} from '../../../services/tokenService'

export const getQFileSeq = async (ItemNoSeq, FormCode, TableName, signal) => {
    try {
        const token = await accessToken()
        const response = await axios.get(`${HOST_API_SERVER_4}/all-data-file-item-seq`, {
            params: {
                ItemNoSeq,
                FormCode, TableName
            },
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }, signal
        })

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