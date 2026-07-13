import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 1899,
  },
  resolve: {
    alias: {
      // Also update jsconfig.json
      assets: path.resolve(__dirname, './src/assets'),
      db: path.resolve(__dirname, './src/db'),
      checklist: path.resolve(__dirname, './src/checklist'),
      citation: path.resolve(__dirname, './src/citation'),
      event: path.resolve(__dirname, './src/event'),
      file: path.resolve(__dirname, './src/file'),
      misc: path.resolve(__dirname, './src/misc'),
      notation: path.resolve(__dirname, './src/notation'),
      object: path.resolve(__dirname, './src/object'),
      person: path.resolve(__dirname, './src/person'),
      routePaths: path.resolve(__dirname, './src/routePaths'),
      session: path.resolve(__dirname, './src/session'),
      shared: path.resolve(__dirname, './src/shared'),
      source: path.resolve(__dirname, './src/source'),
      staticDb: path.resolve(__dirname, './src/database/staticDb'),
      story: path.resolve(__dirname, './src/story'),
      tag: path.resolve(__dirname, './src/tag'),
    },
  },
});
