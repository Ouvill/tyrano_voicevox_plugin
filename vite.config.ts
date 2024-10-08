// vite.config.ts

import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";
import { svelte } from "@sveltejs/vite-plugin-svelte";

export default defineConfig({
  plugins: [
    svelte({}),
    viteStaticCopy({
      targets: [
        {
          src: "README.md",
          dest: "",
        },
        {
          src: "README.md",
          dest: "",
          rename: "README.txt",
        },
        {
          src: "LICENSE",
          dest: "",
        },
      ],
    }),
  ],
  build: {
    minify: false,
    lib: {
      entry: "src/main.ts",
      name: "TyranoVoiceVoxPlugin",
      fileName: (format) => `tyrano-voicevox-plugin.${format}.js`,
    },
    rollupOptions: {
      output: {
        compact: true,
        generatedCode: {
          symbols: false,
        },
        globals: {
          TYRANO: "TYRANO",
        },
      },
    },
  },
});
