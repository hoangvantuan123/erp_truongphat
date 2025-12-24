module.exports = {
  apps: [{
    name: 'microservice-upload-v1.0.0',
    script: 'dist/main.js',
    instances: 1,
    exec_mode: 'fork',
    watch: false,
    max_memory_restart: '2G',
    restart_delay: 5000,
    autorestart: true,
    env: {
      PORT_UPLOAD: 4089,
      NODE_ENV: 'production',
      NODE_OPTIONS: '--max-old-space-size=2048',
      UPLOAD_PATHS: '/ERP_CLOUD/uploads',
      PATH_INVOICES: '/ERP_CLOUD/uploads/pdf',
      PATHS_TEMPLATE: '/ERP_CLOUD/templates',
      PATH_PRINT_LOGS_DOCS: '/ERP_CLOUD/print_logs_docs',
      PATH_WINDOW_PRINT_LOGS_DOCS: '/ERP_CLOUD/window_print_logs_docs',
      PATH_PRINT_LOGS: '/ERP_CLOUD/print_logs',
      PATH_PRINT_DOCX_DIR: 'F:/ERP_CLOUD/print_logs/docx',
      PATH_PRINT_PDF_DIR: 'F:/ERP_CLOUD/print_logs/pdf',
      HOST_QR_CODE: '192.168.20.22:8098',
      DB_HOST: '192.168.35.150',
      DB_PORT: '14233',
      DB_USERNAME: 'genuine',
      DB_PASSWORD: 'Itmv209#',
      DB_DATABASE: 'ITMV'
    },
  
  }]
};