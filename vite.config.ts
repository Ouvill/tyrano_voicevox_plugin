// vite.config.ts

import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    minify: false,
    lib: {
      entry: 'src/main.ts',
      name: 'TyranoVoiceVoxPlugin',
      fileName: (format) => `tyrano-voicevox-plugin.${format}.js`
    },
    rollupOptions: {
      output: {
        compact: true,
        generatedCode: {
          symbols: false
        },
        globals: {
          TYRANO: 'TYRANO'
        }
      }
    }
  }
});
