import axios from 'axios'
import { HOST_API_SERVER_2 } from '../../services'
import { accessToken } from '../../services/tokenService'

export const getHelpMenu = async (page, limit, value = '', signal) => {
    try {
        const token = await accessToken()
        const response = await axios.post(
            `${HOST_API_SERVER_2}/mssql/help-query/help-menu`,
            { page, limit, value }, 
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                signal 
            }
        )

        return {
            success: true,
            data: response.data
        }
    } catch (error) {
        return {
            success: false,
            message: error.response
                ? error.response.data.message || 'Có lỗi xảy ra'
                : 'Không thể kết nối tới server'
        }
    }
}
