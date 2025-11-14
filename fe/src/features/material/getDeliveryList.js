import axios from 'axios'
import { HOST_API_SERVER_1 } from '../../services'
import { ERROR_MESSAGES } from '../../utils/constants'
import { accessToken } from '../../services/tokenService'

export const GetDeliveryList = async (
  fromDate,
  toDate,
  deliveryNo,
  delivbizUniteryNo,signal
) => {
  try {
    const url = `${HOST_API_SERVER_1}/mssql/deliverry-list/itm-sug-get-active-delivery-web`
    const token = accessToken()
    const response = await axios.get(url, {
      params: {
        fromDate,
        toDate,
        deliveryNo,
        delivbizUniteryNo,
      },
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },signal
    })

    if (response.status === 200) {
      return {
        success: true,
        data: response.data.data,
      }
    } else {
      return {
        success: false,
        message: ERROR_MESSAGES.ERROR,
      }
    }
  } catch (error) {
    return {
      success: false,
      message: error.response
        ? error.response.data.message
        : ERROR_MESSAGES.ERROR,
    }
  }
}
