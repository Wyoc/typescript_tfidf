import { defineConfig } from 'vite';
import { fileURLToPath } from 'url';
import vue from '@vitejs/plugin-vue'
import electron from 'vite-electron-plugin';
import { customStart } from 'vite-electron-plugin/plugin';
import 'vue';
import pkg from './package.json';

function debounce<Fn extends(...args: any[]) => void>(fn: Fn, delay = 299) {
  // eslint-disable-next-line no-undef
  let t: NodeJS.Timeout;
  return ((...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), delay);
  }) as Fn;
}

const alias = {
  '/@/': fileURLToPath(new URL('./src', import.meta.url)) + '/',
};
const define = {
  __VUE_I18N_FULL_INSTALL__: true,
  __VUE_I18N_LEGACY_API__: false,
  __INTLIFY_PROD_DEVTOOLS__: false,
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  if (mode === 'electron') {
    return {
      plugins: [
        vue({
        }),
        electron({
          include: ['electron'],
          transformOptions: {
            sourcemap: !!process.env.VSCODE_DEBUG,
          },
          // Will start Electron via VSCode Debug
          plugins: process.env.VSCODE_DEBUG
            ? [customStart(debounce(() => console.log(/* For `.vscode/.debug.script.mjs` */'[startup] Electron App')))]
            : undefined,
        }),
      ],
      resolve: {
        alias,
      },
      define,
      build: {
        target: ['esnext'],
      },
      optimizeDeps: {
        esbuildOptions: {
          target: 'esnext',
        },
      },
      server: process.env.VSCODE_DEBUG ? (() => {
        const url = new URL(pkg.debug.env.VITE_DEV_SERVER_URL);
        return {
          host: url.hostname,
          port: +url.port,
        };
      })() : undefined,
    };
  }
  return {
    plugins: [
      vue({
      }),
    ],
    resolve: {
      alias,
    },
    define,
    build: {
      target: ['esnext'],
    },
    optimizeDeps: {
      esbuildOptions: {
        target: 'esnext',
      },
    },
  };
});
