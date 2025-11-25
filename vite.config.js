import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  /*server: {
    // لطفاً مسیر فایل‌های گواهی توسعه را تنظیم کن:
    https: {
      key: fs.readFileSync(path.resolve(__dirname, 'cert/localhost-key.pem')),
      cert: fs.readFileSync(path.resolve(__dirname, 'cert/localhost.pem')),
    },
    port: 5173,
    strictPort: true,
    cors: true,
  },
  preview: {
    https: {
      key: fs.readFileSync(path.resolve(__dirname, 'cert/localhost-key.pem')),
      cert: fs.readFileSync(path.resolve(__dirname, 'cert/localhost.pem')),
    },
    port: 5173,
  }*/
 server: {
    port: 5173,
    strictPort: true,
    cors: true,
    // بدون https → فقط http
  },
  preview: {
    port: 5173,
    // بدون https → فقط http
  }
})
