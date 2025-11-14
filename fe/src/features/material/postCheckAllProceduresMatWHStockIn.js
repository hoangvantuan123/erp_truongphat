import axios from 'axios'
import { HOST_API_SERVER_1 } from '../../services'
import { accessToken } from '../../services/tokenService'

const DEFAULTS = {
  xmlFlags: 2,
  serviceSeq: 2639,
  workingTag: '',
  languageSeq: 6,
  pgmSeq: 5484,
}

export const CheckAllProceduresMatWHStockIn = async (
  dataSave,
  xmlDocuments,
) => {
  try {
    const token = accessToken()
    const dataToSend = {
      ...DEFAULTS,
      dataSave,
      xmlDocument: {
        xmlSCOMCloseCheckWEB: xmlDocuments.xmlSCOMCloseCheckWEB,
        xmlSCOMCloseItemCheckWEB: xmlDocuments.xmlSCOMCloseItemCheckWEB,
        xmlInOutDailyCheckWEB: xmlDocuments.xmlInOutDailyCheckWEB,
        xmlInOutDailyItemCheckWEB: xmlDocuments.xmlInOutDailyItemCheckWEB,
      },
    }

    const response = await axios.post(
      `${HOST_API_SERVER_1}/mssql/stock-in/check-all-procedures-mat-wh-stock-in`,
      dataToSend,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      },
    )

    if (response.status >= 200 && response.status < 300) {
      return response.data
    }

    throw new Error('Unexpected response status: ' + response.status)
  } catch (error) {
    let errorMessage = 'Unknown error occurred'

    if (error.response) {
      errorMessage =
        error.response.data.message ||
        `API error with status ${error.response.status}`
    } else if (error.request) {
      errorMessage = 'No response received from the server'
    } else {
      errorMessage = error.message
    }

    throw new Error(errorMessage)
  }
}
