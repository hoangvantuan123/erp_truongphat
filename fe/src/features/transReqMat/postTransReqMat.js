import axios from 'axios'
import { HOST_API_SERVER_1 } from '../../services'
import { ERROR_MESSAGES } from '../../utils/constants'
import { accessToken } from '../../services/tokenService'
import { SERVICE_SEQ } from '../../utils/sysConstants'


const DEFAULTS = {
  xmlFlags: 2,
  serviceSeq: SERVICE_SEQ.TRANS_REQ_MAT_SEARCH,
  workingTag: '',
  languageSeq: 6,
  pgmSeq: 6888,
}

const DEFAULTS_CONFIRM = {
  xmlFlags: 2,
  serviceSeq: {
    check: SERVICE_SEQ.TRAN_REQ_MAT_CHECK,
    confirm: SERVICE_SEQ.TRAN_REQ_MAT_CONFIRM,
  },
  workingTag: '',
  languageSeq: 6,
  pgmSeq: 6889,
}

const DEFAULTS_STOP = {
  xmlFlags: 2,
  serviceSeq: SERVICE_SEQ.TRANS_REQ_MAT_STOP,
  workingTag: '',
  languageSeq: 6,
  pgmSeq: 6889,
}

export const SearchBy = async (
  searchBody
) => {
  try {
    const url = `${HOST_API_SERVER_1}/mssql/trans-req-material/search-by`
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

export const CreatedBy = async (
  itemList,
  payloadMaster
) => {
  try {
    const url = `${HOST_API_SERVER_1}/mssql/trans-req-material/created-by`
    const token = accessToken();
    const payload = {
      ...DEFAULTS,
      itemList,
      payloadMaster,
    }

    const response = await axios.post(url, 
      payload,
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

export const UpdatedBy = async (
  itemList,
  payloadMaster,
) => {
  try {
    const url = `${HOST_API_SERVER_1}/mssql/trans-req-material/updated-by`
    const token = accessToken();
    const searchDto = {
      ...DEFAULTS,
      itemList,
      payloadMaster,
    }

    const response = await axios.put(url, 
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


export const UpdatedReqByConfirm = async (
  payload,
) => {
  try {
    const url = `${HOST_API_SERVER_1}/mssql/trans-req-material/confirm-by`
    const token = accessToken();
    const searchDto = {
      ...DEFAULTS_CONFIRM,
      payload,
      reason: payload?.reason,
    }

    const response = await axios.put(url, 
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

export const UpdatedReqByStop = async (
  payload,
) => {
  try {
    const url = `${HOST_API_SERVER_1}/mssql/trans-req-material/stop-by`
    const token = accessToken();
    const searchDto = {
      ...DEFAULTS_STOP,
      payload,
    }

    const response = await axios.put(url, 
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