import {SOURCE_MAPS} from '../../config';
import {defineConfig, mergeConfig} from 'vite';
import baseConfig from '../base/vite.config.js';

export default defineConfig(env => mergeConfig(
  baseConfig('web')(env),
  defineConfig({
    worker: {
      format: 'es',
    },
    build: {
      outDir: './lib/web',
      cssMinify: 'lightningcss',
      cssCodeSplit: true,
      sourcemap: SOURCE_MAPS,
      target: [
        'esnext',
        'safari15',
        'chrome128',
        'firefox128',
        'edge128',
      ],
      rollupOptions: {
        output: {
          chunkFileNames: 'chunks/[hash]/[name].js',
        },
        external: [
          /* React */
          'react',
          'react-dom',
          'react-native-web',
          'react-native-unistyles',
          'react/jsx-runtime',
          /* Vendor */
          '@legendapp/list',
          '@zip.js/zip.js',
          'rmapi-js',
        ],
      },
    },
  }),
));

