import {SOURCE_MAPS} from '../../config';
import {defineConfig, mergeConfig} from 'vite';
import baseConfig from '../base/vite.config';
import types from 'vite-plugin-dts';

export default defineConfig(env => mergeConfig(
  baseConfig('native')(env),
  defineConfig({
    build: {
      outDir: './lib/native',
      minify: false,
      sourcemap: SOURCE_MAPS,
      rollupOptions: {
        output: {
          entryFileNames: (info) => info.name.includes('babel-plugin-')
            ? '[name].cjs'
            : '[name].js',
          manualChunks: undefined,
        },
        external: [
          /* Node */
          'fs',
          'fs/promises',
          /* React */
          'react',
          'react-dom',
          'react-native',
          'react-native-unistyles',
          'react/jsx-runtime',
          /* Vendor */
          '@candlefinance/faster-image',
          '@legendapp/list',
          '@zip.js/zip.js',
          '@react-native-community/checkbox',
          '@react-native-community/netinfo',
          '@react-native-community/slider',
          '@react-native-picker/picker',
          'burnt',
          'react-native-gesture-handler',
          'react-native-linear-gradient',
          'react-native-mmkv',
          'react-native-readium',
          'react-native-skottie',
          'react-native-svg',
          'react-native-video',
          'rmapi-js',
        ],
      },
    },
    plugins: [
      types({
        exclude: ['lib', 'configs', 'docs', 'node_modules'],
        outDir: './lib/types',
        insertTypesEntry: true,
      }),
    ],
  }),
));

