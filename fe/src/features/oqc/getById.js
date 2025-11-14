import axios from 'axios'
import {
    HOST_API_SERVER_7
} from '../../services'

import {
    accessToken
} from '../../services/tokenService'

export const GetOQCSeq = async (result, signal) => {
    try {
        const token = await accessToken()
        const response = await axios.post(`${HOST_API_SERVER_7}/oqc/get-oqc-seq`, {
            result
        },
        {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            signal
        },)

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

export const GetOQcTestReportQuery = async (result, signal) => {
    try {
        const token = await accessToken()
        const response = await axios.post(`${HOST_API_SERVER_7}/iqc/get-iqc-by-id`, {
            result
        },
        {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            signal
        },)

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

export const GetListItemById = async (result, signal) => {
    try {
        const token = await accessToken()
        const response = await axios.post(`${HOST_API_SERVER_7}/iqc/get-qc-list-item`, {
            result
        },
        {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            signal
        },)

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

export const GetListTestReportResult = async (QCSeq, signal) => {
    try {
        const token = await accessToken()
        const response = await axios.get(`${HOST_API_SERVER_7}/iqc/get-qc-report-result`,
            {
                params: {
                    QCSeq
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

export const GetListQcFile = async (FileSeq, signal) => {
    try {
        const token = await accessToken()
        const response = await axios.get(`${HOST_API_SERVER_7}/iqc/get-file-iqc`,
            {
                params: {
                    FileSeq
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