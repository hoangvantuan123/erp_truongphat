import axios from 'axios'
import { HOST_API_SERVER_1 } from '../../services'
import { ERROR_MESSAGES } from '../../utils/constants'
import { accessToken } from '../../services/tokenService'
import FileSaver from 'file-saver';
import { resetWarned } from 'antd/es/_util/warning';

const DEFAULTS = {
  xmlFlags: 2,
  serviceSeq: 2670,
  workingTag: '',
  languageSeq: 6,
  pgmSeq: 6890,
}

const DEFAULTS_2 = {
  xmlFlags: 2,
  serviceSeq: 2558,
  workingTag: '',
  languageSeq: 6,
  pgmSeq: 6888,
}

const DEFAULTS_3 = {
  xmlFlags: 2,
  serviceSeq: 2622,
  workingTag: '',
  languageSeq: 6,
  pgmSeq: 6888,
}

const DEFAULTS_4 = {
  xmlFlags: 2,
  serviceSeq: 5660,
  workingTag: '',
  languageSeq: 6,
  pgmSeq: 6888,
}

export const SearchBy = async (
  searchBody
) => {
  try {
    const url = `${HOST_API_SERVER_1}/mssql/trans-req-mat-details/search-by`
    const token = accessToken();
    const searchDto = {
      ...DEFAULTS,
      searchBody,
    }

    const response = await axios.post(url, 
      searchDto,
       {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
       }
      )

    if (response.status === 201) {
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

export const GetStdQtyBy = async (
  itemSeq
) => {
  try {
    const url = `${HOST_API_SERVER_1}/mssql/trans-req-mat-details/get-std-qty`
    const token = accessToken();
    const searchDto = {
      ...DEFAULTS_2,
      itemSeq,
    }

    const response = await axios.post(url, 
      searchDto,
       {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
       }
      )

    if (response.status === 201) {
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

export const GetReqMatByID = async (
  reqSeq
) => {
  try {
    const url = `${HOST_API_SERVER_1}/mssql/trans-req-material/req-detail`
    const token = accessToken();
    const searchDto = {
      ...DEFAULTS_3,
      reqSeq: reqSeq,
    }

    const response = await axios.post(url, 
      searchDto,
       {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
       }
      )

    if (response.status === 201) {
      return {
        success: true,
        data: response.data.data,
        maxReqSerl: response.data.maxReqSerl
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

export const GetDataPrint1 = async (
  payload
) => {
  try {
    const url = `${HOST_API_SERVER_1}/mssql/trans-req-mat-details/export`
    const token = accessToken();
    const searchDto = {
      ...DEFAULTS_4,
      payload: payload,
    }

    const response = await axios.post(url, 
      searchDto,
       {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        responseType: 'arraybuffer',
       }
       
      )

    if (response.status === 201) {
      const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      FileSaver.saveAs(blob, 'Giay_yeu_cau_chuyen_kho.xlsx');
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

export const GetDataPrint = async (
  payload
) => {
  try {
    const url = `${HOST_API_SERVER_1}/mssql/trans-req-mat-details/export-v1`
    const token = accessToken();
    const searchDto = {
      ...DEFAULTS_4,
      payload: payload,
    }

    const response = await axios.post(url, 
      searchDto,
       {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
       }
       
      )

    if (response.status === 201) {
      return response.data.data;
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

export const GetTemplateTransReq = async (

) => {
  try {
    const url = `${HOST_API_SERVER_1}/mssql/trans-req-mat-details/get-template`
    const token = accessToken();

    const response = await axios.get(url,
       {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
       }
       
      )

    if (response.status === 200) {
      return {
        success: true,
        data: response.data.data
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

export const UploadFile = async (
files
) => {
  try {
    const url = `${HOST_API_SERVER_1}/mssql/trans-req-mat-details/upload`
    const token = accessToken();
    const formData = new FormData();

    Array.from(files).forEach(file => formData.append('files', file));

    const response = await axios.post(url,
      formData,
       {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
       }
       
      )

    if (response.status === 201) {
      return {
        success: true,
        data: response.data
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