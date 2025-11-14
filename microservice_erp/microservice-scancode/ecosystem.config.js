module.exports = {
  apps: [
    {
      name: 'microservice-scancode',
      script: 'dist/main.js',
      instances: 1, 
      exec_mode: 'fork', 
      watch: false,  
      max_memory_restart: '2G',  
      env: {
        PORT_SCAN_CODE: 8098,
        NODE_ENV: 'development',
        
      },
      env_production: {
        PORT: 8098,
        NODE_ENV: 'production',
      },
    },
  ],
};
