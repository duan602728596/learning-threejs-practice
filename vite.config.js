import { promisify } from 'node:util';
import { join, parse } from 'node:path';
import { defineConfig } from 'vite';
import glob from 'glob';

const globPromise = promisify(glob);

export default defineConfig(async function() {
  const src = join(__dirname, 'src');
  const html = await globPromise('**/*.html', {
    root: src
  });
  const htmlInput = html.reduce((result, h) => {
    result[parse(h).name] = join(__dirname, h);

    return result;
  }, {});

  return {
    root: src,
    build: {
      rollupOptions: {
        input: htmlInput
      },
      outDir: join(__dirname, 'dist')
    },
    server: {
      port: 5052
    }
  };
});
