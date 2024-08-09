// vite.config.ts

import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/main.ts',
      name: 'TyranoVoiceVoxPlugin',
      fileName: (format) => `tyrano-voicevox-plugin.${format}.js`
    },
    rollupOptions: {
      output: {
        globals: {
          TYRANO: 'TYRANO'
        }
      }
    }
  }
});
