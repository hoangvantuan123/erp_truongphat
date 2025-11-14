module.exports = {
    apps: [{
        name: 'api-gateway-v1.0.0',
        script: 'dist/main.js',
        instances: 1,
        exec_mode: 'fork',
        watch: false,
        autorestart: false,
        max_memory_restart: '8192M',
        env: {
            NODE_ENV: 'production',
            NODE_OPTIONS: '--max-old-space-size=8192',
            REQUEST_TIMEOUT: 1200000,
            PORT_API_GATEWAY: 4086,
            JWT_SECRET: 'P@5sW0rD!$R3c3nT@2024',
            HOST_REDIS: '192.168.20.22',
            HOST_REDIS_WAREHOUSE: '192.168.20.22',
            HOST_REDIS_AUTH: '192.168.20.22',
            HOST_REDIS_PRODUCTION: '192.168.20.22',
            HOST_REDIS_PURCHASEN: '192.168.20.22',
            HOST_REDIS_QC: '192.168.20.22',
            HOST_RGPC_PDMM: '192.168.20.22:4002',
            HOST_RGPC_SP: '192.168.20.22:4003',
            HOST_RGPC_WC: '192.168.20.22:4002',
            HOST_RGPC_AUTH: '192.168.20.22:4004',
            HOST_RGPC_HR: '192.168.20.22:4005',
            PORT_REDIS_AUTH: 7383,
            PORT_REDIS_WAREHOUSE: 7382,
            PORT_REDIS_PRODUCTION: 7384,
            PORT_REDIS_QC: 7386,
            PORT_REDIS_PURCHASEN: 7385
        }
    }]
};