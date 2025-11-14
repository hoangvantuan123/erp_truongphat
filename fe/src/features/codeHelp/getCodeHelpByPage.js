import axios from 'axios'
import {
  HOST_API_SERVER_1
} from '../../services'
import {
  ERROR_MESSAGES
} from '../../utils/constants'
import {
  accessToken
} from '../../services/tokenService'

export const GetCodeHelpByPage = async (
  codeHelpSeq,
  keyword,
  param1,
  param2,
  param3,
  param4,
  conditionSeq,
  pageSize,
  subConditionSql,
  accUnit,
  bizUnit,
  factUnit,
) => {
  try {
    const url = `${HOST_API_SERVER_1}/mssql/code-help-query/search-by`
    const token = accessToken()
    const response = await axios.get(url, {
      params: {
        codeHelpSeq,
        keyword,
        param1,
        param2,
        param3,
        param4,
        conditionSeq,
        pageSize,
        subConditionSql,
        accUnit,
        bizUnit,
        factUnit,
      },
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
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