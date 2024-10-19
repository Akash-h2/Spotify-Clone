/* eslint-disable no-undef */
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server:{
    proxy:{
      "/api":{
        target:"http://localhost:5000",
      },
    },
  },
  define:{
       'process.env.VITE_CLIENT_ID':JSON.stringify(process.env.VITE_CLIENT_ID),          
       'process.env.VITE_CLIENT_SECRET':JSON.stringify(process.env.VITE_CLIENT_SECRET)           
  }
 
});
