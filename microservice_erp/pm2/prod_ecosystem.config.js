const commonEnv = require('./env_prod.common');

module.exports = {
  apps: [{
      name: 'api-gateway-v1',
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
      name: 'microservice-auth-v1',
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
      name: 'microservice-hr-v1',
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
      name: 'microservice-produce-v1',
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
      name: 'microservice-purchase-v1',
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
      name: 'microservice-qc-v1',
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
      name: 'microservice-sp-v1',
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
      name: 'microservice-warehouse-v1',
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
      name: 'microservice-upload-v1',
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
      name: 'socket-gateway-v1',
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
      name: 'microservice-scancode-v1',
      script: '../microservice-scancode/dist/main.js',
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      max_memory_restart: '8192M',
      env: {
        ...commonEnv,

      },

    },
    {
      name: 'microservice-report-v1',
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