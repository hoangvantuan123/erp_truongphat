import axios from 'axios';
import {
  HOST_API_SERVER_1
} from '../../services';
import {
  ERROR_MESSAGES
} from '../../utils/constants';
import {
  accessToken
} from '../../services/tokenService';

export const GetCodeHelpComboVer2 = async (
  workingTag,
  languageSeq,
  codeHelpSeq,
  companySeq,
  keyword,
  param1,
  param2,
  param3,
  param4,
  signal
) => {
  try {
    const url = `${HOST_API_SERVER_1}/ver2/mssql/code-help-combo-query`;
    const token = accessToken();

    const result = {
      workingTag,
      languageSeq,
      codeHelpSeq,
      companySeq,
      keyword,
      param1,
      param2,
      param3,
      param4,
      signal
    };
    const response = await axios.post(url, {
      result
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },

    });
    if (response.data.success) {
      return {
        success: true,
        data: JSON.parse(response.data.data)
      };
    } else {
      return {
        success: false,
        message: ERROR_MESSAGES.ERROR,
      };
    }
  } catch (error) {
    return {
      success: false,
      message: error.response ? error.response.data.message : ERROR_MESSAGES.ERROR,
    };
  }
};