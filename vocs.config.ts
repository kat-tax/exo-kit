import {defineConfig} from 'vocs';
import {version} from './package.json';

export default defineConfig({
  title: 'EXO KIT',
  sponsors: [
    // Noone yet. Maybe You?
    // https://github.com/sponsors/theultdev
  ],
  socials: [
    {
      icon: 'github',
      link: 'https://github.com/kat-tax/exo',
    },
    {
      icon: 'discord',
      link: 'https://discord.kat.tax/',
    },
    {
      icon: 'x',
      link: 'https://x.com/theultdev',
    },
  ],
  topNav: [
    {
      text: 'EXO UI',
      link: 'https://exo-ui.com/',
    },
    {
      text: `v${version}`,
      items: [
        {
          text: 'Changelog',
          link: 'https://github.com/kat-tax/exo-kit/blob/master/CHANGELOG.md',
        },
        {
          text: 'Package',
          link: 'https://www.npmjs.com/package/react-exo',
        },
        {
          text: 'License',
          link: 'https://github.com/kat-tax/exo-kit/blob/master/LICENSE.md',
        },
      ],
    },
  ],
  sidebar: [
    {
      text: 'Guides',
      collapsed: false,
      items: [
        {
          link: '/overview',
          text: 'Overview',
        },
        {
          link: '/installation',
          text: 'Installation',
        },
      ],
    },
    {
      text: 'Assets',
      collapsed: false,
      items: [
        {
          link: '/assets/icon',
          text: 'Icon',
        },
        {
          link: '/assets/code',
          text: 'Code',
        },
        {
          link: '/assets/markdown',
          text: 'Markdown',
        },
        {
          link: '/assets/image',
          text: 'Image',
        },
        {
          link: '/assets/video',
          text: 'Video',
        },
        // {
        //   link: '/assets/audio',
        //   text: 'Audio',
        // },
        {
          link: '/assets/lottie',
          text: 'Lottie',
        },
        {
          link: '/assets/rive',
          text: 'Rive',
        },
        {
          link: '/assets/game',
          text: 'Game',
        },
        {
          link: '/assets/book',
          text: 'Book',
        },
        {
          link: '/assets/map',
          text: 'Map',
        },
        {
          link: '/assets/pdf',
          text: 'PDF',
        },
      ],
    },
    {
      text: 'Layout',
      collapsed: false,
      items: [
        {
          link: '/layout/motion',
          text: 'Motion',
        },
        {
          link: '/layout/skeleton',
          text: 'Skeleton',
        },
        // {
        //   link: '/layout/navigation',
        //   text: 'Navigation',
        // },
      ],
    },
    {
      text: 'Widgets',
      collapsed: false,
      items: [
        {
          link: '/widgets/slider',
          text: 'Slider',
        },
        {
          link: '/widgets/picker',
          text: 'Picker',
        },
        {
          link: '/widgets/switch',
          text: 'Switch',
        },
      ],
    },
    {
      text: 'Services',
      collapsed: false,
      items: [
        {
          link: '/services/device',
          text: 'Device',
        },
        // {
        //   link: '/services/toast',
        //   text: 'Toast',
        // },
        // {
        //   link: '/services/redux',
        //   text: 'Redux',
        // },
        {
          link: '/services/kv',
          text: 'KV Store',
        },
        {
          link: '/services/fs',
          text: 'File System',
        },
      ],
    },
  ],
  theme: {
    variables: {
      color: {
        /** Header Text */
        title: {
          light: '#000',
          dark: '#fff',
        },
        /** Main Border */
        border: {
          light: '#e0e0e0',
          dark: '#141414',
        },
        /** Sidebar */
        backgroundDark: {
          light: '#fff',
          dark: '#000',
        },
        /** Main Page */
        background: {
          light: '#fff',
          dark: '#000',
        },
        /** Code Blocks */
        background2: {
          light: '#fff',
          dark: '#000',
        },
        /** Next Page, Hover Button, etc. */
        background3: {
          light: '#f5f5f5',
          dark: '#0a0a0a',
        },
        /** Buttons, Code Block Headers, etc. */
        background4: {
          light: '#f5f5f5',
          dark: '#131313',
        },
        background5: {
          light: '#f5f5f5',
          dark: '#131313',
        },
        // backgroundAccent: {
        //   light: 'pink',
        //   dark: 'pink',
        // },
        // backgroundAccentHover: {
        //   light: 'pink',
        //   dark: 'pink',
        // },
        // backgroundAccentText: {
        //   light: 'pink',
        //   dark: 'pink',
        // },
        // backgroundBlueTint: {
        //   light: 'blue',
        //   dark: 'blue',
        // },
        // backgroundGreenTint: {
        //   light: 'green',
        //   dark: 'green',
        // },
        // backgroundGreenTint2: {
        //   light: 'green',
        //   dark: 'green',
        // },
        // backgroundIrisTint: {
        //   light: 'purple',
        //   dark: 'purple',
        // },
        // backgroundRedTint: {
        //   light: 'red',
        //   dark: 'red',
        // },
        // backgroundRedTint2: {
        //   light: 'red',
        //   dark: 'red',
        // },
        // backgroundYellowTint: {
        //   light: 'yellow',
        //   dark: 'yellow',
        // },
      },
    },
  },
  font: {
    google: 'Fira Code',
  },
  markdown: {
    code: {
      themes: {
        light: 'light-plus',
        dark: 'dark-plus',
      }
    }
  },
  twoslash: {
    compilerOptions: {
      skipLibCheck: true,
      moduleResolution: 100,
    }
  },
  vite: {
    resolve: {
      extensions: [
        '.web.tsx',
        '.web.jsx',
        '.web.ts',
        '.web.js',
        '.mjs',
        '.mts',
        '.ts',
        '.tsx',
        '.js',
        '.jsx',
        '.json',
      ],
      alias: {
        'react-native': 'react-native-web',
      },
    },
  },
  rootDir: './docs',
});
