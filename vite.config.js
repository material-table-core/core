import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';

const src = (p) => fileURLToPath(new URL(`./src/${p}`, import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@components': src('components'),
      '@store': src('store'),
      '@utils': src('utils')
    }
  },
  build: {
    lib: {
      entry: src('index.jsx'),
      formats: ['es']
    },
    outDir: 'dist',
    minify: false,
    rollupOptions: {
      // externalize every bare import; aliases stay internal
      external: (id) =>
        !id.startsWith('.') &&
        !id.startsWith('/') &&
        !/^@(components|store|utils)(\/|$)/.test(id),
      output: {
        preserveModules: true,
        preserveModulesRoot: 'src',
        entryFileNames: '[name].js'
      }
    }
  },
  test: {
    environment: 'jsdom',
    globals: true,
    clearMocks: true,
    setupFiles: ['./vitest.setup.js'],
    include: ['__tests__/**/*.test.{js,jsx}'],
    coverage: {
      include: ['src/**'],
      reportsDirectory: './__tests__/coverage'
    }
  }
});
