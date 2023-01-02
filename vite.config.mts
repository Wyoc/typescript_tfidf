import { defineConfig } from 'npm:vite'
import vue from 'npm:@vitejs/plugin-vue'
import "npm:vue";
// import electron from 'npm:vite-plugin-electron'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: { transformAssetUrls },
    }),
  ],
  build: {
    target: ['esnext'],
  },
  optimizeDeps: {
    esbuildOptions: {
      target: 'esnext',
    },
  },
});
