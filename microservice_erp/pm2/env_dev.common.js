module.exports = {
    NODE_ENV: 'dev',
    NODE_OPTIONS: '--max-old-space-size=2048',
    REQUEST_TIMEOUT: 1200000,
    JWT_SECRET: 'P@5sW0rD!$R3c3nT@2024',
    LOG_STORAGE: '/erp_tmt/microservice_erp/grafana-logs/logs',

    /*  HOST REDIS*/
    HOST_REDIS: 'localhost',
    HOST_REDIS_WAREHOUSE: 'localhost',
    HOST_REDIS_AUTH: 'localhost',
    HOST_REDIS_PRODUCTION: 'localhost',
    HOST_REDIS_PURCHASEN: 'localhost',
    HOST_REDIS_QC: 'localhost',

    /* REDIS  PORT*/
    PORT_REDIS_AUTH: 5383,
    PORT_REDIS_WAREHOUSE: 5382,
    PORT_REDIS_PRODUCTION: 5384,
    PORT_REDIS_QC: 5386,
    PORT_REDIS_PURCHASEN: 5385,



    /* DB */
    DB_HOST: 'localhost',
    DB_PORT: '1433',
    DB_USERNAME: 'genuine',
    DB_PASSWORD: 'Itmv209#',
    DB_DATABASE: 'ITMV',



    EMAIL_USER: 'erp@itmv.vn',
    EMAIL_PASS: 'Itm#semi567',


    /* GRPC SERVER */
    HOST_RGPC_PDMM: 'localhost:4002',
    HOST_RGPC_SP: 'localhost:4003',
    HOST_RGPC_WC: 'localhost:4002',
    HOST_RGPC_AUTH: 'localhost:4004',
    HOST_RGPC_HR: 'localhost:4005',
    HOST_GRPC_UPLOAD: 'localhost:4006',
    HOST_GRPC_REPORT: 'localhost:4007',
    /* GRPC PORT */
    PORT_GRPC_AUTH: 4004,
    PORT_GRPC_PRODUCE: 4002,
    PORT_GRPC_SP: 4003,
    HOST_PORT_HR: 4005,
    HOST_PORT_UPLOAD: 4006,
    HOST_PORT_REPORT: 4007,
    HOST_RGPC_WH: 'localhost:4009',
    HOST_PORT_WH: 4099,
    HTTP_PORT_UPLOAD: 4106,

    /* UPLOAD */
    PORT_UPLOAD: 7089,
    HOST_QR_CODE: 'localhost:7098',
    PATH_PRINT_INFO_USER: 'localhost:7089',

    // Các đường dẫn upload & templates
    UPLOAD_PATHS: '/storage_erp/uploads',
    PATH_INVOICES: '/storage_erp/uploads/pdf',
    PATHS_TEMPLATE: '/storage_erp/templates',
    PATH_PRINT_LOGS_DOCS: '/storage_erp/print_logs_docs',
    PATH_WINDOW_PRINT_LOGS_DOCS: '/storage_erp/window_print_logs_docs',
    PATH_PRINT_LOGS: '/storage_erp/print_logs',
    PATH_PRINT_DOCX_DIR: 'F:/storage_erp/print_logs/docx',
    PATH_PRINT_PDF_DIR: 'F:/storage_erp/print_logs/pdf',
    STORAGE_DOCX_DIR: 'F:/storage_erp/print_logs/docx',
    STORAGE_PDF_DIR: 'F:/storage_erp/print_logs/pdf',

    // Upload user
    UPLOAD_USER_PATHS: 'F:/storage_erp/user_files',
    UPLOAD_USER_PATHS_ROOT: 'F:/storage_erp/user_files',

    // Cấu hình hệ thống lưu trữ file
    STORAGE_ROOT: 'F:/storage_erp',
    FILE_STORAGE_BASE_SYSTEM_TEMP_PATH: 'F:/storage_erp/system/temp',
    FILE_STORAGE_BASE_SYSTEM_ASSETS_DOCX_PATH: 'F:/storage_erp/system/assets/docx',
    FILE_STORAGE_BASE_SYSTEM_ASSETS_PDF_PATH: 'F:/storage_erp/system/assets/pdf',
    FILE_STORAGE_BASE_SYSTEM_ITEM_PDF_PATH: 'F:/storage_erp/system/items/pdf',
    FILE_STORAGE_BASE_SYSTEM_ASSETS_FILE_PATH: 'F:/storage_erp/system/assets/files',

    PDF_CONVERT_STRATEGY: 'windows',
    PYTHON_PATH: "C:/Users/Administrator/AppData/Local/Programs/Python/Python313/python.exe",

    // Các path dạng "đường dẫn web"
    UPLOAD_PATHS_LOWER: '/storage_erp/uploads',
    UPLOAD_USER_PATHS_LOWER: '/storage_erp/user_files',
    ROOT_ASSET_PATH: '/storage_erp/asset_files',
    UPLOAD_USER_PATHS_ROOT_LOWER: '/storage_erp/user_files',
    PATH_INVOICES_LOWER: '/storage_erp/uploads/pdf',
    PATHS_TEMPLATE_LOWER: '/storage_erp/templates',
    PATH_PRINT_LOGS_DOCS_LOWER: '/storage_erp/print_logs_docs',
    PATH_WINDOW_PRINT_LOGS_DOCS_LOWER: '/storage_erp/window_print_logs_docs',
    PATH_PRINT_LOGS_LOWER: '/storage_erp/print_logs',
    PATH_PRINT_DOCX_DIR_LOWER: '/storage_erp/print_logs/docx',
    PATH_PRINT_PDF_DIR_LOWER: '/storage_erp/print_logs/pdf',



    /* SOCKET */

    PORT_API_GATEWAY: 7086,
    PORT_SOCKET_GATEWAY: 8888,


};