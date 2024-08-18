import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

const config = {
  preprocess: vitePreprocess(),
  compilerOptions: {
    css: "injected"
  },
};

export default config;
