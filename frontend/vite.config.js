import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  // server: {
  //   port: 4000 // Set to 4000 or your preferred port
  // },
  resolve: {
    alias: {
      '@mui/material': path.resolve(__dirname, 'node_modules/@mui/material'),
      '@mui/icons-material': path.resolve(__dirname, 'node_modules/@mui/icons-material'),
      '@mui/system': path.resolve(__dirname, 'node_modules/@mui/system'),
      '@emotion/react': path.resolve(__dirname, 'node_modules/@emotion/react'),
      '@emotion/styled': path.resolve(__dirname, 'node_modules/@emotion/styled'),
      'material-ui-popup-state': path.resolve(__dirname, 'node_modules/material-ui-popup-state'),
      'framer-motion': path.resolve(__dirname, 'node_modules/framer-motion')
    }
  }
});
