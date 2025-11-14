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
export const PostDSheetStockOutFiFo = async (dataMaster, dataSheetAUD) => {
    try {
        const token = await accessToken();
        const response = await axios.post(
            `${HOST_API_SERVER_6}/pdmm/scan/slg-in-out-sheet-delete`, {
                dataMaster,
                dataSheetAUD
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );

        if (response.data.success) {
            return {
                success: true,
                data: response.data.results
            };
        } else {
            return {
                success: false,
                message: ERROR_MESSAGES.ERROR,
                errors: response.data.errors
            };
        }
    } catch (error) {
        return {
            success: false,
            message: error.response ? error.response.data.message : ERROR_MESSAGES.ERROR,
        };
    }
};