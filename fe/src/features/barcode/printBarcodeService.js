import axios from 'axios'
import { HOST_API_SERVER_3 } from '../../services'

export const GetPageItem = async (fromDate, toDate, vendor, matID, lotNo) => {
  try {
    const url = `${HOST_API_SERVER_3}/print-barcode/paginated`

    const response = await axios.get(url, {
      params: {
        fromDate,
        toDate,
        vendor,
        matID,
        lotNo,
        pageIndex: 1,
        pageSize: 500,
      },
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (response.status === 200) {
      return {
        success: true,
        data: response.data,
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

export const CreatePrintLabel = async (requestData) => {
  return axios
    .post(`${HOST_API_SERVER_3}/print-barcode/printer`, requestData, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then((response) => {
      if (response.status === 200 || response.status === 201) {
        return response.data
      }
      throw new Error('Error from API: ' + response.data.message)
    })
    .catch((error) => {
      const errorMessage = error.response
        ? error.response.data.message || 'Error from API'
        : 'Unknown error occurred'
      throw new Error(errorMessage)
    })
}

export const getMatIdByVendor = async (requestData) => {
  const { plant, partNo } = requestData

  return axios
    .get(`${HOST_API_SERVER_3}/print-barcode/get-matid`, {
      params: {
        plant,
        partNo,
      },
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then((response) => {
      if (response.status === 200 || response.status === 201) {
        return response.data.result
      }
      throw new Error('Error from API: ' + response.data.message)
    })
    .catch((error) => {
      const errorMessage = error.response
        ? error.response.data.message || 'Error from API'
        : 'Unknown error occurred'
      throw new Error(errorMessage)
    })
}

export const getReelNo = async (requestData) => {
  return axios
    .get(`${HOST_API_SERVER_3}/print-barcode/get-reel-no`, requestData, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then((response) => {
      if (response.status === 200 || response.status === 201) {
        return response.data
      }
      throw new Error('Error from API: ' + response.data.message)
    })
    .catch((error) => {
      const errorMessage = error.response
        ? error.response.data.message || 'Error from API'
        : 'Unknown error occurred'
      throw new Error(errorMessage)
    })
}

export const getLotCount = async (requestData) => {
  const { plant, lotNo } = requestData

  return axios
    .get(`${HOST_API_SERVER_3}/print-barcode/get-lot-count`, {
      params: {
        plant,
        lotNo,
      },
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then((response) => {
      if (response.status === 200 || response.status === 201) {
        return response.data.result
      }
      throw new Error('Error from API: ' + response.data.message)
    })
    .catch((error) => {
      const errorMessage = error.response
        ? error.response.data.message || 'Error from API'
        : 'Unknown error occurred'
      throw new Error(errorMessage)
    })
}

export const CreatePrintLabelBySize = async (requestData) => {
  return axios
    .post(`${HOST_API_SERVER_3}/print-barcode/print-by-size`, requestData, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then((response) => {
      if (response.status === 200 || response.status === 201) {
        return response.data
      }
      throw new Error('Error from API: ' + response.data.message)
    })
    .catch((error) => {
      const errorMessage = error.response
        ? error.response.data.message || 'Error from API'
        : 'Unknown error occurred'
      throw new Error(errorMessage)
    })
}
