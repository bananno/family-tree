import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 1899,
  },
  resolve: {
    alias: {
      assets: path.resolve(__dirname, './src/assets'),
      db: path.resolve(__dirname, './src/db'),
      checklist: path.resolve(__dirname, './src/checklist'),
      citation: path.resolve(__dirname, './src/citation'),
      event: path.resolve(__dirname, './src/event'),
      file: path.resolve(__dirname, './src/file'),
      misc: path.resolve(__dirname, './src/misc'),
      notation: path.resolve(__dirname, './src/notation'),
      person: path.resolve(__dirname, './src/person'),
      shared: path.resolve(__dirname, './src/shared'),
      source: path.resolve(__dirname, './src/source'),
      staticDb: path.resolve(__dirname, './src/database/staticDb'),
      story: path.resolve(__dirname, './src/story'),
      tag: path.resolve(__dirname, './src/tag'),
    },
  },
});
