export const LOGS = {
  API_REQUEST_STARTED: 'API request started at: ',
  API_REQUEST_SUCCEEDED: 'API request succeeded at: ',
  API_REQUEST_FAILED: 'API request failed at: ',
  DATABASE_QUERY_EXECUTED: 'Database query executed at: ',
  DATABASE_QUERY_FAILED: 'Database query failed at: ',
  VALIDATION_ERROR: 'Validation failed for data: ',
}

export const ERROR_MESSAGES = {
  INVALID_DATA: 'Data provided is invalid.',
  API_CALL_FAILED: 'API call failed due to an unknown error.',
  SERVER_ERROR: 'Server error occurred. Please try again later.',
  DATABASE_CONNECTION_FAILED: 'Failed to connect to the database.',
  DATA_NOT_FOUND: 'Data not found for the requested resource.',
  UNAUTHORIZED_ACCESS: 'Unauthorized access. Please check your credentials.',
  ERROR_DATA: 'An error occurred during data processing.',
  ERROR: 'An error occurred.',
  ERROR_CSV: 'An error occurred while loading the CSV file.',
  ERROR_XLSX: 'An error occurred while loading the Excel file.',
  ERROR_CSV_EXCEL: 'Only supports uploading CSV or Excel files.',
  ERROR_FE: 'An error occurred on the user side.',
  ERROR_NULL_DATA: 'No records to save',
}

export const SUCCESS_MESSAGES = {
  RECORD_CREATED: 'Record created successfully.',
  RECORD_UPDATED: 'Record updated successfully.',
  RECORD_DELETED: 'Record deleted successfully.',
  API_CALL_SUCCEEDED: 'API call completed successfully.',
  DATABASE_QUERY_SUCCEEDED: 'Database query executed successfully.',
  DATA_LOAD: 'Loading data...',
  XLSX_DATA: 'Excel file exported successfully!',
  DELETE_DATA: 'Data deletion successful.',
}

export const WARNING_MESSAGES = {
  DATA_WARNING: 'Warning: Data may not be accurate or complete.',
}

export const BARCODE_ERR_MESSAGE = {
  ITEM_NO_IS_NULL: 'Item no is null.',
  LOT_NO_IS_NULL: 'Record updated successfully.',
  INVALID_BARCODE_FORMAT: 'Invalid barcode format.',
  NEW_BARCODE_NOT_MATCH: 'New Barcode Not Match.',
  NEW_BARCODE_NOT_MATCH: 'New Barcode Not Match.',
  BARCODEID_NOT_EXISTS: 'Barcode ID Not Exists.',
  NEW_BARCODEID_NOT_EXISTS: 'New Barcode ID Not Exists.',
  DUPLICATE_ROW: 'Duplicate Row Data',
  BARCODE_NOT_CONFIRM: 'Barcode not confirm.',
  PRINTER_ERROR: 'Error Printing, Checking Printer or Data',

  BARCODE_NOT_NULL: 'Barcode not null.',
  QTY_NOT_NULL: 'Change QTY not null.',
  NO_DATA_PRINTER: 'No data printer.',
  NOT_LANGER_THAN_PRE_QTY: 'Not Langer Than Pre Qty.',

  VENDOR_NOT_SELECT: 'Vendor Not Selected.',
}

export const BARCODE_SUCCESS_MESSAGE = {
  BARCODE_CONFIRM_SUCCESS: 'Barcode Confirm Succesfull.',
  PRINTER_SUCCESS: 'Printer Successfull.',
  CHECK_OLD_BARCODE_OK: 'Check Old Barcode: OK',
}

export const VENDOR_ERR_MESSAGE = {
  PANASONIC_NOT_FIT: "PANASONIC Part Code doesn't fit the format.",
  ALPHA_OMEGA_NOT_FIT: "ALPHA OMEGA Part Code doesn't fit the format.",
  TEXAS_INSTRUMENT_NOT_FIT:
    "TEXAS INSTRUMENT Part Code doesn't fit the format.",
  ABLIC_NOT_FIT: "ABLIC LOT Code doesn't fit the format.",
  SMK_NOT_FIT: "SMK LOT Code doesn't fit the format.",
  NISSHINBO_NOT_FIT: "NISSHINBO LOT Code doesn't fit the format.",
}
