const commonEnv = require('./env_tp.common');

module.exports = {
    apps: [{
            name: 'api-gateway-tp',
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
            name: 'micr-auth-tp',
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
            name: 'micr-hr-tp',
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
            name: 'micr-produce-tp',
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
            name: 'micr-purchase-tp',
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
            name: 'micr-qc-tp',
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
            name: 'micr-sp-tp',
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
            name: 'micr-warehouse-tp',
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
            name: 'micr-upload-tp',
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
            name: 'socket-gateway-tp',
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
            name: 'micr-report-tp',
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