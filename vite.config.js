import { join, parse } from 'node:path';
import { defineConfig } from 'vite';
import glob from 'glob';

const src = join(__dirname, 'src');
const html = glob.sync('**/*.html', {
  root: src
});

export default defineConfig({
  root: src,
  build: {
    rollupOptions: {
      input: html.reduce((result, h) => {
        result[parse(h).name] = join(__dirname, h);

        return result;
      }, {})
    },
    outDir: join(__dirname, 'dist')
  },
  server: {
    port: 5052
  }
});
