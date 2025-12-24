module.exports = {
    NODE_ENV: 'dev',
    NODE_OPTIONS: '--max-old-space-size=2048',
    REQUEST_TIMEOUT: 1200000,
    JWT_SECRET: 'P@5sW0rD!$R3c3nT@2024',
    LOG_STORAGE: '/ERP/microservice_erp/grafana-logs/logs',

    /*  HOST REDIS*/
    HOST_REDIS: 'localhost',
    HOST_REDIS_WAREHOUSE: 'localhost',
    HOST_REDIS_AUTH: 'localhost',
    HOST_REDIS_PRODUCTION: 'localhost',
    HOST_REDIS_PURCHASEN: 'localhost',
    HOST_REDIS_QC: 'localhost',

    /* REDIS  PORT*/
    PORT_REDIS_AUTH: 6383,
    PORT_REDIS_WAREHOUSE: 6382,
    PORT_REDIS_PRODUCTION: 6384,
    PORT_REDIS_QC: 6386,
    PORT_REDIS_PURCHASEN: 6385,




    /* DB */
    DB_HOST: '192.168.35.150',
    DB_PORT: '14233',
    DB_USERNAME: 'genuine',
    DB_PASSWORD: 'Itmv209#',
    DB_DATABASE: 'ITMV20240117',



    EMAIL_USER: 'erp@itmv.vn',
    EMAIL_PASS: 'Itm#semi567@',


    /* GRPC SERVER */
    HOST_RGPC_PDMM: 'localhost:5002',
    HOST_RGPC_SP: 'localhost:5003',
    HOST_RGPC_WC: 'localhost:5002',
    HOST_RGPC_AUTH: 'localhost:5004',
    HOST_RGPC_HR: 'localhost:5005',
    HOST_GRPC_UPLOAD: 'localhost:5006',
    HOST_GRPC_REPORT: 'localhost:5007',
    HOST_GRPC_SOCKET: 'localhost:5008',
    /* GRPC PORT */
    PORT_GRPC_AUTH: 5004,
    PORT_GRPC_PRODUCE: 5002,
    PORT_GRPC_SP: 5003,
    HOST_PORT_HR: 5005,
    HOST_PORT_UPLOAD: 5006,
    HOST_PORT_REPORT: 5007,
    HOST_PORT_SOCKET: 5008,



    /* UPLOAD */
    PORT_UPLOAD: 8089,
    UPLOAD_PATHS: '/ERP_CLOUD/uploads',
    PATH_INVOICES: '/ERP_CLOUD/uploads/pdf',
    PATHS_TEMPLATE: '/ERP_CLOUD/templates',
    PATH_PRINT_LOGS_DOCS: '/ERP_CLOUD/print_logs_docs',
    PATH_WINDOW_PRINT_LOGS_DOCS: '/ERP_CLOUD/window_print_logs_docs',
    PATH_PRINT_LOGS: '/ERP_CLOUD/print_logs',
    PATH_PRINT_DOCX_DIR: 'F:/ERP_CLOUD/print_logs/docx',
    PATH_PRINT_PDF_DIR: 'F:/ERP_CLOUD/print_logs/pdf',
    HOST_QR_CODE: 'localhost:8098',
    UPLOAD_USER_PATHS: '/ERP_CLOUD/user_files',
    UPLOAD_USER_PATHS_ROOT: 'F:/ERP_CLOUD/user_files',
    PATH_PRINT_INFO_USER: 'localhost:8089',

    /* SOCKET */

    PORT_API_GATEWAY: 8086,
    PORT_SOCKET_GATEWAY: 8888,


};