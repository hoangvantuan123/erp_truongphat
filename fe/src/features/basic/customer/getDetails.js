import axios from 'axios'
import { HOST_API_SERVER_1 } from '../../../services'
import { accessToken } from '../../../services/tokenService'

export const GetMasterById = async (result,signal ) => {
    try {
        const token = accessToken()

        const response = await axios.post(
            `${HOST_API_SERVER_1}/mssql/customers/get-master`, {
                result
            
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                signal
            },
        )

        if (response.status === 200 || response.status === 201) {
            return {
                success: true,
                message: response.data.message || 'Batch update successful',
                data: response.data,
            }
        } else {
            return {
                success: false,
                message: `Unexpected status code: ${response.status}`,
            }
        }
    } catch (error) {
        return {
            success: false,
            message: error.response ?
                error.response.data.message || `Error: ${error.response.status}` : 'Unable to connect to the server.',
            errorDetails: error.response ? error.response.data : error.message,
        }
    }
}

export const GetBasicInfoById = async (result,signal ) => {
    try {
        const token = accessToken()

        const response = await axios.post(
            `${HOST_API_SERVER_1}/mssql/customers/get-basic-info`, {
                result
            
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                signal
            },
        )

        if (response.status === 200 || response.status === 201) {
            return {
                success: true,
                message: response.data.message || 'Batch update successful',
                data: response.data,
            }
        } else {
            return {
                success: false,
                message: `Unexpected status code: ${response.status}`,
            }
        }
    } catch (error) {
        return {
            success: false,
            message: error.response ?
                error.response.data.message || `Error: ${error.response.status}` : 'Unable to connect to the server.',
            errorDetails: error.response ? error.response.data : error.message,
        }
    }
}

export const GetBankInfoById = async (result,signal ) => {
    try {
        const token = accessToken()

        const response = await axios.post(
            `${HOST_API_SERVER_1}/mssql/customers/get-bank-info`, {
                result
            
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                signal
            },
        )

        if (response.status === 200 || response.status === 201) {
            return {
                success: true,
                message: response.data.message || 'Batch update successful',
                data: response.data,
            }
        } else {
            return {
                success: false,
                message: `Unexpected status code: ${response.status}`,
            }
        }
    } catch (error) {
        return {
            success: false,
            message: error.response ?
                error.response.data.message || `Error: ${error.response.status}` : 'Unable to connect to the server.',
            errorDetails: error.response ? error.response.data : error.message,
        }
    }
}

export const GetCustKindById = async (result,signal ) => {
    try {
        const token = accessToken()

        const response = await axios.post(
            `${HOST_API_SERVER_1}/mssql/customers/get-cust-kind`, {
                result
            
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                signal
            },
        )

        if (response.status === 200 || response.status === 201) {
            return {
                success: true,
                message: response.data.message || 'Batch update successful',
                data: response.data,
            }
        } else {
            return {
                success: false,
                message: `Unexpected status code: ${response.status}`,
            }
        }
    } catch (error) {
        return {
            success: false,
            message: error.response ?
                error.response.data.message || `Error: ${error.response.status}` : 'Unable to connect to the server.',
            errorDetails: error.response ? error.response.data : error.message,
        }
    }
}

export const GetCustAddInfoById = async (result,signal ) => {
    try {
        const token = accessToken()

        const response = await axios.post(
            `${HOST_API_SERVER_1}/mssql/customers/get-cust-add-info`, {
                result
            
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                signal
            },
        )

        if (response.status === 200 || response.status === 201) {
            return {
                success: true,
                message: response.data.message || 'Batch update successful',
                data: response.data,
            }
        } else {
            return {
                success: false,
                message: `Unexpected status code: ${response.status}`,
            }
        }
    } catch (error) {
        return {
            success: false,
            message: error.response ?
                error.response.data.message || `Error: ${error.response.status}` : 'Unable to connect to the server.',
            errorDetails: error.response ? error.response.data : error.message,
        }
    }
}

export const GetCustRemarkById = async (result,signal ) => {
    try {
        const token = accessToken()

        const response = await axios.post(
            `${HOST_API_SERVER_1}/mssql/customers/get-cust-remark`, {
                result
            
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                signal
            },
        )

        if (response.status === 200 || response.status === 201) {
            return {
                success: true,
                message: response.data.message || 'Batch update successful',
                data: response.data,
            }
        } else {
            return {
                success: false,
                message: `Unexpected status code: ${response.status}`,
            }
        }
    } catch (error) {
        return {
            success: false,
            message: error.response ?
                error.response.data.message || `Error: ${error.response.status}` : 'Unable to connect to the server.',
            errorDetails: error.response ? error.response.data : error.message,
        }
    }
}