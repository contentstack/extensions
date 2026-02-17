import { copyFileSync } from 'fs';
import { resolve } from 'path';
import { defineConfig } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';

export default defineConfig({
  plugins: [
    viteSingleFile(),
    {
      name: 'copy-to-root',
      closeBundle() {
        copyFileSync(
          resolve(__dirname, 'dist/src/index.html'),
          resolve(__dirname, 'index.html')
        );
      },
    },
  ],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: './src/index.html',
    },
    minify: 'false',
    terserOptions: {
      compress: {
        drop_console: false,
      },
    },
  },
});
