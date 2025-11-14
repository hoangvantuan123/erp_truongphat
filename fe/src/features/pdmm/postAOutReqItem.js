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
export const PostAOutReqItem = async (resultItems, resultCheck) => {
    try {
        const token = await accessToken();
        const response = await axios.post(
            `${HOST_API_SERVER_6}/pdmm/SPDMM-Out-Req-Item-A`, {
                resultItems,
                resultCheck
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
                message: response.data.errorDetails,
            };
        }
    } catch (error) {
        return {
            success: false,
            message: error.response ? error.response.data.errorDetails : ERROR_MESSAGES.ERROR,
        };
    }
};