// NOTE: we should try an stay in sync with https://github.com/tailwindlabs/headlessui/blob/develop/tailwind.config.js

// const defaultTheme = require('tailwindcss/defaultTheme');

let extensions = 'html,hbs,js,ts,gjs,gts';
let paths = ['./tests/dummy/**/*', './addon/**/*'];

module.exports = {
  content: paths.map((glob) => `${glob}.{${extensions}}`),
  theme: {
    extend: {
      colors: {
        code: {
          green: '#b5f4a5',
          yellow: '#ffe484',
          purple: '#d9a9ff',
          red: '#ff8383',
          blue: '#93ddfd',
          white: '#fff',
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
