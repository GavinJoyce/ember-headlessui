// NOTE: we should try an stay in sync with https://github.com/tailwindlabs/headlessui/blob/develop/tailwind.config.js

// const defaultTheme = require('tailwindcss/defaultTheme');

let extensions = 'html,hbs,js,ts,gjs,gts';
let paths = ['./tests/dummy/**/*', './addon/**/*']

module.exports = {
  content: paths.map(glob => `${glob}.{${extensions}}`),
  plugins: [require('@tailwindcss/typography')],
};
