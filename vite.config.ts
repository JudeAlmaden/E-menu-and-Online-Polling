import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  server: {
    host: true, // allows 0.0.0.0 access
    port: 5173,
    allowedHosts: [
      '.free.pinggy.io', // allow all subdomains of free.pinggy.io
      // or the exact host:
      'labpn-2001-4453-3a7-f400-ace7-342b-1381-62dc.a.free.pinggy.link'
    ],

  },
});

