import axios from 'axios'
import {
  HOST_API_SERVER_1
} from '../../services'
import {
  ERROR_MESSAGES
} from '../../utils/constants'

export const GetIQCStatus = async (
  fromDate,
  toDate,
  blNo,
  delivbizUniteryNo,
  itemNo,
  itemName,
  signal
) => {
  try {
    const url = `${HOST_API_SERVER_1}/mssql/iqc-status/itm-spdqc-imp-result-list-web`

    const response = await axios.get(url, {
      params: {
        fromDate,
        toDate,
        blNo,
        delivbizUniteryNo,
        itemNo,
        itemName,
      },
      headers: {
        'Content-Type': 'application/json',
      },
      signal
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
      message: error.response ?
        error.response.data.message : ERROR_MESSAGES.ERROR,
    }
  }
}