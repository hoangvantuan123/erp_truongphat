const commonEnv = require('./env_dev.common');

module.exports = {
    apps: [{
            name: 'api-gateway-dev',
            script: '../api-gateway/dist/main.js',
            instances: 1,
            exec_mode: 'fork',
            watch: false,
            autorestart: false,
            max_memory_restart: '8192M',
            env: {
                ...commonEnv,

            },
        },
        {
            name: 'microservice-auth-dev',
            script: '../microservice-auth/dist/main.js',
            instances: 1,
            exec_mode: 'fork',
            watch: false,
            autorestart: false,
            max_memory_restart: '8192M',
            env: {
                ...commonEnv,

            },
        },
        {
            name: 'microservice-hr-dev',
            script: '../microservice-hr/dist/main.js',
            instances: 1,
            exec_mode: 'fork',
            watch: false,
            autorestart: false,
            max_memory_restart: '8192M',
            env: {
                ...commonEnv,

            },
        },
        {
            name: 'microservice-produce-dev',
            script: '../microservice-produce/dist/main.js',
            instances: 1,
            exec_mode: 'fork',
            watch: false,
            autorestart: false,
            max_memory_restart: '8192M',
            env: {
                ...commonEnv,

            },
        },
        {
            name: 'microservice-purchase-dev',
            script: '../microservice-purchase/dist/main.js',
            instances: 1,
            exec_mode: 'cluster',
            watch: false,
            autorestart: false,
            max_memory_restart: '8192M',
            env: {
                ...commonEnv,

            },
        },
        {
            name: 'microservice-qc-dev',
            script: '../microservice-qc/dist/main.js',
            instances: 1,
            exec_mode: 'cluster',
            watch: false,
            autorestart: false,
            max_memory_restart: '8192M',
            env: {
                ...commonEnv,

            },
        },
        {
            name: 'microservice-sp-dev',
            script: '../microservice-sp/dist/main.js',
            instances: 1,
            exec_mode: 'fork',
            watch: false,
            autorestart: false,
            max_memory_restart: '8192M',
            env: {
                ...commonEnv,

            },

        },
        {
            name: 'microservice-warehouse-dev',
            script: '../microservice-warehouse/dist/main.js',
            instances: 1,
            exec_mode: 'fork',
            watch: false,
            autorestart: false,
            max_memory_restart: '8192M',
            env: {
                ...commonEnv,

            },

        },
        {
            name: 'microservice-upload-dev',
            script: '../microservice-upload/dist/main.js',
            instances: 1,
            exec_mode: 'fork',
            watch: false,
            autorestart: false,
            max_memory_restart: '8192M',
            env: {
                ...commonEnv,

            },

        },
        {
            name: 'socket-gateway-dev',
            script: '../socket-gateway/dist/main.js',
            instances: 1,
            exec_mode: 'fork',
            watch: false,
            autorestart: false,
            max_memory_restart: '8192M',
            env: {
                ...commonEnv,

            },

        },
        {
            name: 'microservice-report-dev',
            script: '../microservice-report/dist/main.js',
            instances: 1,
            exec_mode: 'fork',
            watch: false,
            max_memory_restart: '8192M',
            env: {
                ...commonEnv,

            },

        },

    ]
};