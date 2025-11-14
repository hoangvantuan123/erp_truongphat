import axios from 'axios'
import {
    ERROR_MESSAGES
} from '../../utils/constants'
import {
    HOST_API_SERVER_6
} from '../../services'
import {
    accessToken
} from '../../services/tokenService'
export const PostSPDMMOutReqCancel = async (result) => {
    try {
        const token = await accessToken();
        const response = await axios.post(
            `${HOST_API_SERVER_6}/pdmm/SP-DMM-Out-Req-Cancel`, {
            result
       
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            }
        
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
                message: ERROR_MESSAGES.ERROR,
            };
        }
    } catch (error) {
        return {
            success: false,
            message: error.response ? error.response.data.message : ERROR_MESSAGES.ERROR,
        };
    }
};