import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';

export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 3030,

    // ✅ Thêm dòng này để cho phép domain Cloudflare Tunnel
    allowedHosts: ['erpsheet.online'],

    proxy: {
      '/api': {
        target: 'http://localhost:8090',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      '/uploads': {
        target: 'http://localhost:8090',
        changeOrigin: true,
      },
    },
  },
  plugins: [react()],
  build: {
    manifest: true,
  },
  esbuild: {
    jsxFactory: 'React.createElement',
    jsxInject: `import React from 'react'`,
  },
});
